import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const Home: React.FC = () => {
  const { auth } = useAuth();

  return auth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default Home;
