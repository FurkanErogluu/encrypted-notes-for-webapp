// src/hooks/useNotes.js
import { useState, useEffect } from 'react';

const useNotes = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateNote = (id, text) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, text, updatedAt: new Date() }
        : note
    ));
  };

  return {
    notes,
    addNote,
    deleteNote,
    updateNote
  };
};

export default useNotes;
