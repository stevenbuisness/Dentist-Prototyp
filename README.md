# Dentist-Prototyp: Premium Dental Booking & Clinic Management

Willkommen im **Dentist-Prototyp** Projekt. Dies ist eine hochmoderne Webanwendung für eine Zahnarztpraxis, die auf ein erstklassiges Patientenerlebnis (User-Journey) und effizientes Klinik-Management (Admin-Dashboard) ausgelegt ist.

## 🚀 Technologie-Stack

Dieses Projekt nutzt einen modernen "State-of-the-art" Stack für maximale Performance und Skalierbarkeit:

### Frontend
- **Core:** [React 18](https://reactjs.org/) mit [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) - für extrem schnelle Entwicklungszyklen.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS für volle Design-Kontrolle.
- **UI-Komponenten:** [Shadcn UI](https://ui.shadcn.com/) - basierend auf Radix UI für barrierefreie, hochgradig anpassbare Komponenten.
- **Icons:** [Lucide React](https://lucide.dev/)
- **Monitoring:** [Sentry](https://sentry.io/) - integriertes Error-Tracking und Performance-Monitoring.

### Backend (In Planung/Umsetzung)
- **BaaS:** [Supabase](https://supabase.com/)
  - **Auth:** E-Mail/Passwort Authentifizierung.
  - **Database:** PostgreSQL mit Row Level Security (RLS).
  - **Storage:** Buckets für Medien und Nutzerdokumente.
  - **Edge Functions:** Deno-basierte Serverless Functions (z.B. für E-Mail-Versand).

## 📂 Architektur & Struktur

- `/src/screens`: Enthält die Hauptseiten (z.B. `DentalHomepage`, `PremiumLanding`).
- `/src/components`: Wiederverwendbare UI-Elemente und Layout-Komponenten.
- `/src/lib`: Konfigurationsdateien (z.B. Supabase-Client, Utilities).
- `IMPLEMENTATION_PLAN.md`: Der detaillierte Masterplan für die Backend-Integration.
- `IMPLEMENTATION_IMPROVEMENTS.md`: Checkliste für Weltklasse-UX und Design-Feinschliff.

## 🛠️ Entwicklung & Setup

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```
   Die App ist dann unter [http://localhost:5173/](http://localhost:5173/) erreichbar.

3. **Linting:**
   ```bash
   npm run lint
   ```

4. **Produktions-Build:**
   ```bash
   npm run build
   ```

## 📋 Wichtige Leitfäden für Entwickler
- **Branding:** Wir nutzen **Montserrat** für Headlines (Premium-Feel) und **Lato** für Fließtext (Lesbarkeit).
- **Design:** Wir streben ein "Weltklasse"-Design an. Nutze Glassmorphism (`backdrop-blur`), weiche Schatten und subtile Micro-Interactions.
- **Fehlerbehandlung:** Alle kritischen Fehler sollten via Sentry getrackt werden. Siehe auch `GITHUB_FEHLER_GUIDE.md` und `SENTRY_GUIDE.md`.

---
*Status: In aktiver Entwicklung. Ziel ist die Transformation vom statischen Prototyp zur voll vernetzten Klinik-Plattform.*
