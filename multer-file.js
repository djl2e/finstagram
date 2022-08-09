const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');

dotenv.config();

const { MulterError } = multer;

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_KEY_ID,
  region: 'us-east-1',
});
const s3 = new aws.S3();

const storage = multerS3({
  s3,
  acl: 'public-read',
  bucket: 'finstagram-images',
  key(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes('image/')) {
    return cb(new MulterError('file has to be an image'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
