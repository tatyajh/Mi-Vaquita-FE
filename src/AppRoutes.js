import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FriendsPage from "./pages/FriendsPage";
import GroupsPage from "./pages/GroupsPage";
import NatillerasPage from './pages/NatillerasPage';
import ActivitiesPage from './pages/ActivitiesPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<GroupsPage />} />
      <Route path="home" element={<Navigate to="/groups" replace />} />
      <Route path="friends" element={<FriendsPage />} />
      <Route path="groups" element={<GroupsPage />} />
      <Route path="natilleras" element={<NatillerasPage />} />
      <Route path="natilleras/:id" element={<NatillerasPage />} />
      <Route path="groups/:groupId/activities" element={<ActivitiesPage />} />
      <Route path="groups/:groupId/activities/:activityId" element={<ActivitiesPage />} />
      <Route path="*" element={<Navigate to="/groups" replace />} />
    </Routes>
  );
};

export default AppRoutes;
