import { Helmet } from "react-helmet-async";

export const StructuredData = () => {
  const baseUrl = window.location.origin;
  const practiceSchema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Zahnarztpraxis Dr. Maria Schmidt",
    "image": `${baseUrl}/og-image.png`,
    "@id": baseUrl,
    "url": baseUrl,
    "telephone": "0211 1593 482",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Charlottenring 12",
      "addressLocality": "Düsseldorf",
      "postalCode": "40227",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.2217,
      "longitude": 6.7762
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.instagram.com/zahnarztpraxis.schmidt",
      "https://www.linkedin.com/company/zahnarztpraxis-schmidt"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Was bedeutet 'evidenzbasierte Zahnmedizin'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evidenzbasierte Zahnmedizin bedeutet, dass wir unsere Behandlungsmethoden auf Basis der aktuellsten klinischen Studien und wissenschaftlichen Beweise auswählen, kombiniert mit unserer langjährigen Erfahrung und Ihren individuellen Bedürfnissen als Patient."
        }
      },
      {
        "@type": "Question",
        "name": "Wie läuft die erste Untersuchung in Ihrer Praxis ab?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Für Ihren ersten Termin nehmen wir uns besonders viel Zeit. Wir führen eine umfassende Diagnostik durch, erstellen bei Bedarf digitale Scans und besprechen gemeinsam Ihre Wünsche sowie einen eventuellen Behandlungsplan – ganz ohne Zeitdruck."
        }
      },
      {
        "@type": "Question",
        "name": "Bieten Sie Behandlungen für Angstpatienten an?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, die Betreuung von Angstpatienten gehört zu unseren Schwerpunkten. Wir setzen auf eine besonders ruhige Praxisatmosphäre, transparente Kommunikation über jeden Schritt und bieten auf Wunsch auch sanfte Sedierungsmöglichkeiten an."
        }
      },
      {
        "@type": "Question",
        "name": "Was sind die Vorteile von digitalen Abdrücken?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Statt klassischer Silikon-Abdruckmasse nutzen wir moderne Intraoralscanner. Das ist wesentlich angenehmer, verhindert den Würgereiz und liefert hochpräzise 3D-Daten."
        }
      },
      {
        "@type": "Question",
        "name": "Wie oft ist eine professionelle Zahnreinigung (PZR) sinnvoll?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In der Regel empfehlen wir eine PZR alle 6 Monate. Je nach individueller Zahngesundheit können jedoch auch kürzere Intervalle medizinisch sinnvoll sein."
        }
      },
      {
        "@type": "Question",
        "name": "Werden Implantat-Kosten von der Krankenkasse übernommen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Zahnimplantate sind in der Regel eine Privatleistung, für die gesetzliche Krankenkassen jedoch Festzuschüsse zum Zahnersatz leisten."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange halten Veneers oder Keramikkronen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bei guter Pflege und regelmäßiger Vorsorge können Veneers und Kronen problemlos 10 bis 15 Jahre oder deutlich länger halten."
        }
      },
      {
        "@type": "Question",
        "name": "Was tun bei einem zahnärztlichen Notfall am Wochenende?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Außerhalb unserer Sprechzeiten wenden Sie sich bitte an den offiziellen zahnärztlichen Notdienst Nordrhein / Düsseldorf unter der Nummer 01805 / 98 67 00."
        }
      },
      {
        "@type": "Question",
        "name": "Sind Zahnaufhellungen (Bleaching) schädlich für den Zahnschmelz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Professionell durchgeführtes Bleaching unter ärztlicher Aufsicht ist sicher und schont die Zahnsubstanz."
        }
      },
      {
        "@type": "Question",
        "name": "Ist die Praxis barrierefrei zugänglich?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, unsere Praxisräume sind vollständig barrierefrei gestaltet und für Patienten mit eingeschränkter Mobilität problemlos erreichbar."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(practiceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};
