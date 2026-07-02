"use client";

import dynamic from "next/dynamic";
import { LabRouteFallback } from "@/components/atoms/LabRouteFallback";

const FFmpegLabContent = dynamic(
  () =>
    import("@/components/organisms/FFmpegLabContent").then(
      (module) => module.FFmpegLabContent,
    ),
  {
    ssr: false,
    loading: () => (
      <LabRouteFallback
        label="FFMPEG_LAB"
        description="Loading browser-side media processing engine and control surface."
      />
    ),
  },
);

export function FFmpegLabRoute() {
  return <FFmpegLabContent />;
}
