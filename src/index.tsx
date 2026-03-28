import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DentalHomepage } from "./screens/DentalHomepage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <DentalHomepage />
  </StrictMode>,
);
