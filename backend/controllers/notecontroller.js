const Notes = require('../models/Notes');

const createNote = async (req, res) => {
    try {
        const note = new Notes({
        title: req.body.title,
        pdfUrl: `/uploads/${req.file.filename}`
        });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Could not create note' });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch notes' });
    }
};

const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Notes.findById(id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch note' });
    }
};
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Notes.findByIdAndDelete(id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted successfully', deletedNote: note });
    } catch (err) {
        res.status(500).json({ error: 'Could not delete note' });
    }
};

module.exports = {createNote, getAllNotes, getNoteById, deleteNote };