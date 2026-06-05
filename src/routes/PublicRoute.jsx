import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { resetPageScroll } from "../utils/scrollReset";

const PublicRoute = () => {
  const { booting, isAuthenticated } = useAuth();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  if (booting) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    resetPageScroll();
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
