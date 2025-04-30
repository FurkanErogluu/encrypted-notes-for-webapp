import { useState } from 'react';

const Notes = ({ notes, onDeleteNote, onUpdateNote, onDecryptNote, viewMode }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editIsEncrypted, setEditIsEncrypted] = useState(false);
  const [editPassword, setEditPassword] = useState('');
  const [decryptingId, setDecryptingId] = useState(null);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditIsEncrypted(note.is_encrypted);
    setEditPassword('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!editTitle || !editContent) {
      setError('Başlık ve içerik zorunludur');
      return;
    }

    if (editIsEncrypted && !editPassword) {
      setError('Şifreli not için şifre zorunludur');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);
      formData.append('isEncrypted', editIsEncrypted);
      if (editPassword) {
        formData.append('password', editPassword);
      }

      await onUpdateNote(editingId, formData);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setError(null);

    if (!decryptPassword) {
      setError('Şifre gerekli');
      return;
    }

    try {
      const content = await onDecryptNote(decryptingId, decryptPassword);
      setDecryptingId(null);
      setDecryptPassword('');
      // Notu güncelle
      const formData = new FormData();
      formData.append('title', notes.find(note => note.id === decryptingId).title);
      formData.append('content', content);
      formData.append('isEncrypted', 'false');
      await onUpdateNote(decryptingId, formData);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`notes ${viewMode}`}>
      {error && <div className="error">{error}</div>}
      {notes.map((note) => (
        <div key={note.id} className="note">
          {editingId === note.id ? (
            <form onSubmit={handleUpdate} className="edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Not başlığı"
                className="edit-input"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Not içeriği"
                rows="4"
                className="edit-textarea"
              />
              <label className="encrypt-label">
                <input
                  type="checkbox"
                  checked={editIsEncrypted}
                  onChange={(e) => setEditIsEncrypted(e.target.checked)}
                />
                Notu Şifrele
              </label>
              {editIsEncrypted && (
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Not şifresi"
                  className="edit-input"
                />
              )}
              <div className="note-actions">
                <button type="submit" className="save-button">Kaydet</button>
                <button type="button" onClick={() => setEditingId(null)} className="cancel-button">
                  İptal
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className="note-date">{formatDate(note.created_at)}</span>
              </div>
              {note.is_encrypted ? (
                decryptingId === note.id ? (
                  <form onSubmit={handleDecrypt} className="decrypt-form">
                    <input
                      type="password"
                      value={decryptPassword}
                      onChange={(e) => setDecryptPassword(e.target.value)}
                      placeholder="Not şifresi"
                      className="decrypt-input"
                    />
                    <div className="note-actions">
                      <button type="submit" className="decrypt-button">Aç</button>
                      <button type="button" onClick={() => setDecryptingId(null)} className="cancel-button">
                        İptal
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="encrypted-content">
                    <p>Şifrelenmiş içerik</p>
                    <button onClick={() => setDecryptingId(note.id)} className="decrypt-button">
                      Notu Aç
                    </button>
                  </div>
                )
              ) : (
                <p className="note-content">{note.content}</p>
              )}
              {note.image_url && (
                <div className="note-image-container">
                  <img 
                    src={`http://localhost:5000${note.image_url}`} 
                    alt="Not resmi" 
                    className="note-image" 
                  />
                </div>
              )}
              <div className="note-actions">
                <button onClick={() => handleEdit(note)} className="edit-button">Düzenle</button>
                <button onClick={() => onDeleteNote(note.id)} className="delete-button">Sil</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notes;
