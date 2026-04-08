import { motion } from "framer-motion";
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
    text: "Früherkennung, professionelle Zahnreinigung und strukturierte Verlaufskontrollen – für langfristige Zahngesundheit.",
    Icon: Shield,
    number: "01"
  },
  {
    title: "Zahnerhalt",
    text: "Minimalinvasive Karies- und Endodontietherapie – präzise durchgeführt, unterstützt durch Vergrößerungstechniken, wo sinnvoll.",
    Icon: Microscope,
    number: "02"
  },
  {
    title: "Implantologie",
    text: "Sorgfältige Planung auf Basis der Knochensituation – mit langlebigen, biologisch und funktional abgestimmten Versorgungen.",
    Icon: Bone,
    number: "03"
  },
  {
    title: "Ästhetik & Funktion",
    text: "Natürlich wirkende Ergebnisse durch das Zusammenspiel von Form, Funktion und Ästhetik – in einem konsistenten Gesamtkonzept.",
    Icon: Sparkles,
    number: "04"
  },
  {
    title: "Kieferorthopädie",
    text: "Aligner und feste Apparaturen – indikationsgerecht eingesetzt, mit klar definierten Behandlungszielen.",
    Icon: Activity,
    number: "05"
  },
  {
    title: "Oralchirurgie",
    text: "Schonende Eingriffe mit strukturierter Nachsorge – für eine sichere und möglichst komplikationsarme Heilung.",
    Icon: HeartPulse,
    number: "06"
  },
] as const;

export const PremiumServices = (): JSX.Element => {
  return (
    <section id="leistungen" className="scroll-mt-28 border-b border-stone-200/60 bg-[#f4f7fb] overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr] lg:items-start">
          {/* Header Column */}
          <div className="lg:sticky lg:top-36">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                Spektrum
              </p>
              <h2 className="mt-6 font-montserrat text-4xl font-black leading-tight tracking-tighter text-stone-900 md:text-5xl">
                Leistungen mit klarer Verantwortung
              </h2>
              <div className="mt-8 h-px w-12 bg-blue-200" />
              <p className="mt-8 font-lato text-lg leading-relaxed text-stone-600">
                Wir empfehlen jede Behandlung ausschließlich auf Basis einer fundierten Diagnose. 
                Keine standardisierten Pakete – sondern individuelle Planung mit nachvollziehbaren Entscheidungen.
              </p>
            </motion.div>
          </div>

          {/* Items Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map(({ title, text, Icon, number }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover="hover"
                className="group relative flex flex-col rounded-[2.5rem] border border-stone-200/60 bg-white p-10 shadow-sm transition-all hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5"
              >
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />
                    <Icon
                      className="relative h-10 w-10 text-stone-800 transition-colors group-hover:text-blue-600"
                      strokeWidth={1}
                      aria-hidden
                    />
                  </div>
                  <span className="font-montserrat text-xs font-bold tracking-widest text-stone-300 group-hover:text-blue-200">
                    {number}
                  </span>
                </div>
                
                <h3 className="mt-10 font-montserrat text-xl font-bold tracking-tight text-stone-900">
                  {title}
                </h3>
                <p className="mt-4 font-lato text-sm leading-relaxed text-stone-600">
                  {text}
                </p>

                {/* Expanding Precision Line */}
                <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden px-10">
                  <motion.div 
                    variants={{
                      hover: { scaleX: 1, opacity: 1 },
                      initial: { scaleX: 0, opacity: 0 }
                    }}
                    initial="initial"
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="h-full w-full origin-left bg-blue-600"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
