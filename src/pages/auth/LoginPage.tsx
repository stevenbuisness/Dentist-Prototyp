import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Anmeldedaten sind nicht korrekt");
      setLoading(false);
      return;
    }

    // Fetch role directly after login to decide where to redirect
    const userId = authData.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (profile?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4 font-lato">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-stone-200 animate-in fade-in zoom-in duration-500 relative">
        <Link 
          to="/" 
          className="absolute top-8 left-8 p-2 text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
          title="Zurück zur Startseite"
        >
          <ArrowLeft size={20} />
        </Link>
        
        <div className="text-center pt-4">
          <h2 className="text-3xl font-bold font-montserrat tracking-tight text-foreground">
            Anmelden
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-lato">
            Willkommen zurück in Ihrer Zahnarztpraxis
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-foreground font-lato mb-1">
                E-Mail-Adresse
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background transition-all"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground font-lato mb-1">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {loginError && (
            <p className="text-red-500 text-sm font-bold text-center">
              {loginError}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Wird geladen..." : "Jetzt anmelden"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground font-lato">
            Noch kein Konto?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline transition-all">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
