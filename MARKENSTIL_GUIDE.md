# MARKENSTIL-GUIDE FÜR HTML-E-MAILS
Zahnarztpraxis Dr. Schmidt · Evidenzbasierte Zahnmedizin Berlin

Dieser Guide dient als Referenz für die Erstellung von HTML-E-Mails, die das visuelle Erscheinungsbild (Corporate Design) unserer Landingpage und Praxis konsistent widerspiegeln.

---

## 1. Farben & Farbpalette

Unsere Farbpalette ist minimalistisch, beruhigend und hochwertig. Für E-Mails sollten immer web-sichere Hex-Codes verwendet werden:

- **Hintergrundfarbe (Main Background):** 
  - Off-White / Beige: `#faf8f5`
  - *Sollte als Haupt-Hintergrund für die E-Mail verwendet werden, um den sterilen Weiß-Look zu vermeiden und eine ruhige Atmosphäre zu schaffen.*

- **Textfarben:**
  - Primärer Text (Dunkles Stone): `#1c1917` (entspricht Tailwind `text-stone-900`)
  - Sekundärer Text (Mittelgrau): `#44403c` (entspricht `text-stone-800`) oder `#78716c` (`text-stone-500` für weniger wichtige Hinweise / Footer)

- **Akzentfarben (Buttons, Linien, Hervorhebungen):**
  - Dunkler Akzent (Schwarz/Stone): `#1c1917`
  - Kontrast-Texte in Buttons: `#fafaf9` oder `#ffffff`

---

## 2. Typografie (Schriftarten)

Bei HTML-E-Mails ist der Font-Support eingeschränkt. Wir verwenden Web-Fonts mit Fallback-Optionen auf systemeigene Schriften.

**Haupt-Schriftarten:**
- **Lato** (Regular, Bold, Italic) - *Für Mengentext / Fließtext*
- **Montserrat** (Medium, Semi-Bold, Bold) - *Für strukturierende Elemente, Buttons, UI-Labels*
- **Playfair Display** (Regular, Italic) - *Für emotionale, elegante Headlines*
- **Kollektif** - *Für Premium-Akzente (nur bei vollem Web-Font Support in E-Mails, sonst Fallback)*

**CSS Font-Stack Empfehlungen für E-Mails:**
- **Fließtext:** `font-family: 'Lato', Helvetica, Arial, sans-serif;`
- **Überschriften (Modern):** `font-family: 'Montserrat', Helvetica, Arial, sans-serif;`
- **Überschriften (Elegant):** `font-family: 'Playfair Display', Georgia, serif;`

---

## 3. Formsprache & Spacing

Das Design sollte "Atmen" und viel Weißraum (Whitespace) lassen. 

- **Abrundungen (Border-Radius):** Web-Elemente in der App verwenden `border-radius: 0.5rem;` (8px). Dies sollte für Buttons oder Inhalts-Boxen in der E-Mail übernommen werden, z.B. `border-radius: 8px;`.
- **Buttons:** 
  - Hintergrund: `#1c1917`
  - Textfarbe: `#ffffff`
  - Padding: `12px 24px` oder ähnlich großzügig.
  - Abgerundete Ecken: `8px`.
  - Schriftart: Montserrat oder Lato, keine Serifen für Buttons.
- **Trennlinien (Divider):** Fein, unaufdringlich. Z.B. `border-bottom: 1px solid #d6d3d1;` (stone-300).

---

## 4. Tonality / Ansprache

- **Wording:** Professionell, ruhig, klar ("Evidenzbasierte Zahnmedizin / Ruhige Abläufe, klare Kommunikation").
- Wenig visuelles Rauschen (keine grellen Farben oder überladenen Banner).
- Fokus auf hochwertige, strukturierte Informationsvermittlung.

---

## Umsetzungshinweis für HTML-E-Mails

E-Mail-Clients haben restriktives CSS-Rendering. Bitte beachten:
1. Nutze **Inline-Styles** anstelle von externen Stylesheets.
2. Setze die `<style>` Webfont-Imports (`@import url(...)`) als Fallback, da viele Clients (z.B. Outlook) diese ignorieren. Gebe immer generische Fallback-Schriften (sans-serif, serif) an.
3. Verwende eine Tabellen-basierte Struktur (`<table border="0" cellpadding="0" cellspacing="0">...`) für maximale Kompatibilität in alten E-Mail-Clients.
