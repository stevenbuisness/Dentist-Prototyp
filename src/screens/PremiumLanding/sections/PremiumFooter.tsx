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
              Dr. Schmidt
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
              Hauptstraße 123, 2. OG
              <br />
              10115 Berlin
            </p>
            <p className="mt-6 font-montserrat text-sm font-semibold uppercase tracking-wide text-stone-400">
              Erreichbarkeit
            </p>
            <p className="mt-3 font-lato text-sm">
              <a
                href="tel:03012345678"
                className="text-stone-200 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                030 1234 5678
              </a>
            </p>
            <p className="mt-2 font-lato text-sm">
              <a
                href="mailto:kontakt@zahnarztpraxis.de"
                className="text-stone-200 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                kontakt@zahnarztpraxis.de
              </a>
            </p>
          </address>
          <div>
            <p className="font-montserrat text-sm font-semibold uppercase tracking-wide text-stone-400">
              Hinweis
            </p>
            <p className="mt-3 font-lato text-sm leading-relaxed text-stone-400">
              Terminvereinbarung telefonisch oder nach vorheriger Absprache.
              Diese Seite ersetzt keine individuelle Beratung.
            </p>
            <p className="mt-8 font-lato text-sm text-stone-500">
              <Link
                to="/old"
                className="text-stone-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Vorherige Startseite (Archiv)
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-stone-700 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-lato text-xs text-stone-500">
            © {new Date().getFullYear()} Zahnarztpraxis Dr. Schmidt
          </p>
          <nav aria-label="Rechtliches" className="flex flex-wrap gap-6">
            <a
              href="#kontakt"
              className="font-lato text-xs text-stone-400 hover:text-stone-200"
            >
              Impressum
            </a>
            <a
              href="#kontakt"
              className="font-lato text-xs text-stone-400 hover:text-stone-200"
            >
              Datenschutz
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
