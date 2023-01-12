import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
/**DO NOT MIND */
// eslint-disable-next-line
import app from "lib/firebase";
/**DO NOT MIND */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import MyAccount from "pages/account/MyAccount";
import AccountEdit from "pages/account/AccountEdit";
import SignUp from "pages/SignUp";
import Login from "pages/Login";
import ForgotPassword from "pages/ForgotPasword";
import ResetPassword from "pages/ResetPassword";
import Pricing from "pages/pricing/Pricing ";
import { SnackbarProvider, useSnackbar } from "notistack";
import UserContext, { UserProvider } from "contexts/UserContext";
import RequireAuth from "components/RequireAuth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CircularProgress } from "@mui/material";
import axios from "api/axios";

const WeatherBuddyApp = () => {
  // const { enqueueSnackbar } = useSnackbar();

  const { user, setUser } = useContext(UserContext);

  // UseEffect to load the users authentication details
  useEffect(() => {
    const auth = getAuth();

    // Get the users details
    const getUserDetails = async (user) => {
      const USERS_URL = `/users/${user.uid}`;

      try {
        const response = await axios.get(USERS_URL);

        console.log(response.data);

        // Set the users details
        setUser({ uid: user.uid, email: user.email, ...response.data });
      } catch (error) {
        console.error(error);
        if (error.code) {
          // enqueueSnackbar(error.code, { variant: "error" });
        } else {
          // enqueueSnackbar("Error getting details, try again later.", {
          //   variant: "error",
          // });
        }
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserDetails(user);
        // setUser({  });

        // Fetch the user details from server
      } else {
        setUser(null);
      }
    });
    // eslint-disable-next-line
  }, []);

  // UseEffect to load the users

  return (
    <React.StrictMode>
      {user !== undefined ? (
        <div>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          >
            {/* React router */}
            <Router>
              <Routes>
                <Route element={<App />} path="/" exact />

                {/* Paths that require user to be authenticated */}
                <Route element={<RequireAuth />}>
                  {/* My account Edit */}
                  <Route
                    element={<AccountEdit />}
                    path="/my-account/edit"
                    exact
                  />

                  {/* My account */}
                  <Route element={<MyAccount />} path="/my-account" />
                </Route>

                {/* Home */}

                {/* Login Route */}
                <Route element={<Login />} path="/login" />

                {/* pricing Route */}
                <Route element={<Pricing />} path="/pricing" />

                {/* SignUp Route */}
                <Route element={<SignUp />} path="/signUp" />

                {/* forgot-password Route */}
                <Route element={<ForgotPassword />} path="/forgot-password" />

                {/* reset-password Route */}
                <Route element={<ResetPassword />} path="/reset-password" />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <p className="text-9xl w-4/5 h-screen m-auto grid place-items-center text-center uppercase text-primary">
                      404: Page Not found
                    </p>
                  }
                />
              </Routes>
            </Router>
          </SnackbarProvider>
        </div>
      ) : (
        <div className="h-screen w-screen grid place-items-center">
          <CircularProgress />
        </div>
      )}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <WeatherBuddyApp />
  </UserProvider>
);
