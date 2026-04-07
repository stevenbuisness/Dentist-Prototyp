import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useToast } from "../../../hooks/use-toast";

const navItems = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#team", label: "Team" },
  { href: "#standards", label: "Qualität" },
  { href: "#kontakt", label: "Kontakt" },
] as const;

export const PremiumNavigation = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-[#faf8f5]/95 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4"
        aria-label="Hauptnavigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-montserrat text-base sm:text-lg font-bold tracking-tight text-stone-900 group"
        >
          <img 
            src="/logo.png" 
            alt="Dr. Schmidt Logo" 
            className="w-12 h-12 sm:w-[4.5rem] sm:h-[4.5rem] object-contain flex-shrink-0 mix-blend-multiply transition-transform group-hover:scale-105"
          />
          <span className="leading-tight">
            Dr. Schmidt<span className="hidden sm:inline"> · Zahnmedizin</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-lato text-sm text-stone-700 transition-colors hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {!user ? (
            <Link
              to="/login"
              className="font-lato hidden text-sm font-semibold text-stone-700 hover:text-stone-900 sm:inline px-3 py-1 border border-stone-300 rounded-md transition-all"
            >
              Anmelden
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                className="font-lato text-[11px] font-bold text-stone-700 hover:text-stone-900 px-3 py-1.5 border border-stone-200 rounded-lg transition-all hover:bg-stone-50 whitespace-nowrap"
              >
                Mein Bereich
              </Link>
              <button
                onClick={handleLogout}
                className="font-lato text-[10px] font-medium text-stone-500 hover:text-red-600 px-2 py-1 transition-all whitespace-nowrap"
              >
                Abmelden
              </button>
            </div>
          )}
          <a
            href="tel:03012345678"
            className="font-lato hidden text-[11px] font-bold text-stone-400 underline-offset-4 hover:underline lg:inline whitespace-nowrap"
          >
            030 1234 5678
          </a>
          <Link
            to="/dashboard"
            className="font-montserrat inline-flex items-center rounded-sm bg-stone-900 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#faf8f5] transition-all hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800 whitespace-nowrap"
          >
            Termin buchen
          </Link>
          <button
            type="button"
            className="inline-flex p-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menü</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-stone-200/80 bg-[#faf8f5] px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-lato block py-1 text-stone-800"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to={user ? (profile?.role === "admin" ? "/admin" : "/dashboard") : "/login"}
                className="font-lato block py-1 text-primary font-bold"
                onClick={() => setOpen(false)}
              >
                {user ? "Mein Bereich" : "Anmelden"}
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="font-lato block py-1 text-stone-800 font-bold"
                    onClick={() => setOpen(false)}
                  >
                    Profil
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="font-lato block py-1 text-destructive font-bold"
                  >
                    Abmelden
                  </button>
                </li>
              </>
            )}
            <li>
              <a
                href="tel:03012345678"
                className="font-lato block py-1 text-stone-700"
                onClick={() => setOpen(false)}
              >
                030 1234 5678
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
};
