import { motion } from "framer-motion";

export const PremiumHero = (): JSX.Element => {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-stone-200/60 bg-gradient-to-br from-[#faf9f7] via-[#faf9f7] to-[#f4f7fb]"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-8 bg-blue-600" />
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-blue-900/60">
              Praxis Dr. Schmidt · Düsseldorf
            </p>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 font-montserrat text-5xl font-black leading-[1.1] tracking-tighter text-stone-950 md:text-7xl lg:text-8xl"
          >
            Präzision, die man <span className="text-blue-600">sieht.</span> <br />
            Qualität, die man <span className="text-blue-600">fühlt.</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-lato text-sm font-bold uppercase tracking-widest text-stone-500"
          >
            <span>Evidenzbasiert</span>
            <span className="h-4 w-px bg-stone-300" />
            <span>Transparent</span>
            <span className="h-4 w-px bg-stone-300" />
            <span className="text-stone-900">Ruhige Atmosphäre</span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 font-lato text-lg leading-relaxed text-stone-600 max-w-lg"
          >
            Sichere, planbare Ergebnisse durch modernste Technik und menschliche Empathie.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 flex flex-wrap gap-5"
          >
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#orientierung"
              className="font-montserrat inline-flex rounded-full bg-stone-950 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
            >
              Konzept entdecken
            </motion.a>
            <motion.a
              whileHover={{ x: 5 }}
              href="#standards"
              className="font-lato inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-stone-900 underline-offset-8 hover:underline"
            >
              Qualitätsversprechen
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6l6 6-6 6"/></svg>
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] w-full max-lg:max-h-[450px] lg:aspect-[3/4] group"
        >
          <div className="absolute inset-0 z-0 bg-blue-100/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
          
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src="/premium_dental_macro_hero_1775659249558.png"
            alt="Moderne Zahnmedizin Detail"
            className="relative z-10 h-full w-full rounded-2xl object-cover shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12),0_30px_60px_-30px_rgba(0,0,0,0.15)] transition-transform"
          />

          {/* Floating Glass Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -right-4 top-12 z-20 flex items-center gap-3 rounded-full border border-white/40 bg-white/40 px-5 py-3 shadow-xl backdrop-blur-md"
          >
            <div className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-blue-900">
              Präzision & Ästhetik
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
