#!/usr/bin/env node
import transcodeToHls from '../utils/transcodeToHls.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--bucket') out.bucket = args[++i];
    else if (a === '--key') out.key = args[++i];
    else if (a === '--videoId') out.videoId = args[++i];
  }
  return out;
}

async function main() {
  const { bucket, key, videoId } = parseArgs();
  if (!bucket || !key) {
    console.error('Usage: node transcode-to-hls.js --bucket <bucket> --key <s3-key> [--videoId <id>]');
    process.exit(1);
  }

  try {
    console.log('Starting transcode for', key);
    const res = await transcodeToHls({ bucket, key, videoId });
    console.log('Transcode finished:', res.masterUrl);
    process.exit(0);
  } catch (err) {
    console.error('Transcode failed:', err);
    process.exit(2);
  }
}

main();
