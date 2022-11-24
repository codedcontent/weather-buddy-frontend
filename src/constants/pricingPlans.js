const pricingPlans = {
  free: {
    type: "free",
    description:
      "Free is nice, test the waters of weather buddy with our free plan.",
    features: [
      "Track the weather for 1 location.",
      "Get weather updates once a day.",
      "Receive weather updates via emails.",
    ],
    price: 0,
  },
  dove: {
    type: "dove",
    description:
      "Easy and affordable plan, perfect if you need weather updates a few times a day.",
    features: [
      "Track the weather for up to 5 locations.",
      "Get weather updates twice a day.",
      "Receive weather updates via SMS.",
      "Help & Support on weekends.",
    ],
    price: 1500,
  },
  lion: {
    type: "lion",
    description:
      "Be as ferocious as a lion with your weather savviness. The lion plan offers the best weather updates.",
    features: [
      "Track the weather for unlimited locations.",
      "Get weather updates 4 times a day.",
      "Receive weather updates via SMS, Whatsapp and Telegram.",
      "24/7 Help & Support.",
    ],
    price: 5000,
  },
};

export default pricingPlans;
