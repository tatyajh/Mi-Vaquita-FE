import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExpensesPage from "./pages/ExpensesPage";
import FriendsPage from "./pages/FriendsPage";
import GroupsPage from "./pages/GroupsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route index element={<HomePage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="expenses" element={<ExpensesPage />} />
      <Route path="friends" element={<FriendsPage />} />
      <Route path="groups" element={<GroupsPage />} />
    </Routes>
  );
};

export default AppRoutes;
