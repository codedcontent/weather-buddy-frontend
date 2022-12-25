import React, { useContext, useEffect, useState } from "react";
import editBackground from "assets/blues-aesthetic-unsplash.jpg";
import TextField from "components/TextField";
import Logo from "components/Logo";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserContext from "contexts/UserContext";
import Loader from "components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const from = location.state?.from?.pathname || "/";

  const { setUser } = useContext(UserContext);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({
    email: "ogescoc@gmail.com",
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

    try {
      const user = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Set global user variable
      setUser({ uid: user.user.uid, email: user.user.email });

      enqueueSnackbar("Login successful.", { variant: "success" });

      navigate(from, { replace: true });
    } catch (error) {
      if (error.code) {
        enqueueSnackbar(error.code, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Something went wrong on the server, try again later.",
          {
            variant: "error",
          }
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
