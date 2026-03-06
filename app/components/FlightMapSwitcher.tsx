"use client";

import dynamic from "next/dynamic";
import FlightMap3D from "./flight3DMap";

const FlightMap2D = dynamic(() => import("./flightMap"), { ssr: false });

export type MapMode = "2d" | "3d";

interface FlightMapSwitcherProps {
  mode: MapMode;
  from: { lat: number; lng: number; city: string };
  to: { lat: number; lng: number; city: string };
  path: { lat: number; lng: number }[];
  sunTrack?: { lat: number; lng: number; altitude: number }[];
}

export default function FlightMapSwitcher({
  mode,
  from,
  to,
  path,
  sunTrack,
}: FlightMapSwitcherProps) {
  if (mode === "3d") {
    return <FlightMap3D from={from} to={to} path={path} sunTrack={sunTrack} />;
  }

  return <FlightMap2D from={from} to={to} path={path} sunTrack={sunTrack} />;
}

