"use client";

import { AudioManifestEntry } from "@/types";

interface ContentAudioPlayerProps {
  audio: AudioManifestEntry;
  label: string;
}

function formatDuration(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.round(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ContentAudioPlayer({
  audio,
  label,
}: ContentAudioPlayerProps) {
  return (
    <section className="mb-6 md:mb-8 border border-accent/20 bg-card/20 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col gap-4 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">
              [ AUDIO MODE ]
            </div>
            <h2 className="text-sm md:text-base font-semibold text-foreground">
              {label}
            </h2>
            <p className="mt-1 text-xs md:text-sm font-mono text-muted-foreground leading-relaxed">
              Generated with Piper voice <span className="text-foreground">{audio.voice}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.15em]">
            <span className="border border-accent-secondary/20 bg-accent-secondary/5 px-2 py-1 text-accent-secondary">
              {formatDuration(audio.durationSeconds)}
            </span>
            <span className="border border-border px-2 py-1 text-muted-foreground">
              {audio.wordCount} words
            </span>
          </div>
        </div>

        <audio
          controls
          preload="none"
          className="w-full h-11 opacity-90"
        >
          <source src={audio.audioSrc} type="audio/wav" />
          Your browser does not support audio playback.
        </audio>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </section>
  );
}
