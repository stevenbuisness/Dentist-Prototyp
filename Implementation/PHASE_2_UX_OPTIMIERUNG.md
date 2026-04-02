# 🦷 Implementation Plan: UX Optimization & Sessions Workflow

Dieser Plan beschreibt Phase 2: Die visuelle und funktionale Optimierung der Sitzungsverwaltung sowie die Bändigung der Patientenakte.

## 🎯 Übergeordnete Ziele
- **To-Do Management:** Sofortiger Blick auf fehlende Dokumentationen.
- **Workflow Speed:** 1-Klick-Abschluss & automatischer Status-Sync.
- **Premium UX:** Segmentierte Listen statt langer Tabellen.
- **Karteikarten-Struktur:** Accordion-Ansicht für lange Behandlungshistorien.

---

## 📋 Checkliste der Aufgaben

### ✅ 1. Sitzungs-Fokus & Tabs (`SessionsPage`)
- [x] **Tab-System:** Implementierung von 3 Tabs: `Ausstehend` (🔴), `Heute`, `Alle/Archiv`.
- [x] **Card Layout:** Umstellung von Tabelle auf moderne Behandlungs-Karten.
- [x] **Documentation Guard:** Button "Dokumentieren" für Termine in der Zukunft deaktiviert.

### ✅ 2. Automatisierung & Speed
- [x] **Auto-Status Sync:** Beim Speichern der Notiz:
    - `booking.status` -> `attended`.
    - `session.status` -> `completed`.
- [x] **Refetch Trigger:** Sofortige Aktualisierung der Tab-Zahlen & Listen.

### ✅ 3. Patientenakte Premium-Layout (`ClientsPage`)
- [x] **Accordion Timeline:** 
    - Nur der **letzte** Eintrag ist standardmäßig aufgeklappt.
    - Andere Einträge sind komprimiert (Datum + Titel).
- [x] **Stickiness:** Fokus auf Behandlungsverlauf bei gleichzeitiger Erreichbarkeit der Stammdaten.

### ✅ 4. Visuelles Polishing
- [x] **Modern Cards:** Hochwertiges Design mit Schatten, Badges und klaren Status-Farben.
- [x] **Empty States:** "Alles erledigt!"-Grafik für den `Ausstehend` Tab.

---

> [!IMPORTANT]
> Der Dokumentations-Workflow ist jetzt "Input-Driven": Das System führt den Admin direkt zu den offenen Aufgaben.

> [!TIP]
> Die Timeline in der Patientenakte bleibt auch bei vielen Einträgen übersichtlich, da Details erst bei Bedarf eingeblendet werden.
