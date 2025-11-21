// user/UserNavbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";

const UserNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
      <div className="container">

        <Link className="navbar-brand fw-bold text-primary" to="/">
          Book Store
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item me-3 ">
              <Link className="nav-link text-primary" to="/">Home</Link>
            </li>

            <li className="nav-item me-3">
              <Link className="nav-link text-primary" to="/book">Books</Link>
            </li>

            {userInfo ? (
              <>
                <li className="nav-item me-3">
                  <Link
                    className="btn btn-outline-primary d-flex align-items-center"
                    to={`/profile/${userInfo.id}`}
                  >
                    <CgProfile size={20} className="me-1" /> Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-danger d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <TbLogout2 size={20} className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <Link className="btn btn-outline-primary" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="btn btn-outline-primary" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
