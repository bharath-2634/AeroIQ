import { NextRequest, NextResponse } from "next/server";
import { findAirportByCode } from "../../lib/airports";
import {
  calculateDistance,
  calculateLongestDistance,
  generateStraightLinePath,
  generateCurvedBezierPath,
} from "../../lib/geoCal";
import {
  calculateFlightSunData,
  getRecommendedSeats,
  calculateBearing,
} from "../../lib/sunCal";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const fromCode = searchParams.get("from");
  const toCode = searchParams.get("to");
  const dt = searchParams.get("dt");
  // Path style: "straight" = straight line, "curved" = Bézier arc (map shape)
  const pathStyleParam = searchParams.get("pathStyle");
  // Distance type: "longest" (default) or "shortest" for the numeric distance
  const distanceTypeParam = searchParams.get("distanceType");

  if (!fromCode || !toCode || !dt) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  const fromAirport = findAirportByCode(fromCode);
  const toAirport = findAirportByCode(toCode);

  if (!fromAirport || !toAirport) {
    return NextResponse.json(
      { error: "Invalid airport code" },
      { status: 400 }
    );
  }

  /* ===========================
     DISTANCE + BEARING
  =========================== */

  const distanceType =
    distanceTypeParam === "shortest" ? "shortest" : "longest";

  const shortestDistance = calculateDistance(
    fromAirport.lat,
    fromAirport.lng,
    toAirport.lat,
    toAirport.lng
  );

  const longestDistance = calculateDistance(
    fromAirport.lat,
    fromAirport.lng,
    toAirport.lat,
    toAirport.lng
  );

  const distance =
    distanceType === "shortest" ? shortestDistance : longestDistance;

  const bearing = calculateBearing(
    fromAirport.lat,
    fromAirport.lng,
    toAirport.lat,
    toAirport.lng
  );

  const averageSpeed = 850;
  const durationHours = shortestDistance / averageSpeed;

  const departureTime = new Date(dt);
  const arrivalTime = new Date(
    departureTime.getTime() + durationHours * 60 * 60 * 1000
  );

  /* ===========================
     PATH: straight line 
  =========================== */

  const path = generateStraightLinePath(
          fromAirport.lat,
          fromAirport.lng,
          toAirport.lat,
          toAirport.lng
        );
      


  /* ===========================
     SUN CALCULATION
  =========================== */

  const sunDataRaw = calculateFlightSunData(
    fromAirport.lat,
    fromAirport.lng,
    toAirport.lat,
    toAirport.lng,
    departureTime,
    durationHours
  );

  const recommendedSeats = getRecommendedSeats(
    sunDataRaw.scenicSide,
    30
  );

  const exposurePercentage =
    sunDataRaw.scenicSide === "none" ? 0 : 100;

  return NextResponse.json({
    from: fromAirport,
    to: toAirport,
    distance: distance.toFixed(2),
    bearing: bearing.toFixed(2), // ✅ added back
    durationHours: durationHours.toFixed(2),
    departureTime,
    arrivalTime,
    path,
    sunData: {
      scenicSide: sunDataRaw.scenicSide,
      recommendedSeats,
      sunriseTime: sunDataRaw.sunriseTime,
      sunsetTime: sunDataRaw.sunsetTime,
      departureSunAltitude: sunDataRaw.departureSun.altitude,
      arrivalSunAltitude: sunDataRaw.arrivalSun.altitude,
      exposurePercentage,
      timeline: sunDataRaw.timeline,
    },
  });
}