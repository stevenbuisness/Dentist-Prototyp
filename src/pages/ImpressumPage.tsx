import { motion } from "framer-motion";
import { PremiumNavigation } from "../screens/PremiumLanding/sections/PremiumNavigation";
import { PremiumFooter } from "../screens/PremiumLanding/sections/PremiumFooter";
import { Info, MapPin, Phone, Mail, Award, Landmark, FileCheck } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 antialiased">
      <PremiumNavigation />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-stone-900/20">
              <Info size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-montserrat font-black uppercase tracking-tight text-stone-900">
                Impressum
              </h1>
              <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] mt-1 space-x-2">
                <span>Gesetzliche Angaben</span>
                <span className="text-stone-200">|</span>
                <span>Stand April 2024</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Kontakt & Inhaber */}
            <section className="bg-white border border-stone-200/60 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 text-stone-100 group-hover:text-stone-200 transition-colors">
                  <MapPin size={48} />
               </div>
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Inhaberin
               </h2>
               <div className="space-y-1 text-stone-800 font-bold text-lg leading-tight mb-6">
                  <p>Zahnarztpraxis</p>
                  <p>Dr. Maria Schmidt</p>
               </div>
               <div className="space-y-3 text-stone-500 font-medium text-sm">
                  <p className="flex items-center gap-3">
                     <MapPin size={16} className="text-stone-300" />
                     Charlottenring 12, 40227 Düsseldorf
                  </p>
                  <p className="flex items-center gap-3">
                     <Phone size={16} className="text-stone-300" />
                     0211-1593482
                  </p>
                  <p className="flex items-center gap-3">
                     <Mail size={16} className="text-stone-300" />
                     Dr.Schmidt@praxis.de
                  </p>
               </div>
            </section>

            {/* Berufsbezeichnung */}
            <section className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
               <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 flex items-center gap-2">
                     <Award size={16} />
                     Qualifikation
                  </h2>
                  <div className="space-y-2">
                     <p className="text-2xl font-montserrat font-black uppercase leading-none">Zahnärztin</p>
                     <p className="text-stone-400 text-xs font-medium italic">verliehen in der Bundesrepublik Deutschland</p>
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest leading-relaxed">
                     Approbation erteilt durch die Bezirksregierung Düsseldorf
                  </p>
               </div>
            </section>
          </div>

          {/* Aufsichtsbehörden & Rechtliches */}
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6 text-stone-900 border-l-4 border-emerald-500 pl-4">
                 <h2 className="text-xl font-montserrat font-black uppercase tracking-wide">Zuständige Aufsichtsbehörden</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-white border border-stone-100 rounded-3xl flex items-start gap-4">
                    <Landmark className="text-stone-400 shrink-0" size={20} />
                    <div>
                       <h3 className="font-black text-stone-900 text-[11px] uppercase tracking-wider mb-1">Zuständige Kammer</h3>
                       <p className="text-stone-500 text-[13px] font-medium leading-relaxed">
                          Zahnärztekammer Nordrhein (Körperschaft des öffentlichen Rechts)<br />
                          Emanuel-Leutze-Str. 8, 40547 Düsseldorf
                       </p>
                    </div>
                 </div>
                 <div className="p-6 bg-white border border-stone-100 rounded-3xl flex items-start gap-4">
                    <FileCheck className="text-stone-400 shrink-0" size={20} />
                    <div>
                       <h3 className="font-black text-stone-900 text-[11px] uppercase tracking-wider mb-1">Kassenzahnärztliche Vereinigung</h3>
                       <p className="text-stone-500 text-[13px] font-medium leading-relaxed">
                          KZV Nordrhein<br />
                          Lindemannstraße 34-42, 40237 Düsseldorf
                       </p>
                    </div>
                 </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-montserrat font-black uppercase tracking-wide text-stone-900">Berufsrechtliche Regelungen</h2>
              <p className="text-stone-500 text-sm font-medium leading-relaxed">
                Die Inhaberin unterliegt den folgenden berufsrechtlichen Regelungen, welche über die Website der Zahnärztekammer Nordrhein (www.zaek-nr.de) eingesehen werden können:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-400 font-bold uppercase tracking-widest list-none">
                 <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-stone-300" />
                    Zahnheilkundegesetz
                 </li>
                 <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-stone-300" />
                    Heilberufegesetz NRW
                 </li>
                 <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-stone-300" />
                    Berufsordnung der ZÄK Nordrhein
                 </li>
                 <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-stone-300" />
                    Gebührenordnung für Zahnärzte (GOZ)
                 </li>
              </ul>
            </section>

            <section className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 italic">
               <h2 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Streitschlichtung</h2>
               <p className="text-stone-500 text-[12px] leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
               </p>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-16 text-center">
             <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 font-black uppercase tracking-[0.2em] text-[10px] bg-white px-8 py-4 rounded-full border border-stone-100 transition-all shadow-sm hover:shadow-md active:scale-95"
             >
                ← Zurück zur Startseite
             </button>
          </div>
        </motion.div>
      </main>

      <PremiumFooter />
    </div>
  );
}
