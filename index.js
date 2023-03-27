const express = require("express");
const app = express();
const db = require("./model");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 6000;

// var whitelist = [
//   "http://localhost:3000",
//   "http://localhost:3000/details",
//   "https://lovebirdz-759c8.web.app",
//   "https://lovebirdz-759c8.web.app/details",
// ];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(cors());

const mongoose = require("mongoose");

mongoose
  .connect(process.env.uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routes
require("./routes/signin.routes")(app);
require("./routes/signup.routes")(app);

app.listen(port, () => {
  console.log("Server running on port", port);
});
