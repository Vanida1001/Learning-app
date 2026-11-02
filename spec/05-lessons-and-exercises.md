# 5. Lessons & exercises

Every lesson follows the same fixed order, like a maths textbook page, and ends with exercises the student must pass to mark it complete.

**Lesson screen order:**

1. **Objectif** — one line: "À la fin, tu sauras…".
2. **Définition** box (blue).
3. **Théorème / Propriété / Méthode** box (green), with the formula from `04-mathematical-framework.md` when relevant.
4. **Exemple résolu** box (grey): an excerpt, then the solution revealed step by step ("Étape suivante" button).
5. **Attention** box (red): the classic mistake.
6. **Exercices** — 6+ items, mixed types.
7. **Bilan** — score, XP earned, button to the next lesson.

**Exercise types** (each one a generic renderer in `app.js`, driven by data):

| Type | What the student does | Auto-graded? |
| --- | --- | --- |
| `qcm` | Picks one answer among 3–4 | Yes |
| `multi` | Picks all correct answers | Yes (partial credit) |
| `highlight` | Clicks words in an excerpt (e.g. all words of the champ lexical of death) | Yes, compares to a word-index list |
| `match` | Links items in two columns (figure ↔ example) | Yes |
| `order` | Drags steps into the right order (intro steps, plan) | Yes |
| `fill` | Fills blanks in a PCEI sentence from dropdowns | Yes |
| `count` | Types a number (syllables, occurrences) | Yes |
| `pcei` | Builds an analysis by choosing one option for each of P, C, E, I | Yes, per term (out of 4) |
| `write` | Writes freely (an intro, a paragraph) | Self-assessed against a checklist + model answer |

**Rules for grading and feedback:**

- After each answer: immediate feedback, correct answer shown, and a one-sentence explanation referring to the theorem ("Rappel : Théorème 4.4 — un axe est une idée").
- For `write`: the app shows a checklist derived from the algorithm (e.g. "☐ amorce ☐ présentation ☐ situation ☐ problématique ☐ annonce du plan"), the student ticks what they included, then sees a *corrigé*. Also a simple keyword check: e.g. the intro must contain a question mark and "d'abord"/"puis" or similar; missing items are flagged.
- Wrong answers go into a **Carnet d'erreurs** (error notebook) for spaced review: an item reappears after 1, 3 and 7 days until answered correctly twice.
- Score per lesson = % correct; stars: ★ ≥ 50 %, ★★ ≥ 70 %, ★★★ ≥ 90 %.
- **Contrôles are untimed** (the goal is building habits, not speed). Keep the code ready for an optional time limit later: a `settings.controleTimer` value, `null` by default, with no timer shown when it is `null`.
