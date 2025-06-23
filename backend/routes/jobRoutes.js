const express = require("express");
const router = express.Router();

const { getAllJobs, processJob, getJobById, deleteJob } = require("../controllers/jobcontroller.js");
const protect = require("../middlewares/authMiddleware.js");

router.get("/", getAllJobs);
router.post("/",protect, processJob); // Single endpoint for both scraping and creating
router.get("/:id", getJobById);
router.delete('/:id', deleteJob);

module.exports = router;