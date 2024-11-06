import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Providers/Authprovider";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default Home;
