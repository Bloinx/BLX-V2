import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";

function ProtectedRoute({ element }) {
  const { session, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here if needed
    return <Loader></Loader>;
  }

  return session ? element : <Navigate to="/login" />;
}

export default ProtectedRoute;
