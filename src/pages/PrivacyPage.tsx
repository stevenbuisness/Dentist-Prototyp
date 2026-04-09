import { motion } from "framer-motion";
import { PremiumNavigation } from "../screens/PremiumLanding/sections/PremiumNavigation";
import { PremiumFooter } from "../screens/PremiumLanding/sections/PremiumFooter";
import { ShieldCheck, FileText, Lock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MetaTags } from "../components/seo/MetaTags";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 antialiased">
      <MetaTags 
        title="Datenschutz" 
        description="Informationen zur Verarbeitung Ihrer personenbezogenen Daten in der Zahnarztpraxis Dr. Maria Schmidt."
        canonical="https://zahnarztpraxis-schmidt.de/datenschutz"
      />
      <PremiumNavigation />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-montserrat font-black uppercase tracking-tight text-stone-900">
                Datenschutz
              </h1>
              <p className="text-stone-400 font-bold uppercase tracking-widest text-xs mt-1">
                Transparenz & Sicherheit für Ihre Daten
              </p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none space-y-12">
            {/* Sektion 1: Verantwortlichkeit */}
            <section className="bg-white/50 backdrop-blur-sm border border-stone-200/50 p-8 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-stone-900 font-montserrat font-black uppercase tracking-wide">
                <FileText size={20} className="text-emerald-500" />
                <h2 className="text-xl m-0">1. Verantwortliche Stelle</h2>
              </div>
              <p className="text-stone-600 leading-relaxed font-medium">
                Verantwortlich für die Datenverarbeitung auf dieser Webseite ist:<br /><br />
                **Zahnarztpraxis Dr. Maria Schmidt**<br />
                Charlottenring 12, 40227 Düsseldorf<br />
                E-Mail: Dr.Schmidt@praxis.de
              </p>
            </section>

            {/* Sektion 2: Logfiles */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6 text-stone-900 border-l-4 border-emerald-500 pl-4">
                 <h2 className="text-2xl font-montserrat font-black uppercase tracking-wide">2. Server-Logfiles</h2>
              </div>
              <p className="text-stone-600 leading-relaxed font-medium">
                Beim Aufruf unserer Webseite werden automatisch Informationen durch Ihren Browser an unseren Server (Supabase/Host) übermittelt. Diese "Logfiles" umfassen:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-stone-500 font-medium list-disc pl-5">
                <li>IP-Adresse (anonymisiert)</li>
                <li>Datum und Uhrzeit der Abfrage</li>
                <li>Browsertyp und Betriebssystem</li>
                <li>Referrer URL (zuvor besuchte Seite)</li>
              </ul>
              <p className="text-[12px] text-stone-400 font-bold italic uppercase tracking-wider">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an Systemsicherheit).
              </p>
            </section>

            {/* Sektion 3: Datenerfassung & Zweck */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6 text-stone-900 border-l-4 border-emerald-500 pl-4">
                 <h2 className="text-2xl font-montserrat font-black uppercase tracking-wide">3. Zweckbindung & Speicherung</h2>
              </div>
              <p className="text-stone-600 leading-relaxed font-medium">
                Die Erfassung Ihrer Daten (Name, E-Mail, Telefon) erfolgt ausschließlich zur Abwicklung Ihrer Terminbuchungen.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-6 bg-stone-100/50 rounded-2xl border border-stone-200/30">
                    <h3 className="font-black text-stone-900 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                       <Lock size={14} className="text-stone-400" /> Speicherdauer
                    </h3>
                    <p className="text-[13px] text-stone-500 font-medium">Ihre Daten werden gelöscht, sobald der Zweck der Speicherung entfällt oder gesetzliche Aufbewahrungsfristen (z.B. ärztliche Dokumentationspflicht von 10 Jahren) abgelaufen sind.</p>
                 </div>
                 <div className="p-6 bg-stone-100/50 rounded-2xl border border-stone-200/30">
                    <h3 className="font-black text-stone-900 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                       <ShieldCheck size={14} className="text-stone-400" /> TLS-Verschlüsselung
                    </h3>
                    <p className="text-[13px] text-stone-500 font-medium">Zur Sicherheit nutzen wir eine TLS-Verschlüsselung (Transport Layer Security). Ihre Daten werden sicher und unlesbar für Dritte übertragen.</p>
                 </div>
              </div>
              <p className="text-[12px] text-stone-400 font-bold italic uppercase tracking-wider">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
              </p>
            </section>

            {/* Sektion 4: Cookies */}
            <section className="bg-stone-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 text-emerald-500">
                    <Globe size={24} />
                    <h2 className="text-xl font-montserrat font-black uppercase tracking-wide text-white">4. Cookies</h2>
                  </div>
                  <p className="text-stone-300 leading-relaxed font-medium mb-6">
                    Wir nutzen ausschließlich technisch notwendige Cookies zur Gewährleistung Ihres Loginstatus und Speicherung Ihrer Präferenzen. Es findet kein Tracking durch Drittanbieter statt.
                  </p>
               </div>
            </section>

            {/* Sektion 5: Betroffenenrechte */}
            <section className="border-t border-stone-200 pt-12">
              <h2 className="text-xl font-montserrat font-black uppercase tracking-wide mb-6 text-stone-900">5. Ihre Betroffenenrechte</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-stone-600 text-[13px] font-medium leading-relaxed">
                <div>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</div>
                <ul className="space-y-1 list-disc pl-5 text-stone-500">
                   <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                   <li>Recht auf Berichtigung oder Löschung</li>
                   <li>Recht auf Einschränkung der Verarbeitung</li>
                   <li>Beschwerderecht bei einer Aufsichtsbehörde</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-16 text-center">
             <button 
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 font-black uppercase tracking-[0.2em] text-[10px] bg-white px-6 py-3 rounded-full border border-stone-100 transition-all shadow-sm hover:shadow-md"
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
