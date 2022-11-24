import React, { useState } from "react";
import TextField from "./TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { useSnackbar } from "notistack";
import short from "short-uuid";
import Loader from "components/Loader";
import TrackingSuggestions from "./TrackingSuggestions";

const TrackLocationWidget = ({ trackingDetails, setTrackingDetails }) => {
  const subs_plan = "lion";

  const [showTimeFields, setShowTimeFields] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [currentActiveInput, setCurrentActiveInput] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  // Add an alert time for a location
  const addNewLocationTime = (locationId) => {
    if (fetching) return false;
    const locationTimes = trackingDetails.filter(
      (trackingDetail) => trackingDetail.location.id === locationId
    )[0].times;

    /**
     * Check if users subscription plan permits adding another alert time
     * START
     */
    // Checking for free plan
    if (subs_plan === "free" && locationTimes.length === 1)
      return enqueueSnackbar(
        "You only add 1 alert per-location for a free account. Upgrade subscription to add more.",
        { variant: "warning" }
      );

    // Checking for dove plan
    if (subs_plan === "dove" && locationTimes.length === 2)
      return enqueueSnackbar(
        "You can add a max of 2 alerts per-location for a dove account. Upgrade subscription to add more.",
        { variant: "warning" }
      );

    // Checking for Lion plan
    if (subs_plan === "lion" && locationTimes.length === 4)
      return enqueueSnackbar(
        "You have reached the maximum alerts Weather Buddy offers.",
        { variant: "info" }
      );

    /**
     * Check if users subscription plan permits adding another alert time
     * END
     */

    // Get the location details for the location the user want to add an alert time to at the call of the function
    const locationToAddTime = trackingDetails.filter(
      (trackingDetail) => trackingDetail.location.id === locationId
    )[0];

    // Get the locations that the user isn't adding any time to at the call of the function
    const locationsNotToAddTime = trackingDetails.filter(
      (trackingDetail) => trackingDetail.location.id !== locationId
    );

    // Add an empty string to the times-array of the location the user wants to add a new time to at the function call.
    locationToAddTime.times.push({
      id: short.generate(),
      value: "",
    });

    // Get the index of the location that is to be changed
    const indexOfChangingLocation = trackingDetails.findIndex(
      (trackingDetail) => trackingDetail.location.id === locationId
    );

    // Add the newly update location, which a new alert time was added to it, at EXACTLY the position it was retrieved from
    locationsNotToAddTime.splice(indexOfChangingLocation, 0, locationToAddTime);

    // Set the new tracking details
    setTrackingDetails(locationsNotToAddTime);
  };

  // Delete an alert time for a location
  const deleteLocationTime = (locationId, timeId) => {
    if (fetching) return false;
    const locationTimes = trackingDetails.filter(
      (trackingDetail) => trackingDetail.location.id === locationId
    )[0].times;

    // Prevent user from deleting all the time-inputting-textFields
    if (locationTimes.length === 1)
      return enqueueSnackbar("An alert time is required", { variant: "error" });

    // Get the location that contains the time Oge wants to delete
    const locationToRemoveTime = trackingDetails.filter(
      (trackingDetail) => trackingDetail.location.id === locationId
    )[0];

    // Get the locations that contains times Oge isn't going to delete.
    const locationsToNotRemoveTime = trackingDetails.filter(
      (trackingDetail) => trackingDetail.location.id !== locationId
    );

    // Remove the time to be deleted from the list of times in the to-alter-location
    locationToRemoveTime.times = locationTimes.filter(
      (timeDetail) => timeDetail.id !== timeId
    );

    // Set the state for the new tracking details
    setTrackingDetails([...locationsToNotRemoveTime, locationToRemoveTime]);
  };

  // Add a new location to track
  const addLocation = (locationId) => {
    if (fetching) return false;
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
    setTrackingDetails((prev) => [
      ...prev,
      {
        location: { id: short.generate(), value: "" },
        times: [{ id: short.generate(), value: "" }],
      },
    ]);
  };

  // Delete a location to track
  const deleteLocation = (locationId) => {
    if (fetching) return false;
    // Remove the location to be deleted from the list
    const newTrackingDetails = trackingDetails.filter(
      (trackingDetail) => trackingDetail.location.id !== locationId
    );

    // Set the new tracking details
    setTrackingDetails(newTrackingDetails);
  };

  const handleChange = (type, value, inputId) => {
    if (fetching) return false;
    const { locationId, timeId } = inputId;

    // Get the location that is being edited from the list of locations
    const locationBeingEdited = trackingDetails[locationId];

    // Update the location or time with the changes
    if (timeId !== null && timeId !== undefined) {
      locationBeingEdited.times[timeId].value = value;

      // Show suggestions for the acceptable time values
      setCurrentActiveInput({ locationId, timeId });
    } else {
      locationBeingEdited.location.value = value;

      // Show suggestions for the acceptable location values
      setCurrentActiveInput({ locationId });
    }

    // Set the new tracking details
    setTrackingDetails((prev) => [
      ...prev.filter((_, id) => {
        return id !== inputId.locationId;
      }),
      locationBeingEdited,
    ]);
  };

  const handleSubmit = () => {
    // Submit the new tracking details to backend
  };

  return (
    <div className="space-y-2 relative">
      {trackingDetails.map((trackingDetail, x) => (
        <div className="w-1/2" key={x}>
          {/* Add locations to track */}
          <div className="w-full">
            <p className="font-bold text-sm ml-3 text-primary">
              Type location you wish to track
            </p>

            <div className="w-full mt-1 ml-3 relative">
              {/* Text field for locations */}
              <div className="flex gap-5 justify-between items-center w-full ">
                <div className="flex-1">
                  {/* Textfield */}
                  <TextField
                    title={`Location ${x + 1}`}
                    value={
                      !trackingDetail.location.value?.title
                        ? trackingDetail.location.value
                        : trackingDetail.location.value.title
                    }
                    inputId={{ locationId: x }}
                    handleChange={handleChange}
                    disabled={fetching}
                    handleClick={() =>
                      setCurrentActiveInput({
                        locationId: x,
                      })
                    }
                  />
                </div>

                {/* Add location */}
                {trackingDetails.length === x + 1 && (
                  <AddAlertIcon
                    onClick={() => {
                      addLocation(x);
                    }}
                    className="text-green-500 cursor-pointer"
                  />
                )}

                {/* Delete location */}
                <DeleteIcon
                  onClick={() => deleteLocation(trackingDetail.location.id)}
                  className="text-red-500 cursor-pointer"
                />
              </div>

              {/* The suggestions for the input fields */}
              {currentActiveInput &&
              JSON.stringify(currentActiveInput) ===
                JSON.stringify({ locationId: x }) ? (
                <TrackingSuggestions
                  type="location"
                  id={{ locationId: x }}
                  setValue={handleChange}
                  value={trackingDetail.location.value}
                  handleVisibility={setCurrentActiveInput}
                />
              ) : null}
            </div>
          </div>

          {/* Add times to track locations */}
          <div>
            <p className="ml-10 font-light text-sm text-primary">
              Add times to get weather alerts on this location
            </p>

            {trackingDetail.times.map((time, i) => (
              <div className="ml-10 w-[60%] relative" key={i}>
                <div className="flex gap-5 justify-between items-center w-full">
                  {/* Time text field */}
                  <div className="flex-1">
                    <TextField
                      title={`Time ${i + 1}`}
                      value={time.value}
                      // handleChange={handleChange}
                      disabled={fetching}
                      handleClick={() =>
                        setCurrentActiveInput({
                          locationId: x,
                          timeId: i,
                        })
                      }
                    />
                  </div>

                  {/* Add more button */}
                  {trackingDetail.times.length === i + 1 && (
                    <AddAlertIcon
                      className="text-green-500 cursor-pointer"
                      onClick={() => {
                        addNewLocationTime(trackingDetail.location.id);
                      }}
                    />
                  )}

                  <DeleteIcon
                    onClick={() => {
                      deleteLocationTime(trackingDetail.location.id, time.id);
                    }}
                    className="text-red-500 cursor-pointer"
                  />
                </div>

                {/* The suggestions for the input fields */}
                {currentActiveInput &&
                JSON.stringify(currentActiveInput) ===
                  JSON.stringify({ locationId: x, timeId: i }) ? (
                  <TrackingSuggestions
                    type="time"
                    id={{ locationId: x, timeId: i }}
                    setValue={handleChange}
                    handleVisibility={setCurrentActiveInput}
                    listOfTimes={trackingDetail.times.map((time) => time.value)}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        disabled={fetching}
        className={`px-4 h-10 rounded-lg text-center text-sm ${
          fetching ? "bg-gray-400" : "bg-secondary"
        } text-white font-black grid place-content-center uppercase absolute right-0 bottom-0`}
        onClick={handleSubmit}
      >
        {fetching ? <Loader fill="white" /> : "Save"}
      </button>
    </div>
  );
};

export default TrackLocationWidget;
