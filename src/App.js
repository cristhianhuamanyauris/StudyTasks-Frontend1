// src/App.js
import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GlobalTasks from "./pages/GlobalTasks";
import Profile from "./pages/Profile";

import DocumentEditor from "./pages/DocumentEditor";    // Editor colaborativo
import FileExplorer from "./pages/FileExplorer";        // ⭐ Explorador raíz
import FolderView from "./pages/FolderView";            // ⭐ Vista de carpeta
import TaskKanban from "./pages/TaskKanban";

import SidebarLayout from "./layouts/SidebarLayout";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // LOGIN
  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
    navigate("/dashboard");
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  // Wrapper para leer :id del editor colaborativo
  function DocumentEditorWrapper() {
    const { id } = useParams();
    return <DocumentEditor documentId={id} />;
  }

  // Protege rutas privadas
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/" replace />;
  };

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />

      {/* REGISTRO */}
      <Route
        path="/register"
        element={<Register onRegisterSuccess={() => navigate("/")} />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <SidebarLayout>
              <Dashboard onLogout={handleLogout} />
            </SidebarLayout>
          </PrivateRoute>
        }
      />

      {/* PERFIL */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <SidebarLayout>
              <Profile />
            </SidebarLayout>
          </PrivateRoute>
        }
      />

      {/* TAREAS GLOBALES */}
      <Route
        path="/global"
        element={
          <PrivateRoute>
            <SidebarLayout>
              <GlobalTasks />
            </SidebarLayout>
          </PrivateRoute>
        }
      />

      {/* KANBAN POR TIEMPO */}
        <Route
          path="/kanban"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TaskKanban />
              </SidebarLayout>
            </PrivateRoute>
          }
        />



      {/* ⭐ MIS DOCUMENTOS → (ANTES Documents.jsx) ahora reemplazado por FileExplorer */}
      <Route
        path="/files"
        element={
          <PrivateRoute>
            <SidebarLayout>
              <FileExplorer /> {/* Vista raíz del explorador */}
            </SidebarLayout>
          </PrivateRoute>
        }
      />

      {/* ⭐ CARPETA INTERNA */}
      <Route
        path="/folder/:id"
        element={
          <PrivateRoute>
            <SidebarLayout>
              <FolderView />
            </SidebarLayout>
          </PrivateRoute>
        }
      />

      {/* ⭐ EDITOR DE DOCUMENTOS COLABORATIVOS */}
      <Route
        path="/document/:id"
        element={
          <PrivateRoute>
            <SidebarLayout>
              <DocumentEditorWrapper />
            </SidebarLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
