const express = require("express");
const app = express();
const db = require("./model");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 6000;

app.use(cors());
const mongoose = require("mongoose");
const signInRoute = require("./routes/signin.routes");
const signUpRoute = require("./routes/signup.routes");
const imageRouter = require("./routes/images.routes");

const Role = db.role;

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

app.use("/api", signInRoute);
app.use("/api", signUpRoute);
app.use("/api", imageRouter);

app.listen(port, () => {
  console.log("Server running on port", port);
});
