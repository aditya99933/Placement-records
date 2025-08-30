const express = require('express');
const protect = require('../middlewares/authMiddleware');
const { createNote, getAllNotes, getNoteById, deleteNote } = require('../controllers/notecontroller');
const { upload } = require('../middlewares/noteMiddleware');
const router = express.Router();

router.post('/',protect,upload.single('pdf'), createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.delete('/:id', deleteNote);

module.exports = router;