import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from "./components/common/Header";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </Router>
  );
};

const PrivateRoutes = () => {
  return (
    <>
      <Header />
      <AppRoutes />
    </>
  );
};

export default App;
