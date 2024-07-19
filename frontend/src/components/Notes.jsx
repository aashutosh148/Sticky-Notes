import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Card, CardContent,
  IconButton, Grid, AppBar, Toolbar, Switch, FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Logout as LogoutIcon } from '@mui/icons-material';
import api from '../services/api';

const Notes = ({ toggleDarkMode, darkMode }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async () => {
    try {
      const response = await api.post('/notes', { content: newNote });
      setNotes([...notes, response.data]);
      setNewNote('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleExpandNote = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const renderNoteContent = (note) => {
    const maxLength = 100;
    if (note.content.length > maxLength && expandedNoteId !== note._id) {
      return (
        <>
          {note.content.substring(0, maxLength)}...
          <Button onClick={() => toggleExpandNote(note._id)}>more</Button>
        </>
      );
    } else if (expandedNoteId === note._id) {
      return (
        <>
          {note.content}
          <Button onClick={() => toggleExpandNote(note._id)}>show less</Button>
        </>
      );
    }
    return note.content;
  };

  const colors = ['#FFF5Cd', '#B0E0E6', '#E6FFFA', '#e0e0fe', '#FFC0CB', '#FFE6FA'];

  return (
    <Box sx={{ flexGrow: 1 }} onClick={() => { if (isAdding) setIsAdding(false); }} className='min-h-screen mb-4'>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notes App
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
            label=""
          />
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
          sx={{ mb: 2 }}
        >
          Add Note
        </Button>
        {isAdding && (
          <Box sx={{ mb: 2 }} onClick={(e) => e.stopPropagation()}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type your note..."
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                handleAddNote();
              }}
              sx={{ mt: 1 }}
            >
              Add
            </Button>
          </Box>
        )}
        <Grid container spacing={2}>
          {notes.map((note, index) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
              <Card
                sx={{
                  position: 'relative',
                  height: expandedNoteId === note._id ? 'auto' : '200px',
                  backgroundColor: colors[index % colors.length],
                  '&:hover .deleteIcon': { opacity: 1 },
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'black',
                  boxShadow: darkMode
                    ? '0 4px 8px rgba(255, 255, 255, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.2)'
                    : '0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    boxShadow: darkMode
                      ? 'inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                      : 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                    pointerEvents: 'none'
                  }
                }}
              >
                <CardContent>
                  <Typography>
                    {renderNoteContent(note)}
                  </Typography>
                </CardContent>
                <div>
                  <Typography variant="body2" sx={{ color: 'darkslategray' }}>
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                  <IconButton
                    className="deleteIcon"
                    sx={{
                      position: 'absolute',
                      right: 5,
                      bottom: 5,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      color: 'black' 
                    }}
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Notes;
