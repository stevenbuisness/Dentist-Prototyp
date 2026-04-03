# Implementierungsplan: DSGVO-Konformer Cookie-Banner

Dieser Plan beschreibt die Schritte zur Integration eines "Premium" Cookie-Banners im minimalistischen Glassmorphism-Design für die Dr. Schmidt Praxis-Plattform.

## 1. Design-Spezifikationen (Aesthetics)
- [ ] **Stil:** Schwebendes Element (Floating-UI) links unten oder zentriert.
- [ ] **Effekte:** Glassmorphism (`backdrop-blur-md`), dezente Schatten (`shadow-2xl`).
- [ ] **Farben:** Hintergrund Weiß (80% Deckkraft), Akzente in `stone-900` (Buttons) und `emerald-500` (Zustimmung).
- [ ] **Animation:** Sanftes Einblenden von unten (`animate-in slide-in-from-bottom-5 duration-500`).

## 2. Technische Architektur
- [ ] **Speicherung:** Nutzung von `localStorage` (Key: `cookie_consent_v1`) zur dauerhaften Speicherung der Entscheidung.
- [ ] **Zustand (Global):** Integration in die `AuthContext.tsx` oder eine separate `ConsentProvider.tsx`, um den Status app-weit abfragbar zu machen.
- [ ] **Reaktivität:** Der Banner verschwindet sofort nach Klick und blockiert (optional) nicht-essenzielle Skripte.

## 3. Inhalts-Checkliste (Konformität)
- [ ] **Kurztext:** Verständlicher Hinweis auf die Nutzung notwendiger Cookies für die Terminbuchung (Supabase).
- [ ] **Buttons:**
    - [ ] `Alle Akzeptieren` (Primär, Stone-900)
    - [ ] `Nur Notwendige` (Sekundär, Outline)
    - [ ] `Einstellungen` (Link-Stil, dezent)
- [ ] **Links:** Verknüpfung zur bestehenden `/datenschutz` Seite.

## 4. Implementierungsschritte
1. [ ] Erstellung der Komponente `src/components/ui/CookieBanner.tsx`.
2. [ ] Einbindung der Komponente in der `App.tsx` (über dem Router).
3. [ ] Logik-Check: Prüfung auf bestehenden Consent beim App-Start.
4. [ ] Responsive Test: Optimierung für Mobile (Full-Width Modus am unteren Rand).

## 5. Zukunftsfähigkeit
- [ ] Optionale Erweiterung: Granulare Auswahl von Marketing/Analyse-Cookies ermöglichen.
- [ ] "Revisit-Button": Kleiner Icon-Button im Footer, um den Banner für Einstellungsänderungen erneut zu öffnen.

---
**Status:** Geplant (Wartet auf Start-Signal)
**Priorität:** Hoch (Wegen DSGVO-Relevanz)
