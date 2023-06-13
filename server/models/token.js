const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
