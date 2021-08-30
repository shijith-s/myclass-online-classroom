const Student = require("../models/student.js");
const Teacher = require("../models/teacher.js");
const ClassRoom = require("../models/classroom.js");
const { registerValidator, loginValidator } = require("../functions/validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

//registering function
exports.signupStudent = async (req, res) => {
  //validating the data obtained from post request
  console.log(req.body);
  const { error } = registerValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking whether the username given is already taken or not
  const usernameExists = await Student.findOne({
    username: req.body.username,
  });
  if (usernameExists) {
    return res.status(400).json({ message: "This username already exists" });
  }
  //Encrypting the password
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Student({
    name: req.body.name,
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const saved = await user.save();
    console.log(saved);
    const token = jwt.sign({ id: saved._id }, process.env.TOKEN_SECRET);
    res.json({ name: saved.name, username: saved.username, token: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Login function
exports.loginStudent = async (req, res) => {
  //validating the data obtained from post request
  console.log("reached login");
  const { error } = loginValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking whether the user exists and collecting the stored info
  const storedUser = await Student.findOne({
    username: req.body.username,
  }).populate({
    path: "classes",
    select: "classname section subject createdBy classId",
    populate: {
      path: "createdBy",
      select: "name",
      model: "Teachers",
    },
  });

  if (!storedUser) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  //checking the password
  const verified = await bcrypt.compare(req.body.password, storedUser.password);
  if (!verified) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ id: storedUser._id }, process.env.TOKEN_SECRET);

  const userData = {
    _id: storedUser._id,
    name: storedUser.name,
    username: storedUser.name,
    classes: storedUser.classes,
    token: token,
  };
  res.status(200).json(userData);
};

// To get all data during refresh
exports.getAllData = async (req, res) => {
  try {
    const storedUser = await Student.findOne({
      _id: req.userData.id,
    }).populate({
      path: "classes",
      populate: {
        path: "createdBy",
        select: "name",
        model: "Teachers",
      },
    });
    if (!storedUser) return res.status(404).json({ message: "User not found" });
    console.log(storedUser);
    const userData = {
      _id: storedUser._id,
      name: storedUser.name,
      username: storedUser.name,
      classes: storedUser.classes,
    };
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =============================    Modules related to classroom   =======================================

// To join a new class
exports.joinClass = async (req, res) => {
  console.log("joining new class");
  console.log(req.body);

  try {
    const classroom = await ClassRoom.findOne({ classId: req.body.classId });
    console.log(classroom);
    if (!classroom) {
      return res.status(400).json({ message: "Invalid class code" });
    }
    const newclass = await ClassRoom.updateOne(
      { _id: classroom._id },
      {
        $addToSet: {
          students: req.userData.id,
        },
      },
      { new: true }
    );
    const studentData = await Student.findOneAndUpdate(
      { _id: req.userData.id },
      {
        $addToSet: {
          classes: classroom._id,
        },
      },
      { new: true }
    ).populate("classes");
    console.log(studentData);
    res.status(201).json(studentData.classes);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// To leave a class
exports.leaveClass = async (req, res) => {
  console.log("leaving class");
  console.log(req.body);

  try {
    const classroom = await ClassRoom.findOne({ classId: req.body.classId });
    console.log(classroom);
    if (!classroom) {
      return res.status(400).json({ message: "Invalid class code" });
    }
    const newclass = await ClassRoom.updateOne(
      { _id: classroom._id },
      {
        $pull: {
          students: req.userData.id,
        },
      },
      { new: true }
    );
    console.log(newclass);
    const studentData = await Student.findOneAndUpdate(
      { _id: req.userData.id },
      {
        $pull: {
          classes: classroom._id,
        },
      },
      { new: true }
    ).populate("classes", "classname subject section classId");
    console.log(studentData);
    res.status(201).json(studentData.classes);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// =======================   Admin controls   ==================================

//to delete all data in DB
exports.deleteAllStudent = async (req, res) => {
  const deleted_users = await Student.deleteMany({});

  res.json({ users: deleted_users });
};

//to delete one user in DB
exports.deletOneStudent = async (req, res) => {
  const deleted_user = await Student.deleteOne({ _id: req.params.id });
  res.json({ user: deleted_user });
};

// to get all users in the DB
exports.getAllStudent = async (req, res) => {
  const allusers = await Student.find({});
  res.json({ users: allusers });
};
