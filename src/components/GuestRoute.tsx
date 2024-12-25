// React built-in
import { FC, ReactNode } from "react";

// Components
import Loading from "./LoadingScreen";

// Helper & misc
import { useAuth } from "../store/authContext";

// 3rd party
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute: FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default GuestRoute;
