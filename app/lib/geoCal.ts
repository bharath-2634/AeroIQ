const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;

/**
 * Haversine Distance (km) - always returns the shortest great-circle distance
 * between two points on the sphere.
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
 * Longest great-circle distance (km) between two points.
 * This is the complementary arc to the shortest distance around the globe.
 */
export function calculateLongestDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const shortest = calculateDistance(lat1, lon1, lat2, lon2);
  const circumference = 2 * Math.PI * R;
  return circumference - shortest;
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

/**
 * Generate a straight line path between two points (departure and arrival only).
 * Use this when you want the map to show a single straight segment.
 */
export function generateStraightLinePath(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { lat: number; lng: number }[] {
  return [
    { lat: lat1, lng: lon1 },
    { lat: lat2, lng: lon2 },
  ];
}

/**
 * Generate a 2D curved (arc) path between two points using a quadratic Bézier.
 * This is purely for visual styling on flat maps: it bends the straight line
 * between the two coordinates into a smooth arc.
 */
export function generateCurvedBezierPath(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  segments: number = 50,
  curveStrength: number = 0.25
): { lat: number; lng: number }[] {
  const startX = lon1;
  const startY = lat1;
  const endX = lon2;
  const endY = lat2;

  const dx = endX - startX;
  const dy = endY - startY;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const length = Math.sqrt(dx * dx + dy * dy) || 1;

  // Perpendicular unit vector to the straight line
  const nx = -dy / length;
  const ny = dx / length;

  const offset = length * curveStrength;

  const controlX = midX + nx * offset;
  const controlY = midY + ny * offset;

  const path: { lat: number; lng: number }[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const oneMinusT = 1 - t;

    const x =
      oneMinusT * oneMinusT * startX +
      2 * oneMinusT * t * controlX +
      t * t * endX;

    const y =
      oneMinusT * oneMinusT * startY +
      2 * oneMinusT * t * controlY +
      t * t * endY;

    path.push({ lat: y, lng: x });
  }

  return path;
}