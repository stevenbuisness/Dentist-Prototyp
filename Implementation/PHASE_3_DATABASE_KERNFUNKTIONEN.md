# Phase 3: Datenbank & Kernfunktionen

In dieser Phase bauen wir die logische Mitte der Anwendung – die Tabellen für Sitzungen, Buchungen und Verfügbarkeiten.

## 📋 Aufgabenliste

### 3.1 Tabellen-Struktur (Supabase SQL)
- [x] Tabelle `public.session_types` erstellen
- [x] Tabelle `public.sessions` erstellen (Referenz zu `session_types`)
- [x] Tabelle `public.bookings` erstellen (Referenz zu `users` und `sessions`)
- [x] Tabelle `public.availability_rules` und `availability_exceptions` erstellen

### 3.2 Row Level Security (RLS)
- [x] RLS Policies für `session_types` definieren (Public read, Admin manage)
- [x] RLS Policies für `sessions` definieren (Public/User read, Admin manage)
- [x] RLS Policies für `bookings` definieren (User own read/create/cancel, Admin all manage)
- [x] RLS Policies für `availability_rules` & `availability_exceptions` ergänzt ✅ NEU
- [x] Granulare Booking-Policies (SELECT / INSERT / UPDATE / DELETE separat) ✅ VERBESSERT

### 3.3 API & Daten-Hooks
- [x] `useSessions.ts` – Full CRUD für Sessions & SessionTypes (React Query)
- [x] `useBookings.ts` – Admin-Ansicht & Patienten-Ansicht, Status-Updates
- [x] `useAvailability.ts` – Rules & Exceptions CRUD + Verfügbarkeits-Helfer
- [x] `QueryClientProvider` in `index.tsx` eingebunden
- [x] Admin-Pages (`SessionTypesPage`, `SessionsPage`, `BookingsPage`) auf React Query umgestellt

## 🏆 Akzeptanzkriterien
- Alle Tabellen existieren und besitzen referenzielle Integrität.
- RLS schützt erfolgreich Patienten- und Buchungsdaten.
- Das Frontend kann alle Sitzungen und Buchungen korrekt abrufen.

## 💡 Verbesserungen (umgesetzt ✅)
- [x] **Realtime-Updates**: `useBookingsRealtime()` – Supabase Channel auf `bookings` & `sessions`, invalidiert den React Query Cache automatisch bei DB-Änderungen. Live-Badge 🔴 in `BookingsPage` sichtbar.
- [x] **Optimistic Updates**: `useUpdateBookingStatus` patcht den Cache sofort (vor Server-Antwort) und rollt bei Fehler automatisch zurück.
- [x] **Booking-Konflikt-Check**: DB-Trigger `trg_check_booking_capacity` verhindert Überbuchung. Zweiter Trigger `trg_sync_session_status` setzt Session automatisch auf `fully_booked` / zurück auf `open`.

