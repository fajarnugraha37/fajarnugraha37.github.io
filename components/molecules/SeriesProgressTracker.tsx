"use client";

import { useEffect } from "react";

interface SeriesProgressTrackerProps {
  seriesSlug: string;
  partSlug: string;
}

export function SeriesProgressTracker({
  seriesSlug,
  partSlug,
}: SeriesProgressTrackerProps) {
  useEffect(() => {
    try {
      localStorage.setItem(`series-progress:${seriesSlug}`, partSlug);
    } catch {
      return;
    }
  }, [partSlug, seriesSlug]);

  return null;
}
