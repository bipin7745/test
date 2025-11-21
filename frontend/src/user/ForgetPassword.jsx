import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate,Link } from "react-router-dom";
import backend_url from "../api_url";

export default function Forget() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/users/forget-password`, {
        username,
        password,
      });
      toast.success(response.data.message || "Password changed successfully!");
      navigate("/login");
    } catch (error) {

      toast.error(error.response?.data?.message || "Error Forget password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4 text-primary">Forget Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none text-primary">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
