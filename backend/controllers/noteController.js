const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      user: req.user._id
    });
    await note.save();
    return res.status(201).send(note);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    return res.send(notes);
  } catch (error) {
    return res.status(500).send();
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).send();
    }
    return res.send(note);
  } catch (error) {
    return res.status(500).send();
  }
};
