import React, { useEffect, useState } from "react";
import {
  getMyProfile,
  updateProfile,
  updateAvatar,
} from "../services/profileApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await updateProfile(form);
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Error actualizando perfil:", err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    try {
      const res = await updateAvatar(file);
      setProfile(res.data);
    } catch (err) {
      console.error("Error subiendo avatar:", err);
    }
  };

  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-400">
        Cargando perfil...
      </div>
    );
  }

  const avatarUrl = avatarPreview
    ? avatarPreview
    : profile.avatar
    ? `http://localhost:5000${profile.avatar}`
    : `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=200&background=0ea5e9&color=fff`;

  return (
    <div className="max-w-4xl mx-auto p-8 text-gray-100">

      {/* HEADER */}
      <h1 className="text-4xl font-extrabold text-cyan-400 mb-10 tracking-wide">
        Mi Perfil
      </h1>

      <div className="glass border border-cyan-400/20 rounded-2xl p-8 shadow-xl">

        {/* AVATAR SECTION */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-cyan-400/40 shadow-xl object-cover"
          />

          <label className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg cursor-pointer hover:opacity-90 active:scale-95 transition">
            Cambiar avatar
            <input type="file" hidden onChange={handleAvatarUpload} />
          </label>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4">
          {editing ? (
            <>
              {/* Editable Inputs */}
              <input
                className="input-normal w-full"
                placeholder="Nombre"
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />

              <input
                className="input-normal w-full"
                placeholder="Apellido"
                value={form.lastName || ""}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />

              <input
                className="input-normal w-full"
                placeholder="Profesión"
                value={form.profession || ""}
                onChange={(e) =>
                  setForm({ ...form, profession: e.target.value })
                }
              />

              <input
                className="input-normal w-full"
                placeholder="País"
                value={form.country || ""}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
              />

              <textarea
                className="input-normal w-full h-28 resize-none"
                placeholder="Biografía"
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              ></textarea>

              <button
                onClick={handleUpdate}
                className="btn-green mt-4"
              >
                Guardar cambios
              </button>
            </>
          ) : (
            <>
              {/* Readonly Data */}
              <p>
                <span className="text-cyan-300 font-semibold">Nombre:</span>{" "}
                {profile.firstName} {profile.lastName}
              </p>

              <p>
                <span className="text-cyan-300 font-semibold">Email:</span>{" "}
                {profile.email}
              </p>

              <p>
                <span className="text-cyan-300 font-semibold">
                  Profesión:
                </span>{" "}
                {profile.profession || "—"}
              </p>

              <p>
                <span className="text-cyan-300 font-semibold">País:</span>{" "}
                {profile.country || "—"}
              </p>

              <p>
                <span className="text-cyan-300 font-semibold">Bio:</span>{" "}
                {profile.bio || "—"}
              </p>

              <button
                onClick={() => setEditing(true)}
                className="btn-blue mt-4"
              >
                Editar perfil
              </button>
            </>
          )}
        </div>

        <p className="text-gray-400 text-sm mt-8">
          Miembro desde:{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
