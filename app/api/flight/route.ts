import { NextRequest, NextResponse } from "next/server";
import { findAirportByCode } from "../../lib/airports";
import { calculateDistance, calculateBearing } from "../../lib/geoCal";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const fromCode = searchParams.get("from");
  const toCode = searchParams.get("to");
  const dt = searchParams.get("dt");

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

  // Calculate distance
  const distance = calculateDistance(
    fromAirport.lat,
    fromAirport.lng,
    toAirport.lat,
    toAirport.lng
  );

  // Calculate bearing
  const bearing = calculateBearing(
    fromAirport.lat,
    fromAirport.lng,
    toAirport.lat,
    toAirport.lng
  );

  // Assume average commercial aircraft speed = 850 km/h
  const averageSpeed = 850;
  const durationHours = distance / averageSpeed;

  const departureTime = new Date(dt);
  const arrivalTime = new Date(
    departureTime.getTime() + durationHours * 60 * 60 * 1000
  );

  return NextResponse.json({
    from: fromAirport,
    to: toAirport,
    distance: distance.toFixed(2),
    bearing: bearing.toFixed(2),
    durationHours: durationHours.toFixed(2),
    departureTime,
    arrivalTime,
  });
}