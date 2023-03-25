const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: String,
      email: String,
      password: String,
      gender: String,
      phone: String,
      location: String,
      about_me: String,
      dob: String,
      status: {
        type: String,
        enum: ["Pending", "Active"],
        default: "Pending",
      },

      my_interests: {
        type: Array,
        default: [],
      },
      interested_in: {
        type: String,
      },
      coords: {
        type: Object,
      },
      photos: {
        type: Array,
        default: [],
      },
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
      preferences: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    { timestamps: true, minimize: false }
  )
);

module.exports = User;
