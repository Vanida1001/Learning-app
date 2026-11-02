# 6. Mini-games

Nine mini-games, each unlocked by a module and each drilling exactly that module's notions. Every game lasts 1–3 minutes, gives XP, and keeps a personal best.

| Game | Unlocked by | How it plays | What it trains |
| --- | --- | --- | --- |
| **Champ lexical Sudoku** | Module 1 | A 4×4 grid of words; each row must contain one word from each of 4 champs lexicaux (mort, nature, amour, guerre). Drag words into place. | Champs lexicaux, connotation |
| **La Chasse aux figures** | Module 2 | Lines of verse scroll up; a figure name appears at top; click the lines containing it before they disappear. 3 lives, speed increases. | Recognising figures fast |
| **Le Compteur de syllabes** | Module 3 | A line of verse appears; tap once per syllable in rhythm, then confirm the total. Shows the correct decomposition. | Versification, e muet, diérèse |
| **Registre Roulette** | Module 4 | A wheel spins and lands on an excerpt; choose its registre among 4 before the timer ends. Combo multiplier for streaks. | Registres |
| **Formule Express** | Module 5 | Four shuffled cards (P, C, E, I) for one analysis; rebuild the sentence in the right order, against the clock. Wrong-type cards (paraphrase) are traps. | PCEI formula, anti-paraphrase |
| **Plan Puzzle** | Module 6 | Given a problématique and 9 idea cards, sort them into Axe I / Axe II / Hors sujet. Invalid axes (procédé names) must be discarded. | Building a valid plan |
| **Intro Builder** | Module 7 | Five sentence fragments (one per step) plus 3 decoys; assemble a correct introduction in order. Score = correct steps × speed bonus. | Intro algorithm |
| **Boss final : le Bac blanc** | Module 8 | A full text: 10 timed mixed questions (figures, genre, registre, problématique, plan, intro). Boss "health bar" drops with each right answer. | Everything |
| **Thèse ou Antithèse ?** | Module 9 | A dissertation sujet appears, then argument cards fly in one by one; swipe or click each into *Thèse*, *Antithèse* or *Hors sujet*. Bonus round: pick the best *Dépassement* among 3. | Analysing a sujet, dialectical plan, AEI |

**Game rules for Claude Code:**

- Each game is a self-contained object in `app.js` with `init()`, `render()`, `handleInput()`, `end()`; data lives in the content section.
- Every game ends with a **correction screen** linking each mistake to the related lesson ("Revoir : Leçon 2.1").
- Timers use `requestAnimationFrame` or `setInterval`, and are cleaned up when leaving the screen.
- Each game has at least 15 data items so rounds don't repeat too fast; items are shuffled.
- A **Mode révision** button on the home screen launches a random game from those unlocked.
