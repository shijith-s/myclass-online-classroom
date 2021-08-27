const Teacher = require("../models/teacher.js");
const { registerValidator, loginValidator } = require("../functions/validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

//registering function
exports.signupTeacher = async (req, res) => {
  //validating the data obtained from post request
  console.log(req.body);
  const { error } = registerValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking whether the email given is already taken or not
  const emailExists = await Teacher.findOne({
    email: req.body.email,
  });
  if (emailExists) {
    return res.status(400).json({ message: "This email already exists" });
  }
  //Encrypting the password
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Teacher({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const saved = await user.save();
    console.log(saved);
    const token = jwt.sign({ _id: saved._id }, process.env.TOKEN_SECRET);
    res.json({ name: saved.name, jwtToken: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Login function
exports.loginTeacher = async (req, res) => {
  //validating the data obtained from post request
  const { error } = loginValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking whether the user exists and collecting the stored info
  const storedUser = await Teacher.findOne({
    email: req.body.email,
  });
  if (!storedUser) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  //checking the password
  const verified = await bcrypt.compare(req.body.password, storedUser.password);
  if (!verified) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ _id: storedUser._id }, process.env.TOKEN_SECRET);
  // res.cookie("jwtToken", token, { maxAge: 900000, httpOnly: true });
  res.status(200).json({ name: storedUser.name, jwtToken: token });
};

//to delete all data in DB
exports.deleteAllTeacher = async (req, res) => {
  const deleted_users = await Teacher.deleteMany({});

  res.json({ users: deleted_users });
};

//to delete one user in DB
exports.deletOneTeacher = async (req, res) => {
  const deleted_user = await Teacher.deleteOne({ _id: req.params.id });
  res.json({ user: deleted_user });
};

// to get all users in the DB
exports.getAllTeacher = async (req, res) => {
  const allusers = await Teacher.find({});
  res.json({ users: allusers });
};
