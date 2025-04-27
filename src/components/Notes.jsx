import axios from 'axios';
import { useEffect, useState } from "react";
import Note from './Notes.css'; // zaten var

function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/notes');
      setNotes(res.data);
    } catch (error) {
      console.error('Notlar alınırken hata oluştu', error);
    }
  };

  return (
    <div className="notes">
      {notes.map((note) => (
        <Note 
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
        />
      ))}
    </div>
  );
}

export default Notes;
