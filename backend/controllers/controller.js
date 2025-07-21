const Note = require('../models/note');

exports.getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
};

exports.createNote = async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.status(201).json(note);
};
