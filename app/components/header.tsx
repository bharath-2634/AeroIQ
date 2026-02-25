"use client";
import React from "react";
import HeroBackground from "./heroBackground";


interface HeaderProps {
  onGetStarted: () => void;
}


const Header: React.FC<HeaderProps> = ({ onGetStarted}) => {

    return (
      <section className="w-full min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden font-poppins z-10">

        <HeroBackground/>
          
        
        {/* Top Brand */}
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="absolute top-20 gap-2 text-black flex flex-col items-center justify-center">
              <h2 className="text-[2.8rem] font-medium tracking-tight ">Aero IQ</h2>
              <p className="text-[1.2rem] font-normal text-gray-400">Find the Perfect Window Seat.</p>
          </div>

          <div className="w-[80%]">
              <h2 className="text-[1.5rem] mt-20">We analyze sun position and flight paths to tell you which side of the aircraft offers the best sunrise or sunset view.</h2>
          </div>

          <button
            onClick={onGetStarted}
            className="mt-10 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-900 transition z-20 cursor-pointer animate-float"
          >
            Find your Best Seat
          </button>
        </div>

      </section>
    );
};

export default Header;