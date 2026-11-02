# Le Théorème du Texte — Spécification (index)

A French-learning web app for a *seconde* student: text analysis, commentaire, introduction/conclusion, dissertation — taught like maths, with lessons, exercises and mini-games. Built in three files: `index.html`, `styles.css`, `app.js`.

Read the files in this order:

- [`01-vision.md`](01-vision.md) — **1. Vision & objectives**: What the app is, who it's for, the "French like maths" philosophy
- [`02-technical-constraints.md`](02-technical-constraints.md) — **2. Technical constraints**: 3 files, vanilla JS, localStorage, public-domain texts only
- [`03-curriculum.md`](03-curriculum.md) — **3. Curriculum — 10 modules, 33 lessons**: 10 modules, 33 lessons, class texts (Bel-Ami, Art), Mes textes
- [`04-mathematical-framework.md`](04-mathematical-framework.md) — **4. The mathematical framework**: All formulas, theorems and algorithms (PCEI, plan, intro, conclusion, dissertation)
- [`05-lessons-and-exercises.md`](05-lessons-and-exercises.md) — **5. Lessons & exercises**: Lesson page order, 9 exercise types, grading, Carnet d'erreurs
- [`06-mini-games.md`](06-mini-games.md) — **6. Mini-games**: 9 mini-games and their rules
- [`07-gamification.md`](07-gamification.md) — **7. Gamification & progression**: XP, levels, ranks, badges, streaks
- [`08-screens-and-design.md`](08-screens-and-design.md) — **8. Screens & visual design**: Routes/screens, notebook look, accessibility
- [`09-data-model.md`](09-data-model.md) — **9. Data model & code structure**: Content data shapes, saved state, code-quality rules
- [`10-build-plan-and-acceptance.md`](10-build-plan-and-acceptance.md) — **10. Acceptance criteria & build plan for Claude Code**: 4 build passes, acceptance checklist, prompt for Claude Code, decisions

**Prompt to give Claude Code** (copy-paste):

> Read every file in the `spec/` folder, starting with `spec/00-index.md`. Build the app in three files only — `index.html`, `styles.css`, `app.js` — at the project root, in vanilla HTML/CSS/JS, following the 4 build passes in `spec/10-build-plan-and-acceptance.md`. All in-app text is in French. Teach every method as a formula, theorem or algorithm (`spec/04-mathematical-framework.md`). After each pass, list what is done and what's next, and check the acceptance checklist before finishing.
