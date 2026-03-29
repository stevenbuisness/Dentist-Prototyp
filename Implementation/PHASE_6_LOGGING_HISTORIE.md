# Phase 6: Logging & Historie

Diese Phase stellt sicher, dass alle wichtigen Aktionen patientendatensicher und revisionssicher protokolliert werden.

## 📋 Aufgabenliste

### 6.1 Audit-Log Datenbank (Supabase SQL)
- [ ] Tabelle `public.login_history` für Nutzer-Logins erstellen
- [ ] Tabelle `public.session_history` für Änderungen an Sitzungen erstellen
- [ ] Tabelle `public.booking_history` für alle Statusänderungen von Buchungen erstellen
- [ ] Tabelle `public.user_action_history` für Admin-Eingriffe implementieren

### 6.2 Postgres-Trigger & Automatisierung
- [ ] Postgres-Trigger für automatische Historisierung bei `INSERT`/`UPDATE`/`DELETE` an Tabellen: `sessions`, `bookings`, `users`.
- [ ] Implementierung der Trigger-Logik für "Old Values" und "New Values" Vergleiche.
- [ ] RLS Policies für History-Tabellen (Nur Admins dürfen alles lesen, keine Tabelle darf `UPDATE` erlauben).

### 6.3 Admin-Ansichten (`/admin/reports`)
- [ ] Anzeige-Komponente für Audit-Logs (Filterbar nach Nutzer, Zeit, Typ)
- [ ] Login-Statistiken für Nutzer/Admins

## 🏆 Akzeptanzkriterien
- Jede Statusänderung an einer Buchung wird automatisch historisiert.
- Logs für Logins und Änderungen an Sitzungen werden lückenlos geschrieben.
- Die Historie ist unveränderbar (keine `UPDATE` Berechtigungen via SQL).
- Admins können die Protokolle im Dashboard einsehen.
