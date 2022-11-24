import React, { useContext, useEffect, useState } from "react";
import editBackground from "assets/blues-aesthetic-unsplash.jpg";
import TextField from "components/TextField";
import Logo from "components/Logo";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserContext from "contexts/UserContext";
import Loader from "components/Loader";
import axios from "api/axios";
import useAuth from "hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useContext(UserContext);

  const { setAuth } = useAuth();

  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
    email: "alex.vause@gmail.com",
    password: "password",
  });

  const [error, setError] = useState({
    errorKey: "",
    errorValue: "",
  });

  const handleChange = (type, value) => {
    setForm((prev) => ({ ...prev, [type]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Disable forms and buttons during axios request
    setFetching(true);

    const LOGIN_URL = "/auth/login";

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify(form), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken;

      // Set global auth variable
      setAuth({ accessToken, refreshToken });
      // Set global user variable
      setUser({ ...response.data.user });

      enqueueSnackbar(response.data.msg, { variant: "success" });

      navigate(from, { replace: true });
    } catch (error) {
      // If the server does not send any error
      if (!error?.response)
        return enqueueSnackbar("No response from server, try again later.", {
          variant: "warning",
        });

      // If the error status is 400 - invalid details
      if (error.response.status === 400) {
        const { invalidFormItem, validationErrorMsg } = error?.response?.data;

        // Set form error
        setError({
          errorKey: invalidFormItem,
          errorValue: validationErrorMsg,
        });

        // Notify user about error
        return enqueueSnackbar(validationErrorMsg, { variant: "error" });
      }

      // If the error status = 401 - Unauthorized
      if (error.response.status === 401) {
        return enqueueSnackbar(error.response.data.msg, { variant: "error" });
      }

      // If the error status = 401 - Unauthorized
      if (error.response.status === 500) {
        return enqueueSnackbar(
          "There was a problem on the server, please try again later.",
          { variant: "error" }
        );
      }
    } finally {
      // Enable forms and buttons after axios request
      setFetching(false);
    }
  };

  // Clear the form error when the user starts typing
  useEffect(() => {
    setError({
      errorKey: "",
      errorValue: "",
    });
  }, [form]);

  return (
    <div
      className="h-screen w-full bg-fixed relative bg-secondary bg-center bg-no-repeat bg-cover p-10"
      style={{ backgroundImage: `url(${editBackground})` }}
    >
      <>
        <Link to="/" className="absolute left-5 top-2">
          <Logo />
        </Link>

        <p className="pt-10 font-black text-4xl text-white">
          Log into your account
        </p>

        <p to="/login" className="font-light text-sm text-white">
          Don't have an account?{" "}
          <Link to="/signup" className="text-secondary underline">
            Create an account
          </Link>
        </p>
      </>

      <form
        className="flex flex-col gap-4 lg:w-2/5 md:w-1/2 mt-5"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {/* Email address */}
        <TextField
          title={"email address"}
          type="email"
          value={form.email}
          handleChange={handleChange}
          placeholder="Enter your email address"
          error={error.errorKey === "email" && error.errorValue}
          disabled={fetching}
        />

        {/* Password address */}
        <TextField
          title={"password"}
          type="password"
          value={form.password}
          handleChange={handleChange}
          placeholder="Enter your password"
          error={error.errorKey === "password" && error.errorValue}
          disabled={fetching}
        />

        {/* Forgot password */}
        <Link
          to="/forgot-password"
          className="text-secondary underline text-sm w-max"
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={fetching}
          className={`w-full h-10 rounded-b-lg text-center text-sm ${
            fetching ? "bg-gray-400" : "bg-secondary"
          } text-white font-black grid place-content-center uppercase`}
        >
          {fetching ? <Loader fill="white" /> : "login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
