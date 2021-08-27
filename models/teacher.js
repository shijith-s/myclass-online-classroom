const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
  name: {
    type: String,
    min: 6,
    max: 255,
    required: true,
  },
  email: {
    type: String,
    unique: [true, "Email is already present"],
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const teacher = mongoose.model("Teachers", TeacherSchema);

module.exports = teacher;
