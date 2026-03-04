"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ScrollFadeIn from "../components/ScrollFadeIn";

const VisualizeContent = dynamic(
  () => import("../components/visualizeContent"),
  { ssr: false }
);

export default function VisualizePage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ScrollFadeIn delayMs={200}>
        <VisualizeContent />
      </ScrollFadeIn>
    </Suspense>
  );
}