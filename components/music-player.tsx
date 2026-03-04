"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SONG_SRC = "/ok-chantier-song.mp3";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = new Audio(SONG_SRC);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  }, []);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/40">
        <button
          onClick={toggle}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm transition-transform active:scale-90"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="h-3 w-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex flex-1 items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
              OK Chantier
            </span>
            {playing && <WaveformBars />}
          </div>

          <div
            ref={progressBarRef}
            onClick={seek}
            className="group relative h-1 flex-1 cursor-pointer rounded-full bg-amber-200 dark:bg-amber-800/50"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-amber-500 transition-[width] duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <span className="text-[10px] tabular-nums text-amber-700 dark:text-amber-400 shrink-0">
            {fmt(currentTime)}/{duration ? fmt(duration) : "-:--"}
          </span>
        </div>
      </div>
    </div>
  );
}

function WaveformBars() {
  return (
    <div className="flex items-end gap-[2px] h-2.5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[2px] rounded-full bg-amber-500"
          style={{
            animation: `waveform 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
