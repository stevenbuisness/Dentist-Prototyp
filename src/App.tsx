import { Route, Routes } from "react-router-dom";
import { DentalHomepage } from "./screens/DentalHomepage";
import { PremiumLanding } from "./screens/PremiumLanding";
import * as Sentry from "@sentry/react";

export const App = (): JSX.Element => {
  return (
    <>
      {/* Sentry Test Button für manuelles Capture */}
      <button 
        onClick={() => { 
          const uniqueId = new Date().getTime();
          console.log(`Sende neuen, einzigartigen Fehler an Sentry (ID: ${uniqueId})...`);
          Sentry.captureException(new Error(`Neu generierter Sentry Test Fehler: ${uniqueId} 📧🐞`));
          alert(`Einzigartiger Test-Fehler (${uniqueId}) wurde an Sentry gesendet!`);
        }}
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, padding: '10px', background: 'blue', color: 'white', borderRadius: '5px' }}
      >
        Neuen einzigartigen Fehler auslösen 🐞
      </button>

      <Routes>
        <Route path="/" element={<PremiumLanding />} />
        <Route path="/old" element={<DentalHomepage />} />
      </Routes>
    </>
  );
};
