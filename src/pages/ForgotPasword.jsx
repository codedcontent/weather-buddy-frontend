import React, { useState } from "react";
import editBackground from "assets/blues-aesthetic-unsplash.jpg";
import TextField from "components/TextField";
import Logo from "components/Logo";
import { Link } from "react-router-dom";
import validateForm from "utils/validateForm";

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleChange = (type, value) => {
    setForm((prev) => ({ ...prev, [type]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    validateForm(form, setError);
  };

  return (
    <div
      className="h-screen w-full bg-fixed relative bg-secondary bg-center bg-no-repeat bg-cover p-10"
      style={{ backgroundImage: `url(${editBackground})` }}
    >
      <Link to="/" className="absolute left-5 top-2">
        <Logo />
      </Link>

      <p className="pt-10 font-black text-4xl text-white">Forgot password</p>

      <p to="/login" className="font-light text-sm text-white">
        Enter your email to reset your password
      </p>

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
          error={error.email}
        />

        <button
          type="submit"
          className="w-full h-10 rounded-b-lg text-center text-sm bg-secondary text-white font-black"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
