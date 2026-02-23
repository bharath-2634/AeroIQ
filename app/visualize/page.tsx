"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const VisualizeContent = dynamic(
  () => import("../components/visualizeContent"),
  { ssr: false }
);

export default function VisualizePage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <VisualizeContent />
    </Suspense>
  );
}