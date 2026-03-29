import { Routes, Route, Navigate } from "react-router-dom";
import { PremiumLanding } from "./screens/PremiumLanding/PremiumLanding";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Unauthorized from "./pages/auth/Unauthorized";
import { ProtectedRoute, AdminRoute } from "./components/auth/ProtectedRoutes";
import { useAuthContext } from "./contexts/AuthContext";

function DashboardMockup({ title }: { title: string }) {
  const { user, profile, debugInfo } = useAuthContext();
  
  return (
    <div className="p-8 font-lato">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="bg-muted p-4 rounded-lg">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <div className="space-y-1 text-sm font-mono">
           <p>Email: {user?.email}</p>
           <p>User ID: {user?.id}</p>
           <p>Profile Role: {profile?.role || "FEHLT"}</p>
           <p>Status: {debugInfo?.hasProfile ? "Profil gefunden" : "Profil fehlt (Sync-Problem!)"}</p>
           {debugInfo?.error && <p className="text-red-500 font-bold">Error: {debugInfo.error}</p>}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardRedirect() {
  const { profile, loading } = useAuthContext();
  
  if (loading) return <div className="p-8">Lade Dashboard...</div>;
  if (profile?.role === "admin") return <Navigate to="/admin" replace />;
  
  return <DashboardMockup title="Patient Dashboard Mockup" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PremiumLanding />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Patient Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminDashboardRedirect />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<DashboardMockup title="Admin Dashboard Mockup" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
