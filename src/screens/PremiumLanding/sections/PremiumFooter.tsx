import { Link } from "react-router-dom";

export const PremiumFooter = (): JSX.Element => {
  return (
    <footer
      id="kontakt"
      className="bg-stone-900 text-[#f5f2eb]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-montserrat text-lg font-semibold text-white">
              Dr. Maria Schmidt
            </p>
            <p className="mt-3 font-lato text-sm leading-relaxed text-stone-300">
              Zahnarztpraxis · evidenzbasierte Diagnostik und Therapieplanung.
            </p>
          </div>
          <address className="not-italic">
            <p className="font-montserrat text-sm font-semibold uppercase tracking-wide text-stone-400">
              Adresse
            </p>
            <p className="mt-3 font-lato text-sm leading-relaxed text-stone-300">
              Charlottenring 12
              <br />
              40227 Düsseldorf
            </p>
            <p className="mt-6 font-montserrat text-sm font-semibold uppercase tracking-wide text-stone-400">
              Erreichbarkeit
            </p>
            <p className="mt-3 font-lato text-sm">
              <a
                href="tel:02111593482"
                className="text-stone-200 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                0211 1593 482
              </a>
            </p>
            <p className="mt-2 font-lato text-sm">
              <a
                href="mailto:Dr.Schmidt@praxis.de"
                className="text-stone-200 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Dr.Schmidt@praxis.de
              </a>
            </p>
          </address>
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-montserrat text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-6">
                Sprechzeiten
              </p>
              <div className="space-y-3 font-lato text-sm text-stone-300">
                <div className="flex justify-between items-center group">
                  <span className="font-medium group-hover:text-emerald-400 transition-colors">Mo – Fr</span>
                  <span className="text-white font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">08:00 – 17:00</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-stone-500 font-bold uppercase tracking-widest border-t border-stone-800 pt-3">
                  <span>Pause</span>
                  <span>12:00 – 13:00</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-stone-800/50">
              <Link
                to="/dashboard"
                className="group flex items-center justify-between w-full bg-stone-800/30 hover:bg-emerald-500/10 border border-stone-700/50 hover:border-emerald-500/30 p-4 rounded-xl transition-all duration-300"
              >
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 group-hover:text-emerald-400">Direktbuchung</p>
                  <p className="text-xs font-montserrat font-bold text-white tracking-wide">JETZT ONLINE BUCHEN</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-stone-700 group-hover:bg-emerald-500 group-hover:border-emerald-500 flex items-center justify-center transition-all">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
              <div className="mt-4 flex items-center gap-3 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
                <div className="h-[1px] flex-1 bg-stone-800" />
                <span>Alternativ</span>
                <div className="h-[1px] flex-1 bg-stone-800" />
              </div>
              <a 
                href="tel:02111593482"
                className="mt-3 block text-center font-lato text-xs text-stone-400 hover:text-white transition-colors"
              >
                Telefonische Vereinbarung: <span className="font-bold underline underline-offset-4 decoration-stone-700 hover:decoration-emerald-500">0211 1593 482</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-stone-700 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-lato text-xs text-stone-500">
            © {new Date().getFullYear()} Zahnarztpraxis Dr. Maria Schmidt
          </p>
          <nav aria-label="Rechtliches" className="flex flex-wrap gap-6">
            <Link
              to="/impressum"
              className="font-lato text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="font-lato text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Datenschutz
            </Link>
          </nav>

        </div>
      </div>
    </footer>
  );
};
