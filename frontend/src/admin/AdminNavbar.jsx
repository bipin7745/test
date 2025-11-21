import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login"); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
      <Link className="navbar-brand fw-bold" >
        Admin Panel
      </Link>
      <div className="ms-auto">
        <Link className="btn btn-outline-light me-3" to="/userdetails">
          User Details
        </Link>
        <Link className="btn btn-outline-light me-3" to="/bookdetails">
          Book Details
        </Link>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
