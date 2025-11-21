// routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PrivateRoute = ({ element, role }) => {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  if (!userInfo) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && userInfo.role !== role) {
    toast.error("You are not authorized to view this page");
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
