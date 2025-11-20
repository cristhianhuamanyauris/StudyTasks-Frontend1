// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DocumentEditor from "./pages/DocumentEditor";
import GlobalTasks from "./pages/GlobalTasks";
import Profile from "./pages/Profile";          // ⭐ IMPORTANTE
import SidebarLayout from "./layouts/SidebarLayout";

import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // ---- LOGIN ----
  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
    navigate("/dashboard");
  };

  // ---- LOGOUT ----
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  // Para leer params en el editor
  function DocumentEditorWrapper() {
    const { id } = useParams();
    return <DocumentEditor documentId={id} />;
  }

  return (
    <Routes>
      {/* ---------------- LOGIN ---------------- */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />

      {/* ---------------- REGISTRO ---------------- */}
      <Route
        path="/register"
        element={<Register onRegisterSuccess={() => navigate("/")} />}
      />

      {/* ---------------- DASHBOARD ---------------- */}
      <Route
        path="/dashboard"
        element={
          token ? (
            <SidebarLayout>
              <Dashboard onLogout={handleLogout} />
            </SidebarLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ---------------- PERFIL ---------------- */}
      <Route
        path="/profile"
        element={
          token ? (
            <SidebarLayout>
              <Profile />
            </SidebarLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ---------------- TAREAS GLOBALES ---------------- */}
      <Route
        path="/global"
        element={
          token ? (
            <SidebarLayout>
              <GlobalTasks />
            </SidebarLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ---------------- DOCUMENT EDITOR ---------------- */}
      <Route
        path="/documents/:id"
        element={
          token ? (
            <SidebarLayout>
              <DocumentEditorWrapper />
            </SidebarLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
