"use client";
import { useEffect, useState } from "react";

export default function SafeDate({
  format = "full",
}: {
  format?: "full" | "year";
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className="opacity-0">...</span>;

  if (format === "year") return <>{new Date().getFullYear()}</>;

  return (
    <>
      {new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </>
  );
}
