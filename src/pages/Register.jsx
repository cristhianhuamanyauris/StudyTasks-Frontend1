import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register({ onRegisterSuccess }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    phone: "",
    profession: "",
    country: "",
    city: "",
    bio: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // 🔄 Manejar estados
  // ==========================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================================
  // 📩 Enviar formulario
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      setMsg("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      setError("");

      onRegisterSuccess && onRegisterSuccess();
    } catch (err) {
      console.error(err);
      setError("❌ Error al registrarte.");
      setMsg("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br 
    from-[#0D0F18] via-[#131622] to-[#0D0F18] px-4 py-8">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 
      rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden 
      flex flex-col lg:flex-row">

        {/* LOGO A LA IZQUIERDA */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center 
        p-8 border-b lg:border-b-0 lg:border-r border-white/10">

          <img
            src="/logobc.png"
            alt="Block Cloud Logo"
            className="w-48 h-48 drop-shadow-[0_0_15px_#3B82F6] animate-pulse"
          />

          <h1 className="text-4xl font-extrabold text-cyan-400 tracking-wide mt-4">
            BLOCK CLOUD
          </h1>

          <p className="text-gray-400 text-sm mt-2 text-center px-4">
            Crea tu cuenta y únete a la plataforma de productividad del futuro.
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="lg:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nombre */}
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="Nombre"
                value={form.firstName}
                onChange={handleChange}
                className="w-1/2 bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
                border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
                focus:ring-cyan-500 transition"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Apellido"
                value={form.lastName}
                onChange={handleChange}
                className="w-1/2 bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
                border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
                focus:ring-cyan-500 transition"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
              border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
              focus:ring-cyan-500 transition"
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
              border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
              focus:ring-cyan-500 transition"
              required
            />

            {/* Fecha de nacimiento */}
            <div>
              <label className="text-gray-400 text-xs ml-1">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg w-full 
                border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
                focus:ring-cyan-500 transition"
              />
            </div>

            {/* Teléfono */}
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
              className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
              border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
              focus:ring-cyan-500 transition"
            />

            {/* País / ciudad */}
            <div className="flex gap-4">
              <input
                type="text"
                name="country"
                placeholder="País"
                value={form.country}
                onChange={handleChange}
                className="w-1/2 bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
                border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
                focus:ring-cyan-500 transition"
              />
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={form.city}
                onChange={handleChange}
                className="w-1/2 bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
                border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
                focus:ring-cyan-500 transition"
              />
            </div>

            {/* Profesión */}
            <input
              type="text"
              name="profession"
              placeholder="Profesión"
              value={form.profession}
              onChange={handleChange}
              className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg 
              border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
              focus:ring-cyan-500 transition"
            />

            {/* Bio */}
            <textarea
              name="bio"
              placeholder="Biografía (opcional)"
              value={form.bio}
              onChange={handleChange}
              className="bg-[#1E2233] text-gray-100 px-3 py-2 rounded-lg h-24 resize-none 
              border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
              focus:ring-cyan-500 transition"
            />

            {/* Botón */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-semibold 
              bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg
              hover:opacity-90 transition active:scale-95"
            >
              Registrarse
            </button>
          </form>

          {/* Mensajes */}
          {msg && (
            <p className="text-green-400 mt-4 text-center">{msg}</p>
          )}
          {error && (
            <p className="text-red-400 mt-4 text-center">{error}</p>
          )}

          {/* Enlace a login */}
          <p className="mt-6 text-center text-gray-400 text-sm">
            ¿Ya tienes cuenta?
            <button
              onClick={() => navigate("/")}
              className="text-cyan-400 hover:underline font-semibold ml-1"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
