"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSearchParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FlightMap from "../components/flightMap";
import AircraftSeating from "../components/airCraftSeating";
import SeatGuide from "../components/seatGuide";
import ScenicInfo from "../components/scenicView";

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
  };
}

export default function VisualizePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const dt = searchParams.get("dt");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FlightResponse | null>(null);

  useEffect(() => {
    if (!from || !to || !dt) return;

    async function fetchFlightData() {
      try {
        const res = await fetch(
          `/api/flight?from=${from}&to=${to}&dt=${dt}`
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
  }, [from, to, dt]);

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
      

        {/* 2D Travel Map and Summary of flight*/}
        <div className="p-6 mt-2 w-full flex items-start justify-between gap-3">
            <div className="flex flex-col items-start justify-start gap-3 p-6 bg-white/60 backdrop-blur-md border border-white/40 rounded-lg w-[40%] shadow-xl">
                {/* Flight Summary -> { Departure: {Name, Airport_name, Date, time }. Arrival: {Name, Airport_name, Date, time }, Distance, Duration, Bearing, Best-View, Sun-riseTime, Sub-setTime }*/}
                <h2 className="w-full text-[1.2rem] font-medium">✈️    Flight Summary</h2>
                <div className="flex flex-col items-start justify-start gap-2 w-full p-3">
                    <h2 className="text-[1rem] font-medium text-[#484747]">Departure</h2>
                    <div className="ml-10 flex flex-col items-start justify-center gap-2">
                        <p className="text-[1rem] font-medium">{data?.from?.city} <span className="text-gray-500">({data?.from?.code})</span></p>
                        <p className="text-[1rem] font-medium">{data?.from?.name}</p>
                        <p className="text-[1rem] font-medium">{formateDate(data?.departureTime)}</p>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 w-full p-3">
                    <h2 className="text-[1rem] font-medium text-[#484747]">Arrival</h2>
                    <div className="ml-10 flex flex-col items-start justify-center gap-2">
                        <p className="text-[1rem] font-medium">{data?.to?.city} <span className="text-gray-500">({data?.to?.code})</span></p>
                        <p className="text-[1rem] font-medium">{data?.to?.name}</p>
                        <p className="text-[1rem] font-medium">{formateDate(data?.arrivalTime)}</p>
                    </div>
                </div>

                <div className="bg-gray-200 w-full h-1 rounded-2xl"></div>

                <div className="w-full flex items-center justify-between gap-3">
                    <div className="flex flex-col items-start justify-start gap-1">
                        <h2 className="text-[1rem] font-medium text-black">Distance</h2>
                        <p className="text-[1rem] text-[#484747] font-medium">{data?.distance} km</p>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-1">
                        <h2 className="text-[1rem] font-medium text-black">Duration</h2>
                        <p className="text-[1rem] text-[#484747] font-medium">{data?.durationHours} hrs</p>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-1">
                        <h2 className="text-[1rem] font-medium text-black">Bearing</h2>
                        <p className="text-[1rem] text-[#484747] font-medium">{data?.bearing}°</p>
                    </div>

                </div>
            </div>
            <div className="flex flex-col items-start justify-start w-[50%] h-[500px] gap-3">
                <h2 className="text-[1.2rem] font-medium">Flight Path</h2>
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
                    <FlightMap
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
                    />
                )}
            </div>
        </div>

        {/* Aircraft Seating Layout with recommended seats */}
        <div className="w-full flex items-start justify-between gap-6 p-6">
            <div>
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
            <div className="flex flex-col items-start justify-cemter gap-4 p-2 mt-[2rem] w-[50%]">
                <div>
                    <SeatGuide scenicSide={data.sunData.scenicSide as any} />
                </div>
                <div>
                    <ScenicInfo
                        scenicSide={data.sunData.scenicSide as any}
                        exposurePercentage={data.sunData.exposurePercentage}
                        sunriseTime={data.sunData.sunriseTime}
                        sunsetTime={data.sunData.sunsetTime}
                    />
                </div>
            </div>
            
        </div>


    </div>
  );
}