# Phase 6: Logging & Historie

Diese Phase stellt sicher, dass alle wichtigen Aktionen patientendatensicher und revisionssicher protokolliert werden. Durch den Einsatz von Postgres-Triggern erfolgt die Protokollierung automatisch im Hintergrund, ohne den Buchungsfluss für Patienten oder Admins zu unterbrechen.

## 📋 Aufgabenliste

### 6.1 Audit-Log Datenbank (Supabase SQL)
- [x] Tabelle `public.login_history` für Nutzer-Logins erstellen (Bereits vorhanden)
- [x] Tabelle `public.booking_history` für alle Statusänderungen von Buchungen erstellen (Bereits vorhanden)
- [x] Tabelle `public.session_history` für Änderungen an Terminslots erstellen (Erfolgreich implementiert)
- [x] Tabelle `public.user_action_history` für Admin-Eingriffe (Änderungen an Stammdaten/Rollen) erstellen (Erfolgreich implementiert)
- [x] Tabelle `public.audit_logs` als zentrale Sammelstelle für JSON-Diffs (Alt vs. Neu) implementieren (Erfolgreich implementiert)

### 6.2 Postgres-Trigger & Automatisierung (Background Logic)
- [x] Zentrale Trigger-Funktion `fn_log_history()` erstellen, die automatische JSON-Diffs berechnet (Implementiert als `fn_log_generic_audit`)
- [x] Trigger auf `public.bookings` (Statusänderungen, Stornierungen) (Implementiert)
- [x] Trigger auf `public.sessions` (Terminverschiebungen, Slots) (Implementiert)
- [x] Trigger auf `public.users` (Rollenwechsel, Sperrungen) (Implementiert)
- [x] RLS Policies für alle History-Tabellen: `SELECT` nur für Admins, `INSERT` nur via Trigger, `UPDATE/DELETE` für niemanden (Aktiviert)

### 6.3 Admin-Ansichten (`/admin/reports`)
- [x] Neue Admin-Seite `src/pages/admin/AuditLogsPage.tsx` für die Revisions-Einsicht (Erstellt & Registriert)
- [x] Filter-Interface: Suche nach Patient, Zeitraum, Aktionstyp (z.B. "Nur Stornierungen") (Integriert)
- [x] Visualisierung der Änderungen (Anzeige "Alter Wert" vs. "Neuer Wert") (JSON-Diff Visualisierung fertiggestellt)

## 🛠️ Technische Lösungsvorschläge (Design-Entscheidungen)

### Datenbank-Design (Audit-Logs)
*   **Aktionsübergreifende `audit_logs` Tabelle:** Eine zentrale Tabelle, die mittels `jsonb` Spalten `old_data` und `new_data` speichert. Dies ermöglicht die Protokollierung beliebiger Tabellen ohne starre Schemata.
*   **Schutz durch RLS (Row Level Security):** 
    *   `POLICY "Admins can read logs"`: Ermöglicht Admins den Zugriff auf alle Protokolle.
    *   `POLICY "No one can update logs"`: Verhindert jegliche Manipulation bestehender Log-Einträge.

### Trigger-Logik (Berechnung der Diffs)
*   Verwendung einer PL/pgSQL Funktion, die den `auth.uid()` (ID des aktuell angemeldeten Nutzers) automatisch miterfasst.
*   Berechnung der geänderten Felder: Nur Felder, die sich tatsächlich verändert haben, werden im Log-Eintrag hervorgehoben (effiziente Speicherung).

### Admin User Interface (Audit-View)
*   **Komponente:** `src/pages/admin/AuditLogsPage.tsx`
*   **Feature:** Eine moderne Timeline-Ansicht, die für jeden Log-Eintrag anzeigt:
    1.  **Wer?** (Nutzer-ID / Name)
    2.  **Wann?** (Zeitstempel)
    3.  **Was?** (z.B. "Termin von 10:00 auf 11:00 verschoben")
    4.  **Kontext:** Direktlink zur betroffenen Buchung oder zum Patientenprofil.

## 🏆 Akzeptanzkriterien
- **Transparenz:** Jede Änderung an einer Buchung wird automatisch mit Zeitstempel und Verursacher historisiert.
- **Unveränderbarkeit:** Logs können auch von Admins nicht nachträglich manipuliert oder gelöscht werden (RLS Protection).
- **Zero-Impact:** Keine Änderung an der User-Experience oder am Buchungsprozess notwendig.
- **Compliance:** DSGVO-konforme Protokollierung kritischer Patienten-Aktionen für den Admin einsehbar.


