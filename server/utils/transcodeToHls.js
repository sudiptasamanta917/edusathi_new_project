import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import Video from '../models/video.model.js';

const region = process.env.S3_REGION || process.env.AWS_REGION || 'ap-south-1';

function streamToFile(stream, filePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);
    stream.on('error', reject);
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

async function uploadDirToS3(s3Client, bucket, baseKey, dirPath) {
  const uploadedKeys = [];
  // Walk directory recursively
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const child = await uploadDirToS3(s3Client, bucket, `${baseKey}/${entry.name}`, full);
      uploadedKeys.push(...child);
      continue;
    }

    const relPath = path.relative(dirPath, full);
    const uploadKey = `${baseKey}/${entry.name}`;

    const fileStream = fs.createReadStream(full);
    const contentType = entry.name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : (entry.name.endsWith('.ts') ? 'video/MP2T' : 'application/octet-stream');

    const s3Upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucket,
        Key: uploadKey,
        Body: fileStream,
        ContentType: contentType
      }
    });
    await s3Upload.done();
    uploadedKeys.push(uploadKey);
  }
  return uploadedKeys;
}

export async function transcodeToHls({ bucket, key, videoId }) {
  if (!bucket || !key) throw new Error('bucket and key required');

  const s3Client = new S3Client({ region });

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'transcode-'));
  const inputPath = path.join(tmpRoot, 'input' + path.extname(key));
  const streamsDir = path.join(tmpRoot, 'streams');
  fs.mkdirSync(streamsDir, { recursive: true });

  try {
    // Download source
    const getCmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const data = await s3Client.send(getCmd);
    const bodyStream = data.Body;
    await streamToFile(bodyStream, inputPath);

    // ffmpeg args
    const ffmpegArgs = [
      '-y',
      '-i', inputPath,
      '-map', '0:v', '-map', '0:a',
      '-c:a', 'aac', '-ar', '48000', '-b:a', '128k',
      '-c:v:0', 'libx264', '-b:v:0', '5000k', '-s:v:0', '1920x1080', '-preset', 'fast',
      '-c:v:1', 'libx264', '-b:v:1', '3000k', '-s:v:1', '1280x720', '-preset', 'fast',
      '-c:v:2', 'libx264', '-b:v:2', '1500k', '-s:v:2', '854x480', '-preset', 'fast',
      '-var_stream_map', 'v:0,a:0 v:1,a:0 v:2,a:0',
      '-f', 'hls',
      '-hls_time', '6',
      '-hls_playlist_type', 'vod',
      '-master_pl_name', path.join(streamsDir, 'master.m3u8'),
      '-hls_segment_filename', path.join(streamsDir, 'stream_%v_segment_%03d.ts'),
      path.join(streamsDir, 'stream_%v.m3u8')
    ];

    await new Promise((resolve, reject) => {
      const proc = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'inherit', 'inherit'] });
      proc.on('error', (err) => reject(err));
      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('ffmpeg exited with code ' + code));
      });
    });

    // Upload to S3
    const baseName = path.basename(key, path.extname(key));
    const dirName = path.posix.dirname(key);
    const uploadBaseKey = `${dirName}/${baseName}/hls`;

    const uploadedKeys = await uploadDirToS3(s3Client, bucket, uploadBaseKey, streamsDir);
    const masterKey = uploadedKeys.find(k => k.endsWith('master.m3u8'));
    const masterUrl = masterKey ? `https://s3.${region}.amazonaws.com/${bucket}/${masterKey}` : null;

    if (videoId) {
      const update = { hlsProcessing: false };
      if (masterUrl) {
        update.hlsUrl = masterUrl;
        update.hlsReadyAt = new Date();
        update.hlsError = null;
      } else {
        update.hlsError = 'No master.m3u8 found after transcode';
      }
      try { await Video.findByIdAndUpdate(videoId, update); } catch (e) { console.error('Failed to update Video doc', e); }
    }

    fs.rmSync(tmpRoot, { recursive: true, force: true });
    return { masterUrl, uploadedKeys };
  } catch (err) {
    console.error('transcodeToHls error:', err);
    if (videoId) {
      try { await Video.findByIdAndUpdate(videoId, { hlsProcessing: false, hlsError: String(err) }); } catch (e) {}
    }
    try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch (e) {}
    throw err;
  }
}

export default transcodeToHls;
