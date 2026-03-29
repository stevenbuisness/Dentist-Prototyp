import { Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { DentalHomepage } from "./screens/DentalHomepage";
import { PremiumLanding } from "./screens/PremiumLanding";

export const App = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PremiumLanding />} />
        <Route path="/old" element={<DentalHomepage />} />
      </Routes>
      <Analytics />
    </>
  );
};
