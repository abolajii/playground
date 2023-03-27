const controller = require("../controller/signup.controller");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

// const { authJwt } = require("../middleware");

module.exports = function (signUpRoute) {
  signUpRoute.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  signUpRoute.post("/api/checkemail", controller.checkDuplicateEmail);

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
