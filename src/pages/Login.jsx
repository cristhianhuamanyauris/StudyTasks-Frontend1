import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 🔄 Manejar cambios de inputs
  // ==========================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================================
  // 📩 Enviar login
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setLoading(false);
      onLogin();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales inválidas. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
    bg-gradient-to-br from-[#0D0F18] via-[#131622] to-[#0D0F18]">

      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl 
      border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logobc.png"
            alt="Block Cloud Logo"
            className="w-20 h-20 drop-shadow-[0_0_8px_#3B82F6]"
          />

          <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide mt-4">
            BLOCK CLOUD
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Accede a tu espacio productivo
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
            border border-[#2A2F43] focus:outline-none 
            focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
            border border-[#2A2F43] focus:outline-none 
            focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-2 rounded-lg text-white font-semibold 
            bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg
            hover:opacity-90 transition active:scale-95
            ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 mt-4 text-center text-sm">{error}</p>
        )}

        {/* REGISTRO */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          ¿No tienes cuenta?
          <button
            onClick={() => navigate("/register")}
            className="text-cyan-400 hover:underline font-semibold ml-1"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
