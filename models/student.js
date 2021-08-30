const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
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
      ref: "Classes",
    },
  ],
});

const student = mongoose.model("Students", StudentSchema);

module.exports = student;
