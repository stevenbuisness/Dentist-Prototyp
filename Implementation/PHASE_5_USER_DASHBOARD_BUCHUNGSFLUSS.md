# Phase 5: User-Dashboard & Buchungsfluss

In dieser Phase erstellen wir die Schnittstelle für die Patienten, inklusive des Kernprozesses – der Terminbuchung.

## 📋 Aufgabenliste

### 5.1 Benutzer-Portal (`/dashboard`)
- [x] Übersicht über anstehende Termine
- [x] Profilverwaltung (`/dashboard/profile`) zum Ändern der Kontaktdaten
- [x] Letzte Aktivitäten anzeigen

### 5.2 Buchungs-Funktionalität (`/dashboard/bookings`)
- [x] Schritt-für-Schritt Buchungsformular (Schritte: Typ wählen -> Zeit wählen -> Bestätigen)
- [x] Prüfung auf Verfügbarkeit (Regeln + Ausnahmen + bereits bestehende Buchungen)
- [x] Online-Stornierung (bis 24 Stunden vor Termin) implementieren

### 5.3 Buchungshistorie (`/dashboard/bookings`)
- [x] Liste aller vergangenen und stornierten Buchungen
- [x] Detailansicht einer Buchung inkl. Status (z.B. "attended", "confirmed")

## 🏆 Akzeptanzkriterien
- [x] Patienten können erfolgreich freie Termine finden und buchen.
- [x] Nutzer können ihre Buchungen jederzeit einsehen.
- [x] Die 24-Stunden-Stornierungs-Regel wird technisch eingehalten.
- [x] Profiländerungen werden sicher in der `public.users` Tabelle gespeichert.
