require("dotenv").config();

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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
      height: 800,
      width: 500,
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
  const url = getSignedUrl(s3, command, { expiresIn: 86400 });
  return url;
};

const deleteFile = async (imageName) => {
  const params = {
    Bucket: bucket,
    Key: imageName,
  };
  const command = new DeleteObjectCommand(params);
  return await s3.send(command);
};

module.exports = { uploadFile, downloadFile, deleteFile };
