const mongoose = require("mongoose");

const Role = mongoose.model(
  "Uid",
  new mongoose.Schema({
    uid: String,
    user_id: String,
  })
);

module.exports = Role;
