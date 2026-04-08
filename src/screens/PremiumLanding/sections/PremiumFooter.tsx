import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";

export const PremiumFooter = (): JSX.Element => {
  return (
    <footer
      id="kontakt"
      className="scroll-mt-28 bg-[#e0eaf5] text-stone-800"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-montserrat text-lg font-semibold text-stone-900">
              Dr. Maria Schmidt
            </p>
            <p className="mt-3 font-lato text-sm leading-relaxed text-stone-600">
              Zahnarztpraxis · evidenzbasierte Diagnostik und Therapieplanung.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:text-white hover:border-emerald-500 hover:bg-emerald-500 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram size={20} className="transition-transform group-hover:scale-110" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-600 hover:text-white hover:border-emerald-500 hover:bg-emerald-500 transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>
          <address className="not-italic">
            <p className="font-montserrat text-sm font-semibold uppercase tracking-wide text-blue-800">
              Adresse
            </p>
            <p className="mt-3 font-lato text-sm leading-relaxed text-stone-600">
              Charlottenring 12
              <br />
              40227 Düsseldorf
            </p>
            <p className="mt-6 font-montserrat text-sm font-semibold uppercase tracking-wide text-blue-800">
              Erreichbarkeit
            </p>
            <p className="mt-3 font-lato text-sm">
              <a
                href="tel:02111593482"
                className="text-stone-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                0211 1593 482
              </a>
            </p>
            <p className="mt-2 font-lato text-sm">
              <a
                href="mailto:Dr.Schmidt@praxis.de"
                className="text-stone-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Dr.Schmidt@praxis.de
              </a>
            </p>
          </address>
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-montserrat text-[10px] font-black uppercase tracking-[0.2em] text-blue-800 mb-6">
                Sprechzeiten
              </p>
              <div className="space-y-3 font-lato text-sm text-stone-600">
                <div className="flex justify-between items-center group">
                  <span className="font-medium group-hover:text-emerald-600 transition-colors">Mo – Fr</span>
                  <span className="text-stone-800 font-bold bg-white px-2 py-0.5 rounded border border-blue-200">08:00 – 17:00</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-stone-500 font-bold uppercase tracking-widest border-t border-blue-200/50 pt-3">
                  <span>Pause</span>
                  <span>12:00 – 13:00</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-blue-200/50">
              <Link
                to="/dashboard"
                className="group flex items-center justify-between w-full bg-white hover:bg-emerald-50 border border-blue-200 hover:border-emerald-200 p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow"
              >
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 group-hover:text-emerald-600">Direktbuchung</p>
                  <p className="text-xs font-montserrat font-bold text-stone-800 tracking-wide">JETZT ONLINE BUCHEN</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-blue-200 group-hover:bg-emerald-500 group-hover:border-emerald-500 flex items-center justify-center transition-all bg-blue-50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-blue-600 group-hover:text-white">
                    <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
              <div className="mt-4 flex items-center gap-3 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                <div className="h-[1px] flex-1 bg-blue-200" />
                <span>Alternativ</span>
                <div className="h-[1px] flex-1 bg-blue-200" />
              </div>
              <a 
                href="tel:02111593482"
                className="mt-3 block text-center font-lato text-xs text-stone-600 hover:text-stone-900 transition-colors"
              >
                Telefonische Vereinbarung: <span className="font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-emerald-500">0211 1593 482</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-blue-200/50 pt-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <p className="font-lato text-sm italic text-stone-600 tracking-wide leading-relaxed max-w-xs">
                „Zahnmedizin auf höchstem Niveau für ein <span className="text-emerald-600 font-bold not-italic">strahlendes Lächeln</span>.“
              </p>
              <div className="flex items-center gap-4">
                <p className="font-lato text-[10px] uppercase tracking-[0.2em] text-blue-600">
                  © {new Date().getFullYear()} Zahnarztpraxis Dr. Maria Schmidt
                </p>
              </div>
            </div>
            <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-8 gap-y-4">
              <Link
                to="/impressum"
                className="font-lato text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-emerald-600 transition-all duration-300 flex items-center gap-2 group"
              >
                <div className="w-1 h-1 rounded-full bg-blue-400 group-hover:bg-emerald-500 transition-colors" />
                Impressum
              </Link>
              <Link
                to="/datenschutz"
                className="font-lato text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-emerald-600 transition-all duration-300 flex items-center gap-2 group"
              >
                <div className="w-1 h-1 rounded-full bg-blue-400 group-hover:bg-emerald-500 transition-colors" />
                Datenschutz
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
