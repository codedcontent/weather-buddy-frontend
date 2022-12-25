import sunnyBackground from "assets/sunnyunsplash.jpg";
import cloudyBackground from "assets/cloudy-unsplash.jpg";
import stormyBackground from "assets/stormy-unsplash.jpg";
import rainyBackground from "assets/rainy-unsplash.jpg";
import snowyBackground from "assets/snow-unsplash.jpg";
import drizzleBackground from "assets/drizzle-unsplash.jpg";
import fogBackground from "assets/fog-unsplash.jpg";
import loadingBackground from "assets/loadingBackground.jpg";

const weatherImages = {
  drizzle: {
    image: drizzleBackground,
  },
  clouds: {
    image: cloudyBackground,
  },
  rain: {
    image: rainyBackground,
  },
  rainy: {
    image: rainyBackground,
  },
  thunderstorm: {
    image: stormyBackground,
  },
  snow: {
    image: snowyBackground,
  },
  atmosphere: {
    image: fogBackground,
  },
  clear: {
    image: sunnyBackground,
  },
  loading: {
    image: loadingBackground,
  },
};

export default weatherImages;
