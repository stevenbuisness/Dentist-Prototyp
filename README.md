# 🦷 Dentist-Prototyp: Premium Clinic Management & Patient Experience

![Status](https://img.shields.io/badge/status-production--ready-emerald?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20|%20Supabase%20|%20Tailwind-blue?style=flat-square)
![Design](https://img.shields.io/badge/design-Premium%20Stone-stone?style=flat-square)

Eine hochgradig spezialisierte Webanwendung für moderne Zahnarztpraxen, die exzellente Ästhetik mit maximaler funktionaler Effizienz verbindet. Entwickelt für ein unvergleichliches Patientenerlebnis und eine reibungslose Praxisverwaltung.

---

## ✨ Die Highlights der Plattform

### 🧖 Patient Experience (User Journey)
*   **Intuitiver Buchungs-Wizard:** Ein flüssiger 4-Stufen-Prozess, der Patienten sicher durch die Terminwahl führt.
*   **Echtzeit-Verfügbarkeit:** Automatische Slot-Berechnung basierend auf Praxiszeiten und "Lunch-Break-Protection" (12:00–13:00 Uhr).
*   **Personalisiertes Dashboard:** Patienten verwalten ihre Termine, sehen Status-Updates und unterliegen einer strikten 24h-Stornierungslogik.
*   **Premium Design:** Nutzung einer harmonisierten Stone-Palette, Montserrat-Headlines für Eleganz und Lato für optimale Lesbarkeit.

### 🛡️ Clinic Management (Admin Dashboard)
*   **Zentrale Terminverwaltung:** Volle Kontrolle über Buchungen, Patientendaten und Schichtpläne in einer hochperformanten Oberfläche.
*   **Real-time Activity Feed:** Lückenlose Überwachung aller System-Interaktionen mit rollenbasierter Protokollierung.
*   **Intelligente Slot-Logik:** Automatischer Schutz vor Doppelbuchungen und Konflikten während der Mittagspause.
*   **Audit-Log-Integrität:** Jede Aktion wird mit Zeitstempel und Benutzerrolle revisionssicher dokumentiert.

## 🚀 Technologie-Stack

Dieses Projekt nutzt einen modernen "State-of-the-art" Stack für maximale Performance:

- **Frontend:** [React 18](https://reactjs.org/) mit [TypeScript](https://www.typescriptlang.org/) & [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) für barrierefreie High-End-Komponenten.
- **Backend (BaaS):** [Supabase](https://supabase.com/) (PostgreSQL mit Row Level Security, Real-time Subscription).
- **Monitoring:** [Sentry](https://sentry.io/) — Integriertes Error-Tracking für absolute Stabilität.

## 📂 Architektur & Struktur

```text
├── src/
│   ├── components/  # Wiederverwendbare Premium-UI-Module
│   ├── pages/       # Dashboard & Admin-Ansichten
│   ├── screens/     # Landing-Page & Teilsysteme
│   ├── lib/         # Supabase-Client & Business-Logik
│   └── hooks/       # Custom React Hooks für State-Management
├── Implementation/  # Detaillierte Roadmap & Planungsdokumente
└── MARKENSTIL_GUIDE  # Vorgaben für das visuelle Erscheinungsbild
```

## 🛠️ Entwicklung & Setup

1. **Umgebung konfigurieren:**
   Erstellen Sie eine `.env`-Datei im Root-Verzeichnis mit Ihren Supabase-Anmeldedaten:
   ```env
   VITE_SUPABASE_URL=Ihre_URL
   VITE_SUPABASE_ANON_KEY=Ihr_Key
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Entwicklungsmodus:**
   ```bash
   npm run dev
   ```

4. **Produktions-Build:**
   ```bash
   npm run build
   ```

---
*Status: Produktion-Bereit. Dieser Prototyp definiert den Standard für digitale Patientenkommunikation neu.*
