"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface FlightMap3DProps {
  from: { lat: number; lng: number; city: string };
  to: { lat: number; lng: number; city: string };
  path?: { lat: number; lng: number }[];
  sunTrack?: { lat: number; lng: number; altitude: number }[];
}

export default function FlightMap3D({ from, to, path, sunTrack }: FlightMap3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({
        width: Math.max(0, Math.floor(rect.width)),
        height: Math.max(0, Math.floor(rect.height)),
      });
    });

    ro.observe(el);
    // initial measure
    const rect = el.getBoundingClientRect();
    setSize({
      width: Math.max(0, Math.floor(rect.width)),
      height: Math.max(0, Math.floor(rect.height)),
    });

    return () => ro.disconnect();
  }, []);

  const pathsData = useMemo(() => {
    if (!path || path.length < 2) return [];
    return [
      {
        points: path.map((p) => ({ lat: p.lat, lng: p.lng })),
      },
    ];
  }, [path]);

  const pointsData = useMemo(() => [
    { lat: from.lat, lng: from.lng, size: 0.7, color: "#22c55e" },
    { lat: to.lat, lng: to.lng, size: 0.7, color: "#ef4444" }
  ], [from, to]);

  const [sunIndex, setSunIndex] = useState(0);

  useEffect(() => {
    if (!sunTrack || sunTrack.length === 0) return;
    setSunIndex(0);
    const id = setInterval(() => {
      setSunIndex((prev) => (prev + 1) % sunTrack.length);
    }, 800);
    return () => clearInterval(id);
  }, [sunTrack]);

  const sunPoint = useMemo(() => {
    if (!sunTrack || sunTrack.length === 0) return null;
    const p = sunTrack[sunIndex];
    return { lat: p.lat, lng: p.lng, size: 0.9, color: "#facc15" };
  }, [sunTrack, sunIndex]);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg bg-[#e6f3ff] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full">
        {size.width > 0 && size.height > 0 && (
          <Globe
            width={size.width}
            height={size.height}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="rgba(56,189,248,0.35)"
            atmosphereAltitude={0.18}
            pathsData={pathsData}
            pathPoints="points"
            pathPointLat="lat"
            pathPointLng="lng"
            pathPointAlt={0.02}
            pathColor={() => "#ccc"}
            pathStroke={3.5}
            pointsData={sunPoint ? [...pointsData, sunPoint] : pointsData}
            pointAltitude={0.03}
            pointRadius="size"
            pointColor={(d: any) => d.color}
          />
        )}
      </div>
    </div>
  );
}