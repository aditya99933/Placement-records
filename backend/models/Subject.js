const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true, unique: true },
  credits: { type: Number, required: true },
  semester: { type: Number, required: true },
});

module.exports = mongoose.model("Subject", subjectSchema);
