import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // TODO: Replace with skeleton or spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user, loading, isAdmin } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // TODO: Replace with skeleton or spinner
  }

  if (!user || !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
