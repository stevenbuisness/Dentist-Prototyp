# Phase 1: Setup & Authentifizierung

Diese Phase bildet das Fundament der Anwendung. Wir richten Supabase ein, konfigurieren die Authentifizierung und erstellen die grundlegende Benutzerverwaltung.

## 📋 Aufgabenliste

### 1.1 Supabase Infrastruktur
- [ ] Supabase Projekt erstellen
- [ ] `.env` Datei lokal konfigurieren (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Supabase Client in `src/lib/supabase.ts` initialisieren

### 1.2 Datenbank & Auth-Sync
- [ ] Tabelle `public.users` erstellen (mit Feldern für Profilinformationen)
- [ ] Postgres-Trigger einrichten: Automatischer Sync von `auth.users` -> `public.users`
- [ ] RLS (Row Level Security) für `users` Tabelle aktivieren und Policies definieren

### 1.3 Authentifizierung-Logik (Frontend)
- [ ] Authentifizierungs-Context/Hook (`useAuth`) erstellen
- [ ] Login-Funktion implementieren
- [ ] Registrierungs-Funktion implementieren (inkl. zusätzliche Profilfelder)

### 1.4 UI & Routing
- [ ] Login-Seite (`/login`) erstellen (Shadcn UI)
- [ ] Registrierungs-Seite (`/register`) erstellen (Shadcn UI)
- [ ] `ProtectedRoute` Komponente für geschützte Routen implementieren
- [ ] `AdminRoute` Komponente für den Admin-Bereich implementieren

## 🏆 Akzeptanzkriterien
- Nutzer können sich erfolgreich registrieren und anmelden.
- Registrierte Nutzer landen automatisch in der `public.users` Tabelle.
- Nicht eingeloggte Nutzer können nicht auf `/dashboard` oder `/admin` zugreifen.
- Admins können durch ihre Rolle identifiziert werden.
