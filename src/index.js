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
import { SnackbarProvider } from "notistack";
import UserContext, { UserProvider } from "contexts/UserContext";
import RequireAuth from "components/RequireAuth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const WeatherBuddyApp = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email });

        // Fetch the user details from server
      } else {
        setUser(null);
      }
    });
    // eslint-disable-next-line
  }, []);
  return (
    <React.StrictMode>
      {user !== undefined && (
        <div>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
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
                </Route>

                {/* My account */}
                <Route element={<MyAccount />} path="/my-account" />

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
