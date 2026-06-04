import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminAnalyses from "../pages/admin/AdminAnalyses";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminFeatures from "../pages/admin/AdminFeatures";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminSupport from "../pages/admin/AdminSupport";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import ContentLibrary from "../pages/ContentLibrary";
import ContactPage from "../pages/ContactPage";
import GrowthCoach from "../pages/GrowthCoach";
import FeedbackPage from "../pages/FeedbackPage";
import FeaturesPage from "../pages/FeaturesPage";
import HelpCenter from "../pages/HelpCenter";
import HistoryPage from "../pages/HistoryPage";
import HowItWorks from "../pages/HowItWorks";
import LandingPage from "../pages/LandingPage";
import LegalPage from "../pages/LegalPage";
import Login from "../pages/Login";
import PricingPage from "../pages/PricingPage";
import Register from "../pages/Register";
import ResultPage from "../pages/ResultPage";
import SettingsPage from "../pages/SettingsPage";
import SupportPage from "../pages/SupportPage";
import TrendFinder from "../pages/TrendFinder";
import UploadAnalyze from "../pages/UploadAnalyze";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<DashboardLayout />}>
        <Route path="/analyze" element={<UploadAnalyze />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/support" element={<SupportPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results/:id" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/trends" element={<TrendFinder />} />
          <Route path="/coach" element={<GrowthCoach />} />
          <Route path="/library" element={<ContentLibrary />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analyses" element={<AdminAnalyses />} />
          <Route path="/admin/features" element={<AdminFeatures />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
