import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Authentifizierung...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user, loading, isAdmin } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Prüfe Berechtigung...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
