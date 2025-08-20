const asyncHanlder = require("express-async-handler");
// const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
module.exports.getForgotPasswordView = asyncHanlder((req, res) => {
  res.render("forgot-password");
});


module.exports.sendForgotPasswordLink = asyncHanlder( async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: "10m" });
  const link = `http://localhost:3001/password/reset-password/${user._id}/${token}`;
  res.json({ message: "Click on the Link", resetPasswordLink: link });
});


module.exports.getResetPasswordView = asyncHanlder( async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error);
    res.json({error: 'Error'})
  }
});


module.exports.resetThePassword = asyncHanlder(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");
  } catch (error) {
    console.log(error);
    res.json({error: 'Error'})
  }
});