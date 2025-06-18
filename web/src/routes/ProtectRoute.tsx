import { Navigate, Outlet } from "react-router";
import Loader from "../components/Loader";
import { useAuth } from "../context/auth.context";

const ProtectRouteLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.completedOnboarding === false) {
    return <Navigate to="/steps" replace />;
  }

  return <Outlet />;
};

export default ProtectRouteLayout;
