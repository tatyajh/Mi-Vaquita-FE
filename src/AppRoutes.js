import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FriendsPage from "./pages/FriendsPage";
import GroupsPage from "./pages/GroupsPage";
import NatillerasPage from './pages/NatillerasPage';
import ActivitiesPage from './pages/ActivitiesPage';
import CommunityActivitiesPage from './pages/CommunityActivitiesPage';
import PrivateActivityPage from './pages/PrivateActivityPage';
import PrivateNatilleraPage from './pages/PrivateNatilleraPage';
import HomePage from './pages/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/home" replace />} />
      <Route path="home" element={<HomePage />} />
      <Route path="friends" element={<FriendsPage />} />
      <Route path="groups" element={<GroupsPage />} />
      <Route path="natilleras" element={<NatillerasPage />} />
      <Route path="natilleras/:id" element={<NatillerasPage />} />
      <Route path="activities" element={<CommunityActivitiesPage />} />
      <Route path="activities/:activityId" element={<CommunityActivitiesPage />} />
      <Route path="actividades/:activityId/privado" element={<PrivateActivityPage />} />
      <Route path="natilleras/:natilleraId/privado" element={<PrivateNatilleraPage />} />
      <Route path="groups/:groupId/activities" element={<ActivitiesPage />} />
      <Route path="groups/:groupId/activities/:activityId" element={<ActivitiesPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
