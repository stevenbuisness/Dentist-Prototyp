export const FamilyDentalOverviewSection = (): JSX.Element => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Left gradient background */}
      <div className="absolute top-0 left-0 w-[35%] h-[90%] bg-[linear-gradient(236deg,rgba(204,221,228,1)_0%,rgba(225,241,248,1)_100%)] opacity-50" />

      <div className="relative flex flex-row items-center w-full min-h-[760px] py-10">
        {/* Left image */}
        <div className="flex-shrink-0 w-[45%] flex items-center justify-center pl-16 pt-8">
          <img
            className="w-full max-w-[704px] h-auto object-cover rounded-lg shadow-xl"
            alt="Zahnarzt behandelt glückliches Kind"
            src="https://images.pexels.com/photos/3779697/pexels-photo-3779697.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
          />
        </div>

        {/* Right content */}
        <div className="flex flex-col flex-1 pl-16 pr-8 max-w-[640px]">
          {/* Heading */}
          <h2 className="[font-family:'Kollektif-Bold',Helvetica] font-bold text-[#282828] text-[64px] tracking-[-0.64px] leading-[normal] mb-8">
            Expertenpflege für die ganze Familie.
          </h2>

          {/* Description */}
          <p className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[0] leading-9 w-[560px] mb-10">
            Regelmäßige Kontrolluntersuchungen, professionelle Zahnreinigungen und umfassende Vorsorge sind das Fundament für lebenslange Zahngesundheit. Wir bieten das komplette Spektrum modernster Prophylaxe – von Fluoridbehandlungen über Versiegelungen bis hin zur Krebsfrüherkennung. Unsere Praxis steht für höchste medizinische Standards und individuelle Betreuung in angenehmer Atmosphäre.
          </p>

          {/* Action buttons row */}
          <div className="flex flex-row items-center gap-[55px]">
            {/* Read About the Team button */}
            <div className="relative w-[170px] h-10 flex-shrink-0 cursor-pointer group">
              <img
                className="absolute top-0 left-0 w-[168px] h-10"
                alt="Button"
                src="/button.svg"
              />
              <span className="absolute top-3.5 left-5 [font-family:'Kollektif-Bold',Helvetica] font-bold text-white text-[10px] text-center tracking-[0.70px] leading-[normal] whitespace-nowrap">
                UNSER TEAM KENNENLERNEN
              </span>
            </div>

            {/* Learn More link */}
            <div className="relative w-[95px] h-[23px] flex-shrink-0 cursor-pointer group">
              <div className="absolute top-0 left-px w-[91px] h-[23px] border-b-2 border-solid border-[#7DC9E8] group-hover:border-[#6AB8D7] transition-colors" />
              <span className="absolute top-1.5 left-0 [font-family:'Kollektif-Bold',Helvetica] font-bold text-[#7DC9E8] text-[10px] text-center tracking-[0.70px] leading-[normal] whitespace-nowrap group-hover:text-[#6AB8D7] transition-colors">
                MEHR ERFAHREN
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
