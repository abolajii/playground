const mongoose = require("mongoose");

const Preferences = mongoose.model(
  "Preferences",
  new mongoose.Schema({
    user_id: String,
    age: String,
    gender: String,
    height: String,
    distance: String,
    ethnicity: String,
    religion: String,
    education: String,
    relationship_goals: String,
    kids: String,
    smoking: String,
    drinking: String,
    family_plan: String,
  })
);

module.exports = Preferences;
