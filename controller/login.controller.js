const db = require("../model");
const { getAge } = require("../utils/get.age");
const { getDistanceBetweenTwoPoints } = require("../utils/get.miles");

const User = db.user;
const Preferences = db.preferences;
const Uid = db.uid;

const loginWithEmail = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error on the server." });
      return;
    }
    if (user) {
      //
      if (user.password !== req.body.password) {
        res.status(400).json({ message: "Invalid user details" });
      } else {
        const {
          password,
          confirmationCode,
          dob,
          coords,
          __v,
          ...userWithoutPassword
        } = user._doc;

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
  });
};

const getUser = (req, res) => {
  Uid.findOne(
    {
      uid: req.body.uid,
    },
    (err, id) => {
      if (err) {
        console.log({ err });
      }

      if (id) {
        User.findOne({ _id: id.user_id }, (err, user) => {
          if (err) {
            res.status(500).json({ message: "Error on the server." });
            return;
          }
          if (user) {
            if (user.password !== req.body.password) {
              res.status(400).json({ message: "Invalid user details" });
            } else {
              const {
                password,
                confirmationCode,
                dob,
                coords,
                __v,
                ...userWithoutPassword
              } = user._doc;

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
        });
      }
    }
  );
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
        const allUsers = users.map((user) => {
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

          const allData = {
            ...userWithoutPassword,
            age,
            miles: Number(miles),
          };

          return allData;
        });

        res.status(200).json(allUsers);
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
        res
          .status(200)
          .json({ message: "User coords updated successfully", user });
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
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error on the server." });
      return;
    }
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

const generateOtp = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error on the server." });
      return;
    }
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      res.status(200).json({ otp });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

const editInterests = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { my_interests: req.body.my_interests },
    { new: true },
    (err, user) => {
      if (err) {
        res.status(500).json({ message: "Error on the server." });
        return;
      }
      if (user) {
        res.status(200).json({
          message: "Interests updated successfully",
          my_interests: user.my_interests,
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
        let allUsers = users.map((user) => {
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

          const allData = {
            ...userWithoutPassword,
            age,
            miles: Number(miles),
          };

          return allData;
        });

        Object.keys(req.body).forEach((key) => {
          if (key === "age") {
            const [min, max] = req.body.age;
            allUsers = allUsers.filter((user) => {
              return user.age >= min && user.age <= max;
            });
          }

          if (key === "miles") {
            allUsers = allUsers.filter((user) => {
              return user.miles <= req.body.miles;
            });
          }

          if (key === "gender") {
            allUsers = allUsers.filter((user) => {
              return user.gender === req.body.gender;
            });
          }
        });

        res.status(200).json(allUsers);
      }
    }
  );
};

module.exports = {
  loginWithEmail,
  getAllUsers,
  addUserCoords,
  likedUser,
  userPreferences,
  getAllUsersCopy,
  forgotPassword,
  generateOtp,
  editInterests,
  favoritesUser,
  likedUsers,
  filterUsers,
  getUser,
};
