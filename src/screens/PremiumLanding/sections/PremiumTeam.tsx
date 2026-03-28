export const PremiumTeam = (): JSX.Element => {
  return (
    <section id="team" className="border-b border-stone-200/60 bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-start">
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <div
            className="absolute -right-3 -top-3 h-full w-full rounded-sm border border-stone-300/80"
            aria-hidden
          />
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"
            alt=""
            className="relative z-10 w-full rounded-sm object-cover shadow-xl ring-1 ring-stone-900/10"
          />
        </div>
        <div className="max-w-xl pt-2">
          <h2 className="font-montserrat text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
            Führungszahnarzt mit nachweislicher Weiterbildung
          </h2>
          <p className="mt-6 font-lato text-lg leading-relaxed text-stone-700">
            Dr. Schmidt leitet die Praxis mit über 15 Jahren klinischer
            Erfahrung. Schwerpunkte: konservierende Therapie, ästhetische
            Versorgungen und implantologische Rekonstruktion — inklusive
            interdisziplinärer Koordination bei komplexen Fällen.
          </p>
          <dl className="mt-10 space-y-4 font-lato text-stone-800">
            <div className="flex flex-col gap-1 border-l-2 border-stone-300 pl-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Qualifikation
              </dt>
              <dd>Staatsexamen; Fachzahnarztweiterbildung (analog gültiger Regelung)</dd>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-stone-300 pl-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Fortbildung
              </dt>
              <dd>
                Regelmäßige Teilnahme an Fachkongressen und Hands-on-Kursen zu
                digitaler Planung und Materialwissenschaften.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};
