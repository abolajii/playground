const controller = require("../controller/signup.controller");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// const { authJwt } = require("../middleware");

module.exports = function (signUpRoute) {
  signUpRoute.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); // If needed
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    ); // If needed
    // res.setHeader("Access-Control-Allow-Credentials", true); // If needed

    next();
  });

  signUpRoute.post("/api/checkemail", controller.checkDuplicateEmail);

  signUpRoute.post("/api/dob", controller.dob);

  signUpRoute.post("/api/other-services", controller.checkDuplicateService);

  signUpRoute.post(
    "/api/create-user",
    upload.array("photo", 5),
    controller.saveUid
  );

  signUpRoute.post(
    "/api/signup",
    upload.array("photo", 5),
    controller.signUpWithEmail
  );
};
