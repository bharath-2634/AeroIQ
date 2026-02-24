"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface FlightMap3DProps {
  from: { lat: number; lng: number; city: string };
  to: { lat: number; lng: number; city: string };
}

export default function FlightMap3D({ from, to }: FlightMap3DProps) {

  const arcsData = useMemo(() => [
    {
      startLat: from.lat,
      startLng: from.lng,
      endLat: to.lat,
      endLng: to.lng,
    }
  ], [from, to]);

  const pointsData = useMemo(() => [
    { lat: from.lat, lng: from.lng, size: 0.5, color: "green" },
    { lat: to.lat, lng: to.lng, size: 0.5, color: "red" }
  ], [from, to]);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        arcsData={arcsData}
        arcColor={() => "yellow"}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        pointsData={pointsData}
        pointAltitude={0.01}
        pointColor={(d: any) => d.color}
      />
    </div>
  );
}