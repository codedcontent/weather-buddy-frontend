import React, { useEffect, useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Loader from "components/Loader";

const TrackingSuggestions = ({
  id,
  type,
  value,
  setValue,
  handleVisibility,
  listOfTimes,
}) => {
  const boxStyle =
    "h-screen w-2/5 text-white backdrop-blur-sm bg-black/30 px-5 py-2";

  const TimeSuggestionBox = () => {
    const availableTimes = ["5:00 am", "10:00 am", "3:00 pm", "8:00 pm"];
    return (
      <div className={`${boxStyle} h-max space-y-2 w-[40%] place-items-center`}>
        {/* Render the times that have not yet been selected by the user */}
        {availableTimes
          .filter((time) => !listOfTimes.includes(time))
          .map((time, i) => (
            <p
              key={i}
              className="cursor-pointer hover:underline hover:uppercase hover:scale-105"
              onClick={() => {
                setValue(type, time, id);
                handleVisibility(null);
              }}
            >
              {time}
            </p>
          ))}
      </div>
    );
  };

  const LocationSuggestionBox = () => {
    const [locationSearchResults, setLocationSearchResults] = useState(null);

    const getGeoCodedSearchResult = async () => {
      const apiKey = process.env.REACT_APP_OW_AK;

      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=50&appid=${apiKey}`;

      try {
        const result = await fetch(url);
        const data = await result.json();

        // Map out the search result
        const geoCodedResult = data.map((res) => ({
          title: `${res.name}, ${res.state ? res.state + "," : ""} ${
            res.country
          }`,
          cord: {
            lat: res.lat,
            long: res.lon,
          },
        }));

        return geoCodedResult;
      } catch (error) {
        console.log({ error });
        setLocationSearchResults([]);
      }
    };

    // Run after a delay when the user is typing
    useEffect(() => {
      const timeoutId = setTimeout(async () => {
        const result = await getGeoCodedSearchResult("london");

        if (result.length !== 0) {
          setLocationSearchResults(result);
        } else {
          setLocationSearchResults(null);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
      // eslint-disable-next-line
    }, [value]);

    useEffect(() => {
      //   setLocationSearchResults(null);
    }, []);

    return (
      <div className={`${boxStyle} h-max mb-5 space-y-2 w-[80%]`}>
        {!locationSearchResults ? (
          <div className="w-full grid place-items-center">
            <Loader fill="white" />
          </div>
        ) : (
          <>
            {locationSearchResults.length > 0 ? (
              <div className="space-y-5 mt-4 flex flex-col">
                {locationSearchResults.map((result, i) => (
                  <span
                    className="font-extralight w-max  hover:underline cursor-pointer text-sm"
                    key={i}
                    onClick={() => {
                      setValue(type, result, id);
                      handleVisibility(null);
                    }}
                  >
                    {result?.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-light text-white h-3/4 grid place-items-center text-center">
                Sorry couldn't find that on our forecast 😞. Try something else
                maybe👍.
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  //
  return (
    <>
      <ClickAwayListener onClickAway={() => handleVisibility(null)}>
        <div className="absolute bottom-0 transform translate-y-[100%] left-0 w-full z-50">
          {type === "time" ? <TimeSuggestionBox /> : <LocationSuggestionBox />}
        </div>
      </ClickAwayListener>
    </>
  );
};

export default TrackingSuggestions;
