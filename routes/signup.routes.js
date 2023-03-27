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

  signUpRoute.post("/checkemail", controller.checkDuplicateEmail);

  signUpRoute.post("/other-services", controller.checkDuplicateService);

  signUpRoute.post(
    "/create-user",
    upload.array("photo", 5),
    controller.saveUid
  );

  signUpRoute.post(
    "/signup",
    upload.array("photo", 5),
    controller.signUpWithEmail
  );
};
