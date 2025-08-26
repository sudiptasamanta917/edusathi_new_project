import Razorpay from 'razorpay';
import crypto from 'crypto';
import Center from '../models/Center.js';
import Business from '../models/Business.js';
import BusinessPurchase from '../models/BusinessPurchase.js';

function computeExpiresAt(plan, durationDays) {
  const now = new Date();

  const daysNum = Number(durationDays);
  if (!Number.isNaN(daysNum) && daysNum > 0) {
    const d = new Date(now);
    d.setDate(d.getDate() + Math.floor(daysNum));
    return d;
  }

  if (typeof plan === 'string') {
    const lower = plan.toLowerCase();
    const matchDays = lower.match(/(\d+)\s*day/);
    if (matchDays && matchDays[1]) {
      const d = new Date(now);
      d.setDate(d.getDate() + parseInt(matchDays[1], 10));
      return d;
    }

    // Parse patterns like "3 months", "6 month"
    const matchMonths = lower.match(/(\d+)\s*month/);
    if (matchMonths && matchMonths[1]) {
      const d = new Date(now);
      const months = parseInt(matchMonths[1], 10);
      d.setDate(d.getDate() + months * 30);
      return d;
    }

    // Parse patterns like "2 years", "1 year"
    const matchYears = lower.match(/(\d+)\s*year/);
    if (matchYears && matchYears[1]) {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() + parseInt(matchYears[1], 10));
      return d;
    }

    if (lower.includes('weekly') || lower.includes('week')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 7);
      return d;
    }
    if (lower.includes('monthly') || lower.includes('month')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 30);
      return d;
    }
    if (lower.includes('quarter') || lower.includes('quarterly')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 90);
      return d;
    }
    if (lower.includes('half') && lower.includes('year')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 182);
      return d;
    }
    if (lower.includes('yearly') || lower.includes('year')) {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() + 1);
      return d;
    }
  }

  const d = new Date(now);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

function getKeys() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return { key_id, key_secret };
}

function getRazorpay() {
  const keys = getKeys();
  if (!keys) return null;
  return new Razorpay(keys);
}

