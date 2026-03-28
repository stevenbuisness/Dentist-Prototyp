export const PatientTestimonialSection = (): JSX.Element => {
  return (
    <section id="patienten" className="relative w-full h-[944px] overflow-hidden">
      {/* Right portrait image - man with beard */}
      <img
        className="absolute top-0 left-[calc(60%+10px)] w-[560px] h-[688px] object-cover"
        alt="Zufriedener Patient"
        src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
      />

      {/* Left portrait image - woman */}
      <img
        className="absolute top-36 left-[46px] w-[560px] h-[800px] object-cover"
        alt="Glückliche Patientin"
        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
      />

      {/* "Be featured. #happysmile" heading */}
      <div className="absolute top-16 left-[44%] w-[640px] [font-family:'Kollektif-Bold',Helvetica] font-bold text-transparent text-[64px] tracking-[-0.64px] leading-[normal]">
        <span className="text-[#282828] tracking-[-0.41px]">
          Zeigen Sie Ihr
          <br />
        </span>
        <span className="text-[#5ba3bb] tracking-[-0.41px]">#traumlächeln</span>
      </div>

      {/* Overlay content layer */}
      <div className="absolute top-4 left-0 w-full h-[923px]">
        {/* Attribution - Anna Marie */}
        <div className="absolute top-[842px] left-[86%] [font-family:'Kollektif-Italic',Helvetica] font-normal italic text-[#1e1e1e] text-[23px] tracking-[0] leading-[46px] whitespace-nowrap">
          ~ Anna M.
        </div>

        {/* Rotated social handle - @marcopolono (right side) */}
        <div className="absolute top-[51px] right-[0px] -rotate-90 origin-center [font-family:'Kollektif-Italic',Helvetica] font-normal italic text-[#1e1e1e] text-[23px] tracking-[0] leading-[46px] whitespace-nowrap">
          @max_mueller
        </div>

        {/* Rotated social handle - @lisamaria.99 (left side) */}
        <div className="absolute top-[820px] left-[-46px] -rotate-90 origin-center [font-family:'Kollektif-Italic',Helvetica] font-normal italic text-[#1e1e1e] text-[23px] tracking-[0] leading-[46px] whitespace-nowrap">
          @lisa.schmidt
        </div>

        {/* Large decorative quotation mark */}
        <div className="absolute top-[656px] left-[48%] [font-family:'Playfair_Display',Helvetica] font-normal text-[#e0f1f7] text-[200px] tracking-[0] leading-[normal]">
          &quot;
        </div>

        {/* Testimonial quote */}
        <div className="absolute top-[748px] left-[52%] w-[664px] [font-family:'Playfair_Display',Helvetica] font-normal italic text-[#5ba3bb] text-[35px] tracking-[0] leading-[46px]">
          Dr. Schmidt ist fantastisch! Die Behandlung verlief perfekt und jetzt strahlt mein Lächeln. Vielen Dank!
        </div>
      </div>
    </section>
  );
};
