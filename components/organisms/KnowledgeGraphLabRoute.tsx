"use client";

import dynamic from "next/dynamic";
import { LabRouteFallback } from "@/components/atoms/LabRouteFallback";

const KnowledgeGraphLabContent = dynamic(
  () =>
    import("@/components/organisms/KnowledgeGraphLabContent").then(
      (module) => module.KnowledgeGraphLabContent,
    ),
  {
    ssr: false,
    loading: () => (
      <LabRouteFallback
        label="KNOWLEDGE_GRAPH"
        description="Loading neural map renderer and relationship artifacts."
      />
    ),
  },
);

export function KnowledgeGraphLabRoute() {
  return <KnowledgeGraphLabContent />;
}
