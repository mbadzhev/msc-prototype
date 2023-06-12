const mongoose = require("mongoose");

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
  tokens: {
    type: String,
    required: false,
  },
  studentsAbsent: {
    type: String,
    required: true,
  },
  studentsPresent: {
    type: String,
    required: false,
  },
});

builtinModules.export = mongoose.model("class", classSchema);
