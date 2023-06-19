const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
});

module.exports = mongoose.model("Student", studentSchema);
