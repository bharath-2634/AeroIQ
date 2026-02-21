"use client";
import React from "react";

const FormSection = () => {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center gap-5 px-6 font-poppins">
        <div className="flex flex-col items-center justify-center gap-3 mb-5">
            <h2 className="text-[1.5rem] font-medium">Flight Details</h2>
            <p className="text-[1rem] text-[#878787]">Enter your departure and arrival information</p>
        </div>
        <div className="w-full p-10 rounded-2xl border-[#f6f6fe] border-2">
            
            <form className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Departure Airport"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />

            <input
                type="text"
                placeholder="Arrival Airport"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />

            <input
                type="time"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />

            <input
                type="date"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />

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