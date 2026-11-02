# 2. Technical constraints

The app is exactly **three files**, runs by opening `index.html` in a browser, and needs no server, build step or internet connection after loading.

| File | Responsibility |
| --- | --- |
| `index.html` | Page skeleton: header (logo, XP bar, streak), navigation, one `<main id="app">` container, modal container. Loads `styles.css` and `app.js`. No inline scripts or styles. |
| `styles.css` | All styling: theme variables, layout, cards, "maths textbook" boxes (Définition, Théorème, Méthode, Exemple, Attention), game screens, animations, dark mode, responsive rules. |
| `app.js` | All content (lessons, exercises, game data), state, routing, rendering, scoring, mini-game logic, localStorage persistence. |

**Rules:**

- Vanilla HTML, CSS and JavaScript (ES2020+). No frameworks, no libraries, no CDN. Optional exception: Google Fonts link in `index.html`.
- Progress saved in `localStorage` under one key (`theoremeDuTexte.v1`), wrapped in try/catch; the app must still work if storage is unavailable.
- Hash-based routing (`#/home`, `#/module/3/lesson/2`, `#/game/chasse-aux-figures`) so the browser back button works.
- Works on a phone (≥ 360 px wide) and a laptop. No horizontal scroll.
- All texts to analyse are **public-domain** French literature (authors dead before 1955: Hugo, Baudelaire, Maupassant, Zola, Rimbaud, Verlaine, Molière, Racine, La Fontaine, Flaubert, Apollinaire…). Excerpts kept short (≤ 25 lines). Exception: works from the student's class list that are still under copyright (e.g. Reza, *Art*) are **never** reproduced in `app.js`; they are handled through the *Mes textes* feature (see `03-curriculum.md`).
- Content lives in clearly separated data objects at the top of `app.js` so new lessons and exercises can be added without touching logic.
