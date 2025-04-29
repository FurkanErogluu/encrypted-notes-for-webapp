import { useState } from 'react';

const AddNote = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError('Başlık ve içerik zorunludur');
      return;
    }

    if (isEncrypted && !password) {
      setError('Şifreli not için şifre zorunludur');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('isEncrypted', isEncrypted);
      if (password) {
        formData.append('password', password);
      }
      if (image) {
        formData.append('image', image);
      }

      await onAddNote(formData);
      
      // Formu temizle
      setTitle('');
      setContent('');
      setIsEncrypted(false);
      setPassword('');
      setImage(null);
      setIsExpanded(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Resim boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      setImage(file);
    }
  };

  return (
    <div className={`add-note ${isExpanded ? 'expanded' : ''}`}>
      {!isExpanded ? (
        <button 
          className="add-note-button"
          onClick={() => setIsExpanded(true)}
        >
          <i className="fas fa-plus"></i> Yeni Not Ekle
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="add-note-form">
          <div className="form-header">
            <h2>Yeni Not Ekle</h2>
            <button 
              type="button" 
              className="close-button"
              onClick={() => setIsExpanded(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div className="form-group">
            <label>Başlık:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Not başlığı"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>İçerik:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Not içeriği"
              rows="4"
              className="form-textarea"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Notu Şifrele</span>
            </label>
          </div>
          
          {isEncrypted && (
            <div className="form-group">
              <label>Şifre:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Not şifresi"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Resim:</label>
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-image"></i>
                {image ? image.name : 'Resim Seç'}
              </label>
            </div>
            {image && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Önizleme" 
                  className="preview-image"
                />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => setImage(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button">
              <i className="fas fa-save"></i> Kaydet
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsExpanded(false)}
            >
              <i className="fas fa-times"></i> İptal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddNote;
