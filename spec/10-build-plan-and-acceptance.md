# 10. Acceptance criteria & build plan for Claude Code

The build is done when every box below is ticked. Because the content is large, Claude Code should build in **4 passes** and check each one in the browser before moving on.

**Build passes:**

1. **Skeleton** — 3 files, router, header, theme toggle, home map, profile, localStorage save/load. Modules 0–1 fully written.
2. **Exercise engine** — all 9 exercise types, feedback, stars, XP, Contrôle, Carnet d'erreurs. Modules 2–4 written.
3. **Games** — 8 of the 9 mini-games (Thèse ou Antithèse ? comes in pass 4), Salle de jeux, Mode révision, badges. Modules 5–6 written.
4. **Finish** — Modules 7–9 (incl. dissertation and the Thèse ou Antithèse ? game), Mes textes page, Formulaire page, fiches-mémo with print CSS, dark mode polish, accessibility pass.

**Acceptance checklist:**

- [ ] Opening `index.html` directly (file://) works with no console errors.
- [ ] Only three files: `index.html`, `styles.css`, `app.js`.
- [ ] 10 modules (0–9), 33 lessons, each with Définition, Théorème/Méthode, Exemple résolu, Attention and ≥ 6 exercises.
- [ ] Every module has a 10-question Contrôle and a printable fiche-mémo.
- [ ] All formulas from `04-mathematical-framework.md` appear in lessons **and** on the Formulaire page.
- [ ] All 9 exercise types work, by mouse, touch and keyboard.
- [ ] All 9 mini-games playable, each with ≥ 15 items and a correction screen.
- [ ] Module and game unlocking works (≥ 70 % rule).
- [ ] XP, levels, ranks, streak, daily goal and badges update correctly and survive a page reload.
- [ ] Carnet d'erreurs schedules reviews at 1, 3 and 7 days.
- [ ] Layout works at 360 px and 1440 px wide, light and dark themes.
- [ ] All excerpts in the code are public domain and correctly attributed; *Bel-Ami* has ≥ 4 excerpts; nothing from *Art* is quoted.
- [ ] Mes textes: paste, save, reload and practise on a custom excerpt.
- [ ] Contrôles are untimed (`controleTimer: null`).

**Prompt to give Claude Code** (copy-paste):

> Read every file in the `spec/` folder, starting with `spec/00-index.md`. Build the app in three files only — `index.html`, `styles.css`, `app.js` — in vanilla HTML/CSS/JS, following the 4 build passes in `10-build-plan-and-acceptance.md`. All in-app text is in French. Teach every method as a formula, theorem or algorithm (see `04-mathematical-framework.md`). After each pass, list what is done and what's next, and check the acceptance checklist before finishing.

**Decisions (answered by the student, 2 Nov 2026):**

- Class reading list: add *Art* (Yasmina Reza) and *Bel-Ami* (Guy de Maupassant). More texts will be added later, once studied in class.
- Dissertation: its own module now (Module 9).
- Contrôles: untimed for now — the point is to build habits and get better; time limits can be added later.
