import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../user/Login";
import Profile from "../user/Profile";
import Register from "../user/Register";
import BookCardList from "../user/Card";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BookCardList />} />
      <Route path="/card" element={<BookCardList />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forget" element={<Profile />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
