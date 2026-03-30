# Backend- & Dashboard-Implementierungsplan (Zahnarzt-App)

Dieser Plan beschreibt die schrittweise Integration eines vollständigen Backends und Web-Dashboards unter Verwendung von **Supabase** (Authentifizierung, Datenbank, Edge Functions, Storage) in die bestehende Anwendung.

## 1. Technologie-Stack & Architektur

*   **Backend & Datenbank:** Supabase (PostgreSQL)
*   **Authentifizierung:** Supabase Auth (E-Mail/Passwort)
*   **Media-Speicher:** Supabase Storage Buckets
*   **Frontend-Framework:** React (Vite) / Next.js (bisheriges Setup wird beibehalten)
*   **UI/UX:** Shadcn UI Komponenten, reguläres Tailwind CSS
*   **Zustandsverwaltung:** React Query / Zustand (für Server- bzw. Client-State)
*   **Routing:** React Router (oder Next.js App Router) mit eindeutigen Slugs

## 2. Umgebungsvariablen (.env)

Folgende Variablen müssen in der `.env` Datei im Root-Verzeichnis konfiguriert werden. Eine `.env.example` sollte für das Team bereitgestellt werden.

```bash
# Supabase Konfiguration
VITE_SUPABASE_URL=https://kzidkdoeddckfmaamgdj.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Sentry (für Error Tracking)
VITE_SENTRY_DSN=your-sentry-dsn-here

# App Einstellungen
VITE_APP_NAME="Dentist Prototyp"
VITE_APP_URL=http://localhost:5173
```

> [!IMPORTANT]
> Die `.env` Datei ist bereits in der `.gitignore` enthalten und darf niemals in das Repository gepusht werden.

## 3. Sicherheits-Best-Practices (Sicherheit & Compliance)

Um die Patientendaten zu schützen und Weltklasse-Standards zu erfüllen, gelten folgende Sicherheitsvorgaben:

*   **Key-Separation:**
    *   **`anon_key`:** Wird ausschließlich im Frontend verwendet. Er unterliegt den RLS-Regeln der Datenbank.
    *   **`service_role_key`:** Darf **NIEMALS** im Frontend (`VITE_...`) oder in Git-Repositories auftauchen. Er ist exklusiv für serverseitige Aufgaben (Edge Functions, Admin-Skripte) reserviert.
*   **Row Level Security (RLS):**
    *   Jede neue Tabelle in Supabase muss mit aktiviertem RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) erstellt werden.
    *   Keine Tabelle darf anonymen Schreibzugriff ohne Authentifizierung haben.
*   **API-Sicherheit:**
    *   Supabase Edge Functions müssen so konfiguriert werden, dass sie nur mit validem JWT (JSON Web Token) oder geheimen Schlüsseln aufgerufen werden können.
*   **Audit-Logs:**
    *   Jeder schreibende Zugriff auf Patientendaten muss über die Historien-Tabellen (Postgres Trigger) unveränderlich protokolliert werden.

## 4. Branding & UI/UX Leitfaden

Um konsistent zur bestehenden Startseite zu bleiben und das "Premium"-Gefühl der Marke aufrechtzuerhalten, gelten folgende Richtlinien:

*   **Typografie:**
    *   Überschriften und hervorgehobene UI-Elemente: **Montserrat**
    *   Fließtext und Daten-Tabellen: **Lato**
*   **Farbpalette (aus `tailwind.config.js`):**
    *   Verwendung der HSL-Variablen (`hsl(var(--primary))`, `--secondary`, `--accent`, etc.).
    *   Ruhige, vertrauenserweckende Tonalität (typisch für den medizinischen Bereich), gestützt auf dunklere Akzente und klare Kontraste.
