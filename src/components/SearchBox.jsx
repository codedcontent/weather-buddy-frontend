import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "components/Loader";

const locations = [
  {
    title: "Abuja",
    cord: { lat: 9.0643305, long: 7.4892974 },
  },
  {
    title: "Lagos",
    cord: { lat: 6.4550575, long: 3.3941795 },
  },
  {
    title: "California, Missouri, US",
    cord: { lat: 38.628683, long: -92.5659635 },
  },
  {
    title: "Enugu",
    cord: { lat: 6.4499833, long: 7.5000007 },
  },
  {
    title: "Winter Park, Florida, US",
    cord: { lat: 28.5977707, long: -81.3510264 },
  },
  {
    title: "New York, Missouri, US",
    cord: { lat: 39.6852874, long: -93.9268836 },
  },
  {
    title: "Pennsylvania, England, GB",
    cord: { lat: 50.7407652, long: -3.5218654 },
  },
  {
    title: "Illinois, Dubai, AE",
    cord: { lat: 25.2091807, long: 55.14743258186529 },
  },
  {
    title: "Ohio, Nova Scotia, CA",
    cord: { lat: 45.5201604, long: -62.0701135 },
  },
  {
    title: "Georgia, New Jersey, US",
    cord: { lat: 40.1873348, long: -74.2845906 },
  },
];

const SearchBox = ({ closeSearchBox, getWeatherDetails }) => {
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState("");

  useEffect(() => {
    setResults(locations);
    setForm("");
    setSearching(false);
  }, []);

  // Run after a delay when the user is typing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (form) {
        const result = await getGeoCodedSearchResult(form);
        if (result.length !== 0) {
          setResults(result);
        } else {
          setResults(null);
        }
      } else {
        setResults(locations);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [form]);

  const getGeoCodedSearchResult = async () => {
    const apiKey = process.env.REACT_APP_OW_AK;

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${form}&limit=50&appid=${apiKey}`;

    try {
      const result = await fetch(url);
      const data = await result.json();

      // Map out the search result
      const geoCodedResult = data.map((res) => ({
        title: `
            ${res.name}, ${res.state ? res.state + "," : ""} ${res.country}
            `,
        cord: {
          lat: res.lat,
          long: res.lon,
        },
      }));

      return geoCodedResult;
    } catch (error) {
      console.log({ error });
    }
  };

  const handleChange = (value) => {
    setForm(value);
    setResults([]);

    if (!searching) setSearching(true);

    if (value === "") {
      setSearching(false);
      setResults(locations);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (form === "") return;

    // Start geocoding search
    const geoCodedResult = await getGeoCodedSearchResult();
    if (geoCodedResult.length === 0) {
      setResults(null);
    } else {
      setResults(geoCodedResult);
    }
  };

  const handleGeoLocationClick = async (geoLocation) => {
    setSearching(true);
    await getWeatherDetails(
      geoLocation.cord.lat,
      geoLocation.cord.long,
      geoLocation.title
    );
    closeSearchBox();
  };

  return (
    <div className="h-screen w-2/5 text-white absolute top-0 right-0 backdrop-blur-sm bg-black/30 p-5 z-50">
      <CloseIcon
        className="text-white absolute right-4 z-50 top-2 cursor-pointer"
        onClick={closeSearchBox}
      />

      <form
        className="border-b-2 border-secondary w-3/4 m-auto mt-4"
        onSubmit={(e) => {
          handleSearchSubmit(e);
        }}
      >
        <input
          type="text"
          className="placeholder:text-white text-xs placeholder:italic placeholder:font-light w-full bg-transparent border-0 outline-0"
          placeholder="Know the weather in any location"
          value={form}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
        />
      </form>

      {!searching && (
        <p className="text-2xl font-black mt-7">Popular searches</p>
      )}

      {searching && <p className="text-2xl font-black mt-7">Results</p>}

      {searching && results?.length === 0 && (
        <div className="mt-7 w-full grid place-items-center">
          <Loader fill="white" />
        </div>
      )}

      {results ? (
        <div className="space-y-5 mt-4 flex flex-col">
          {results.map((result, i) => (
            <span
              className="font-extralight w-max  hover:underline cursor-pointer text-sm"
              key={i}
              onClick={() => {
                handleGeoLocationClick(result);
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
    </div>
  );
};

export default SearchBox;
