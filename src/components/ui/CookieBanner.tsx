import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, ShieldCheck, Lock } from "lucide-react";
import { Button } from "./button";
import { Link, useLocation } from "react-router-dom";

const CONSENT_KEY = "cookie_consent_v1";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analysisConsent, setAnalysisConsent] = useState(false);
  const location = useLocation();

  // Check consent status on mount and on every location change
  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // If no consent, show the banner
      setIsVisible(true);
    } else {
      // If consent exists, hide it immediately
      setIsVisible(false);
    }
  }, [location.pathname]); // Re-run whenever the user navigates

  const handleConsent = (type: "all" | "necessary" | "custom") => {
    let status = "necessary";
    if (type === "all") status = "granted";
    if (type === "custom" && analysisConsent) status = "granted";
    
    localStorage.setItem(CONSENT_KEY, status);
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
          <div className="bg-white/95 backdrop-blur-2xl border border-stone-200/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-8 overflow-hidden relative group text-left">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-stone-900/20">
                  <Cookie size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-montserrat font-black text-stone-900 uppercase tracking-tight leading-none">
                    {showSettings ? "Einstellungen" : "Cookie-Zustimmung"}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                     <ShieldCheck size={12} className="text-emerald-500" />
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">DSGVO-Konformität aktiv</span>
                  </div>
                </div>
              </div>

              {!showSettings ? (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-stone-600 font-bold leading-tight">
                      Wir nutzen Cookies, um Ihnen den bestmöglichen Service bei der Terminbuchung zu bieten:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2.5 text-[11px] text-stone-500 font-medium bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span>Notwendig (Patienten-Login & Buchung)</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-[11px] text-stone-500 font-medium p-2 bg-stone-50/50 rounded-xl border border-stone-200/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 shrink-0" />
                        <span>Präferenzen & Reichweite</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => handleConsent("all")}
                      className="w-full h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-[0.98]"
                    >
                       Alle Akzeptieren ✨
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
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="h-12 w-12 p-0 border border-stone-200/50 rounded-2xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-all active:rotate-45"
                      >
                         <Settings size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Passen Sie hier Ihre Privatsphäre-Einstellungen an:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200/50">
                       <div className="flex items-center gap-2">
                          <Lock size={12} className="text-stone-400" />
                          <span className="text-[11px] font-black uppercase text-stone-700">Notwendig</span>
                       </div>
                       <div className="w-10 h-5 bg-emerald-500/20 rounded-full relative opacity-50">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-500 rounded-full" />
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => setAnalysisConsent(!analysisConsent)}
                      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200/50 hover:border-emerald-200 transition-all group/toggle"
                    >
                       <span className="text-[11px] font-black uppercase text-stone-500 group-hover/toggle:text-stone-800">Analyse (Opt-In)</span>
                       <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${analysisConsent ? 'bg-emerald-500' : 'bg-stone-200'}`}>
                          <motion.div 
                            animate={{ x: analysisConsent ? 20 : 0 }}
                            className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
                          />
                       </div>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => handleConsent("custom")}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    >
                      Auswahl speichern
                    </Button>
                    <Button 
                      onClick={() => setShowSettings(false)}
                      variant="ghost"
                      className="w-full text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900"
                    >
                      ← Abbrechen
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center pt-4 border-t border-stone-100 mt-2">
                 <Link 
                    to="/datenschutz" 
                    className="text-[10px] font-black text-stone-300 hover:text-emerald-600 uppercase tracking-[0.2em] transition-colors"
                 >
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
