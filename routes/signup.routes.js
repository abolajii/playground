const signUpRoute = require("express").Router();
const controller = require("../controller/signup.controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./images");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// const { authJwt } = require("../middleware");

signUpRoute.post("/checkemail", controller.checkDuplicateEmail);

signUpRoute.post("/other-services", controller.checkDuplicateService);

signUpRoute.post("/create-user", controller.saveUid);

signUpRoute.post(
  "/signup",
  upload.array("photo", 5),
  controller.signUpWithEmail
);

module.exports = signUpRoute;
