const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  url: String,
  title: String,
  company: String,
  location: String,
  jobType: {type: String, default: 'Not Specified'}, 
  experience: String,
  salary: {type: String, default: 'Not Disclosed'},
  postedAt: Date,
  shortDescription: String,
  descriptionHtml: String,
  description: String,
  applyLink: String
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);


