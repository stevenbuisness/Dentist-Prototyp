import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award } from "lucide-react";

const assistantTeam = [
  {
    name: "Anna",
    role: "Praxismanagement & Patient Care",
    focus: "Patientenbetreuung & Organisation"
  },
  {
    name: "Lena",
    role: "Dentalhygiene & Prophylaxe",
    focus: "Prävention & Bleaching"
  },
  {
    name: "Sophie",
    role: "Behandlungsassistenz",
    focus: "Chirurgie-Support & Hygiene"
  }
];

export const PremiumTeam = (): JSX.Element => {
  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="team" className="scroll-mt-28 border-b border-stone-200/60 bg-[#f8fbfe] overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          
          {/* Interactive Team Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative cursor-default"
          >
            {/* Background Aura */}
            <div className="absolute -inset-10 rounded-full bg-blue-400/10 blur-[100px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
              <img
                src="/premium_team_maria.png"
                alt="Das Team in der Smile Lounge"
                className="w-full transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Glass Badge */}
              <motion.div 
                style={{ translateZ: 50 }}
                className="absolute bottom-10 right-10 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/20 p-4 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Award size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Expertenteam</span>
                  <span className="text-sm font-bold text-white">Präzision in NRW</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Texts & Signature */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                Führung & Teamgeist
              </p>
              <h2 className="mt-6 font-montserrat text-4xl font-black leading-tight tracking-tighter text-stone-900 md:text-6xl">
                Ihre Experten für Präzision
              </h2>
              <p className="mt-8 font-lato text-xl leading-relaxed text-stone-600">
                Gemeinsam mit Dr. Maria leben wir eine klare Vision: Strukturierte Diagnostik mit einem hohen Anspruch an Präzision und Verlässlichkeit. 
                Jede Behandlung wird bei uns im Team koordiniert, um für Sie das bestmögliche Ergebnis zu sichern.
              </p>

              {/* Signature Area */}
              <div className="mt-10 flex flex-col">
                <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-stone-400">Leitende Zahnärztin</span>
                <div className="mt-2 flex items-baseline gap-4">
                  <span className="font-montserrat text-2xl font-bold text-stone-900">Dr. Maria Schmidt</span>
                  <span style={{ fontFamily: '"Mrs Saint Delafield", cursive' }} className="text-4xl text-blue-600/60 select-none">
                    Maria Schmidt
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Assistants Grid */}
            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {assistantTeam.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="group flex flex-col"
                >
                  <div className="h-px w-8 bg-blue-200 transition-all group-hover:w-full" />
                  <span className="mt-6 font-montserrat text-lg font-black tracking-tight text-stone-900">{member.name}</span>
                  <span className="mt-1 font-lato text-[10px] font-bold uppercase tracking-widest text-blue-600/80">{member.role}</span>
                  <span className="mt-3 font-lato text-xs leading-relaxed text-stone-500 lg:pr-4">{member.focus}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* External Font Injection For Signature */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');
      `}</style>
    </section>
  );
};
