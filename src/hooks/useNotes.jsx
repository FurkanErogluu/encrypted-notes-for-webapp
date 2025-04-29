// src/hooks/useNotes.js
import { useState, useEffect } from 'react';
import * as api from '../services/api';

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await api.getNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (note) => {
    try {
      const newNote = await api.addNote(note);
      setNotes([...notes, newNote]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const updated = await api.updateNote(id, updatedNote);
      setNotes(notes.map(note =>
        note.id === id ? updated : note
      ));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const decryptNote = async (id, password) => {
    try {
      const decrypted = await api.decryptNote(id, password);
      return decrypted.content;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    deleteNote,
    updateNote,
    decryptNote
  };
};

export default useNotes;
