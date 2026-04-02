# 🦷 Implementation Plan: Patientenakte & Dokumentation

Dieser Plan beschreibt die Erweiterung der Sitzungsverwaltung und die Implementierung einer digitalen Patientenakte (Karteikarte) für den Admin-Bereich.

## 🎯 Übergeordnete Ziele
- Effiziente Dokumentation von Terminen direkt nach Abschluss.
- Lückenlose Behandlungshistorie pro Patient (Digitale Karteikarte).
- Premium-UI mit Fokus auf Übersichtlichkeit und Zeitersparnis.

---

## 📋 Checkliste der Aufgaben

### 1. ⚙️ Backend & Datenbank (Supabase)
- [ ] **Data Model Check:** Spalte `notes` in `public.bookings` (text, nullable) korrekt konfigurieren.
- [ ] **RLS Policy Update:** Sicherstellen, dass Admins die `bookings` Tabelle für Notizen aktualisieren dürfen.
- [ ] **Trigger/Activities:** Prüfen, ob eine neue Aktivität "Behandlung dokumentiert" angelegt werden soll.

### 2. 📋 Sitzungsverwaltung UI (`/admin/sessions`)
- [ ] **Column Cleanup:** Spalte "Kapazität" aus der `DataTable` ausblenden (in DB erhalten).
- [ ] **Chronologische Sortierung:** `start_time DESC` als Standard (neueste zuerst).
- [ ] **Status-Indikatoren (Ampel-System):**
    - 🔴 **Fehlt:** Termin vorbei, keine Dokumentation.
    - 🟢 **Erledigt:** Termin vorbei, Dokumentation vorhanden.
    - 🔘 **Geplant:** Zukünftiger Termin.

### 3. ✍️ Dokumentations-Workflow (Action Dialogue)
- [ ] **Modaler Dialog:** Öffnet sich bei Klick auf einen Termin für schnelles Feedback.
- [ ] **Status-Markierung:** Button/Toggle für "Erschienen" (`attended`).
- [ ] **Behandlungsnotizen:** Eingabefeld für den Termin-Text.
- [ ] **Smart-Sentence Templates (Quick-Select):**
    - [ ] `[Regelkontrolle OK]` -> "Gesamtbefund unauffällig. Keine akuten Probleme."
    - [ ] `[PZR Empfehlung]` -> "Professionelle Zahnreinigung durchgeführt/empfohlen."
    - [ ] `[Röntgen]` -> "Röntgen ohne Befund durchgeführt."
    - [ ] `[Kontrolle (6M)]` -> "Kontrolluntersuchung in 6 Monaten empfohlen."

### 🗂️ 4. Digitale Patientenakte (`/admin/clients`)
- [ ] **Detail-Ansicht (Karteikarte):** Erweiterung des Patientenprofils um den Verlauf.
- [ ] **Timeline-Komponente:** Vertikaler Zeitstrahl mit allen vergangenen Behandlungen.
    - Icons für verschiedene Behandlungstypen.
    - Anzeige der Datumswerte und der spezifischen Notizen.
- [ ] **Stammdaten-Editor:** Integrierte Bearbeitung von Vorname, Nachname, Geburtsdatum etc.

### 5. 🔍 Finales Polishing
- [ ] **Live-Updates:** Automatische Synchronisierung der Timeline nach dem Speichern.
- [ ] **Responsiveness:** Test auf Tablets und Desktops (Premium-Aesthetic).
- [ ] **Loading-States:** Skeleton-Loader für die Timeline integrieren.

---

> [!IMPORTANT]
> Die Dokumentation wird in `bookings.notes` gespeichert und ist über eine Join-Abfrage (`bookings` <-> `sessions` <-> `users`) in der Patientenakte sichtbar.

> [!TIP]
> Die Verwendung von `attended` Icons in den Listen erhöht die visuelle Scannbarkeit für den Admin enorm.
