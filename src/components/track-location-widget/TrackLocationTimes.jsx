import React, { useContext, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import TextField from "components/TextField";
import UserContext from "contexts/UserContext";
import TrackingSuggestions from "./TrackingSuggestions";
import TrackingTime from "components/TrackingTime";
import { useSnackbar } from "notistack";

const TrackLocationTimes = ({ locationIndex, fetching }) => {
  const { user, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  const [activeLocation, setActiveLocation] = useState(null);

  // Non-state declarations
  const locationTimes = user?.trackingDetails[locationIndex]?.times;
  const trackingDetail = user?.trackingDetails[locationIndex];
  const trackingDetails = user?.trackingDetails;
  const subs_plan = user?.subscription_plan;

  /**
   * Function declarations
   */
  // Limit locations/times to track based on subscription plan
  const manageSubscriptionPlanLimits = () => {
    if (subs_plan === "free" && trackingDetails.length === 1) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    } else if (subs_plan === "dove" && trackingDetails.length === 3) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    } else if (subs_plan === "lion" && trackingDetails.length === 5) {
      enqueueSnackbar("You can't track anymore locations.", {
        variant: "info",
      });
      return false;
    }

    return true;
  };

  // Add a location to track
  const addLocation = () => {
    // Check the users subscription plan
    const isValidOperation = manageSubscriptionPlanLimits();

    if (!isValidOperation) return;

    // Add a new tracking location
    const newTrackingDetail = {
      location: {
        title: "",
        coord: {
          lat: "",
          lon: "",
        },
      },
      times: [""],
    };

    setUser((prev) => ({
      ...prev,
      trackingDetails: [...prev.trackingDetails, newTrackingDetail],
    }));
  };

  // Delete a location to track
  const deleteLocation = () => {
    // Prevent deletion of every single location to track
    if (trackingDetails.length === 1) return;

    // Delete selected tracking location
    setUser((prev) => ({
      ...prev,
      trackingDetails: [
        ...prev.trackingDetails.filter(
          (_, detailIndex) => detailIndex !== locationIndex
        ),
      ],
    }));
  };

  // Handle changes to location input field
  // console.log({ trackingDetails });
  const handleChange = (value) => {
    // Add the updated tracking detail to user app state
    setUser((prev) => ({
      ...prev,
      trackingDetails: [
        ...prev.trackingDetails.filter(
          (_, detailIndex) => detailIndex !== locationIndex
        ),
        {
          location: {
            title: value.title ? value.title : value,
            coord: value.coord,
          },
          times: locationTimes,
        },
      ],
    }));
  };

  return (
    <div className="lg:w-1/2 w-3/4">
      {/* Tracking Location */}
      <div className="w-full">
        <p className="font-bold text-sm ml-3 text-primary"></p>

        <div className="w-full mt-1 ml-3 relative">
          {/* Text field for locations */}
          <div className="flex gap-5 justify-between items-center w-full ">
            <div className="flex-1">
              {/* Textfield */}
              <TextField
                title={`Location ${locationIndex + 1}`}
                placeholder="Type a location you wish to track"
                value={trackingDetail?.location?.title}
                disabled={fetching}
                handleChange={handleChange}
                handleClick={() => setActiveLocation(locationIndex)}
              />
            </div>

            {/* Add location */}
            {user?.trackingDetails.length === locationIndex + 1 && (
              <AddAlertIcon
                onClick={addLocation}
                className="text-green-500 cursor-pointer"
              />
            )}

            {/* Delete location */}
            <DeleteIcon
              onClick={() => deleteLocation()}
              className="text-red-500 cursor-pointer"
            />
          </div>

          {/* The suggestions for the input fields */}
          {activeLocation === locationIndex ? (
            <TrackingSuggestions
              type="location"
              value={trackingDetail.location.title}
              handleVisibility={setActiveLocation}
              setValue={handleChange}
            />
          ) : null}
        </div>
      </div>

      {/* Tracking times for that location */}
      <div>
        <p className="ml-10 font-light text-sm text-primary"></p>

        {locationTimes?.map((time, timeIndex) => (
          <TrackingTime
            key={timeIndex}
            timeIndex={timeIndex}
            time={time}
            locationIndex={locationIndex}
            fetching={fetching}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackLocationTimes;
