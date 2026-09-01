# Vlad Kolosov — CV & Portfolio

Static personal website: CV + professional T&D / L&D / People Development portfolio.
Plain **HTML + CSS + vanilla JavaScript** — no framework, no build step, no backend.
Runs directly on GitHub Pages.

**Live:** https://kvlrkvlo-stack.github.io/experience/

## Pages

| File | Purpose | URL |
| --- | --- | --- |
| `index.html` | Home — redirects to the Russian CV | `/experience/` |
| `cv_ru.html` | Russian CV (default) | `/experience/cv_ru.html` |
| `cv_en.html` | English CV | `/experience/cv_en.html` |
| `portfolio_ru.html` | Russian portfolio | `/experience/portfolio_ru.html` |
| `portfolio_en.html` | English portfolio | `/experience/portfolio_en.html` |

## Structure

```
experience/
├── index.html            Home — redirects to cv_ru.html
├── cv_ru.html            RU CV (default)
├── cv_en.html            EN CV
├── portfolio_ru.html     RU portfolio
├── portfolio_en.html     EN portfolio
├── .nojekyll             disable Jekyll processing on Pages
├── README.md
└── assets/
    ├── css/  base.css · cv.css · portfolio.css
    ├── js/   portfolio.js   (accordions, lightbox, scrollspy, resilient galleries)
    ├── photo/              profile.jpg
    ├── performance/        Case 01 images
    ├── assessment360/      Case 02 images
    ├── onboarding/         Case 03 images
    └── learning-ecosystem/ Case 04 images
```

## Design system

- **Fonts:** system grotesque stack — `"Helvetica Neue", Arial, "Segoe UI", sans-serif` (no web-font download).
- **Palette:** dark UI with a violet accent `#7F6ACC`; card/surface `#1E1E1E` (`assets/css/base.css` → `:root`).
  Print styles force a light, ink-friendly version.
- All corners use a **5px** radius; the only round element is the CV photo cut-out area.
- Fully **responsive** (CV collapses to one column, portfolio nav scrolls horizontally) and
  **printable** (`Print / PDF` button; accordions/`<details>` auto-expand for print).
