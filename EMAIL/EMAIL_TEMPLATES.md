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
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Montserrat', Helvetica, Arial, sans-serif; background-color: #faf8f5; color: #1c1917; margin: 0; padding: 0; }
    .container { width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; overflow: hidden; border: 1px solid #e7e5e4; }
    .header { background-color: #1c1917; padding: 40px; text-align: center; }
    .header img { display: block; margin: 0 auto; filter: brightness(0) invert(1); }
    .header-subtitle { font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #d6d3d1; margin-top: 20px; }
    .content { padding: 50px 40px; line-height: 1.8; font-size: 15px; color: #44403c; }
    .footer { background-color: #faf8f5; padding: 40px; text-align: center; font-size: 11px; color: #a8a29e; line-height: 1.6; }
    .button { display: inline-block; background-color: #1c1917; color: #ffffff !important; padding: 18px 36px; text-decoration: none; font-family: 'Montserrat', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; margin-top: 30px; transition: background-color 0.3s ease; }
    h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 400; color: #1c1917; margin-top: 0; margin-bottom: 25px; line-height: 1.3; }
    p { margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Ersetzen Sie das src-Attribut durch eine echte absolute URL zum Logo -->
      <img src="https://dentist-prototyp.vercel.app/logo.png" alt="Zahnarztpraxis Dr. Schmidt" width="140" style="max-width: 100%; height: auto;">
      <div class="header-subtitle">Dr. Schmidt · Düsseldorf</div>
    </div>
    <div class="content">
      {{ CONTENT }}
    </div>
    <div class="footer">
      <p style="margin-bottom: 10px; color: #78716c;"><strong>Zahnarztpraxis Dr. Schmidt</strong><br>
      Königsallee 123 · 40215 Düsseldorf<br>
      Tel: 0211 12345678 · www.dentist-prototyp.vercel.app</p>
      <div style="margin-top: 25px; border-top: 1px solid #e7e5e4; padding-top: 25px;">
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
<h1 style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 400; color: #1c1917; margin-top: 0; margin-bottom: 25px; line-height: 1.3;">Herzlich Willkommen</h1>
<p style="margin-bottom: 20px;">Guten Tag,</p>
<p style="margin-bottom: 20px;">vielen Dank für Ihr Vertrauen in unsere Praxis. Wir freuen uns, Sie bei Ihrer Zahngesundheit in unserer Smile Lounge Düsseldorf begleiten zu dürfen.</p>
<p style="margin-bottom: 20px;">Damit Sie Termine online buchen können, bestätigen Sie bitte kurz Ihre E-Mail-Adresse durch Klick auf den folgenden Link:</p>
<a href="{{ .ConfirmationURL }}" class="button" style="display: inline-block; background-color: #1c1917; color: #ffffff !important; padding: 18px 36px; text-decoration: none; font-family: 'Montserrat', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; margin-top: 10px; margin-bottom: 30px;">E-Mail Bestätigen</a>
<p style="font-size: 12px; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 20px; line-height: 1.6;">Sollte der Button nicht funktionieren, kopieren Sie bitte diesen Link in Ihren Browser:<br><span style="color: #78716c; word-break: break-all;">{{ .ConfirmationURL }}</span></p>
<p style="margin-bottom: 20px; margin-top: 30px;">Ruhige Abläufe, klare Kommunikation – wir freuen uns auf Sie.</p>
<p style="margin-bottom: 0;">Ihr Team der<br><strong>Zahnarztpraxis Dr. Schmidt</strong></p>
```

### 2. Passwort zurücksetzen (Reset Password)
*Ort: Supabase Auth > Email Templates > Reset password*

```html
<h1 style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 400; color: #1c1917; margin-top: 0; margin-bottom: 25px; line-height: 1.3;">Passwort zurücksetzen</h1>
<p style="margin-bottom: 20px;">Guten Tag,</p>
<p style="margin-bottom: 20px;">wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten. Falls Sie dies nicht selbst veranlasst haben, können Sie diese E-Mail einfach ignorieren.</p>
<p style="margin-bottom: 20px;">Klicken Sie auf den untenstehenden Button, um ein neues Passwort festzulegen:</p>
<a href="{{ .ConfirmationURL }}" class="button" style="display: inline-block; background-color: #1c1917; color: #ffffff !important; padding: 18px 36px; text-decoration: none; font-family: 'Montserrat', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; margin-top: 10px; margin-bottom: 30px;">Neues Passwort festlegen</a>
<p style="font-size: 12px; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 20px;">Dieser Link ist aus Sicherheitsgründen nur begrenzt gültig.</p>
<p style="margin-bottom: 0; margin-top: 30px;">Herzliche Grüße,<br>Ihre <strong>Zahnarztpraxis Dr. Schmidt</strong></p>
```

### 3. Terminbestätigung (Custom Template / Edge Function)
*Falls Sie Terminbestätigungen via Edge Function verschicken*

```html
<div style="background-color: #f5f5f4; border-radius: 4px; padding: 35px 30px; border-left: 3px solid #C8B560; margin-bottom: 35px;">
  <p style="font-family: 'Montserrat', sans-serif; text-transform: uppercase; font-size: 10px; font-weight: 600; color: #78716c; margin-top: 0; margin-bottom: 10px; letter-spacing: 2px;">Ihre Termin-Details</p>
  <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; color: #1c1917; margin-bottom: 15px;">Ihre Kontrolluntersuchung</h2>
  <div style="font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 500; color: #1c1917;">{{ DATE }} um {{ TIME }} Uhr</div>
</div>

<p style="margin-bottom: 20px;">Guten Tag,</p>
<p style="margin-bottom: 20px;">hiermit bestätigen wir Ihren gebuchten Termin in unserer Praxis in Düsseldorf. Bitte erscheinen Sie ca. 5–10 Minuten vor Behandlungsbeginn in der Königsallee 123, damit wir einen reibungslosen Ablauf gewährleisten können.</p>
<p style="margin-bottom: 20px;">Sie können Ihren Termin jederzeit in Ihrem Patienten-Dashboard verwalten:</p>
<a href="https://dentist-prototyp.vercel.app/dashboard" class="button" style="display: inline-block; background-color: #1c1917; color: #ffffff !important; padding: 18px 36px; text-decoration: none; font-family: 'Montserrat', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; margin-top: 10px; margin-bottom: 30px;">Zum Dashboard</a>
<p style="margin-bottom: 0; margin-top: 20px;">Wir freuen uns darauf, Sie persönlich zu begrüßen.</p>
```
