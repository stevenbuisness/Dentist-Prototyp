export const PremiumTrustSection = (): JSX.Element => {
  const metrics = [
    {
      label: "Fortbildungszeit",
      value: "≥ 125 h",
      detail: "pro Jahr im Praxisdurchschnitt (Team)",
    },
    {
      label: "Sterilisation",
      value: "Klassen B",
      detail: "Dampfsterilisation mit Zyklusprotokoll",
    },
    {
      label: "Diagnostik",
      value: "Digital",
      detail: "Röntgensystem mit Dosisoptimierung",
    },
    {
      label: "Dokumentation",
      value: "Vollständig",
      detail: "Befunde und Einwilligungen revisionssicher",
    },
  ] as const;

  return (
    <section
      id="standards"
      className="scroll-mt-28 border-b border-stone-200/60 bg-[#eef4fb]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-montserrat text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
              Messbare Standards statt Zufallsbewertungen
            </h2>
            <p className="mt-6 font-lato text-lg leading-relaxed text-stone-700">
              Patientenfeedback ist wertvoll — entscheidend für Ihre Sicherheit
              sind jedoch reproduzierbare Prozesse. Hier die Eckpunkte, die wir
              intern messen und extern belegen können.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-sm border border-stone-300/80 bg-white/90 px-5 py-5 shadow-sm"
                >
                  <p className="font-montserrat text-2xl font-semibold tabular-nums text-stone-900">
                    {m.value}
                  </p>
                  <p className="mt-1 font-montserrat text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {m.label}
                  </p>
                  <p className="mt-3 font-lato text-sm leading-snug text-stone-700">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80"
              alt="Diagnostikbereich"
              className="w-full rounded-2xl object-cover shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] transition-transform hover:rotate-1"
            />
          </div>
        </div>

        <blockquote className="mt-20 border-l-4 border-stone-500 pl-8">
          <p className="font-lato text-lg italic leading-relaxed text-stone-800">
            „Vertrauen entsteht, wenn Erklärung, Technik und Nachbereitung
            zusammenpassen — nicht wenn einzelne Ergebnisse isoliert gefeiert
            werden.“
          </p>
          <footer className="mt-4 font-lato text-sm text-stone-600">
            — Leitbild Qualitätsmanagement, Praxis intern
          </footer>
        </blockquote>
      </div>
    </section>
  );
};
