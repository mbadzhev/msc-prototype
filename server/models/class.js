const mongoose = require("mongoose");
const Token = require("./token");
const Student = require("./student");

const classSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  tokens: [Token.schema],
  studentsAbsent: [Student.schema],
  studentsPresent: [Student.schema],
});

module.exports = mongoose.model("Class", classSchema);
