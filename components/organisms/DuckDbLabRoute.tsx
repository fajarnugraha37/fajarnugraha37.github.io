"use client";

import dynamic from "next/dynamic";
import { LabRouteFallback } from "@/components/atoms/LabRouteFallback";

const DuckDbLabContent = dynamic(
  () =>
    import("@/components/organisms/DuckDbLabContent").then(
      (module) => module.DuckDbLabContent,
    ),
  {
    ssr: false,
    loading: () => (
      <LabRouteFallback
        label="DUCKDB_LAB"
        description="Initializing client-side analytics runtime and dataset workspace."
      />
    ),
  },
);

export function DuckDbLabRoute() {
  return <DuckDbLabContent />;
}
