import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck, Settings } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";


const CONSENT_KEY = "cookie_consent_v1";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show with a slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: "all" | "necessary") => {
    localStorage.setItem(CONSENT_KEY, type === "all" ? "granted" : "necessary");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-10 md:right-auto md:max-w-md z-[100]"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/50 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden relative group">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-stone-900/20">
                    <Cookie size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-montserrat font-black text-stone-900 uppercase tracking-tight leading-none">Cookie-Einstellungen</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                       <ShieldCheck size={12} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">DSGVO Konform</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-900"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-stone-600 font-bold leading-tight">
                  Für Ihr optimales Erlebnis in unserer digitalen Praxis nutzen wir Cookies:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2.5 text-[11px] text-stone-500 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Essenzielle Funktionen (Login & Terminbuchung)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[11px] text-stone-500 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                    <span>Optimierung Ihres Nutzungserlebnisses</span>
                  </li>
                </ul>
              </div>


              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => handleConsent("all")}
                  className="w-full h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-[0.98] group/btn"
                >
                   Alle Akzeptieren
                   <motion.span 
                    className="ml-2 inline-block"
                    animate={{ x: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                   >
                     ✨
                   </motion.span>
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleConsent("necessary")}
                    variant="outline"
                    className="flex-1 h-12 border-stone-200 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 text-[11px] uppercase tracking-wider"
                  >
                     Nur Notwendige
                  </Button>
                  <Button 
                    variant="ghost"
                    className="h-12 w-12 p-0 border border-transparent rounded-2xl text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                  >
                     <Settings size={18} />
                  </Button>
                </div>
              </div>

              <div className="text-center">
                 <Link to="/datenschutz" className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">
                    Datenschutzbestimmungen einsehen
                 </Link>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
