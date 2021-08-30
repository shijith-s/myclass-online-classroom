const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
  name: {
    type: String,
    min: 6,
    max: 255,
    required: true,
  },
  username: {
    type: String,
    unique: [true, "Username is already taken"],
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
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Classes"
    },
  ],
});

const teacher = mongoose.model("Teachers", TeacherSchema);

module.exports = teacher;
