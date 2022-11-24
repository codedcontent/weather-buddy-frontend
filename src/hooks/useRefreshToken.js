import axios from "api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post(
        "/auth/refresh-token",
        { refreshToken: auth?.refreshToken },
        {
          withCredentials: true,
        }
      );

      // Set the new access token
      setAuth((prev) => {
        return {
          ...prev,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
      });

      // return the new access & refresh tokens
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
