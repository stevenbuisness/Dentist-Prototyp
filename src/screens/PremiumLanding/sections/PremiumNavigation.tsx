import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useToast } from "../../../hooks/use-toast";
import { motion } from "framer-motion";

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
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    // If we're not on the landing page, we need to go there first
    // window.location.href is the most reliable way to force a page change with anchor jump in this setup
    if (location.pathname !== "/") {
      e.preventDefault();
      window.location.href = "/" + target;
    }
    // If we are on /, the default <a> behavior handles the same-page jump
  };

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-100/50 bg-white/95 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-6 px-4 sm:px-10 py-4 sm:py-5"
        aria-label="Hauptnavigation"
      >
        <Link
          to="/"
          className="flex items-center gap-3 font-montserrat text-stone-900 group"
        >
          <img 
            src="/logo.png" 
            alt="Dr. Schmidt Logo" 
            className="w-10 h-10 sm:w-[4.5rem] sm:h-[4.5rem] object-contain flex-shrink-0 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col items-start justify-center">
            <span className="text-base sm:text-xl font-bold leading-none tracking-tight text-blue-950">Dr. Schmidt</span>
            <span className="text-[10px] sm:text-xs font-semibold italic text-blue-600/80 leading-none mt-1 ml-[1.5px]">Ihr Lächeln in besten Händen</span>
          </div>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <li key={item.href} className="group relative">
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-lato text-sm font-semibold tracking-wide text-stone-600 transition-colors hover:text-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {item.label}
              </a>
              {/* Underline Bloom */}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {!user ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="font-lato hidden text-sm font-semibold text-stone-600 sm:inline-flex items-center rounded-full border border-blue-100 bg-white/50 px-5 py-2 transition-all hover:bg-blue-50/50 backdrop-blur-sm"
              >
                Anmelden
              </Link>
            </motion.div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                  className="font-lato inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/50 px-4 py-2 text-xs font-bold text-stone-700 transition-all hover:bg-white hover:shadow-sm"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Mein Bereich
                </Link>
              </motion.div>
              <button
                onClick={handleLogout}
                className="font-lato text-[10px] font-medium text-stone-400 hover:text-red-600 px-2 py-1 transition-all"
              >
                Abmelden
              </button>
            </div>
          )}

          <div className="hidden lg:block h-6 w-[1px] bg-blue-100/60" />

          <a
            href="tel:02111593482"
            className="font-lato hidden text-[11px] font-bold text-blue-950/60 hover:text-blue-600 transition-colors lg:inline"
          >
            0211 1593 482
          </a>

          <motion.div 
            whileHover={{ scale: 1.03, y: -1 }} 
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden rounded-full shadow-lg shadow-blue-200/50"
          >
            <Link
              to="/dashboard"
              className="group relative flex items-center gap-2 bg-blue-600 px-4 py-2.5 sm:px-6 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-blue-700"
            >
              <span className="relative z-10">Termin buchen</span>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
            </Link>
          </motion.div>

          <button
            type="button"
            className="inline-flex p-2 md:hidden text-stone-600"
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
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-blue-100 bg-white/95 backdrop-blur-md px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-lato block py-1 text-stone-800"
                  onClick={(e) => { handleNavClick(e, item.href); setOpen(false); }}
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
                href="tel:02111593482"
                className="font-lato block py-1 text-stone-700"
                onClick={() => setOpen(false)}
              >
                0211 1593 482
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
};
