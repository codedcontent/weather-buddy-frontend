import React, { useState } from "react";
import TextField from "./TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { useSnackbar } from "notistack";

const TrackLocationWidget = ({ trackingDetails, setTrackingDetails }) => {
  const subs_plan = "free";

  const [showTimeFields, setShowTimeFields] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // Add an alert time for a location
  const addNewLocationTime = (locationId) => {
    /**
     * Check if users subscription plan permits adding another alert time
     * START
     */
    // Checking for free plan
    if (subs_plan === "free" && trackingDetails[locationId].times.length === 1)
      return enqueueSnackbar(
        "You only add 1 alert per-location for a free account. Upgrade subscription to add more.",
        { variant: "warning" }
      );

    // Checking for dove plan
    if (subs_plan === "dove" && trackingDetails[locationId].times.length === 2)
      return enqueueSnackbar(
        "You can add a max of 2 alerts per-location for a dove account. Upgrade subscription to add more.",
        { variant: "warning" }
      );

    // Checking for Lion plan
    if (subs_plan === "lion" && trackingDetails[locationId].times.length === 4)
      return enqueueSnackbar(
        "You have reached the maximum alerts Weather Buddy offers.",
        { variant: "info" }
      );

    /**
     * Check if users subscription plan permits adding another alert time
     * END
     */

    // Get the location details for the location the user want to add an alert time to at the call of the function
    const locationToAddTime = trackingDetails[locationId];

    // Get the locations that the user isn't adding any time to at the call of the function
    const locationsNotToAddTime = trackingDetails.filter(
      (_, i) => i !== locationId
    );

    // Add an empty string to the times-array of the location the user wants to add a new time to at the function call.
    // locationsNotToAddTime.times = [...locationToAddTime.times, ""];
    locationToAddTime.times.push("");

    // Add the newly update location, which a new alert time was added to it, at EXACTLY the position it was retrieved from
    locationsNotToAddTime.splice(locationId, 0, locationToAddTime);

    console.log(locationsNotToAddTime);

    // Set the new tracking details
    setTrackingDetails(locationsNotToAddTime);
  };

  // Delete an alert time for a location
  const deleteLocationTime = (locationId, timeId) => {
    // Prevent user from deleting all the time-inputting-textFields
    if (trackingDetails[locationId].times.length === 1)
      return enqueueSnackbar("An alert time is required", { variant: "error" });

    // Get the location that contains the time Oge wants to delete
    const locationToRemoveTime = trackingDetails[locationId];

    // Get the locations that contains times Oge isn't going to delete.
    const locationsToNotRemoveTime = trackingDetails.filter(
      (_, i) => i !== locationId
    );

    // Remove the time to be deleted from the list of times in the to-alter-location
    locationToRemoveTime.times = locationToRemoveTime.times.filter(
      (_, timeIndex) => timeIndex !== timeId
    );

    // Set the state for the new tracking details
    setTrackingDetails([...locationsToNotRemoveTime, locationToRemoveTime]);

    console.log({ locationToRemoveTime, locationsToNotRemoveTime });
  };

  // Add a new location to track
  const addLocation = (locationId) => {
    /**
     * Check if users subscription plan permits adding another alert time
     * START ----------
     */
    // Checking for free plan
    if (subs_plan === "free" && trackingDetails.length === 1)
      return enqueueSnackbar(
        "You can only 1 locations' weather on a Free account. Upgrade subscription to add more.",
        { variant: "warning" }
      );

    // Checking for dove plan
    if (subs_plan === "dove" && trackingDetails.length === 5)
      return enqueueSnackbar(
        "You only track 5 locations' weather on a free account. Upgrade subscription to add more.",
        { variant: "warning" }
      );

    /**
     * Check if users subscription plan permits adding another alert time
     * END ----------
     */

    // Add a new location to the list of locations being tracked
    setTrackingDetails((prev) => [...prev, { location: "", times: [""] }]);
  };

  // Delete a location to track
  const deleteLocation = (locationId) => {
    // Remove the location to be deleted from the list
    const newTrackingDetails = trackingDetails.filter(
      (_, locationIndex) => locationIndex !== locationId
    );

    // Set the new tracking details
    setTrackingDetails(newTrackingDetails);
  };

  const handleChange = (type, value, inputId) => {
    // Get the location that is being edited from the list of locations
    const locationBeingEdited = trackingDetails[inputId.locationId];

    // Update the location with the changes
    locationBeingEdited.location = value;

    // Set the new tracking details
    setTrackingDetails((prev) => [
      ...prev.filter((_, id) => id !== inputId.locationId),
      locationBeingEdited,
    ]);
  };

  const handleLocationChange = () => {};

  return (
    <div className="space-y-2">
      {trackingDetails.map((trackingDetail, x) => (
        <div className="w-1/2" key={x}>
          {/* Add locations to track */}
          <div className="">
            <p className="font-bold text-sm ml-3 text-primary">
              Type location you wish to track
            </p>

            <div className="w-full mt-1 px-3">
              {/* Text field for locations */}
              <div className="flex gap-5 justify-between items-center w-full">
                <div className="flex-1">
                  <TextField
                    title={`Location ${x + 1}`}
                    value={trackingDetail.location}
                    inputId={{ locationId: x, type: "location" }}
                    handleChange={handleChange}
                  />
                </div>

                {trackingDetails.length === x + 1 && (
                  <AddAlertIcon
                    onClick={() => {
                      addLocation(x);
                    }}
                    className="text-green-500 cursor-pointer"
                  />
                )}

                <DeleteIcon
                  onClick={() => deleteLocation(x)}
                  className="text-red-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Add times to track locations */}
          <div>
            <p className="ml-10 font-light text-sm text-primary">
              Add times to get weather alerts on this location
            </p>

            {trackingDetail.times.map((time, i) => (
              <div className="ml-10 w-[60%]" key={i}>
                {/* Text field for locations */}
                <div className="flex gap-5 justify-between items-center w-full">
                  <div className="flex-1">
                    <TextField
                      title={`Time ${i + 1}`}
                      value={time}
                      inputId={{ locationId: x, timeId: i, type: "time" }}
                      handleChange={handleChange}
                    />
                  </div>

                  {trackingDetail.times.length === i + 1 && (
                    <AddAlertIcon
                      className="text-green-500 cursor-pointer"
                      onClick={() => {
                        addNewLocationTime(x);
                      }}
                    />
                  )}

                  <DeleteIcon
                    onClick={() => {
                      deleteLocationTime(x, i);
                    }}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackLocationWidget;
