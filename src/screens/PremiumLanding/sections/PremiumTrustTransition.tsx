import { useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "15+", label: "Jahre Erfahrung" },
  { value: "5.000+", label: "durchgeführte Implantatversorgungen" },
  { value: "Digital unterstützt", label: "Planung und Umsetzung" },
  { value: "Hohe Patientenzufriedenheit", label: "kontinuierlich dokumentiert" },
];

const tickerItems = [
  "DGI IMPLANTOLOGIE",
  "MASTER OF SCIENCE",
  "DIGITALE 3D DIAGNOSTIK",
  "ZERTIFIZIERTE QUALITÄT",
];

export const PremiumTrustTransition = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Create 4 sets of items to ensure there is always enough content for a seamless loop
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="relative bg-gradient-to-b from-[#eef4fb] via-[#e7f0f8] to-[#e0eaf5] overflow-hidden">
      
      {/* Seamless Infinite Ticker with Faded Edges and Hover Pause */}
      <div className="relative py-12 border-b border-stone-200/50">
        
        {/* Soft Masking Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#eef4fb] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#eef4fb] to-transparent z-20 pointer-events-none" />

        <div 
          className="flex overflow-hidden select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex items-center gap-16 px-8 min-w-max"
            style={{
              animation: "premium-ticker 40s linear infinite",
              animationPlayState: isHovered ? "paused" : "running",
            }}
          >
            {duplicatedItems.map((item, idx) => (
              <div key={`${item}-${idx}`} className="flex items-center gap-16">
                <span className="font-montserrat text-sm font-bold uppercase tracking-[0.3em] text-stone-400">
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes premium-ticker {
            from { transform: translateX(0); }
            to { transform: translateX(-25%); }
          }
        `}</style>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-blue-600">
            Expertise & Vertrauen
          </p>
          <h2 className="mt-6 font-montserrat text-4xl font-light tracking-tight text-stone-900 md:text-5xl">
            Erfahrung, die <span className="font-semibold text-stone-950 underline decoration-blue-500/30 decoration-8 underline-offset-[-2px]">Sicherheit schafft</span>
          </h2>
          <p className="mx-auto mt-10 max-w-2xl font-lato text-xl italic leading-relaxed text-stone-500">
            „Langjährige klinische Erfahrung, strukturierte Abläufe und der konsequente Einsatz digitaler Verfahren bilden die Grundlage unserer Arbeit.“
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "15+", label: "Jahre Erfahrung", highlight: false },
            { value: "5.000+", label: "Implantatversorgungen", highlight: false },
            { value: "Digital unterstützt", label: "Planung & Umsetzung", highlight: true },
            { value: "Patientenzufriedenheit", label: "Kontinuierlich dokumentiert", highlight: true },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-md rounded-[3rem] shadow-sm border border-stone-200/40 transition-all hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 min-h-[280px]"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`font-montserrat font-black tracking-tighter leading-tight ${stat.highlight ? 'text-xl' : 'text-4xl'} text-stone-900`}>
                  {stat.value}
                </div>
                <div className="mt-6 h-1 w-6 bg-blue-500/20 transition-all group-hover:w-12 group-hover:bg-blue-500" />
                <div className="mt-6 font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 leading-relaxed max-w-[140px]">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div
        className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"
        aria-hidden
      />
    </div>
  );
};
