import React, { useContext, useState, useEffect } from "react";
import PricingCard from "./PricingCard";
import pricingPlans from "constants/pricingPlans";
import { usePaystackPayment } from "react-paystack";
import shortUUID from "short-uuid";
import { useSnackbar } from "notistack";
import UserContext from "contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import useAuth from "hooks/useAuth";
import Loader from "components/Loader";
import axios from "api/axios";

const Pricing = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, setUser } = useContext(UserContext);
  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const [fetching, setFetching] = useState(false);

  const [selectedPricingPlan, setSelectedPricingPlan] = useState(
    pricingPlans[user?.subscription_plan]
  );

  const [paymentRef, setPaymentRef] = useState(shortUUID.generate());

  // Paystack config
  const config = {
    reference: paymentRef,
    email: user?.email,
    amount: selectedPricingPlan?.price * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  // Paystack initialization
  const initializePayment = usePaystackPayment(config);

  const upgradeSubPlan = async () => {
    const apiURL = `users/plan/${user?.uid}/`;
    try {
      await axios.patch(apiURL, {
        subscription_plan: selectedPricingPlan?.type,
      });

      // Set new subscription plan
      setUser((prev) => ({
        ...prev,
        subscription_plan: selectedPricingPlan?.type,
      }));

      enqueueSnackbar("Subscription plan change successful.", {
        variant: "success",
      });

      // Redirect user to my-account page
      return navigate("/my-account");
    } catch (error) {
      const axiosError = error.response;

      enqueueSnackbar(axiosError.msg, { variant: "error" });
    } finally {
      setFetching(false);
    }
  };

  // Payment successful
  const onSuccess = () => {
    enqueueSnackbar("Payment successful", {
      variant: "success",
    });

    // Make a request to server to upgrade users subscription
    upgradeSubPlan();
  };

  // Payment cancelled
  const onClose = () => {
    enqueueSnackbar("Payment process terminated!", {
      variant: "error",
    });

    setFetching(false);
  };

  // Handle what happens when the user clicks on the pay button
  const handlePayClick = () => {
    setFetching(true);

    // If no user is logged in, redirect to login
    if (!user?.uid)
      return navigate("/login", { state: { from: location }, replace: true });

    // If the user downgrades to a free account, notify them, then perform the downgrade
    if (selectedPricingPlan?.type === "free") {
      enqueueSnackbar("Downgrading to free plan", { variant: "info" });

      // Change subs_plan
      return upgradeSubPlan();
    }

    // Generate a new payment ref for paystack config
    setPaymentRef(shortUUID.generate());

    // setUser((prev) => ({ ...prev, email: user?.email }));

    // User is going for a dove or lion sub-plan, initialize the payment
    initializePayment(onSuccess, onClose);
  };

  // UseEffect to get user details if not available
  useEffect(() => {
    // Get the users details
    const USERS_URL = `/users/${user?.user_id}`;

    let isMounted = true;
    const controller = new AbortController();

    const getUserDetails = async () => {
      try {
        const response = await axiosPrivate.get(USERS_URL, {
          signal: controller.signal,
        });

        // Set the users details
        isMounted && setUser(response.data?.user);
      } catch (error) {
        console.log(error);
      }
    };

    // Get user details if no user present but auth accessToken available
    // !user?.user_id && auth?.accessToken && getUserDetails();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => setFetching(false), []);

  return (
    <div className="h-screen w-full flex p-10 lg:px-28 justify-center items-center">
      {/* Subscription plan Description */}
      <div className="space-y-5 w-1/2">
        {user?.uid && (
          <p className="text-sm font-bold capitalize text-primary">
            Your current plan:{" "}
            <span className="underline cursor-pointer">
              {user?.subscription_plan} plan
            </span>
          </p>
        )}

        <p className="text-4xl font-black text-primary">
          Select your Weather Buddy subscription plan.
        </p>

        <div className="ml-2 space-y-1">
          {selectedPricingPlan?.type ? (
            <p className="text-xs font-black uppercase inline text-primary">
              {selectedPricingPlan?.type} plan
            </p>
          ) : (
            <p className="text-xs font-bold uppercase text-primary">
              Select a plan to see it's features and offering...
            </p>
          )}

          <ul className="list-disc list-inside ml-2 space-y-1">
            {selectedPricingPlan?.features.map((feature, i) => {
              return (
                <li className="text-sm" key={i}>
                  {feature}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Payment/Get-started button */}
        <button
          type="submit"
          className={`w-3/4 h-10 rounded-lg text-center text-sm ${
            selectedPricingPlan?.type &&
            selectedPricingPlan?.type !== user?.subscription_plan &&
            !fetching
              ? "bg-secondary"
              : "bg-gray-400"
          } text-white font-black uppercase grid place-content-center`}
          onClick={handlePayClick}
          disabled={
            !selectedPricingPlan?.type ||
            selectedPricingPlan?.type === user.subscription_plan
          }
        >
          {!fetching ? (
            user?.user_id || selectedPricingPlan?.type ? (
              selectedPricingPlan?.type === "free" ? (
                "Get Started"
              ) : (
                "Upgrade Plan"
              )
            ) : (
              "select a subscription plan"
            )
          ) : (
            <Loader fill="white" />
          )}
        </button>
      </div>

      {/* Subscription plans */}
      <div className="w-1/2 flex gap-4 flex-col justify-center items-center">
        {Object.values(pricingPlans)
          .filter((x) => x.type !== user?.subscription_plan)
          .map((plan, i) => {
            return (
              <PricingCard
                key={i}
                plan={plan}
                setPricingPlan={setSelectedPricingPlan}
                selectedPricingPlan={selectedPricingPlan}
                fetching={fetching}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Pricing;
