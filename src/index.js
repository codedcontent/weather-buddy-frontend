import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAccount from "pages/account/MyAccount";
import AccountEdit from "pages/account/AccountEdit";
import SignUp from "pages/SignUp";
import Login from "pages/Login";
import ForgotPassword from "pages/ForgotPasword";
import ResetPassword from "pages/ResetPassword";
import Pricing from "pages/pricing/Pricing ";
import { SnackbarProvider } from "notistack";
import { UserProvider } from "contexts/UserContext";
import { AuthProvider } from "contexts/AuthProvider";
import RequireAuth from "components/RequireAuth";
import PersistLogin from "components/PersistLogin";

const WeatherBuddyApp = () => {
  return (
    <React.StrictMode>
      <div>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          {/* React router */}
          <Router>
            <Routes>
              <Route element={<PersistLogin />}>
                <Route element={<RequireAuth />}>
                  {/* My account Edit */}
                  <Route
                    element={<AccountEdit />}
                    path="/my-account/edit"
                    exact
                  />
                </Route>
              </Route>

              {/* My account */}
              <Route element={<MyAccount />} path="/my-account" />

              {/* Home */}
              <Route element={<App />} path="/" exact />

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
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <AuthProvider>
      <WeatherBuddyApp />
    </AuthProvider>
  </UserProvider>
);
