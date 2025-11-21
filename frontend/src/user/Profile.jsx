import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../redux/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, profile, loading } = useSelector((state) => state.user);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        let user = userInfo;

        if (!user) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            user = JSON.parse(storedUser);
          } else {
            navigate("/login");
            return;
          }
        }
        dispatch(fetchUserProfile(user.id));
        setCheckingAuth(false);
      } catch (err) {
        console.error("❌ Profile load failed:", err);
        setCheckingAuth(false);
      }
    };
    loadProfileData();
  }, [dispatch, navigate, userInfo]);

  if (checkingAuth || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container text-center mt-5">
        <h4>No profile data found</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5 d-flex justify-content-center py-5">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4 text-primary">User Profile</h3>

        <div className="mb-3">
          <strong>Username:</strong>
          <p className="form-control bg-light">{profile.username}</p>
        </div>

        <div className="mb-3">
          <strong>Email:</strong>
          <p className="form-control bg-light">{profile.email}</p>
        </div>

        <div className="mb-3">
          <strong>Role:</strong>
          <p className="form-control bg-light">{profile.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
