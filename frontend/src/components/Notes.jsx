import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Card, CardContent,
  IconButton, AppBar, Toolbar, Switch, FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../services/api';
import SkeletonLoader from './SkeletonLoader';

const Notes = ({ toggleDarkMode, darkMode }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    const tempId = Date.now().toString();
    const newNoteObject = { _id: tempId, content: newNote, createdAt: new Date().toISOString() };

    setNotes(prevNotes => [...prevNotes, newNoteObject]);
    setNewNote('');
    setIsAdding(false);

    try {
      const response = await api.post('/notes', { content: newNote });
      setNotes(prevNotes => prevNotes.map(note =>
        note._id === tempId ? response.data : note
      ));
    } catch (error) {
      console.error('Error adding note:', error);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== tempId));
    }
  };

  const handleDeleteNote = async (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note._id !== id));

    try {
      await api.delete(`/notes/${id}`);
    } catch (error) {
      console.error('Error deleting note:', error);
      const noteToRestore = notes.find(note => note._id === id);
      if (noteToRestore) {
        setNotes(prevNotes => [...prevNotes, noteToRestore]);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleExpandNote = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) {
      if (result.draggableId && result.source) {
        handleDeleteNote(result.draggableId);
      }
      return;
    }

    const newNotes = Array.from(notes);
    const [reorderedNote] = newNotes.splice(result.source.index, 1);
    newNotes.splice(result.destination.index, 0, reorderedNote);

    setNotes(newNotes);

    // Optionally, update the backend with the new order
    // api.post('/notes/reorder', { newOrder: newNotes.map(note => note._id) });
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
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="notes" direction="horizontal">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  minHeight: '200px'
                }}
              >
                {isLoading ? (
                  <SkeletonLoader count={6} /> // Show SkeletonLoader while loading
                ) : (
                  notes.map((note, index) => (
                    <Draggable key={note._id} draggableId={note._id} index={index}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ width: 'calc(33.33% - 16px)', minWidth: '200px', mb: 2 }}
                        >
                          <Card
                            sx={{
                              height: '200px',
                              backgroundColor: colors[index % colors.length],
                              '&:hover .deleteIcon': { opacity: 1 },
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              color: 'black',
                              boxShadow: darkMode
                                ? '0 4px 8px rgba(255, 255, 255, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.2)'
                                : '0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                              transform: snapshot.isDragging ? 'scale(1.05)' : 'scale(1)',
                              transition: 'transform 0.2s',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <CardContent sx={{ height: '100%', overflow: 'hidden' }}>
                              <Typography>
                                {note.content.length > 100 && expandedNoteId !== note._id ? (
                                  <>
                                    {note.content.substring(0, 100)}...
                                    <Button onClick={() => toggleExpandNote(note._id)}>more</Button>
                                  </>
                                ) : (
                                  note.content
                                )}
                              </Typography>
                              {expandedNoteId === note._id && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: colors[index % colors.length],
                                    padding: 2,
                                    overflowY: 'auto'
                                  }}
                                >
                                  <Typography>{note.content}</Typography>
                                  <Button onClick={() => toggleExpandNote(note._id)}>show less</Button>
                                </Box>
                              )}
                            </CardContent>
                            <Box sx={{
                              p: 1,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                            }}>
                              <Typography variant="body2" sx={{ color: 'darkslategray', fontSize: '0.8rem' }}>
                                {new Date(note.createdAt).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </Typography>
                              <IconButton
                                className="deleteIcon"
                                sx={{
                                  opacity: 0,
                                  transition: 'opacity 0.3s',
                                  color: 'black',
                                  padding: 0.5
                                }}
                                onClick={() => handleDeleteNote(note._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Card>
                        </Box>
                      )}
                    </Draggable>
                  )))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
          <Droppable droppableId="dustbin">
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  position: 'fixed',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 100,
                  backgroundColor: snapshot.isDraggingOver ? 'red' : 'rgba(255, 0, 0, 0.5)',
                  display: isDragging ? 'flex' : 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.3s'
                }}
              >
                <DeleteIcon sx={{ fontSize: 40, color: 'white' }} />
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    </Box>
  );
};

export default Notes;
