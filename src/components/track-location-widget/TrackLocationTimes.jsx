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

  const [currentActiveInput, setCurrentActiveInput] = useState(null);
  const [activeLocation, setActiveLocation] = useState(0);

  // Non-state declarations
  const locationTimes = user?.trackingDetails[locationIndex]?.times;
  const trackingDetail = user?.trackingDetails[locationIndex];
  const subs_plan = user?.subscription_plan;

  /**
   * Function declarations
   */
  // Limit locations/times to track based on subscription plan
  const manageSubscriptionPlanLimits = () => {
    if (subs_plan === "free" && trackingDetail.length === 1) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    } else if (subs_plan === "dove" && trackingDetail.length === 3) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    } else if (subs_plan === "lion" && trackingDetail.length === 5) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    }

    return true;
  };

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
      trackingDetails: { ...prev.trackingDetails, ...newTrackingDetail },
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
                value={
                  !trackingDetail?.location?.value?.title
                    ? trackingDetail?.location?.value
                    : trackingDetail?.location?.value?.title
                }
                inputId={{ locationIndex: locationIndex }}
                disabled={fetching}
                handleClick={() =>
                  setCurrentActiveInput({
                    locationIndex: locationIndex,
                  })
                }
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
              onClick={() =>
                // deleteLocation(trackingDetail.location.id)
                {}
              }
              className="text-red-500 cursor-pointer"
            />
          </div>

          {/* The suggestions for the input fields */}
          {currentActiveInput &&
          JSON.stringify(currentActiveInput) ===
            JSON.stringify({ locationIndex: locationIndex }) ? (
            <TrackingSuggestions
              type="location"
              id={{ locationIndex: locationIndex }}
              value={trackingDetail.location.value}
              handleVisibility={setCurrentActiveInput}
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
