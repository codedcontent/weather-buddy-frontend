import React, { useState, useContext } from "react";
import TextField from "../TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { useSnackbar } from "notistack";
import short from "short-uuid";
import Loader from "components/Loader";
import UserContext from "contexts/UserContext";
import axios from "api/axios";
import TrackLocationTimes from "./TrackLocationTimes";

// if (subs_plan === "free" && locationTimes.length === 1)
//       return enqueueSnackbar(
//         "You only add 1 alert per-location for a free account. Upgrade subscription to add more.",
//         { variant: "warning" }
//       );

const TrackLocationWidget = ({}) => {
  const { user, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  // State variable declaration
  const [showTimeFields, setShowTimeFields] = useState(false);
  const [fetching, setFetching] = useState(false);

  // non-state variable declaration
  const subs_plan = user?.subscription_plan;

  // Submit the new tracking details to backend
  const handleSubmit = async () => {
    // Disable users actions while making request to server
    setFetching(true);

    const { trackingDetails: tracks, ...userDetails } = user;

    try {
      const response = await axios.post(
        `/weather/${user?.uid}`,
        user?.trackingDetails
      );

      console.log(response.data);
    } catch (error) {
      const axiosError = error.response;
      console.log({ axiosError });

      if (axiosError.status === 400)
        return enqueueSnackbar(axiosError.data.msg, { variant: "error" });
    } finally {
      setFetching(false);
    }
  };

  /**
   * Redoing the code start
   */

  const addTrackingLocation = () => {
    setUser((prev) => ({
      ...prev,
      trackingDetails: [
        {
          location: {
            title: "",
            coord: {
              lat: "",
              lon: "",
            },
          },
          times: [""],
        },
      ],
    }));
  };

  /**
   * Redoing the code stop
   */

  return (
    <div className="space-y-2 relative">
      {user?.trackingDetails?.length === 0 || !user?.trackingDetails ? (
        <p className="font-light text-sm w-max">
          You aren't tracking any locations.{" "}
          <span
            className="underline cursor-pointer text-primary text-bold"
            onClick={addTrackingLocation}
          >
            Track Some
          </span>
        </p>
      ) : (
        <>
          {user?.trackingDetails?.map((_, locationIndex) => (
            <TrackLocationTimes
              key={locationIndex}
              fetching={fetching}
              locationIndex={locationIndex}
            />
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
        </>
      )}
    </div>
  );
};

export default TrackLocationWidget;
