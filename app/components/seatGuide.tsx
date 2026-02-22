"use client";

interface SeatGuideProps {
  scenicSide: "left" | "right" | "both" | "none";
}

export default function SeatGuide({ scenicSide }: SeatGuideProps) {
  const recommendedLetter =
    scenicSide === "left"
      ? "A"
      : scenicSide === "right"
      ? "F"
      : scenicSide === "both"
      ? "A / F"
      : "-";

  return (
    <div className="w-[350px] bg-white border border-gray-200 rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-blue-600 mb-1">
        Seat Guide
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Understanding seat types and recommendations
      </p>

      {/* Recommended */}
      <div className="border rounded-xl p-4 mb-4 bg-gray-50">
        <h3 className="font-semibold mb-1">
          ⭐ Recommended Scenic Seats
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Best window seats for sunrise/sunset views
        </p>
        <div className="w-10 h-10 bg-yellow-400 rounded-md flex items-center justify-center font-bold text-black shadow">
          {recommendedLetter}
        </div>
      </div>

      {/* Standard Window */}
      <div className="border rounded-xl p-4 mb-4">
        <h3 className="font-semibold mb-1">
          🪟 Standard Window Seat
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Window view, but sun may not be visible
        </p>
        <div className="w-10 h-10 border-2 border-blue-500 rounded-md flex items-center justify-center font-bold text-blue-600">
          F
        </div>
      </div>

      {/* Middle */}
      <div className="border rounded-xl p-4 mb-4 bg-gray-50">
        <h3 className="font-semibold mb-1">
          🪑 Middle Seats
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Between window and aisle, limited views
        </p>
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center font-bold text-gray-500">
            B
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center font-bold text-gray-500">
            E
          </div>
        </div>
      </div>

      {/* Aisle */}
      <div className="border rounded-xl p-4">
        <h3 className="font-semibold mb-1">
          🚶 Aisle Seats
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Easy access, no window views
        </p>
        <div className="flex gap-3">
          <div className="w-10 h-10 border-2 border-gray-400 rounded-md flex items-center justify-center font-bold text-gray-700">
            C
          </div>
          <div className="w-10 h-10 border-2 border-gray-400 rounded-md flex items-center justify-center font-bold text-gray-700">
            D
          </div>
        </div>
      </div>
    </div>
  );
}