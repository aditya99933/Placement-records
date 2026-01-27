const Notes = require('../models/Notes');
const path = require('path');
const fs = require('fs');

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

const downloadNote = async (req, res) => {
    try {
        console.log('Download route hit with filename:', req.params.filename);
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);
        
        console.log('File path:', filePath);
        console.log('File exists:', fs.existsSync(filePath));
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log('File not found at path:', filePath);
            return res.status(404).json({ error: 'File not found', path: filePath });
        }
        
        res.download(filePath, filename, (err) => {
            if (err) {
                console.log('Download error:', err);
                res.status(500).json({ error: 'Could not download file' });
            }
        });
    } catch (err) {
        console.log('Download catch error:', err);
        res.status(500).json({ error: 'Could not download file' });
    }
};
