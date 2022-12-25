import React, { useState, useEffect } from "react";
import AppNav from "components/AppNav";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import SearchBox from "components/SearchBox";
import weatherImages from "constants/weatherImages";
import moment from "moment";

const Home = ({ location }) => {
  const [weatherBg, setWeatherBg] = useState(weatherImages.loading);
  const [currentWeather, setCurrentWeather] = useState({
    temp: 0,
    title: "Loading...",
    description: "Loading...",
  });
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);
  const [time, setTime] = useState(moment().format("LLLL"));

  const closeSearchBox = () => {
    setSearchBoxOpen(false);
  };

  const openSearchBox = () => {
    setSearchBoxOpen(true);
  };

  const getWeatherDetails = async (lat, long, title) => {
    const openWeatherApiKey = process.env.REACT_APP_OW_AK;
    const exclude = ["alerts"];

    // Weather api url
    const openWeatherMapUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&exclude=${exclude}&appid=${openWeatherApiKey}`;

    try {
      const result = await fetch(openWeatherMapUrl);
      const data = await result.json();

      const weather = data.weather[0];

      setCurrentWeather({
        ...weather,
        temp: data.main.feels_like,
        title: title ? title : `${data.name}, ${data.sys.country}`,
      });

      if (
        weather.main.toLowerCase() === "drizzle" ||
        weather.main.toLowerCase() === "clouds" ||
        weather.main.toLowerCase() === "rain" ||
        weather.main.toLowerCase() === "thunderstorm" ||
        weather.main.toLowerCase() === "snow" ||
        weather.main.toLowerCase() === "clear"
      ) {
        setWeatherBg(weatherImages[weather.main.toLowerCase()]);
      } else {
        setWeatherBg(weatherImages["atmosphere"]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  // Effect to load weather details
  useEffect(() => {
    getWeatherDetails(location.lat, location.lon, location.title);
    if (location.lat && location.long) {
    }
    // eslint-disable-next-line
  }, []);

  // Act as a clock
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update time
      const usersTime = moment().format("LLLL");
      setTime(usersTime);
    }, [10000]);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="h-screen w-full bg-fixed relative bg-white bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${weatherBg?.image})`,
      }}
      loading="lazy"
    >
      {/* App navigation */}
      <AppNav />

      {/* Search icon */}
      {!searchBoxOpen && (
        <div
          className="absolute top-0 right-0 text-white bg-secondary p-3 z-50 cursor-pointer"
          onClick={openSearchBox}
        >
          <LocationSearchingIcon className="text-white" />
        </div>
      )}

      {/* Weather details */}
      {currentWeather?.temp && (
        <div className="flex gap-4 text-white items-center justify-center absolute bottom-4 left-4">
          <p className="text-4xl">{Math.round(currentWeather?.temp)}℃</p>

          {/* Country and datetime */}
          <div className="flex flex-col justify-start">
            <p className="font-bold text-2xl">{currentWeather?.title}</p>
            <p className="text-sm font-light">{time}</p>
          </div>

          {/* Weather icon */}
          <div className="flex flex-col justify-start">
            {/* <p className="font-extralight"></p> */}
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather?.icon}@2x.png`}
              alt=""
              className="w-10"
            />
            <p className="font-bold text-2xl capitalize">
              {currentWeather?.description}
            </p>
          </div>
        </div>
      )}

      {/* Search Box */}
      {searchBoxOpen && (
        <SearchBox
          closeSearchBox={closeSearchBox}
          getWeatherDetails={getWeatherDetails}
        />
      )}
    </div>
  );
};

export default Home;
