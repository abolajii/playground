const db = require("../model");
const { generateOtp } = require("../utils/generate.otp");
const { getAge } = require("../utils/get.age");
const { getDistanceBetweenTwoPoints } = require("../utils/get.miles");
const { downloadFile, deleteFile } = require("../utils/s3");
const nodemailer = require("../config/nodemailer.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.user;
const Preferences = db.preferences;
const Uid = db.uid;
const Resetpassword = db.resetpassword;

const deletePicture = async (req, res) => {
  await deleteFile(req.body.img);

  User.findById({ _id: req.body._id }, async (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error on the server." });
      return;
    }
    if (user) {
      const url = [];
      const newPhotos = user.photos.filter((e) => e !== req.body.img);

      user.photos = newPhotos;

      for (let index = 0; index < user.photos.length; index++) {
        const element = user.photos[index];
        const res = await downloadFile(element);
        url.push(res);
      }

      user.save();
      const { __v, password, coords, ...userWithoutPassword } = user._doc;

      const allData = { url, ...userWithoutPassword };

      res.status(200).json(allData);
    }
  });
};

const loginWithEmail = (req, res) => {
  User.findOne(
    { email: req.body.email.toLowerCase().trim() },
    async (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (user) {
        //

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Username or Password!",
          });
        }
        // todo
        // if () {
        // return res.status(401).send({
        //   message: "Pending Account. Please Verify Your Email!",
        // });
        // }
        else {
          const url = [];

          const token = jwt.sign({ id: user.id }, process.env.secret, {
            expiresIn: 86400, // 24 hours
          });

          // var authorities = [];

          // for (let i = 0; i < user.roles.length; i++) {
          //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
          // }

          const {
            password,
            confirmationCode,
            dob,
            coords,
            __v,
            ...userWithoutPassword
          } = user._doc;

          for (let index = 0; index < user.photos.length; index++) {
            const element = user.photos[index];
            const res = await downloadFile(element);
            url.push(res);
          }

          Preferences.findOne({ user_id: user._id }, (err, preferences) => {
            if (err) {
              res.status(500).json({ message: "Error on the server." });
              return;
            }
            if (preferences) {
              const { user_id, _id, __v, ...preferencesWithoutId } =
                preferences._doc;

              const allData = {
                ...userWithoutPassword,
                preferences: preferencesWithoutId,
                dob,
                url,
                accessToken: token,
              };

              res.status(200).json(allData);
            } else {
              res.status(404).json({ message: "Preferences not found" });
            }
          });
        }
      } else {
        res.status(404).json({ message: "Invalid email or password!" });
      }
    }
  );
};

const getUser = (req, res) => {
  Uid.findOne({
    uid: req.body.uid,
  })
    .then((id) => {
      if (id) {
        User.findOne({ _id: id.user_id }, async (err, user) => {
          if (err) {
            res.status(500).json({ message: "Error on the server." });
            return;
          }

          if (user) {
            const url = [];
            const {
              password,
              confirmationCode,
              dob,
              coords,
              __v,
              ...userWithoutPassword
            } = user._doc;

            for (let index = 0; index < user.photos.length; index++) {
              const element = user.photos[index];
              const res = await downloadFile(element);
              url.push(res);
            }
            Preferences.findOne({ user_id: user._id }, (err, preferences) => {
              if (err) {
                res.status(500).json({ message: "Error on the server." });
                return;
              }
              if (preferences) {
                const { user_id, _id, __v, ...preferencesWithoutId } =
                  preferences._doc;

                const allData = {
                  ...userWithoutPassword,
                  preferences: preferencesWithoutId,
                  dob,
                  url,
                };
                res.status(200).json(allData);
              } else {
                res.status(404).json({ message: "Preferences not found" });
              }
            });
          }
        });
      }

      if (!id) {
        res.status(400).send({ msg: "User not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAllUsers = (req, res) => {
  User.find(
    {
      _id: { $nin: req.body.id },
    },
    (err, users) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (users) {
        const newUsers = users.map(async (user) => {
          const url = [];
          const {
            password,
            confirmationCode,
            dob,
            coords,
            ...userWithoutPassword
          } = user._doc;

          for (let index = 0; index < user.photos.length; index++) {
            const element = user.photos[index];
            const res = await downloadFile(element);
            url.push(res);
          }

          const age = getAge(dob);
          const miles = getDistanceBetweenTwoPoints(
            req.body.coords,
            coords
          )?.toFixed(0);

          const allData = {
            ...userWithoutPassword,
            age,
            url,
            miles: Number(miles),
          };
          return allData;
        });

        Promise.all(newUsers).then(function (results) {
          res.status(200).json(results);
        });
      }
    }
  );
};

const getAllUsersCopy = () => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      console.log(users);
    }
  });
};

