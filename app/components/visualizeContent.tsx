"use client";
// export const dynamic = "force-dynamic";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSearchParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import FlightMap from "../components/flightMap";
import AircraftSeating from "../components/airCraftSeating";
import SeatGuide from "../components/seatGuide";
import ScenicInfo from "../components/scenicView";
import FlightRouteCard from "../components/flightRouteCard";
import ExposureTimelineGraph from "../components/ExposureTimelineGraph";
import FlightMapSwitcher, { MapMode } from "../components/FlightMapSwitcher";

interface FlightResponse {
  from: {
    lat: number;
    lng: number;
    city: string;
    code: string;
    name: string;
  };
  to: {
    lat: number;
    lng: number;
    city: string;
    code: string;
    name: string;
  };
  departureTime: string;
  arrivalTime: string;
  distance: string;
  durationHours: string;
  bearing: string;
  path: { lat: number; lng: number }[];
  sunData: {
    scenicSide: string;
    recommendedSeats: string[];
    exposurePercentage: number;
    sunriseTime: string;
    sunsetTime: string;
    timeline: {
      lat: number;
      lng: number;
      time: string;
      sun: { azimuth: number; altitude: number };
      bearing: number;
    }[];
  };
}

export default function VisualizePage() {
  
    const searchParams = useSearchParams();

  const router = useRouter();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const dt = searchParams.get("dt");
  const mapModeParam = searchParams.get("map");
  const mapMode: MapMode = mapModeParam === "3d" ? "3d" : "2d";
  const mapPathParam = searchParams.get("mapPath");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FlightResponse | null>(null);

  useEffect(() => {
    if (!from || !to || !dt) return;

    const mapPathQuery = mapPathParam ? `&mapPath=${mapPathParam}` : "";

    async function fetchFlightData() {
      try {
        const res = await fetch(
          `/api/flight?from=${from}&to=${to}&dt=${dt}${mapPathQuery}`
        );

        const result = await res.json();
        setData(result);
        console.log(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFlightData();
  }, [from, to, dt, mapPathParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow text-sm font-medium"
        >
          ← Back
        </button>

        <p className="text-lg">Calculating optimal scenic seats...</p>
      </div>
    );
  }

    function formateDate(isoString?: string) {
        if (!isoString) return "";

        const date = new Date(isoString);

        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    const totalMinutes = Math.round(Number(data?.durationHours ?? 0) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

  const sunTrack =
    data?.sunData.timeline
      // Only keep points where the sun is actually above the horizon
      ?.filter((p) => p.sun.altitude > 0)
      .map((p) => ({
        lat: p.lat,
        lng: p.lng,
        altitude: p.sun.altitude,
      })) ?? [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative font-poppins">
        {/* Back Button */}
        <div className="flex w-full items-start justify-start">
            <button
                onClick={() => router.back()}
                className="text-[1rem] font-medium text-gray-700 flex items-center justify-center gap-2"
            >
                <IoMdArrowRoundBack /> Back
            </button>
        </div>
      
        {/* Flight Route Card and Flight Metrics Card*/}
        <div className="p-6 mt-2 w-full flex items-start justify-between gap-3">
          
            <FlightRouteCard departureCity={data?.from?.city?? ""} departureCode={data?.from?.code?? ""} departureDate={formateDate(data?.departureTime)} arrivalCity={data?.to?.city?? ""} arrivalCode={data?.to?.code??""} arrivalDate={formateDate(data?.arrivalTime)} duration={`${data?.durationHours} hrs`} />

            <div className="w-[40%] h-58 bg-white rounded-2xl shadow-md p-8 flex flex-col gap-8 font-poppins">
                <h2 className="text-xl font-semibold tracking-wide">Flight Metrics</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Distance -</span>
                        <span className="font-medium">{Number(data?.distance).toLocaleString("en-US", { maximumFractionDigits: 0 })} km</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Duration -</span>
                        <span className="font-medium">{hours}hr {minutes}min</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Bearing -</span>
                        <span className="font-medium">{data?.bearing} °</span>
                    </div>
                </div>
            </div>
            
        </div>

        {/* Aircraft Seating Layout with recommended seats */}
        <div className="w-full flex items-start justify-between gap-6 p-6">
            <div className="w-[80%]">
                {data && (
                    <div className="mt-10 w-full">
                        <AircraftSeating
                        scenicSide={data.sunData.scenicSide as any}
                        recommendedSeats={data.sunData.recommendedSeats}
                        rows={30}
                        />
                    </div>
                )}
            </div>

            <div className="w-[80%] flex flex-col items-center justify-center gap-5 mt-[2.3rem] ">

                <div className="flex flex-col items-start justify-start w-full h-125 gap-3 bg-white rounded-2xl shadow-md p-8 font-poppins">
                    <div className="w-full flex items-center justify-between">
                      <h2 className="text-[1.2rem] font-medium">Flight Path</h2>
                      {/* <p className="text-xs text-gray-500">
                        {mapMode === "3d" ? "3D Globe" : "2D Map"}
                      </p> */}
                    </div>
                    <div className="w-full flex items-center justify-start gap-10">

                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                            <h2 className="text-[1rem] font-medium">Departure</h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-red-500 rounded-full inline-block"></span>
                            <h2 className="text-[1rem] font-medium">Arrival</h2>
                        </div>

                    </div>
                
                
                    {data && (
                        <FlightMapSwitcher
                          mode={"2d"}
                          from={{
                              lat: data.from.lat,
                              lng: data.from.lng,
                              city: data.from.city,
                          }}
                          to={{
                              lat: data.to.lat,
                              lng: data.to.lng,
                              city: data.to.city,
                          }}
                          path={data.path}
                          sunTrack={sunTrack}
                        />
                    )}
                </div>

                <ExposureTimelineGraph timeline={data?.sunData.timeline ?? []} />

                
                {data && (
                    <>
                    <ScenicInfo
                    scenicSide={data.sunData.scenicSide as any}
                    exposurePercentage={data.sunData.exposurePercentage}
                    sunriseTime={data.sunData.sunriseTime}
                    sunsetTime={data.sunData.sunsetTime}
                />

                <SeatGuide scenicSide={data.sunData.scenicSide as any} />
                
                </> )}
                

            </div>

            
            
        </div>

        <div className="w-[50%] p-6 flex items-center justify-between">
          
        </div>

    </div>
  );
}