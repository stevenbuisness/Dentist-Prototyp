import { useEffect } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { PremiumLanding } from "./screens/PremiumLanding/PremiumLanding";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Unauthorized from "./pages/auth/Unauthorized";
import ProfilePage from "./pages/dashboard/ProfilePage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SessionsPage from "./pages/admin/SessionsPage";
import SessionTypesPage from "./pages/admin/SessionTypesPage";
import BookingsPage from "./pages/admin/BookingsPage";
import ClientsPage from "./pages/admin/ClientsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import CalendarPage from "./pages/admin/CalendarPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ImpressumPage from "./pages/ImpressumPage";
import { ProtectedRoute, AdminRoute } from "./components/auth/ProtectedRoutes";
import { useAuthContext } from "./contexts/AuthContext";
import { NetworkOfflineBanner } from "./components/ui/NetworkOfflineBanner";
import { CookieBanner } from "./components/ui/CookieBanner";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the actual path changes (e.g., from / to /impressum)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AdminDashboardRedirect() {
  const { profile, loading } = useAuthContext();
  
  if (loading) return <div className="p-8">Lade Dashboard...</div>;
  if (profile?.role === "admin") return <AdminDashboard />;
  
  return <DashboardPage />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <NetworkOfflineBanner />
      <CookieBanner />
      <Routes>
      <Route path="/" element={<PremiumLanding />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/datenschutz" element={<PrivacyPage />} />
      <Route path="/impressum" element={<ImpressumPage />} />
      
      {/* Patient Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminDashboardRedirect />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sessions" element={<SessionsPage />} />
        <Route path="/admin/session-types" element={<SessionTypesPage />} />
        <Route path="/admin/bookings" element={<BookingsPage />} />
        <Route path="/admin/clients" element={<ClientsPage />} />
        <Route path="/admin/calendar" element={<CalendarPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
