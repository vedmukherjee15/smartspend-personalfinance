
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

const Index = () => {
  const { isAuthenticated } = useAppContext();

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" />;
};

export default Index;
