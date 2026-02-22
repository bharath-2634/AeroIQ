"use client";

import dynamic from "next/dynamic";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Map = dynamic(() => import("./mapInner"), {
  ssr: false,
});

export default Map;