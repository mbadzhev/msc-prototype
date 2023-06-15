const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  dateTime: {
    type: Date,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
