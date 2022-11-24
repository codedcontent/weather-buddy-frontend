import { axiosPrivate } from "api/axios";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      async (config) => {
        const currentDate = new Date();
        const decodedToken = jwtDecode(auth?.accessToken);

        // Check if accessToken is expired
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            // Get new tokens
          const data = await refresh();

          // Update the request config headers
          config.headers["Authorization"] = `Bearer ${data.accessToken}`;
        } else {
          // Set the request config headers
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
    };
  }, [auth?.accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
