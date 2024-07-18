const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

router.post('/', auth, noteController.createNote);
router.get('/', auth, noteController.getNotes);
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router;
