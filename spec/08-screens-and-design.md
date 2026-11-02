# 8. Screens & visual design

The look is a **squared maths notebook** (cahier à petits carreaux): grid-paper background, coloured textbook boxes, handwritten-style headings, clean sans-serif body text.

**Screens (routes):**

| Route | Screen | Contents |
| --- | --- | --- |
| `#/home` | Accueil | Course map (modules as nodes), Objectif du jour ring, "Continuer" button, Mode révision button |
| `#/module/:m` | Chapitre | Lesson list with stars, fiche-mémo link, Contrôle button (locked until all lessons done) |
| `#/module/:m/lesson/:l` | Leçon | Boxes in fixed order (see `05-lessons-and-exercises.md`), then exercises |
| `#/module/:m/controle` | Contrôle | 10 questions, no feedback until the end, then full correction |
| `#/games` | Salle de jeux | Grid of 9 game cards (locked ones greyed with "Débloqué par le Module X") |
| `#/game/:id` | Jeu | Game screen + correction screen |
| `#/formulaire` | Formulaire | All formulas and theorems from `04-mathematical-framework.md` on one page — like a maths *formulaire* — searchable |
| `#/erreurs` | Carnet d'erreurs | Items due for review today, then the rest |
| `#/mes-textes` | Mes textes | List of pasted class excerpts, an "Ajouter un texte" form (titre, auteur, texte), buttons to practise on any of them (highlight, PCEI, problématique, plan) |
| `#/profil` | Profil | XP, rank, level formula, badges, stats per module, reset progress (with confirmation) |

**Visual rules:**

- Box colours via CSS variables: Définition = blue, Théorème/Méthode = green, Exemple = grey, Attention = red, Formule = purple.
- Fonts: "Caveat" (headings, handwritten feel) and "Inter" or system sans-serif (body); excerpts in a serif ("Lora" or Georgia) with line numbers.
- Light and dark themes (toggle in header, follows system by default).
- Feedback animations: green flash + small "+10 XP" float for a right answer; gentle shake for a wrong one. Confetti on module completion. Respect `prefers-reduced-motion`.
- Accessibility: all interactive items reachable by keyboard; drag-and-drop exercises also work by click-click; colour never the only signal (✓ / ✗ icons too); contrast ≥ 4.5:1.
