// Service cards data
const services = [
  { number: "01.", title: "Prophylaxe & Vorsorge" },
  { number: "02.", title: "Zahnerhaltung" },
  { number: "03.", title: "Ästhetische Zahnmedizin" },
];

export const HeroWelcomeSection = (): JSX.Element => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "808px" }}
    >
      {/* Background visual image positioned to the right */}
      <img
        className="absolute top-0 right-0 h-full w-auto max-w-none object-cover"
        style={{ width: "68%", top: "53px" }}
        alt="Moderne Zahnarztpraxis"
        src="https://images.pexels.com/photos/3779705/pexels-photo-3779705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
      />

      {/* Hero headline */}
      <div
        className="relative z-10 [font-family:'Kollektif-Bold',Helvetica] font-bold text-transparent leading-[1.1]"
        style={{
          fontSize: "clamp(48px, 6vw, 96px)",
          marginTop: "195px",
          lineHeight: "96px",
        }}
      >
        <span className="text-[#282828] tracking-[0]">
          Schenken Sie sich
          <br />
          ein wunderschönes,
          <br />
        </span>
        <span className="text-[#7DC9E8] tracking-[-0.92px]">strahlendes </span>
        <span className="text-[#282828] tracking-[0]">Lächeln.</span>
      </div>

      {/* Services bar */}
      <div
        className="relative z-10 flex flex-row items-start bg-white shadow-lg"
        style={{
          marginTop: "40px",
          width: "848px",
          height: "136px",
          maxWidth: "100%",
        }}
      >
        {services.map((service, index) => (
          <div
            key={service.number}
            className="relative flex flex-col justify-start"
            style={{
              marginTop: "19px",
              marginLeft: index === 0 ? "15px" : index === 1 ? "98px" : "115px",
              width: index === 2 ? "262px" : "174px",
              height: "109px",
            }}
          >
            {/* Number */}
            <span className="[font-family:'Kollektif-Bold',Helvetica] font-bold text-[#7DC9E8] text-2xl tracking-[-0.24px] leading-normal">
              {service.number}
            </span>

            {/* Title */}
            <span className="mt-[9px] [font-family:'Kollektif-Regular',Helvetica] font-normal text-black text-[21px] tracking-[0.63px] leading-normal">
              {service.title}
            </span>

            {/* Learn More with arrow */}
            <div className="flex flex-row items-center mt-[9px] gap-2 cursor-pointer group">
              <span className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-normal group-hover:text-[#7DC9E8] transition-colors">
                Mehr erfahren
              </span>
              <img className="w-2.5 h-[7px]" alt="Arrow" src="/arrow.svg" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
