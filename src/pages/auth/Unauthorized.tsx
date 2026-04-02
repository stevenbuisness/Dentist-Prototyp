import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Unauthorized() {
  const { isAdmin, loading } = useAuthContext();
  const [showContent, setShowContent] = useState(false);

  // Give it a tiny delay to prevent flicker if the profile is still settling
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Lade...</div>;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  if (!showContent) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4 font-lato">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-montserrat text-stone-900 uppercase tracking-tight">Zugriff verweigert</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Sie haben keine Berechtigung, diesen Bereich zu betreten. Falls Sie Administrator sind, prüfen Sie bitte Ihre Zugangsdaten.
          </p>
        </div>
        
        <div className="pt-4 border-t border-stone-50 flex flex-col gap-3">
          <Link to="/" className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-md">
            Zurück zur Startseite
          </Link>
          <Link to="/login" className="text-[10px] uppercase font-black tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
            Mit anderem Account anmelden
          </Link>
        </div>
      </div>
    </div>
  );
}
