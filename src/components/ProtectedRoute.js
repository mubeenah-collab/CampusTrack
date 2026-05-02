import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    // User not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  // User is logged in, show the protected page
  return children;
};

export default ProtectedRoute;