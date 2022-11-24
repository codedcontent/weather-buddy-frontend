import React from "react";
import weatherBuddy from "assets/weather-buddy.svg";

const WelcomeToWeatherBuddy = () => {
  return (
    <div className="h-screen bg-primary w-full flex justify-center items-center">
      <div className="flex gap-4 w-full justify-center items-center">
        <p className="text-4xl text-white font-black">Weather Buddy</p>
        
        <img
          src={weatherBuddy}
          alt=""
          className="text-white w-20 animate-bounce"
        />
      </div>
    </div>
  );
};

export default WelcomeToWeatherBuddy;
