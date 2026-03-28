const benchmarks = [
  {
    title: "Fortbildung",
    value: "≥ 125 h",
    note: "Teamjahr (Durchschnitt), nachweislich dokumentiert",
  },
  {
    title: "Sterilisation",
    value: "Klasse B",
    note: "Dampfsterilisation mit Zyklusdokumentation",
  },
  {
    title: "Diagnostik",
    value: "Digital",
    note: "Röntgen mit Dosisreduktion; Befundarchivierung",
  },
  {
    title: "Dokumentation",
    value: "Vollständig",
    note: "Befunde, Einwilligung, Therapieplan revisionssicher",
  },
] as const;

export const PatientTestimonialSection = (): JSX.Element => {
  return (
    <section
      id="patienten"
      className="relative w-full overflow-hidden bg-[#f0f6f8] py-20 px-8"
    >
      <div className="mx-auto flex max-w-[1427px] flex-col gap-14 lg:flex-row lg:items-stretch lg:gap-16">
        <div className="relative min-h-[280px] flex-1 lg:max-w-[48%]">
          <img
            className="h-full min-h-[280px] w-full rounded-lg object-cover shadow-lg ring-1 ring-black/5"
            alt=""
            src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80"
          />
          <p className="mt-4 [font-family:'Kollektif-Regular',Helvetica] text-sm leading-relaxed text-[#6b7d85]">
            Aufbereitung und Diagnostik: getrennte Zonen, klare Prozesse.
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h2 className="[font-family:'Kollektif-Bold',Helvetica] text-4xl font-bold leading-tight tracking-[-0.64px] text-[#282828] md:text-[48px]">
            Standards, die Sie einordnen können.
          </h2>
          <p className="mt-6 max-w-[560px] [font-family:'Kollektif-Regular',Helvetica] text-lg leading-9 text-[#5a656b]">
            Einzelne Patientenstimmen sind subjektiv. Für Ihre Sicherheit
            zählen wiederholbare Abläufe und messbare Parameter — transparent
            kommuniziert, ohne Marketingüberhöhung.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {benchmarks.map((b) => (
              <div
                key={b.title}
                className="rounded-lg border border-[#c5d9e2]/80 bg-white/90 p-6 shadow-sm"
              >
                <p className="[font-family:'Kollektif-Bold',Helvetica] text-2xl font-bold text-[#5ba3bb]">
                  {b.value}
                </p>
                <p className="mt-1 [font-family:'Kollektif-Bold',Helvetica] text-xs uppercase tracking-[0.2em] text-[#6b7d85]">
                  {b.title}
                </p>
                <p className="mt-3 [font-family:'Kollektif-Regular',Helvetica] text-sm leading-relaxed text-[#5a656b]">
                  {b.note}
                </p>
              </div>
            ))}
          </div>

          <blockquote className="mt-12 border-l-4 border-[#5ba3bb] pl-6">
            <p className="[font-family:'Kollektif-Regular',Helvetica] text-lg italic leading-relaxed text-[#3d474c]">
              „Vertrauen entsteht, wenn Erklärung, Technik und Nachsorge
              zusammenpassen — nicht wenn isolierte Ergebnisse gefeiert werden.“
            </p>
            <footer className="mt-3 [font-family:'Kollektif-Regular',Helvetica] text-sm text-[#6b7d85]">
              — Leitbild Qualitätsmanagement (intern)
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
