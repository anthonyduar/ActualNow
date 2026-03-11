"use client";

import { useEffect } from "react";

export default function XIGEmbed() {
  useEffect(() => {
    // Twitter / X
    if ((window as any).twttr?.widgets) {
      (window as any).twttr.widgets.load();
    } else if (!document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) {
      const s = document.createElement("script");
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      s.charset = "utf-8";
      document.body.appendChild(s);
    }

    // Instagram
    if ((window as any).instgrm?.Embeds) {
      (window as any).instgrm.Embeds.process();
    } else if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return null;
}
