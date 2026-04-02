# 🦷 Implementation Plan: Patientenakte & Dokumentation

Dieser Plan beschreibt die Erweiterung der Sitzungsverwaltung und die Implementierung einer digitalen Patientenakte (Karteikarte) für den Admin-Bereich.

## 🎯 Übergeordnete Ziele
- Effiziente Dokumentation von Terminen direkt nach Abschluss.
- Lückenlose Behandlungshistorie pro Patient (Digitale Karteikarte).
- Premium-UI mit Fokus auf Übersichtlichkeit und Zeitersparnis.

---

## 📋 Checkliste der Aufgaben

### 1. ⚙️ Backend & Datenbank (Supabase)
- [x] **Data Model Check:** Spalte `notes` in `public.bookings` (text, nullable) korrekt konfigurieren.
- [x] **RLS Policy Update:** Sicherstellen, dass Admins die `bookings` Tabelle für Notizen aktualisieren dürfen.
- [x] **Trigger/Activities:** Prüfen, ob eine neue Aktivität "Behandlung dokumentiert" angelegt werden soll (Logik in `log_booking_activity` aktualisiert).

### 2. 📋 Sitzungsverwaltung UI (`/admin/sessions`)
- [x] **Column Cleanup:** Spalte "Kapazität" aus der `DataTable` ausblenden (in DB erhalten).
- [x] **Chronologische Sortierung:** `start_time DESC` als Standard (neueste zuerst).
- [x] **Status-Indikatoren (Ampel-System):**
    - 🔴 **Fehlt:** Termin vorbei, keine Dokumentation.
    - 🟢 **Erledigt:** Termin vorbei, Dokumentation vorhanden.
    - 🔘 **Geplant:** Zukünftiger Termin.

### 3. ✍️ Dokumentations-Workflow (Action Dialogue)
- [x] **Modaler Dialog:** Öffnet sich bei Klick auf einen Termin für schnelles Feedback.
- [x] **Status-Markierung:** Button/Toggle für "Erschienen" (`attended`).
- [x] **Behandlungsnotizen:** Eingabefeld für den Termin-Text.
- [x] **Smart-Sentence Templates (Quick-Select):**
    - [x] `[Regelkontrolle OK]` -> "Gesamtbefund unauffällig. Keine akuten Probleme."
    - [x] `[PZR Empfehlung]` -> "Professionelle Zahnreinigung durchgeführt/empfohlen."
    - [x] `[Röntgen]` -> "Röntgen ohne Befund durchgeführt."
    - [x] `[Kontrolle (6M)]` -> "Kontrolluntersuchung in 6 Monaten empfohlen."

### 🗂️ 4. Digitale Patientenakte (`/admin/clients`)
- [x] **Detail-Ansicht (Karteikarte):** Erweiterung des Patientenprofils um den Verlauf.
- [x] **Timeline-Komponente:** Vertikaler Zeitstrahl mit allen vergangenen Behandlungen.
    - [x] Icons für verschiedene Behandlungstypen.
    - [x] Anzeige der Datumswerte und der spezifischen Notizen.
- [x] **Stammdaten-Editor:** Integrierte Bearbeitung von Vorname, Nachname, Geburtsdatum etc.
- [x] **Live-Updates:** Automatische Synchronisierung der Timeline nach dem Speichern (via React Query Invalidation).

### 5. 🔍 Finales Polishing
- [x] **Premium-Aesthetic:** Vertikaler Zeitstrahl mit modernem Design & Ampel-Status.
- [x] **Responsiveness:** Slide-Over Panel ist responsiv und touch-freundlich.
- [x] **Fehlerbehandlung:** Toasts für Erfolg/Fehler beim Speichern der Dokumentation.

---

> [!IMPORTANT]
> Die Dokumentation wird in `bookings.notes` gespeichert und ist über eine Join-Abfrage (`bookings` <-> `sessions` <-> `users`) in der Patientenakte sichtbar.

> [!TIP]
> Die Verwendung von `attended` Icons in den Listen erhöht die visuelle Scannbarkeit für den Admin enorm.
