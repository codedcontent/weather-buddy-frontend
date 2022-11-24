// validate form
const validateForm = (form, setError) => {
  const hideOrShowError = (inputType, value) => {
    setError((prev) => ({ ...prev, [inputType]: value }));
  };

  // Validate firstName
  if (form?.firstName?.length === 0) {
    hideOrShowError("firstName", "First name too short");
    return;
  } else {
    hideOrShowError("firstName", "");
  }

  // Validate lastName
  if (form?.lastName?.length === 0) {
    hideOrShowError("lastName", "Last name too short");
    return;
  } else {
    hideOrShowError("lastName", "");
  }

  // Validate email
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;

  if (!emailRegex.test(form?.email)) {
    hideOrShowError("email", "Email is not valid");
    return;
  } else {
    hideOrShowError("email", "");
  }

  if (form?.phoneNumber?.length === 0) {
    hideOrShowError("phoneNumber", "This is not valid");
    return;
  } else {
    hideOrShowError("phoneNumber", "");
  }

  if (form?.password?.length < 6) {
    hideOrShowError("password", "Password must be at least 6 characters");
    return;
  } else {
    hideOrShowError("password", "");
  }
};

export default validateForm;
