import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from "./components/common/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import InvitationPage from "./pages/InvitationPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import LandingPage from "./pages/LandingPage";
import PrivateActivityPage from "./pages/PrivateActivityPage";
import PrivateNatilleraPage from "./pages/PrivateNatilleraPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/invitacion" element={<InvitationPage />} />
        {/* Públicas a propósito: un invitado sin cuenta llega acá con
            solo su token de invitado (ver guestAccessToken en
            InvitationPage/CommunityService), nunca con el 'token' de
            sesión que exige PrivateRoutes más abajo. */}
        <Route path="/actividades/:activityId/privado" element={<PrivateActivityPage />} />
        <Route path="/natilleras/:natilleraId/privado" element={<PrivateNatilleraPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </Router>
  );
};

const PrivateRoutes = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Header />
      <AppRoutes />
    </>
  );
};

export default App;
