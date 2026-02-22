"use client";

interface ScenicInfoProps {
  scenicSide: "left" | "right" | "both" | "none";
  exposurePercentage: number;
  sunriseTime: string;
  sunsetTime: string;
}

function formatTime(iso?: string) {
  if (!iso) return "-";
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ScenicInfo({
  scenicSide,
  exposurePercentage,
  sunriseTime,
  sunsetTime,
}: ScenicInfoProps) {
  return (
    <div className="w-[350px] bg-white border border-gray-200 rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-blue-600 mb-1">
        🌅 Scenic View Information
      </h2>

      <div className="space-y-4 mt-4 text-sm">
        <div>
          <h3 className="font-semibold">Best Viewing Side</h3>
          <p className="text-gray-600 capitalize">
            {scenicSide}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Exposure Percentage</h3>
          <p className="text-gray-600">
            {exposurePercentage}%
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Sunrise Time</h3>
          <p className="text-gray-600">
            {formatTime(sunriseTime)}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Sunset Time</h3>
          <p className="text-gray-600">
            {formatTime(sunsetTime)}
          </p>
        </div>
      </div>
    </div>
  );
}