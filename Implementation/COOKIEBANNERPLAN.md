# Implementierungsplan: DSGVO-Konformer Cookie-Banner

Dieser Plan beschreibt die Schritte zur Integration eines "Premium" Cookie-Banners im minimalistischen Glassmorphism-Design für die Dr. Schmidt Praxis-Plattform.

## 1. Design-Spezifikationen (Aesthetics)
- [x] **Stil:** Schwebendes Element (Floating-UI) links unten.
- [x] **Effekte:** Glassmorphism (`backdrop-blur-xl`), dezente Schatten (`shadow-2xl`).
- [x] **Farben:** Hintergrund Weiß (80% Deckkraft), Akzente in `stone-900` (Buttons) und `emerald-500` (Zustimmung).
- [x] **Animation:** Sanftes Einblenden von unten (`framer-motion`).


## 2. Technische Architektur
- [x] **Speicherung:** Nutzung von `localStorage` (Key: `cookie_consent_v1`) zur dauerhaften Speicherung der Entscheidung.
- [x] **Zustand (Global):** Einbindung in `App.tsx`, um den Status app-weit verfügbar zu machen.
- [x] **Reaktivität:** Der Banner verschwindet sofort nach Klick.

## 3. Inhalts-Checkliste (Konformität)
- [x] **Kurztext:** Verständliche Liste der genutzten Funktionen (Login & Buchung).
- [x] **Buttons:**
    - [x] `Alle Akzeptieren` (Primär, Stone-900)
    - [x] `Nur Notwendige` (Sekundär, Outline)
- [x] **Links:** Verknüpfung zur neuen `/datenschutz` Seite.

## 4. Implementierungsschritte
1. [x] Erstellung der Komponente `src/components/ui/CookieBanner.tsx`.
2. [x] Einbindung der Komponente in der `App.tsx` (über dem Router).
3. [x] Logik-Check: Prüfung auf bestehenden Consent beim App-Start.
4. [x] Responsive Test: Optimierung für Mobile.

## 5. Zukunftsfähigkeit
- [ ] Optionale Erweiterung: Granulare Auswahl von Marketing/Analyse-Cookies ermöglichen.
- [ ] "Revisit-Button": Kleiner Icon-Button im Footer, um den Banner für Einstellungsänderungen erneut zu öffnen.

---
**Status:** Abgeschlossen (Basis-Implementierung)
**Priorität:** Hoch (Wegen DSGVO-Relevanz)
