"use client";

import React from "react";
import { Plane } from "lucide-react";
import Image from "next/image";
import air_craft_img from "../assets/air_craft_img.png";

interface FlightRouteCardProps {
  departureCity: string;
  departureCode: string;
  departureDate: string;
  arrivalCity: string;
  arrivalCode: string;
  arrivalDate: string;
  duration: string;
}

const FlightRouteCard: React.FC<FlightRouteCardProps> = ({
  departureCity,
  departureCode,
  departureDate,
  arrivalCity,
  arrivalCode,
  arrivalDate,
  duration,
}) => {
  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8 flex flex-col gap-8 font-poppins">
      
      {/* Aircraft Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-wide">
            Flight Summary
          </h2>
        </div>
      </div>    

      {/* Route Section */}
      <div className="flex items-center justify-center gap-6">
        <div className="">
            <Image
                src={air_craft_img}
                alt="Flight image"
                width={250}
                height={120}
                priority
            />
        </div>
        <div className="w-[60%] flex items-center justify-between gap-3">
            <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-[1rem] font-medium text-gray-600">{departureCity}</h2>
                <h2 className="text-[1rem] font-semibold text-gray-800 font-poppins">{departureCode}</h2>
                <p className="text-[.9rem] font-medium text-gray-500">{departureDate}</p>
            </div>

            <div className="flex-1 flex flex-col items-center relative">
          
                <div className="w-full border-t border-dashed border-gray-300 relative">
                    <Plane
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white"
                    size={24}
                    />
                </div>

                <p className="text-gray-600 text-sm mt-3">
                    {duration}
                </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-[1rem] font-medium text-gray-600">{arrivalCity}</h2>
                <h2 className="text-[1rem] font-semibold text-gray-800 font-poppins">{arrivalCode}</h2>
                <p className="text-[.9rem] font-medium text-gray-500">{arrivalDate}</p>
            </div>

        </div>
        
      </div>
    </div>
  );
};

export default FlightRouteCard;