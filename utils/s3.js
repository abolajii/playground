const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
require("dotenv").config();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFile = (file) => {
  const readStream = fs.createReadStream(file.path);
  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Body: readStream,
    Key: file.originalname,
  };

  return s3.upload(params).promise();
};

const downloadFile = (file) => {
  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: file,
  };

  return s3.getObject(params).createReadStream();
};

const deleteFile = (file) => {
  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: file,
  };

  return s3.deleteObject(params).promise();
};

module.exports = { uploadFile, downloadFile, deleteFile };
