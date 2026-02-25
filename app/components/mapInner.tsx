// "use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Popup,
  CircleMarker,
  } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface FlightMapProps {
  from: { lat: number; lng: number; city: string };
  to: { lat: number; lng: number; city: string };
  path: { lat: number; lng: number }[];
}

export default function MapInner({ from, to, path }: FlightMapProps) {
  // Prefer the path from the API (can be curved); fall back to straight line
  const positions: [number, number][] =
    path && path.length > 1
      ? (path.map((p) => [p.lat, p.lng]) as [number, number][])
      : [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ];

  const bounds = L.latLngBounds(positions);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg bg-[#e6f3ff]">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [48, 48] }}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
        doubleClickZoom={false}
        dragging={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        <Polyline
          positions={positions}
          pathOptions={{ color: "#38bdf8", weight: 4 }}
        />

        <CircleMarker
          center={[from.lat, from.lng]}
          radius={8}
          pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 1 }}
        >
          <Popup>{from.city} (Departure)</Popup>
        </CircleMarker>

        <CircleMarker
          center={[to.lat, to.lng]}
          radius={8}
          pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 1 }}
        >
          <Popup>{to.city} (Arrival)</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}