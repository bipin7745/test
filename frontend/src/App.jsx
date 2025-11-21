import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage } from "./redux/userSlice";

import UserNavbar from "./user/UserNavbar.jsx";
import AdminNavbar from "./admin/AdminNavbar.jsx";
import LoginForm from "./user/Login.jsx";
import Register from "./user/Register.jsx";
import Profile from "./user/Profile.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import BookCardList from "./user/Card.jsx";
import BookDetails from "./componets/BookDetails.jsx";
import ForgetPassword from "./user/ForgetPassword.jsx";
import UserList from "./user/UserDetails.jsx";
import BookList from "./componets/BookList.jsx";

export default function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      {/* Dynamic Navbar */}
      {userInfo?.role === "admin" ? <AdminNavbar /> : <UserNavbar />}

      <Routes>
        <Route path="/" element={<BookCardList />} />
        <Route path="/book" element={<BookCardList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<LoginForm />} />
         <Route
          path="/admindashboard"
          element={userInfo?.role === "admin" ? <AdminDashboard /> : <LoginForm />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

        {/* Admin Routes */}
       
        <Route
          path="/userdetails"
          element={userInfo?.role === "admin" ? <UserList /> : <LoginForm />}
        />
        <Route
          path="/bookdetails"
          element={userInfo?.role === "admin" ? <BookList /> : <LoginForm />}
        />

        {/* User Routes */}
        <Route
          path="/profile/:id"
          element={userInfo?.role === "user" ? <Profile /> : <LoginForm />}
        />
      </Routes>
    </>
  );
}
