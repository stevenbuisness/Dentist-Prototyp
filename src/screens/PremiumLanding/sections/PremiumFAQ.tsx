import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Was bedeutet 'evidenzbasierte Zahnmedizin'?",
    answer: "Evidenzbasierte Zahnmedizin bedeutet, dass wir unsere Behandlungsmethoden auf Basis der aktuellsten klinischen Studien und wissenschaftlichen Beweise auswählen, kombiniert mit unserer langjährigen Erfahrung und Ihren individuellen Bedürfnissen als Patient."
  },
  {
    question: "Wie läuft die erste Untersuchung in Ihrer Praxis ab?",
    answer: "Für Ihren ersten Termin nehmen wir uns besonders viel Zeit (ca. 45-60 Minuten). Wir führen eine umfassende Diagnostik durch, erstellen bei Bedarf digitale Scans und besprechen gemeinsam Ihre Wünsche sowie einen eventuellen Behandlungsplan – ganz ohne Zeitdruck."
  },
  {
    question: "Bieten Sie Behandlungen für Angstpatienten an?",
    answer: "Ja, die Betreuung von Angstpatienten gehört zu unseren Schwerpunkten. Wir setzen auf eine besonders ruhige Praxisatmosphäre, transparente Kommunikation über jeden Schritt und bieten auf Wunsch auch sanfte Sedierungsmöglichkeiten an."
  },
  {
    question: "Was sind die Vorteile von digitalen Abdrücken?",
    answer: "Statt klassischer Silikon-Abdruckmasse nutzen wir moderne Intraoralscanner. Das ist nicht nur wesentlich angenehmer und verhindert den Würgereiz, sondern liefert auch hochpräzise 3D-Daten für passgenaue Versorgungen."
  },
  {
    question: "Wie oft ist eine professionelle Zahnreinigung (PZR) sinnvoll?",
    answer: "In der Regel empfehlen wir eine PZR alle 6 Monate. Je nach individueller Zahngesundheit oder bei bestehender Parodontitis-Vorgeschichte können jedoch auch Intervalle von 3 bis 4 Monaten medizinisch sinnvoll sein."
  },
  {
    question: "Werden Implantat-Kosten von der Krankenkasse übernommen?",
    answer: "Zahnimplantate sind in der Regel eine Privatleistung, für die gesetzliche Krankenkassen jedoch Festzuschüsse zum Zahnersatz leisten. Wir erstellen Ihnen vorab einen detaillierten Heil- und Kostenplan für Ihre Unterlagen."
  },
  {
    question: "Wie lange halten Veneers oder Keramikkronen?",
    answer: "Moderne Keramikversorgungen sind extrem langlebig. Bei guter häuslicher Pflege und regelmäßiger professioneller Vorsorge können Veneers und Kronen problemlos 10 bis 15 Jahre oder deutlich länger halten."
  },
  {
    question: "Was tun bei einem zahnärztlichen Notfall am Wochenende?",
    answer: "Außerhalb unserer Sprechzeiten wenden Sie sich bitte an den offiziellen zahnärztlichen Notdienst Nordrhein / Düsseldorf. Die aktuelle Notdienstpraxis erfahren Sie unter der zentralen Ansagenummer 01805 / 98 67 00 oder auf der Website der Zahnärztekammer Nordrhein."
  },
  {
    question: "Sind Zahnaufhellungen (Bleaching) schädlich für den Zahnschmelz?",
    answer: "Nein, ein professionell durchgeführtes In-Office-Bleaching unter ärztlicher Aufsicht ist bei gesundem Gebiss unbedenklich. Wir verwenden moderne, schonende Gele, die den Zahnschmelz nicht angreifen, sondern lediglich Farbpigmente lösen."
  },
  {
    question: "Ist die Praxis barrierefrei zugänglich?",
    answer: "Ja, unsere Praxisräume sind vollständig barrierefrei gestaltet. Sowohl der Zugang zum Gebäude als auch die Behandlungszimmer und sanitären Anlagen sind für Patienten mit eingeschränkter Mobilität problemlos erreichbar."
  }
];

const FAQItemComponent = ({ item, index }: { item: FAQItem; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="border-b border-stone-200/60"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-8 text-left transition-colors hover:text-blue-600"
      >
        <span className="font-montserrat text-lg font-bold tracking-tight text-stone-900 md:text-xl">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-8 font-lato text-base leading-relaxed text-stone-600 md:text-lg lg:max-w-3xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const PremiumFAQ = (): JSX.Element => {
  return (
    <section id="faq" className="scroll-mt-28 bg-[#faf8f5] overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
          {/* Header */}
          <div className="lg:sticky lg:top-36 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 text-blue-600">
                <HelpCircle size={20} />
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em]">
                  Patientenfragen
                </p>
              </div>
              <h2 className="mt-6 font-montserrat text-4xl font-black leading-tight tracking-tighter text-stone-900 md:text-5xl">
                Antworten auf Ihre Fragen
              </h2>
              <div className="mt-8 h-px w-12 bg-blue-200" />
              <p className="mt-8 font-lato text-lg leading-relaxed text-stone-600">
                Wir legen Wert auf transparente Kommunikation. Hier finden Sie erste Antworten auf häufige Fragen. Für alles weitere stehen wir Ihnen gerne persönlich zur Verfügung.
              </p>
            </motion.div>
          </div>

          {/* List */}
          <div className="flex flex-col">
            {faqs.map((faq, index) => (
              <FAQItemComponent key={index} item={faq} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
