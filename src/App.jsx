import "./App.css";
import AddNote from "./components/AddNote";
import Notes from "./components/Notes";
import useNotes from "./hooks/useNotes";
import { useState } from "react";

function App() {
  const {
    notes,
    loading,
    error,
    addNote,
    deleteNote,
    updateNote,
    decryptNote
  } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [viewMode, setViewMode] = useState("grid"); // grid veya list

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  // Notları filtrele ve sırala
  const filteredAndSortedNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "createdAt") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="container">
      <div className="header">
        <h1>Not Defteri</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Notlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="view-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">Oluşturulma Tarihi</option>
            <option value="title">Başlık</option>
          </select>
          <div className="view-buttons">
            <button
              className={`view-button ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Kart Görünümü"
            >
              <i className="fas fa-th-large"></i> Kart
            </button>
            <button
              className={`view-button ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Liste Görünümü"
            >
              <i className="fas fa-list"></i> Liste
            </button>
          </div>
        </div>
      </div>

      <div className="content-container">
        <AddNote onAddNote={addNote} />
        {error && <div className="error">{error}</div>}
        <Notes
          notes={filteredAndSortedNotes}
          onDeleteNote={deleteNote}
          onUpdateNote={updateNote}
          onDecryptNote={decryptNote}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}

export default App;
