import { useState } from 'react';
import "./ToDos.css";

const ToDos = ({ tasks, onDelete, onToggleComplete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate,
      tags: task.tags.join(', ')
    });
  };

  const handleSaveEdit = (id) => {
    onUpdate(id, {
      ...editForm,
      tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
    setEditingId(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'normal': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  return (
    <div className="todos-list">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`todo-item ${task.completed ? 'completed' : ''}`}
          style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}
        >
          {editingId === task.id ? (
            <div className="edit-form">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="edit-input"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="edit-textarea"
              />
              <div className="edit-actions">
                <button onClick={() => handleSaveEdit(task.id)} className="save-button">
                  Kaydet
                </button>
                <button onClick={() => setEditingId(null)} className="cancel-button">
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="todo-content">
                <div className="todo-header">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                    className="todo-checkbox"
                  />
                  <h3 className="todo-title">{task.title}</h3>
                </div>
                {task.description && (
                  <p className="todo-description">{task.description}</p>
                )}
                <div className="todo-meta">
                  <span className="todo-category">{task.category}</span>
                  {task.dueDate && (
                    <span className="todo-date">
                      {new Date(task.dueDate).toLocaleString()}
                    </span>
                  )}
                </div>
                {task.tags.length > 0 && (
                  <div className="todo-tags">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="todo-actions">
                <button
                  onClick={() => handleEdit(task)}
                  className="edit-button"
                  title="Düzenle"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="delete-button"
                  title="Sil"
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToDos;
