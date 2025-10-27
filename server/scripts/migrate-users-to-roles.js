#!/usr/bin/env node
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

// Legacy users collection is accessed via native driver; no User model import.
import Student from '../models/Student.js';
import Creator from '../models/Creator.js';
import Business from '../models/Business.js';
import Admin from '../models/Admin.js';

import Order from '../models/Order.js';
import Enrollment from '../models/Enrollment.js';
import Content from '../models/Content.js';
import Revenue from '../models/Revenue.js';
import TemplateSelection from '../models/TemplateSelection.js';

const roleModel = (role) => {
  if (role === 'student') return Student;
  if (role === 'creator') return Creator;
  if (role === 'business') return Business;
  if (role === 'admin') return Admin;
  return null;
};

// Load legacy users directly from the 'users' collection if it exists
async function loadLegacyUsers() {
  const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
  if (!collections || collections.length === 0) {
    console.log('[migrate] users collection not found; skipping user migration step');
    return [];
  }
  const docs = await mongoose.connection.db.collection('users').find({}).toArray();
  return docs.map((u) => ({
    _id: u._id,
    name: u.name || '',
    email: (u.email || '').toLowerCase(),
    password: u.password || '',
    avatarUrl: u.avatarUrl || '',
    roles: Array.isArray(u.roles) && u.roles.length ? u.roles : ['student'],
  }));
}

function oid(x) {
  return typeof x === 'string' ? new mongoose.Types.ObjectId(x) : x;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');

  console.log(`[migrate] starting. dryRun=${dryRun}`);
  await connectDB();

  const users = await loadLegacyUsers();
  console.log(`[migrate] loaded users: ${users.length}`);

  const maps = {
    student: new Map(), // oldUserId -> newStudentId
    creator: new Map(),
    business: new Map(),
    admin: new Map(),
  };

  let createdCounts = { student: 0, creator: 0, business: 0, admin: 0 };

  // 1) Create role-specific accounts
  for (const u of users) {
    const roles = Array.isArray(u.roles) && u.roles.length ? u.roles : ['student'];
    for (const role of roles) {
      const Model = roleModel(role);
      if (!Model) continue;
      const existing = await Model.findOne({ email: u.email.toLowerCase() }).lean();
      if (existing) {
        maps[role].set(String(u._id), String(existing._id));
        continue;
      }
      if (!dryRun) {
        const created = await Model.create({
          name: u.name,
          email: u.email.toLowerCase(),
          password: u.password,
          avatarUrl: u.avatarUrl || '',
        });
        maps[role].set(String(u._id), String(created._id));
        createdCounts[role]++;
      } else {
        // simulate id mapping in dry-run
        maps[role].set(String(u._id), `SIMULATED_${role}_ID_${String(u._id)}`);
        createdCounts[role]++;
      }
    }
  }

  console.log('[migrate] created role accounts:', createdCounts);

  // 2) Update cross-references
  const updates = { orders: 0, enrollments: 0, contents: 0, revenues: 0, templateSelections: 0 };

  // Orders: map userId (old User) -> Student id
  {
    const oldUserIds = Array.from(maps.student.keys()).map(oid);
    if (oldUserIds.length) {
      const cursor = Order.find({ userId: { $in: oldUserIds } }).cursor();
      for await (const ord of cursor) {
        const mapped = maps.student.get(String(ord.userId));
        if (mapped) {
          if (!dryRun) {
            ord.userId = oid(mapped);
            await ord.save();
          }
          updates.orders++;
        }
      }
    }
  }

  // Enrollments: map userId (old User) -> Student id
  {
    const oldUserIds = Array.from(maps.student.keys()).map(oid);
    if (oldUserIds.length) {
      const cursor = Enrollment.find({ userId: { $in: oldUserIds } }).cursor();
      for await (const en of cursor) {
        const mapped = maps.student.get(String(en.userId));
        if (mapped) {
          if (!dryRun) {
            en.userId = oid(mapped);
            try {
              await en.save();
            } catch (e) {
              // ignore duplicate key errors on unique index
              if (!(e && String(e.message).toLowerCase().includes('duplicate key'))) throw e;
            }
          }
          updates.enrollments++;
        }
      }
    }
  }

  // Content: map creatorId (old User) -> Creator id
  {
    const oldUserIds = Array.from(maps.creator.keys()).map(oid);
    if (oldUserIds.length) {
      const cursor = Content.find({ creatorId: { $in: oldUserIds } }).cursor();
      for await (const c of cursor) {
        const mapped = maps.creator.get(String(c.creatorId));
        if (mapped) {
          if (!dryRun) {
            c.creatorId = oid(mapped);
            await c.save();
          }
          updates.contents++;
        }
      }
    }
  }

  // Revenue: map creatorId (old User) -> Creator id
  {
    const oldUserIds = Array.from(maps.creator.keys()).map(oid);
    if (oldUserIds.length) {
      const cursor = Revenue.find({ creatorId: { $in: oldUserIds } }).cursor();
      for await (const r of cursor) {
        const mapped = maps.creator.get(String(r.creatorId));
        if (mapped) {
          if (!dryRun) {
            r.creatorId = oid(mapped);
            await r.save();
          }
          updates.revenues++;
        }
      }
    }
  }

  // TemplateSelection: rename userId -> businessId via mapping of old User -> Business
  {
    // fetch any docs that still have userId field present
    const cursor = TemplateSelection.find({ userId: { $exists: true } }).cursor();
    for await (const t of cursor) {
      const mapped = maps.business.get(String(t.userId));
      if (mapped) {
        if (!dryRun) {
          t.set('businessId', oid(mapped));
          t.set('userId', undefined);
          // direct update to unset unknown field
          await TemplateSelection.updateOne({ _id: t._id }, { $set: { businessId: oid(mapped) }, $unset: { userId: '' } });
        }
        updates.templateSelections++;
      }
    }
  }

  console.log('[migrate] cross-reference updates:', updates);

  // 3) Optionally drop users collection (manual step recommended)
  if (args.has('--drop-users')) {
    if (!dryRun) {
      await mongoose.connection.db.dropCollection('users').catch(() => {});
      console.log('[migrate] dropped users collection');
    } else {
      console.log('[migrate] would drop users collection (dry-run)');
    }
  } else {
    console.log('[migrate] NOTE: users collection not dropped. Run with --drop-users to drop after verifying.');
  }

  await mongoose.connection.close();
  console.log('[migrate] done.');
}

main().catch((e) => {
  console.error('[migrate] fatal error', e);
  process.exit(1);
});
