import { Card, CardContent } from "../../../../components/ui/card";

// Service data for the 6 highlight items
const services = [
  {
    icon: "/icon.png",
    alt: "Icon",
    title: "Prophylaxe & Vorsorge",
    description:
      "Regelmäßige Kontrollen und Fluoridbehandlungen zur Vorbeugung von Karies und Parodontitis.",
  },
  {
    icon: "/icon-1.png",
    alt: "Icon",
    title: "Zahnerhaltung",
    description:
      "Füllungen, Kronen, Brücken und Prothesen für dauerhafte Zahngesundheit und Funktion.",
  },
  {
    icon: "/icon-2.png",
    alt: "Icon",
    title: "Kieferorthopädie",
    description:
      "Zahnspangen und unsichtbare Aligner für gerade Zähne und optimalen Biss.",
  },
  {
    icon: "/icon-3.png",
    alt: "Icon",
    title: "Oralchirurgie",
    description:
      "Schonende Extraktionen, Weisheitszahn-OP und weitere chirurgische Eingriffe.",
  },
  {
    icon: "/icon-4.png",
    alt: "Icon",
    title: "Ästhetische Zahnmedizin",
    description:
      "Bleaching, Veneers und weitere Behandlungen für Ihr perfektes Lächeln.",
  },
  {
    icon: "/4-1.png",
    alt: "Element",
    title: "Zahnimplantate",
    description:
      "Hochwertige Implantate als dauerhafte und natürliche Lösung für fehlende Zähne.",
  },
];

export const ServiceHighlightsSection = (): JSX.Element => {
  return (
    <section id="leistungen" className="relative w-full py-16 px-8 bg-[linear-gradient(236deg,rgba(204,221,228,1)_0%,rgba(225,241,248,1)_100%)] opacity-90">
      {/* Inner content wrapper */}
      <div className="flex flex-row items-start gap-12 w-full">
        {/* Left: Heading */}
        <div className="flex-shrink-0 w-[280px] pt-4">
          <h2 className="[font-family:'Kollektif-Bold',Helvetica] font-bold text-[#282828] text-[40px] tracking-[-0.64px] leading-tight">
            Alles, was Sie brauchen – an einem Ort.
          </h2>
        </div>

        {/* Right: 2x3 grid of service items */}
        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-x-10 gap-y-10">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-transparent border-none shadow-none"
            >
              <CardContent className="p-0 flex flex-col">
                {/* Icon */}
                <img
                  className="w-10 h-10 object-cover"
                  alt={service.alt}
                  src={service.icon}
                />
                {/* Title */}
                <p className="mt-4 [font-family:'Kollektif-Regular',Helvetica] font-normal text-black text-[21px] tracking-[0.63px] leading-normal whitespace-nowrap">
                  {service.title}
                </p>
                {/* Description */}
                <p className="mt-3 [font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-9">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
