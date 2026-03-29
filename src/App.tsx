import { Route, Routes } from "react-router-dom";
import { DentalHomepage } from "./screens/DentalHomepage";
import { PremiumLanding } from "./screens/PremiumLanding";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Unauthorized from "./pages/auth/Unauthorized";
import { ProtectedRoute, AdminRoute } from "./components/auth/ProtectedRoutes";
import { supabase } from "./lib/supabase";

export const App = (): JSX.Element => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PremiumLanding />} />
      <Route path="/old" element={<DentalHomepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Patient Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={
          <div className="p-8 font-montserrat">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Patient Dashboard Mockup</h1>
              <button 
                onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
                className="text-sm text-stone-500 hover:text-destructive underline"
              >
                Abmelden
              </button>
            </div>
            <p className="font-lato mt-4 text-muted-foreground">Willkommen in Ihrem persönlichen Bereich.</p>
          </div>
        } />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={
          <div className="p-8 font-montserrat font-bold text-primary">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl">Admin Dashboard Mockup</h1>
              <button 
                onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
                className="text-sm text-stone-500 hover:text-destructive underline font-normal"
              >
                Abmelden
              </button>
            </div>
            <p className="font-lato mt-4 text-muted-foreground">Willkommen im Verwaltungsbereich.</p>
          </div>
        } />
      </Route>
    </Routes>
  );
};
