import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { useEffect } from "react";
import axios from "../../API/axios";

// A wrapper for private routes that checks if the user is authenticated
const PrivateRoute = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    // Only add the interceptor when accessing a protected route
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle 401 Unauthorized
          console.error("Unauthorized - Redirecting to login");
          setAuth(false);
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
