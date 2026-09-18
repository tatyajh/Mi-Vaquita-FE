import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FriendsPage from "./pages/FriendsPage";
import GroupsPage from "./pages/GroupsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<GroupsPage />} />
      <Route path="home" element={<Navigate to="/groups" replace />} />
      <Route path="friends" element={<FriendsPage />} />
      <Route path="groups" element={<GroupsPage />} />
      <Route path="*" element={<Navigate to="/groups" replace />} />
    </Routes>
  );
};

export default AppRoutes;
