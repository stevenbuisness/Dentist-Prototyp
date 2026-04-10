# Supabase E-Mail Template: Reset Password

Kopiere den folgenden HTML-Code exakt in das Feld **"Body"** unter **Authentication > Email Templates > Reset password** in deinem Supabase Dashboard. 

Dieser Code verwendet dieselbe hoch-elegante Template-Struktur wie die Willkommens-Mail, passend für das Zurücksetzen von Passwörtern.

```html
<!DOCTYPE html>

<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passwort zurücksetzen - Zahnarztpraxis Dr. Maria Schmidt</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500&family=Montserrat:wght@500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #faf8f5;
            font-family: 'Lato', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        table {
            border-collapse: collapse;
        }
        .content-table {
            width: 100%;
            max-width: 560px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 6px;
            overflow: hidden;
        }
        h1 {
            font-family: 'Playfair Display', Georgia, serif;
            color: #1c1917;
            font-size: 26px;
            font-weight: 400;
            margin-bottom: 18px;
            line-height: 1.35;
        }
        p {
            color: #44403c;
            line-height: 1.65;
            font-size: 15px;
            margin: 0 0 16px 0;
        }
        .btn {
            display: inline-block;
            padding: 13px 26px;
            background-color: #2a2623;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-family: 'Montserrat', Helvetica, Arial, sans-serif;
            font-weight: 500;
            font-size: 13px;
            letter-spacing: 0.4px;
        }
        .btn:hover {
            background-color: #85cceb;
            color: #1c1917 !important;
        }
        .footer-text {
            color: #78716c;
            font-size: 12px;
            line-height: 1.6;
        }
        .divider {
            border-bottom: 1px solid #e7e5e4;
            margin: 28px 0;
        }
    </style>
</head>

<body>

<table role="presentation" class="content-table" align="center" cellpadding="0" cellspacing="0">

<!-- Dezenter Premium-Akzent -->
<tr>
    <td style="background-color: #85cceb; height: 3px; line-height: 3px;">&nbsp;</td>
</tr>

<tr>
    <td style="padding: 50px 34px; text-align: center;">

        <!-- Branding -->
        <div style="font-family: 'Montserrat', sans-serif; font-weight: 500; letter-spacing: 1.5px; color: #1c1917; margin-bottom: 34px; font-size: 11px;">
            DR. MARIA SCHMIDT<br>
            <span style="letter-spacing: 1px; color: #78716c;">Zahnarztpraxis Düsseldorf</span>
        </div>

        <!-- Headline -->
        <h1>Passwort zurücksetzen</h1>

        <!-- Text -->
        <p>Sie haben angefordert, Ihr Passwort zurückzusetzen.</p>

        <p>Über den folgenden Link können Sie ein neues Passwort festlegen.</p>

        <!-- CTA -->
        <div style="margin: 32px 0 26px 0;">
            <a href="{{ .ConfirmationURL }}" class="btn">Neues Passwort festlegen</a>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Footer -->
        <p class="footer-text">
            Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.
        </p>

        <p class="footer-text" style="margin-top: 18px;">
            Dr. Maria Schmidt<br>
            Zahnarztpraxis Düsseldorf
        </p>

    </td>
</tr>

</table>

</body>
</html>
```
