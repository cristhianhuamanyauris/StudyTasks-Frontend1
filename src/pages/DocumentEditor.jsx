// src/pages/DocumentEditor.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";

import { io } from "socket.io-client";
import * as Y from "yjs";
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from "y-prosemirror";
import { Awareness } from "y-protocols/awareness";
import * as awarenessProtocol from "y-protocols/awareness";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { deleteDocument } from "../utils/documentApi";

const SOCKET_URL = "http://localhost:5000";

export default function DocumentEditor({ documentId }) {
  const [title, setTitle] = useState("");
  const [docData, setDocData] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [joinError, setJoinError] = useState("");

  // 🧠 Yjs
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yXmlFragment = useMemo(() => ydoc.getXmlFragment("prosemirror"), [ydoc]);
  const awareness = useMemo(() => new Awareness(ydoc), [ydoc]);

  const localUser = useMemo(() => {
    const colors = ["#4ff", "#0f0", "#f0f", "#0ff", "#ff0"];
    return {
      name: "Usuario",
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, []);

  const socketRef = useRef(null);

  // 📝 TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
    ],
    content: "",
    onCreate: ({ editor }) => {
      editor.registerPlugin(ySyncPlugin(yXmlFragment));
      editor.registerPlugin(yCursorPlugin(awareness));
      editor.registerPlugin(yUndoPlugin());
    },
  });

  // 🔌 Socket.io conexión
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
      });

      socketRef.current.on("join-error", (msg) =>
        setJoinError(msg || "No tienes acceso a este documento")
      );
    }
  }, []);

  // 📄 cargar metadatos del documento
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${SOCKET_URL}/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTitle(data.title);
      setDocData(data);
    };

    load();
  }, [documentId]);

  // 👥 Awareness local
  useEffect(() => {
    awareness.setLocalState({ user: localUser, cursor: null });
    return () => awareness.setLocalState(null);
  }, []);

  // 🔄 Sincronización Yjs ↔ Socket.io
  useEffect(() => {
    if (!socketRef.current || !editor) return;

    const socket = socketRef.current;
    const token = localStorage.getItem("token");

    socket.emit("join-document", { documentId, token });

    const applyRemote = (update) =>
      Y.applyUpdate(ydoc, Uint8Array.from(update), "socket");

    socket.on("document-state", applyRemote);
    socket.on("sync-update", applyRemote);

    socket.on("awareness-update", (update) => {
      awarenessProtocol.applyAwarenessUpdate(
        awareness,
        Uint8Array.from(update),
        "socket"
      );
    });

    ydoc.on("update", (u, origin) => {
      if (origin !== "socket") {
        socket.emit("sync-update", Array.from(u));
      }
    });

    awareness.on("update", ({ added, updated, removed }, origin) => {
      if (origin === "socket") return;
      const clients = [...added, ...updated, ...removed];
      const packet = awarenessProtocol.encodeAwarenessUpdate(
        awareness,
        clients
      );
      socket.emit("awareness-update", Array.from(packet));
    });
  }, [editor]);

  // 💾 Guardar documento
  const saveDocument = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${SOCKET_URL}/api/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const updated = await res.json();
    setTitle(updated.title);

    if (updated.fileNodeId) {
      await fetch(`${SOCKET_URL}/api/fileNodes/${updated.fileNodeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: updated.title }),
      });
    }

    socketRef.current.emit("save-document");
  };

  // ➕ INVITAR A COLABORADOR
  const inviteCollaborator = async () => {
    if (!inviteEmail) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${SOCKET_URL}/api/documents/${documentId}/collaborators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setDocData(data);
    setInviteEmail("");
  };

  // ❌ ELIMINAR COLABORADOR
  const removeCollaborator = async (userId) => {
    if (!window.confirm("¿Quitar acceso a este colaborador?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${SOCKET_URL}/api/documents/${documentId}/collaborators/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Error al eliminar");

    setDocData(data); // Actualizar UI
  };

  // EXPORTAR
  const exportAsText = () => {
    const blob = new Blob([editor.getText()], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title}.txt`;
    a.click();
  };

  const exportAsHTML = () => {
    const blob = new Blob([editor.getHTML()], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title}.html`;
    a.click();
  };

  const exportAsPDF = async () => {
    const el = document.querySelector(".tiptap");
    const canvas = await html2canvas(el);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 0);
    pdf.save(`${title}.pdf`);
  };

  // UI
  const Toolbar = () => (
    <div className="glass flex flex-wrap gap-2 p-3 rounded-lg border border-cyan-400/20 shadow-lg mb-4">
      <button className="tool-btn font-bold" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button className="tool-btn italic font-bold" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button className="tool-btn underline font-bold" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>

      <input type="color" className="tool-color" onChange={(e)=>editor.chain().focus().setColor(e.target.value).run()} />

      <select className="tool-select" onChange={(e)=>editor.chain().focus().setFontSize(e.target.value).run()}>
        {[12,14,16,18,24,30,36].map(px => <option key={px}>{px}px</option>)}
      </select>

      <select className="tool-select" onChange={(e)=>editor.chain().focus().setFontFamily(e.target.value).run()}>
        <option>Arial</option>
        <option>Georgia</option>
        <option>Courier New</option>
        <option>Times New Roman</option>
      </select>

      <button className="tool-btn" onClick={()=>editor.chain().focus().setTextAlign("left").run()}>⬅️</button>
      <button className="tool-btn" onClick={()=>editor.chain().focus().setTextAlign("center").run()}>☰</button>
      <button className="tool-btn" onClick={()=>editor.chain().focus().setTextAlign("right").run()}>➡️</button>
      <button className="tool-btn" onClick={()=>editor.chain().focus().setTextAlign("justify").run()}>📐</button>
    </div>
  );

  if (!editor) return <p className="text-gray-300 p-8">Cargando editor...</p>;

  if (joinError)
    return (
      <div className="p-8 text-center text-red-400">
        <h2 className="text-2xl font-bold">Acceso Denegado</h2>
        <p className="mt-2">{joinError}</p>
      </div>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 text-gray-100">

      <input
        className="bg-[#1E2233] text-cyan-300 text-3xl font-bold px-4 py-2 rounded-lg border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Toolbar />

      <div className="flex flex-wrap gap-3">

        <button className="btn-blue" onClick={saveDocument}>💾 Guardar</button>
        <button className="btn-gray" onClick={exportAsText}>TXT</button>
        <button className="btn-purple" onClick={exportAsHTML}>HTML</button>
        <button className="btn-red" onClick={exportAsPDF}>PDF</button>

        <input
          type="email"
          placeholder="Email colaborador"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="input-normal"
        />

        <button className="btn-green" onClick={inviteCollaborator}>+ Invitar</button>

        <button
          className="btn-red"
          onClick={async () => {
            if (!window.confirm("¿Eliminar documento?")) return;
            await deleteDocument(documentId);
            window.location.href = "/dashboard";
          }}
        >
          🗑 Eliminar
        </button>
      </div>

      {docData && (
        <div className="glass p-4 rounded-lg border border-white/10 shadow-lg">
          <p><b className="text-cyan-300">Propietario:</b> {docData.owner?.name}</p>

          <p className="mt-2 text-cyan-300 font-semibold">Colaboradores</p>
          <ul className="ml-6 space-y-2">
            {docData.collaborators.map((c) => (
              <li key={c._id} className="flex justify-between items-center">
                <span>{c.name} ({c.email})</span>

                <button
                  onClick={() => removeCollaborator(c._id)}
                  className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass p-5 rounded-lg border border-cyan-400/20 shadow-xl">
        <EditorContent editor={editor} className="tiptap min-h-[600px] text-gray-100" />
      </div>
    </div>
  );
}
