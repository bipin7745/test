import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserDetails from "../user/UserDetails.jsx";
import BookList from "../componets/BookList.jsx";
import AdminDashboard  from '../admin/AdminDashboard.jsx'
export default function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/userdetails" element={<UserDetails />} />
        <Route path="/bookdetails" element={<BookList />} />
      </Routes>
    </>
  );
}
