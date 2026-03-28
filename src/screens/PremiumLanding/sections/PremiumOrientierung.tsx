export const PremiumOrientierung = (): JSX.Element => {
  return (
    <section
      id="orientierung"
      className="border-b border-stone-200/60 bg-white/60"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="w-full rounded-sm object-cover shadow-lg ring-1 ring-stone-900/10"
          />
        </div>
        <div className="order-1 max-w-xl lg:order-2">
          <h2 className="font-montserrat text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
            Orientierung statt Improvisation
          </h2>
          <p className="mt-6 font-lato text-lg leading-relaxed text-stone-700">
            Vor jeder Therapie erfolgt eine strukturierte Befundung und
            Bildgebung nach aktuellen Leitlinien. Sie erhalten eine nachvollziehbare
            Indikationsstellung und Alternativen mit Nutzen-Risiko-Abwägung — ohne
            verkürzte Diagnosen.
          </p>
          <ul className="mt-8 space-y-4 font-lato text-stone-800">
            <li className="flex gap-3">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-600"
                aria-hidden
              />
              <span>
                Hygiene- und Sterilprotokolle nach RKI-orientierten Standards;
                Nachweise auf Anfrage.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-600"
                aria-hidden
              />
              <span>
                Schmerzarme Verfahren wo sinnvoll; lokale Anästhesie mit
                kontrollierter Dosierung.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-600"
                aria-hidden
              />
              <span>
                Team mit Fachzahnarztweiterbildungen in konservierender
                Zahnheilkunde und Implantologie.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
