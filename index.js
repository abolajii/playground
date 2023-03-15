const express = require("express");
const app = express();
const db = require("./model");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8080;

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
    // init();
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

const init = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
};

app.listen(port, () => {
  console.log("Server running on port", port);
});
