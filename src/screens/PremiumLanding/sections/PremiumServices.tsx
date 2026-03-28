import {
  Activity,
  Bone,
  HeartPulse,
  Microscope,
  Shield,
  Sparkles,
} from "lucide-react";

const items = [
  {
    title: "Prävention & Parodontologie",
    text: "Früherkennung, professionelle Zahnreinigung, dokumentierte Verlaufskontrollen.",
    Icon: Shield,
  },
  {
    title: "Zahnerhalt",
    text: "Karies- und Endodontietherapie mit mikroskopischer Präzision wo indiziert.",
    Icon: Microscope,
  },
  {
    title: "Implantologie",
    text: "Planung inkl. Knochenbewertung; werkstoffkundlich abgestimmte Versorgungen.",
    Icon: Bone,
  },
  {
    title: "Ästhetik & Funktion",
    text: "Oberflächen, Okklusion und Ästhetik in einem konsistenten Behandlungsplan.",
    Icon: Sparkles,
  },
  {
    title: "Kieferorthopädie",
    text: "Aligner und feste Techniken nach Indikation — mit klaren Behandlungszielen.",
    Icon: Activity,
  },
  {
    title: "Oralchirurgie",
    text: "Extraktionen und Weichgewebsmanagement mit postoperativer Nachsorge.",
    Icon: HeartPulse,
  },
] as const;

export const PremiumServices = (): JSX.Element => {
  return (
    <section id="leistungen" className="border-b border-stone-200/60 bg-[#f3f0eb]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Spektrum
          </p>
          <h2 className="mt-3 font-montserrat text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
            Leistungen mit definierter Verantwortung
          </h2>
          <p className="mt-4 font-lato text-lg leading-relaxed text-stone-700">
            Jedes Verfahren wird nur nach klarer Indikation empfohlen. Keine
            Paketangebote ohne Befund — Planung geht vor Schnelligkeit.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, text, Icon }) => (
            <article
              key={title}
              className="flex flex-col rounded-sm border border-stone-200/80 bg-[#faf8f5] p-8 shadow-sm"
            >
              <Icon
                className="h-8 w-8 text-stone-700"
                strokeWidth={1.25}
                aria-hidden
              />
              <h3 className="mt-6 font-montserrat text-lg font-semibold text-stone-900">
                {title}
              </h3>
              <p className="mt-3 font-lato text-sm leading-relaxed text-stone-700">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
