# Eden Exodus Website – Anleitung

## Was ist drin?
- `index.html` – Startseite
- `ueber-uns.html`, `vision.html`, `events.html`, `material.html`, `kontakt.html`, `spenden.html`
- `danke.html` (nach dem Kontaktformular), `impressum.html`, `datenschutz.html`, `404.html`
- `assets/` – Design (css), Funktionen (js) und Bilder (img)

## Das kannst du selbst ändern
| Was | Wo |
|---|---|
| E-Mail, Telefon, Adresse, Instagram, YouTube, PayPal, Bankdaten | `assets/js/config.js` |
| Termine / Events | `assets/js/events.js` |
| Farben & Schriften | ganz oben in `assets/css/style.css` |
| Texte | direkt in der jeweiligen `.html`-Datei |
| Bilder | in `assets/img/` ersetzen (gleicher Dateiname) |

## Kontaktformular
Läuft kostenlos über formsubmit.co. Sobald deine echte E-Mail in `config.js` steht,
schickst du einmal eine Testnachricht. Du bekommst dann eine Bestätigungs-Mail, die du einmal anklicken musst. Danach kommen alle Nachrichten bei dir an.

## Spenden
Trage in `config.js` deinen PayPal.me-Namen und deine Bankdaten ein. Ohne PayPal zeigt der Button einfach die Bankdaten.

## Online stellen (Vercel)
1. Auf vercel.com einloggen → „Add New… → Project“
2. Das GitHub-Repository auswählen → „Deploy“ (keine Einstellungen nötig)
3. Optional: unter „Settings → Domains“ deine eigene Domain eintragen
