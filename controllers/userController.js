const asyncHanlder = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");

module.exports.updateUserData = asyncHanlder(async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "You Are Not Allowed, You Can Update Your Profile Only" });
  }
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
  }, { new: true }).select("-password");
  res.status(200).json(updatedUser);
});

module.exports.getAllUsers = asyncHanlder(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});


module.exports.getUserById = asyncHanlder(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User Not Found" })
  }
});


module.exports.deleteUser = asyncHanlder(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User Has Been Deleted Succefully" });
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
});