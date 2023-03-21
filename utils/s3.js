require("dotenv").config();

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const bucket = process.env.MY_AWS_STORAGE_BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.MY_AWS_S3_REGION_NAME,
});

const uploadFile = async (file, imageName) => {
  const resizeMode = await sharp(file.buffer)
    .resize({
      height: 1920,
      width: 1000,
      fit: "cover",
    })
    .toBuffer();

  const params = {
    Bucket: bucket,
    Key: imageName,
    Body: resizeMode,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
};

const downloadFile = async (imageName) => {
  const params = {
    Bucket: bucket,
    Key: imageName,
  };

  const command = new GetObjectCommand(params);
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

const deleteFile = (file) => {
  const params = {
    Bucket: process.env.MY_AWS_STORAGE_BUCKET_NAME,
    Key: file,
  };

  return s3.deleteObject(params).promise();
};

module.exports = { uploadFile, downloadFile, deleteFile };