export const createPaymentOrder = async (req, res) => {
  try {
    const rp = getRazorpay();
    if (!rp) {
      return res.status(500).json({ success: false, error: 'Payment gateway keys not configured' });
    }
    const { amount, institute, owner, email, plan, domain, durationDays, billing } = req.body || {};

    if (!amount || !institute || !owner || !email || !plan || !domain) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const order = await rp.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: receipt,
      notes: { institute, owner, email, plan, domain, durationDays: durationDays ?? null, billing: billing ?? null, timestamp: new Date().toISOString() },
    });

    // Persist a purchase record with status 'created'
    try {
      const authBizId = req.user?.role === 'business' ? req.user._id : null;
      const bizByEmail = email ? await Business.findOne({ email: String(email).toLowerCase() }).lean() : null;
      await BusinessPurchase.findOneAndUpdate(
        { razorpay_order_id: order.id },
        {
          $set: {
            businessId: authBizId || (bizByEmail ? bizByEmail._id : null),
            email: String(email || '').toLowerCase(),
            instituteName: institute || '',
            ownerName: owner || '',
            domain: domain || '',
            plan: plan || '',
            amount: Number(order.amount) || Number(amount) || 0,
            currency: order.currency || 'INR',
            durationDays: durationDays ?? null,
            billing: billing ?? null,
            status: 'created',
          },
        },
        { upsert: true, new: true }
      );
    } catch (persistErr) {
      console.error('Failed to persist business purchase (create):', persistErr);
    }

    res.json({ success: true, order: { id: order.id, amount: Number(order.amount), currency: order.currency, receipt: order.receipt || '' } });
  } catch (error) {
    console.error('Payment order creation failed:', error?.statusCode, error?.error || error);
    res.status(500).json({ success: false, error: error?.error?.description || error?.message || 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const keys = getKeys();
    const rp = getRazorpay();
    if (!keys || !rp) {
      return res.status(500).json({ success: false, error: 'Payment gateway keys not configured' });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    const expectedSignature = crypto
      .createHmac('sha256', keys.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (razorpay_signature === expectedSignature) {
      const orderDetails = await rp.orders.fetch(razorpay_order_id);
      if (!orderDetails) throw new Error('Order not found');

      const notes = orderDetails.notes || {};
      const institute = notes.institute;
      const owner = notes.owner;
      const email = notes.email;
      const plan = notes.plan;
      const domain = notes.domain;
      const durationDays = notes.durationDays;

      if (!institute || !owner || !email || !plan || !domain) {
        throw new Error('Missing required fields in order notes');
      }

      const existingCenter = await Center.findOne({ $or: [{ domain }, { email }] });
      if (existingCenter) {
        // Renewal or plan change: extend from current expiry if active, else from now
        const plannedExpiryFromNow = computeExpiresAt(plan, durationDays);
        const durationMs = plannedExpiryFromNow.getTime() - new Date().getTime();
        const base = existingCenter.expiresAt && new Date(existingCenter.expiresAt) > new Date()
          ? new Date(existingCenter.expiresAt)
          : new Date();
        const newExpiry = new Date(base.getTime() + Math.max(0, durationMs));

        existingCenter.plan = plan;
        existingCenter.razorpay_order_id = razorpay_order_id;
        existingCenter.razorpay_payment_id = razorpay_payment_id;
        existingCenter.subscriptionStartAt = base;
        existingCenter.expiresAt = newExpiry;
        await existingCenter.save();

        // Update purchase record to 'paid' and link center/business
        try {
          const authBizId = req.user?.role === 'business' ? req.user._id : null;
          const biz = authBizId ? await Business.findById(authBizId).lean() : (email ? await Business.findOne({ email: String(email).toLowerCase() }).lean() : null);
          await BusinessPurchase.findOneAndUpdate(
            { razorpay_order_id },
            { $set: { status: 'paid', razorpay_payment_id, centerId: existingCenter._id, businessId: (authBizId || (biz ? biz._id : null)), plan, domain } },
            { upsert: true }
          );
        } catch (persistErr) {
          console.error('Failed to persist business purchase (verify-update):', persistErr);
        }

        return res.json({ success: true, message: 'Payment verified and subscription updated successfully', payment_id: razorpay_payment_id, order_id: razorpay_order_id, center: existingCenter, updated: true });
      }

      const expiresAt = computeExpiresAt(plan, durationDays);

      const newCenter = new Center({
        instituteName: institute,
        ownerName: owner,
        email,
        domain,
        plan,
        razorpay_order_id,
        razorpay_payment_id,
        subscriptionStartAt: new Date(),
        expiresAt,
      });

      await newCenter.save();

      // Update purchase record to 'paid' and link new center/business
      try {
        const authBizId = req.user?.role === 'business' ? req.user._id : null;
        const biz = authBizId ? await Business.findById(authBizId).lean() : (email ? await Business.findOne({ email: String(email).toLowerCase() }).lean() : null);
        await BusinessPurchase.findOneAndUpdate(
          { razorpay_order_id },
          { $set: { status: 'paid', razorpay_payment_id, centerId: newCenter._id, businessId: (authBizId || (biz ? biz._id : null)), plan, domain } },
          { upsert: true }
        );
      } catch (persistErr) {
        console.error('Failed to persist business purchase (verify-create):', persistErr);
      }

      res.json({ success: true, message: 'Payment verified and institute created successfully', payment_id: razorpay_payment_id, order_id: razorpay_order_id, center: newCenter });
    } else {
      // Mark purchase as failed if we have an order id
      try {
        if (razorpay_order_id) {
          await BusinessPurchase.findOneAndUpdate(
            { razorpay_order_id },
            { $set: { status: 'failed' } },
            { upsert: true }
          );
        }
      } catch (persistErr) {
        console.error('Failed to persist business purchase (failed):', persistErr);
      }
      res.status(400).json({ success: false, error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ success: false, error: error.message || 'Payment verification failed' });
  }
};

export const getPaymentConfig = (_req, res) => {
  res.json({ key_id: process.env.RAZORPAY_KEY_ID || null, configured: Boolean(process.env.RAZORPAY_KEY_ID) });
};

// List purchases for the authenticated business
export const getMyBusinessPurchases = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'business') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const businessId = req.user._id;
    const biz = await Business.findById(businessId).lean();
    const email = biz?.email || null;

    const query = email
      ? { $or: [ { businessId }, { email: String(email).toLowerCase() } ] }
      : { businessId };

    const purchases = await BusinessPurchase.find(query)
      .populate('centerId', 'instituteName domain plan expiresAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, purchases });
  } catch (e) {
    console.error('getMyBusinessPurchases failed:', e);
    res.status(500).json({ success: false, error: 'Failed to fetch purchases' });
  }
};
