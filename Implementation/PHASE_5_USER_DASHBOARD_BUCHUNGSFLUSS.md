# Phase 5: User-Dashboard & Buchungsfluss

In dieser Phase erstellen wir die Schnittstelle für die Patienten, inklusive des Kernprozesses – der Terminbuchung.

## 📋 Aufgabenliste

### 5.1 Benutzer-Portal (`/dashboard`)
- [ ] Übersicht über anstehende Termine
- [ ] Profilverwaltung (`/dashboard/profile`) zum Ändern der Kontaktdaten
- [ ] Letzte Aktivitäten anzeigen

### 5.2 Buchungs-Funktionalität (`/dashboard/bookings`)
- [ ] Schritt-für-Schritt Buchungsformular (Schritte: Typ wählen -> Zeit wählen -> Bestätigen)
- [ ] Prüfung auf Verfügbarkeit (Regeln + Ausnahmen + bereits bestehende Buchungen)
- [ ] Online-Stornierung (bis 24 Stunden vor Termin) implementieren

### 5.3 Buchungshistorie (`/dashboard/bookings`)
- [ ] Liste aller vergangenen und stornierten Buchungen
- [ ] Detailansicht einer Buchung inkl. Status (z.B. "attended", "confirmed")

## 🏆 Akzeptanzkriterien
- Patienten können erfolgreich freie Termine finden und buchen.
- Nutzer können ihre Buchungen jederzeit einsehen.
- Die 24-Stunden-Storo-Regel wird technish eingehalten.
- Profiländerungen werden sicher in der `public.users` Tabelle gespeichert.
