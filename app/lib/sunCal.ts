import SunCalc from "suncalc";

/* ================================
   TYPES
================================ */

export interface SunPosition {
  azimuth: number; // degrees
  altitude: number; // degrees
}

export interface FlightSunData {
  departureSun: SunPosition;
  arrivalSun: SunPosition;
  scenicSide: "left" | "right" | "both" | "none";
  sunriseTime: Date | null;
  sunsetTime: Date | null;
}

/* ================================
   BASIC UTILS
================================ */

function toDegrees(rad: number) {
  return (rad * 180) / Math.PI;
}

function normalizeAngle(angle: number) {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  return angle;
}

/* ================================
   STRAIGHT LINE PATH (for now)
================================ */

export function generateStraightPath(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  segments: number = 20
): { lat: number; lng: number }[] {
  const path: { lat: number; lng: number }[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    path.push({
      lat: startLat + (endLat - startLat) * t,
      lng: startLng + (endLng - startLng) * t,
    });
  }

  return path;
}

/* ================================
   BEARING CALCULATION
================================ */

export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const λ2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

  const θ = Math.atan2(y, x);

  return normalizeAngle(toDegrees(θ));
}

/* ================================
   SUN POSITION
================================ */

export function getSunPosition(
  date: Date,
  lat: number,
  lng: number
): SunPosition {
  const pos = SunCalc.getPosition(date, lat, lng);

  const azimuth = normalizeAngle(toDegrees(pos.azimuth) + 180);
  const altitude = toDegrees(pos.altitude);

  return { azimuth, altitude };
}

/* ================================
   RELATIVE ANGLE
================================ */

export function calculateSunRelativeAngle(
  flightBearing: number,
  sunAzimuth: number
): number {
  let diff = normalizeAngle(sunAzimuth) - normalizeAngle(flightBearing);

  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff;
}

/* ================================
   DETERMINE SCENIC SIDE
================================ */

export function determineScenicSideFromTrajectory(
  relativeAngles: number[]
): "left" | "right" | "both" | "none" {
  const threshold = 5;

  const hasLeft = relativeAngles.some((a) => a < -threshold);
  const hasRight = relativeAngles.some((a) => a > threshold);

  if (hasLeft && hasRight) return "both";
  if (hasRight) return "right";
  if (hasLeft) return "left";
  return "none";
}

/* ================================
   SUNRISE / SUNSET
================================ */

export function getSunTimes(
  lat: number,
  lng: number,
  date: Date
) {
  const times = SunCalc.getTimes(date, lat, lng);
  return {
    sunrise: times.sunrise ?? null,
    sunset: times.sunset ?? null,
  };
}

/* ================================
   MAIN FLIGHT SUN CALCULATION
================================ */

export function calculateFlightSunData(
  departureLat: number,
  departureLng: number,
  arrivalLat: number,
  arrivalLng: number,
  departureTime: Date,
  flightDurationHours: number
): FlightSunData {

  const arrivalTime = new Date(
    departureTime.getTime() + flightDurationHours * 60 * 60 * 1000
  );

  const departureSun = getSunPosition(
    departureTime,
    departureLat,
    departureLng
  );

  const arrivalSun = getSunPosition(
    arrivalTime,
    arrivalLat,
    arrivalLng
  );

  const { sunrise, sunset } = getSunTimes(
    departureLat,
    departureLng,
    departureTime
  );

  const path = generateStraightPath(
    departureLat,
    departureLng,
    arrivalLat,
    arrivalLng,
    20
  );

  const visibleSunPositions: {
    azimuth: number;
    altitude: number;
    bearing: number;
  }[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const progress = i / (path.length - 1);

    const currentTime = new Date(
      departureTime.getTime() +
        flightDurationHours * progress * 60 * 60 * 1000
    );

    const sunPos = getSunPosition(currentTime, current.lat, current.lng);
    const bearing = calculateBearing(
      current.lat,
      current.lng,
      next.lat,
      next.lng
    );

    // twilight threshold (like senior)
    if (sunPos.altitude > -6) {
      visibleSunPositions.push({
        azimuth: sunPos.azimuth,
        altitude: sunPos.altitude,
        bearing,
      });
    }
  }

  if (visibleSunPositions.length === 0) {
    return {
      departureSun,
      arrivalSun,
      scenicSide: "none",
      sunriseTime: sunrise,
      sunsetTime: sunset,
    };
  }

  const relativeAngles = visibleSunPositions.map((pos) =>
    calculateSunRelativeAngle(pos.bearing, pos.azimuth)
  );

  const scenicSide =
    determineScenicSideFromTrajectory(relativeAngles);

  return {
    departureSun,
    arrivalSun,
    scenicSide,
    sunriseTime: sunrise,
    sunsetTime: sunset,
  };
}

/* ================================
   SEAT GENERATION
================================ */

export function getRecommendedSeats(
  scenicSide: "left" | "right" | "both" | "none",
  totalRows: number = 30
): string[] {
  if (scenicSide === "none") return [];

  const seats: string[] = [];

  for (let row = 1; row <= totalRows; row++) {
    if (scenicSide === "left" || scenicSide === "both") {
      seats.push(`${row}A`);
    }
    if (scenicSide === "right" || scenicSide === "both") {
      seats.push(`${row}F`);
    }
  }

  return seats;
}


export function getScenicSideAtTime(
  lat: number,
  lng: number,
  time: Date,
  bearing: number
): "left" | "right" | "none" {

  const pos = SunCalc.getPosition(time, lat, lng);

  if (pos.altitude <= 0) return "none";

  const azimuth = ((pos.azimuth * 180) / Math.PI + 180) % 360;

  let diff = azimuth - bearing;
  diff = ((diff + 540) % 360) - 180;

  if (Math.abs(diff) < 10) return "none";

  return diff > 0 ? "right" : "left";
}

export function determineFlightViewMode(
  departureTime: Date,
  arrivalTime: Date,
  sunriseTime: Date | null,
  sunsetTime: Date | null
): "sunrise-only" | "sunset-only" | "both" | "none" {

  const hasSunrise =
    sunriseTime &&
    sunriseTime >= departureTime &&
    sunriseTime <= arrivalTime;

  const hasSunset =
    sunsetTime &&
    sunsetTime >= departureTime &&
    sunsetTime <= arrivalTime;

  if (hasSunrise && hasSunset) return "both";
  if (hasSunrise) return "sunrise-only";
  if (hasSunset) return "sunset-only";
  return "none";
}