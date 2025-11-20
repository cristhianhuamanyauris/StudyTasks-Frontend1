import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";
import { createDocument as apiCreateDocument } from "../utils/documentApi";

const Dashboard = ({ onLogout }) => {
  // -------- TAREAS --------
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("Todas");

  // -------- DOCUMENTOS --------
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  // Cargar tareas + documentos al inicio
  useEffect(() => {
    fetchTasks();
    fetchDocuments();
  }, []);

  // ----------- TAREAS -----------
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error al cargar tareas", err);
    }
  };

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await API.put(`/tasks/${id}`, { completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error al actualizar tarea", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea", err);
    }
  };

  // 👉 NUEVO: cuando una tarea se actualiza (adjunto, global, etc.)
  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  // 👉 NUEVO: marcar tarea como global
  const handleMakeGlobal = async (id) => {
    try {
      const res = await API.put(`/tasks/${id}/make-global`);
      handleTaskUpdated(res.data);
      alert("Tarea publicada en tareas globales");
    } catch (err) {
      console.error("Error al publicar tarea global", err);
      alert("No se pudo publicar la tarea");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesPriority =
      filterPriority === "Todas" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // ----------- DOCUMENTOS (colaborativos) -----------
  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Error al cargar documentos", err);
    }
  };

  const createDocument = async () => {
    try {
      const newDocId = await apiCreateDocument("Nuevo documento");
      navigate(`/documents/${newDocId}`);
      fetchDocuments();
    } catch (err) {
      console.error("Error al crear documento", err);
      alert("No se pudo crear el documento");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* ---------- CABECERA ---------- */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis tareas</h1>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Formulario */}
        <TaskForm onAdd={handleAddTask} />

        {/* Barra de progreso */}
        <div className="my-4">
          <ProgressBar tasks={tasks} />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/2"
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/4"
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Lista de tareas */}
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onTaskUpdated={handleTaskUpdated}   // 👈 nuevo
          onMakeGlobal={handleMakeGlobal}     // 👈 nuevo
        />

        {/* --------- DOCUMENTOS COLABORATIVOS (lo que ya tenías) --------- */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Mis documentos</h2>

            <button
              onClick={createDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              + Crear documento
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition shadow-sm"
                onClick={() => navigate(`/documents/${doc._id}`)}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-gray-500 mb-3">
                  Última edición: {new Date(doc.updatedAt).toLocaleString()}
                </p>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {doc.hasContent
                    ? "Contenido colaborativo guardado"
                    : "Documento vacío"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
