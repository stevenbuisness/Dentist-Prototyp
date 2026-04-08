# E-Mail-Templates für Supabase & Patientenfunk
Zahnarztpraxis Dr. Schmidt · Berlin

Diese Templates sind für die direkte Verwendung in der Supabase-Konfiguration (**Auth > Email Templates**) optimiert. Sie verwenden Tabellen-basiertes HTML für maximale Kompatibilität und folgen dem `MARKENSTIL_GUIDE.md`.

---

## 🏗️ Gemeinsames Basis-Layout (Header & Footer)

Verwenden Sie dieses Grundgerüst für alle E-Mails. Ersetzen Sie den `{{ CONTENT }}`-Teil durch die spezifischen Texte unten.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Lato', Helvetica, Arial, sans-serif; background-color: #faf8f5; color: #1c1917; margin: 0; padding: 0; }
    .container { width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e7e5e4; }
    .header { background-color: #ffffff; padding: 40px; text-align: center; border-bottom: 1px solid #faf8f5; }
    .content { padding: 40px; line-height: 1.6; }
    .footer { background-color: #faf8f5; padding: 30px; text-align: center; font-size: 11px; color: #78716c; }
    .button { display: inline-block; background-color: #1c1917; color: #ffffff !important; padding: 16px 30px; text-decoration: none; border-radius: 12px; font-family: 'Montserrat', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; margin-top: 20px; }
    h1 { font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 700; color: #1c1917; margin-top: 0; letter-spacing: -0.5px; }
    p { margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Ersetzen Sie [URL] durch die echte Logo-URL Ihrer Praxis -->
      <img src="https://example.com/logo.png" alt="Zahnarztpraxis Dr. Schmidt" width="120">
      <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #78716c; margin-top: 15px;">Dr. Schmidt · Berlin</div>
    </div>
    <div class="content">
      {{ CONTENT }}
    </div>
    <div class="footer">
      <p><strong>Zahnarztpraxis Dr. Schmidt</strong><br>
      Musterallee 123 · 10115 Berlin<br>
      Tel: 030 12345678 · www.praxis-schmidt.berlin</p>
      <div style="margin-top: 20px; border-top: 1px solid #e7e5e4; pt: 20px;">
        Diese E-Mail ist Teil Ihrer Kommunikation mit unserer Praxis. 
        <br>&copy; 2026 Zahnarztpraxis Dr. Schmidt. Alle Rechte vorbehalten.
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 💌 Spezifische Inhalte (Replace {{ CONTENT }})

### 1. Willkommens-E-Mail (Confirm Signup)
*Ort: Supabase Auth > Email Templates > Confirm signup*

```html
<h1>Herzlich Willkommen</h1>
<p>Guten Tag,</p>
<p>vielen Dank für Ihr Vertrauen in unsere Praxis. Wir freuen uns, Sie bei Ihrer Zahngesundheit begleiten zu dürfen.</p>
<p>Damit Sie Termine online buchen können, bestätigen Sie bitte kurz Ihre E-Mail-Adresse durch Klick auf den folgenden Link:</p>
<a href="{{ .ConfirmationURL }}" class="button">E-Mail Bestätigen</a>
<p style="margin-top:30px; font-size: 13px; color: #78716c;">Sollte der Button nicht funktionieren, kopieren Sie bitte diesen Link in Ihren Browser:<br>{{ .ConfirmationURL }}</p>
<p>Ruhige Abläufe, klare Kommunikation – wir freuen uns auf Sie.</p>
<p>Ihr Team der Zahnarztpraxis Dr. Schmidt</p>
```

### 2. Passwort zurücksetzen (Reset Password)
*Ort: Supabase Auth > Email Templates > Reset password*

```html
<h1>Passwort zurücksetzen</h1>
<p>Guten Tag,</p>
<p>wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten. Falls Sie dies nicht selbst veranlasst haben, können Sie diese E-Mail einfach ignorieren.</p>
<p>Klicken Sie auf den untenstehenden Button, um ein neues Passwort festzulegen:</p>
<a href="{{ .ConfirmationURL }}" class="button">Neues Passwort festlegen</a>
<p style="margin-top:30px; font-size: 13px; color: #78716c;">Dieser Link ist aus Sicherheitsgründen nur begrenzt gültig.</p>
<p>Herzliche Grüße,<br>Ihre Zahnarztpraxis Dr. Schmidt</p>
```

### 3. Terminbestätigung (Custom Template)
*Wird durch den Edge Function Hook ausgelöst*

```html
<div style="background-color: #faf8f5; border-radius: 12px; padding: 25px; border: 1px solid #e7e5e4; margin-bottom: 25px;">
  <p style="text-transform: uppercase; font-size: 10px; font-weight: 700; color: #78716c; margin-bottom: 5px; letter-spacing: 1px;">Termin-Details</p>
  <h2 style="margin: 0; font-family: 'Montserrat', sans-serif; font-size: 18px; color: #1c1917;">Bestätigt: Ihre Kontrolluntersuchung</h2>
  <div style="font-size: 15px; font-weight: 700; margin-top: 10px;">{{ DATE }} um {{ TIME }} Uhr</div>
</div>

<p>Guten Tag,</p>
<p>hiermit bestätigen wir Ihren gebuchten Termin in unserer Praxis in Berlin. Bitte erscheinen Sie ca. 5–10 Minuten vor Behandlungsbeginn, damit wir einen reibungslosen Ablauf gewährleisten können.</p>
<p>Sie können Ihren Termin jederzeit in Ihrem Patienten-Dashboard verwalten:</p>
<a href="https://praxis-schmidt.berlin/dashboard" class="button">Zum Dashboard</a>
<p style="margin-top:30px;">Wir freuen uns darauf, Sie persönlich zu begrüßen.</p>
```
