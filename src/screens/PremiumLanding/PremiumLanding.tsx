import { useEffect } from "react";
import { PremiumFooter } from "./sections/PremiumFooter";
import { PremiumHero } from "./sections/PremiumHero";
import { PremiumOrientierung } from "./sections/PremiumOrientierung";
import { PremiumServices } from "./sections/PremiumServices";
import { PremiumTeam } from "./sections/PremiumTeam";
import { PremiumTrustSection } from "./sections/PremiumTrustSection";
import { PremiumTrustTransition } from "./sections/PremiumTrustTransition";
import { PremiumNavigation } from "./sections/PremiumNavigation";

export const PremiumLanding = (): JSX.Element => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small timeout to ensure components are ready and heights are calculated
      const timer = setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 antialiased">
      <PremiumNavigation />
      <main className="pt-[4.5rem]">
        <PremiumHero />
        <PremiumOrientierung />
        <PremiumServices />
        <PremiumTeam />
        <PremiumTrustTransition />
        <PremiumTrustSection />
        <PremiumFooter />
      </main>
    </div>
  );
};
