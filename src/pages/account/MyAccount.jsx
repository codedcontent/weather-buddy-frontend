import React, { useContext, useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import NoAccount from "pages/account/NoAccount";
import AccountDetails from "pages/account/AccountDetails";
import UserContext from "contexts/UserContext";
import axios from "api/axios";

const MyAccount = () => {
  const { user, setUser } = useContext(UserContext);

  const [navExpanded, setNavExpanded] = useState(false);
  const hasAccount = user?.user_id && true;

  // UseEffect to run once the app loads up
  useEffect(() => {
    // Get the users details
    const USERS_URL = `/users/${user?.user_id}`;

    let isMounted = true;
    const controller = new AbortController();

    const getUserDetails = async () => {
      try {
        const response = await axios.get(USERS_URL, {
          signal: controller.signal,
        });

        // Set the users details
        isMounted && setUser(response.data?.user);
      } catch (error) {
        console.log(error);
      }
    };

    !user.user_id && getUserDetails();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [setUser, user.user_id]);

  return (
    <div className="h-screen w-full px-10 relative">
      {/* Account nav */}
      <div className="flex flex-col w-max p-1.5 absolute left-5 top-2 rounded-r-full text-white bg-primary gap-2">
        <div
          className="flex justify-center items-center pr-4 w-max"
          onClick={() => setNavExpanded((prev) => !navExpanded)}
        >
          <p className="font-black text-sm">My Account</p>

          <ArrowDropDownIcon className="text-white cursor-pointer" />
        </div>

        {navExpanded && (
          <>
            <Link className="w-max font-black text-xs underline" to="/">
              Home
            </Link>
          </>
        )}
      </div>

      {hasAccount ? <AccountDetails /> : <NoAccount />}
    </div>
  );
};

export default MyAccount;
