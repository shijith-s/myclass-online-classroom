const mongoose = require("mongoose");
const shortId = require("shortid");

const ClassSchema = mongoose.Schema({
  classname: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
  },

  date: {
    type: Date,
    default: Date.now(),
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
  ],
  classId: {
    type: String,
    unique: true,
    default: shortId.generate,
  },
  section: {
    type: String,
  },
  subject: {
    type: String,
  },
  assignments: [
    {
      title: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
      },
      attachments: {
        type: Array,
      },
      completedBy: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Students",
          },
          grade: {
            type: String,
          },
        },
      ],
      deadline: {
        type: Date,
      },
    },
  ],
});

const classroom = mongoose.model("Classes", ClassSchema);

module.exports = classroom;
