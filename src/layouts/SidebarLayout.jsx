import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#0D0F18] text-gray-100">

      {/* SIDEBAR */}
      <aside 
        className="w-64 bg-[#111322]/80 backdrop-blur-xl border-r border-white/10 
        fixed inset-y-0 left-0 flex flex-col justify-between shadow-xl">

        {/* TOP AREA */}
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <img
              src="/logobc.png"
              alt="Block Cloud Logo"
              className="w-12 h-12 drop-shadow-[0_0_10px_#3B82F6]"
            />
            <h1 className="text-xl font-extrabold tracking-wide text-cyan-400">
              BLOCK CLOUD
            </h1>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col px-4 py-6 gap-2 text-sm">

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg flex items-center gap-2 transition 
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/40"
                    : "hover:bg-white/5"
                }`
              }
            >
              📋 Mis tareas
            </NavLink>

            <NavLink
              to="/kanban"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg flex items-center gap-2 transition 
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/40"
                    : "hover:bg-white/5"
                }`
              }
            >
              ⏳ Panel por tiempo
            </NavLink>

            <NavLink
              to="/global"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg flex items-center gap-2 transition 
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/40"
                    : "hover:bg-white/5"
                }`
              }
            >
              🌐 Tareas globales
            </NavLink>

            <NavLink
              to="/files"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg flex items-center gap-2 transition 
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/40"
                    : "hover:bg-white/5"
                }`
              }
            >
              🗂 Mis documentos
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg flex items-center gap-2 transition 
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/40"
                    : "hover:bg-white/5"
                }`
              }
            >
              👤 Mi perfil
            </NavLink>
          </nav>
        </div>

        {/* BOTTOM LOGOUT */}
        <div className="px-4 py-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg text-left text-red-400 
            hover:bg-red-500/10 hover:text-red-300 transition"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-6 bg-[#0D0F18] text-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
