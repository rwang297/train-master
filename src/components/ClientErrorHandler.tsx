"use client";

import { useEffect } from "react";

export default function ClientErrorHandler() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      try {
        const msg = event?.error?.message || event?.message || "";
        // Ignore FullStory network failures (external script). Don't block navigation.
        if (/fullstory|fs\.js|Failed to fetch/i.test(msg)) {
          console.warn("Ignored external script error:", msg);
          try { event.preventDefault?.(); event.stopImmediatePropagation?.(); } catch (e) {}
          return;
        }

        // If a webpack chunk failed to load, try a full reload to recover
        if (/ChunkLoadError|Loading chunk [0-9]+ failed/i.test(msg)) {
          console.error("ChunkLoadError detected, reloading page to recover.", msg);
          // Attempt a single reload to recover
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
      } catch (err) {
        // swallow
      }
    };

    const onRejection = (ev: PromiseRejectionEvent) => {
      try {
        const reason = ev?.reason;
        const msg = (reason && (reason.message || reason.toString())) || "";
        if (/ChunkLoadError|Loading chunk [0-9]+ failed/i.test(msg)) {
          console.error("Chunk load promise rejection, reloading page.", msg);
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
        if (/fullstory|fs\.js|Failed to fetch/i.test(msg)) {
          console.warn("Ignored external fetch rejection:", msg);
          try { ev.preventDefault?.(); ev.stopImmediatePropagation?.(); } catch (e) {}
        }
      } catch (err) {
        // swallow
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
