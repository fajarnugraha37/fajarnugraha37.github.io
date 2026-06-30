"use client";

import React from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Terminal } from "lucide-react";

export function BlogsHeader() {
  return (
    <PageHeader 
      title="BLOG"
      accentText="ARCHIVE"
      tagText="DATA_STREAM // KNOWLEDGE_ARCHIVE"
      tagIcon={Terminal}
      subtitle="Technical essays, system notes, and operational fragments"
      className="mb-12"
    />
  );
}
