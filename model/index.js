const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.preferences = require("./preferences.model");
db.uid = require("./uid.model");
db.resetpassword = require("./reset.password.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
