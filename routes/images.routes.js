const { downloadFile } = require("../utils/s3");

const imageRouter = require("express").Router();

imageRouter.get("/images/:key", (req, res) => {
  const key = req.params.key;
  const readStream = downloadFile(key);
  readStream.pipe(res);
});

module.exports = imageRouter;
