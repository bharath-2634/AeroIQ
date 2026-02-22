"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Airport,
  searchAirports,
  getPopularAirports,
} from "../lib/airports";

const FormSection = () => {

    const router = useRouter();

    const [fromQuery, setFromQuery] = useState("");
    const [toQuery, setToQuery] = useState("");

    const [filteredFrom, setFilteredFrom] = useState<Airport[]>([]);
    const [filteredTo, setFilteredTo] = useState<Airport[]>([]);

    const [selectedFrom, setSelectedFrom] = useState<Airport | null>(null);
    const [selectedTo, setSelectedTo] = useState<Airport | null>(null);

    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [error, setError] = useState("");

    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);

    // ==========================
    // INITIAL DATE & TIME
    // ==========================
    useEffect(() => {
        const now = new Date();

        const today = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        setDate(today);
        setTime(currentTime);
    }, []);

    // ==========================
    // SEARCH LOGIC
    // ==========================
    useEffect(() => {
        if (!fromQuery.trim()) {
        setFilteredFrom(getPopularAirports().slice(0, 5));
        return;
        }

        const results = searchAirports(fromQuery).slice(0, 5);
        setFilteredFrom(results);
    }, [fromQuery]);

    useEffect(() => {
        if (!toQuery.trim()) {
        setFilteredTo(getPopularAirports().slice(0, 5));
        return;
        }

        const results = searchAirports(toQuery).slice(0, 5);
        setFilteredTo(results);
    }, [toQuery]);

    // ==========================
    // OUTSIDE CLICK CLOSE
    // ==========================
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
            setShowFromDropdown(false);
        }
        if (toRef.current && !toRef.current.contains(event.target as Node)) {
            setShowToDropdown(false);
        }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ==========================
    // SELECT HANDLERS
    // ==========================
    const handleSelectFrom = (airport: Airport) => {
        setSelectedFrom(airport);
        setFromQuery(`${airport.city} (${airport.code})`);
        setShowFromDropdown(false);
    };

    const handleSelectTo = (airport: Airport) => {
        setSelectedTo(airport);
        setToQuery(`${airport.city} (${airport.code})`);
        setShowToDropdown(false);
    };

    // ==========================
    // VALIDATION
    // ==========================
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!selectedFrom || !selectedTo) {
        setError("Please select valid departure and arrival airports.");
        return;
        }

        if (selectedFrom.code === selectedTo.code) {
        setError("Departure and arrival airports cannot be the same.");
        return;
        }

        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();

        if (selectedDateTime < now) {
        setError("Departure date and time cannot be in the past.");
        return;
        }

        const departureDateTime = new Date(`${date}T${time}`).toISOString();
        router.push(
            `/visualize?from=${selectedFrom.code}&to=${selectedTo.code}&dt=${departureDateTime}`
        );
    };

    const today = new Date().toISOString().split("T")[0];

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center gap-5 px-6 font-poppins">
      <div className="flex flex-col items-center justify-center gap-3 mb-5">
        <h2 className="text-[1.5rem] font-medium">Flight Details</h2>
        <p className="text-[1rem] text-[#878787]">
          Enter your departure and arrival information
        </p>
      </div>

      <div className="w-full max-w-lg p-10 rounded-2xl border-[#f6f6fe] border-2">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* DEPARTURE */}
          <div className="relative" ref={fromRef}>
            <input
              type="text"
              placeholder="Departure Airport"
              value={fromQuery}
              onChange={(e) => {
                setFromQuery(e.target.value);
                setShowFromDropdown(true);
                setSelectedFrom(null);
              }}
              onFocus={() => setShowFromDropdown(true)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />

            {showFromDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg z-50">
                {filteredFrom.length > 0 ? (
                  filteredFrom.map((airport) => (
                    <div
                      key={airport.code}
                      onClick={() => handleSelectFrom(airport)}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      <div className="font-medium">
                        {airport.city} ({airport.code})
                      </div>
                      <div className="text-gray-500 text-xs">
                        {airport.name}, {airport.country}
                      </div>
                    </div>
                  )) ) : fromQuery.trim() && !selectedFrom ? (
                    <div className="p-3 text-gray-500 text-sm">
                        No airport found
                    </div>
                    ) : null
                }
              </div>
            )}
          </div>

          {/* ARRIVAL */}
          <div className="relative" ref={toRef}>
            <input
              type="text"
              placeholder="Arrival Airport"
              value={toQuery}
              onChange={(e) => {
                setToQuery(e.target.value);
                setSelectedTo(null);
                setShowToDropdown(true);
              }}
              onFocus={() => setShowToDropdown(true)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />

            {showToDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg z-50">
                {filteredTo.length > 0 ? (
                  filteredTo.map((airport) => (
                    <div
                      key={airport.code}
                      onClick={() => handleSelectTo(airport)}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      <div className="font-medium">
                        {airport.city} ({airport.code})
                      </div>
                      <div className="text-gray-500 text-xs">
                        {airport.name}, {airport.country}
                      </div>
                    </div>
                  ))
                ) : toQuery.trim() && !selectedTo ? (
                    <div className="p-3 text-gray-500 text-sm">
                        No airport found
                    </div>
                    ) : null
                }
              </div>
            )}
          </div>

          {/* DATE */}
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />

          {/* TIME */}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="mt-4 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Analyze Scenic View
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormSection;