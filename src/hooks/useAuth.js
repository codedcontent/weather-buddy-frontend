// import AuthContext from "contexts/AuthProvider";
import UserContext from "contexts/UserContext";
import { useContext } from "react";

const useAuth = () => {
  return useContext(UserContext);
};

export default useAuth;
