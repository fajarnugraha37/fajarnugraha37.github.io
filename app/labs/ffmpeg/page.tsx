import { Metadata } from "next";
import { FFmpegLabRoute } from "@/components/organisms/FFmpegLabRoute";

export const metadata: Metadata = {
  title: "FFmpeg Lab | Fajar Abdi Nugraha",
  description: "High-performance client-side media transcoding and signal processing using FFmpeg WASM.",
};

/**
 * FFmpeg Media Laboratory Page
 * Features a WASM-based signal processor for in-browser video/audio manipulation.
 */
export default function FFmpegLab() {
  return <FFmpegLabRoute />;
}
