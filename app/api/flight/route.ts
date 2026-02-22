import { NextRequest, NextResponse } from "next/server";
import { findAirportByCode } from "../../lib/airports";
import { calculateDistance, calculateBearing, generateGreatCirclePath  } from "../../lib/geoCal";
import { computeRelativeAngle, determineScenicSideFromTrajectory, getRecommendedSeats,getSunTimes, getSunAltitude } from "../../lib/sunCal";

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

  // Calculate great circle path (Interpolation points from departure to arrival)
  const path = generateGreatCirclePath(
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

  // Sun best senic view calculation
    const totalPoints = path.length;
    const relativeAngles: number[] = [];

    for (let i = 0; i < totalPoints; i++) {

        const progress = i / (totalPoints - 1);

        const currentTime = new Date(
            departureTime.getTime() +
            progress * durationHours * 3600 * 1000
        );

        const angle = computeRelativeAngle(
            path[i].lat,
            path[i].lng,
            currentTime,
            bearing
        );

        if (angle !== null) {
            relativeAngles.push(angle);
        }
    }

    const exposurePercentage = totalPoints==0 ? 0 : (relativeAngles.length / totalPoints) * 100;

    const scenicSide = determineScenicSideFromTrajectory(relativeAngles);

    const recommendedSeats = getRecommendedSeats(scenicSide);

    const departureSunAltitude = getSunAltitude(
        fromAirport.lat,
        fromAirport.lng,
        departureTime
    );

    const arrivalSunAltitude = getSunAltitude(
        toAirport.lat,
        toAirport.lng,
        arrivalTime
    );

    const sunTimes = getSunTimes(
        fromAirport.lat,
        fromAirport.lng,
        departureTime
    );

  return NextResponse.json({
    from: fromAirport,
    to: toAirport,
    distance: distance.toFixed(2),
    bearing: bearing.toFixed(2),
    durationHours: durationHours.toFixed(2),
    departureTime,
    arrivalTime,
    path,
    sunData: {
        scenicSide,
        samples: relativeAngles.length,
        recommendedSeats,
        sunriseTime: sunTimes.sunrise,
        sunsetTime: sunTimes.sunset,
        departureSunAltitude,
        arrivalSunAltitude,
        exposurePercentage: Number(exposurePercentage.toFixed(1))
    },
  });
}