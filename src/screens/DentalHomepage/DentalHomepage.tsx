import { Navigation } from "../../components/Navigation";
import { ClinicianProfileSection } from "./sections/ClinicianProfileSection";
import { FamilyDentalOverviewSection } from "./sections/FamilyDentalOverviewSection";
import { HeroWelcomeSection } from "./sections/HeroWelcomeSection";
import { PatientTestimonialSection } from "./sections/PatientTestimonialSection";
import { ServiceHighlightsSection } from "./sections/ServiceHighlightsSection";
import { SiteFooterSection } from "./sections/SiteFooterSection";

export const DentalHomepage = (): JSX.Element => {
  return (
    <div className="bg-white overflow-hidden w-full min-w-[1840px] relative flex flex-col">
      <Navigation />
      <div className="pt-20">
        <HeroWelcomeSection />
        <FamilyDentalOverviewSection />
        <ServiceHighlightsSection />
        <ClinicianProfileSection />
        <div
          className="w-full bg-gradient-to-b from-white via-[#f5f9fb] to-[#e8f2f6] py-14"
          aria-hidden
        >
          <div className="mx-auto max-w-[1427px] px-8 text-center">
            <p className="[font-family:'Kollektif-Regular',Helvetica] text-xs uppercase tracking-[0.35em] text-[#6b7d85]">
              Qualität &amp; Nachvollziehbarkeit
            </p>
            <p className="mx-auto mt-4 max-w-2xl [font-family:'Kollektif-Regular',Helvetica] text-base leading-relaxed text-[#5a656b]">
              Der folgende Abschnitt fasst Prüfkriterien zusammen — ohne
              Werbeversprechen, mit Fokus auf dokumentierte Abläufe.
            </p>
          </div>
          <div className="mx-auto mt-10 h-px max-w-[720px] bg-gradient-to-r from-transparent via-[#5ba3bb]/40 to-transparent" />
        </div>
        <PatientTestimonialSection />
        <SiteFooterSection />
      </div>
    </div>
  );
};
