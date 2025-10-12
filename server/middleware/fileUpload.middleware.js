import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PassThrough } from 'stream';

const s3 = new S3Client({
    credentials: {
        secretAccessKey: process.env.S3_SECRET_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY
    },
    region: process.env.S3_REGION,
    requestHandler: {
        requestTimeout: 900000, // 15 minutes
        connectionTimeout: 900000 // 15 minutes
    }
});

// Custom storage engine with progress tracking
class S3StorageWithProgress {
    constructor(opts) {
        this.s3 = opts.s3;
        this.bucket = opts.bucket;
    }

    _handleFile(req, file, cb) {
        // Get creator ID from request
        const userId = req.creator.id || req.creator._id;
        const fileEXT = file.originalname.split('.').pop();
        const timeStamp = Date.now().toString();
        const filePath = `videos/${userId}/${timeStamp}.${fileEXT}`;

        console.log(`Starting upload: ${file.originalname}`);
        console.log(`Creator ID: ${userId}`);

        // Create a pass-through stream to track progress
        const passThrough = new PassThrough();
        let uploadedBytes = 0;
        let totalBytes = 0;
        let lastLoggedPercent = 0;

        // Track the total size from the stream
        file.stream.on('data', (chunk) => {
            totalBytes += chunk.length;
            passThrough.write(chunk);
        });

        file.stream.on('end', () => {
            passThrough.end();
        });

        file.stream.on('error', (err) => {
            passThrough.destroy(err);
        });

        const upload = new Upload({
            client: this.s3,
            params: {
                Bucket: this.bucket,
                Key: filePath,
                Body: passThrough,
                ContentType: file.mimetype,
                Metadata: { 
                    fieldName: file.fieldname,
                    originalName: file.originalname,
                    uploadedBy: userId
                }
            },
            queueSize: 4, // concurrent part uploads
            partSize: 5 * 1024 * 1024, // 5MB parts
            leavePartsOnError: false
        });

        // Track upload progress
        upload.on('httpUploadProgress', (progress) => {
            uploadedBytes = progress.loaded || 0;
            
            // Use totalBytes if progress.total is not available
            const total = progress.total || totalBytes;
            
            if (total > 0) {
                const percentComplete = Math.round((uploadedBytes / total) * 100);
                
                // Log every 10% to avoid console spam
                if (percentComplete >= lastLoggedPercent + 10 || percentComplete === 100) {
                    const loadedMB = (uploadedBytes / (1024 * 1024)).toFixed(2);
                    const totalMB = (total / (1024 * 1024)).toFixed(2);
                    console.log(`Uploading ${file.originalname}: ${percentComplete}% (${loadedMB}MB/${totalMB}MB)`);
                    lastLoggedPercent = percentComplete;
                }
            } else {
                // If total is still unknown, just show uploaded bytes
                const loadedMB = (uploadedBytes / (1024 * 1024)).toFixed(2);
                console.log(`Uploading ${file.originalname}: ${loadedMB}MB uploaded...`);
            }
        });

        upload.done()
            .then((data) => {
                console.log(`Upload complete: ${file.originalname}`);
                console.log(`S3 Location: ${data.Location}`);
                
                cb(null, {
                    bucket: this.bucket,
                    key: filePath,
                    location: data.Location,
                    etag: data.ETag,
                    size: totalBytes,
                    fieldname: file.fieldname,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                });
            })
            .catch((err) => {
                console.error(`Upload failed: ${file.originalname}`, err.message);
                cb(err);
            });
    }

    _removeFile(req, file, cb) {
    // Optional cleanup logic — or just call cb() if not needed
    cb(null);
    }

}

const storageWithProgress = new S3StorageWithProgress({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webm/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Only images and videos allowed (jpeg, jpg, png, gif, mp4, mov, avi, mkv, webm)!');
    }
}

// Use custom storage with progress tracking
const upload = multer({
    storage: storageWithProgress,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    }
});

const uploadMiddleWare = upload;

export default uploadMiddleWare;