import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../Redux/hook";

type ProtectedRouteProps = {
  allowedRoles?: ("Admin" | "Employee" | "Customer")[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;