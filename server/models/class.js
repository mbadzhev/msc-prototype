const mongoose = require("mongoose");
const Token = require("./token");

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
  studentsAbsent: {
    type: [String],
    required: true,
  },
  studentsPresent: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("Class", classSchema);
