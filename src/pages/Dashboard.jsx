// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import API, {
  addSubtask,
  toggleSubtask,
  deleteSubtask,
} from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";
import EditTaskModal from "../components/EditTaskModal";

const Dashboard = ({ onLogout }) => {
  // -------- ESTADOS --------
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("Todas");
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  // Cargar tareas al inicio
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error al cargar tareas", err);
    }
  };

  // ⭐ Normalizar respuestas
  const normalizeTask = (data) => (data?.task ? data.task : data);

  // -------- CRUD de TAREAS --------

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await API.put(`/tasks/${id}`, { completed });
      handleTaskUpdated(normalizeTask(res.data));
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

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id
          ? {
              ...updatedTask,
              attachments: [...(updatedTask.attachments || [])],
              subtasks: updatedTask.subtasks.map((sub) => ({
                ...sub,
                attachments: [...(sub.attachments || [])],
              })),
            }
          : task
      )
    );
  };

  const handleMakeGlobal = async (id) => {
    try {
      const res = await API.put(`/tasks/${id}/make-global`);
      handleTaskUpdated(normalizeTask(res.data));
      alert("Tarea publicada en tareas globales");
    } catch (err) {
      console.error("Error al publicar tarea global", err);
      alert("No se pudo publicar la tarea");
    }
  };

  // -------- EDITAR TAREA --------
  const handleEditTask = (task) => {
    setTaskBeingEdited(task);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const res = await API.put(`/tasks/${updatedTask._id}`, {
        title: updatedTask.title,
        priority: updatedTask.priority,
      });

      handleTaskUpdated(normalizeTask(res.data));
      setTaskBeingEdited(null);
    } catch (err) {
      console.error("Error actualizando tarea", err);
    }
  };

  // -------- SUBTAREAS --------

  const handleAddSub = async (taskId, text) => {
    try {
      const res = await addSubtask(taskId, text);
      handleTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error agregando subtarea:", err);
    }
  };

  const handleToggleSub = async (taskId, subId, done) => {
    try {
      const res = await toggleSubtask(taskId, subId, done);
      handleTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error actualizando subtarea:", err);
    }
  };

  const handleDeleteSub = async (taskId, subId) => {
    if (!window.confirm("¿Eliminar esta subtarea?")) return;

    try {
      const res = await deleteSubtask(taskId, subId);
      handleTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error eliminando subtarea:", err);
    }
  };

  // -------- FILTROS --------

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority =
      filterPriority === "Todas" || task.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  // -------- UI --------

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
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/4"
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
          onTaskUpdated={handleTaskUpdated}
          onMakeGlobal={handleMakeGlobal}
          onEdit={handleEditTask}
          onAddSub={handleAddSub}
          onToggleSub={handleToggleSub}
          onDeleteSub={handleDeleteSub}
          normalizeTask={normalizeTask}
        />
      </div>

      {/* MODAL DE EDICIÓN */}
      {taskBeingEdited && (
        <EditTaskModal
          task={taskBeingEdited}
          onClose={() => setTaskBeingEdited(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
