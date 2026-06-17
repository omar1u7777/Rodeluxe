# Rodeluxe – Premium Hair Salon Website


En modern, responsiv single-page webbplats för Rodeluxe frisörsalong i Kristianstad. Byggd med vanilla HTML/CSS/JS, Three.js för 3D-hero, glassmorphism-design och lyxig svart/guld-estetik.

## Funktioner

- 3D-hero med Three.js partiklar
- Dark mode toggle
- Fullt responsiv (desktop, tablet, mobil)
- Glassmorphism UI
- Bokningsmodal med två alternativ (Bokadirekt + Heygoldie)
- Service-filter pills
- Kundrecensioner
- Galleri med lightbox
- Kontaktformulär (Formspree)
- Google Maps integration
- Bonus-kort med 3D flip-animation
- Öppen/stängd badge

## Kör lokalt

Eftersom sidan använder ES-moduler behöver den köras via en lokal server.

### Alternativ A: Python

```bash
python -m http.server 5173
```


### Alternativ B: VS Code Live Server

Installera/aktivera "Live Server" och starta servern på `index.html`.

Öppna sedan http://localhost:5173/

## Projektstruktur

```
Rodeluxe/
├── index.html            # Huvudsidan
├── styles.css            # All styling
├── main.js               # JavaScript-funktionalitet
├── content.js            # Innehåll (tjänster, recensioner, kontakt)
├── logo.webp             # Logo
├── agaren.jpg            # Bild på ägaren
├── crcode_rodeluxe.webp  # QR-kod för bokning
├── favicon.svg           # Favicon
├── robots.txt            # SEO
├── sitemap.xml           # SEO
├── site.webmanifest      # PWA
└── vercel.json           # Vercel-config (säkerhetsheaders, cache, CSP)
```



## Performance & SEO

- **High Lighthouse Scores:** Accessibility 89+, Best Practices 92, SEO 92+, PWA 80
- **Technical SEO:** `sitemap.xml`, `robots.txt`, `site.webmanifest` för bättre synlighet
- **Inga byggsteg:** Vanilla JS/CSS utan bundler eller npm-beroenden (Three.js laddas vid behov från CDN)
- **Image Optimization:** Bilder optimerade till .webp för bättre performance

## Deployment

Sidan är live på https://rodeluxesalong.se/ och deployas via Vercel med automatisk CI/CD från `main`.

**Säkerhet:** Kontaktformulär hanteras via Formspree utan behov av egen backend-server, vilket säkerställer att formulärdata hanteras säkert och effektivt.



## 🛠 Teknisk Stack & Arkitektur

- **Frontend:** Vanilla JS (ES6+) med fokus på hög prestanda och inga byggsteg
- **3D Grafik:** Three.js för en interaktiv och unik användarupplevelse
- **SEO & PWA:** Optimerad med metadata, sitemaps och webmanifest för mobilvänlighet
- **Deployment:** CI/CD via Vercel med automatisk form-hantering (Formspree)

## License

Proprietär källkods-tillgänglig licens – koden ägs av Omar Ahmad Alhaek och är licensierad exklusivt för produktionsbruk av Rodeluxe Frisörsalong. Se [LICENSE](LICENSE) för fullständiga villkor.
