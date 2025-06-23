const express = require("express");
const router = express.Router();


const protect = require("../middlewares/authMiddleware.js");
const { getAllCampusJobs, addCampusJob, getCampusJobById, deleteCampusJob } = require("../controllers/campuscontroller.js");

router.get("/",getAllCampusJobs);
router.post("/",protect, addCampusJob);
router.get("/:id", getCampusJobById);
router.delete('/:id', deleteCampusJob);

module.exports = router;