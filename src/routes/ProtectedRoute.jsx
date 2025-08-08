import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUserRole, isAuthenticated } from "../lib/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  // Если нет авторизации — на логин
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если роль не подходит — на главную
  const userRole = getCurrentUserRole();
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
