import "./App.css";
import ToDos from "./components/ToDos";
import AddToDo from "./components/AddToDo";
import AddNote from "./components/AddNote";
import Notes from "./components/Notes";
import Features from "./components/Features";
import useTask from "./hooks/useTask";
import useNotes from "./hooks/useNotes";
import { useState } from "react";

function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
    filterTasks,
    sortTasks
  } = useTask();

  const {
    notes,
    addNote,
    deleteNote,
    updateNote
  } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    completed: undefined,
    priority: "",
    category: ""
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [activeTab, setActiveTab] = useState("tasks");

  const filteredAndSortedTasks = sortTasks(
    filterTasks({
      ...filters,
      searchTerm
    }),
    sortBy
  );

  return (
    <div className="container">
      <Features />

      <div className="header">
        <h1>Task Manager</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Görev ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          Görevler
        </button>
        <button
          className={`tab-button ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notlar
        </button>
      </div>

      {activeTab === "tasks" ? (
        <>
          <div className="filters-container">
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="filter-select"
            >
              <option value="">Tüm Öncelikler</option>
              <option value="high">Yüksek</option>
              <option value="normal">Normal</option>
              <option value="low">Düşük</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="filter-select"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="İş">İş</option>
              <option value="Kişisel">Kişisel</option>
              <option value="Okul">Okul</option>
              <option value="Alışveriş">Alışveriş</option>
            </select>

            <select
              value={filters.completed}
              onChange={(e) => setFilters({ ...filters, completed: e.target.value === "true" })}
              className="filter-select"
            >
              <option value="">Tüm Durumlar</option>
              <option value="true">Tamamlananlar</option>
              <option value="false">Tamamlanmayanlar</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="createdAt">Oluşturulma Tarihi</option>
              <option value="priority">Öncelik</option>
              <option value="dueDate">Son Tarih</option>
            </select>
          </div>

          <div className="content-container">
            <AddToDo onAddTask={addTask} />
            <ToDos
              tasks={filteredAndSortedTasks}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              onUpdate={updateTask}
            />
          </div>
        </>
      ) : (
        <div className="content-container">
          <AddNote onAddNote={addNote} />
          <Notes
            notes={notes}
            onDeleteNote={deleteNote}
            onUpdateNote={updateNote}
          />
        </div>
      )}
    </div>
  );
}

export default App;
