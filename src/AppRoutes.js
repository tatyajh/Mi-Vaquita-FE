import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExpensesPage from './pages/ExpensesPage';
import FriendsPage from './pages/FriendsPage'; 
import GroupsPage from './pages/GroupsPage'; 

const AppRoutes = () => {
  return (
    <Routes>

        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="groups" element={<GroupsPage />} />
    </Routes>
  );
};

export default AppRoutes;
