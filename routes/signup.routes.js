const signUpRoute = require("express").Router();
const controller = require("../controller/signup.controller");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

// const { authJwt } = require("../middleware");

signUpRoute.post("/checkemail", controller.checkDuplicateEmail);

signUpRoute.post("/other-services", controller.checkDuplicateService);

signUpRoute.post("/create-user", upload.array("photo", 5), controller.saveUid);

signUpRoute.post(
  "/signup",
  upload.array("photo", 5),
  controller.signUpWithEmail
);

module.exports = signUpRoute;
