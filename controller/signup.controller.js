const db = require("../model");
const { uploadFile } = require("../utils/s3");
const crypto = require("crypto");

const User = db.user;
const Role = db.role;
const Preferences = db.preferences;
const Uid = db.uid;

const signUpWithEmail = async (req, res) => {
  const links = [];

  for (let i = 0; i < req.files.length; i++) {
    const randomImageName = (bytes = 32) =>
      crypto.randomBytes(bytes).toString("hex");

    const imageName = randomImageName();
    console.log("Uploading...", i);
    const file = req.files[i];
    await uploadFile(file, imageName);
    links.push(`${imageName}`);
  }

  req.body.photos = links;

  console.log(req.body);

  const {
    dob,
    email,
    password,
    gender,
    my_interests,
    interested_in,
    name,
    photos,
  } = req.body;

  const newUser = new User({
    dob,
    email,
    password,
    gender,
    my_interests,
    interested_in,
    photos,
    name,
  });

  const Preference = new Preferences({
    user_id: newUser._id,
  });

  if (req.body.uid) {
    const newUid = new Uid({
      uid: req.body.uid,
      user_id: newUser._id,
    });

    newUid.save((err, user) => {
      console.log(err, user);
    });

    Preference.save((err) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }

      newUser.save((err, user) => {
        if (err) {
          res.status(500).json({ message: "Error on the server." });
          return;
        }

        if (user) {
          Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
              res.status(500).json({ message: "Error on the server." });
              return;
            }

            const { __v, password, ...userWithoutPassword } = user._doc;

            const userToSend = {
              ...userWithoutPassword,
            };

            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                res.status(500).json({ message: "Error on the server." });
                return;
              }

              res.status(200).json({
                message: "User was registered successfully!",
                user: userToSend,
              });
            });
          });
        } else {
          res.status(400).json({ message: "User not found" });
        }
      });
    });
  } else {
    Preference.save((err) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }

      newUser.save((err, user) => {
        if (err) {
          res.status(500).json({ message: "Error on the server." });
          return;
        }

        if (user) {
          Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
              res.status(500).json({ message: "Error on the server." });
              return;
            }

            const { __v, password, ...userWithoutPassword } = user._doc;

            const userToSend = {
              ...userWithoutPassword,
            };

            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                res.status(500).json({ message: "Error on the server." });
                return;
              }

              res.status(200).json({
                message: "User was registered successfully!",
                user: userToSend,
              });
            });
          });
        } else {
          res.status(400).json({ message: "User not found" });
        }
      });
    });
  }
};

const checkDuplicateEmail = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error on the server." });
      return;
    }
    if (user) {
      res.status(400).json({ message: "User with email already exists." });
    } else {
      res.status(200).json({ message: "User not found" });
    }
  });
};

const checkDuplicateService = (req, res) => {
  Uid.findOne({ uid: req.body.uid }, (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error on the server." });
      return;
    }
    if (user) {
      res.status(200).json({ message: "User already exists." });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

const saveUid = (req, res) => {
  signUpWithEmail(req, res);
};

module.exports = {
  signUpWithEmail,
  checkDuplicateEmail,
  checkDuplicateService,
  saveUid,
};
