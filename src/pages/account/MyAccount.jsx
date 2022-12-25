import React, { useContext, useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import NoAccount from "pages/account/NoAccount";
import AccountDetails from "pages/account/AccountDetails";
import UserContext from "contexts/UserContext";
import axios from "api/axios";
import { useSnackbar } from "notistack";
import { getAuth, signOut } from "firebase/auth";

const MyAccount = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser } = useContext(UserContext);
  const [navExpanded, setNavExpanded] = useState(false);
  const hasAccount = user?.uid && true;

  // UseEffect to get users weather_buddy details
  useEffect(() => {
    // Get the users details
    const getUserDetails = async () => {
      const USERS_URL = `/users/${user?.uid}`;

      try {
        const response = await axios.get(USERS_URL);

        // Set the users details
        setUser((prev) => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error(error);
        if (error.code) {
          enqueueSnackbar(error.code, { variant: "error" });
        } else {
          enqueueSnackbar("Error getting details, try again later.", {
            variant: "error",
          });
        }
      }
    };

    getUserDetails();

    // eslint-disable-next-line
  }, []);

  const logOutUser = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      enqueueSnackbar("You are now logged out", { variant: "warning" });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  return (
    <div className="h-screen w-full px-10 relative">
      {/* Account nav */}
      <div className="flex flex-col w-max p-1.5 absolute left-5 top-2 rounded-r-full text-white bg-primary gap-2">
        <div
          className="flex justify-center items-center pr-4 w-max"
          onClick={() => setNavExpanded((prev) => !prev)}
        >
          <p className="font-black cursor-pointer text-sm">My Account</p>

          <ArrowDropDownIcon className="text-white cursor-pointer" />
        </div>

        {navExpanded && (
          <div>
            <Link className="w-max font-black text-xs underline" to="/">
              Home
            </Link>

            {user?.uid && (
              <p
                className="text-sm font-bold underline cursor-pointer"
                onClick={logOutUser}
              >
                Logout
              </p>
            )}
          </div>
        )}
      </div>

      {hasAccount ? <AccountDetails /> : <NoAccount />}
    </div>
  );
};

export default MyAccount;
