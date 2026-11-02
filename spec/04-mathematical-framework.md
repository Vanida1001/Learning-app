# 4. The mathematical framework

Every method in the app is presented as a formula, theorem or algorithm, displayed in styled boxes like a maths textbook. These are the canonical versions Claude Code must implement (wording in French in the app).

### 4.1 Axiome 1 — the analysis formula (PCEI)

```
Analyse = Procédé + Citation + Effet + Interprétation
```

*Théorème de non-paraphrase:* if the Procédé term = 0, the sentence is paraphrase and scores 0, whatever the other terms. The app's PCEI exercises grade each term separately (1 point each, out of 4).

### 4.2 Fonction de connotation

A word has a value *dénotation* (dictionary sense) and a value *connotation* (positive +, negative −, or neutral 0). A **champ lexical** is a set: CL(mort) = {tombe, sombre, froid, linceul…}. Its weight in a text = number of elements found. Exercises ask the student to "compute" the dominant champ lexical (the set with the largest cardinal).

### 4.3 Équation de la problématique

```
Problématique = Comment + auteur + procédés dominants + effet/visée
```

Example: *Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre dans « Le Dormeur du val » ?*

### 4.4 Théorème du plan

- A plan = 2 or 3 **axes**; each axe = 2 or 3 **sous-parties**; each sous-partie = 1 or more PCEI analyses.
- **Condition de validité:** each axe is an interpretation (an *idea*), never a procédé or a line range. "I. Les figures de style" is invalid; "I. Un paysage idyllique" is valid.
- **Progression:** axe I → axe II goes from the most visible meaning to the deepest one (évident → implicite).

### 4.5 Algorithme de l'introduction (5 étapes)

1. **Amorce** — context: author, movement, era (1–2 sentences).
2. **Présentation du texte** — title, genre, date, place in the work.
3. **Résumé/situation** — what happens in the excerpt (1 sentence).
4. **Problématique** — one question (formula 4.3).
5. **Annonce du plan** — "Nous verrons d'abord…, puis…, enfin…".

Function: `Intro = f(amorce, présentation, situation, problématique, plan)`. Missing any input → incomplete output; the app's checker names the missing step.

### 4.6 Algorithme de la conclusion (3 étapes)

1. **Bilan** — answer the problématique by summarising the axes.
2. **Réponse nette** — one sentence that directly answers the question.
3. **Ouverture** — link to another work, author or theme (optional but rewarded).

### 4.7 Arbre de décision des genres et registres

A flowchart the student follows: *Le texte est-il en vers ? → oui → poésie (ou théâtre en vers : y a-t-il des personnages/didascalies ?) → non → récit / théâtre / argumentation*. Then a second tree for registres based on the dominant émotion. Render it as an interactive step-by-step tree (one question per click).

### 4.8 Calcul des syllabes (poésie)

Rules as "propriétés": e muet counted before a consonant, elided before a vowel and at line end; diérèse/synérèse. Alexandrin = 12, décasyllabe = 10, octosyllabe = 8. Exercises: count the syllables, the app shows the decomposition `Je / se / rai / la / ...` as a worked solution.

### 4.9 Algorithme de la dissertation

**Analyse du sujet:** split the sujet into mots-clés, define each one, find what is implied (présupposés), reformulate the sujet in your own words.

```
Paragraphe argumentatif = Argument + Exemple + Interprétation   (AEI)
```

*Théorème du plan dialectique:* for a sujet that asks "Pensez-vous que… ?", plan = I. Thèse (oui, parce que…) → II. Antithèse (mais, limites…) → III. Dépassement (synthèse). Condition: III is a new idea, never "un peu des deux".

*Propriété:* every exemple must come from a précise work (title + author + passage), never an invented one. The app's checker flags an argument with no exemple as "démonstration incomplète".
