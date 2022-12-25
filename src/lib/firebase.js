// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpGjvdPA9DpwE0GbPxcpUR9PnmvHASmdQ",
  authDomain: "weather-buddy-9e34b.firebaseapp.com",
  projectId: "weather-buddy-9e34b",
  storageBucket: "weather-buddy-9e34b.appspot.com",
  messagingSenderId: "172445541985",
  appId: "1:172445541985:web:5608d54a8cb09a8606ac20",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
