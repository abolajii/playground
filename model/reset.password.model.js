const mongoose = require("mongoose");

const Resetpassword = mongoose.model(
  "Resetpassword",
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
        unique: true,
      },
      uniqueString: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Resetpassword;
