import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const tokenData = {
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  };
  const refresh = async () => {
    const response = await axios.post(
      "/api/Authenticate/refresh",
      JSON.stringify(tokenData),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return {
        ...prev,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