*   **Komponenten-Design (Shadcn UI Referenz):**
    *   **Seitenstruktur:** Eindeutige URLs/Slugs für alle Hauptfunktionen (keine riesigen Modal-Fenster für große Formulare!).
    *   **Modals/Dialoge:** Nur für destruktive Aktionen (Löschen-Bestätigung) oder sehr kleine Anpassungen (z.B. ein einzelnes Statusfeld ändern).
    *   **Benachrichtigungen:** Toast-Meldungen (über Shadcn's `useToast`) platziert **oben rechts** (`top-right`).
    *   **Formulare:** Klare Fehlermeldungen, Ladeindikatoren bei Submits und gut strukturierte Grid-Layouts.

## 5. Datenbank-Design (Supabase)

Wir verwenden Row Level Security (RLS) in Supabase, um sicherzustellen, dass Nutzer nur ihre eigenen Daten sehen und bearbeiten können.

### 5.1. Tabellen-Übersicht

1.  **`users` (Erweitert das Supabase `auth.users`):**
    *   `id` (PK, referenziert `auth.users`)
    *   `role` (Immer "user" - Administratoren werden über eine feste Liste oder eine separate `admin_roles`-Tabelle definiert, um Sicherheit zu gewährleisten)
    *   `status` (Enum: `active`, `blocked`, `rejected`)
    *   `first_name`, `last_name`, `date_of_birth`
    *   `phone_number`, `address_line_1`, `post_code`, `city`
2.  **`session_types` (Kategorien von Behandlungen):**
    *   `id`, `name`, `description`, `base_price`, `default_duration_minutes`
3.  **`sessions` (Spezifische Zeitschlitze / Termine):**
    *   `id`, `session_type_id` (FK)
    *   `title`, `description`
    *   `start_time`, `end_time` (Dauer ergibt sich dynamisch aus dem gewählten `session_type`)
    *   `max_slots` (Maximale Kapazität)
    *   `price` (Überschreibt ggf. base_price)
    *   `cancellation_reason`, `cancellation_time` (Falls abgesagt)
    *   `booking_status` (Enum: `open`, `fully_booked`, `canceled`, `completed`)
4.  **`bookings`:**
    *   `id`, `user_id` (FK), `session_id` (FK)
    *   `status` (Enum: `confirmed`, `canceled_by_user`, `canceled_by_admin`, `attended`, `no_show`)
    *   `booking_time`
    *   `notes`
5.  **`availability_rules`:**
    *   Regeln für den generellen Kalender (z.B. "Jeden Montag 08:00 - 16:00 geöffnet").
6.  **`availability_exceptions`:**
    *   Ausnahmen (Urlaub, Feiertage, Krankheit).

### 5.2. Historien-Tabellen (Audit Logs)

1.  **`login_history`:** Speichert `user_id`, `login_time`, `ip_address`, `device_info`.
2.  **`session_history`:** Speichert jede Änderung an einer `session` (`session_id`, `changed_by`, `change_type`, `old_values`, `new_values`, `timestamp`).
3.  **`booking_history`:** Protokolliert Statuswechsel von Buchungen.
4.  *Vorgeschlagen:* **`user_action_history`:** Ein allgemeines Audit-Log für Administratoren (z.B. "Admin X hat User Y blockiert").

## 6. Seitenstruktur & Routing

### 6.1. Allgemeine Seiten (Öffentlich / Auth)
*   `/login`: Anmeldung (Email & Passwort)
*   `/register`: Registrierung (Nach erfolgreicher Registrierung sind Accounts automatisch `active` und Anwender können direkt buchen.)
*   `/logout`: Abmelde-Route
*   `/unauthorized`: Fehlerseite für fehlende Berechtigungen

### 6.2. Administrator-Seiten (`/admin/...`)
*   `/admin/dashboard`: Übersicht (Heutige Termine, anstehende Buchungen, offene Freigaben).
*   `/admin/sessions`: Listenansicht aller Sitzungen.
    *   `/admin/sessions/create`: Neue Sitzung anlegen.
    *   `/admin/sessions/[id]/edit`: Sitzung bearbeiten.
*   `/admin/session-types`: Verwaltung der Behandlungstypen.
*   `/admin/calendar`: Kalenderansicht zur Verwaltung von Verfügbarkeitsregeln und Ausnahmen.
*   `/admin/bookings`: Buchungsverwaltung (Liste, Filter nach Status).
    *   `/admin/bookings/[id]`: Detailansicht einer Buchung.
*   `/admin/clients`: Kundenverwaltung (mit Möglichkeit Nutzer zu blockieren/abzulehnen).
    *   `/admin/clients/[id]`: Kundenprofil, Historie und Notizen.
*   `/admin/reports`: Auswertungen (Login-Historie, Buchungshistorien, Umsatzschätzung bei Barzahlung).
*   `/admin/settings`: Allgemeine Praxis-Einstellungen.

### 6.3. Kunden-Seiten (`/dashboard/...`)
*   `/dashboard`: Benutzer-Overview (Kommende Termine, letzte Aktivitäten).
*   `/dashboard/profile`: Profilverwaltung (Kontaktdaten und Adressfelder, Passwort ändern).
*   `/dashboard/bookings`: Historie und Verwaltung eigener Buchungen.
    *   `/dashboard/bookings/[id]`: Buchungsdetails (Termine können hier bis **24 Stunden vor Beginn** online storniert werden).

## 7. Implementierungs-Schritte (Vorgehensplan)

1.  **Phase 1: Setup, Datenbank & Authentifizierung** (✅ ABGESCHLOSSEN - 30.03.2024)
    *   [x] Supabase-Projekt initialisieren und `.env` anlegen.
    *   [x] **Priorität:** Erstellung ALLER Datenbanktabellen (`users`, `sessions`, `session_types`, `bookings`, `availability_rules`, `history`).
    *   [x] Einrichtung der Postgres-Trigger für den automatischen User-Sync.
    *   [x] Implementierung der Login/Register-Seiten.
    *   [x] Erstellung von Dashboard-Mockups (Patient & Admin) zur Überprüfung der Authentifizierung und Rollen.
    *   [x] Einrichtung der Zugangskontrollen (Protected Routes).
2.  **Phase 2: UI-Grundgerüst & Branding** (🚧 IN ARBEIT)
    *   [x] Seitliche Sidebar / Topbar Navigation für Dashboards implementieren (Premium Admin Layout).
    *   [x] Shadcn-Komponenten für Formulare, Tabellen und Toasts (oben-rechts) konfigurieren.
    *   [ ] Layout-Optimierungen & Feinschliff (Logo-Integration, Dashboard-Details).
3.  **Phase 3: Datenbank & Kernfunktionen (Backend-Fokus)** (🚧 IN ARBEIT)
    *   [x] Migrationen/Scripte für Tabellen (`sessions`, `session_types`, `bookings`) in Supabase angelegt.
    *   [ ] RLS (Row Level Security) Policys finalisieren (Admins haben bereits Zugriff).
4.  **Phase 4: Admin-Dashboard** (✅ ABGESCHLOSSEN - 30.03.2024)
    *   [x] Patientenverwaltung (Basisliste in Bookings integriert).
    *   [x] Sitzungsverwaltung (CRUD Seiten für Termine und Typen abgeschlossen).
    *   [x] Buchungsverwaltung (Bestätigen/Stornieren / Status-Management).
5.  **Phase 5: User-Dashboard & Buchungsfluss**
    *   Ansicht und Verwaltung der eigenen Buchungen (`/dashboard/bookings`).
    *   Frontend-Buchungsfluss mit der Verfügbarkeitslogik (Regeln & Ausnahmen) verknüpfen.
6.  **Phase 6: Logging & Historie**
    *   Anbindung der Historien (Login, Sessions, Buchungen). Wie abgestimmt, geschieht dies sicher auf Datenbankebene über native **Postgres-Trigger** in Supabase, um eine lückenlose und fehlerfreie Historie zu gewährleisten.
7.  **Phase 7: Testen & Polish**
    *   Durchspielen von Edge-Cases (Stornierung zu spät, Überbuchung).
    *   Sentry Exceptions kontrollieren.
