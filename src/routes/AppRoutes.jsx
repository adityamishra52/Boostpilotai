import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminAnalyses from "../pages/admin/AdminAnalyses";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import HistoryPage from "../pages/HistoryPage";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import PricingPage from "../pages/PricingPage";
import Register from "../pages/Register";
import ResultPage from "../pages/ResultPage";
import SettingsPage from "../pages/SettingsPage";
import UploadAnalyze from "../pages/UploadAnalyze";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<DashboardLayout />}>
        <Route path="/analyze" element={<UploadAnalyze />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results/:id" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analyses" element={<AdminAnalyses />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
