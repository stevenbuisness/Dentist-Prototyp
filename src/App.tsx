import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { PremiumLanding } from "./screens/PremiumLanding/PremiumLanding";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Unauthorized from "./pages/auth/Unauthorized";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SessionsPage from "./pages/admin/SessionsPage";
import SessionTypesPage from "./pages/admin/SessionTypesPage";
import BookingsPage from "./pages/admin/BookingsPage";
import ClientsPage from "./pages/admin/ClientsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import { ProtectedRoute, AdminRoute } from "./components/auth/ProtectedRoutes";
import { useAuthContext } from "./contexts/AuthContext";
import { supabase } from "./lib/supabase";
import { useToast } from "./hooks/use-toast";
import { User as UserIcon } from "lucide-react";

function DashboardMockup({ title }: { title: string }) {
  const { user, profile, debugInfo } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };
  
  return (
    <div className="min-h-screen bg-[#faf8f5] font-lato">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-montserrat font-bold text-stone-900 hover:opacity-80 transition-opacity">
            Dr. Schmidt
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 group">
              <UserIcon size={16} /> Profil
            </Link>
            <Link to="/" className="px-4 py-2 bg-white border border-stone-200 text-stone-900 rounded-md text-sm font-semibold hover:bg-stone-50 transition-colors shadow-sm hidden sm:block">
              Zur Startseite
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-stone-900 text-[#faf8f5] text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-montserrat font-bold text-stone-900 mb-6">{title}</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Willkommen, {profile?.first_name || "Patient"}!</h3>
            <p className="text-stone-600 text-sm">Schön, dass Sie wieder da sind.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Ihr Status</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              {profile?.role === "admin" ? "Administrator" : "Patient"}
            </span>
          </div>
        </div>

        <div className="bg-muted p-6 rounded-xl border border-stone-200">
          <h2 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Debug & Systemstatus (Entwickleransicht)
          </h2>
          <div className="space-y-2 text-sm font-mono text-stone-700 bg-white/50 p-4 rounded-lg">
             <p className="flex justify-between"><span className="text-stone-400">Email:</span> {user?.email}</p>
             <p className="flex justify-between"><span className="text-stone-400">User ID:</span> {user?.id}</p>
             <p className="flex justify-between"><span className="text-stone-400">Profile Role:</span> {profile?.role || "FEHLT"}</p>
             <p className="flex justify-between">
               <span className="text-stone-400">Status:</span> 
               <span className={debugInfo?.hasProfile ? "text-green-600" : "text-amber-600"}>
                 {debugInfo?.hasProfile ? "Profil gefunden" : "Profil fehlt (Sync-Problem!)"}
               </span>
             </p>
             {debugInfo?.error && (
               <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-red-600">
                 <p className="font-bold uppercase text-[10px] tracking-wider mb-1">Fehlermeldung:</p>
                 {debugInfo.error}
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminDashboardRedirect() {
  const { profile, loading } = useAuthContext();
  
  if (loading) return <div className="p-8">Lade Dashboard...</div>;
  if (profile?.role === "admin") return <AdminDashboard />;
  
  return <DashboardMockup title="Patienten Dashboard" />;
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
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
