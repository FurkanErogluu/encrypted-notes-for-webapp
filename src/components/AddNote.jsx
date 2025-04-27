import { useState } from 'react';
import axios from 'axios';  // axios import edildi
import './AddNote.css';

const AddNote = () => {
  const [noteText, setNoteText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      await axios.post('http://localhost:3001/api/notes', {
        title: noteText.trim(),   // hem başlık hem içerik olarak noteText kullanıyoruz
        content: noteText.trim()
      });

      setNoteText('');
      setIsEditing(false);
      window.location.reload(); // Not eklendiğinde sayfayı yenileyerek listeyi güncelliyoruz
    } catch (error) {
      console.error('Not eklenirken hata oluştu', error);
    }
  };

  return (
    <div className="add-note-container">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="add-note-button"
        >
          + Yeni Not Ekle
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="note-form">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Notunuzu yazın..."
            className="note-textarea"
            autoFocus
          />
          <div className="note-actions">
            <button type="submit" className="save-note-button">
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => {
                setNoteText('');
                setIsEditing(false);
              }}
              className="cancel-note-button"
            >
              İptal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddNote;
