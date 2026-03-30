# Phase 3: Datenbank & Kernfunktionen

In dieser Phase bauen wir die logische Mitte der Anwendung – die Tabellen für Sitzungen, Buchungen und Verfügbarkeiten.

## 📋 Aufgabenliste

### 3.1 Tabellen-Struktur (Supabase SQL)
- [ ] Tabelle `public.session_types` erstellen
- [ ] Tabelle `public.sessions` erstellen (Referenz zu `session_types`)
- [ ] Tabelle `public.bookings` erstellen (Referenz zu `users` und `sessions`)
- [ ] Tabelle `public.availability_rules` und `availability_exceptions` erstellen

### 3.2 Row Level Security (RLS)
- [ ] RLS Policies für `session_types` definieren (Public read, Admin manage)
- [ ] RLS Policies für `sessions` definieren (Public/User read, Admin manage)
- [ ] RLS Policies für `bookings` definieren (User own read/create/cancel, Admin all manage)

### 3.3 API & Daten-Hooks
- [ ] React Query-Hooks für Sitzungen, Buchungen und Behandlungstypen erstellen
- [ ] Helper-Funktionen für die Verfügbarkeits-Prüfung implementieren

## 🏆 Akzeptanzkriterien
- Alle Tabellen existieren und besitzen referenzielle Integrität.
- RLS schützt erfolgreich Patienten- und Buchungsdaten.
- Das Frontend kann alle Sitzungen und Buchungen korrekt abrufen.
