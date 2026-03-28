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
        <PatientTestimonialSection />
        <SiteFooterSection />
      </div>
    </div>
  );
};
