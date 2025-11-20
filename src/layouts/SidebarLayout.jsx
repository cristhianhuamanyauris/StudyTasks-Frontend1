import React from "react";
import { NavLink } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 space-y-6">
        <h2 className="text-xl font-bold">StudyTasks</h2>

        <nav className="flex flex-col gap-3 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            Mis tareas
          </NavLink>

          <NavLink
            to="/global"
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            Tareas globales
          </NavLink>

          {/* ⭐ NUEVO: Botón Mi perfil */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            Mi perfil
          </NavLink>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
};

export default SidebarLayout;
