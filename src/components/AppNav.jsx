import React, { useState } from "react";
import weatherBuddyLogo from "assets/weather-bear-icon.svg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";

const AppNav = ({ appNavState }) => {
  const navigate = useNavigate();

  const [navExpanded, setNavExpanded] = useState(false);

  const expandNav = () => {
    setNavExpanded(true);
  };

  const collapseNav = () => {
    setNavExpanded(false);
  };

  // Open account page
  const gotToMyAccount = () => {
    navigate("/my-account");
  };

  const AppNavNotExpanded = () => {
    return (
      <div
        className={`z-50 bg-white justify-start flex items-center p-1.5 rounded-full cursor-pointer`}
        onClick={expandNav}
      >
        <img src={weatherBuddyLogo} alt="" className="w-6" />

        <ArrowDropDownIcon className="text-primary" />
      </div>
    );
  };

  const AppNavExpanded = () => {
    return (
      <div className="bg-white z-50 px-2 py-1 flex gap-3 rounded-r-full justify-center items-center">
        {/* Bear and account text*/}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <img src={weatherBuddyLogo} alt="" className="w-6 -mb-1" />

            {/* Arrow */}
            <ArrowDropDownIcon
              className="text-primary rotate-180 cursor-pointer"
              sx={{ fontSize: "30px" }}
              onClick={collapseNav}
            />
          </div>

          <hr className="border-primary w-1/2" />

          <p
            className="text-xs pr-4 pb-1 hover:underline text-primary-100 font-black cursor-pointer"
            onClick={gotToMyAccount}
          >
            My Account
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-1 left-5 z-50">
      {navExpanded ? <AppNavExpanded /> : <AppNavNotExpanded />}
    </div>
  );
};

export default AppNav;
