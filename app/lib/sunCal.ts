import SunCalc from "suncalc";

/**
 * Compute relative angle between sun and aircraft heading
 */
export function computeRelativeAngle(
  lat: number,
  lng: number,
  time: Date,
  flightBearing: number
): number | null {

  const sunPosition = SunCalc.getPosition(time, lat, lng);

  // Ignore if sun below horizon
  if (sunPosition.altitude <= 0) return null;

  const sunAzimuth = (sunPosition.azimuth * 180) / Math.PI + 180;

  let diff = sunAzimuth - flightBearing;

  diff = ((diff + 540) % 360) - 180;

  return diff;
}

/**
 * Determine scenic side from full trajectory
 */
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

/**
 * Generate recommended seats based on scenic side
 */
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

/**
 * Get sunrise and sunset time for a location
 */
export function getSunTimes(
  lat: number,
  lng: number,
  date: Date
) {
  const times = SunCalc.getTimes(date, lat, lng);

  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
  };
}

/**
 * Get sun altitude at specific time
 */
export function getSunAltitude(
  lat: number,
  lng: number,
  time: Date
): number {
  const pos = SunCalc.getPosition(time, lat, lng);
  return pos.altitude; // radians
}