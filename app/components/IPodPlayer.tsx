"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { IPod } from "ipod-simulator/react";
import type { Artist, Playlist, Song } from "ipod-simulator";

interface IPodPlayerProps {
  songs: Song[];
  playlists: Playlist[];
  artists: Artist[];
  children?: ReactNode;
}

const IPOD_WIDTH = 415;
const IPOD_HEIGHT = 692;
// The package draws a faded reflection below the body; reserve room for it.
const REFLECTION_HEIGHT = 190;
const STAGE_PADDING = 12;

export default function IPodPlayer({ songs, playlists, artists, children }: IPodPlayerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const probe = probeRef.current;
    if (!frame || !probe) return;

    const visualViewport = window.visualViewport;
    let frameId = 0;

    const update = () => {
      frameId = 0;
      const width = visualViewport?.width ?? window.innerWidth;
      const height = visualViewport?.height ?? window.innerHeight;
      const chrome = probe.getBoundingClientRect().width || 104;
      const fullWidth = IPOD_WIDTH + STAGE_PADDING * 2;
      const fullHeight = IPOD_HEIGHT + REFLECTION_HEIGHT + STAGE_PADDING * 2;
      const scale = Math.max(
        0.2,
        Math.min(1, (width - 24) / fullWidth, (height - chrome) / fullHeight),
      );
      frame.style.setProperty("--ipod-scale", scale.toFixed(4));
    };

    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule);
    visualViewport?.addEventListener("resize", schedule);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      visualViewport?.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="device-frame" ref={frameRef}>
      <div className="chrome-probe" ref={probeRef} aria-hidden="true" />
      {children}
      <section className="stage" aria-label="Interactive iPod music player">
        <IPod
          className="ipod"
          songs={songs}
          playlists={playlists}
          artists={artists}
          onError={(cause) => setError(cause.message)}
        />
        {error && (
          <p className="device-error" role="status">
            The player could not start: {error}
          </p>
        )}
      </section>
    </div>
  );
}
