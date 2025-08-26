import 'dotenv/config';
import connectDB from '../db.js';
import Content from '../models/Content.js';

async function run() {
  await connectDB();

  const count = await Content.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped: ${count} contents already exist.`);
    process.exit(0);
  }

  await Content.insertMany([
    {
      title: 'Mastering Algebra - PDF Notes',
      description: 'Comprehensive notes for high-school algebra with examples.',
      type: 'pdf',
      price: 199,
      businessName: 'MathGenius Academy',
      resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      title: 'Physics Kinematics - Video Lecture',
      description: 'Focused session on motion in 1D and 2D with solved problems.',
      type: 'video',
      price: 299,
      businessName: 'Physica Labs',
      resourceUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
    {
      title: 'Live Doubt Solving - Sunday 7PM',
      description: 'Weekly live doubt-solving session with our instructors.',
      type: 'live',
      price: 149,
      businessName: 'Edusathi Live',
      liveLink: 'https://meet.google.com/lookup/edusathi-live-demo',
    },
  ]);

  console.log('Seeded sample contents ✔');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
