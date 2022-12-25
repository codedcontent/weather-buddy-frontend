import React, { useEffect, useState } from "react";
import WelcomeToWeatherBuddy from "pages/Welcome";
import Home from "pages/Home";
import { useSnackbar } from "notistack";

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [showWelcomePage, setShowWelcomePage] = useState(true);

  const [location, setLocation] = useState({
    lat: "",
    lon: "",
  });

  // Effect to show weather buddy welcome screen
  useEffect(() => {
    const welcomeBuddyTimer = setTimeout(() => {
      setShowWelcomePage(false);
    }, 2000);

    return () => clearTimeout(welcomeBuddyTimer);
  }, []);

  // Effect to load weather details
  useEffect(() => {
    let mounted = false;

    const getGeoCodedSearchResult = async ({ lat, lon }) => {
      const apiKey = process.env.REACT_APP_OW_AK;

      const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`;

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

        return geoCodedResult[0].title;
      } catch (error) {
        console.log({ error });
      }
    };

    const successCallback = async (position) => {
      // Update weather info with location details
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const reverseGeoCodedResult = await getGeoCodedSearchResult({ lat, lon });

      setLocation({ lat, lon, title: reverseGeoCodedResult });
    };

    const errorCallback = (error) => {
      enqueueSnackbar("This is a weather app and it requires your location.", {
        variant: "warning",
      });
    };

    return () => {
      !mounted &&
        navigator.geolocation.getCurrentPosition(
          successCallback,
          errorCallback
        );

      mounted = true;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="max-h-screen text-base border-box h-screen overflow-y-hidden w-full relative">
      {showWelcomePage ? (
        <WelcomeToWeatherBuddy />
      ) : (
        <>{location.lat && location.lon && <Home location={location} />}</>
      )}
    </div>
  );
}

export default App;