const addUserCoords = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { coords: req.body.coords },
    { new: true },
    (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (user) {
        const { password, ...other } = user._doc;
        res
          .status(200)
          .json({ message: "User coords updated successfully", user: other });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
};

const likedUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { $push: { likes: req.body.liked } },
    { new: true },
    (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (user) {
        res.status(200).json({
          message: "User liked",
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
};

const userPreferences = (req, res) => {
  Preferences.findOneAndUpdate(
    { user_id: req.body.id },
    { ...req.body },
    { new: true, upsert: true },
    (err, preferences) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (preferences) {
        const { user_id, _id, __v, ...preferencesWithoutId } = preferences._doc;
        User.findOneAndUpdate(
          { _id: req.body.id },
          { preferences: preferencesWithoutId },
          { new: true },
          (err, user) => {
            if (err) {
              res.status(500).json({ message: "Error on the server." });
              return;
            }
            if (user) {
              res.status(200).json(preferencesWithoutId);
            } else {
              res.status(404).json({ message: "User not found" });
            }
          }
        );
      } else {
        res.status(404).json({ message: "Preferences not found" });
      }
    }
  );
};

const forgotPassword = (req, res) => {
  User.findOne({ email: req.body.email.toLowerCase().trim() }, (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error on the server." });
      return;
    }
    if (user) {
      res.status(200).json({ message: "User found" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

const sendResetPasswordEmail = (req, res) => {
  const otp = generateOtp(6);
  const { email } = req.body;

  User.find({ email: email.trim().toLowerCase() })
    .then((each) => {
      const user = each[0];
      if (!user)
        return res.status(400).send({
          message: "No user found, please create an account",
        });

      // if (user.status === "Pending") {
      //   createError(res, "Please verify your account!");
      //   return;
      // }

      Resetpassword.find({
        userId: user._id,
      })
        .then((each) => {
          const resetPassword = each[0];
          if (!resetPassword) {
            const data = { userId: user._id, uniqueString: String(otp) };
            const userPassword = new Resetpassword(data);
            userPassword
              .save()
              .then(async () => {
                await nodemailer.sendResetPasswordEmail(
                  user.name,
                  user.email,
                  otp
                );

                res.send({
                  status: "SUCCESS",
                  message: "Otp has been sent successfully.",
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            Resetpassword.findOneAndUpdate(
              { userId: user._id },
              { uniqueString: String(otp) }
            )
              .then(async () => {
                await nodemailer.sendResetPasswordEmail(
                  user.name,
                  user.email,
                  otp
                );

                res.send({
                  status: "SUCCESS",
                  message: "Otp has been sent successfully.",
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((e) => console.log("error", e));
};

const verifyOtp = (req, res) => {
  const { otp } = req.body;
  Resetpassword.find({
    uniqueString: otp,
  })
    .then((each) => {
      const user = each[0];
      if (!user) {
        res.status(400).send({ message: "Invalid OTP" });
      } else {
        // res.status(200).send({ message: "Valid OTP" });
        Resetpassword.deleteOne({ userId: user.userId })
          .then(() => {
            res.status(200).send({ message: "Valid OTP", userId: user.userId });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((e) => console.log("error", e));
};

const resetPassword = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { password: bcrypt.hashSync(req.body.password, 8) },
    { new: true }
  )
    .then(() => {
      res.status(200).send({ message: "Password updated successfully!!" });
    })
    .catch((e) => console.log("error"));
};

const editInterests = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { my_interests: req.body.my_interests },
    { new: true },
    async (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (user) {
        const { password, ...userWithoutPassword } = user._doc;

        const url = [];
        for (let index = 0; index < user.photos.length; index++) {
          const element = user.photos[index];
          const res = await downloadFile(element);
          url.push(res);
        }
        res.status(200).json({
          message: "Interest updated successfully",
          user: { url, ...userWithoutPassword },
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
};

const favoritesUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $push: { favorites: req.body.favorites },
    },
    { new: true },
    (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (user) {
        res.status(200).json({
          message: "User added to favorites",
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
};

const likedUsers = (req, res) => {
  const { liked, id } = req.body;
  User.findOneAndUpdate(
    { _id: liked },
    { $push: { likedUsers: id } },
    { new: true },
    (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (user) {
        likedUser(req, res);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
};

const filterUsers = (req, res) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  });

  User.find(
    {
      _id: { $nin: req.body.id },
    },
    (err, users) => {
      if (users) {
        const url = [];

        let allUsers = users.map(async (user) => {
          const {
            password,
            confirmationCode,
            dob,
            coords,
            ...userWithoutPassword
          } = user._doc;
          const age = getAge(dob);
          const miles = getDistanceBetweenTwoPoints(
            req.body.coords,
            coords
          )?.toFixed(0);

          for (let index = 0; index < user.photos.length; index++) {
            const element = user.photos[index];
            const res = await downloadFile(element);
            url.push(res);
          }

          const allData = {
            ...userWithoutPassword,
            age,
            url,
            miles: Number(miles),
          };

          return allData;
        });

        Promise.all(allUsers).then(function (results) {
          Object.keys(req.body).forEach((key) => {
            if (key === "age") {
              const [min, max] = req.body.age;
              results = results.filter((user) => {
                return user.age >= min && user.age <= max;
              });
            }

            if (key === "miles") {
              results = results.filter((user) => {
                return user.miles <= req.body.miles;
              });
            }

            if (key === "gender") {
              const isGender =
                req.body.gender === "Both" ? "" : req.body.gender;
              results = results.filter((user) => {
                return isGender === "" ? user : user.gender === req.body.gender;
              });
            }
          });

          res.status(200).json(results);
        });
      }
    }
  );
};

const editProfile = (req, res) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  });

  User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        my_interests: req.body.my_interests,
        about_me: req.body.about_me,
        location: req.body.location,
        phone: req.body.phone,
        email: req.body.email && req.body.email.toLowerCase().trim(),
        dob: req.body.dob,
      },
    },
    { new: true },
    async (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }

      if (user) {
        const { password, ...userWithoutPassword } = user._doc;

        const url = [];
        for (let index = 0; index < user.photos.length; index++) {
          const element = user.photos[index];
          const res = await downloadFile(element);
          url.push(res);
        }

        res.status(200).json({
          message: "User updated successfully",
          user: { url, ...userWithoutPassword },
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
};

const changePassword = (req, res) => {
  const { id, password, newPassword } = req.body;
  User.findById({
    _id: id,
  })
    .then((user) => {
      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!",
        });
      }

      user.password = bcrypt.hashSync(newPassword, 8);

      user.save((err) => {
        if (err) {
          res.status(500).json({ message: "Error on the server." });
          return;
        }

        res.status(200).json({
          message: "Password updated successfully!",
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getById = (req, res) => {
  User.findById({
    _id: req.body.id,
  })
    .then((user) => {
      console.log(user);
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  loginWithEmail,
  getAllUsers,
  addUserCoords,
  likedUser,
  userPreferences,
  getAllUsersCopy,
  forgotPassword,
  sendResetPasswordEmail,
  editInterests,
  favoritesUser,
  likedUsers,
  filterUsers,
  getUser,
  deletePicture,
  verifyOtp,
  resetPassword,
  editProfile,
  changePassword,
  getById,
};
