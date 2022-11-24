import React from "react";
import pricingPlans from "constants/pricingPlans";

const CustomRadioButton = ({ selected }) => {
  if (selected) {
    return (
      <div className="h-3.5 w-3.5 rounded-full border-[1px] border-primary flex justify-center items-center">
        <div className="h-2 w-2 rounded-full bg-primary flex justify-center items-center"></div>
      </div>
    );
  } else {
    return (
      <div className="h-3.5 w-3.5 rounded-full border-[1px] border-gray-400 flex justify-center items-center"></div>
    );
  }
};

const PricingCard = ({
  plan,
  selectedPricingPlan,
  setPricingPlan,
  fetching,
}) => {
  const selectedPlanStyle = `
        ${
          plan.type === selectedPricingPlan?.type
            ? "border-2 border-primary"
            : "border-gray-400 border-[1px]"
        } 
    `;

  const handleClick = () => {
    if (fetching) return false;

    setPricingPlan(pricingPlans[plan.type]);
  };

  return (
    <div
      className={`relative w-3/4 p-3 rounded-2xl ${
        !fetching && "cursor-pointer"
      } ${selectedPlanStyle}`}
      onClick={handleClick}
    >
      <div className="absolute top-2">
        <CustomRadioButton selected={plan.type === selectedPricingPlan?.type} />
      </div>

      <div className="ml-6 flex justify-around gap-4 items-center">
        <div>
          <p className="font-black text-xl capitalize">{plan.type} plan</p>
          <p className="text-sm font-light">{plan.description}</p>
        </div>

        <p className="pr-2 text-xs font-bold w-max text-secondary flex-auto">
          ₦{plan.price}/per mo.
        </p>
      </div>
    </div>
  );
};

export default PricingCard;
