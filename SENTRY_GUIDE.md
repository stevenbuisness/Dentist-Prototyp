# 🐞 Sentry Setup & Fehlerberichte

Diese Kurzanleitung hilft dir (oder dem Entwickler-Team), Sentry für unser Projekt (`Dentist-Prototyp`) einzurichten, um eine verlässliche Feedbackschleife für Fehler zu etablieren.

## 🚀 Schritt 1: Konto & Projekt erstellen
1. Gehe auf **[sentry.io/signup](https://sentry.io/signup)** und erstelle ein kostenloses Konto (oder logge dich ein).
2. Klicke im Dashboard auf **"Create Project"**.
3. Wähle **React** (unter Browser) als Plattform.
4. Setze den Alert-Type auf "Alert me on every new issue".
5. Vergib dem Projekt einen Namen (z. B. `dentist-prototyp-frontend`).
6. Klicke auf **"Create Project"**.

## 🔑 Schritt 2: DSN (Data Source Name) abrufen
Nach der Erstellung zeigt Sentry dir eine Installationsanleitung. 
- Suche nach dem Code-Block, der die Funktion `Sentry.init(...)` enthält.
- Kopiere den Wert des Feldes **`dsn`** (beginnt meist mit `https://...`). Diese URL benötigen wir für unsere `.env`-Datei.

## 💻 Schritt 3: Sentry im Code integrieren (für die KI)
Sobald du den DSN hast, instruiere deinen KI-Agenten, die Sentry-Pakete in dieses React-Projekt (Vite) zu integrieren. 

Nutze dafür diesen einfachen Prompt für deinen KI-Agenten:
> "Beziehe dich auf SENTRY_GUIDE.md. Hier ist unser Sentry DSN für dieses Projekt: `[DEIN_DSN_HIER_EINFÜGEN]`. Bitte installiere die benötigten Sentry-Pakete (z.B. `@sentry/react`) und integriere Sentry in unsere main.tsx als unsere Error-Tracking-Lösung und Feedback-Schleife gemäß Sentry Best Practices für React und Vite."

## 🗓 Feedbackschleifen & Issues
Wir tracken Fehler ab sofort in Sentry und verlinken essenzielle Sentry-Issues direkt als GitHub-Issues.
👉 **Halte dich bei jeder Fehlerbehebung weiterhin an unseren `GITHUB_FEHLER_GUIDE.md`!**
