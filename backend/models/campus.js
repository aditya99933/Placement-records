const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
    url: String,
    title: String,
    company: String,
    location: String,
    jobType: {type: String, default: 'Not Specified'}, 
    branch: String,
    salary: {type: String, default: 'Not Disclosed'},
    lastDate : {type : Date, default: Date.now()},
    }, { timestamps: true });

module.exports = mongoose.model('Campus', campusSchema);