import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "contexts/UserContext";
import TrackLocationWidget from "components/TrackLocationWidget";
import short from "short-uuid";

const AccountDetails = () => {
  const { user, setUser } = useContext(UserContext);

  const [openTrackingWidget, setOpenTrackingWidget] = useState(false);

  return (
    <div className="h-full w-full pt-28 px-5 space-y-10">
      {/* Account Details */}
      <section className="mb-10">
        <div className="w-full flex justify-between items-center">
          <p className="font-black text-3xl w-max">Account Details</p>
          <Link
            to="edit"
            className="font-light text-sm w-max text-primary underline"
          >
            Edit account details
          </Link>
        </div>

        <div className="space-y-3 mt-5 w-max">
          <p className="font-light text-sm w-max">
            Name: {user?.first_name} {user?.last_name}
          </p>

          <p className="font-light text-sm w-max">
            Contact Number: {user?.phone}
          </p>

          <p className="font-light text-sm w-max">
            Email Address: {user?.email}
          </p>
        </div>
      </section>

      {/* Locations to track container */}
      <section className="w-full">
        <p className="font-black text-3xl">Your tracking locations</p>

        {user?.trackingDetails?.length > 0 ? (
          // Show tracking location widget
          <TrackLocationWidget
            trackingDetails={user?.trackingDetails}
            setTrackingDetails={setUser}
          />
        ) : (
          <div className="w-full bg-gray-100">
            {user?.trackingDetails?.length === 0 ? (
              <p className="font-light text-sm w-max">
                You aren't tracking any locations.{" "}
                <span
                  className="underline cursor-pointer text-primary text-bold"
                  onClick={() => {
                    setUser((prev) => ({
                      ...prev,
                      trackingDetails: [
                        ...prev.trackingDetails,
                        {
                          location: { id: short.generate(), value: "" },
                          times: [{ id: short.generate(), value: "" }],
                        },
                      ],
                    }));
                  }}
                >
                  Track Some
                </span>
              </p>
            ) : (
              // Show tracking location widget
              <TrackLocationWidget
                trackingDetails={user?.trackingDetails}
                setTrackingDetails={setUser}
              />
            )}
          </div>
        )}
      </section>

      {/* Weather Buddy Plan */}
      <section>
        <p className="font-black text-3xl w-max">
          Weather Buddy Subscription Plan
        </p>

        <div className="space-x-2 mt-5 flex justify-center items-center w-max">
          <button className="text-xs font-bold text-primary px-3 rounded-md shadow-sm border-2 capitalize">
            {user?.subscription_plan} plan
          </button>

          <Link
            to="/pricing"
            className="font-extralight underline text-primary text-xs w-max"
          >
            Upgrade plan
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AccountDetails;
