import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      toast({
        title: "Fehler bei der Registrierung",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte überprüfen Sie Ihre E-Mails zur Bestätigung (falls aktiviert).",
      });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-border animate-in slide-in-from-bottom duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-montserrat tracking-tight text-foreground">
            Konto erstellen
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-lato">
            Werden Sie Teil unserer Patientengemeinschaft
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground font-lato mb-1">Vorname</label>
                <input
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background"
                  placeholder="Max"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground font-lato mb-1">Nachname</label>
                <input
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background"
                  placeholder="Mustermann"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground font-lato mb-1">E-Mail-Adresse</label>
              <input
                type="email"
                required
                className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background"
                placeholder="max@mustermann.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground font-lato mb-1">Passwort</label>
              <input
                type="password"
                required
                minLength={6}
                className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 text-sm font-bold rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Wird erstellt..." : "Konto erstellen"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 text-sm text-muted-foreground font-lato">
          Bereits ein Konto?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Anmelden
          </Link>
        </div>
      </div>
    </div>
  );
}
