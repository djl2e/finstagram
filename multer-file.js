const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const { MulterError } = multer;

// s3 settings and credentials
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

// storage bucket and image filename for key
const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET,
  key(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// file type has to be image
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes('image/')) {
    return cb(new MulterError('file has to be an image'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
