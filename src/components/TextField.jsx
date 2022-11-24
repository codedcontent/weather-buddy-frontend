import React, { useState, useEffect } from "react";

const TextField = ({
  placeholder,
  value,
  handleChange,
  title,
  type,
  error,
  disabled,
  inputId,
  handleClick,
}) => {
  const [inputActive, setInputActive] = useState(false);

  const focusedStyle = `${
    inputActive
      ? "outline outline-offset-2 outline-4"
      : "outline-none outline-0 outline-offset-0"
  }`;

  const errorStyle = `${
    error ? "outline-red-500 border-2 border-red-400" : "outline-secondary"
  }`;

  // UseEffect to run when a textfield is rendered
  useEffect(() => {
    setInputActive(false);
  }, []);

  return (
    <div
      onClick={() => {
        handleClick();
      }}
    >
      <div
        className={`px-3 py-3.5 flex gap-3 justify-center items-center bg-white rounded-lg w-full ${focusedStyle} ${errorStyle}`}
      >
        {/* Input label */}
        <p className="w-max font-extralight text-sm capitalize">{`${title}:`}</p>

        {/* Input Text field */}
        <input
          type="text"
          value={value}
          onFocus={() => {
            setInputActive(true);
          }}
          onBlur={() => {
            setInputActive(false);
          }}
          onFocusCapture={() => {
            setInputActive(false);
          }}
          onChange={(e) => {
            handleChange(type, e.target.value, inputId);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="bg-transparent text-primary placeholder:text-xs text-sm placeholder:text-gray-300  font-semibold outline-none flex-1 w-full"
        />
      </div>
      {/* Input error */}
      <p className="font-black mt-1.5 text-red-500 text-sm ">{error}</p>
    </div>
  );
};

export default TextField;
