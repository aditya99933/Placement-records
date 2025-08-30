const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  searchesDone: { type: Number, default: 0 },
  lastSearchDate: { type: String, default: null }
});

module.exports = mongoose.model("User", userSchema);
