import React, { useContext } from "react";
import { useState } from "react";
import TextField from "./TextField";
import TrackingSuggestions from "./track-location-widget/TrackingSuggestions";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import UserContext from "contexts/UserContext";
import { useSnackbar } from "notistack";

const TrackingTime = ({ timeIndex, locationIndex, fetching }) => {
  /**
   * Higher order declarations
   */
  const { enqueueSnackbar } = useSnackbar();

  /**
   * State declarations
   */
  const { user, setUser } = useContext(UserContext);
  const [activeTime, setActiveTime] = useState(null);

  /**
   * Non-state declarations
   */
  const time = user?.trackingDetails[locationIndex]?.times[timeIndex];
  const locationTimes = user?.trackingDetails[locationIndex]?.times;
  const trackingDetails = user?.trackingDetails;
  const trackingDetail = user?.trackingDetails[locationIndex];

  /**
   * Function declarations
   */
  // Add new time to track
  const addTime = () => {
    // Ensure user can only set 4 alerts
    if (locationTimes.length === 4)
      return enqueueSnackbar("You can't add anymore alerts.", {
        variant: "info",
      });

    // Get the tracking details that the user will no be editing
    const trackingLocationsNotBeingEdited = [
      ...trackingDetails.filter(
        (_, trackingDataIndex) => trackingDataIndex !== locationIndex
      ),
    ];

    /**
     * Update, via splicing, the trackingLocationsNotBeingEdited
     * Add the new time for that location
     */
    trackingLocationsNotBeingEdited.splice(locationIndex, 0, {
      ...trackingDetail,
      times: [...trackingDetail.times, ""],
    });

    setUser((prev) => {
      return {
        ...prev,
        trackingDetails: [...trackingLocationsNotBeingEdited],
      };
    });
  };

  // Delete time to track
  const deleteTime = () => {
    // Prevent deletion of every single location to track
    if (locationTimes.length === 1) return;

    // Get the tracking details that the user will no be editing
    const trackingLocationsNotBeingEdited = [
      ...trackingDetails.filter(
        (_, trackingDataIndex) => trackingDataIndex !== locationIndex
      ),
    ];

    /**
     * Update, via splicing, the trackingLocationsNotBeingEdited
     * Add the new time for that location
     */
    trackingLocationsNotBeingEdited.splice(locationIndex, 0, {
      ...trackingDetail,
      times: [
        ...trackingDetail.times.filter(
          (_, timeDataIndex) => timeDataIndex !== timeIndex
        ),
      ],
    });

    setUser((prev) => {
      return {
        ...prev,
        trackingDetails: [...trackingLocationsNotBeingEdited],
      };
    });
  };

  // Handle change in the time input
  const handleTimeChange = (value) => {
    // Get the tracking details that the user will no be editing
    const trackingLocationsNotBeingEdited = [
      ...trackingDetails.filter(
        (_, trackingDataIndex) => trackingDataIndex !== locationIndex
      ),
    ];

    // Get the timesNotBeingEdited
    const timesNotBeingEdited = locationTimes.filter(
      (_, dataTimeIndex) => dataTimeIndex !== timeIndex
    );

    // Update the time at the location to be edited
    timesNotBeingEdited.splice(timeIndex, 0, value);

    /**
     * Update, via splicing, the trackingLocationsNotBeingEdited
     * Change the time for that location
     */
    trackingLocationsNotBeingEdited.splice(locationIndex, 0, {
      ...trackingDetail,
      times: timesNotBeingEdited,
    });

    setUser((prev) => {
      return {
        ...prev,
        trackingDetails: [...trackingLocationsNotBeingEdited],
      };
    });
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
            handleClick={() => setActiveTime(timeIndex)}
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
      {activeTime === timeIndex ? (
        <TrackingSuggestions
          type="time"
          id={timeIndex}
          handleVisibility={setActiveTime}
          listOfTimes={locationTimes}
          setValue={handleTimeChange}
        />
      ) : null}
    </div>
  );
};

export default TrackingTime;
