"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies_accepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#000",
        color: "#fff",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        flexDirection: "column",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Botón X */}
      <button
        onClick={handleClose}
        aria-label="Cerrar aviso de cookies"
        style={{
          position: "absolute",
          top: "8px",
          right: "12px",
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "14px",
          cursor: "pointer",
          lineHeight: 1,
          padding: "2px 4px",
          opacity: 0.7,
        }}
      >
        ✕
      </button>

      {/* Mensaje */}
      <p style={{ margin: 0, fontSize: "13px", textAlign: "center" }}>
        Utilizamos cookies para mejorar su experiencia y analizar el tráfico. Al continuar navegando, acepta su uso.
      </p>

      {/* Botones */}
      <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
        <Link
          href="/politica-de-cookies"
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#fff",
            border: "1px solid #fff",
            borderRadius: "20px",
            padding: "6px 16px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          VER MÁS
        </Link>
        <button
          onClick={handleAccept}
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#0ea5e9",
            border: "none",
            borderRadius: "20px",
            padding: "6px 18px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          ACEPTAR
        </button>
      </div>
    </div>
  );
}
