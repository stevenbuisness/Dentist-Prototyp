import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";

export const PremiumFooter = (): JSX.Element => {
  return (
    <footer
      id="kontakt"
      className="scroll-mt-28 bg-[#f8fbfe] text-stone-800 border-t border-stone-200"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-montserrat text-lg font-bold text-stone-900">
              Dr. Maria Schmidt
            </p>
            <p className="mt-4 font-lato text-sm leading-relaxed text-stone-500">
              Zahnarztpraxis · evidenzbasierte Diagnostik und Therapieplanung auf höchstem medizinischem Niveau.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" }
              ].map(({ Icon, label }) => (
                <a 
                  key={label}
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <address className="not-italic">
            <p className="font-montserrat text-[10px] font-black uppercase tracking-[0.2em] text-blue-800">
              Standort
            </p>
            <p className="mt-6 font-lato text-sm leading-relaxed text-stone-600">
              Charlottenring 12
              <br />
              40227 Düsseldorf
            </p>
            <div className="mt-8 space-y-2">
              <p className="font-lato text-sm">
                <a
                  href="tel:02111593482"
                  className="text-stone-800 hover:text-blue-600 transition-colors"
                >
                  0211 1593 482
                </a>
              </p>
              <p className="font-lato text-sm">
                <a
                  href="mailto:Dr.Schmidt@praxis.de"
                  className="text-stone-800 hover:text-blue-600 transition-colors"
                >
                  Dr.Schmidt@praxis.de
                </a>
              </p>
            </div>
          </address>

          <div className="flex flex-col">
            <p className="font-montserrat text-[10px] font-black uppercase tracking-[0.2em] text-blue-800 mb-6">
              Sprechzeiten
            </p>
            <div className="space-y-4 font-lato text-sm text-stone-600">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="font-medium">Mo – Fr</span>
                <span className="text-stone-900 font-bold">08:00 – 17:00</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold uppercase tracking-widest pt-1">
                <span>Pause</span>
                <span>12:00 – 13:00</span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                to="/dashboard"
                className="group flex items-center justify-between w-full bg-stone-900 hover:bg-stone-800 p-5 rounded-2xl transition-all duration-300 shadow-xl shadow-stone-900/10"
              >
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Terminbuchung</p>
                  <p className="text-xs font-montserrat font-bold text-white tracking-wide mt-1">JETZT ONLINE ANFRAGEN</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-blue-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-stone-200 pt-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <p className="font-lato text-sm italic text-stone-500 tracking-wide leading-relaxed max-w-xs">
                „Zahnmedizin auf höchstem Niveau für Ihr <span className="text-blue-600 font-bold not-italic">natürliches Lächeln</span>.“
              </p>
              <p className="font-lato text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                © {new Date().getFullYear()} Zahnarztpraxis Dr. Maria Schmidt
              </p>
              <p className="font-lato text-[9px] font-medium uppercase tracking-[0.1em] text-stone-400 opacity-60">
                Letzte Aktualisierung: 09. April 2026
              </p>
            </div>
            
            <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-10 gap-y-4">
              {[
                { to: "/impressum", label: "Impressum" },
                { to: "/datenschutz", label: "Datenschutz" }
              ].map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-blue-600 transition-all duration-300"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
