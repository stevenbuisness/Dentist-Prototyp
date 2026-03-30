# Phase 4: Admin-Dashboard

In dieser Phase erstellen wir das Verwaltungszentrum für Administratoren der Praxis.

## 📋 Aufgabenliste

### 4.1 Kunden- & Rollenverwaltung (`/admin/clients`)
- [ ] Profilansicht für Kunden (CRUD Profile)
- [ ] Blockier-/Ablehnfunktion für Nutzer implementieren (`users.status` ändern)
- [ ] Liste aller registrierten Nutzer (DataTable)

### 4.2 Sitzungs- & Behandlungstypen (`/admin/sessions`, `/admin/session-types`)
- [ ] CRUD Interface für Sitzungstypen (Name, Preis, Dauer)
- [ ] CRUD Interface für Einzelsitzungen (Datum, Uhrzeit, Kapazität)
- [ ] Listen- und Filteransicht aller Sitzungen

### 4.3 Buchungs- & Kalenderverwaltung (`/admin/bookings`, `/admin/calendar`)
- [ ] Übersicht aller eingegangenen Buchungen
- [ ] Verwaltung des Kalenders (Verfügbarkeits-Regeln hinzufügen)
- [ ] Ausnahmen (Urlaub, Feiertage) pflegen

## 🏆 Akzeptanzkriterien
- Admin kann Sitzungen erstellen, bearbeiten und löschen.
- Admin kann Buchungen einsehen und manuell stornieren.
- Kunden können vom Admin abgeblockt oder entsperrt werden.
- Dashboard-Statistiken geben korrekte Daten aus.
