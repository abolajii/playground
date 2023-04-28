require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const db = require("./model");

const port = process.env.PORT || 6000;

const Role = db.role;

var whitelist = [
  "http://localhost:3000",
  "http://localhost:3000/details",
  "http://localhost:3001",
  "http://localhost:3001/details",
  "https://lovebirdz-759c8.web.app",
  "https://lovebirdz-759c8.web.app/details",
  "https://dobb-8c058.web.app",
  "https://dobb-8c058.web.app/details",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

const mongoose = require("mongoose");

mongoose
  .connect(process.env.uri)
  .then(() => {
    console.log("Connected to MongoDB");
    initial();
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

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    console.log("intialized");
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
}

app.listen(port, () => {
  console.log("Server running on port", port);
});
