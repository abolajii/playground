const signInRoute = require("express").Router();
const controller = require("../controller/login.controller");

// const { authJwt } = require("../middleware");

signInRoute.post("/signin", controller.loginWithEmail);

signInRoute.post("/liked", controller.likedUsers);

signInRoute.post("/favorites", controller.favoritesUser);

signInRoute.post("/all/users", controller.getAllUsers);

signInRoute.post("/preferences", controller.userPreferences);

signInRoute.put("/add/coords", controller.addUserCoords);

signInRoute.post("/forgot-password", controller.forgotPassword);

signInRoute.post("/verify-otp", controller.verifyOtp);

signInRoute.put("/reset-password", controller.resetPassword);

signInRoute.post("/generate-otp", controller.sendResetPasswordEmail);

signInRoute.post("/filter/:id", controller.filterUsers);

signInRoute.post("/edit/interests", controller.editInterests);

signInRoute.post("/get-user", controller.getUser);

signInRoute.delete("/delete/image", controller.deletePicture);

signInRoute.put("/edit/profile", controller.editProfile);

module.exports = signInRoute;
