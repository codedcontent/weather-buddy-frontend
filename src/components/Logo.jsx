import React from "react";
import logo from "assets/weather-bear-icon.svg";

const Logo = () => {
  return (
    <div className="rounded-full p-1.5 bg-white w-max cursor-pointer">
      <img src={logo} alt="" className="w-6" />
    </div>
  );
};

export default Logo;
