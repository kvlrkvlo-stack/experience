# Vlad Kolosov — CV & Portfolio

Static personal website: CV + professional T&D / L&D / People Development portfolio.
Plain **HTML + CSS + vanilla JavaScript** — no framework, no build step, no backend.
Runs directly on GitHub Pages.

**Live:** https://kvlrkvlo-stack.github.io/experience/

## Pages

| File | Purpose | URL |
| --- | --- | --- |
| `index.html` | English CV (home) | `/experience/` |
| `cv_ru.html` | Russian CV | `/experience/cv_ru.html` |
| `portfolio_en.html` | English portfolio | `/experience/portfolio_en.html` |
| `portfolio_ru.html` | Russian portfolio | `/experience/portfolio_ru.html` |

## Structure

```
experience/
├── index.html            EN CV
├── cv_ru.html            RU CV
├── portfolio_en.html     EN portfolio
├── portfolio_ru.html     RU portfolio
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

## Portfolio cases

1. **Performance & Career Architecture** — ONY
2. **360° Assessment & HR Automation** — ONY
3. **Onboarding & People Development** — TECHNORED
4. **Learning Ecosystem & HR Tech** — ONY + AppScience
5. **Learning at Scale** — LUSH

Where real screenshots do not exist, cases use native HTML/CSS visualizations
(9-box matrix, L&D operating model, HR Tech architecture, org cascade, employee journeys,
metric cards) — a deliberate editorial choice, not placeholders.

## Replacing placeholder images

The image files currently in `assets/<case>/` are **placeholders**. To publish a real screenshot,
overwrite the file at the same path (keep the same filename) — the galleries pick it up automatically.
The gallery script hides any tile whose image fails to load, so removing a file never leaves a broken
image. Some case galleries auto-size by image count (1–2 → large editorial, 3–4 → grid).

## Run locally

Any static server works. For example, with Python:

```bash
py -m http.server 8000
```

Then open http://localhost:8000/ (EN CV) or http://localhost:8000/cv_ru.html.

## Enable GitHub Pages

1. Push this repository to `kvlrkvlo-stack/experience` (default branch `main`).
2. GitHub → repo **Settings → Pages**.
3. **Build and deployment → Source:** *Deploy from a branch*.
4. **Branch:** `main`, **folder:** `/ (root)` → **Save**.
5. Wait ~1 minute; the site appears at https://kvlrkvlo-stack.github.io/experience/.

`.nojekyll` is included so Pages serves files as-is.

## TODO

- Add a **LinkedIn** URL (placeholder in both CVs).
- Add an **Education** section (left as an HTML comment in both CVs — no data invented).
- Replace placeholder screenshots with real ones as they become available.
