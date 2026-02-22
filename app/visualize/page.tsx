"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FlightResponse {
  message: string;
}

export default function VisualizePage() {
  const searchParams = useSearchParams();

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
      <div className="min-h-screen flex items-center justify-center text-black">
        <p className="text-lg">Calculating optimal scenic seats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <pre className="bg-gray-100 p-6 rounded-xl">
        hello
      </pre>
    </div>
  );
}