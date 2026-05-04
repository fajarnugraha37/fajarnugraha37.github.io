"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { ENV } from "@/lib/env";

/**
 * Analytics Atom
 * 
 * A stateless, declarative component that injects Google Tag Manager.
 * Adheres to Atomic Design principles as a primitive building block.
 */
export const Analytics = () => {
  if (!ENV.GTM_ID) return null;

  return <GoogleTagManager gtmId={ENV.GTM_ID} />;
};
