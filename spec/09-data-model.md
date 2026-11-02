# 9. Data model & code structure

`app.js` is split into clearly commented sections, in this order: content data, state, router, renderers, exercise engines, games, utilities, boot.

**Content shapes** (illustrative; Claude Code may extend them):

```js
const MODULES = [{
  id: 2, titre: "Les figures de style", jeu: "chasse-aux-figures",
  memo: "...",
  lessons: [{
    id: "2.1", titre: "Figures d'analogie", objectif: "...",
    blocs: [
      { type: "definition", titre: "Métaphore", html: "..." },
      { type: "theoreme",   titre: "...", html: "..." },
      { type: "exemple", extrait: "EXTRAIT_ALBATROS", etapes: ["...", "..."] },
      { type: "attention",  html: "..." }
    ],
    exercices: [
      { type: "qcm", question: "...", options: ["..."], reponse: 1, explication: "...", ref: "Th. 2.1" },
      { type: "highlight", extrait: "EXTRAIT_DORMEUR", consigne: "...", reponses: [3, 7, 12] }
    ]
  }],
  controle: [ /* 10 exercise objects */ ]
}];

const EXTRAITS = { EXTRAIT_ALBATROS: { auteur: "Baudelaire", titre: "L'Albatros", annee: 1859, texte: "..." } };
const FORMULES = [ /* entries for #/formulaire */ ];
const JEUX = { "chasse-aux-figures": { titre: "...", data: [ /* ≥ 15 items */ ] } };
const BADGES = [ { id: "zero-paraphrase", titre: "...", condition: (s) => ... } ];
```

**Saved state** (`localStorage`, key `theoremeDuTexte.v1`):

```js
{
  version: 1,
  xp: 0,
  streak: { count: 0, lastDay: "2026-11-02" },
  dailyGoal: 50, dailyXp: 0,
  lessons: { "2.1": { done: true, best: 0.92 } },
  controles: { "2": { best: 0.8 } },
  games: { "chasse-aux-figures": { best: 340, plays: 6 } },
  erreurs: [ { exId: "2.1#3", due: "2026-11-05", step: 1, correct: 0 } ],
  badges: ["premier-commentaire"],
  mesTextes: [ { id: "t1", titre: "Art", auteur: "Yasmina Reza", texte: "..." } ],
  settings: { theme: "system", controleTimer: null }
}
```

**Code quality rules:**

- One generic renderer per exercise type; no copy-pasted exercise code.
- State changes go through one `save()` function; the header (XP, streak) re-renders after every change.
- Escape any user-typed text before inserting it as HTML.
- Comments in English or French, consistent throughout.
