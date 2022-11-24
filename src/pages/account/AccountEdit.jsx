import React, { useContext, useEffect, useState } from "react";
import editBackground from "assets/blues-aesthetic-unsplash.jpg";
import TextField from "components/TextField";
import Logo from "components/Logo";
import { Link, useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import { useSnackbar } from "notistack";
import UserContext from "contexts/UserContext";
import useAxiosPrivate from "hooks/useAxiosPrivate";

const AccountEdit = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    first_name: user?.first_name ? user?.first_name : "",
    last_name: user?.last_name ? user?.last_name : "",
    phone: user?.phone ? user?.phone : "",
  });

  const [error, setError] = useState({
    errorKey: "",
    errorValue: "",
  });

  const [loadingFetchResult, setLoadingFetchResult] = useState(false);

  const handleChange = (type, value) => {
    setForm((prev) => ({ ...prev, [type]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Before request is made to the server, display a loader and disable inputs
    setLoadingFetchResult(true);

    // Update users account details
    try {
      const raw = JSON.stringify({
        user_id: user?.user_id,
        form,
      });

      const response = await axiosPrivate.patch(`/users/${user?.user_id}`, raw);

      // There are no more input errors, clear error state
      setError({
        errorKey: "",
        errorValue: "",
      });

      // Users details was updated successfully, remove loader and enable input fields
      setLoadingFetchResult(false);

      // Notify user of successful update
      enqueueSnackbar(response.data.msg, {
        variant: "success",
      });

      // Go back to the previous page
      navigate(-1);
    } catch (error) {
      const axiosError = error.response;
      console.log(axiosError);

      // Server error
      if (axiosError.status === 500)
        return enqueueSnackbar(axiosError.data.msg, { variant: "error" });

      // Invalid user credentials
      if (axiosError.status === 400) {
        // Invalid form inputs error
        if (axiosError.data.invalidFormItem)
          return notifyUserOfFormError(axiosError);

        return enqueueSnackbar(
          "Encountered a problem while updating, try again later.",
          { variant: "error" }
        );
      }
    }
  };

  // Notify user of input errors
  const notifyUserOfFormError = (error) => {
    // Set the form input errors
    setError({
      errorKey: error.data.invalidFormItem,
      errorValue: error.data.validationErrorMsg,
    });

    // Notify user of error
    enqueueSnackbar(error.data.validationErrorMsg, {
      variant: "error",
    });

    // Update request attempted, remove loader and enable input fields
    setLoadingFetchResult(false);
  };

  // UseEffect to clear error messages when form changes
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
      <Link to="/" className="absolute left-5 top-2">
        <Logo />
      </Link>

      <p className="pt-10 font-black text-4xl text-white">
        Edit your account details
      </p>

      <form
        className="space-y-4 lg:w-2/5 md:w-1/2 mt-8"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {/* First name */}
        <TextField
          title={"First name"}
          type="first_name"
          value={form.first_name}
          handleChange={handleChange}
          placeholder="Enter your first name"
          error={error.errorKey === "first_name" && error.errorValue}
          disabled={loadingFetchResult}
        />

        {/* Last name */}
        <TextField
          title={"Last name"}
          type="last_name"
          value={form.last_name}
          handleChange={handleChange}
          placeholder="Enter your last name"
          error={error.errorKey === "last_name" && error.errorValue}
          disabled={loadingFetchResult}
        />

        {/* phone number */}
        <TextField
          title={"Phone number"}
          type="phone"
          value={form.phone}
          handleChange={handleChange}
          placeholder="Enter your phone number"
          error={error.errorKey === "phone" && error.errorValue}
          disabled={loadingFetchResult}
        />

        <button
          type="submit"
          disabled={loadingFetchResult}
          className={`w-full h-10 rounded-b-lg text-center text-sm ${
            loadingFetchResult ? "bg-gray-400" : "bg-secondary"
          } text-white font-black grid place-content-center uppercase`}
        >
          {loadingFetchResult ? <Loader fill="white" /> : "SAVE"}
        </button>
      </form>
    </div>
  );
};

export default AccountEdit;
