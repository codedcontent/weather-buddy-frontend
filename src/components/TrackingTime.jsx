import React, { useContext } from "react";
import { useState } from "react";
import TextField from "./TextField";
import TrackingSuggestions from "./track-location-widget/TrackingSuggestions";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import UserContext from "contexts/UserContext";

let trackingDetail = [];

const TrackingTime = ({ timeIndex, locationIndex, fetching }) => {
  const { user, setUser } = useContext(UserContext);

  const [activeTime, setActiveTime] = useState(null);

  const time = user?.trackingDetails[locationIndex]?.times[timeIndex];
  const locationTimes = user?.trackingDetails[locationIndex]?.times;
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
              // addNewLocationTime(trackingDetail.location.id);
            }}
          />
        )}

        <DeleteIcon
          onClick={() => {
            // deleteLocationTime(
            //   trackingDetail.location.id,
            //   time.id
            // );
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
          listOfTimes={trackingDetail.times.map((time) => time.value)}
        />
      ) : null}
    </div>
  );
};

export default TrackingTime;
