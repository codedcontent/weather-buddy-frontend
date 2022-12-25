import React, { useContext, useState } from "react";
import editBackground from "assets/blues-aesthetic-unsplash.jpg";
import TextField from "components/TextField";
import Logo from "components/Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import validateForm from "utils/validateForm";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useSnackbar } from "notistack";
import Loader from "components/Loader";
import UserContext from "contexts/UserContext";

const SignUp = () => {
  const auth = getAuth();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    firstName: "oge",
    lastName: "meph",
    email: "ogescoc@gmail.com",
    phoneNumber: "12345678910",
    password: "password",
  });
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [tosAccepted, setTosAccepted] = useState(true);
  const [fetching, setFetching] = useState(false);

  const handleChange = (type, value) => {
    setForm((prev) => ({ ...prev, [type]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    validateForm(form, setError);

    if (
      !error.firstName &&
      !error.lastName &&
      !error.email &&
      !error.phoneNumber &&
      !error.password &&
      tosAccepted
    ) {
      signUp();
    }
  };

  const signUp = async () => {
    setFetching(true);

    const url = `${process.env.REACT_APP_SERVER_URL}/users`;

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      setUser(user.user);

      const formDetails = {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phoneNumber,
        uid: user.user.uid,
      };

      // eslint-disable-next-line
      await fetch(url, {
        body: JSON.stringify(formDetails),
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      enqueueSnackbar("Sign up successful!", { variant: "success" });

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
      setFetching(false);
    }
  };

  return (
    <div
      className="h-screen overflow-y-scroll w-full bg-fixed relative bg-secondary bg-center bg-no-repeat bg-cover px-10"
      style={{ backgroundImage: `url(${editBackground})` }}
    >
      <>
        <Link to="/" className="absolute left-5 top-2">
          <Logo />
        </Link>

        <p className="pt-14 font-black text-4xl text-white">
          Create a new Weather Buddy account
        </p>

        <p to="/login" className="font-light text-sm text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary underline">
            Log in
          </Link>
        </p>
      </>

      <form
        className="space-y-4 lg:w-2/5 md:w-1/2 mt-5"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <>
          {/* First name */}
          <TextField
            error={error.firstName}
            title={"First name"}
            type="firstName"
            value={form.firstName}
            handleChange={handleChange}
            placeholder="Enter your first name"
          />

          {/* Last name */}
          <TextField
            error={error.lastName}
            title={"Last name"}
            type="lastName"
            value={form.lastName}
            handleChange={handleChange}
            placeholder="Enter your last name"
          />

          {/* Email address */}
          <TextField
            error={error.email}
            title={"email address"}
            type="email"
            value={form.email}
            handleChange={handleChange}
            placeholder="Enter your email address"
          />

          {/* phone number */}
          <TextField
            error={error.phoneNumber}
            title={"Phone number"}
            type="phoneNumber"
            value={form.phoneNumber}
            handleChange={handleChange}
            placeholder="Enter your phone number"
          />

          {/* Password address */}
          <TextField
            error={error.password}
            title={"password"}
            type="password"
            value={form.password}
            handleChange={handleChange}
            placeholder="Enter your password"
          />
        </>

        <label className="flex gap-2 ml-2">
          <input
            type="checkbox"
            className="text-white"
            onChange={() => {
              setTosAccepted((prev) => !prev);
            }}
            value={tosAccepted}
            checked={tosAccepted}
          />

          <p className="text-white text-xs">
            I agree that the details provided above is correct and will take
            responsibility for any incorrect information provided as seen in the{" "}
            <Link
              to="/tos"
              className="text-secondary underline cursor-pointer font-bold"
            >
              Weather Buddy Terms of Service
            </Link>
          </p>
        </label>

        <button
          type="submit"
          disabled={fetching}
          className={`w-full h-10 rounded-b-lg text-center text-sm ${
            fetching ? "bg-gray-400" : "bg-secondary"
          } text-white font-black grid place-content-center uppercase`}
        >
          {fetching ? <Loader fill="white" /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
