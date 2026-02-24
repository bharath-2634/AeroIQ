const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;

/**
 * Haversine Distance (km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Initial Bearing (degrees)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

  const θ = Math.atan2(y, x);

  return (toDegrees(θ) + 360) % 360;
}

/**
 * Generate Great Circle Path Points
 */
/*
export function generateGreatCirclePath(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  segments: number = 50
): { lat: number; lng: number }[] {
  const φ1 = toRadians(lat1);
  const λ1 = toRadians(lon1);
  const φ2 = toRadians(lat2);
  const λ2 = toRadians(lon2);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) *
            Math.cos(φ2) *
            Math.sin((λ2 - λ1) / 2) ** 2
      )
    );

  const path: { lat: number; lng: number }[] = [];

  for (let i = 0; i <= segments; i++) {
    const f = i / segments;

    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x =
      A * Math.cos(φ1) * Math.cos(λ1) +
      B * Math.cos(φ2) * Math.cos(λ2);

    const y =
      A * Math.cos(φ1) * Math.sin(λ1) +
      B * Math.cos(φ2) * Math.sin(λ2);

    const z = A * Math.sin(φ1) + B * Math.sin(φ2);

    const φi = Math.atan2(z, Math.sqrt(x * x + y * y));
    const λi = Math.atan2(y, x);

    path.push({
      lat: toDegrees(φi),
      lng: toDegrees(λi),
    });
  }

  return path;
}
*/

export function generateGreatCirclePath(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  segments: number = 50,
  type: "shortest" | "longest" = "shortest"
): { lat: number; lng: number }[] {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const λ1 = toRad(lon1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lon2);

  let Δ = 2 * Math.asin(
    Math.sqrt(
      Math.sin((φ2 - φ1) / 2) ** 2 +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin((λ2 - λ1) / 2) ** 2
    )
  );

  if (type === "longest") {
    Δ = 2 * Math.PI - Δ;
  }

  const path: { lat: number; lng: number }[] = [];

  for (let i = 0; i <= segments; i++) {
    const f = i / segments;

    const A = Math.sin((1 - f) * Δ) / Math.sin(Δ);
    const B = Math.sin(f * Δ) / Math.sin(Δ);

    const x =
      A * Math.cos(φ1) * Math.cos(λ1) +
      B * Math.cos(φ2) * Math.cos(λ2);

    const y =
      A * Math.cos(φ1) * Math.sin(λ1) +
      B * Math.cos(φ2) * Math.sin(λ2);

    const z =
      A * Math.sin(φ1) +
      B * Math.sin(φ2);

    const φi = Math.atan2(z, Math.sqrt(x * x + y * y));
    const λi = Math.atan2(y, x);

    path.push({
      lat: toDeg(φi),
      lng: toDeg(λi),
    });
  }

  return path;
}