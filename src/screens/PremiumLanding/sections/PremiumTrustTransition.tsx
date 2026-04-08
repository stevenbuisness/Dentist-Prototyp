import { motion } from "framer-motion";

const stats = [
  { label: "Jahre Erfahrung", value: "15+" },
  { label: "Erfolgreiche Implantate", value: "5.000+" },
  { label: "Patientenzufriedenheit", value: "99%" },
  { label: "Digitale Workflows", value: "100%" },
];

export const PremiumTrustTransition = (): JSX.Element => {
  return (
    <div className="relative bg-gradient-to-b from-[#eef4fb] via-[#e7f0f8] to-[#e0eaf5] overflow-hidden">
      
      {/* Infinite Ticker */}
      <div className="pt-16 pb-8 border-b border-stone-200/50">
        <div className="flex w-fit animate-ticker">
          {/* We duplicate the content to create a seamless loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8 whitespace-nowrap">
              <span className="font-montserrat text-sm font-bold tracking-[0.2em] text-stone-400">DGIMPLANTOLOGIE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              <span className="font-montserrat text-sm font-bold tracking-[0.2em] text-stone-400">MASTER OF SCIENCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              <span className="font-montserrat text-sm font-bold tracking-[0.2em] text-stone-400">STATE OF THE ART 3D DIAGNOSTICS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              <span className="font-montserrat text-sm font-bold tracking-[0.2em] text-stone-400">ZERTIFIZIERTE QUALITÄT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-montserrat text-xs font-semibold uppercase tracking-[0.28em] text-stone-500"
        >
          Exzellenz durch Erfahrung
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl font-montserrat text-3xl font-light leading-tight text-stone-900"
        >
          Keine Kompromisse bei Ihrer <span className="font-semibold text-primary">Gesundheit</span>.
        </motion.h2>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center justify-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50"
            >
              <div className="text-4xl font-black text-stone-800 font-montserrat tracking-tighter">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-stone-500 font-lato text-center">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div
        className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"
        aria-hidden
      />
    </div>
  );
};
