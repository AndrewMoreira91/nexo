import { Navigate, Outlet } from "react-router";
import Loader from "../components/Loader";
import { useAuth } from "../context/auth.context";

const ProtectRouteLayout = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.completedOnboarding === false) {
    return <Navigate to="/steps" replace />;
  }

  return <Outlet />;
};

export default ProtectRouteLayout;
