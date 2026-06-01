import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { booting, isAuthenticated } = useAuth();
  const location = useLocation();

  if (booting) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
