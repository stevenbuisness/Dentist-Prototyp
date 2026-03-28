export const PremiumHero = (): JSX.Element => {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-stone-200/60"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="max-w-xl">
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Zahnarztpraxis · Berlin
          </p>
          <h1 className="mt-4 font-montserrat text-4xl font-semibold leading-tight tracking-tight text-stone-900 md:text-5xl">
            Diagnostik, Planung und Behandlung auf dokumentiert hohem Niveau.
          </h1>
          <p className="mt-6 font-lato text-lg leading-relaxed text-stone-700">
            Wir arbeiten evidenzbasiert, erklären jeden Schritt und setzen auf
            ruhige Abläufe. Ziel: vorhersehbare Ergebnisse und wenig
            Unsicherheit für Sie als Patientin oder Patient.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#orientierung"
              className="font-montserrat inline-flex rounded-sm border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
            >
              Vorgehen verstehen
            </a>
            <a
              href="#standards"
              className="font-lato inline-flex items-center rounded-sm px-5 py-3 text-sm font-medium text-stone-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
            >
              Qualitätsindikatoren
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full max-lg:max-h-[420px] lg:aspect-[3/4]">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="h-full w-full rounded-sm object-cover shadow-[0_24px_60px_-20px_rgba(28,25,23,0.25)]"
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-stone-900/10"
            aria-hidden
          />
          <p className="font-lato mt-4 text-right text-xs text-stone-500">
            Behandlungsumgebung: reduzierte Reize, klare Oberflächen, moderne
            Instrumentierung.
          </p>
        </div>
      </div>
    </section>
  );
};
