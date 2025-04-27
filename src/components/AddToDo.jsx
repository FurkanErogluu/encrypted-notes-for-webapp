import { useState } from 'react';
import './AddToDo.css';

const AddToDo = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [category, setCategory] = useState('Genel');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setPriority('normal');
    setCategory('Genel');
    setDueDate('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Görev başlığı"
          className="task-input"
          required
        />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="advanced-toggle"
      >
        {showAdvanced ? 'Basit Mod' : 'Gelişmiş Mod'}
      </button>

      {showAdvanced && (
        <div className="advanced-options">
          <div className="form-group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Görev açıklaması"
              className="description-input"
            />
          </div>

          <div className="form-group">
            <label>Öncelik:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="high">Yüksek</option>
              <option value="normal">Normal</option>
              <option value="low">Düşük</option>
            </select>
          </div>

          <div className="form-group">
            <label>Kategori:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              <option value="Genel">Genel</option>
              <option value="İş">İş</option>
              <option value="Kişisel">Kişisel</option>
              <option value="Okul">Okul</option>
              <option value="Alışveriş">Alışveriş</option>
            </select>
          </div>

          <div className="form-group">
            <label>Son Tarih:</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Etiketler (virgülle ayırın)"
              className="tags-input"
            />
          </div>
        </div>
      )}

      <button type="submit" className="submit-button">
        Görev Ekle
      </button>
    </form>
  );
};

export default AddToDo;