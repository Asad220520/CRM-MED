import { Navigate } from "react-router-dom";
import { getCurrentUserRole } from "../lib/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const userRole = getCurrentUserRole();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
