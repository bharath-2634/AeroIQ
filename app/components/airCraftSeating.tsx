"use client";

import React, { useMemo } from "react";

type ScenicSide = "left" | "right" | "both" | "none";

interface AircraftSeatingProps {
  scenicSide: ScenicSide;
  recommendedSeats: string[];
  rows?: number;
}

type SeatType = "window" | "middle" | "aisle";

interface Seat {
  id: string;
  row: number;
  letter: string;
  type: SeatType;
  side: "left" | "right";
}

export default function AircraftSeating({
  scenicSide,
  recommendedSeats,
  rows = 30,
}: AircraftSeatingProps) {
  
  const seatLetters = ["A", "B", "C", "D", "E", "F"];

  const seats = useMemo<Seat[]>(() => {
    const list: Seat[] = [];

    for (let r = 1; r <= rows; r++) {
      seatLetters.forEach((letter) => {
        let type: SeatType = "middle";
        let side: "left" | "right" = letter <= "C" ? "left" : "right";

        if (letter === "A" || letter === "F") type = "window";
        else if (letter === "C" || letter === "D") type = "aisle";

        list.push({
          id: `${r}${letter}`,
          row: r,
          letter,
          type,
          side,
        });
      });
    }

    return list;
  }, [rows]);

  const isRecommended = (seat: Seat) => {
    return (
      recommendedSeats.includes(seat.id) ||
      recommendedSeats.includes(seat.letter)
    );
  };

  const getSeatStyle = (seat: Seat) => {
    const base =
      "w-8 h-8 rounded-md border-2 flex items-center justify-center text-xs font-semibold transition";

    // Scenic recommended window seat
    if (seat.type === "window" && isRecommended(seat)) {
      return `${base} bg-yellow-400 border-yellow-500 text-black`;
    }

    // Regular window seat
    if (seat.type === "window") {
      return `${base} bg-white border-blue-500 text-blue-700`;
    }

    // Aisle seat
    if (seat.type === "aisle") {
      return `${base} bg-white border-gray-400 text-gray-700`;
    }

    // Middle seat
    return `${base} bg-gray-100 border-gray-300 text-gray-500`;
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 w-full text-center">
      <h2 className="text-lg font-semibold mb-2">Aircraft Seating</h2>
      <p className="text-sm text-gray-500 mb-4">
        Top-view cabin layout (compact)
      </p>

      {/* Seat Grid */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }, (_, rowIndex) => {
          const rowNum = rowIndex + 1;
          const rowSeats = seats.filter((s) => s.row === rowNum);

          return (
            <div
              key={rowNum}
              className="flex items-center justify-center gap-3"
            >
              <span className="w-6 text-sm text-gray-500">{rowNum}</span>

              {rowSeats.map((seat) => (
                <div key={seat.id} className={getSeatStyle(seat)}>
                  {seat.letter}
                </div>
              ))}

              <span className="w-6 text-sm text-gray-500">{rowNum}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
          Scenic Window
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 rounded-sm"></div>
          Window Seat
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400 rounded-sm"></div>
          Aisle Seat
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
          Middle Seat
        </div>
      </div>
    </div>
  );
}