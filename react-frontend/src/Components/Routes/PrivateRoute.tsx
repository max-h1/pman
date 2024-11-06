import React, { useContext } from "react";
import { Navigate, Route, Outlet, OutletProps } from "react-router-dom";
import { useAuth } from "../Providers/Authprovider";
import Login from "./Login";

// A wrapper for private routes that checks if the user is authenticated
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
