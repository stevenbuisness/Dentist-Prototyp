# Phase 1: Setup, Datenbank & Authentifizierung (Neu strukturiert)

In dieser Phase legen wir das komplette Datenmodell in Supabase fest, bevor wir die Authentifizierung und die ersten Dashboard-Mockups umsetzen.

## 📋 Aufgabenliste

### 1.1 Datenbank-Setup (Vorrangig)
- [ ] Supabase Projekt initialisieren & `.env` lokal einrichten
- [ ] **Alle Tabellen erstellen** (SQL Migration):
    - `users` (erweitertes Profil)
    - `session_types` (Behandlungsarten)
    - `sessions` (Terminslots)
    - `bookings` (Buchungen)
    - `availability_rules` & `availability_exceptions`
- [ ] Postgres-Trigger für automatischen User-Sync (`auth.users` -> `public.users`) einrichten
- [ ] RLS Policies für alle Tabellen aktivieren

### 1.2 Authentifizierungs-UI
- [ ] Registrierungs-Seite (`/register`) mit erweiterten Profilfeldern erstellen
- [ ] Login-Seite (`/login`) implementieren
- [ ] `useAuth` Hook zur globalen Statusverwaltung erstellen

### 1.3 Rollen-Management & Dashboards
- [ ] Manuelle Zuweisung der Admin-Rolle in der Supabase DB (nach Tabellenerstellung)
- [ ] **Dashboard Mockups erstellen:**
    - `/dashboard` (User-Ansicht Mockup)
    - `/admin/dashboard` (Admin-Ansicht Mockup)
- [ ] Protected Routes (`ProtectedRoute`, `AdminRoute`) implementieren und mit Mockups testen

## 🏆 Akzeptanzkriterien
- Alle Datenbanktabellen existieren in Supabase.
- Nutzer können sich registrieren und anmelden.
- Das System erkennt automatisch, ob ein Nutzer Admin oder Patient ist (basierend auf der DB-Zuweisung).
- Die Dashboard-Mockups sind erreichbar und zeigen rollenspezifische Inhalte.
