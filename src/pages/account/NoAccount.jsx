import React from "react";
import { Link } from "react-router-dom";


const NoAccount = () => {
  return (
    <div className="absolute top-20 left-10">
      <p className="font-black text-3xl">You don't have an account yet. </p>

      <p className="font-light text-sm">
        <Link to='/signup' className="text-primary underline">Sign up </Link>
        and unlock the{" "}
        <Link to='/pricing' className="text-primary underline">rich features </Link> of
        Weather Buddy
      </p>
    </div>
  );
};

export default NoAccount;
