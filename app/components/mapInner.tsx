"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


interface FlightMapProps {
  from: { lat: number; lng: number; city: string };
  to: { lat: number; lng: number; city: string };
  path: { lat: number; lng: number }[];
}

export default function MapInner({ from, to, path }: FlightMapProps) {

  const positions = path.map(p => [p.lat, p.lng]) as [number, number][];

  const bounds = L.latLngBounds(positions);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">

      <MapContainer
        bounds={bounds}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <Polyline
          positions={positions}
          pathOptions={{ color: "yellow", weight: 3 }}
        />

        <CircleMarker
            center={[from.lat, from.lng]}
            radius={8}
            pathOptions={{ color: "green", fillColor: "green", fillOpacity: 1 }}
        >
            <Popup>{from.city} (Departure)</Popup>
        </CircleMarker>

        <CircleMarker
            center={[to.lat, to.lng]}
            radius={8}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
        >
            <Popup>{to.city} (Arrival)</Popup>
        </CircleMarker>

      </MapContainer>
    </div>
  );
}