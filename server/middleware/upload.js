import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only specific file types
const fileFilter = (_req, file, cb) => {
  const allowedTypes = {
    // Documents
    'application/pdf': true,
    // Videos
    'video/mp4': true,
    'video/mpeg': true,
    'video/quicktime': true,
    'video/x-msvideo': true, // avi
    // Images
    'image/jpeg': true,
    'image/png': true,
    'image/webp': true,
    'image/gif': true,
    'image/svg+xml': true,
    'image/heic': true,
    'image/heif': true,
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: PDF, video (mp4,mpeg,quicktime,avi) and images (jpeg,png,webp,gif,svg,heic,heif).'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

export const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};
