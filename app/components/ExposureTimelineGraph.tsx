"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { calculateSunRelativeAngle } from "../lib/sunCal";

type TimelinePoint = {
  lat: number;
  lng: number;
  time: string;
  sun: { azimuth: number; altitude: number };
  bearing: number;
};

interface ExposureTimelineGraphProps {
  timeline: TimelinePoint[];
}

interface ChartPoint {
  idx: number;
  progress: number;
  left: number;
  right: number;
  altitude: number;
  time: string;
}

export default function ExposureTimelineGraph({
  timeline,
}: ExposureTimelineGraphProps) {
  if (!timeline || timeline.length < 2) {
    return (
      <div className="w-full bg-white/90 dark:bg-zinc-900 rounded-2xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Exposure Timeline
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Exposure timeline is not available for this flight because there is not enough sample data.
        </p>
      </div>
    );
  }

  const pointsWithProgress = timeline.map((p, idx) => ({
    ...p,
    idx,
    progress: (idx / (timeline.length - 1)) * 100,
  }));

  const visible = pointsWithProgress.filter((p) => p.sun.altitude > -6);
  const maxAlt =
    visible.length > 0
      ? Math.max(...visible.map((p) => p.sun.altitude))
      : 0;

  if (visible.length === 0) {
    return (
      <div className="w-full bg-white/90 dark:bg-zinc-900 rounded-2xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Exposure Timeline
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          The sun stays below the horizon for this flight, so there is no meaningful exposure timeline to display.
        </p>
      </div>
    );
  }

  const chartData: ChartPoint[] = pointsWithProgress.map((p) => {
    let left = 0;
    let right = 0;

    if (p.sun.altitude > -6 && maxAlt > -6) {
      const exposure =
        ((p.sun.altitude + 6) / (maxAlt + 6)) * 100;

      const relativeAngle = calculateSunRelativeAngle(
        p.bearing,
        p.sun.azimuth
      );
      const threshold = 5;

      if (relativeAngle < -threshold) {
        left = exposure;
      } else if (relativeAngle > threshold) {
        right = exposure;
      }
    }

    return {
      idx: p.idx,
      progress: Math.round(p.progress),
      left,
      right,
      altitude: p.sun.altitude,
      time: p.time,
    };
  });

  const sunrisePoint = chartData.find((p) => p.altitude > 0);
  const sunriseX = sunrisePoint?.progress;

  const sunsetPeak = chartData.reduce<ChartPoint | null>((peak, p) => {
    if (!peak || p.altitude > peak.altitude) return p;
    return peak;
  }, null);
  const sunsetX = sunsetPeak?.progress;

  type Side = "left" | "right" | "none";
  type Segment = { start: number; end: number; side: Side; avg: number };

  const segments: Segment[] = [];
  let currentSide: Side = "none";
  let startIdx = 0;
  let acc = 0;
  let count = 0;

  const flushSegment = (endIdx: number) => {
    if (currentSide === "none" || count === 0) return;
    segments.push({
      start: startIdx,
      end: endIdx,
      side: currentSide,
      avg: acc / count,
    });
  };

  chartData.forEach((p, idx) => {
    let side: Side = "none";
    let value = 0;
    if (p.left > p.right && p.left > 0) {
      side = "left";
      value = p.left;
    } else if (p.right > p.left && p.right > 0) {
      side = "right";
      value = p.right;
    }

    if (side !== currentSide) {
      flushSegment(idx - 1);
      currentSide = side;
      startIdx = idx;
      acc = 0;
      count = 0;
    }

    if (side !== "none") {
      acc += value;
      count += 1;
    }
  });
  flushSegment(chartData.length - 1);

  const bestSegment =
    segments.length > 0
      ? segments.reduce((best, seg) =>
          !best || seg.avg > best.avg ? seg : best
        )
      : null;

  const bestStartProgress =
    bestSegment != null
      ? chartData[bestSegment.start].progress
      : null;
  const bestEndProgress =
    bestSegment != null ? chartData[bestSegment.end].progress : null;
  const bestSide =
    bestSegment?.side === "left"
      ? "Left"
      : bestSegment?.side === "right"
      ? "Right"
      : null;

  const summary =
    bestSegment && bestSide
      ? `Best viewing window: ${Math.round(
          bestStartProgress ?? 0
        )}% – ${Math.round(
          bestEndProgress ?? 0
        )}% of flight (${bestSide} side)`
      : "Best viewing window: No significant sun exposure during this flight";

  return (
    <div className="w-full bg-white/90 dark:bg-zinc-900 rounded-2xl shadow-md p-6 mt-6">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Exposure Timeline
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {summary}
        </p>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.3)"
              vertical={false}
            />
            <XAxis
              dataKey="progress"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.6)" }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.6)" }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderRadius: 8,
                border: "none",
                color: "white",
              }}
              labelFormatter={(label) => `Flight progress: ${label}%`}
              formatter={(value: any, name: any, props: any) => {
                const point = props.payload as ChartPoint;
                const date = new Date(point.time);
                const time = date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                if (name === "left") {
                  return [`${value.toFixed(0)}%`, "Left exposure"];
                }
                if (name === "right") {
                  return [`${value.toFixed(0)}%`, "Right exposure"];
                }
                if (name === "altitude") {
                  return [`${value.toFixed(1)}°`, "Sun altitude"];
                }
                return [value, name];
              }}
            />

            {bestStartProgress != null &&
              bestEndProgress != null &&
              bestStartProgress !== bestEndProgress && (
                <ReferenceArea
                  x1={bestStartProgress}
                  x2={bestEndProgress}
                  fill="rgba(56,189,248,0.12)"
                  stroke="none"
                />
              )}

            {sunriseX != null && (
              <ReferenceLine
                x={sunriseX}
                stroke="#22c55e"
                strokeDasharray="4 4"
              />
            )}
            {sunsetX != null && (
              <ReferenceLine
                x={sunsetX}
                stroke="#f97316"
                strokeDasharray="4 4"
              />
            )}

            <Line
              type="monotone"
              dataKey="left"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="left"
              animationDuration={700}
            />
            <Line
              type="monotone"
              dataKey="right"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="right"
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

