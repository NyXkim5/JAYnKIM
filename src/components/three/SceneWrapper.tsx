"use client";

import dynamic from "next/dynamic";

const ParticleField = dynamic(() => import("./ParticleField"), {
  ssr: false,
  loading: () => null,
});

export function SceneWrapper() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <ParticleField />
    </div>
  );
}
