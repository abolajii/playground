const signInRoute = require("express").Router();
const controller = require("../controller/login.controller");

// const { authJwt } = require("../middleware");

module.exports = function (signInRoute) {
  signInRoute.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  signInRoute.post("/api/signin", controller.loginWithEmail);

  signInRoute.post("/api/liked", controller.likedUsers);

  signInRoute.post("/api/favorites", controller.favoritesUser);

  signInRoute.post("/api/all/users", controller.getAllUsers);

  signInRoute.post("/api/preferences", controller.userPreferences);

  signInRoute.put("/api/add/coords", controller.addUserCoords);

  signInRoute.post("/api/forgot-password", controller.forgotPassword);

  signInRoute.post("/api/verify-otp", controller.verifyOtp);

  signInRoute.put("/api/reset-password", controller.resetPassword);

  signInRoute.post("/api/generate-otp", controller.sendResetPasswordEmail);

  signInRoute.post("/api/filter/:id", controller.filterUsers);

  signInRoute.put("/api/edit/interests", controller.editInterests);

  signInRoute.post("/api/get-user", controller.getUser);

  signInRoute.delete("/api/delete/image", controller.deletePicture);

  signInRoute.put("/api/edit/profile", controller.editProfile);

  signInRoute.put("/api/change-password", controller.changePassword);
};
