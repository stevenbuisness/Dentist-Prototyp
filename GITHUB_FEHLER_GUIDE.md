# GitHub Workflow & Fehler Guide für KI-Agenten

Diese Datei dient als verbindliche Richtlinie für alle KI-Entwickleragenten, die an diesem Projekt (`Dentist-Prototyp`) arbeiten. 

## 🎯 Unser Ziel
Wir möchten unsere Arbeit, Fehler (Bugs), neue Features und Architekturentscheidungen mithilfe von GitHub-Issues lückenlos und übersichtlich dokumentieren. So behalten wir stets den Überblick und stellen sicher, dass unsere Projekt-Meilensteine immer aktuell sind.

## 📋 Deine strengen Regeln als KI-Agent

Bei **jeder** neuen Session, Unterhaltung oder wenn du aufgefordert wirst Änderungen vorzunehmen, **MUSST** du die folgenden Schritte befolgen:

### 1. Vor Beginn der Programmierung (Check & Create)
- **Bestehende Issues prüfen:** Bevor du mit dem Schreiben von Code beginnst, suche mit deinen GitHub-Tools nach bestehenden Issues, die zur aktuellen Aufgabe passen.
- **Neues Issue erstellen (Pflicht):** Wenn es für die gewünschte Änderung, das Feature oder den Bug noch kein Issue gibt, **erstelle sofort ein neues Issue**.
  - **Titel:** Prägnant und beschreibend (z. B. "Bug: Header auf mobilen Geräten verschoben" oder "Feature: Online-Terminbuchung hinzufügen").
  - **Beschreibung (Body):** Definiere klar das Problem oder das Ziel, die geplanten Schritte und die Akzeptanzkriterien.
  - **Metadaten:** Weise stets passende Labels (z. B. `bug`, `enhancement`, `ui`) zu. Wenn Meilensteine (Milestones) im Repository existieren, weise dem Issue den aktuellen Meilenstein zu.

### 2. Während der Entwicklung (Dokumentieren)
- **Kommunikation & Updates:** Kommentiere das bestehende Issue bei wichtigen Zwischenschritten, insbesondere wenn du auf unvorhergesehene Herausforderungen stößt oder planst, grundlegend von der ursprünglichen Idee abzuweichen.
- **Meilensteine im Auge behalten:** Verknüpfe Arbeitspakete konsequent mit den übergeordneten Projektmeilensteinen.

### 3. Nach Abschluss der Aufgaben (Close & Link)
- **Issue abschließen:** Wenn die Aufgabe, nach Bestätigung des Nutzers, erfolgreich implementiert ist, schließe das Issue. Verwende als Begründung `completed`.
- **Zusammenfassung:** Hinterlasse vor dem Schließen einen kurzen Kommentar im Issue, was genau geändert wurde (z. B. "Fehler behoben in `tailwind.css` und `Header.jsx`").

---
**CRITICAL INSTRUCTION:** **Mache niemals signifikante Code-Änderungen ohne ein dazugehöriges, aktuelles GitHub-Issue!** Extreme Disziplin bei der Issue-Verwaltung hat in diesem Projekt höchste Priorität. Lese diese Datei bei jedem Start einer neuen Aufgabe durch, um die Vorgehensweise sicherzustellen.
