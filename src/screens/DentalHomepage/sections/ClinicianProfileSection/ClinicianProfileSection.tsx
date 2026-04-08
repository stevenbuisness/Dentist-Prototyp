export const ClinicianProfileSection = (): JSX.Element => {
  return (
    <section id="team" className="w-full py-8 px-4">
      <div className="flex flex-row items-center gap-0 max-w-[1427px] mx-auto">
        {/* Left: Image with decorative border */}
        <div className="relative flex-shrink-0 w-[560px] h-[688px]">
          {/* Decorative offset border */}
          <div className="absolute top-8 left-8 w-[560px] h-[688px] border border-solid border-[#7DC9E8] rotate-180 opacity-50" />
          {/* Doctor image */}
          <img
            className="absolute top-0 left-0 w-[560px] h-[688px] object-cover"
            alt="Dr. Schmidt - Ihr Zahnarzt"
            src="https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
          />
        </div>

        {/* Right: Text content */}
        <div className="flex flex-col justify-center pl-[223px] flex-1">
          <h2 className="w-[640px] [font-family:'Kollektif-Bold',Helvetica] font-bold text-[#282828] text-[64px] tracking-[-0.64px] leading-[normal] mb-6">
            Profis, denen Sie vertrauen können. Garantiert.
          </h2>

          <p className="w-[560px] [font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[0] leading-9 mb-[171px]">
            Dr. Schmidt ist ein renommierter Zahnarzt mit umfassender Expertise in allen Bereichen der modernen Zahnmedizin. Mit über 15 Jahren Erfahrung und kontinuierlicher Weiterbildung garantieren wir jedem Patienten eine individuelle und erstklassige Behandlung auf höchstem Niveau.
          </p>

          {/* Button */}
          <div className="relative w-[218px] h-10 cursor-pointer group">
            <img
              className="absolute top-0 left-0 w-[216px] h-10"
              alt="Button"
              src="/button.svg"
            />
            <div className="absolute top-3.5 left-1.5 w-[201px] [font-family:'Kollektif-Bold',Helvetica] font-bold text-white text-[10px] text-center tracking-[0.70px] leading-[normal]">
              MEHR ÜBER DR. SCHMIDT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
