import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FriendsPage from "./pages/FriendsPage";
import GroupsPage from "./pages/GroupsPage";
import NatillerasPage from './pages/NatillerasPage';
import CommunityActivitiesPage from './pages/CommunityActivitiesPage';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import CalendarPage from './pages/CalendarPage';
import MyLoansPage from './pages/MyLoansPage';
import NotFoundPage from './pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/home" replace />} />
      <Route path="home" element={<HomePage />} />
      <Route path="precios" element={<PricingPage />} />
      <Route path="calendario" element={<CalendarPage />} />
      <Route path="mis-prestamos" element={<MyLoansPage />} />
      <Route path="friends" element={<FriendsPage />} />
      <Route path="groups" element={<GroupsPage />} />
      <Route path="natilleras" element={<NatillerasPage />} />
      <Route path="natilleras/:id" element={<NatillerasPage />} />
      <Route path="activities" element={<CommunityActivitiesPage />} />
      <Route path="activities/:activityId" element={<CommunityActivitiesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
