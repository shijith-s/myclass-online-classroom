const Teacher = require("../models/teacher.js");
const ClassRoom = require("../models/classroom");
const { registerValidator, loginValidator } = require("../functions/validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/student.js");
require("dotenv/config");

//registering function
exports.signupTeacher = async (req, res) => {
  //validating the data obtained from post request
  console.log(req.body);
  const { error } = registerValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //Checking whether the username given is already taken or not
  const usernameExists = await Teacher.findOne({
    username: req.body.username,
  });
  if (usernameExists) {
    return res.status(400).json({ message: "This username already exists" });
  }
  //Encrypting the password
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new Teacher({
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
exports.loginTeacher = async (req, res) => {
  //validating the data obtained from post request
  console.log("reached login");
  const { error } = loginValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking whether the user exists and collecting the stored info
  const storedUser = await Teacher.findOne({
    username: req.body.username,
  }).populate({
    path: "classes",
    select: "classname section subject classId",
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
    const storedUser = await Teacher.findOne({
      _id: req.userData.id,
    }).populate({
      path: "classes",
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

// ==================  Class related functions  =========================

// To create a new class
exports.createClass = async (req, res) => {
  console.log("creating new class");
  console.log(req.body);

  const classroom = await ClassRoom.findOne({
    createdBy: req.userData.id,
    classname: req.body.classname,
  });
  if (classroom) {
    return res
      .status(400)
      .json({ message: "One classroom with same name exists in your account" });
  }

  try {
    const newClass = new ClassRoom({
      classname: req.body.classname,
      section: req.body.section,
      subject: req.body.subject,
      createdBy: req.userData.id,
    });
    newClass.save();
    // console.log(newClass);
    // console.log(req.userData.id);
    const teacherData = await Teacher.findOneAndUpdate(
      { _id: req.userData.id },
      {
        $addToSet: {
          classes: newClass._id,
        },
      },
      { new: true }
    ).populate("classes");
    console.log(teacherData);
    res.status(201).json(teacherData.classes);
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }
};

// To delete a class
exports.deleteClass = async (req, res) => {
  console.log("creating new class");
  console.log(req.body);
  try {
    const classroom = await ClassRoom.findOne({
      classId: req.body.classId,
      createdBy: req.userData.id,
    });
    console.log(classroom);
    if (!classroom) {
      return res.status(400).json({ message: "No such classrooms exists" });
    }
    await ClassRoom.deleteOne({ _id: classroom._id });
    const teacherData = await Teacher.findOneAndUpdate(
      { _id: req.userData.id },
      {
        $pull: {
          classes: classroom._id,
        },
      },
      { new: true }
    ).populate("classes", "classname subject section classId");
    const deletedStud = await Student.updateMany(
      {
        classes: {
          $in: [classroom._id],
        },
      },
      {
        $pull: {
          classes: classroom._id,
        },
      },
      { new: true }
    );
    console.log(deletedStud);
    res.status(200).json(teacherData.classes);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

// ======================   Assignment controls   ================================

exports.createAssignment = async (req, res) => {
  console.log(req.files);
  try {
    const newassignment = {
      title: req.body.title,
      instructions: req.body.instructions,
      deadline: req.body.deadline,
    };
    if (req.files) {
      newassignment.attachments = req.files.map(
        (file) => "/attachments/" + file.filename
      );
    }
    await ClassRoom.findOneAndUpdate(
      {
        classId: req.body.classId,
        createdBy: req.userData.id,
      },
      {
        $addToSet: { assignments: newassignment },
      },
      { new: true }
    );
    const newclassroom = await Teacher.findOne(
      { _id: req.userData.id },
      { classes: 1 },
      { new: true }
    ).populate("classes");
    console.log(newclassroom);
    res.status(201).json(newclassroom);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// =====================   Admin controls  =========================================

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
