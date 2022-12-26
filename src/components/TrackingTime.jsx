import React, { useContext } from "react";
import { useState } from "react";
import TextField from "./TextField";
import TrackingSuggestions from "./track-location-widget/TrackingSuggestions";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import UserContext from "contexts/UserContext";
import { useSnackbar } from "notistack";

const TrackingTime = ({ timeIndex, locationIndex, fetching }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { user, setUser } = useContext(UserContext);
  const [activeTime, setActiveTime] = useState(null);

  /**
   * Non-state declarations
   */
  const subs_plan = user?.subscription_plan;
  const time = user?.trackingDetails[locationIndex]?.times[timeIndex];
  const locationTimes = user?.trackingDetails[locationIndex]?.times;

  /**
   * Function declarations
   */

  // Limit locations/times to track based on subscription plan
  const manageSubscriptionPlanLimits = () => {
    if (subs_plan === "free" && locationTimes.length === 1) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    } else if (subs_plan === "dove" && locationTimes.length === 2) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    } else if (subs_plan === "lion" && locationTimes.length === 4) {
      enqueueSnackbar("Upgrade your plan to track more locations.", {
        variant: "info",
      });
      return false;
    }

    return true;
  };

  // Add new time to track
  const addTime = () => {
    // Check the users subscription plan
    const isValidOperation = manageSubscriptionPlanLimits();

    if (!isValidOperation) return;

    // console.log("Adding time");
    const trackingDetails = user?.trackingDetails;

    setUser((prev) => {
      return {
        ...prev,
        trackingDetails: [
          // The tracking details that was not changed
          ...trackingDetails.splice(locationIndex, 1, {
            ...trackingDetails[locationIndex],
            times: [...locationTimes, ""],
          }),

          // The tracking details that was changed
          // ...prev.trackingDetails
          //   .filter((_, detailIndex) => detailIndex === locationIndex)
          //   .map((detailData) => ({
          //     ...detailData,
          //     times: [...detailData.times, ""],
          //   })),
        ],
      };
    });
  };

  // Delete time to track
  const deleteTime = () => {
    // Prevent deletion of every single location to track
    if (locationTimes.length === 1) return;

    setUser((prev) => ({
      ...prev,
      trackingDetails: [
        // The tracking details that was changed
        ...prev.trackingDetails
          .filter((_, detailIndex) => detailIndex === locationIndex)
          .map((detailData) => ({
            ...detailData,
            times: [
              ...detailData.times.filter(
                (_, timeDetailIndex) => timeDetailIndex !== timeIndex
              ),
            ],
          })),

        // The tracking details that was not changed
        ...prev.trackingDetails.filter(
          (_, detailIndex) => detailIndex !== locationIndex
        ),
      ],
    }));
  };

  return (
    <div className="ml-10 wlg:w-1/2 w-3/4 relative">
      <div className="flex gap-5 justify-between items-center w-full">
        {/* Time text field */}
        <div className="flex-1">
          <TextField
            title={`Time ${timeIndex + 1}`}
            value={time}
            placeholder="Select time to get alerts"
            // handleChange={handleChange}
            disabled={fetching}
            handleClick={() =>
              setActiveTime({
                locationIndex: locationIndex,
                timeId: timeIndex,
              })
            }
          />
        </div>

        {/* Add more button */}
        {locationTimes.length === timeIndex + 1 && (
          <AddAlertIcon
            className="text-green-500 cursor-pointer"
            onClick={() => {
              addTime();
            }}
          />
        )}

        <DeleteIcon
          onClick={() => {
            deleteTime();
          }}
          className="text-red-500 cursor-pointer"
        />
      </div>

      {/* The suggestions for the input fields */}
      {activeTime &&
      JSON.stringify(activeTime) ===
        JSON.stringify({ locationIndex: locationIndex, timeId: timeIndex }) ? (
        <TrackingSuggestions
          type="time"
          id={{ locationIndex: locationIndex, timeId: timeIndex }}
          handleVisibility={setActiveTime}
          listOfTimes={locationTimes.map((time) => time.value)}
        />
      ) : null}
    </div>
  );
};

export default TrackingTime;
