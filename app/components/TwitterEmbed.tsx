"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function TwitterEmbed() {
  useEffect(() => {
    if ((window as any).twttr?.widgets) {
      (window as any).twttr.widgets.load();
    }
  }, []);

  return (
    <Script
      src="https://platform.twitter.com/widgets.js"
      strategy="afterInteractive"
      onLoad={() => {
        (window as any).twttr?.widgets?.load();
      }}
    />
  );
}
