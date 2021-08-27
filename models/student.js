const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
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

const student = mongoose.model("Students", StudentSchema);

module.exports = student;
