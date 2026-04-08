export const PremiumTeam = (): JSX.Element => {
  return (
    <section id="team" className="scroll-mt-28 border-b border-stone-200/60 bg-[#f8fbfe]">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-start">
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"
            alt="Dr. Maria Schmidt"
            className="relative z-10 w-full rounded-[2.5rem] object-cover shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.02]"
          />
        </div>
        <div className="max-w-xl pt-2">
            <h2 className="font-montserrat text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
            Leitender Zahnarzt mit nachweislicher Weiterbildung
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
              <dd>Staatsexamen; Fachzahnärztliche Weiterbildung</dd>
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
