import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, Zap, FileSearch, Quote } from "lucide-react";

export const PremiumTrustSection = (): JSX.Element => {
  const metrics = [
    {
      title: "≥ 125 Stunden",
      category: "Fortbildung",
      detail: "pro Jahr im Teamdurchschnitt",
      Icon: BookOpen
    },
    {
      title: "Klasse B",
      category: "Hygiene",
      detail: "Dampfsterilisation mit Zyklenprotokoll",
      Icon: ShieldCheck
    },
    {
      title: "Digitale Diagnostik",
      category: "Röntgen",
      detail: "Moderne Systeme mit Dosisoptimierung",
      Icon: Zap
    },
    {
      title: "Lückenlos",
      category: "Befunde",
      detail: "Revisionssicher archiviert & nachvollziehbar",
      Icon: FileSearch
    },
  ];

  return (
    <section
      id="standards"
      className="scroll-mt-28 border-b border-stone-200/60 bg-[#eef4fb] overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-blue-600">
                Sicherheit & Qualität
              </p>
              <h2 className="mt-6 font-montserrat text-4xl font-black leading-tight tracking-tighter text-stone-900 md:text-5xl">
                Wissenschaftliche Standards. <br />
                <span className="text-stone-500 font-light italic">Sorgfältig umgesetzt.</span>
              </h2>
              <div className="mt-10 relative pl-8 border-l-2 border-blue-500/20">
                <Quote className="absolute -left-3 -top-4 h-8 w-8 text-blue-500/10 rotate-180" />
                <p className="font-lato text-lg md:text-xl italic leading-relaxed text-stone-600">
                  „Wir schätzen Ihr Feedback sehr. Entscheidend für Ihre Sicherheit sind bei uns jedoch klar definierte, reproduzierbare Prozesse – von uns lückenlos dokumentiert und konsequent umgesetzt.“
                </p>
              </div>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {metrics.map((m, index) => (
                <motion.div
                  key={m.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative flex flex-col rounded-3xl border border-white/40 bg-white/40 p-8 backdrop-blur-md transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 h-full"
                >
                  <m.Icon className="h-5 w-5 text-blue-500 mb-6 shrink-0" strokeWidth={2.5} />
                  <div className="flex flex-col h-full">
                    {/* Fixed height for title container to ensure alignment */}
                    <div className="min-h-[3.5rem] flex items-start">
                      <p className="font-montserrat text-xl font-black tracking-tight text-stone-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {m.title}
                      </p>
                    </div>
                    
                    <p className="mt-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                      Fachbereich: {m.category}
                    </p>
                    
                    <div className="mt-6 h-px w-8 bg-stone-200 group-hover:w-16 group-hover:bg-blue-300 transition-all duration-500" />
                    
                    <p className="mt-6 font-lato text-xs leading-relaxed text-stone-500 flex-grow">
                      {m.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-10 rounded-full bg-blue-300/20 blur-[100px]" />
            <img
              src="/premium_precision_tools.png"
              alt="Hygienestandards & Instrumentarium"
              className="relative z-10 w-full rounded-[3rem] object-cover shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
            />
            {/* Minimalist Tech-Badge */}
            <div className="absolute bottom-10 -left-10 z-20 bg-white/90 backdrop-blur-md border border-stone-200 p-6 rounded-2xl shadow-xl max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Validiertes QM</span>
              </div>
              <p className="text-xs font-montserrat font-bold text-stone-800">Tägliche Sterilkontrolle nach RKI-Vorgabe</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 relative flex flex-col items-center justify-center rounded-[3rem] bg-stone-900 p-12 text-center text-white overflow-hidden shadow-2xl shadow-stone-900/20"
        >
          {/* Subtle Radial Gradient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f625,transparent)]" />
          
          <Quote className="h-10 w-10 text-blue-500 opacity-50 mb-6" />
          
          <p className="relative z-10 font-lato text-xl md:text-2xl italic leading-relaxed max-w-3xl">
            „Qualitätsmanagement ist kein Zustand, sondern ein kontinuierlicher Prozess – geprüft, dokumentiert und konsequent umgesetzt.“
          </p>
          
          <div className="relative z-10 mt-10 flex items-center gap-6">
            <div className="h-px w-8 bg-blue-500/50" />
            <span className="font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-stone-400">Leitbild Qualitätsmanagement</span>
            <div className="h-px w-8 bg-blue-500/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
