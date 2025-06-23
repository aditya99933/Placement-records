const Campus = require('../models/campus');

const addCampusJob = async (req, res) => {
  const { url, title, company, location, jobType, branch, salary,lastDate } = req.body;

  if (!title || !company) {
    return res.status(400).json({ message: 'Title and company are required' });
  }

  try {
    const newCampusJob = await Campus.create({
      url: url || '',
      title,
      company,
      location: location || 'Not Specified',
      jobType: jobType || 'Not Specified',
      branch: branch || '',
      salary: salary || 'Not Disclosed',
      lastDate: lastDate ,
    });

    res.status(201).json({
      message: 'Campus job created successfully',
      job: newCampusJob
    });
  } catch (error) {
    console.error('Campus job creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create campus job', 
      error: error.message 
    });
  }
};

const getAllCampusJobs = async (req, res) => {
  try {
    const campusJobs = await Campus.find().sort({ createdAt: -1 });
    res.json(campusJobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campus jobs', error: error.message });
  }
};

const getCampusJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const campusJob = await Campus.findById(id);
    if (!campusJob) return res.status(404).json({ message: 'Campus job not found' });
    res.json(campusJob);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campus job', error: error.message });
  }
};

const deleteCampusJob = async (req, res) => {
  try {
    const { id } = req.params;
    const campusJob = await Campus.findByIdAndDelete(id);
    if (!campusJob) return res.status(404).json({ message: 'Campus job not found' });
    res.json({ message: 'Campus job deleted successfully', deletedJob: campusJob });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete campus job', error: error.message });
  }
};

module.exports = { addCampusJob, getAllCampusJobs, getCampusJobById, deleteCampusJob };