"use client";
import React from "react";
import HeroBackground from "./heroBackground";


interface HeaderProps {
  onGetStarted: () => void;
  hideBackground: boolean;
}


const Header: React.FC<HeaderProps> = ({ onGetStarted}) => {

    return (
      <section className="w-full min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden font-poppins z-10">

        <HeroBackground/>
          
        
        {/* Top Brand */}
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="absolute top-10 gap-2 text-black flex flex-col items-center justify-center">
              <h2 className="text-[2.8rem] font-medium tracking-tight ">Aero IQ</h2>
              <p className="text-[1.2rem] font-normal text-gray-400">Unlock Superior Cabin Views</p>
          </div>

          <div className="w-[80%]">
              <h2 className="text-[1.5rem] mt-[5rem]">Find the perfect window seat for breathtaking sunrise and sunset views. <br />AI-calculated seating mapped to real-time solar positioning.</h2>
          </div>

          <button
            onClick={onGetStarted}
            className="mt-10 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-900 transition z-20 cursor-pointer animate-float"
          >
            Get Started
          </button>
        </div>

      </section>
    );
};

export default Header;