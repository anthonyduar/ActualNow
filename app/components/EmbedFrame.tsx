"use client";

import { useEffect } from "react";

export default function EmbedFrame() {
  useEffect(() => {
    const isFramed = window.self !== window.top;
    if (!isFramed && window.location.hash !== "#embed") return;

    const root = document.documentElement;
    root.dataset.embedMode = "true";

    if (!isFramed) {
      return () => {
        delete root.dataset.embedMode;
      };
    }

    let animationFrame = 0;
    let lastHeight = 0;

    const sendHeight = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const height = Math.ceil(
          Math.max(root.scrollHeight, document.body.scrollHeight),
        );
        if (height === lastHeight) return;

        lastHeight = height;
        window.parent.postMessage(
          { type: "actualnow:resize", height },
          "*",
        );
      });
    };

    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(root);
    resizeObserver.observe(document.body);
    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight);
    sendHeight();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("load", sendHeight);
      window.removeEventListener("resize", sendHeight);
      delete root.dataset.embedMode;
    };
  }, []);

  return null;
}
