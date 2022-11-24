import React, { useState } from "react";
import editBackground from "assets/blues-aesthetic-unsplash.jpg";
import TextField from "components/TextField";
import Logo from "components/Logo";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [form, setForm] = useState({
    password: "",
  });

  const handleChange = (type, value) => {
    setForm((prev) => ({ ...prev, [type]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div
      className="h-screen w-full bg-fixed relative bg-secondary bg-center bg-no-repeat bg-cover p-10"
      style={{ backgroundImage: `url(${editBackground})` }}
    >
      <Link to="/" className="absolute left-5 top-2">
        <Logo />
      </Link>

      <p className="pt-10 font-black text-4xl text-white">Reset password</p>

      <p to="/login" className="font-light text-sm text-white">
      Set a new password for your account
      </p>

      <form
        className="flex flex-col gap-4 lg:w-2/5 md:w-1/2 mt-5"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >

        {/* Password */}
        <TextField
          title={"password"}
          type="password"
          value={form.password}
          handleChange={handleChange}
          placeholder="Enter your password"
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

export default ResetPassword;
