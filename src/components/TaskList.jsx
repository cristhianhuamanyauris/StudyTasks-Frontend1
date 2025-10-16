/*
import React from "react";

const TaskList = ({ tasks, onToggle, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta": return "#ff4d4d";
      case "Media": return "#f0ad4e";
      case "Baja": return "#5cb85c";
      default: return "#ccc";
    }
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          <span
            style={{
              color: task.completed ? "#aaa" : "#000",
              textDecoration: task.completed ? "line-through" : "none"
            }}
          >
            {task.title}
          </span>
          <span
            className="priority-tag"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
          <button onClick={() => onToggle(task._id, !task.completed)}>
            {task.completed ? "Desmarcar" : "Completar"}
          </button>
          <button onClick={() => onDelete(task._id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
*/
import React from "react";

const TaskList = ({ tasks, onToggle, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta": return "bg-red-500";
      case "Media": return "bg-yellow-400";
      case "Baja": return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="flex items-center justify-between bg-white shadow-md rounded p-3 transition hover:shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span
              className={`font-medium ${
                task.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {task.title}
            </span>
            <span
              className={`text-white text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onToggle(task._id, !task.completed)}
              className={`px-2 py-1 rounded text-white font-semibold transition ${
                task.completed ? "bg-gray-400 hover:bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {task.completed ? "Desmarcar" : "Completar"}
            </button>

            <button
              onClick={() => onDelete(task._id)}
              className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
