/* =====================================================================
   Le Théorème du Texte — app.js
   Sections : 1 contenu · 2 état · 3 routeur · 4 rendus · 5 exercices ·
              6 jeux · 7 utilitaires · 8 démarrage
   Langue de l'interface et des commentaires : français.
   ===================================================================== */
'use strict';

/* ===================== 1. CONTENU ===================== */

// --- Constructeurs de blocs de leçon ---
const D = (titre, html) => ({ type: 'definition', titre, html });
const T = (genre, titre, html) => ({ type: 'theoreme', genre, titre, html });
const F = (titre, formule, html = '') => ({ type: 'formule', titre, formule, html });
const X = (extrait, etapes, intro = '') => ({ type: 'exemple', extrait, etapes, intro });
const A = (html) => ({ type: 'attention', html });
const AR = (cle) => ({ type: 'arbre', cle });

// --- Constructeurs d'exercices (un par type, voir section 5) ---
const qcm = (question, options, reponse, explication, ref, extrait) => ({ type: 'qcm', question, options, reponse, explication, ref, extrait });
const multi = (question, options, reponse, explication, ref, extrait) => ({ type: 'multi', question, options, reponse, explication, ref, extrait });
const hl = (extrait, consigne, mots, explication, ref) => ({ type: 'highlight', extrait, consigne, mots, explication, ref });
const match = (consigne, paires, explication, ref) => ({ type: 'match', consigne, paires, explication, ref });
const order = (consigne, items, explication, ref) => ({ type: 'order', consigne, items, explication, ref });
const fill = (texte, blancs, explication, ref) => ({ type: 'fill', texte, blancs: blancs.map(([o, a]) => ({ o, a })), explication, ref });
const count = (question, reponse, decomposition, explication, ref, extrait) => ({ type: 'count', question, reponse, decomposition, explication, ref, extrait });
const pcei = (consigne, texte, P, C, E, I, explication, ref) => ({ type: 'pcei', consigne, texte, termes: [P, C, E, I].map(([o, a]) => ({ o, a })), explication, ref });
const write = (consigne, checklist, corrige, ref) => ({ type: 'write', consigne, checklist, corrige, ref });

// --- Modules (remplis plus bas par mod()) ---
const MODULES = [];
const mod = (id, titre, jeu, memo, lessons, controle) => MODULES.push({ id, titre, jeu, memo, lessons, controle });
const LESSON = (id, titre, objectif, blocs, exercices) => ({ id, titre, objectif, blocs, exercices });


// --- Extraits : textes du domaine public (auteurs morts avant 1955). ---
// prose:true → le texte est découpé en lignes numérotées automatiquement.
// resume:true → texte de l'application (résumé), jamais une citation.
// « Art » (Yasmina Reza, 1994) est protégé : AUCUN extrait ici ; voir « Mes textes ».
const EXTRAITS = {
  ALBATROS: { auteur: 'Charles Baudelaire', titre: "L'Albatros", annee: 1859, oeuvre: 'Les Fleurs du mal', texte:
`Souvent, pour s'amuser, les hommes d'équipage
Prennent des albatros, vastes oiseaux des mers,
Qui suivent, indolents compagnons de voyage,
Le navire glissant sur les gouffres amers.

À peine les ont-ils déposés sur les planches,
Que ces rois de l'azur, maladroits et honteux,
Laissent piteusement leurs grandes ailes blanches
Comme des avirons traîner à côté d'eux.

Ce voyageur ailé, comme il est gauche et veule !
Lui, naguère si beau, qu'il est comique et laid !
L'un agace son bec avec un brûle-gueule,
L'autre mime, en boitant, l'infirme qui volait !

Le Poète est semblable au prince des nuées
Qui hante la tempête et se rit de l'archer ;
Exilé sur le sol au milieu des huées,
Ses ailes de géant l'empêchent de marcher.` },

  DEMAIN: { auteur: 'Victor Hugo', titre: 'Demain, dès l\'aube…', annee: 1856, oeuvre: 'Les Contemplations', texte:
`Demain, dès l'aube, à l'heure où blanchit la campagne,
Je partirai. Vois-tu, je sais que tu m'attends.
J'irai par la forêt, j'irai par la montagne.
Je ne puis demeurer loin de toi plus longtemps.

Je marcherai les yeux fixés sur mes pensées,
Sans rien voir au dehors, sans entendre aucun bruit,
Seul, inconnu, le dos courbé, les mains croisées,
Triste, et le jour pour moi sera comme la nuit.

Je ne regarderai ni l'or du soir qui tombe,
Ni les voiles au loin descendant vers Harfleur,
Et quand j'arriverai, je mettrai sur ta tombe
Un bouquet de houx vert et de bruyère en fleur.` },

  DORMEUR: { auteur: 'Arthur Rimbaud', titre: 'Le Dormeur du val', annee: 1870, oeuvre: 'Cahier de Douai', texte:
`C'est un trou de verdure où chante une rivière
Accrochant follement aux herbes des haillons
D'argent ; où le soleil, de la montagne fière,
Luit : c'est un petit val qui mousse de rayons.

Un soldat jeune, bouche ouverte, tête nue,
Et la nuque baignant dans le frais cresson bleu,
Dort ; il est étendu dans l'herbe, sous la nue,
Pâle dans son lit vert où la lumière pleut.

Les pieds dans les glaïeuls, il dort. Souriant comme
Sourirait un enfant malade, il fait un somme :
Nature, berce-le chaudement : il a froid.

Les parfums ne font pas frissonner sa narine ;
Il dort dans le soleil, la main sur sa poitrine,
Tranquille. Il a deux trous rouges au côté droit.` },

  CHANSON: { auteur: 'Paul Verlaine', titre: "Chanson d'automne", annee: 1866, oeuvre: 'Poèmes saturniens', texte:
`Les sanglots longs
Des violons
De l'automne
Blessent mon cœur
D'une langueur
Monotone.

Tout suffocant
Et blême, quand
Sonne l'heure,
Je me souviens
Des jours anciens
Et je pleure ;

Et je m'en vais
Au vent mauvais
Qui m'emporte
Deçà, delà,
Pareil à la
Feuille morte.` },

  LOUP: { auteur: 'Jean de La Fontaine', titre: "Le Loup et l'Agneau", annee: 1668, oeuvre: 'Fables, livre I', texte:
`La raison du plus fort est toujours la meilleure :
Nous l'allons montrer tout à l'heure.
Un Agneau se désaltérait
Dans le courant d'une onde pure.
Un Loup survient à jeun, qui cherchait aventure,
Et que la faim en ces lieux attirait.
« Qui te rend si hardi de troubler mon breuvage ?
Dit cet animal plein de rage :
Tu seras châtié de ta témérité.
– Sire, répond l'Agneau, que Votre Majesté
Ne se mette pas en colère ;
Mais plutôt qu'elle considère
Que je me vas désaltérant
Dans le courant,
Plus de vingt pas au-dessous d'Elle,
Et que par conséquent, en aucune façon,
Je ne puis troubler sa boisson.` },

  // --- Bel-Ami (Maupassant, 1885) : œuvre au programme de la classe ---
  BELAMI1: { auteur: 'Guy de Maupassant', titre: 'Bel-Ami, I, 1 (ouverture)', annee: 1885, oeuvre: 'Bel-Ami', programme: true, prose: true, texte:
`Quand la caissière lui eut rendu la monnaie de sa pièce de cent sous, Georges Duroy sortit du restaurant. Comme il portait beau par nature et par pose d'ancien sous-officier, il cambra sa taille, frisa sa moustache d'un geste militaire et familier, et jeta sur les dîneurs attardés un regard rapide et circulaire, un de ces regards de joli garçon, qui s'étendent comme des coups d'épervier.` },

  BELAMI2: { auteur: 'Guy de Maupassant', titre: 'Bel-Ami, I, 1 (la nuit parisienne)', annee: 1885, oeuvre: 'Bel-Ami', programme: true, prose: true, texte:
`C'était une de ces soirées d'été où l'air manque dans Paris. La ville, chaude comme une étuve, semblait suer dans la nuit étouffante. Les égouts soufflaient par leurs bouches de granit leurs haleines empestées, et les cuisines souterraines jetaient à la rue, par leurs fenêtres basses, les miasmes infâmes des eaux de vaisselle et des vieilles sauces.` },

  BELAMI3: { auteur: 'Résumé de l\'application (d\'après Maupassant)', titre: 'Bel-Ami — le premier article de Duroy', annee: 1885, oeuvre: 'Bel-Ami', programme: true, resume: true, prose: true, texte:
`Résumé, pas une citation. Georges Duroy, journaliste débutant, doit écrire « Souvenirs d'un chasseur d'Afrique » pour La Vie française. Incapable d'aller au-delà de quelques lignes, il est aidé par Madeleine Forestier, l'épouse de son ami, qui le guide avec intelligence. Pour retrouver le vrai texte, colle-le dans « Mes textes ».` },

  BELAMI4: { auteur: 'Résumé de l\'application (d\'après Maupassant)', titre: 'Bel-Ami — la fin du roman', annee: 1885, oeuvre: 'Bel-Ami', programme: true, resume: true, prose: true, texte:
`Résumé, pas une citation. À la fin du roman, Georges Duroy, devenu riche et puissant, épouse Suzanne Walter, la fille de son patron, à l'église de la Madeleine. L'ambitieux sans scrupule a réussi : le roman ne le punit pas. Pour retrouver le vrai texte, colle-le dans « Mes textes ».` },

  AVARE: { auteur: 'Molière', titre: "L'Avare, IV, 7 (monologue d'Harpagon)", annee: 1668, oeuvre: "L'Avare", prose: true, texte:
`Au voleur ! au voleur ! à l'assassin ! au meurtrier ! Justice, juste ciel ! Je suis perdu, je suis assassiné, on m'a coupé la gorge, on m'a dérobé mon argent ! Qui peut-ce être ? Qu'est-il devenu ? Où est-il ? Où se cache-t-il ? Que ferai-je pour le trouver ? Où courir ? Où ne pas courir ? N'est-il point là ? N'est-il point ici ? Qui est-ce ? Arrête. Rends-moi mon argent, coquin.` },

  PHEDRE: { auteur: 'Jean Racine', titre: 'Phèdre, I, 3 (l\'aveu)', annee: 1677, oeuvre: 'Phèdre', texte:
`Mon mal vient de plus loin. À peine au fils d'Égée
Sous les lois de l'hymen je m'étais engagée,
Mon repos, mon bonheur semblait être affermi,
Athènes me montra mon superbe ennemi :
Je le vis, je rougis, je pâlis à sa vue ;
Un trouble s'éleva dans mon âme éperdue ;
Mes yeux ne voyaient plus, je ne pouvais parler ;
Je sentis tout mon corps et transir et brûler.` },

  CANDIDE: { auteur: 'Voltaire', titre: 'Candide, chapitre 3', annee: 1759, oeuvre: 'Candide', prose: true, texte:
`Rien n'était si beau, si leste, si brillant, si bien ordonné que les deux armées. Les trompettes, les fifres, les hautbois, les tambours, les canons, formaient une harmonie telle qu'il n'y en eut jamais en enfer. Les canons renversèrent d'abord à peu près six mille hommes de chaque côté ; ensuite la mousqueterie ôta du meilleur des mondes environ neuf à dix mille coquins qui en infectaient la surface.` },

  GERMINAL: { auteur: 'Émile Zola', titre: 'Germinal, I, 1 (ouverture)', annee: 1885, oeuvre: 'Germinal', prose: true, texte:
`Dans la plaine rase, sous la nuit sans étoiles, d'une obscurité et d'une épaisseur d'encre, un homme suivait seul la grande route de Marchiennes à Montsou, dix kilomètres de pavé coupant tout droit, à travers les champs de betteraves. Devant lui, il ne voyait même pas le sol noir, et il n'avait la sensation de l'immense horizon plat que par les souffles du vent de mars, des rafales larges comme sur une mer, glacées d'avoir balayé des lieues de marais et de terres nues.` },

  WATERLOO: { auteur: 'Victor Hugo', titre: "L'Expiation (Waterloo)", annee: 1853, oeuvre: 'Les Châtiments', texte:
`Waterloo ! Waterloo ! Waterloo ! morne plaine !
Comme une onde qui bout dans une urne trop pleine,
Dans ton cirque de bois, de coteaux, de vallons,
La pâle mort mêlait les sombres bataillons.` }
};

// Contexte de « Art » (Yasmina Reza, 1994) : résumé sans citation.
const ART_CONTEXTE = "Trois amis, Serge, Marc et Yvan. Serge achète très cher un tableau entièrement blanc. Marc, scandalisé, juge l'achat ridicule ; Yvan, pris entre les deux, tente de ménager chacun. La dispute sur le tableau révèle les non-dits de l'amitié : c'est une comédie construite sur une querelle entre amis.";


// --- Formulaire : toutes les formules, théorèmes et algorithmes (page #/formulaire) ---
// lecon = [module, leçon] pour le lien « Revoir ».
const FORMULES = [
  { id: "ax0", titre: "Axiome 0 — Lecture", formule: "Lecture = Qui + Quoi + Quand + Où + Comment", texte: "Les 5 questions de départ : contexte (qui, quoi, quand, où) puis manière d'écrire (comment).", lecon: [0, 1] },
  { id: "4.1", titre: "4.1 Axiome 1 — La formule d'analyse (PCEI)", formule: "Analyse = Procédé + Citation + Effet + Interprétation", texte: "<b>Théorème de non-paraphrase :</b> si le terme Procédé vaut 0, la phrase est une paraphrase et vaut 0, quels que soient les autres termes. Chaque terme vaut 1 point (sur 4).", lecon: [5, 1] },
  { id: "4.2", titre: "4.2 Fonction de connotation", formule: "CL(mort) = {tombe, sombre, froid…} ; poids(CL) = card(CL)", texte: "Un mot a une dénotation (sens du dictionnaire) et une connotation (+, − ou 0). Le champ lexical dominant est celui de plus grand cardinal.", lecon: [1, 1] },
  { id: "4.3", titre: "4.3 Équation de la problématique", formule: "Problématique = Comment + auteur + procédés dominants + effet/visée", texte: "Exemple : <i>Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre dans « Le Dormeur du val » ?</i>", lecon: [6, 1] },
  { id: "4.4", titre: "4.4 Théorème du plan", formule: "Plan = 2 ou 3 axes ; axe = 2 ou 3 sous-parties ; sous-partie = ≥ 1 analyse PCEI", texte: "<b>Condition de validité :</b> chaque axe est une <i>idée</i> (interprétation), jamais un procédé ni un numéro de vers. « I. Les figures de style » est invalide ; « I. Un paysage idyllique » est valide. <b>Progression :</b> de l'évident à l'implicite.", lecon: [6, 2] },
  { id: "4.5", titre: "4.5 Algorithme de l'introduction", formule: "Intro = f(amorce, présentation, situation, problématique, annonce du plan)", texte: "1. Amorce · 2. Présentation du texte · 3. Résumé/situation · 4. Problématique · 5. Annonce du plan (« Nous verrons d'abord…, puis… »). Une étape manquante = introduction incomplète.", lecon: [7, 1] },
  { id: "4.6", titre: "4.6 Algorithme de la conclusion", formule: "Conclusion = Bilan + Réponse nette + Ouverture", texte: "1. Bilan des axes · 2. Réponse nette à la problématique en une phrase · 3. Ouverture (autre œuvre, auteur ou thème) — facultative mais récompensée.", lecon: [7, 2] },
  { id: "4.7", titre: "4.7 Arbre de décision des genres et registres", formule: "vers ? → poésie / théâtre en vers · sinon récit / théâtre / argumentation", texte: "Un arbre interactif pour le genre, un second pour le registre selon l'émotion dominante.", lecon: [0, 2], arbre: true },
  { id: "4.8", titre: "4.8 Calcul des syllabes", formule: "Alexandrin = 12 · Décasyllabe = 10 · Octosyllabe = 8", texte: "Le e muet compte devant une consonne ; il s'élide devant une voyelle et en fin de vers. Diérèse : on sépare (vi-o-lons) ; synérèse : on réunit (rivière).", lecon: [3, 2] },
  { id: "4.9a", titre: "4.9 Analyse du sujet de dissertation", formule: "Sujet → mots-clés → définitions → présupposés → reformulation", texte: "On découpe le sujet en mots-clés, on définit chacun, on cherche ce qui est sous-entendu, puis on reformule le sujet.", lecon: [9, 1] },
  { id: "4.9b", titre: "4.9 Paragraphe argumentatif (AEI)", formule: "Paragraphe argumentatif = Argument + Exemple + Interprétation", texte: "<b>Propriété :</b> tout exemple vient d'une œuvre précise (titre + auteur + passage), jamais d'un exemple inventé. Argument sans exemple = « démonstration incomplète ».", lecon: [9, 3] },
  { id: "4.9c", titre: "4.9 Théorème du plan dialectique", formule: "I. Thèse (oui, parce que…) → II. Antithèse (mais…) → III. Dépassement", texte: "Pour un sujet du type « Pensez-vous que… ? ». <b>Condition :</b> le III est une idée nouvelle, jamais « un peu des deux ».", lecon: [9, 2] }
];

// --- Arbres de décision interactifs (une question par clic) ---
// Un nœud : {q, oui, non} ; une feuille : {res}.
const ARBRES = {
  genres: { titre: "Quel est le genre du texte ?", debut: "n1", noeuds: {
    n1: { q: "Le texte est-il en vers ?", oui: "n2", non: "n3" },
    n2: { q: "Y a-t-il des personnages qui se répondent, avec des didascalies ?", oui: { res: "Théâtre en vers (ex. Racine, Phèdre)" }, non: { res: "Poésie (ex. Baudelaire, L'Albatros)" } },
    n3: { q: "Des personnages se répondent-ils, avec des didascalies ?", oui: { res: "Théâtre (ex. Molière, L'Avare)" }, non: "n4" },
    n4: { q: "Un narrateur raconte-t-il une histoire ?", oui: { res: "Récit (ex. Maupassant, Bel-Ami)" }, non: { res: "Argumentation : cherche la thèse et les arguments" } } } },
  registres: { titre: "Quel est le registre dominant ?", debut: "r1", noeuds: {
    r1: { q: "Le texte cherche-t-il à faire rire ?", oui: "r2", non: "r3" },
    r2: { q: "Se moque-t-il d'un défaut ou d'une société pour la critiquer ?", oui: { res: "Satirique (ironique si l'on dit le contraire de ce qu'on pense)" }, non: { res: "Comique" } },
    r3: { q: "Le locuteur exprime-t-il ses sentiments personnels (je) ?", oui: "r4", non: "r5" },
    r4: { q: "Cherche-t-il surtout à émouvoir, à faire pleurer ?", oui: { res: "Pathétique" }, non: { res: "Lyrique" } },
    r5: { q: "Un destin fatal écrase-t-il le personnage ?", oui: { res: "Tragique" }, non: "r6" },
    r6: { q: "Y a-t-il un héros, des exploits, un grandissement des faits ?", oui: { res: "Épique" }, non: "r7" },
    r7: { q: "Un événement inexplicable trouble-t-il le réel ?", oui: { res: "Fantastique" }, non: { res: "Réaliste (le réel décrit avec précision)" } } } }
};


// ---------- MODULE 0 — Axiomes : lire un texte ----------
mod(0, "Axiomes — Lire un texte", null,
`<h3>Fiche-mémo — Axiomes</h3>
<div class="box for"><div class="bt">Axiome 0</div><div class="formula">Lecture = Qui + Quoi + Quand + Où + Comment</div></div>
<ul><li><b>Genre</b> : récit, poésie, théâtre, argumentation. <b>Registre</b> : la tonalité (lyrique, comique…).</li>
<li><b>Situation d'énonciation</b> : qui parle, à qui, quand, où.</li>
<li><b>Thème</b> = sujet général (nom). <b>Problématique</b> = question « Comment… ? » précise.</li>
<li>Méthode : lire en entier → poser les 5 questions → relever les indices → formuler une idée générale.</li></ul>`,
[
LESSON("0.1", "Les 5 questions de départ", "À la fin, tu sauras interroger n'importe quel texte avec Qui ? Quoi ? Quand ? Où ? Comment ?", [
  D("Les 5 questions", "<p>Avant toute analyse, on <b>interroge</b> le texte : <b>Qui</b> parle ou agit ? <b>Quoi</b> (que se passe-t-il) ? <b>Quand</b> ? <b>Où</b> ? <b>Comment</b> (de quelle manière est-ce écrit) ?</p>"),
  F("Axiome 0 — la formule de lecture", "Lecture = Qui + Quoi + Quand + Où + Comment", "<p>Les quatre premiers termes donnent le <i>contexte</i> ; le dernier, <b>Comment</b>, prépare l'analyse (les procédés d'écriture).</p>"),
  T("Méthode", "Algorithme de lecture", "<ol><li>Lire le texte en entier.</li><li>Poser les 5 questions.</li><li>Relever les indices dans le texte.</li><li>Formuler une première idée générale.</li></ol>"),
  X("BELAMI1", ["<b>Qui ?</b> Georges Duroy, un ancien sous-officier (le narrateur parle de lui à la 3<sup>e</sup> personne).", "<b>Quoi ?</b> Il sort du restaurant et jette un regard sur les clients.", "<b>Quand / Où ?</b> Le soir (« dîneurs attardés »), à Paris, à la sortie d'un restaurant.", "<b>Comment ?</b> Une comparaison (« comme des coups d'épervier ») suggère un regard de séducteur-prédateur : le personnage se donne en spectacle."]),
  A("Ne confonds pas <b>Quoi</b> (ce qui se passe) et <b>Comment</b> (la manière dont c'est écrit). Raconter l'histoire répond à « Quoi », jamais à « Comment ».")
], [
  qcm("Qui est le personnage de l'extrait ?", ["Un caissier", "Georges Duroy, ancien sous-officier", "Un dîneur attardé", "Le narrateur, à la 1re personne"], 1, "Le nom propre « Georges Duroy » répond à la question Qui ?", "Axiome 0", "BELAMI1"),
  qcm("Où se passe la scène ?", ["À la sortie d'un restaurant", "À la caserne", "Dans un journal", "En pleine campagne"], 0, "« Duroy sortit du restaurant » : c'est le lieu (Où ?).", "Axiome 0", "BELAMI1"),
  hl("BELAMI1", "Clique sur les mots qui rappellent le passé militaire de Duroy.", ["ancien", "sous", "officier", "militaire"], "Le passé militaire (« ancien sous-officier », « geste militaire ») explique sa pose : c'est un indice sur le Qui ?", "Axiome 0"),
  match("Associe chaque question à ce qu'elle permet de trouver.", [["Qui ?", "Le personnage ou le narrateur"], ["Quoi ?", "L'action ou le sujet"], ["Quand ?", "L'époque ou le moment"], ["Où ?", "Le lieu"], ["Comment ?", "Les procédés d'écriture"]], "Chaque terme de l'Axiome 0 cherche une information précise.", "Axiome 0"),
  order("Remets les étapes de l'algorithme de lecture dans l'ordre.", ["Lire le texte en entier", "Poser les 5 questions", "Relever les indices dans le texte", "Formuler une première idée générale"], "On lit d'abord, on questionne ensuite, on prouve par des indices, on conclut.", "Algorithme de lecture"),
  fill("Pour répondre à la question {0}, je ne raconte pas ce qui se passe : j'étudie {1}.", [[["Quoi ?", "Comment ?", "Où ?"], 1], [["la manière d'écrire", "le lieu", "la date"], 0]], "« Comment ? » porte sur l'écriture, pas sur l'histoire.", "Axiome 0")
]),

LESSON("0.2", "Genre, registre, situation d'énonciation", "À la fin, tu sauras distinguer le genre, le registre et la situation d'énonciation d'un texte.", [
  D("Genre, registre, énonciation", "<p>Le <b>genre</b> est la catégorie de l'œuvre (récit, poésie, théâtre, argumentation). Le <b>registre</b> est la tonalité dominante (lyrique, comique, tragique…). La <b>situation d'énonciation</b> dit qui parle, à qui, quand et où (repères : je/tu, ici/maintenant).</p>"),
  T("Méthode", "Arbre de décision (4.7)", "<p>Pour trouver le genre, suis l'arbre : on pose une question par étape.</p>"),
  AR("genres"),
  X("DEMAIN", ["<b>Genre</b> : le texte est en vers, rimé, en quatrains → <i>poésie</i>.", "<b>Énonciation</b> : « je » s'adresse à un « tu » (« je sais que tu m'attends ») ; repère temporel : « demain ».", "<b>Registre</b> : le poète exprime sa douleur personnelle de manière intime → <i>lyrique</i> (et pathétique)."]),
  A("Le registre n'est pas le genre : on ne dit pas « ce texte est un comique », mais « ce texte de théâtre est de registre comique ». Un même genre peut avoir plusieurs registres.")
], [
  qcm("Quel est le genre de cet extrait ?", ["Poésie", "Théâtre", "Récit", "Argumentation"], 2, "Un narrateur raconte, avec description du lieu : c'est un récit.", "Arbre 4.7", "GERMINAL"),
  qcm("« Au voleur ! au voleur ! » (L'Avare, IV, 7). Quel est le genre ?", ["Récit", "Poésie", "Théâtre", "Argumentation"], 2, "C'est une réplique jouée par un personnage (Harpagon) : théâtre.", "Arbre 4.7"),
  qcm("Quel registre domine dans « Demain, dès l'aube… » ?", ["Comique", "Lyrique", "Épique", "Satirique"], 1, "Le poète exprime ses sentiments personnels (deuil, amour) : registre lyrique.", "Leçon 0.2", "DEMAIN"),
  match("Associe chaque genre à son indice principal.", [["Poésie", "Vers, rimes, strophes"], ["Théâtre", "Répliques et didascalies"], ["Récit", "Narrateur et personnages"], ["Argumentation", "Thèse et arguments"]], "Chaque genre a un indice formel repérable.", "Arbre 4.7"),
  multi("Quels éléments relèvent de la situation d'énonciation de « Demain, dès l'aube » ?", ["« Je partirai » (1re personne)", "« tu m'attends » (un destinataire)", "« la forêt »", "« Demain » (repère temporel)"], [0, 1, 3], "Je, tu et demain sont des repères d'énonciation ; « la forêt » est seulement un lieu décrit.", "Leçon 0.2", "DEMAIN"),
  fill("Le {0} est une catégorie d'œuvres (récit, théâtre…) ; le {1} est la tonalité du texte (lyrique, comique…).", [[["genre", "registre", "thème"], 0], [["genre", "registre", "thème"], 1]], "Ne confonds pas ces deux notions.", "Leçon 0.2")
]),

LESSON("0.3", "Thème vs. problématique du texte", "À la fin, tu sauras passer d'un thème (un nom) à une problématique (une question).", [
  D("Thème et problématique", "<p>Le <b>thème</b> est le sujet général du texte (la guerre, la mort, l'amour) : c'est un <i>nom</i>. La <b>problématique</b> est une <i>question</i> précise sur la manière dont le texte traite ce thème.</p>"),
  F("Passage du thème à la question", "Problématique = Comment + auteur + procédés dominants + effet/visée", "<p>On approfondira cette équation (Théorème 4.3) au module 6. Retiens déjà qu'elle commence par « Comment ».</p>"),
  X("DORMEUR", ["<b>Thème</b> : la guerre, la mort d'un jeune soldat.", "<b>Procédé dominant</b> : le contraste entre un paysage paisible et la révélation finale (« deux trous rouges »).", "<b>Visée</b> : dénoncer la guerre.", "<b>Problématique</b> : « Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre dans « Le Dormeur du val » ? »"]),
  A("Un thème n'est pas une problématique (« la guerre » n'est pas une question) et une problématique ne se réduit pas à un oui/non (« Rimbaud parle-t-il de la guerre ? » est une mauvaise question).")
], [
  qcm("Lequel de ces énoncés est un thème ?", ["La guerre", "Comment Rimbaud dénonce-t-il la guerre ?", "Rimbaud dénonce la guerre.", "Rimbaud aime-t-il la nature ?"], 0, "Un thème est un nom, un sujet général.", "Leçon 0.3"),
  qcm("Laquelle est une problématique bien formulée ?", ["La guerre dans « Le Dormeur du val »", "Rimbaud parle-t-il de la guerre ?", "Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre dans « Le Dormeur du val » ?", "Le poème parle d'un soldat endormi."], 2, "Elle commence par « Comment », cite l'auteur, un procédé et une visée (Théorème 4.3).", "Théorème 4.3"),
  hl("C'est un trou de verdure où chante une rivière\nAccrochant follement aux herbes des haillons\nD'argent ; où le soleil, de la montagne fière,\nLuit : c'est un petit val qui mousse de rayons.", "Clique sur les mots qui désignent des éléments de la nature.", ["verdure", "rivière", "herbes", "soleil", "montagne", "rayons", "val"], "Cette abondance de nature lumineuse prépare le contraste final : elle sert la problématique.", "Leçon 0.3"),
  multi("Quelles phrases sont des problématiques valables sur « Demain, dès l'aube » ?", ["Comment Hugo exprime-t-il la douleur du deuil dans ce poème ?", "Hugo parle-t-il de la mort ?", "Quel est le thème du poème ?", "En quoi le rythme du poème traduit-il la détermination du poète ?"], [0, 3], "Une bonne problématique est ouverte et lie un procédé à un effet.", "Théorème 4.3"),
  order("Remets dans l'ordre la fabrication d'une problématique.", ["Repérer le thème général", "Relever les procédés dominants", "Formuler l'effet produit", "Rédiger la question « Comment… ? »"], "On part du thème et on termine par la question.", "Théorème 4.3"),
  write("Formule une problématique sur « Demain, dès l'aube » de Hugo.", [["Elle commence par « Comment » ou « En quoi »", "^\\s*(comment|en quoi)"], ["Elle se termine par un point d'interrogation", "\\?\\s*$"], ["Elle cite Hugo ou le poème", "hugo|demain"], ["Elle nomme un procédé ou un effet", "tristesse|deuil|douleur|rythme|futur|répétition|anaphore|marche"]], "Comment Hugo, par le rythme déterminé de la marche puis la chute finale sur la tombe, exprime-t-il la douleur du deuil dans « Demain, dès l'aube » ?", "Théorème 4.3")
]),
],
[
  qcm("Laquelle de ces questions ne fait PAS partie des 5 questions de départ ?", ["Qui ?", "Où ?", "Pourquoi pas ?", "Comment ?"], 2, "Les cinq questions sont Qui, Quoi, Quand, Où, Comment.", "Axiome 0"),
  qcm("« Les sanglots longs / Des violons / De l'automne… » : quel est le genre ?", ["Théâtre", "Poésie", "Récit", "Argumentation"], 1, "Vers courts, rimes, strophes : poésie.", "Arbre 4.7", "CHANSON"),
  qcm("Que désigne la question « Comment ? » ?", ["Le lieu", "L'époque", "La manière d'écrire", "Le personnage"], 2, "Comment prépare l'analyse des procédés.", "Axiome 0"),
  qcm("Le registre est…", ["la catégorie de l'œuvre", "la tonalité dominante", "la longueur du texte", "le nom de l'auteur"], 1, "Registre = tonalité (lyrique, comique…).", "Leçon 0.2"),
  multi("Quels éléments sont des repères d'énonciation ?", ["je", "tu", "ici", "le granit"], [0, 1, 2], "Je, tu et ici renvoient à la situation d'énonciation.", "Leçon 0.2"),
  match("Associe chaque notion à sa définition.", [["Genre", "Catégorie de l'œuvre"], ["Registre", "Tonalité dominante"], ["Thème", "Sujet général"], ["Problématique", "Question précise « Comment… ? »"]], "Quatre notions à ne pas confondre.", "Leçons 0.2 et 0.3"),
  order("Ordonne l'algorithme de lecture.", ["Lire en entier", "Poser les 5 questions", "Relever des indices", "Formuler une idée générale"], "Lire → questionner → prouver → conclure.", "Algorithme de lecture"),
  fill("Un {0} est un nom (la guerre) ; une {1} est une question.", [[["thème", "registre", "genre"], 0], [["problématique", "énonciation", "strophe"], 0]], "Thème = nom ; problématique = question.", "Leçon 0.3"),
  qcm("Dans « Je partirai. Vois-tu, je sais que tu m'attends », qui est « tu » ?", ["Le lecteur", "Le destinataire du poème, la personne aimée", "Un personnage de roman", "Le poète"], 1, "Le « tu » est le destinataire dans la situation d'énonciation.", "Leçon 0.2", "DEMAIN"),
  qcm("Laquelle est une bonne problématique ?", ["Le deuil chez Hugo", "Hugo est-il triste ?", "Comment Hugo exprime-t-il la douleur du deuil dans ce poème ?", "Le poème raconte une marche."], 2, "Seule la troisième est une question ouverte en « Comment ».", "Théorème 4.3")
]);


// ---------- MODULE 1 — Les outils de la langue ----------
mod(1, "Les outils de la langue", "sudoku",
`<h3>Fiche-mémo — Les outils de la langue</h3>
<div class="box for"><div class="bt">Fonction de connotation</div><div class="formula">CL(mort) = {tombe, sombre, froid…} ; poids = card(CL)</div></div>
<ul><li><b>Dénotation</b> : sens du dictionnaire. <b>Connotation</b> : valeur ajoutée (+, −, 0).</li>
<li><b>Passé simple</b> : actions de premier plan ; <b>imparfait</b> : arrière-plan, description, habitude.</li>
<li><b>Types de phrases</b> : déclaratif, interrogatif, injonctif, exclamatif. Chaque ponctuation a un effet.</li>
<li><b>Modalisation</b> : jugement du locuteur (adjectifs évaluatifs, adverbes, verbes).</li></ul>`,
[
LESSON("1.1", "Champs lexicaux et connotations", "À la fin, tu sauras « calculer » le champ lexical dominant d'un texte et en interpréter les connotations.", [
  D("Champ lexical", "<p>Un <b>champ lexical</b> est l'ensemble des mots d'un texte qui se rapportent à une même idée ou à un même thème (la nature, la mort, la guerre…).</p>"),
  D("Dénotation et connotation", "<p>La <b>dénotation</b> est le sens du dictionnaire. La <b>connotation</b> est la valeur supplémentaire attachée au mot : positive (+), négative (−) ou neutre (0).</p>"),
  T("Théorème", "Fonction de connotation et poids d'un champ lexical (4.2)", "<div class='formula'>CL(mort) = {tombe, sombre, froid, linceul…}<br>poids(CL) = card(CL) = nombre d'éléments trouvés</div><p>Le <b>champ lexical dominant</b> est celui de plus grand cardinal : il révèle le thème et le registre.</p>"),
  X("DORMEUR", ["Champ lexical de la nature : verdure, rivière, herbes, soleil, montagne, rayons, cresson, lumière → card = 8.", "Champ lexical de la mort : pâle, froid, « deux trous rouges » → card = 3.", "8 > 3 : la nature domine… mais la mort arrive dans la chute.", "Interprétation : le contraste révèle la violence cachée de la guerre."]),
  A("Lister les mots ne suffit pas : un champ lexical relevé sans interprétation ne vaut rien. Il faut toujours dire ce qu'il révèle.")
], [
  hl("Seul, inconnu, le dos courbé, les mains croisées,\nTriste, et le jour pour moi sera comme la nuit.\nEt quand j'arriverai, je mettrai sur ta tombe", "Clique sur les mots du champ lexical du deuil.", ["triste", "nuit", "tombe"], "Triste, nuit, tombe forment le champ du deuil (poids = 3).", "Théorème 4.2"),
  hl("Et la nuque baignant dans le frais cresson bleu,\nDort ; il est étendu dans l'herbe, sous la nue,\nPâle dans son lit vert où la lumière pleut.", "Clique sur les mots du champ lexical de la nature.", ["cresson", "herbe", "nue", "lumière"], "Quatre éléments : le champ de la nature est présent jusque dans la strophe de la mort.", "Théorème 4.2"),
  qcm("Dans « ces rois de l'azur », le mot « azur » a une connotation…", ["négative", "positive (ciel pur, élévation)", "neutre", "inexistante"], 1, "« Azur » évoque la noblesse et l'idéal : connotation positive.", "Théorème 4.2", "ALBATROS"),
  match("Associe chaque mot de « L'Albatros » à sa valeur.", [["azur", "Connotation positive (élévation)"], ["huées", "Connotation négative (moquerie)"], ["planches", "Sens neutre (dénotation)"], ["laid", "Connotation négative (jugement)"]], "On classe chaque mot en +, − ou 0.", "Théorème 4.2"),
  count("Combien de mots du champ lexical de la nature dans : « Dans l'herbe, sous le soleil, la rivière chante près des arbres. » ?", 4, "herbe + soleil + rivière + arbres = 4", "On compte les éléments : poids = cardinal = 4.", "Théorème 4.2"),
  qcm("Le champ lexical dominant est…", ["celui de plus grand cardinal", "celui du premier vers", "celui du titre", "celui qui rime"], 0, "Poids = cardinal ; le plus grand l'emporte.", "Théorème 4.2")
]),

LESSON("1.2", "Temps et modes verbaux", "À la fin, tu sauras donner la valeur d'un temps verbal dans un texte.", [
  D("Temps et mode", "<p>Le <b>temps</b> situe l'action et lui donne une valeur (durée, rapidité, certitude). Le <b>mode</b> exprime l'attitude : indicatif (réel), subjonctif (souhait, doute), impératif (ordre), conditionnel (hypothèse).</p>"),
  T("Propriété", "Valeurs des temps du récit", "<ul><li><b>Passé simple</b> : actions de premier plan, brèves, qui font avancer le récit.</li><li><b>Imparfait</b> : arrière-plan, description, durée, habitude.</li><li><b>Présent</b> : vérité générale, ou vivacité (présent de narration).</li><li><b>Futur</b> : projet, certitude, détermination.</li></ul>"),
  X("BELAMI1", ["Passé simple : sortit, cambra, frisa, jeta → des gestes rapides et successifs, comme une mise en scène.", "Imparfait : « il portait beau » → une qualité durable, la nature profonde du personnage.", "Effet : Duroy « joue » son personnage ; le narrateur en souligne la pose, avec ironie."]),
  A("Ne dis jamais « le passé simple est un temps du passé » : cela ne prouve rien. Dis ce que le temps <i>produit</i> (rapidité, arrière-plan…).")
], [
  hl("BELAMI1", "Clique sur les verbes au passé simple.", ["sortit", "cambra", "frisa", "jeta"], "Quatre actions brèves enchaînées : le passé simple fait avancer le récit.", "Propriété (temps du récit)"),
  qcm("Dans « il portait beau », l'imparfait sert à…", ["décrire une qualité durable", "raconter une action brève", "exprimer un ordre", "exprimer une hypothèse"], 0, "L'imparfait décrit et installe l'arrière-plan.", "Propriété (temps du récit)", "BELAMI1"),
  qcm("Quelle valeur a le futur de « Je partirai » (Hugo) ?", ["Détermination, certitude", "Regret", "Souvenir", "Ordre"], 0, "Le futur exprime ici une résolution ferme.", "Propriété (temps du récit)", "DEMAIN"),
  match("Associe chaque temps à sa valeur.", [["Passé simple", "Action de premier plan"], ["Imparfait", "Description, arrière-plan"], ["Présent de vérité générale", "Énoncé valable en tout temps"], ["Conditionnel", "Hypothèse ou politesse"]], "Chaque temps produit un effet précis.", "Propriété (temps du récit)"),
  fill("L'imparfait décrit l'{0} ; le passé simple fait avancer l'{1}.", [[["arrière-plan", "action principale", "ordre"], 0], [["action principale", "description", "hypothèse"], 0]], "Passé simple = premier plan ; imparfait = arrière-plan.", "Propriété (temps du récit)"),
  multi("Quels temps sont à l'indicatif ?", ["présent", "imparfait", "subjonctif présent", "futur simple"], [0, 1, 3], "Le subjonctif est un autre mode.", "Leçon 1.2")
]),

LESSON("1.3", "Types et formes de phrases, ponctuation", "À la fin, tu sauras interpréter l'effet d'un type de phrase et d'une ponctuation.", [
  D("Types et formes de phrases", "<p>Il y a quatre <b>types</b> de phrases : déclaratif, interrogatif, injonctif (ordre) et exclamatif. Les <b>formes</b> sont affirmative/négative, active/passive, emphatique. La <b>ponctuation</b> (! ? … : ;) indique le ton.</p>"),
  T("Propriété", "Type de phrase → effet", "<ul><li>Interrogation : doute, désarroi, ou <b>question rhétorique</b> (qui affirme).</li><li>Exclamation : émotion forte.</li><li>Impératif : ordre, supplication.</li><li>Points de suspension : silence, sous-entendu.</li></ul>"),
  X("AVARE", ["Exclamations : « Au voleur ! au voleur ! à l'assassin ! » → panique et exagération.", "Interrogations enchaînées : « Qui peut-ce être ? Qu'est-il devenu ? Où est-il ? » → affolement, rythme haché.", "Impératif : « Rends-moi mon argent, coquin. » → ordre adressé à un voleur invisible.", "Effet : Harpagon perd la raison — c'est pathétique pour lui, <b>comique</b> pour le public."]),
  A("Une question n'est pas toujours une vraie question : « Est-ce ainsi qu'on traite un ami ? » est un reproche (question rhétorique), pas un doute.")
], [
  qcm("« Qu'est-il devenu ? » est une phrase de type…", ["déclaratif", "interrogatif", "injonctif", "exclamatif"], 1, "La structure et le « ? » signalent une interrogation.", "Propriété (types de phrases)"),
  hl("Arrête. Rends-moi mon argent, coquin. Justice, juste ciel !", "Clique sur les verbes à l'impératif.", ["arrête", "rends"], "L'impératif exprime ici l'ordre : Harpagon commande à un voleur absent.", "Propriété (types de phrases)"),
  match("Associe chaque signe de ponctuation à son effet.", [["!", "Émotion vive"], ["?", "Doute ou interpellation"], ["…", "Silence, sous-entendu"], [":", "Explication ou annonce"]], "La ponctuation porte une valeur expressive.", "Propriété (types de phrases)"),
  multi("Quels effets produit la succession de questions d'Harpagon ?", ["Le désarroi du personnage", "L'affolement qui devient comique", "La sérénité", "Un rythme rapide, haché"], [0, 1, 3], "Des phrases courtes et interrogatives accélèrent le rythme.", "Propriété (types de phrases)", "AVARE"),
  qcm("« Est-ce ainsi que l'on traite un ami ? » est…", ["une question rhétorique (un reproche)", "un vrai doute", "un ordre", "une négation"], 0, "On n'attend pas de réponse : c'est une affirmation déguisée.", "Propriété (types de phrases)"),
  qcm("Les points de suspension suggèrent surtout…", ["un silence, un sous-entendu", "un ordre", "une date", "une rime"], 0, "Ils marquent ce qui n'est pas dit.", "Propriété (types de phrases)")
]),

LESSON("1.4", "Énonciation (pronoms, modalisation)", "À la fin, tu sauras repérer la voix qui parle et ses jugements.", [
  D("Énonciation et modalisation", "<p>L'<b>énonciation</b> désigne qui parle à qui. Les <b>modalisateurs</b> sont les mots qui traduisent le jugement du locuteur : adjectifs évaluatifs (beau, laid), adverbes (sans doute), verbes (sembler, falloir), ponctuation.</p>"),
  T("Propriété", "Pronoms et implication", "<p>La 1<sup>re</sup> personne marque l'<b>implication</b> du locuteur (sentiments personnels : lyrisme) ; la 3<sup>e</sup> personne crée une <b>distance</b> apparente (récit), mais le narrateur peut juger par la modalisation.</p>"),
  X("ALBATROS", ["Relevé des modalisateurs : « gauche », « veule », « beau », « comique », « laid » (adjectifs évaluatifs).", "Les exclamations (« comme il est gauche et veule ! ») traduisent un jugement.", "Interprétation : ces jugements sont ceux des marins moqueurs ; le poète les dénonce en montrant la grandeur perdue (« naguère si beau »)."]),
  A("L'auteur n'est pas le narrateur ni le locuteur : parle de « la voix qui parle dans le texte » et non de « Baudelaire pense que… » sans preuve.")
], [
  qcm("Dans « Demain, dès l'aube… », le pronom « tu » désigne…", ["le lecteur", "le destinataire du poème, la personne aimée", "le poète", "un personnage de roman"], 1, "« Tu » est le destinataire dans la situation d'énonciation.", "Leçon 1.4", "DEMAIN"),
  hl("Ce voyageur ailé, comme il est gauche et veule !\nLui, naguère si beau, qu'il est comique et laid !", "Clique sur les adjectifs évaluatifs.", ["gauche", "veule", "beau", "comique", "laid"], "Ces adjectifs sont des modalisateurs : ils jugent l'oiseau.", "Propriété (modalisation)"),
  qcm("Le narrateur de l'extrait de Bel-Ami est…", ["externe, à la 3e personne", "interne, à la 1re personne", "Georges Duroy lui-même", "le caissier"], 0, "Le récit parle de « il » : narrateur à la 3e personne.", "Leçon 1.4", "BELAMI1"),
  match("Associe chaque modalisateur à sa catégorie.", [["« laid »", "Adjectif évaluatif"], ["« sans doute »", "Adverbe modalisateur"], ["« sembler »", "Verbe modalisateur"], ["« je »", "Pronom de 1re personne"]], "On classe les marques du jugement.", "Propriété (modalisation)"),
  fill("Dans « Demain, dès l'aube », le poète emploie {0} personne du singulier : le texte exprime des sentiments {1}.", [[["la première", "la troisième", "la deuxième"], 0], [["personnels", "objectifs", "scientifiques"], 0]], "Le « je » implique le poète : registre lyrique.", "Propriété (modalisation)"),
  qcm("Quel effet produit « qu'il est comique et laid ! » ?", ["Il rend compte du regard moqueur des marins, que le poète critique", "Il décrit l'oiseau de façon scientifique", "Il annonce une description", "Il crée une rime"], 0, "L'exclamation et les adjectifs reproduisent un jugement cruel.", "Propriété (modalisation)", "ALBATROS")
]),
],
[
  qcm("La connotation d'un mot est…", ["son sens du dictionnaire", "la valeur supplémentaire qu'il évoque", "sa rime", "son temps"], 1, "Dénotation = sens neutre ; connotation = valeur ajoutée.", "Leçon 1.1"),
  hl("Les sanglots longs\nDes violons\nDe l'automne\nBlessent mon cœur\nD'une langueur\nMonotone.", "Clique sur les mots du champ lexical de la tristesse.", ["sanglots", "blessent", "langueur", "monotone"], "Quatre éléments : le champ de la tristesse domine.", "Théorème 4.2"),
  qcm("Le passé simple sert surtout à…", ["décrire un décor", "raconter des actions de premier plan", "exprimer un ordre", "exprimer un souhait"], 1, "Passé simple = premier plan.", "Leçon 1.2"),
  match("Associe temps et valeur.", [["Imparfait", "Description, durée"], ["Futur", "Projet, certitude"], ["Présent de vérité générale", "Énoncé valable en tout temps"]], "Chaque temps produit un effet.", "Leçon 1.2"),
  qcm("Une succession d'exclamations exprime surtout…", ["l'émotion vive", "le calme", "une date", "une explication"], 0, "L'exclamation marque l'émotion.", "Leçon 1.3"),
  multi("Quels sont des types de phrases ?", ["déclaratif", "interrogatif", "métaphorique", "injonctif"], [0, 1, 3], "La métaphore est une figure, pas un type de phrase.", "Leçon 1.3"),
  qcm("« Triste, et le jour pour moi sera comme la nuit » : le champ lexical dominant est…", ["la joie", "le deuil / la douleur", "la guerre", "la nature"], 1, "Triste, nuit : champ du deuil.", "Théorème 4.2", "DEMAIN"),
  fill("Un adjectif comme « laid » est un {0} qui traduit un {1}.", [[["modalisateur", "temps", "mode"], 0], [["jugement", "ordre", "lieu"], 0]], "Les modalisateurs traduisent le jugement.", "Leçon 1.4"),
  qcm("La 1re personne marque…", ["l'implication du locuteur", "une distance scientifique", "un ordre", "une date"], 0, "Le « je » implique le locuteur.", "Leçon 1.4"),
  count("Combien de verbes au passé simple dans : « Il sortit, cambra sa taille, frisa sa moustache et jeta un regard. » ?", 4, "sortit + cambra + frisa + jeta = 4", "Quatre actions brèves au passé simple.", "Leçon 1.2")
]);


// ---------- MODULE 2 — Les figures de style ----------
mod(2, "Les figures de style", "chasse-aux-figures",
`<h3>Fiche-mémo — Les figures de style</h3>
<ul><li><b>Analogie</b> : comparaison (comparé + outil + comparant), métaphore (sans outil), personnification, allégorie.</li>
<li><b>Opposition</b> : antithèse (deux termes opposés), oxymore (contradiction dans un groupe), chiasme (A B B' A').</li>
<li><b>Amplification</b> : hyperbole, gradation, accumulation, anaphore. <b>Atténuation</b> : litote (dire moins pour suggérer plus), euphémisme (adoucir).</li>
<li><b>Sonorité</b> : allitération (consonne répétée), assonance (voyelle répétée).</li></ul>
<div class="box for"><div class="bt">Rappel</div><div class="formula">Analyse = Procédé + Citation + Effet + Interprétation</div></div>`,
[
LESSON("2.1", "Figures d'analogie", "À la fin, tu sauras distinguer comparaison, métaphore, personnification et allégorie.", [
  D("Figure d'analogie", "<p>Une <b>figure d'analogie</b> rapproche deux réalités qui ont un point commun. <b>Comparaison</b> : avec un outil (comme, tel, semblable à). <b>Métaphore</b> : sans outil. <b>Personnification</b> : on prête des traits humains à un animal, une chose, une idée. <b>Allégorie</b> : une idée abstraite est représentée par un être concret (la Mort en squelette).</p>"),
  T("Propriété", "Structure de la comparaison", "<div class='formula'>Comparaison = comparé + outil + comparant (+ point commun)<br>Métaphore = comparaison − outil</div><p>Si la métaphore dure sur plusieurs vers ou phrases, elle est dite <b>filée</b>.</p>"),
  X("ALBATROS", ["<b>Comparaison</b> : « ses ailes… comme des avirons » → comparé : les ailes ; outil : comme ; comparant : avirons ; point commun : longues, lourdes, encombrantes hors de l'eau.", "<b>Métaphore</b> : « ces rois de l'azur » → l'albatros est un roi, sans outil.", "<b>Interprétation</b> : la noblesse dans les airs (rois) contraste avec la maladresse sur le pont (avirons) : c'est le poète incompris."]),
  A("Ne confonds pas comparaison et métaphore : s'il y a un outil, c'est une comparaison. Et « comme » ne suffit pas (« fais comme tu veux » n'est pas une figure).")
], [
  qcm("« Comme des avirons traîner à côté d'eux » est…", ["une comparaison", "une métaphore", "une personnification", "une litote"], 0, "L'outil « comme » relie les ailes et les avirons.", "Propriété (comparaison)", "ALBATROS"),
  qcm("« Ces rois de l'azur » est…", ["une comparaison", "une métaphore", "une anaphore", "un oxymore"], 1, "Aucun outil : l'albatros est directement nommé « roi ».", "Propriété (comparaison)", "ALBATROS"),
  hl("Laissent piteusement leurs grandes ailes blanches\nComme des avirons traîner à côté d'eux.", "Clique sur l'outil de comparaison.", ["comme"], "L'outil de comparaison distingue la comparaison de la métaphore.", "Propriété (comparaison)"),
  match("Associe chaque figure à son exemple.", [["Comparaison", "Il est fort comme un lion."], ["Métaphore", "Cet homme est un lion."], ["Personnification", "La rivière chante."], ["Allégorie", "La Mort représentée en squelette à faux."]], "Quatre figures d'analogie à ne pas confondre.", "Leçon 2.1"),
  qcm("« La ville… semblait suer dans la nuit étouffante » est surtout…", ["une personnification", "une litote", "un chiasme", "une assonance"], 0, "La ville « sue » comme un être vivant.", "Leçon 2.1", "BELAMI2"),
  fill("La comparaison contient un {0} de comparaison ; la métaphore n'en contient {1}.", [[["outil", "verbe", "adjectif"], 0], [["aucun", "toujours un", "deux"], 0]], "Métaphore = comparaison sans outil.", "Propriété (comparaison)")
]),

LESSON("2.2", "Figures d'opposition", "À la fin, tu sauras reconnaître et interpréter antithèse, oxymore et chiasme.", [
  D("Figures d'opposition", "<p>L'<b>antithèse</b> rapproche deux termes de sens opposés (beau / laid). L'<b>oxymore</b> unit deux mots contradictoires dans un même groupe (« cette obscure clarté »). Le <b>chiasme</b> croise deux groupes de mots en miroir : A B B' A'.</p>"),
  T("Propriété", "Effet des figures d'opposition", "<p>Elles mettent en valeur un <b>contraste</b>, un <b>paradoxe</b> ou une tension. Le chiasme, lui, donne à la phrase un effet de balancement et de maxime.</p><div class='formula'>Chiasme : A B | B' A'</div>"),
  X("ALBATROS", ["<b>Relevé</b> : « Lui, naguère si beau, qu'il est comique et laid ! »", "<b>Procédé</b> : antithèse beau / laid, renforcée par « naguère » (avant) et le présent (maintenant).", "<b>Effet</b> : on mesure la chute de l'oiseau, du ciel au pont du navire.", "<b>Interprétation</b> : le poète est grand dans l'inspiration et ridicule aux yeux de la société."]),
  A("Un oxymore n'est pas une simple opposition : les deux mots sont accolés dans le même groupe (« obscure clarté »). Deux mots opposés dans deux phrases différentes forment une antithèse.")
], [
  qcm("« Cette obscure clarté qui tombe des étoiles » (Corneille, Le Cid) est…", ["un oxymore", "une anaphore", "une litote", "une comparaison"], 0, "« Obscure » et « clarté » sont accolés et contradictoires.", "Propriété (opposition)"),
  qcm("« Il faut manger pour vivre et non vivre pour manger » (Molière, L'Avare) est…", ["un chiasme", "une hyperbole", "une allitération", "une personnification"], 0, "Manger-vivre / vivre-manger : A B B' A'.", "Propriété (opposition)"),
  qcm("« naguère si beau » / « comique et laid » forme…", ["une antithèse", "un oxymore", "une métaphore", "une gradation"], 0, "Deux termes opposés dans la même phrase : antithèse.", "Propriété (opposition)", "ALBATROS"),
  match("Associe chaque figure à son exemple.", [["Antithèse", "Lui, naguère si beau, qu'il est comique et laid !"], ["Oxymore", "Cette obscure clarté"], ["Chiasme", "Manger pour vivre, non vivre pour manger"]], "Trois figures d'opposition.", "Leçon 2.2"),
  hl("Cette obscure clarté qui tombe des étoiles", "Clique sur les deux mots de l'oxymore.", ["obscure", "clarté"], "Les deux mots contradictoires sont accolés.", "Propriété (opposition)"),
  multi("Quels effets peut produire une antithèse ?", ["Souligner un contraste", "Créer une tension, un paradoxe", "Faire rimer deux vers", "Mettre en valeur une idée par l'opposition"], [0, 1, 3], "Une figure d'opposition sert à interpréter un contraste, pas la rime.", "Propriété (opposition)")
]),

LESSON("2.3", "Amplification et atténuation", "À la fin, tu sauras reconnaître hyperbole, gradation, accumulation, anaphore, litote et euphémisme.", [
  D("Amplification et atténuation", "<p><b>Amplification</b> : <i>hyperbole</i> (exagération), <i>gradation</i> (termes de plus en plus forts ou faibles), <i>accumulation</i> (énumération), <i>anaphore</i> (répétition en début de phrase ou de vers). <b>Atténuation</b> : <i>litote</i> (dire moins pour suggérer plus : « Va, je ne te hais point »), <i>euphémisme</i> (adoucir une réalité dure).</p>"),
  T("Propriété", "Distinguer litote et euphémisme", "<ul><li>La <b>litote</b> dit peu pour faire comprendre <i>beaucoup</i> (c'est une affirmation atténuée).</li><li>L'<b>euphémisme</b> <i>adoucit</i> une réalité pénible (mourir → s'éteindre).</li></ul><div class='formula'>Gradation : A &lt; B &lt; C</div>"),
  X("AVARE", ["<b>Hyperbole</b> : « on m'a coupé la gorge » (il ne s'agit que d'argent volé).", "<b>Gradation</b> : voleur → assassin → meurtrier : l'accusation grossit.", "<b>Anaphore / accumulation</b> : « Où est-il ? Où se cache-t-il ? Où courir ? » : répétition qui accélère le rythme.", "<b>Effet</b> : Harpagon exagère sa douleur ; l'exagération est comique et révèle sa passion de l'argent."]),
  A("L'euphémisme et la litote se ressemblent, mais pas le but : la litote suggère <i>plus</i>, l'euphémisme <i>adoucit</i>. Et ne cite jamais une figure sans dire son effet.")
], [
  qcm("« Va, je ne te hais point » (Corneille, Le Cid) est…", ["une litote", "une hyperbole", "un euphémisme", "une gradation"], 0, "Elle dit moins (ne pas haïr) pour faire entendre plus (aimer).", "Propriété (atténuation)"),
  qcm("« Il a deux trous rouges au côté droit » (Rimbaud) adoucit la mort du soldat : c'est…", ["un euphémisme", "une hyperbole", "une anaphore", "une antithèse"], 0, "La blessure mortelle est décrite avec douceur apparente.", "Propriété (atténuation)", "DORMEUR"),
  qcm("« On m'a coupé la gorge » (Harpagon) est…", ["une hyperbole", "une litote", "un oxymore", "une allitération"], 0, "Exagération comique d'un simple vol.", "Leçon 2.3", "AVARE"),
  match("Associe chaque figure à son exemple.", [["Anaphore", "J'irai par la forêt, j'irai par la montagne"], ["Gradation", "Va, cours, vole, et nous venge"], ["Accumulation", "Les trompettes, les fifres, les hautbois, les tambours"], ["Hyperbole", "Je meurs de faim"]], "Quatre figures d'amplification.", "Leçon 2.3"),
  hl("J'irai par la forêt, j'irai par la montagne.", "Clique sur le mot répété en début de proposition (anaphore).", ["irai"], "La répétition de « j'irai » marque la détermination.", "Leçon 2.3"),
  qcm("La litote consiste à…", ["dire moins pour suggérer plus", "exagérer", "opposer deux termes", "répéter un mot"], 0, "Litote = atténuation qui renforce le sens.", "Propriété (atténuation)")
]),

LESSON("2.4", "Figures de sonorité", "À la fin, tu sauras repérer allitération et assonance et en interpréter l'effet.", [
  D("Allitération et assonance", "<p>L'<b>allitération</b> est la répétition d'un son <i>consonne</i> ; l'<b>assonance</b> est la répétition d'un son <i>voyelle</i>. Quand le son imite la réalité, on parle d'<b>harmonie imitative</b>.</p>"),
  T("Propriété", "Du son au sens", "<p>On compte les sons répétés puis on <b>interprète</b> : [s] = sifflement ou chuchotement ; [l] = douceur, fluidité ; [k], [t] = dureté ; [ɔ̃] = résonance plaintive.</p>"),
  X("CHANSON", ["<b>Relevé</b> : « Les sanglots longs / Des violons » ; « D'une langueur ».", "<b>Procédés</b> : assonance en [ɔ̃] (longs, violons) et allitération en [l] (les, longs, violons, langueur).", "<b>Effet</b> : une musique lente et plaintive, qui imite le violon.", "<b>Interprétation</b> : la mélancolie de l'automne est transposée en musique."]),
  A("Ne relève pas des sons au hasard : une allitération doit se <i>voir</i> (au moins 3 occurrences rapprochées) et s'interpréter. Ce n'est pas la rime.")
], [
  qcm("« Pour qui sont ces serpents qui sifflent sur vos têtes ? » (Racine) répète le son [s] : c'est…", ["une allitération", "une assonance", "une litote", "un chiasme"], 0, "Répétition d'une consonne.", "Propriété (sonorités)"),
  qcm("La répétition d'un son voyelle s'appelle…", ["assonance", "allitération", "anaphore", "antithèse"], 0, "Assonance = voyelle ; allitération = consonne.", "Leçon 2.4"),
  hl("Les sanglots longs\nDes violons", "Clique sur les deux mots où l'on entend la même voyelle nasale [ɔ̃].", ["longs", "violons"], "« Longs » et « violons » résonnent en [ɔ̃].", "Leçon 2.4"),
  qcm("L'allitération en [s] dans « sifflent » imite…", ["le sifflement des serpents", "un cri de joie", "un rire", "une marche"], 0, "Harmonie imitative : le son reproduit le sens.", "Propriété (sonorités)"),
  fill("L'{0} répète une consonne ; l'{1} répète une voyelle.", [[["allitération", "assonance", "anaphore"], 0], [["assonance", "allitération", "antithèse"], 0]], "Deux figures de sonorité.", "Leçon 2.4"),
  multi("Que peut évoquer un [s] répété ?", ["un sifflement", "un chuchotement", "une menace", "une rime riche"], [0, 1, 2], "Le son s'interprète, la rime est une autre notion.", "Propriété (sonorités)")
]),
],
[
  qcm("« Cette obscure clarté » est…", ["un oxymore", "une comparaison", "une litote", "une personnification"], 0, "Deux mots contradictoires accolés.", "Leçon 2.2"),
  qcm("« Ces rois de l'azur » est une…", ["métaphore", "comparaison", "anaphore", "litote"], 0, "Pas d'outil de comparaison.", "Leçon 2.1", "ALBATROS"),
  qcm("« Je ne te hais point » est…", ["une litote", "une hyperbole", "une gradation", "un chiasme"], 0, "Dire moins pour suggérer plus.", "Leçon 2.3"),
  match("Associe chaque figure à sa définition.", [["Hyperbole", "Exagération"], ["Antithèse", "Deux idées opposées"], ["Allitération", "Consonne répétée"], ["Personnification", "Traits humains donnés à une chose"]], "Quatre définitions à connaître.", "Module 2"),
  hl("Rien n'était si beau, si leste, si brillant, si bien ordonné que les deux armées.", "Clique sur le mot répété en début de groupe (anaphore).", ["si"], "« Si » répété forme une accumulation d'adjectifs ironiques.", "Leçon 2.3"),
  qcm("« Va, cours, vole, et nous venge » (Le Cid) est…", ["une gradation", "un oxymore", "une comparaison", "une litote"], 0, "Les verbes expriment une intensité croissante.", "Leçon 2.3"),
  qcm("« Il faut manger pour vivre et non vivre pour manger » est…", ["un chiasme", "une anaphore", "une antithèse seulement", "une métaphore"], 0, "Croisement A B B' A'.", "Leçon 2.2"),
  qcm("Pour interpréter une figure, il faut…", ["donner son effet", "la nommer seulement", "compter les syllabes", "la traduire"], 0, "Procédé sans effet = analyse incomplète.", "Théorème 4.1"),
  fill("L'{0} répète un son voyelle et l'{1} un son consonne.", [[["assonance", "allitération", "anaphore"], 0], [["allitération", "assonance", "antithèse"], 0]], "Deux figures de sonorité.", "Leçon 2.4"),
  qcm("« La ville… semblait suer dans la nuit étouffante » : la figure principale est…", ["une personnification", "une litote", "une antithèse", "une assonance"], 0, "La ville reçoit un trait humain.", "Leçon 2.1", "BELAMI2")
]);


// ---------- MODULE 3 — Les genres ----------
mod(3, "Les genres", "compteur-de-syllabes",
`<h3>Fiche-mémo — Les genres</h3>
<ul><li><b>Récit</b> : narrateur ≠ auteur ; focalisation interne / externe / omnisciente ; rythme : scène (=), sommaire (&lt;), ellipse (saute), pause (description).</li>
<li><b>Poésie</b> : alexandrin 12, décasyllabe 10, octosyllabe 8. Le e muet compte devant une consonne, jamais devant une voyelle ni en fin de vers. Rimes suivies AABB, croisées ABAB, embrassées ABBA.</li>
<li><b>Théâtre</b> : double énonciation (personnage→personnage ET auteur→public), didascalies, tirade, monologue, aparté, stichomythie.</li>
<li><b>Argumentation</b> : thèse + arguments + exemples ; connecteurs logiques.</li></ul>
<div class="box for"><div class="bt">Théorème 4.8</div><div class="formula">Alexandrin = 12 · Décasyllabe = 10 · Octosyllabe = 8</div></div>`,
[
LESSON("3.1", "Le récit : narrateur, focalisation, rythme", "À la fin, tu sauras identifier le narrateur, la focalisation et le rythme d'un récit.", [
  D("Narrateur, focalisation, rythme", "<p>Le <b>narrateur</b> est la voix qui raconte (il n'est pas l'auteur). La <b>focalisation</b> est le point de vue : <i>interne</i> (on voit par un personnage), <i>externe</i> (on voit seulement les gestes), <i>omnisciente</i> ou zéro (le narrateur sait tout). Le <b>rythme</b> compare la durée du récit à celle de l'histoire.</p>"),
  T("Propriété", "Les quatre mouvements du récit", "<ul><li><b>Scène</b> : durée du récit ≈ durée de l'histoire (dialogue).</li><li><b>Sommaire</b> : récit &lt; histoire (on résume).</li><li><b>Ellipse</b> : on saute une période.</li><li><b>Pause</b> : le récit s'arrête pour décrire.</li></ul>"),
  X("BELAMI1", ["<b>Narrateur</b> : extérieur à l'histoire, à la 3<sup>e</sup> personne.", "<b>Focalisation</b> : omnisciente — le narrateur connaît la « nature » et la « pose » de Duroy et les juge.", "<b>Rythme</b> : suite rapide de gestes (passé simple) : scène brève.", "<b>Effet</b> : on voit Duroy se mettre en scène, avec une ironie discrète."]),
  A("Narrateur ≠ auteur : on écrit « le narrateur raconte… », pas « Maupassant raconte que… » sans nuance. Et la 3<sup>e</sup> personne n'implique pas la focalisation externe.")
], [
  qcm("Dans l'extrait de Bel-Ami, la focalisation est…", ["omnisciente (zéro)", "interne", "externe", "inexistante"], 0, "Le narrateur sait que Duroy joue un rôle (« par nature et par pose »).", "Propriété (récit)", "BELAMI1"),
  qcm("« Devant lui, il ne voyait même pas le sol noir » : la focalisation est…", ["interne", "omnisciente", "externe", "aucune"], 0, "On perçoit la scène par la vue limitée du personnage.", "Propriété (récit)", "GERMINAL"),
  qcm("« Trois ans passèrent. » est…", ["une ellipse", "une pause", "une scène", "une comparaison"], 0, "Une période est passée sous silence.", "Propriété (récit)"),
  match("Associe chaque mouvement narratif à sa définition.", [["Scène", "Durée du récit ≈ durée de l'histoire"], ["Sommaire", "On résume une longue période"], ["Ellipse", "On passe une période sous silence"], ["Pause", "Le récit s'arrête pour décrire"]], "Quatre rythmes narratifs.", "Propriété (récit)"),
  qcm("La description de la nuit parisienne produit surtout…", ["une pause descriptive", "une ellipse", "une scène dialoguée", "un sommaire"], 0, "L'action s'arrête : on décrit l'atmosphère.", "Propriété (récit)", "BELAMI2"),
  qcm("Le narrateur de Bel-Ami est-il Maupassant ?", ["Non : c'est une voix créée par l'auteur", "Oui, toujours", "C'est Duroy", "C'est le caissier"], 0, "L'auteur est une personne réelle ; le narrateur, une instance du texte.", "Leçon 3.1")
]),

LESSON("3.2", "La poésie : versification", "À la fin, tu sauras compter les syllabes d'un vers et nommer rimes et strophes.", [
  D("Vers, strophe, rime", "<p>Un <b>vers</b> est une ligne de poème. Les <b>strophes</b> : quatrain (4 vers), tercet (3). <b>Rimes</b> : suivies AABB, croisées ABAB, embrassées ABBA. Le vers se nomme d'après son nombre de syllabes. <b>Enjambement</b> : la phrase déborde sur le vers suivant ; <b>rejet</b> : un mot court est rejeté au vers suivant.</p>"),
  F("Théorème 4.8 — Calcul des syllabes", "Alexandrin = 12 · Décasyllabe = 10 · Octosyllabe = 8", "<ul><li>Le <b>e muet</b> compte devant une consonne (« sou-ve-nir ») ;</li><li>il <b>s'élide</b> devant une voyelle et <b>à la fin du vers</b> ;</li><li><b>Diérèse</b> : on prononce en deux syllabes (vi-o-lons) ; <b>synérèse</b> : en une seule (rivière).</li></ul>"),
  X("DEMAIN", ["On compte à partir de « Demain, dès l'aube, à l'heure où blanchit la campagne ».", "De / main / dès / l'au / b(e)à / l'heu / r(e)où / blan / chit / la / cam / pa / (gne)", "Les e muets de « aube » et « heure » sont élidés devant « à » et « où » ; le e final de « campagne » ne compte pas.", "Total : 12 syllabes → un alexandrin."], "Compter les syllabes du premier vers de Hugo :"),
  A("Le e muet final n'est <b>jamais</b> compté. Mais attention : « -ent » d'une 3<sup>e</sup> personne du pluriel compte devant une consonne (« prennent des » : pren-nent des).")
], [
  count("Combien de syllabes dans « Je ne puis demeurer loin de toi plus longtemps » ?", 12, "Je / ne / puis / de / meu / rer / loin / de / toi / plus / long / temps = 12", "Aucun e muet n'est élidé ici ; « demeurer » compte 3 syllabes.", "Théorème 4.8"),
  count("Combien de syllabes dans « Je le vis, je rougis, je pâlis à sa vue » ?", 12, "Je / le / vis / je / rou / gis / je / pâ / lis / à / sa / vu(e) = 12", "Le e de « vue » est final : il ne compte pas.", "Théorème 4.8", "PHEDRE"),
  count("Combien de syllabes dans « Dans le courant d'une onde pure » ?", 8, "Dans / le / cou / rant / d'u / n(e)on / de / pu(re) = 8", "Le e de « une » s'élide devant « onde » ; un octosyllabe.", "Théorème 4.8"),
  qcm("Les rimes de la première strophe de « Demain, dès l'aube » (campagne / attends / montagne / longtemps) sont…", ["croisées (ABAB)", "suivies (AABB)", "embrassées (ABBA)", "absentes"], 0, "campagne-montagne (A) et attends-longtemps (B) alternent.", "Leçon 3.2", "DEMAIN"),
  qcm("Un enjambement est…", ["une phrase qui déborde sur le vers suivant", "une répétition de sons", "une rime riche", "une strophe de quatre vers"], 0, "La syntaxe franchit la limite du vers.", "Leçon 3.2"),
  match("Associe chaque terme à sa définition.", [["Quatrain", "Strophe de 4 vers"], ["Tercet", "Strophe de 3 vers"], ["Alexandrin", "Vers de 12 syllabes"], ["Octosyllabe", "Vers de 8 syllabes"]], "Vocabulaire de la versification.", "Leçon 3.2")
]),

LESSON("3.3", "Le théâtre : double énonciation, didascalies, répliques", "À la fin, tu sauras expliquer la double énonciation et nommer les types de répliques.", [
  D("Double énonciation et didascalies", "<p>Au théâtre, ce que dit un personnage s'adresse à la fois à un autre personnage <b>et</b> au public : c'est la <b>double énonciation</b>. Les <b>didascalies</b> sont les indications de l'auteur (gestes, ton, décor). Types de répliques : <b>tirade</b> (longue), <b>monologue</b> (seul), <b>aparté</b> (le public seul entend), <b>stichomythie</b> (répliques courtes alternées).</p>"),
  T("Propriété", "Du texte à la scène", "<p>Une réplique se lit à deux niveaux : <i>pour les personnages</i> (ce qu'ils comprennent) et <i>pour le public</i> (ce qu'il sait en plus). La différence produit l'ironie dramatique et le comique de situation.</p>"),
  X("AVARE", ["<b>Type de réplique</b> : monologue — Harpagon est seul et s'adresse à lui-même et à la salle (« Justice, juste ciel ! »).", "<b>Double énonciation</b> : il prend le public à témoin de son malheur.", "<b>Comique de geste</b> : une didascalie le montre qui saisit son propre bras (« Ah ! c'est moi »).", "<b>Comique de caractère</b> : l'avare est fou de son argent."]),
  D("Œuvre au programme : « Art » (Yasmina Reza, 1994)", "<p>" + ART_CONTEXTE + "</p><p class='small muted'>Texte protégé : aucun extrait n'est reproduit dans l'application. Pour t'entraîner, colle un passage de ton exemplaire dans « Mes textes ».</p>"),
  A("Ne lis pas une réplique comme une simple phrase : demande toujours « à qui parle-t-on ? » (personnage <b>et</b> public). Les didascalies ne se « disent » pas : elles guident le jeu.")
], [
  qcm("Les didascalies sont…", ["les indications de jeu données par l'auteur", "les répliques des personnages", "les rimes d'une pièce", "le titre de l'acte"], 0, "Gestes, ton, décor : elles ne sont pas prononcées.", "Leçon 3.3"),
  qcm("Le passage « Au voleur ! au voleur ! » est…", ["un monologue", "une stichomythie", "un aparté", "une didascalie"], 0, "Harpagon est seul en scène, il parle pour lui et pour le public.", "Leçon 3.3", "AVARE"),
  match("Associe chaque type de réplique à sa définition.", [["Tirade", "Longue réplique d'un personnage"], ["Monologue", "Un personnage seul qui parle à lui-même"], ["Aparté", "Mots que seul le public entend"], ["Stichomythie", "Répliques très courtes alternées"]], "Quatre types de répliques.", "Leçon 3.3"),
  qcm("Dans « Art », qu'est-ce qui déclenche la querelle entre les trois amis ?", ["L'achat d'un tableau entièrement blanc", "Un héritage", "Un voyage raté", "Une pièce de théâtre"], 0, "D'après le contexte de l'œuvre : Serge a acheté un tableau blanc à prix très élevé.", "Leçon 3.3"),
  qcm("Quand Marc critique le tableau de Serge devant Serge, à qui la réplique s'adresse-t-elle aussi ?", ["Au public", "À l'auteur seulement", "À personne d'autre", "Au metteur en scène"], 0, "C'est la double énonciation : le public comprend les enjeux de l'amitié.", "Leçon 3.3"),
  multi("Quels sont des types de comique ?", ["de gestes", "de mots", "de situation", "de caractère", "de rimes"], [0, 1, 2, 3], "Le comique de rimes n'existe pas comme type : les quatre autres sont classiques.", "Leçon 3.3")
]),

LESSON("3.4", "L'argumentation : thèse, arguments, exemples, connecteurs", "À la fin, tu sauras relever la thèse, les arguments et les connecteurs d'un texte argumentatif.", [
  D("Thèse, argument, exemple", "<p>La <b>thèse</b> est l'opinion défendue. Un <b>argument</b> est une raison qui la soutient ; un <b>exemple</b> l'illustre. Les <b>connecteurs logiques</b> organisent le raisonnement : cause (car), conséquence (donc), opposition (mais), addition (de plus).</p>"),
  T("Méthode", "Raisonnement argumentatif", "<div class='formula'>Texte argumentatif = Thèse + Arguments + Exemples</div><p>On peut <b>convaincre</b> (par la raison) ou <b>persuader</b> (par l'émotion). L'argumentation est parfois <b>indirecte</b> : conte, fable, ironie.</p>"),
  X("CANDIDE", ["<b>Thèse implicite</b> : la guerre est une absurde boucherie.", "<b>Procédé</b> : l'<i>ironie</i> (antiphrase) : « Rien n'était si beau… », « harmonie… en enfer ».", "<b>Effet</b> : le lecteur comprend le contraire de ce qui est dit.", "<b>Cible</b> : l'optimisme (« le meilleur des mondes ») et l'horreur des batailles."]),
  A("Ne confonds pas argument et exemple : l'argument est une idée, l'exemple un fait précis. Et ne prends pas l'ironie au premier degré : le texte dit le contraire de ce qu'il pense.")
], [
  qcm("Dans cet extrait de Candide, la thèse implicite de Voltaire est que…", ["la guerre est absurde et atroce", "la guerre est belle", "la musique est un art", "les armées sont mal organisées"], 0, "L'ironie fait entendre la condamnation.", "Leçon 3.4", "CANDIDE"),
  qcm("« Rien n'était si beau, si leste, si brillant » est ironique car…", ["on dit le contraire de ce que l'on pense (antiphrase)", "on décrit une parade", "on compare deux armées", "c'est une litote"], 0, "Le contexte (massacre) contredit les éloges.", "Leçon 3.4", "CANDIDE"),
  match("Associe chaque connecteur à sa valeur.", [["car", "Cause"], ["donc", "Conséquence"], ["mais", "Opposition"], ["de plus", "Addition"]], "Les connecteurs organisent le raisonnement.", "Leçon 3.4"),
  qcm("Un exemple dans un texte argumentatif sert à…", ["illustrer un argument", "remplacer la thèse", "ajouter une rime", "conclure"], 0, "L'exemple concrétise l'idée.", "Leçon 3.4"),
  fill("Pour {0}, on s'adresse à la raison ; pour {1}, on touche les émotions.", [[["convaincre", "persuader", "décrire"], 0], [["persuader", "convaincre", "narrer"], 0]], "Convaincre ≠ persuader.", "Leçon 3.4"),
  order("Remets dans l'ordre la structure d'un raisonnement.", ["Poser la thèse", "Donner un argument", "Illustrer par un exemple", "Conclure"], "Thèse → argument → exemple → conclusion.", "Leçon 3.4")
]),
],
[
  qcm("Un narrateur qui sait tout, y compris les pensées des personnages, a une focalisation…", ["omnisciente", "externe", "interne", "nulle"], 0, "Focalisation zéro = omnisciente.", "Leçon 3.1"),
  qcm("Un passage qui décrit un lieu en arrêtant l'action est…", ["une pause", "une ellipse", "un sommaire", "un dialogue"], 0, "Pause descriptive.", "Leçon 3.1"),
  count("Combien de syllabes dans « Un Agneau se désaltérait » ?", 8, "Un / A / gneau / se / dé / sal / té / rait = 8", "Octosyllabe.", "Théorème 4.8"),
  count("Combien de syllabes dans « La raison du plus fort est toujours la meilleure » ?", 12, "La / rai / son / du / plus / fort / est / tou / jours / la / meil / leu(re) = 12", "Alexandrin ; le e final ne compte pas.", "Théorème 4.8"),
  qcm("Des rimes qui alternent A B A B sont…", ["croisées", "suivies", "embrassées", "plates"], 0, "ABAB = croisées.", "Leçon 3.2"),
  qcm("Le e muet à l'intérieur d'un vers, devant une voyelle…", ["s'élide (ne compte pas)", "compte toujours", "compte deux fois", "n'existe pas"], 0, "Élision devant une voyelle.", "Théorème 4.8"),
  qcm("La double énonciation signifie qu'une réplique s'adresse…", ["à un personnage et au public", "à l'auteur seulement", "à deux personnages", "au metteur en scène"], 0, "Deux destinataires à la fois.", "Leçon 3.3"),
  match("Associe chaque connecteur à sa valeur.", [["parce que", "Cause"], ["par conséquent", "Conséquence"], ["cependant", "Opposition"]], "Valeurs des connecteurs.", "Leçon 3.4"),
  qcm("Dans « Art », l'un des trois amis achète un tableau…", ["entièrement blanc", "rouge", "figuratif", "volé"], 0, "Contexte de l'œuvre donné par l'application.", "Leçon 3.3"),
  qcm("L'ironie en argumentation est une…", ["argumentation indirecte", "rime", "didascalie", "ellipse"], 0, "On critique en disant le contraire.", "Leçon 3.4")
]);


// ---------- MODULE 4 — Les registres ----------
mod(4, "Les registres", "registre-roulette",
`<h3>Fiche-mémo — Les registres</h3>
<ul><li><b>Lyrique</b> : sentiments personnels (je, exclamations, musicalité). <b>Pathétique</b> : émouvoir, faire pleurer (victime, souffrance). <b>Tragique</b> : fatalité, destin, impuissance.</li>
<li><b>Comique</b> : faire rire (gestes, mots, situation, caractère). <b>Satirique</b> : critiquer en se moquant. <b>Ironique</b> : dire le contraire de ce qu'on pense.</li>
<li><b>Épique</b> : héros, exploits, grandissement. <b>Fantastique</b> : événement inexplicable dans le réel, hésitation. <b>Réaliste</b> : détails précis du réel.</li></ul>
<div class="box for"><div class="bt">Arbre 4.7</div><div class="formula">émotion dominante → registre</div></div>`,
[
LESSON("4.1", "Lyrique, pathétique, tragique", "À la fin, tu sauras distinguer le lyrique, le pathétique et le tragique grâce à des indices précis.", [
  D("Trois registres de l'émotion", "<p>Le <b>lyrique</b> exprime les sentiments personnels (amour, deuil, mélancolie). Le <b>pathétique</b> cherche à <i>émouvoir</i> (pitié, compassion) en montrant une souffrance. Le <b>tragique</b> montre un personnage écrasé par une fatalité (dieux, destin).</p>"),
  T("Propriété", "Indices de chaque registre", "<ul><li><b>Lyrique</b> : 1<sup>re</sup> personne, exclamations, rythme musical, images personnelles.</li><li><b>Pathétique</b> : lexique de la souffrance, victime innocente ou faible.</li><li><b>Tragique</b> : fatalité, malédiction, aveu d'impuissance.</li></ul><p>Pour trouver le registre, suis l'arbre (4.7) :</p>"),
  AR("registres"),
  X("PHEDRE", ["<b>Procédé</b> : accumulation de réactions du corps (« je le vis, je rougis, je pâlis ») et de verbes à la 1<sup>re</sup> personne.", "<b>Effet</b> : la passion s'impose à Phèdre malgré elle.", "<b>Registre tragique</b> : la cause est une fatalité (Vénus, les « feux redoutables »).", "<b>Registre pathétique</b> : elle souffre sans pouvoir s'en défendre, d'où la pitié du spectateur."]),
  A("Un registre se <b>prouve</b> par des procédés : ne dis pas « c'est triste » sans citer les indices. Et un texte mêle souvent plusieurs registres.")
], [
  qcm("Quel registre domine dans l'aveu de Phèdre (« D'un sang qu'elle poursuit tourments inévitables ») ?", ["Tragique", "Comique", "Épique", "Réaliste"], 0, "Les dieux poursuivent Phèdre : c'est la fatalité.", "Leçon 4.1", "PHEDRE"),
  qcm("« Je ne puis demeurer loin de toi plus longtemps » relève du registre…", ["lyrique", "comique", "fantastique", "satirique"], 0, "Le « je » exprime un sentiment personnel.", "Leçon 4.1", "DEMAIN"),
  qcm("« Nature, berce-le chaudement : il a froid. » cherche surtout à…", ["émouvoir le lecteur (pathétique)", "faire rire", "décrire précisément", "exalter un héros"], 0, "La fragilité du soldat suscite la pitié.", "Leçon 4.1", "DORMEUR"),
  match("Associe chaque registre à son indice.", [["Lyrique", "1re personne, exclamations"], ["Pathétique", "Victime, lexique de la souffrance"], ["Tragique", "Fatalité, destin"]], "Un indice par registre.", "Propriété (indices)"),
  multi("Quels indices relèvent du registre lyrique ?", ["Pronom « je »", "Exclamations", "Musicalité (rythme, sons)", "Détails techniques précis"], [0, 1, 2], "Les détails techniques relèvent du réalisme.", "Propriété (indices)"),
  qcm("Le tragique repose surtout sur…", ["la fatalité", "le rire", "la description précise", "l'exagération comique"], 0, "L'homme est impuissant face au destin.", "Leçon 4.1")
]),

LESSON("4.2", "Comique, satirique, ironique", "À la fin, tu sauras repérer les procédés du comique, de la satire et de l'ironie.", [
  D("Rire, critiquer, ironiser", "<p>Le <b>comique</b> fait rire (gestes, mots, situation, caractère). Le <b>satirique</b> critique un vice ou une société en s'en moquant. L'<b>ironique</b> dit le contraire de ce que l'on pense (antiphrase) pour critiquer.</p>"),
  T("Propriété", "Ironie et satire", "<div class='formula'>Ironie = énoncé + sous-entendu contraire</div><p>La <b>satire</b> suppose une <i>cible</i> (un défaut, un groupe) et un <i>moyen</i> (caricature, exagération, moralité détournée).</p>"),
  X("LOUP", ["<b>Moralité ironique</b> : « La raison du plus fort est toujours la meilleure » ressemble à un principe, mais la fable le montre cruel.", "<b>Comique de situation</b> : le Loup invente des prétextes absurdes (l'Agneau boit en aval).", "<b>Cible</b> : les puissants qui abusent de leur force.", "<b>Registre</b> : satirique, avec une ironie amère."]),
  A("L'ironie n'est pas une simple moquerie : elle suppose un décalage entre ce qui est dit et ce qui est pensé. La satire, elle, a toujours une cible.")
], [
  qcm("« La raison du plus fort est toujours la meilleure » est…", ["ironique et satirique", "lyrique", "épique", "fantastique"], 0, "On dénonce l'abus de pouvoir en feignant de l'approuver.", "Leçon 4.2", "LOUP"),
  qcm("« Ôta du meilleur des mondes environ neuf à dix mille coquins » est…", ["une antiphrase ironique", "une description réaliste", "une litote", "un aveu lyrique"], 0, "Les victimes de guerre sont traitées de « coquins » : ironie.", "Leçon 4.2", "CANDIDE"),
  qcm("Harpagon qui saisit son propre bras relève du comique…", ["de gestes", "de mots", "de rimes", "tragique"], 0, "Un geste inattendu fait rire.", "Leçon 4.2", "AVARE"),
  match("Associe chaque registre à son but.", [["Comique", "Faire rire"], ["Satirique", "Critiquer en se moquant"], ["Ironique", "Dire le contraire de ce qu'on pense"]], "Un but par registre.", "Leçon 4.2"),
  qcm("Une satire a toujours…", ["une cible", "des vers", "un dénouement tragique", "un narrateur interne"], 0, "On critique quelque chose ou quelqu'un.", "Leçon 4.2"),
  multi("Quels éléments produisent le comique de caractère ?", ["L'obsession d'un personnage (avarice)", "Les gestes excessifs", "Un décor précis", "L'entêtement qui le rend ridicule"], [0, 1, 3], "Le décor précis ne produit pas de comique de caractère.", "Leçon 4.2")
]),

LESSON("4.3", "Épique, fantastique, réaliste", "À la fin, tu sauras reconnaître l'épique, le fantastique et le réaliste.", [
  D("Héros, étrange, réel", "<p>L'<b>épique</b> exalte des exploits en les grandissant. Le <b>fantastique</b> fait surgir l'inexplicable dans le réel, avec une <i>hésitation</i> entre explication rationnelle et surnaturelle. Le <b>réaliste</b> représente le réel avec précision (lieux, détails, milieux sociaux).</p>"),
  T("Propriété", "Indices de chaque registre", "<ul><li><b>Épique</b> : hyperboles, gradations, personnification des forces, combats.</li><li><b>Fantastique</b> : lexique de l'étrange, doute, effets d'angoisse.</li><li><b>Réaliste</b> : noms de lieux, chiffres, détails matériels.</li></ul>"),
  X("WATERLOO", ["<b>Procédé</b> : répétition « Waterloo ! Waterloo ! Waterloo ! » (anaphore) et apostrophe à la plaine.", "<b>Procédé</b> : comparaison « comme une onde qui bout dans une urne trop pleine » ; personnification de « la pâle mort ».", "<b>Effet</b> : la bataille prend une dimension de légende.", "<b>Registre épique</b> : grandissement du combat par la mort personnifiée."]),
  A("Fantastique ≠ merveilleux : dans le merveilleux, le surnaturel est accepté (contes) ; dans le fantastique, on hésite. Et « réaliste » ne veut pas dire « vrai » mais « qui donne l'illusion du réel ».")
], [
  qcm("« Waterloo ! Waterloo ! Waterloo ! morne plaine ! » relève du registre…", ["épique", "comique", "réaliste", "lyrique intime"], 0, "La répétition et la personnification de la mort grandissent la bataille.", "Leçon 4.3", "WATERLOO"),
  qcm("L'ouverture de Germinal (lieux, distances, vent de mars) est…", ["réaliste", "fantastique", "comique", "pathétique"], 0, "Des noms de lieux et des mesures précises donnent l'illusion du réel.", "Leçon 4.3", "GERMINAL"),
  qcm("Dans le fantastique, le lecteur…", ["hésite entre explication rationnelle et surnaturelle", "accepte le surnaturel", "rit", "ne comprend rien"], 0, "L'hésitation est la marque du fantastique.", "Leçon 4.3"),
  hl("GERMINAL", "Clique sur les deux noms de lieux précis (indice réaliste).", ["marchiennes", "montsou"], "Les toponymes ancrent le récit dans le réel.", "Leçon 4.3"),
  match("Associe chaque registre à son indice.", [["Épique", "Hyperboles, grandissement, combats"], ["Fantastique", "Étrange, hésitation"], ["Réaliste", "Lieux et détails précis"]], "Un indice par registre.", "Propriété (indices)"),
  qcm("« Le miroir ne renvoyait plus mon visage : à ma place, une silhouette indistincte me souriait » (texte de l'application) est…", ["fantastique", "comique", "réaliste", "satirique"], 0, "Un événement inexplicable surgit dans le quotidien.", "Leçon 4.3")
]),
],
[
  qcm("Quel registre exprime des sentiments personnels avec « je » et exclamations ?", ["Lyrique", "Épique", "Comique", "Réaliste"], 0, "Le lyrisme implique le poète.", "Leçon 4.1"),
  qcm("Le tragique suppose…", ["une fatalité", "une parodie", "une description scientifique", "un exploit"], 0, "L'homme face au destin.", "Leçon 4.1"),
  qcm("Le registre pathétique cherche à…", ["émouvoir", "faire rire", "instruire", "décrire"], 0, "Pitié et compassion.", "Leçon 4.1"),
  qcm("L'ironie consiste à…", ["dire le contraire de ce que l'on pense", "exagérer", "répéter", "décrire"], 0, "Antiphrase critique.", "Leçon 4.2"),
  match("Associe registre et but.", [["Comique", "Faire rire"], ["Satirique", "Critiquer en se moquant"], ["Épique", "Exalter des exploits"], ["Réaliste", "Représenter le réel"]], "Quatre registres.", "Module 4"),
  qcm("« Les égouts soufflaient… leurs haleines empestées » relève du registre…", ["réaliste (naturaliste)", "épique", "lyrique", "comique"], 0, "Détails matériels précis et crus.", "Leçon 4.3", "BELAMI2"),
  qcm("La différence entre fantastique et merveilleux tient à…", ["l'hésitation du lecteur", "la longueur du texte", "la rime", "le nombre de personnages"], 0, "Le fantastique hésite, le merveilleux accepte.", "Leçon 4.3"),
  qcm("Un texte satirique a besoin d'…", ["une cible", "une rime", "un dénouement heureux", "un narrateur interne"], 0, "On critique quelque chose.", "Leçon 4.2"),
  qcm("Dans « Demain, dès l'aube… », le registre dominant est…", ["lyrique", "épique", "comique", "réaliste"], 0, "Sentiments personnels du poète.", "Leçon 4.1", "DEMAIN"),
  multi("Quels indices relèvent du réalisme ?", ["Noms de lieux précis", "Chiffres et distances", "Hyperboles héroïques", "Détails matériels"], [0, 1, 3], "Les hyperboles héroïques sont épiques.", "Leçon 4.3")
]);


// ---------- MODULE 5 — Le théorème de l'analyse ----------
mod(5, "Le théorème de l'analyse", "formule-express",
`<h3>Fiche-mémo — Le théorème de l'analyse</h3>
<div class="box for"><div class="bt">Axiome 1</div><div class="formula">Analyse = Procédé + Citation + Effet + Interprétation</div></div>
<ul><li><b>Théorème de non-paraphrase</b> : si Procédé = 0, l'analyse vaut 0.</li>
<li><b>Paragraphe d'analyse</b> = idée directrice + 1 à 3 analyses PCEI + bilan court.</li>
<li><b>Test anti-paraphrase</b> : si ma phrase dit la même chose que le texte sans nommer de procédé, c'est une paraphrase.</li>
<li>Verbes d'interprétation : montre, révèle, suggère, dénonce, symbolise, met en valeur.</li></ul>`,
[
LESSON("5.1", "De l'observation à l'interprétation (formule PCEI)", "À la fin, tu sauras construire une analyse complète avec la formule PCEI.", [
  D("Observation et interprétation", "<p>Une <b>observation</b> relève un fait du texte (un procédé). Une <b>interprétation</b> dit ce que ce fait <i>révèle</i> du sens du texte. Analyser, c'est aller de l'une à l'autre.</p>"),
  F("Axiome 1 — La formule d'analyse", "Analyse = Procédé + Citation + Effet + Interprétation", "<p><b>Théorème de non-paraphrase :</b> si le terme Procédé vaut 0, la phrase est une paraphrase et vaut 0, quels que soient les autres termes. Chaque terme vaut 1 point (sur 4).</p>"),
  T("Méthode", "Comment remplir chaque terme", "<ul><li><b>P</b> — Comment est-ce écrit ? (nommer la figure, le temps, le registre…)</li><li><b>C</b> — Où le prouver ? (citer entre guillemets)</li><li><b>E</b> — Quel effet sur le lecteur ?</li><li><b>I</b> — Que révèle le texte ? (idée, visée de l'auteur)</li></ul>"),
  X("DORMEUR", ["<b>P</b> : un euphémisme et un contraste de couleurs dans la chute du poème.", "<b>C</b> : « Il a deux trous rouges au côté droit. »", "<b>E</b> : le rouge du sang rompt brutalement avec la douceur du décor : la mort est révélée d'un coup.", "<b>I</b> : Rimbaud dénonce la violence de la guerre, cachée sous un paysage paisible."]),
  A("Une phrase sans <b>procédé</b> (P = 0) vaut 0, même si elle est juste : « Le soldat est mort » est un fait, pas une analyse.")
], [
  pcei("Complète l'analyse de la dernière phrase du poème.", "Tranquille. Il a deux trous rouges au côté droit.",
    [["Un euphémisme associé à un contraste de couleurs", "Une allitération en [r]", "Une question rhétorique", "Une anaphore"], 0],
    [["« Il a deux trous rouges au côté droit »", "« C'est un trou de verdure »", "« Il dort dans le soleil »", "« Nature, berce-le »"], 0],
    [["La mort est révélée brutalement après un décor paisible", "Une impression de gaieté", "La rivière est décrite", "Un souvenir d'enfance"], 0],
    [["Rimbaud dénonce la violence de la guerre sous un paysage paisible", "Rimbaud aime les paysages", "Le soldat dort bien", "Le poème est triste"], 0],
    "P + C + E + I : chaque terme manquant fait perdre un point, et P = 0 annule tout.", "Axiome 1"),
  pcei("Complète l'analyse de ce vers de Baudelaire.", "Laissent piteusement leurs grandes ailes blanches\nComme des avirons traîner à côté d'eux.",
    [["Une comparaison", "Une litote", "Une assonance", "Un oxymore"], 0],
    [["« Comme des avirons traîner à côté d'eux »", "« les hommes d'équipage »", "« vastes oiseaux des mers »", "« Souvent, pour s'amuser »"], 0],
    [["Elle rend visibles des ailes lourdes et encombrantes", "Elle donne un rythme rapide", "Elle exprime la joie", "Elle décrit la mer"], 0],
    [["Le poète, comme l'albatros, est maladroit et incompris dans la société", "Les marins sont généreux", "Les albatros sont lents", "Le navire avance"], 0],
    "La comparaison (P) est prouvée par la citation (C), puis interprétée (I).", "Axiome 1"),
  qcm("Si le terme Procédé vaut 0, l'analyse vaut…", ["0 (paraphrase)", "3 sur 4", "2 sur 4", "4 sur 4"], 0, "Théorème de non-paraphrase : sans procédé, il n'y a pas d'analyse.", "Axiome 1"),
  match("Associe chaque terme de la formule à sa question.", [["Procédé", "Comment est-ce écrit ?"], ["Citation", "Où le prouver ?"], ["Effet", "Quel effet sur le lecteur ?"], ["Interprétation", "Que révèle le texte ?"]], "Quatre termes, quatre questions.", "Axiome 1"),
  order("Remets les termes de l'analyse dans l'ordre.", ["Procédé", "Citation", "Effet", "Interprétation"], "Procédé → Citation → Effet → Interprétation.", "Axiome 1"),
  fill("Analyse = {0} + Citation + {1} + Interprétation.", [[["Procédé", "Paraphrase", "Résumé"], 0], [["Effet", "Date", "Titre"], 0]], "Les quatre termes de l'Axiome 1.", "Axiome 1")
]),

LESSON("5.2", "Le paragraphe d'analyse", "À la fin, tu sauras rédiger un paragraphe d'analyse structuré.", [
  D("Paragraphe d'analyse", "<p>Un <b>paragraphe</b> de commentaire développe <i>une idée</i> en s'appuyant sur une ou plusieurs analyses PCEI, avec une phrase d'ouverture et un petit bilan.</p>"),
  F("Structure du paragraphe", "Paragraphe = Idée directrice + (Analyse PCEI)ⁿ + Bilan", "<p>n = 1 à 3. Les analyses sont reliées par des connecteurs (<i>en effet, de plus, ainsi</i>).</p>"),
  T("Méthode", "Rédiger pas à pas", "<ol><li>Écrire l'idée directrice (une interprétation).</li><li>Citer et nommer le procédé.</li><li>Expliquer l'effet.</li><li>Interpréter, puis relier à l'idée de départ.</li></ol>"),
  X("DEMAIN", ["<b>Idée directrice</b> : Hugo montre une détermination qui se heurte à la douleur.", "<b>P + C</b> : l'<i>anaphore</i> « j'irai par la forêt, j'irai par la montagne » ;", "<b>E</b> : elle crée un rythme de marche obstinée ;", "<b>I</b> : le poète est prêt à tout pour rejoindre sa fille défunte.", "<b>Bilan</b> : la marche est donc l'expression concrète du deuil."]),
  A("Ne commence pas un paragraphe par une citation sans l'annoncer, et ne termine pas sans lien avec l'idée directrice : le paragraphe doit « boucler » son idée.")
], [
  order("Remets les éléments du paragraphe dans l'ordre.", ["Idée directrice", "Procédé et citation", "Effet", "Interprétation", "Bilan"], "Idée → analyse (P, C, E, I) → bilan.", "Leçon 5.2"),
  qcm("Une idée directrice est…", ["une interprétation qui annonce le paragraphe", "une citation", "un résumé du texte", "une date"], 0, "Elle guide tout le paragraphe.", "Leçon 5.2"),
  fill("Un paragraphe d'analyse contient une {0}, une ou plusieurs analyses {1} et un bilan.", [[["idée directrice", "paraphrase", "rime"], 0], [["PCEI", "narratives", "lyriques"], 0]], "Idée + (PCEI)ⁿ + bilan.", "Leçon 5.2"),
  multi("Quels connecteurs relient deux analyses ?", ["en effet", "de plus", "ainsi", "il était une fois"], [0, 1, 2], "Les trois premiers servent à enchaîner.", "Leçon 5.2"),
  qcm("Dans l'exemple, le rôle de « j'irai par la forêt, j'irai par la montagne » est…", ["la citation qui prouve l'anaphore", "l'idée directrice", "le bilan", "l'interprétation"], 0, "La citation prouve le procédé (C).", "Leçon 5.2", "DEMAIN"),
  write("Rédige un paragraphe sur l'antithèse « beau / laid » dans L'Albatros.", [["Il commence par une idée directrice", ""], ["Il cite le texte entre guillemets", "«[^»]+»|\"[^\"]+\""], ["Il nomme le procédé (antithèse)", "antith"], ["Il explique l'effet", "effet|souligne|met en valeur|crée|accentue"], ["Il interprète (ce que cela révèle)", "montre|révèle|suggère|dénonce|évoque|symbolise"]], "Baudelaire souligne la chute de l'oiseau. L'antithèse « naguère si beau » / « comique et laid » crée un contraste violent entre le passé et le présent. Elle révèle que le poète, grand dans l'inspiration, est ridicule aux yeux de la société qui ne le comprend pas.", "Leçon 5.2")
]),

LESSON("5.3", "Éviter la paraphrase", "À la fin, tu sauras reconnaître une paraphrase et la transformer en analyse.", [
  D("Paraphrase", "<p>La <b>paraphrase</b> reformule ou raconte le texte avec d'autres mots, sans nommer de procédé ni interpréter. Elle ne dit rien de plus que le texte.</p>"),
  T("Théorème", "Théorème de non-paraphrase", "<div class='formula'>Procédé = 0 ⇒ Analyse = 0</div><p><b>Test :</b> si je retire ma phrase, perd-on une idée que le texte ne disait pas déjà ? Si non : paraphrase.</p>"),
  X("BELAMI1", ["<b>Paraphrase</b> : « Duroy sort du restaurant et regarde les gens. » → rien de plus que le texte.", "<b>Analyse</b> : la comparaison « comme des coups d'épervier » (P, C) suggère un regard de prédateur (E) : Duroy se met en scène pour séduire (I)."]),
  A("Raconter n'est pas analyser : « puis », « ensuite », « on voit que » sont des signaux d'alerte. Remplace-les par un procédé nommé.")
], [
  qcm("Laquelle de ces phrases est une paraphrase ?", ["Duroy sort du restaurant et regarde les gens.", "La comparaison « coups d'épervier » suggère un regard de prédateur.", "Le passé simple enchaîne des gestes rapides.", "L'ironie du narrateur dénonce la pose du personnage."], 0, "Elle répète le texte sans procédé (P = 0).", "Théorème de non-paraphrase", "BELAMI1"),
  multi("Quels indices signalent un risque de paraphrase ?", ["« puis », « ensuite »", "« on voit que »", "Un procédé nommé", "Une phrase qui reformule seulement"], [0, 1, 3], "Un procédé nommé protège de la paraphrase.", "Théorème de non-paraphrase"),
  qcm("Pour transformer une paraphrase en analyse, il faut d'abord ajouter…", ["un procédé nommé", "une date", "un adjectif", "une rime"], 0, "P est le terme qui fait basculer vers l'analyse.", "Théorème de non-paraphrase"),
  pcei("Transforme la paraphrase en analyse : « Harpagon dit qu'on l'a assassiné. »", "On m'a coupé la gorge, on m'a dérobé mon argent !",
    [["Une hyperbole", "Une litote", "Un oxymore", "Une assonance"], 0],
    [["« on m'a coupé la gorge »", "« Justice, juste ciel »", "« Arrête »", "« Rends-moi mon argent »"], 0],
    [["L'exagération rend la douleur comique", "L'effet est lyrique", "Elle crée une description précise", "Elle exprime la sérénité"], 0],
    [["La perte de son argent compte plus pour lui que sa propre vie", "Harpagon est violent", "Il a été attaqué", "Le vol est un crime"], 0],
    "Procédé (hyperbole) → citation → effet → interprétation.", "Théorème de non-paraphrase"),
  fill("Une phrase sans {0} est une {1}.", [[["procédé", "citation", "date"], 0], [["paraphrase", "interprétation", "problématique"], 0]], "Théorème de non-paraphrase.", "Théorème de non-paraphrase"),
  write("Transforme cette paraphrase en analyse : « Le poète dit que l'albatros est maladroit sur le pont. »", [["Il nomme un procédé (comparaison, métaphore…)", "comparaison|métaphore|antith|périphrase"], ["Il cite le texte entre guillemets", "«[^»]+»|\"[^\"]+\""], ["Il explique un effet", "effet|souligne|montre|crée|met en valeur"], ["Il interprète (ce que cela révèle)", "poète|révèle|suggère|symbolise|dénonce"]], "La comparaison « comme des avirons » souligne la lourdeur des ailes sur le pont ; elle suggère que le poète, grand dans les airs, est maladroit dans la société.", "Théorème de non-paraphrase")
]),
],
[
  qcm("L'Axiome 1 est…", ["Analyse = Procédé + Citation + Effet + Interprétation", "Analyse = Résumé + Date", "Analyse = Thème + Rime", "Analyse = Figure + Titre"], 0, "Les quatre termes PCEI.", "Axiome 1"),
  qcm("Le théorème de non-paraphrase dit que si Procédé = 0…", ["l'analyse vaut 0", "l'analyse vaut 2", "on gagne un point bonus", "la citation compte double"], 0, "Sans procédé : paraphrase.", "Axiome 1"),
  pcei("Complète l'analyse.", "Rien n'était si beau, si leste, si brillant, si bien ordonné que les deux armées.",
    [["Une ironie (antiphrase) avec accumulation", "Une litote", "Une comparaison", "Un oxymore"], 0],
    [["« Rien n'était si beau, si leste, si brillant »", "« Les canons renversèrent »", "« neuf à dix mille coquins »", "« en enfer »"], 0],
    [["Le lecteur comprend le contraire : le massacre n'a rien de beau", "Il comprend l'admiration de l'auteur", "Il rit de la musique", "Il est choqué par les mots"], 0],
    [["Voltaire dénonce l'horreur de la guerre", "Voltaire admire l'armée", "Voltaire décrit un défilé", "Voltaire raconte sa jeunesse"], 0],
    "Procédé, citation, effet, interprétation.", "Axiome 1"),
  pcei("Complète l'analyse.", "Je le vis, je rougis, je pâlis à sa vue",
    [["Une accumulation de verbes (gradation du trouble)", "Une comparaison", "Un oxymore", "Une métaphore filée"], 0],
    [["« je le vis, je rougis, je pâlis »", "« mon superbe ennemi »", "« Athènes »", "« mon repos, mon bonheur »"], 0],
    [["Un rythme saccadé qui traduit le trouble", "Un effet comique", "Une description du décor", "Une impression de calme"], 0],
    [["La passion s'empare de Phèdre malgré elle (tragique)", "Phèdre est contente", "Phèdre voyage", "Phèdre voit un ami"], 0],
    "Un procédé précis, prouvé et interprété.", "Axiome 1"),
  order("Remets les termes de l'analyse dans l'ordre.", ["Procédé", "Citation", "Effet", "Interprétation"], "PCEI.", "Axiome 1"),
  qcm("Une idée directrice est…", ["une interprétation annoncée au début du paragraphe", "une citation", "un résumé", "une date"], 0, "Elle guide le paragraphe.", "Leçon 5.2"),
  multi("Quelles phrases sont des paraphrases ?", ["Le soldat dort dans l'herbe.", "Un euphémisme adoucit la mort du soldat.", "Harpagon crie qu'on l'a volé.", "L'hyperbole rend la plainte comique."], [0, 2], "Les phrases 2 et 4 nomment un procédé.", "Théorème de non-paraphrase"),
  match("Associe chaque terme à son rôle.", [["P", "Nommer la figure"], ["C", "Citer le texte"], ["E", "Dire l'effet"], ["I", "Dire ce que le texte révèle"]], "Rôle de chaque lettre.", "Axiome 1"),
  fill("L'{0} dit ce que le texte {1}.", [[["interprétation", "citation", "date"], 0], [["révèle", "raconte", "décrit seulement"], 0]], "I = ce que le texte révèle.", "Axiome 1"),
  qcm("Un paragraphe d'analyse se termine par…", ["un bilan qui boucle l'idée", "une question", "une nouvelle citation", "un résumé du roman"], 0, "Le bilan relie à l'idée directrice.", "Leçon 5.2")
]);


// ---------- MODULE 6 — Construire un commentaire ----------
mod(6, "Construire un commentaire", "plan-puzzle",
`<h3>Fiche-mémo — Construire un commentaire</h3>
<div class="box for"><div class="bt">Théorème 4.3</div><div class="formula">Problématique = Comment + auteur + procédés dominants + effet/visée</div></div>
<ul><li><b>Plan</b> = 2 ou 3 axes ; axe = 2 ou 3 sous-parties ; sous-partie = ≥ 1 analyse PCEI.</li>
<li><b>Condition de validité</b> : chaque axe est une <i>idée</i>, jamais un procédé ni un numéro de vers.</li>
<li><b>Progression</b> : du sens le plus visible au plus profond.</li>
<li><b>Citations</b> : chacune est placée dans une seule sous-partie et analysée avec PCEI.</li></ul>`,
[
LESSON("6.1", "Trouver la problématique", "À la fin, tu sauras construire une problématique avec l'équation 4.3.", [
  D("Problématique", "<p>La <b>problématique</b> est la question à laquelle tout le commentaire répond. Elle naît de l'observation des procédés dominants et de la visée du texte.</p>"),
  F("Théorème 4.3 — Équation de la problématique", "Problématique = Comment + auteur + procédés dominants + effet/visée", "<p>Exemple : <i>Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre dans « Le Dormeur du val » ?</i></p>"),
  T("Méthode", "Algorithme de construction", "<ol><li>Repérer le thème.</li><li>Relever les procédés dominants (champ lexical, figure, temps…).</li><li>Formuler l'effet ou la visée.</li><li>Assembler : Comment + auteur + procédés + visée.</li></ol>"),
  X("ALBATROS", ["<b>Procédés dominants</b> : métaphores (« rois de l'azur »), comparaison (« avirons »), antithèse (beau / laid).", "<b>Visée</b> : montrer la condition du poète, grand et incompris.", "<b>Problématique</b> : « Comment Baudelaire, par un jeu de contrastes et d'images, fait-il de l'albatros le symbole du poète incompris ? »"]),
  A("Une problématique n'est pas une question à réponse oui/non ni un sujet : elle ne se limite pas à « Comment l'auteur parle-t-il de… ? » sans procédé ni visée.")
], [
  fill("Problématique = {0} + auteur + {1} + effet/visée.", [[["Comment", "Pourquoi", "Quand"], 0], [["procédés dominants", "résumé", "date"], 0]], "Équation 4.3.", "Théorème 4.3"),
  qcm("Quelle est la meilleure problématique sur « L'Albatros » ?", ["Baudelaire parle-t-il d'un oiseau ?", "L'albatros dans le poème", "Comment Baudelaire, par un jeu de contrastes et d'images, fait-il de l'albatros le symbole du poète incompris ?", "Le poème a quatre strophes."], 2, "Seule la troisième contient Comment + procédés + visée.", "Théorème 4.3", "ALBATROS"),
  multi("Quelles problématiques sont invalides ?", ["Rimbaud parle-t-il de la guerre ?", "Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ?", "La guerre dans le poème.", "En quoi le contraste du dernier vers dénonce-t-il la guerre ?"], [0, 2], "Un oui/non et un simple thème sont invalides.", "Théorème 4.3", "DORMEUR"),
  order("Remets dans l'ordre l'algorithme de construction.", ["Repérer le thème", "Relever les procédés dominants", "Formuler l'effet ou la visée", "Assembler la question « Comment… ? »"], "On termine par l'assemblage.", "Théorème 4.3"),
  match("Associe chaque terme de l'équation à l'exemple Rimbaud.", [["Comment", "Comment"], ["auteur", "Rimbaud"], ["procédés dominants", "par un jeu de contrastes"], ["effet/visée", "dénonce-t-il la guerre"]], "Chaque terme se retrouve dans la question.", "Théorème 4.3"),
  write("Formule une problématique sur « Le Loup et l'Agneau » de La Fontaine.", [["Elle commence par « Comment » ou « En quoi »", "^\\s*(comment|en quoi)"], ["Elle se termine par un point d'interrogation", "\\?\\s*$"], ["Elle nomme l'auteur ou le texte", "fontaine|loup|agneau"], ["Elle nomme un procédé ou une visée", "ironie|satire|critique|dénonce|fable|moralité|argument"]], "Comment La Fontaine, par l'ironie d'une fable, dénonce-t-il la loi du plus fort dans « Le Loup et l'Agneau » ?", "Théorème 4.3")
]),

LESSON("6.2", "Construire le plan (2 ou 3 axes, sous-parties)", "À la fin, tu sauras construire un plan valide et progressif.", [
  D("Axe et sous-partie", "<p>Un <b>axe</b> est une grande partie du commentaire ; il répond à la problématique. Il se décompose en <b>sous-parties</b>, chacune appuyée sur une ou plusieurs analyses PCEI.</p>"),
  F("Théorème 4.4 — Théorème du plan", "Plan = 2 ou 3 axes ; axe = 2 ou 3 sous-parties ; sous-partie = ≥ 1 analyse PCEI", "<p><b>Condition de validité :</b> chaque axe est une <i>idée</i> (interprétation), jamais un procédé ni un numéro de vers. « I. Les figures de style » est <b>invalide</b> ; « I. Un paysage idyllique » est <b>valide</b>.</p><p><b>Progression :</b> de l'axe I à l'axe II, on passe du sens le plus visible au plus profond (évident → implicite).</p>"),
  X("DORMEUR", ["<b>Problématique</b> : Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ?", "<b>Axe I (visible)</b> : « Un paysage idyllique » — nature lumineuse, vie, douceur (v. 1-8).", "<b>Axe II (profond)</b> : « Une mort révélée avec violence » — indices de mort puis chute (v. 9-14).", "<b>Validité</b> : chaque axe est une idée ; la progression va du décor à la dénonciation."]),
  A("Un axe n'est ni un procédé (« Les figures de style »), ni un découpage mécanique (« Les vers 1 à 4 »), ni un sujet vague (« La nature »). C'est une <b>idée</b> qui répond à la problématique.")
], [
  qcm("Quel axe est valide ?", ["I. Les figures de style", "I. Un paysage idyllique", "I. Les vers 1 à 8", "I. Le champ lexical"], 1, "Seul « Un paysage idyllique » est une idée (4.4).", "Théorème 4.4", "DORMEUR"),
  multi("Quels axes sont invalides ?", ["Les métaphores", "Une chute humiliante", "Les quatre premiers vers", "Un poète incompris"], [0, 2], "Un procédé ou un découpage de vers n'est pas une idée.", "Théorème 4.4", "ALBATROS"),
  order("Classe ces axes de l'évident à l'implicite.", ["Un paysage idyllique", "Des indices de mort discrets", "Une dénonciation de la guerre"], "On va du sens visible au sens profond.", "Théorème 4.4"),
  match("Valide ou invalide ?", [["Les figures de style", "Invalide (un procédé)"], ["Un oiseau majestueux", "Valide (une idée)"], ["Vers 1 à 8", "Invalide (des vers)"]], "Un axe est toujours une interprétation.", "Théorème 4.4"),
  qcm("Un plan de commentaire comporte…", ["2 ou 3 axes", "5 axes", "1 seul axe", "autant d'axes que de vers"], 0, "Théorème 4.4.", "Théorème 4.4"),
  fill("Un axe est une {0} ; il répond à la {1}.", [[["idée", "figure", "citation"], 0], [["problématique", "rime", "date"], 0]], "Condition de validité de 4.4.", "Théorème 4.4")
]),

LESSON("6.3", "Organiser les citations dans le plan", "À la fin, tu sauras placer chaque citation à sa place dans le plan.", [
  D("Tableau du plan", "<p>Le <b>tableau du plan</b> associe, pour chaque sous-partie, les citations retenues et le procédé qu'elles illustrent. Il se fait au brouillon, avant la rédaction.</p>"),
  T("Méthode", "Règles de placement", "<ul><li>Une citation sert <b>une</b> analyse (pas de doublon).</li><li>Une citation est <b>courte</b> et <b>exacte</b>.</li><li>Chaque citation est reliée à un procédé : citation = C de PCEI.</li><li>Ce qui ne sert pas l'axe est écarté.</li></ul>"),
  X("ALBATROS", ["<b>I. Un oiseau majestueux</b> : « vastes oiseaux des mers », « rois de l'azur » (métaphores).", "<b>II. Une chute humiliante</b> : « comme des avirons » (comparaison), « gauche et veule », « comique et laid » (antithèse).", "<b>III. Le poète incompris</b> : « Le Poète est semblable au prince des nuées » (comparaison), « ses ailes de géant l'empêchent de marcher » (paradoxe)."]),
  A("Ne cite pas tout le poème : trois à cinq citations bien choisies valent mieux que dix recopiées. Et ne place jamais la même citation dans deux sous-parties.")
], [
  match("Associe chaque citation à son axe.", [["« rois de l'azur »", "I. Un oiseau majestueux"], ["« comme des avirons »", "II. Une chute humiliante"], ["« Le Poète est semblable au prince des nuées »", "III. Le poète incompris"]], "Chaque citation sert l'idée de son axe.", "Leçon 6.3"),
  qcm("Une citation doit être…", ["courte, exacte et reliée à un procédé", "longue et recopiée", "toujours un vers entier", "sans guillemets"], 0, "Citation = C de PCEI.", "Leçon 6.3"),
  qcm("Peut-on utiliser la même citation dans deux sous-parties ?", ["Non : une citation sert une analyse", "Oui, toujours", "Oui, si elle rime", "Seulement dans l'introduction"], 0, "Éviter les doublons.", "Leçon 6.3"),
  order("Remets dans l'ordre la préparation du plan.", ["Relever les procédés", "Choisir les citations", "Les regrouper en idées (axes)", "Ordonner du plus visible au plus profond"], "On regroupe puis on ordonne.", "Leçon 6.3"),
  fill("Dans le tableau du plan, chaque sous-partie contient des {0} et le {1} qu'elles illustrent.", [[["citations", "dates", "rimes"], 0], [["procédé", "titre", "nom du poète"], 0]], "Tableau : sous-partie → citations → procédés.", "Leçon 6.3"),
  multi("Quelles citations de L'Albatros servent l'axe « Une chute humiliante » ?", ["« comme des avirons »", "« gauche et veule »", "« rois de l'azur »", "« comique et laid »"], [0, 1, 3], "« Rois de l'azur » appartient à l'axe majestueux.", "Leçon 6.3", "ALBATROS")
]),
],
[
  qcm("La problématique commence par…", ["Comment (ou En quoi)", "Pourquoi pas", "Quand", "Oui ou non"], 0, "Théorème 4.3.", "Théorème 4.3"),
  qcm("Laquelle est une bonne problématique ?", ["La guerre chez Rimbaud", "Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ?", "Rimbaud aime-t-il la nature ?", "Le poème a quatre strophes"], 1, "Elle contient Comment + auteur + procédé + visée.", "Théorème 4.3", "DORMEUR"),
  qcm("Un plan comporte…", ["2 ou 3 axes", "10 axes", "un axe par vers", "aucun axe"], 0, "Théorème 4.4.", "Théorème 4.4"),
  multi("Quels axes sont valides ?", ["Un paysage idyllique", "Les figures de style", "Une mort révélée avec violence", "Les vers 5 à 8"], [0, 2], "Les valides sont des idées.", "Théorème 4.4"),
  order("Classe de l'évident à l'implicite.", ["Un décor paisible", "Des indices de mort", "La dénonciation de la guerre"], "Progression 4.4.", "Théorème 4.4"),
  qcm("Chaque sous-partie contient au moins…", ["une analyse PCEI", "une rime", "un résumé", "une date"], 0, "Sous-partie = ≥ 1 analyse PCEI.", "Théorème 4.4"),
  match("Associe chaque élément à son rôle.", [["Axe", "Une idée qui répond à la problématique"], ["Sous-partie", "Une étape de l'idée appuyée sur PCEI"], ["Citation", "Preuve courte et exacte"]], "Vocabulaire du plan.", "Module 6"),
  fill("Un axe est une {0}, jamais un {1}.", [[["idée", "procédé", "vers"], 0], [["procédé", "raisonnement", "sentiment"], 0]], "Condition de validité.", "Théorème 4.4"),
  qcm("« Les vers 1 à 4 » est un axe…", ["invalide", "valide", "excellent", "obligatoire"], 0, "Un découpage de vers n'est pas une idée.", "Théorème 4.4"),
  qcm("On prépare le plan…", ["au brouillon, avant de rédiger", "après la conclusion", "pendant l'introduction", "jamais"], 0, "Le tableau du plan se fait au brouillon.", "Leçon 6.3")
]);


// ---------- MODULE 7 — Introduction et conclusion ----------
mod(7, "Introduction et conclusion", "intro-builder",
`<h3>Fiche-mémo — Introduction et conclusion</h3>
<div class="box for"><div class="bt">Algorithme 4.5</div><div class="formula">Intro = f(amorce, présentation, situation, problématique, plan)</div></div>
<ol><li><b>Amorce</b> (contexte : auteur, mouvement, époque)</li><li><b>Présentation du texte</b> (titre, genre, date, place dans l'œuvre)</li><li><b>Résumé / situation</b> (1 phrase)</li><li><b>Problématique</b> (une question)</li><li><b>Annonce du plan</b> (« Nous verrons d'abord…, puis… »)</li></ol>
<div class="box for"><div class="bt">Algorithme 4.6</div><div class="formula">Conclusion = Bilan + Réponse nette + Ouverture</div></div>
<ul><li><b>Transition</b> = bilan de la partie + annonce de la suivante.</li></ul>`,
[
LESSON("7.1", "Les 5 étapes de l'introduction", "À la fin, tu sauras écrire une introduction complète en 5 étapes.", [
  D("Introduction", "<p>L'<b>introduction</b> présente le texte et annonce la démarche du commentaire. Elle suit un algorithme fixe : cinq étapes, dans l'ordre.</p>"),
  F("Algorithme 4.5 — L'introduction", "Intro = f(amorce, présentation, situation, problématique, annonce du plan)", "<ol><li><b>Amorce</b> : contexte (auteur, mouvement, époque), 1-2 phrases.</li><li><b>Présentation du texte</b> : titre, genre, date, place dans l'œuvre.</li><li><b>Résumé / situation</b> : ce qui se passe dans l'extrait, 1 phrase.</li><li><b>Problématique</b> : une question (équation 4.3).</li><li><b>Annonce du plan</b> : « Nous verrons d'abord…, puis… ».</li></ol><p>Si un argument manque, l'introduction est <b>incomplète</b> : le vérificateur nomme l'étape manquante.</p>"),
  X("DORMEUR", ["<b>1. Amorce</b> : En 1870, alors que la guerre franco-prussienne éclate, le jeune Rimbaud écrit ses premiers grands poèmes.", "<b>2. Présentation</b> : « Le Dormeur du val » est un sonnet du Cahier de Douai, composé en octobre 1870.", "<b>3. Situation</b> : le poème décrit un soldat qui semble dormir dans la nature, mais qui est mort.", "<b>4. Problématique</b> : Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ?", "<b>5. Plan</b> : Nous verrons d'abord un paysage idyllique, puis la révélation de la mort du soldat."]),
  A("Ne commence pas par « Dans ce texte… » ni par une généralité (« De tout temps, les hommes… »). Ne raconte pas tout le texte à l'étape 3 : une phrase suffit. Et n'oublie jamais l'annonce du plan.")
], [
  order("Remets les 5 étapes de l'introduction dans l'ordre.", ["Amorce", "Présentation du texte", "Résumé / situation", "Problématique", "Annonce du plan"], "Algorithme 4.5 : toujours dans cet ordre.", "Algorithme 4.5"),
  qcm("Laquelle de ces phrases est une amorce ?", ["En 1870, alors que la guerre éclate, un jeune poète de seize ans écrit ses premiers grands poèmes.", "Comment Rimbaud dénonce-t-il la guerre ?", "Nous verrons d'abord un paysage idyllique.", "Le poème décrit un soldat qui dort."], 0, "L'amorce situe l'auteur dans son contexte.", "Algorithme 4.5"),
  match("Associe chaque étape à son rôle.", [["Amorce", "Placer le texte dans son contexte"], ["Présentation du texte", "Titre, genre, date, place dans l'œuvre"], ["Résumé / situation", "Dire ce qui se passe dans l'extrait"], ["Problématique", "Poser la question du commentaire"], ["Annonce du plan", "Annoncer les axes (« Nous verrons d'abord… »)"]], "Cinq étapes, cinq rôles.", "Algorithme 4.5"),
  qcm("Quelle étape manque dans cette introduction ? « En 1870, alors que la guerre éclate, Rimbaud écrit ses premiers poèmes. « Le Dormeur du val » est un sonnet de 1870. Le poème décrit un soldat qui dort dans la nature mais qui est mort. Nous verrons d'abord un paysage idyllique, puis la mort du soldat. »", ["La problématique", "L'amorce", "La présentation du texte", "L'annonce du plan"], 0, "Il n'y a aucune question : l'étape 4 manque.", "Algorithme 4.5"),
  multi("Quelles phrases n'ont PAS leur place dans une introduction ?", ["Je trouve ce poème très beau.", "Dans cette conclusion, nous avons vu que…", "Comment Hugo exprime-t-il le deuil ?", "Premièrement, il y a une métaphore au vers 3."], [0, 1, 3], "Opinion, conclusion et développement sont hors sujet ici.", "Algorithme 4.5"),
  write("Rédige l'introduction de « Le Loup et l'Agneau » (La Fontaine, Fables, livre I).", [["Amorce (contexte : La Fontaine, XVIIe siècle…)", "fontaine|xviie|siècle|fables"], ["Présentation (titre, genre, recueil)", "fable|livre|recueil|«[^»]*loup[^»]*»"], ["Situation (loup, agneau)", "loup.*agneau|agneau.*loup"], ["Problématique (une question)", "\\?"], ["Annonce du plan", "d'abord|dans un premier temps|puis|enfin"]], "Au XVIIe siècle, La Fontaine met en scène des animaux pour critiquer les hommes. « Le Loup et l'Agneau » ouvre le livre I des Fables (1668). Un loup cherche querelle à un agneau pour le dévorer. Comment La Fontaine, par l'ironie d'une fable, dénonce-t-il la loi du plus fort ? Nous verrons d'abord un procès truqué, puis une morale cruelle.", "Algorithme 4.5")
]),

LESSON("7.2", "Les 3 étapes de la conclusion", "À la fin, tu sauras conclure en 3 étapes : bilan, réponse nette, ouverture.", [
  D("Conclusion", "<p>La <b>conclusion</b> répond à la problématique en rappelant l'essentiel du commentaire. Elle ne contient <i>aucune idée nouvelle</i>.</p>"),
  F("Algorithme 4.6 — La conclusion", "Conclusion = Bilan + Réponse nette + Ouverture", "<ol><li><b>Bilan</b> : résumer les axes.</li><li><b>Réponse nette</b> : une phrase qui répond directement à la problématique.</li><li><b>Ouverture</b> : lien avec une autre œuvre, un autre auteur ou un thème (facultative, mais récompensée).</li></ol>"),
  X("ALBATROS", ["<b>Bilan</b> : nous avons vu un oiseau majestueux, puis humilié, qui annonce le poète.", "<b>Réponse nette</b> : ainsi, par le jeu des contrastes et des images, Baudelaire fait de l'albatros le symbole du poète incompris.", "<b>Ouverture</b> : on peut rapprocher ce poème de « Le Dormeur du val » où, là aussi, un contraste révèle une vérité douloureuse."]),
  A("Ne dis rien de nouveau en conclusion : pas d'argument inédit. Et une ouverture trop vague (« Et dans la vie ? ») ne rapporte rien : cite une œuvre ou un thème précis.")
], [
  order("Remets les 3 étapes de la conclusion dans l'ordre.", ["Bilan", "Réponse nette", "Ouverture"], "Algorithme 4.6.", "Algorithme 4.6"),
  qcm("Quelle étape de la conclusion est facultative mais récompensée ?", ["L'ouverture", "Le bilan", "La réponse nette", "L'amorce"], 0, "L'ouverture montre ta culture.", "Algorithme 4.6"),
  qcm("La réponse nette est…", ["une phrase qui répond directement à la problématique", "un résumé de chaque vers", "une nouvelle citation", "une question"], 0, "Elle répond à la question posée en introduction.", "Algorithme 4.6"),
  match("Associe chaque étape à son rôle.", [["Bilan", "Résumer les axes"], ["Réponse nette", "Répondre en une phrase à la question"], ["Ouverture", "Relier à une autre œuvre ou un autre thème"]], "Trois rôles.", "Algorithme 4.6"),
  multi("Que faut-il éviter dans une conclusion ?", ["Introduire un nouvel argument", "Recopier l'introduction mot pour mot", "Répondre à la problématique", "Une ouverture trop vague"], [0, 1, 3], "Répondre à la problématique est au contraire obligatoire.", "Algorithme 4.6"),
  write("Rédige la conclusion d'un commentaire de « Le Dormeur du val ».", [["Bilan : rappel des axes", "avons vu|avons montré|d'abord|puis|paysage|mort"], ["Réponse nette à la question", "ainsi|donc|en définitive|c'est pourquoi|dénonce"], ["Ouverture vers une autre œuvre ou un thème", "rapprocher|comme|de même|écho|rappelle|hugo|baudelaire|verlaine|autre"]], "Nous avons vu un paysage idyllique, puis la mort révélée par la chute. Ainsi, par un jeu de contrastes, Rimbaud dénonce la guerre. On peut rapprocher ce poème de Candide, où Voltaire dénonce aussi la guerre, mais par l'ironie.", "Algorithme 4.6")
]),

LESSON("7.3", "Transitions entre parties", "À la fin, tu sauras relier deux parties par une transition.", [
  D("Transition", "<p>Une <b>transition</b> est une phrase (ou deux) qui relie deux axes : elle clôt le premier et ouvre le second.</p>"),
  F("Formule de la transition", "Transition = Bilan de la partie + Annonce de la suivante", "<p>On marque souvent le passage par un connecteur d'opposition ou de progression : <i>mais, cependant, pourtant, au-delà de…</i></p>"),
  X("DORMEUR", ["<b>Bilan</b> : le poème nous offre d'abord un paysage idyllique, plein de lumière et de vie.", "<b>Connecteur</b> : mais, derrière cette douceur,", "<b>Annonce</b> : des indices discrets annoncent la mort du soldat."]),
  A("« Passons à la suite » n'est pas une transition : elle ne dit ni ce qu'on vient de montrer ni ce qui vient. Il faut un bilan <b>et</b> une annonce.")
], [
  qcm("Une bonne transition…", ["fait le bilan de la partie et annonce la suivante", "répète l'introduction", "commence par « Passons à la suite »", "introduit une citation"], 0, "Transition = bilan + annonce.", "Formule de la transition"),
  fill("Transition = {0} de la partie + {1} de la suivante.", [[["Bilan", "Citation", "Date"], 0], [["Annonce", "Titre", "Résumé"], 0]], "Deux termes.", "Formule de la transition"),
  qcm("Quelle transition convient entre « Un paysage idyllique » et « La mort révélée » ?", ["Mais cette douceur n'est qu'apparente : des indices annoncent déjà la mort.", "Passons à la suite.", "Le poème a quatre strophes.", "En conclusion, Rimbaud est un poète."], 0, "Elle clôt la douceur et annonce la mort.", "Formule de la transition"),
  match("Associe chaque connecteur à sa valeur.", [["mais", "Opposition"], ["ensuite", "Progression"], ["en effet", "Justification"], ["ainsi", "Conséquence"]], "Les connecteurs structurent les transitions.", "Leçon 7.3"),
  order("Remets les éléments d'une transition dans l'ordre.", ["Rappeler l'idée de l'axe terminé", "Marquer le passage (mais, cependant…)", "Annoncer l'idée de l'axe suivant"], "Bilan → connecteur → annonce.", "Formule de la transition"),
  write("Rédige une transition entre « Un oiseau majestueux » et « Une chute humiliante » (L'Albatros).", [["Elle rappelle l'idée précédente (oiseau majestueux)", "majest|roi|azur|beau|noble"], ["Elle marque le passage (mais, pourtant…)", "mais|pourtant|cependant|or"], ["Elle annonce la chute", "chute|humili|gauche|pont|sol"]], "L'albatros apparaît d'abord comme un roi de l'azur. Mais, dès qu'il est posé sur le pont, cette majesté disparaît : l'oiseau devient gauche et ridicule.", "Formule de la transition")
]),
],
[
  order("Ordonne les 5 étapes de l'introduction.", ["Amorce", "Présentation du texte", "Résumé / situation", "Problématique", "Annonce du plan"], "Algorithme 4.5.", "Algorithme 4.5"),
  qcm("L'amorce sert à…", ["placer le texte dans son contexte", "annoncer le plan", "répondre à la question", "citer un vers"], 0, "Étape 1.", "Algorithme 4.5"),
  qcm("La problématique d'une introduction est…", ["une question", "un résumé", "une date", "une citation"], 0, "Équation 4.3.", "Algorithme 4.5"),
  qcm("« Nous verrons d'abord…, puis… » correspond à…", ["l'annonce du plan", "l'amorce", "la situation", "le bilan"], 0, "Étape 5.", "Algorithme 4.5"),
  order("Ordonne les 3 étapes de la conclusion.", ["Bilan", "Réponse nette", "Ouverture"], "Algorithme 4.6.", "Algorithme 4.6"),
  qcm("En conclusion, il faut…", ["répondre à la problématique", "introduire un nouvel argument", "recopier l'introduction", "faire une citation de 10 vers"], 0, "Réponse nette obligatoire.", "Algorithme 4.6"),
  qcm("L'ouverture est…", ["facultative mais récompensée", "interdite", "obligatoire et longue", "inutile"], 0, "Elle valorise la culture.", "Algorithme 4.6"),
  fill("Transition = {0} + {1}.", [[["bilan", "citation", "date"], 0], [["annonce", "rime", "titre"], 0]], "Formule de la transition.", "Leçon 7.3"),
  qcm("« Passons à la suite » est une…", ["mauvaise transition", "excellente transition", "amorce", "problématique"], 0, "Il manque le bilan et l'annonce.", "Leçon 7.3"),
  multi("Que contient la bonne transition ?", ["Un bilan de la partie", "Un connecteur de passage", "Une annonce de la suite", "Un nouveau poème"], [0, 1, 2], "Pas de nouveau poème.", "Leçon 7.3")
]);


// ---------- MODULE 8 — Le commentaire complet ----------
mod(8, "Le commentaire complet", "boss-bac-blanc",
`<h3>Fiche-mémo — Le commentaire complet</h3>
<div class="box for"><div class="bt">Planning (4 h = 240 min)</div><div class="formula">20 + 40 + 30 + 20 + 100 + 15 + 15 = 240</div></div>
<ol><li>Lecture (20 min) · 2. Relevés de procédés (40) · 3. Problématique et plan (30) · 4. Introduction (20) · 5. Développement (100) · 6. Conclusion (15) · 7. Relecture (15)</li></ol>
<ul><li>Au brouillon : problématique, plan, tableau des citations. Rédiger au propre : introduction, paragraphes PCEI, transitions, conclusion.</li>
<li>Chaque paragraphe : idée directrice + PCEI + bilan. Aucune paraphrase.</li></ul>`,
[
LESSON("8.1", "Méthode de travail au brouillon (timing : 4 h)", "À la fin, tu sauras organiser ton temps et ton brouillon pour un commentaire de 4 heures.", [
  D("Brouillon", "<p>Le <b>brouillon</b> contient tout ce qui prépare la rédaction : relevés de procédés, problématique, plan, tableau des citations. On y écrit des notes, pas des phrases complètes (sauf l'introduction et la conclusion que l'on rédige d'abord au brouillon si le temps le permet).</p>"),
  F("Planning d'un commentaire en 4 h", "Temps total = 20 + 40 + 30 + 20 + 100 + 15 + 15 = 240 min", "<ol><li><b>Lecture</b> : 20 min</li><li><b>Relevés</b> (procédés, champs lexicaux, temps…) : 40 min</li><li><b>Problématique et plan</b> : 30 min</li><li><b>Introduction</b> : 20 min</li><li><b>Développement</b> : 100 min</li><li><b>Conclusion</b> : 15 min</li><li><b>Relecture</b> : 15 min</li></ol>"),
  T("Méthode", "Algorithme de travail", "<ol><li>Lire deux fois (Axiome 0 : Qui, Quoi, Quand, Où, Comment).</li><li>Relever les procédés avec leur effet (PCEI au brouillon).</li><li>Formuler la problématique (4.3) puis le plan (4.4).</li><li>Placer les citations dans le plan.</li><li>Rédiger : introduction → paragraphes → transitions → conclusion.</li><li>Relire : orthographe, citations exactes, absence de paraphrase.</li></ol>"),
  X("DORMEUR", ["<b>Lecture</b> : sonnet de 1870, soldat endormi dans la nature (Axiome 0).", "<b>Relevés</b> : champ lexical de la nature, contraste de couleurs, euphémisme final.", "<b>Problématique</b> : Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ?", "<b>Plan</b> : I. Un paysage idyllique — II. La mort révélée avec violence.", "<b>Citations placées</b> : « trou de verdure », « lumière pleut » (I) ; « Pâle », « il a froid », « deux trous rouges » (II)."]),
  A("Ne commence pas à rédiger sans plan, et ne passe pas plus de 30 minutes sur l'introduction. Garde toujours 15 minutes pour relire.")
], [
  count("Combien de minutes pour le développement dans le planning de 4 h ?", 100, "Développement = 100 min", "Le développement est la plus longue étape du planning.", "Planning 4 h"),
  count("Combien de minutes au total dans le planning (20 + 40 + 30 + 20 + 100 + 15 + 15) ?", 240, "20 + 40 + 30 + 20 + 100 + 15 + 15 = 240", "240 min = 4 heures.", "Planning 4 h"),
  order("Remets les étapes du travail dans l'ordre.", ["Lire le texte deux fois", "Relever les procédés", "Formuler problématique et plan", "Rédiger l'introduction", "Rédiger le développement", "Rédiger la conclusion", "Relire"], "Algorithme de travail.", "Algorithme de travail"),
  qcm("Que faut-il faire avant de rédiger ?", ["Construire le plan et placer les citations", "Écrire la conclusion", "Recopier le texte", "Résumer le poème"], 0, "Le plan se prépare au brouillon.", "Algorithme de travail"),
  fill("On garde {0} minutes pour la {1}.", [[["15", "5", "60"], 0], [["relecture", "lecture", "citation"], 0]], "Le planning réserve 15 min à la relecture.", "Planning 4 h"),
  multi("Que contient le brouillon ?", ["Les relevés de procédés", "La problématique", "Le plan", "Le texte final recopié"], [0, 1, 2], "On ne recopie pas le texte final au brouillon.", "Algorithme de travail")
]),

LESSON("8.2", "Exemple résolu complet", "À la fin, tu sauras reconnaître chaque élément d'un commentaire complet.", [
  D("Commentaire complet", "<p>Un <b>commentaire complet</b> enchaîne : introduction (5 étapes), axes appuyés sur des analyses PCEI, transitions, conclusion (3 étapes).</p>"),
  T("Méthode", "Lire un modèle", "<p>Pour chaque paragraphe du modèle, retrouve : idée directrice, procédé, citation, effet, interprétation, bilan.</p>"),
  X("DORMEUR", [
    "<b>Introduction.</b> En 1870, alors que la guerre éclate, le jeune Rimbaud écrit ses premiers grands poèmes. « Le Dormeur du val » est un sonnet du Cahier de Douai. Le poème décrit un soldat qui semble dormir dans la nature mais qui est mort. Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ? Nous verrons d'abord un paysage idyllique, puis la mort révélée avec violence.",
    "<b>I. Un paysage idyllique</b> (idée directrice). Le poème s'ouvre sur un « trou de verdure » (P : métaphore ; C), qui fait de la nature un abri (E). Cette image, soutenue par le champ lexical de la lumière (« rayons », « lumière pleut »), suggère un monde protecteur : le lecteur est mis en confiance (I).",
    "<b>Transition.</b> Mais cette douceur n'est qu'apparente : plusieurs indices annoncent la mort du soldat.",
    "<b>II. La mort révélée avec violence</b> (idée directrice). L'adjectif « Pâle » (P : champ lexical de la mort) et l'impératif « Nature, berce-le chaudement : il a froid » (P : apostrophe) préparent la chute. Enfin, l'euphémisme « deux trous rouges au côté droit » (P) rompt avec le vert du décor (E) : la violence de la guerre éclate d'un coup (I).",
    "<b>Conclusion.</b> Nous avons vu un paysage idyllique puis la révélation d'une mort. Ainsi, par un jeu de contrastes, Rimbaud dénonce la guerre. On peut rapprocher ce poème de Candide, où Voltaire dénonce la guerre par l'ironie."], "Voici un commentaire modèle, révélé étape par étape :"),
  A("Un modèle se lit avec un crayon : repère la structure plutôt que de la recopier. Et vérifie qu'aucune phrase n'est une paraphrase : chacune contient un procédé nommé.")
], [
  qcm("Dans le modèle, la phrase « Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ? » est…", ["la problématique", "l'amorce", "l'annonce du plan", "la transition"], 0, "C'est l'étape 4 de l'introduction.", "Algorithme 4.5"),
  qcm("« Mais cette douceur n'est qu'apparente… » est…", ["une transition", "une conclusion", "une amorce", "une problématique"], 0, "Elle clôt l'axe I et annonce l'axe II.", "Leçon 7.3"),
  pcei("Dans l'axe II du modèle, complète l'analyse de la chute.", "Tranquille. Il a deux trous rouges au côté droit.",
    [["Un euphémisme et un contraste de couleurs", "Une allitération", "Une comparaison", "Une anaphore"], 0],
    [["« deux trous rouges au côté droit »", "« trou de verdure »", "« lumière pleut »", "« Nature, berce-le »"], 0],
    [["La violence éclate d'un coup", "Une impression de gaieté", "Un rythme rapide", "Une description neutre"], 0],
    [["Rimbaud dénonce la guerre", "Le soldat est heureux", "Le poème est court", "La rivière chante"], 0],
    "Procédé, citation, effet, interprétation.", "Axiome 1"),
  match("Associe chaque partie du modèle à sa fonction.", [["Introduction", "Présenter le texte et poser la question"], ["Axe I", "Un paysage idyllique"], ["Axe II", "La mort révélée avec violence"], ["Conclusion", "Répondre et ouvrir"]], "Structure du commentaire complet.", "Leçon 8.2"),
  order("Remets les parties du commentaire dans l'ordre.", ["Introduction", "Axe I", "Transition", "Axe II", "Conclusion"], "Structure du modèle.", "Leçon 8.2"),
  multi("Quels éléments trouve-t-on dans l'axe I du modèle ?", ["Une métaphore (« trou de verdure »)", "Un champ lexical de la lumière", "L'euphémisme final", "Une idée directrice"], [0, 1, 3], "L'euphémisme final appartient à l'axe II.", "Leçon 8.2")
]),

LESSON("8.3", "Commentaire guidé à rédiger", "À la fin, tu auras rédigé, étape par étape, un commentaire sur « Demain, dès l'aube… ».", [
  D("Commentaire guidé", "<p>Tu vas rédiger un commentaire de <b>« Demain, dès l'aube… »</b> (Hugo) en six petites étapes. Chaque étape se vérifie avec une liste et un corrigé : relis le poème avant de commencer.</p>"),
  T("Méthode", "Les six étapes", "<ol><li>Relevés (PCEI).</li><li>Problématique.</li><li>Plan.</li><li>Introduction.</li><li>Un paragraphe.</li><li>Conclusion.</li></ol>"),
  X("DEMAIN", ["<b>Relevés</b> : futur de l'indicatif (détermination), anaphore « j'irai par… », champ lexical du deuil (triste, nuit, tombe), chute sur la tombe.", "<b>Problématique</b> possible : Comment Hugo, par le rythme de la marche, exprime-t-il la douleur du deuil ?", "<b>Plan</b> : I. Une détermination affichée — II. Une marche aveuglée par la douleur — III. L'arrivée sur la tombe."]),
  A("Rédige avec tes mots : ne recopie pas le corrigé. Il sert à vérifier ta méthode, pas à être appris par cœur.")
], [
  write("Étape 1 — Relevés : donne 3 analyses PCEI rapides sur « Demain, dès l'aube… ».", [["Un procédé nommé (anaphore, futur, champ lexical…)", "anaphore|futur|champ lexical|antith|métaphore|hyperbole|rythme"], ["Une citation entre guillemets", "«[^»]+»|\"[^\"]+\""], ["Un effet", "effet|rythme|crée|souligne|montre"], ["Une interprétation", "deuil|douleur|détermination|révèle|suggère|exprime"]], "P : l'anaphore « j'irai par la forêt, j'irai par la montagne » ; E : elle crée un rythme de marche obstinée ; I : le poète est prêt à tout pour rejoindre sa fille. P : le champ lexical du deuil (« triste », « nuit », « tombe ») ; I : la douleur envahit le paysage.", "Axiome 1"),
  write("Étape 2 — Écris la problématique.", [["Elle commence par « Comment » ou « En quoi »", "^\\s*(comment|en quoi)"], ["Elle se termine par un point d'interrogation", "\\?\\s*$"], ["Elle cite Hugo ou le poème", "hugo|demain"], ["Elle nomme un procédé ou une visée", "rythme|marche|futur|anaphore|deuil|douleur"]], "Comment Hugo, par le rythme de la marche, exprime-t-il la douleur du deuil ?", "Théorème 4.3"),
  write("Étape 3 — Écris un plan en 2 ou 3 axes (des idées, pas des procédés).", [["2 ou 3 axes numérotés (I, II…)", "(I|1)[.)][\\s\\S]*(II|2)[.)]"], ["Chaque axe est une idée", ""], ["Aucun axe n'est un procédé (« figures », « champ lexical »…)", ""]], "I. Une détermination affichée — II. Une marche aveuglée par la douleur — III. L'arrivée sur la tombe.", "Théorème 4.4"),
  write("Étape 4 — Rédige l'introduction (5 étapes).", [["Amorce", "léopoldine|1843|hugo|deuil|siècle"], ["Présentation du texte", "contemplations|1856|poème|«"], ["Situation", "marche|tombe|fille"], ["Problématique (question)", "\\?"], ["Annonce du plan", "d'abord|puis|enfin"]], "En 1843, Hugo perd sa fille Léopoldine. « Demain, dès l'aube… » est un poème des Contemplations (1856). Le poète annonce qu'il marchera jusqu'à la tombe de sa fille. Comment Hugo, par le rythme de la marche, exprime-t-il la douleur du deuil ? Nous verrons d'abord une détermination affichée, puis une marche aveuglée par la douleur, enfin l'arrivée sur la tombe.", "Algorithme 4.5"),
  write("Étape 5 — Rédige le paragraphe de l'axe I (idée directrice + PCEI + bilan).", [["Idée directrice", "détermination|décid|résolu"], ["Procédé nommé", "anaphore|futur|répétition"], ["Citation", "«[^»]+»"], ["Effet", "effet|rythme|crée|souligne"], ["Interprétation", "montre|révèle|suggère|exprime|prêt"]], "Dès l'ouverture, Hugo affiche une détermination absolue. Le futur « Je partirai » et l'anaphore « j'irai par la forêt, j'irai par la montagne » créent un rythme de marche obstinée. Ils montrent que le poète est prêt à tout pour rejoindre sa fille : la marche est déjà une preuve d'amour.", "Leçon 5.2"),
  write("Étape 6 — Rédige la conclusion (bilan, réponse nette, ouverture).", [["Bilan", "avons vu|avons montré|d'abord|puis"], ["Réponse nette", "ainsi|donc|en définitive|exprime"], ["Ouverture", "rapprocher|comme|de même|écho|rimbaud|baudelaire|verlaine|autre"]], "Nous avons vu une détermination affichée, puis une marche aveuglée par la douleur. Ainsi, par le rythme de la marche, Hugo exprime la douleur du deuil. On peut rapprocher ce poème de « Chanson d'automne » de Verlaine, où la musique traduit aussi la mélancolie.", "Algorithme 4.6")
]),
],
[
  count("Combien de minutes pour la relecture dans le planning de 4 h ?", 15, "Relecture = 15 min", "La relecture dure 15 min.", "Planning 4 h"),
  qcm("La première étape du travail est…", ["la lecture", "la conclusion", "la citation", "la relecture"], 0, "Lire deux fois.", "Algorithme de travail"),
  qcm("Le plan se construit…", ["au brouillon, avant de rédiger", "après la conclusion", "pendant la lecture seulement", "jamais"], 0, "Le plan est préparé avant la rédaction.", "Algorithme de travail"),
  order("Ordonne le commentaire complet.", ["Introduction", "Axe I", "Transition", "Axe II", "Conclusion"], "Structure du commentaire.", "Leçon 8.2"),
  pcei("Complète l'analyse.", "J'irai par la forêt, j'irai par la montagne.",
    [["Une anaphore", "Une litote", "Un oxymore", "Une personnification"], 0],
    [["« j'irai par la forêt, j'irai par la montagne »", "« Demain, dès l'aube »", "« ta tombe »", "« les voiles au loin »"], 0],
    [["Un rythme de marche obstinée", "Un effet comique", "Une description précise", "Un silence"], 0],
    [["Le poète est prêt à tout pour rejoindre sa fille", "Le poète aime la forêt", "Le poème est court", "La montagne est haute"], 0],
    "Procédé, citation, effet, interprétation.", "Axiome 1"),
  qcm("Une phrase de commentaire sans procédé nommé est…", ["une paraphrase", "une conclusion", "une transition", "une amorce"], 0, "Théorème de non-paraphrase.", "Théorème de non-paraphrase"),
  qcm("Chaque paragraphe contient…", ["idée directrice + PCEI + bilan", "seulement des citations", "un résumé", "une question"], 0, "Structure du paragraphe.", "Leçon 5.2"),
  qcm("La conclusion contient…", ["un bilan, une réponse nette, une ouverture", "un nouvel argument", "la copie de l'introduction", "un résumé détaillé"], 0, "Algorithme 4.6.", "Algorithme 4.6"),
  fill("L'introduction se termine par l'{0} du {1}.", [[["annonce", "amorce", "analyse"], 0], [["plan", "texte", "titre"], 0]], "Étape 5.", "Algorithme 4.5"),
  multi("Que vérifie-t-on à la relecture ?", ["L'orthographe", "L'exactitude des citations", "L'absence de paraphrase", "Un nouveau plan"], [0, 1, 2], "On ne refait pas le plan à la relecture.", "Algorithme de travail")
]);


// ---------- MODULE 9 — La dissertation ----------
mod(9, "La dissertation", "these-ou-antithese",
`<h3>Fiche-mémo — La dissertation</h3>
<div class="box for"><div class="bt">Algorithme 4.9</div><div class="formula">Sujet → mots-clés → définitions → présupposés → reformulation</div></div>
<div class="box for"><div class="bt">AEI</div><div class="formula">Paragraphe argumentatif = Argument + Exemple + Interprétation</div></div>
<ul><li><b>Plan dialectique</b> : I. Thèse (oui, parce que…) → II. Antithèse (mais…) → III. Dépassement (une idée <i>nouvelle</i>, jamais « un peu des deux »).</li>
<li><b>Autres plans</b> : thématique (par thèmes), analytique (causes, formes, conséquences).</li>
<li>Tout exemple vient d'une œuvre précise (titre + auteur + passage), jamais d'un exemple inventé.</li>
<li>Introduction de dissertation : amorce, analyse du sujet, problématique, annonce du plan. Conclusion : bilan, réponse, ouverture.</li></ul>`,
[
LESSON("9.1", "Analyser un sujet (mots-clés, présupposés, reformulation)", "À la fin, tu sauras décomposer un sujet de dissertation avant de construire ton plan.", [
  D("Sujet de dissertation", "<p>Un <b>sujet</b> pose une question sur la littérature. L'<b>analyse du sujet</b> consiste à repérer les mots-clés, à les définir, à trouver ce qui est sous-entendu (les <b>présupposés</b>) et à reformuler le sujet avec tes mots.</p>"),
  F("Algorithme 4.9 — Analyse du sujet", "Sujet → mots-clés → définitions → présupposés → reformulation", "<ol><li>Souligner les mots-clés.</li><li>Définir chacun.</li><li>Chercher le <b>présupposé</b> : ce que le sujet tient pour acquis.</li><li>Reformuler en d'autres termes.</li></ol>"),
  X(null, ["<b>Sujet</b> : « La littérature doit-elle avant tout divertir ? »", "<b>Mots-clés</b> : littérature · devoir · avant tout · divertir.", "<b>Définitions</b> : divertir = distraire, procurer du plaisir ; « avant tout » = en priorité, avant toute autre fonction.", "<b>Présupposé</b> : la littérature aurait une fonction principale, et il faudrait la choisir parmi d'autres (instruire, émouvoir, dénoncer…).", "<b>Reformulation</b> : le plaisir de lire doit-il passer avant la réflexion ou l'engagement ?"], "Exemple résolu — sujet de dissertation :"),
  A("Ne pars pas du sujet « tel quel » : un mot oublié (« avant tout », « doit ») change tout le sens. Et ne récite pas un cours : réponds à <i>la</i> question posée.")
], [
  qcm("Dans « La littérature doit-elle avant tout divertir ? », « avant tout » signifie…", ["en priorité, avant toute autre fonction", "à la fin", "jamais", "souvent"], 0, "Ce mot-clé impose de hiérarchiser les fonctions.", "Algorithme 4.9"),
  order("Remets l'analyse du sujet dans l'ordre.", ["Repérer les mots-clés", "Définir chaque mot-clé", "Chercher les présupposés", "Reformuler le sujet"], "Algorithme 4.9.", "Algorithme 4.9"),
  match("Associe chaque terme à son rôle.", [["Mot-clé", "Un mot à définir absolument"], ["Présupposé", "Ce que le sujet tient pour acquis"], ["Reformulation", "Le sujet dit avec tes mots"]], "Trois outils d'analyse.", "Algorithme 4.9"),
  qcm("Le présupposé de « Pensez-vous que la poésie soit utile ? » est que…", ["l'utilité est le critère pour juger la poésie", "la poésie est en vers", "la poésie est ancienne", "le sujet est facile"], 0, "Le sujet suppose qu'on juge la poésie à son utilité.", "Algorithme 4.9"),
  fill("L'analyse du sujet consiste à repérer les {0}, les {1} et à reformuler.", [[["mots-clés", "rimes", "figures"], 0], [["présupposés", "dates", "titres"], 0]], "Algorithme 4.9.", "Algorithme 4.9"),
  write("Reformule le sujet : « Le théâtre doit-il d'abord faire rire ? »", [["Elle garde le sens du sujet (théâtre, rire)", "théâtre|comédie|spectateur|rire"], ["Elle explicite « d'abord » (priorité)", "priorité|avant|première|d'abord|principal"], ["Elle prend la forme d'une question", "\\?"]], "La fonction première du théâtre est-elle de divertir le public par le rire, avant de l'émouvoir ou de le faire réfléchir ?", "Algorithme 4.9")
]),

LESSON("9.2", "Problématique et types de plans (dialectique, thématique, analytique)", "À la fin, tu sauras choisir un plan et construire un plan dialectique valide.", [
  D("Les types de plans", "<p>Le <b>plan dialectique</b> examine une thèse, puis son contraire, puis les dépasse. Le <b>plan thématique</b> traite le sujet par thèmes successifs. Le <b>plan analytique</b> procède par causes, formes, conséquences ou par étapes d'un problème.</p>"),
  F("Théorème du plan dialectique", "I. Thèse (oui, parce que…) → II. Antithèse (mais…) → III. Dépassement", "<p><b>Condition :</b> la partie III est une idée <b>nouvelle</b> qui concilie en dépassant ; ce n'est jamais « un peu des deux ». Ce plan convient aux sujets du type « Pensez-vous que… ? ».</p>"),
  X(null, ["<b>Sujet</b> : Pensez-vous que la littérature doive avant tout divertir ?", "<b>I. Thèse</b> : oui, le plaisir est la porte d'entrée vers la culture (Molière fait rire pour corriger).", "<b>II. Antithèse</b> : mais la littérature peut aussi dénoncer et faire réfléchir (Voltaire, Candide).", "<b>III. Dépassement</b> : la littérature divertit <i>en faisant réfléchir</i> : le plaisir rend la réflexion plus efficace."], "Exemple résolu — plan dialectique :"),
  A("Le III n'est pas « un peu des deux » ni une simple somme de I et II : c'est une idée nouvelle. Et la problématique ne reprend pas le sujet mot pour mot.")
], [
  qcm("Quel type de plan convient à « Pensez-vous que… ? » ?", ["dialectique", "chronologique", "linéaire", "aucun"], 0, "Il confronte thèse et antithèse.", "Théorème dialectique"),
  order("Remets le plan dialectique dans l'ordre.", ["Thèse", "Antithèse", "Dépassement"], "I → II → III.", "Théorème dialectique"),
  match("Associe chaque plan à sa description.", [["Dialectique", "Thèse, antithèse, dépassement"], ["Thématique", "Par thèmes successifs"], ["Analytique", "Causes, formes, conséquences"]], "Trois types de plans.", "Leçon 9.2"),
  qcm("Quelle partie III est valide pour « La littérature doit-elle divertir ? »", ["La littérature divertit en faisant réfléchir : le plaisir sert la réflexion", "La littérature divertit un peu et fait réfléchir un peu", "La littérature n'est pas importante", "Retour à la thèse"], 0, "Le dépassement est une idée nouvelle.", "Théorème dialectique"),
  multi("Quelles parties III sont invalides ?", ["« Un peu des deux »", "« Une idée nouvelle qui dépasse l'opposition »", "« Retour à la thèse »", "« La conclusion du sujet »"], [0, 2], "Le III n'est ni un compromis ni un retour.", "Théorème dialectique"),
  write("Écris la problématique de « Le théâtre doit-il d'abord faire rire ? »", [["Elle est une question", "\\?"], ["Elle ne reprend pas le sujet mot pour mot", ""], ["Elle porte sur le rôle du théâtre", "théâtre|spectateur|public|comédie|tragédie|rire|émotion"]], "En quoi le théâtre peut-il faire rire tout en touchant et en faisant réfléchir le spectateur ?", "Leçon 9.2")
]),

LESSON("9.3", "Le paragraphe argumentatif (AEI : argument, exemple, interprétation)", "À la fin, tu sauras rédiger un paragraphe argumentatif avec la formule AEI.", [
  D("Paragraphe argumentatif", "<p>Un <b>paragraphe argumentatif</b> défend une idée avec trois éléments : un <b>argument</b> (une raison), un <b>exemple</b> (précis, tiré d'une œuvre) et une <b>interprétation</b> (ce que l'exemple prouve).</p>"),
  F("Formule AEI", "Paragraphe argumentatif = Argument + Exemple + Interprétation", "<p><b>Propriété :</b> tout exemple vient d'une œuvre précise (titre + auteur + passage), jamais d'un exemple inventé. Un argument sans exemple est une <b>démonstration incomplète</b>.</p>"),
  X("CANDIDE", ["<b>Argument</b> : la littérature peut dénoncer la guerre sans la décrire sérieusement : elle fait réfléchir par l'ironie.", "<b>Exemple</b> : dans <i>Candide</i> (chapitre 3), Voltaire écrit « Rien n'était si beau, si leste, si brillant, si bien ordonné que les deux armées ».", "<b>Interprétation</b> : l'éloge ironique fait entendre l'horreur : le lecteur comprend le contraire de ce qui est dit.", "<b>Lien avec le sujet</b> : la littérature n'est donc pas seulement un divertissement : elle est aussi une arme critique."]),
  A("Un exemple vague (« dans un roman… ») ou inventé ne compte pas : cite un titre, un auteur, un passage. Et n'oublie jamais l'interprétation : l'exemple ne parle pas tout seul.")
], [
  order("Remets les éléments du paragraphe argumentatif dans l'ordre.", ["Argument", "Exemple", "Interprétation"], "AEI.", "Formule AEI"),
  qcm("Un argument sans exemple est…", ["une démonstration incomplète", "un paragraphe parfait", "une conclusion", "une transition"], 0, "Il manque la preuve.", "Formule AEI"),
  qcm("Quel exemple est valable ?", ["« Dans Candide (Voltaire), chapitre 3, la bataille est décrite comme un spectacle brillant. »", "« Dans un roman que j'ai lu… »", "« On voit souvent que… »", "« Imaginons un livre où… »"], 0, "Titre + auteur + passage.", "Formule AEI"),
  match("Associe chaque élément à son rôle.", [["Argument", "Une raison qui soutient l'idée"], ["Exemple", "Un fait précis tiré d'une œuvre"], ["Interprétation", "Ce que l'exemple prouve"]], "Trois éléments.", "Formule AEI"),
  fill("AEI = {0} + {1} + Interprétation.", [[["Argument", "Analyse", "Auteur"], 0], [["Exemple", "Extrait", "Écriture"], 0]], "Formule AEI.", "Formule AEI"),
  write("Rédige un paragraphe AEI : « La littérature peut aussi émouvoir » (exemple : Le Dormeur du val, Rimbaud).", [["Un argument", "littérature|peut|émouv"], ["Un exemple précis (titre et auteur)", "dormeur|rimbaud"], ["Une citation entre guillemets", "«[^»]+»"], ["Une interprétation", "montre|révèle|prouve|suggère|donc|ainsi"]], "La littérature peut aussi émouvoir. Dans « Le Dormeur du val », Rimbaud écrit « Nature, berce-le chaudement : il a froid ». Cette supplication fait du soldat un enfant fragile et suscite la pitié : elle montre que la littérature émeut pour dénoncer la guerre.", "Formule AEI")
]),

LESSON("9.4", "Introduction et conclusion de dissertation", "À la fin, tu sauras écrire l'introduction et la conclusion d'une dissertation.", [
  D("Introduction et conclusion de dissertation", "<p>L'introduction de dissertation <b>n'a pas de présentation de texte</b> : elle part du sujet. La conclusion répond à la question posée.</p>"),
  T("Méthode", "Introduction en 4 étapes, conclusion en 3", "<ol><li><b>Amorce</b> (une idée ou un fait qui amène le sujet).</li><li><b>Analyse du sujet</b> (citer le sujet, définir, présupposé).</li><li><b>Problématique</b> (une question).</li><li><b>Annonce du plan</b>.</li></ol><p>Conclusion : <b>bilan</b> (les trois parties), <b>réponse</b> à la problématique, <b>ouverture</b>.</p>"),
  X(null, ["<b>Amorce</b> : De Molière à Hugo, les auteurs se sont demandé à quoi servait la littérature.", "<b>Analyse du sujet</b> : le sujet demande si divertir doit passer avant instruire ou dénoncer (présupposé : une fonction principale).", "<b>Problématique</b> : le plaisir de lire peut-il aller de pair avec l'engagement ?", "<b>Plan</b> : nous verrons d'abord que la littérature divertit, puis qu'elle dénonce, enfin qu'elle divertit en faisant réfléchir."], "Exemple résolu — sujet « La littérature doit-elle avant tout divertir ? » :"),
  A("Ne copie pas la structure de l'introduction du commentaire : pas de « présentation du texte » en dissertation. Et la conclusion ne contient pas d'argument nouveau.")
], [
  order("Remets l'introduction de dissertation dans l'ordre.", ["Amorce", "Analyse du sujet", "Problématique", "Annonce du plan"], "4 étapes, sans présentation de texte.", "Leçon 9.4"),
  qcm("Quelle étape de l'introduction du commentaire n'existe PAS en dissertation ?", ["La présentation du texte", "L'amorce", "La problématique", "L'annonce du plan"], 0, "Il n'y a pas de texte à présenter.", "Leçon 9.4"),
  match("Associe chaque étape à son contenu.", [["Amorce", "Amener le sujet"], ["Analyse du sujet", "Définir, présupposé"], ["Problématique", "Une question"], ["Annonce du plan", "Nous verrons d'abord…"]], "Quatre étapes.", "Leçon 9.4"),
  multi("Que contient la conclusion de dissertation ?", ["Un bilan", "Une réponse à la problématique", "Un nouvel argument", "Une ouverture"], [0, 1, 3], "Pas d'argument nouveau.", "Leçon 9.4"),
  qcm("La problématique d'une dissertation est…", ["une question qui reformule l'enjeu du sujet", "le sujet recopié", "une citation", "un résumé"], 0, "Elle prolonge l'analyse du sujet.", "Leçon 9.4"),
  write("Rédige une introduction pour « La poésie peut-elle changer le monde ? »", [["Une amorce", "poète|hugo|rimbaud|baudelaire|littérature|poésie"], ["Une analyse du sujet (définition, présupposé)", "changer|transformer|monde|sujet"], ["Une problématique (question)", "\\?"], ["Une annonce du plan", "d'abord|puis|enfin"]], "De Hugo à Rimbaud, des poètes ont voulu agir sur leur époque. Le sujet suppose que la poésie pourrait transformer le monde réel. La poésie a-t-elle un pouvoir d'action ou seulement un pouvoir sur les consciences ? Nous verrons d'abord qu'elle mobilise, puis qu'elle reste impuissante, enfin qu'elle change notre regard.", "Leçon 9.4")
]),
],
[
  qcm("L'analyse du sujet commence par…", ["repérer les mots-clés", "écrire la conclusion", "choisir les exemples", "rédiger l'introduction"], 0, "Algorithme 4.9.", "Algorithme 4.9"),
  qcm("Un présupposé est…", ["ce que le sujet tient pour acquis", "une citation", "un exemple", "un plan"], 0, "Ce qui est sous-entendu.", "Algorithme 4.9"),
  order("Ordonne le plan dialectique.", ["Thèse", "Antithèse", "Dépassement"], "I, II, III.", "Théorème dialectique"),
  qcm("Le III d'un plan dialectique est…", ["une idée nouvelle", "un peu des deux", "un retour à la thèse", "la conclusion"], 0, "Condition du dépassement.", "Théorème dialectique"),
  fill("AEI = {0} + {1} + {2}.", [[["Argument", "Auteur", "Analyse"], 0], [["Exemple", "Extrait", "Écriture"], 0], [["Interprétation", "Introduction", "Ironie"], 0]], "Formule AEI.", "Formule AEI"),
  qcm("Un exemple de dissertation doit venir…", ["d'une œuvre précise (titre, auteur, passage)", "de l'imagination", "d'une idée vague", "du sujet"], 0, "Propriété de l'exemple.", "Formule AEI"),
  qcm("Un argument sans exemple est…", ["une démonstration incomplète", "une bonne conclusion", "une transition", "une amorce"], 0, "Il manque la preuve.", "Formule AEI"),
  qcm("L'introduction de dissertation n'a pas…", ["de présentation de texte", "d'amorce", "de problématique", "d'annonce du plan"], 0, "Il n'y a pas de texte à présenter.", "Leçon 9.4"),
  multi("Quels plans existent ?", ["dialectique", "thématique", "analytique", "chronologique des vers"], [0, 1, 2], "Les trois premiers sont des plans de dissertation.", "Leçon 9.2"),
  match("Associe plan et description.", [["Dialectique", "Thèse, antithèse, dépassement"], ["Thématique", "Par thèmes"], ["Analytique", "Causes, formes, conséquences"]], "Trois types de plans.", "Leçon 9.2")
]);


// --- Données des mini-jeux (≥ 15 éléments chacun ; textes du domaine public ou écrits pour l'application) ---
const JEUX = {
  "sudoku": { titre: "Champ lexical Sudoku", data: {
    mort: ["tombe", "linceul", "cercueil", "funèbre", "cadavre", "trépas", "deuil", "squelette"],
    nature: ["forêt", "rivière", "prairie", "ruisseau", "feuillage", "montagne", "bruyère", "colline"],
    amour: ["baiser", "tendresse", "passion", "étreinte", "caresse", "bien-aimée", "adorer", "soupir"],
    guerre: ["bataille", "canon", "soldat", "mitraille", "fusil", "armée", "sabre", "assaut"] } },

  // v : ligne ; f : figure ; aussi : autres figures acceptables (la ligne n'est alors jamais un leurre pour elles) ; ref : leçon
  "chasse-aux-figures": { titre: "La Chasse aux figures", data: [
    { v: "Comme des avirons traîner à côté d'eux", f: "comparaison", ref: "2.1" },
    { v: "Le Poète est semblable au prince des nuées", f: "comparaison", ref: "2.1" },
    { v: "Comme une onde qui bout dans une urne trop pleine", f: "comparaison", ref: "2.1" },
    { v: "Ces rois de l'azur, maladroits et honteux", f: "métaphore", ref: "2.1" },
    { v: "Les égouts soufflaient par leurs bouches de granit leurs haleines empestées", f: "personnification", aussi: ["métaphore"], ref: "2.1" },
    { v: "La pâle mort mêlait les sombres bataillons", f: "personnification", ref: "2.1" },
    { v: "Lui, naguère si beau, qu'il est comique et laid !", f: "antithèse", ref: "2.2" },
    { v: "Cette obscure clarté qui tombe des étoiles", f: "oxymore", aussi: ["antithèse"], ref: "2.2" },
    { v: "Il faut manger pour vivre et non vivre pour manger", f: "chiasme", aussi: ["antithèse"], ref: "2.2" },
    { v: "On m'a coupé la gorge, on m'a dérobé mon argent !", f: "hyperbole", ref: "2.3" },
    { v: "Va, cours, vole, et nous venge", f: "gradation", aussi: ["accumulation"], ref: "2.3" },
    { v: "Les trompettes, les fifres, les hautbois, les tambours, les canons", f: "accumulation", ref: "2.3" },
    { v: "J'irai par la forêt, j'irai par la montagne", f: "anaphore", ref: "2.3" },
    { v: "Va, je ne te hais point", f: "litote", ref: "2.3" },
    { v: "Il a deux trous rouges au côté droit", f: "euphémisme", ref: "2.3" },
    { v: "Pour qui sont ces serpents qui sifflent sur vos têtes ?", f: "allitération", ref: "2.4" },
    { v: "Les sanglots longs des violons de l'automne", f: "assonance", ref: "2.4" }
  ] },

  // v : vers ; s : décomposition (une syllabe par « / ») ; n : nombre de syllabes
  "compteur-de-syllabes": { titre: "Le Compteur de syllabes", data: [
    { v: "Demain, dès l'aube, à l'heure où blanchit la campagne", s: "De/main/dès/l'au/b(e)à/l'heu/r(e)où/blan/chit/la/cam/pa(gne)", n: 12, ref: "3.2" },
    { v: "Je partirai. Vois-tu, je sais que tu m'attends.", s: "Je/par/ti/rai/Vois/tu/je/sais/que/tu/m'at/tends", n: 12, ref: "3.2" },
    { v: "J'irai par la forêt, j'irai par la montagne.", s: "J'i/rai/par/la/fo/rêt/j'i/rai/par/la/mon/ta(gne)", n: 12, ref: "3.2" },
    { v: "Je ne puis demeurer loin de toi plus longtemps.", s: "Je/ne/puis/de/meu/rer/loin/de/toi/plus/long/temps", n: 12, ref: "3.2" },
    { v: "Je ne regarderai ni l'or du soir qui tombe", s: "Je/ne/re/gar/de/rai/ni/l'or/du/soir/qui/tom(be)", n: 12, ref: "3.2" },
    { v: "Je le vis, je rougis, je pâlis à sa vue", s: "Je/le/vis/je/rou/gis/je/pâ/lis/à/sa/vu(e)", n: 12, ref: "3.2" },
    { v: "Un trouble s'éleva dans mon âme éperdue", s: "Un/trou/ble/s'é/le/va/dans/mon/â/m(e)é/per/du(e)", n: 12, ref: "3.2" },
    { v: "Mes yeux ne voyaient plus, je ne pouvais parler", s: "Mes/yeux/ne/voy/aient/plus/je/ne/pou/vais/par/ler", n: 12, ref: "3.2" },
    { v: "Souvent, pour s'amuser, les hommes d'équipage", s: "Sou/vent/pour/s'a/mu/ser/les/hom/mes/d'é/qui/pa(ge)", n: 12, ref: "3.2" },
    { v: "Ce voyageur ailé, comme il est gauche et veule !", s: "Ce/voy/a/geur/ai/lé/com/m(e)il/est/gau/ch(e)et/veu(le)", n: 12, ref: "3.2" },
    { v: "Le Poète est semblable au prince des nuées", s: "Le/Po/è/t(e)est/sem/bla/bl(e)au/prin/ce/des/nu/é(es)", n: 12, ref: "3.2" },
    { v: "La raison du plus fort est toujours la meilleure", s: "La/rai/son/du/plus/fort/est/tou/jours/la/meil/leu(re)", n: 12, ref: "3.2" },
    { v: "Waterloo ! Waterloo ! Waterloo ! morne plaine !", s: "Wa/ter/loo/Wa/ter/loo/Wa/ter/loo/mor/ne/plai(ne)", n: 12, ref: "3.2" },
    { v: "Dans le courant d'une onde pure", s: "Dans/le/cou/rant/d'u/n(e)on/de/pu(re)", n: 8, ref: "3.2" },
    { v: "Un Agneau se désaltérait", s: "Un/A/gneau/se/dé/sal/té/rait", n: 8, ref: "3.2" },
    { v: "Mignonne, allons voir si la rose", s: "Mi/gnon/n(e)al/lons/voir/si/la/ro(se)", n: 8, ref: "3.2" },
    { v: "Il pleure dans mon cœur", s: "Il/pleu/re/dans/mon/cœur", n: 6, ref: "3.2" },
    { v: "Des violons (diérèse : vi-o-lons)", s: "Des/vi/o/lons", n: 4, ref: "3.2" }
  ] },

  // t : extrait ; r : registre ; a : source
  "registre-roulette": { titre: "Registre Roulette", data: [
    { t: "Je ne puis demeurer loin de toi plus longtemps.", r: "lyrique", a: "Hugo", ref: "4.1" },
    { t: "Les sanglots longs / Des violons / De l'automne / Blessent mon cœur / D'une langueur / Monotone.", r: "lyrique", a: "Verlaine", ref: "4.1" },
    { t: "Souriant comme / Sourirait un enfant malade, il fait un somme : / Nature, berce-le chaudement : il a froid.", r: "pathétique", a: "Rimbaud", ref: "4.1" },
    { t: "Exilé sur le sol au milieu des huées, / Ses ailes de géant l'empêchent de marcher.", r: "pathétique", a: "Baudelaire", ref: "4.1" },
    { t: "Je reconnus Vénus et ses feux redoutables, / D'un sang qu'elle poursuit tourments inévitables.", r: "tragique", a: "Racine", ref: "4.1" },
    { t: "Ce n'est plus une ardeur dans mes veines cachée : / C'est Vénus tout entière à sa proie attachée.", r: "tragique", a: "Racine", ref: "4.1" },
    { t: "Au voleur ! au voleur ! à l'assassin ! au meurtrier ! Justice, juste ciel ! Je suis perdu, je suis assassiné !", r: "comique", a: "Molière", ref: "4.2" },
    { t: "Où courir ? Où ne pas courir ? N'est-il point là ? N'est-il point ici ?", r: "comique", a: "Molière", ref: "4.2" },
    { t: "La raison du plus fort est toujours la meilleure : / Nous l'allons montrer tout à l'heure.", r: "satirique", a: "La Fontaine", ref: "4.2" },
    { t: "La mousqueterie ôta du meilleur des mondes environ neuf à dix mille coquins qui en infectaient la surface.", r: "ironique", a: "Voltaire", ref: "4.2" },
    { t: "Rien n'était si beau, si leste, si brillant, si bien ordonné que les deux armées.", r: "ironique", a: "Voltaire", ref: "4.2" },
    { t: "Waterloo ! Waterloo ! Waterloo ! morne plaine ! / Comme une onde qui bout dans une urne trop pleine…", r: "épique", a: "Hugo", ref: "4.3" },
    { t: "Seul contre mille, le héros brandit son épée et la plaine trembla sous son cri.", r: "épique", a: "texte de l'application", ref: "4.3" },
    { t: "Le miroir ne renvoyait plus mon visage : à ma place, une silhouette indistincte me souriait.", r: "fantastique", a: "texte de l'application", ref: "4.3" },
    { t: "Chaque nuit, la porte de la cave s'ouvrait seule, et des pas montaient, qui n'étaient ceux de personne.", r: "fantastique", a: "texte de l'application", ref: "4.3" },
    { t: "Un homme suivait seul la grande route de Marchiennes à Montsou, dix kilomètres de pavé coupant tout droit, à travers les champs de betteraves.", r: "réaliste", a: "Zola", ref: "4.3" },
    { t: "Les égouts soufflaient par leurs bouches de granit leurs haleines empestées, et les cuisines souterraines jetaient à la rue les miasmes infâmes des eaux de vaisselle.", r: "réaliste", a: "Maupassant", ref: "4.3" }
  ] },

  "formule-express": { titre: "Formule Express", data: [
    { src: "Rimbaud, Le Dormeur du val", P: "Un euphémisme et un contraste de couleurs", C: "« Il a deux trous rouges au côté droit »", E: "La mort est révélée brutalement", I: "Rimbaud dénonce la guerre sous un décor paisible", piege: "Le soldat est mort et blessé au côté." },
    { src: "Baudelaire, L'Albatros", P: "Une comparaison", C: "« Comme des avirons traîner à côté d'eux »", E: "Elle montre des ailes lourdes et encombrantes", I: "Le poète est maladroit et incompris dans la société", piege: "Les albatros ont de grandes ailes blanches." },
    { src: "Molière, L'Avare", P: "Une hyperbole", C: "« On m'a coupé la gorge »", E: "L'exagération est comique", I: "Pour Harpagon, l'argent vaut plus que la vie", piege: "Harpagon dit qu'on lui a volé son argent." },
    { src: "Voltaire, Candide", P: "Une ironie (antiphrase)", C: "« Une harmonie telle qu'il n'y en eut jamais en enfer »", E: "Le lecteur comprend le contraire", I: "Voltaire dénonce l'horreur de la guerre", piege: "Les armées jouent de la musique." },
    { src: "Hugo, Demain, dès l'aube", P: "Une anaphore", C: "« J'irai par la forêt, j'irai par la montagne »", E: "Elle crée un rythme de marche obstinée", I: "Le poète est prêt à tout pour rejoindre la défunte", piege: "Le poète va marcher dans la forêt et la montagne." },
    { src: "Racine, Phèdre", P: "Une accumulation de verbes", C: "« Je le vis, je rougis, je pâlis »", E: "Un rythme saccadé qui traduit le trouble", I: "La passion s'impose à Phèdre malgré elle", piege: "Phèdre voit Hippolyte et change de couleur." },
    { src: "Maupassant, Bel-Ami", P: "Une comparaison", C: "« Comme des coups d'épervier »", E: "Un regard rapide et prédateur", I: "Duroy se met en scène pour séduire", piege: "Duroy regarde les dîneurs." },
    { src: "Maupassant, Bel-Ami", P: "Une personnification", C: "« La ville… semblait suer »", E: "Une chaleur étouffante, presque humaine", I: "Paris devient un corps malade : l'atmosphère est oppressante", piege: "Il fait chaud à Paris le soir." },
    { src: "Verlaine, Chanson d'automne", P: "Une assonance en [ɔ̃]", C: "« Les sanglots longs des violons »", E: "Une musique lente et plaintive", I: "La mélancolie de l'automne devient musique", piege: "Le poète parle de violons en automne." },
    { src: "La Fontaine, Le Loup et l'Agneau", P: "Une moralité ironique", C: "« La raison du plus fort est toujours la meilleure »", E: "Un principe affiché qui choque", I: "La Fontaine dénonce l'abus de pouvoir", piege: "Le Loup mange l'Agneau." },
    { src: "Zola, Germinal", P: "Un champ lexical du noir et du froid", C: "« sous la nuit sans étoiles, d'une obscurité et d'une épaisseur d'encre »", E: "Une atmosphère sombre et écrasante", I: "Le décor annonce l'univers hostile de la mine", piege: "Un homme marche la nuit." },
    { src: "Baudelaire, L'Albatros", P: "Une métaphore", C: "« Ces rois de l'azur »", E: "Elle donne à l'oiseau une noblesse", I: "L'albatros symbolise le poète, grand dans son art", piege: "Les albatros volent haut." },
    { src: "Hugo, Waterloo", P: "Une personnification", C: "« La pâle mort mêlait les sombres bataillons »", E: "La mort devient une force active", I: "La bataille prend une dimension épique", piege: "Des soldats sont morts à Waterloo." },
    { src: "Rimbaud, Le Dormeur du val", P: "Une apostrophe à la Nature", C: "« Nature, berce-le chaudement : il a froid »", E: "Elle émeut en faisant de la Nature une mère", I: "Rimbaud oppose la douceur de la nature à la violence des hommes", piege: "Le soldat a froid." },
    { src: "Baudelaire, L'Albatros", P: "Une antithèse", C: "« Lui, naguère si beau, qu'il est comique et laid ! »", E: "Elle souligne la chute de l'oiseau", I: "Le poète est grand en esprit et ridicule aux yeux du monde", piege: "L'oiseau était beau, il est laid." }
  ] },

  // pb : problématique ; cartes : [texte, case] avec case I (axe I), II (axe II) ou X (hors sujet)
  "plan-puzzle": { titre: "Plan Puzzle", data: [
    { pb: "Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre dans « Le Dormeur du val » ?", cartes: [
      ["Un paysage idyllique", "I"], ["Une nature vivante et lumineuse", "I"], ["Un décor de douceur et de paix", "I"],
      ["Des indices de mort discrets", "II"], ["Une chute qui révèle la violence", "II"], ["La dénonciation de la guerre", "II"],
      ["Les figures de style", "X"], ["Les vers 1 à 8", "X"], ["Le soldat est jeune et dort", "X"] ] },
    { pb: "Comment Baudelaire, par un jeu de contrastes et d'images, fait-il de l'albatros le symbole du poète incompris ?", cartes: [
      ["Un oiseau majestueux", "I"], ["Les rois de l'azur", "I"], ["Une liberté dans les airs", "I"],
      ["Une chute humiliante", "II"], ["Un être raillé par les hommes", "II"], ["Le poète exilé sur le sol", "II"],
      ["Les comparaisons", "X"], ["La rime ABAB", "X"], ["Le poème a quatre strophes", "X"] ] },
    { pb: "Comment Hugo, par le rythme de la marche, exprime-t-il la douleur du deuil dans « Demain, dès l'aube… » ?", cartes: [
      ["Une détermination affichée", "I"], ["Un voyage décidé avec force", "I"], ["Un amour plus fort que la distance", "I"],
      ["Une marche aveuglée par la douleur", "II"], ["Un monde extérieur effacé", "II"], ["Un but funèbre : la tombe", "II"],
      ["Le futur de l'indicatif", "X"], ["Strophes 1 et 2", "X"], ["Harfleur est un port", "X"] ] },
    { pb: "Comment Molière, par l'exagération, fait-il rire du désespoir d'Harpagon dans « L'Avare » ?", cartes: [
      ["Une panique démesurée", "I"], ["Un personnage hors de lui", "I"], ["Un monologue qui s'affole", "I"],
      ["Une obsession ridicule de l'argent", "II"], ["Une folie qui se dévoile", "II"], ["Un avare qui se parle à lui-même", "II"],
      ["Les phrases interrogatives", "X"], ["Les exclamations", "X"], ["Harpagon a perdu sa cassette", "X"] ] },
    { pb: "Comment Voltaire, par l'ironie, dénonce-t-il l'absurdité de la guerre dans « Candide » ?", cartes: [
      ["Un spectacle apparemment brillant", "I"], ["Une armée parfaitement ordonnée", "I"], ["Une musique de fête", "I"],
      ["Un massacre sous le masque de l'éloge", "II"], ["Des victimes réduites à des chiffres", "II"], ["Une critique de l'optimisme", "II"],
      ["Les antiphrases", "X"], ["Candide est un conte", "X"], ["Le chapitre 3", "X"] ] }
  ] },

  // f : fragments dans l'ordre des 5 étapes ; leurres : fragments faux
  "intro-builder": { titre: "Intro Builder", data: {
    etapes: ["Amorce", "Présentation du texte", "Résumé / situation", "Problématique", "Annonce du plan"],
    intros: [
      { titre: "Rimbaud, Le Dormeur du val", f: [
        "En 1870, alors que la guerre franco-prussienne éclate, le jeune Rimbaud, seize ans, écrit ses premiers grands poèmes.",
        "« Le Dormeur du val » est un sonnet du Cahier de Douai, composé en octobre 1870.",
        "Le poème décrit un soldat qui semble dormir dans la nature, mais qui est en réalité mort.",
        "Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ?",
        "Nous verrons d'abord un paysage idyllique, puis la révélation de la mort du soldat." ] },
      { titre: "Baudelaire, L'Albatros", f: [
        "Au milieu du XIXe siècle, Baudelaire renouvelle la poésie en faisant du poète un être en marge.",
        "« L'Albatros » est un poème du recueil Les Fleurs du mal, composé de quatre quatrains.",
        "Des marins capturent des albatros, rois du ciel devenus gauches sur le pont.",
        "Comment Baudelaire, par un jeu de contrastes, fait-il de l'albatros le symbole du poète incompris ?",
        "Nous verrons d'abord la majesté de l'oiseau, puis sa chute humiliante, enfin la révélation du poète." ] },
      { titre: "Hugo, Demain, dès l'aube…", f: [
        "En 1843, Hugo perd sa fille Léopoldine, qui se noie à Villequier ; il en fera le cœur de son œuvre de deuil.",
        "« Demain, dès l'aube… » est un poème des Contemplations, publié en 1856.",
        "Le poète annonce qu'il marchera jusqu'à la tombe de sa fille pour y déposer un bouquet.",
        "Comment Hugo, par le rythme de la marche, exprime-t-il la douleur du deuil ?",
        "Nous verrons d'abord une détermination affichée, puis une marche aveuglée par la douleur, enfin l'arrivée sur la tombe." ] },
      { titre: "Molière, L'Avare, IV, 7", f: [
        "Au XVIIe siècle, Molière puise dans la tradition de la farce pour peindre les défauts de ses contemporains.",
        "« L'Avare » est une comédie en cinq actes, en prose, représentée en 1668 ; la scène 7 de l'acte IV est le monologue d'Harpagon.",
        "Harpagon découvre que sa cassette a été volée et s'affole.",
        "Comment Molière, par l'exagération, fait-il rire du désespoir d'Harpagon ?",
        "Nous verrons d'abord une panique démesurée, puis la révélation d'une obsession ridicule." ] },
      { titre: "Voltaire, Candide, chapitre 3", f: [
        "Au siècle des Lumières, Voltaire utilise le conte philosophique pour combattre les injustices.",
        "« Candide » (1759) est un conte philosophique ; le chapitre 3 raconte la bataille à laquelle Candide assiste.",
        "Voltaire décrit une bataille comme un spectacle brillant, mais en rapporte le massacre.",
        "Comment Voltaire, par l'ironie, dénonce-t-il l'absurdité de la guerre ?",
        "Nous verrons d'abord un spectacle apparemment brillant, puis un massacre sous le masque de l'éloge." ] },
      { titre: "Maupassant, Bel-Ami (ouverture)", f: [
        "À la fin du XIXe siècle, Maupassant fait le portrait sans complaisance de la société parisienne.",
        "L'ouverture de « Bel-Ami » (1885) présente Georges Duroy à la sortie d'un restaurant.",
        "Un ancien sous-officier sans le sou se met en scène en quittant le restaurant.",
        "Comment Maupassant, par l'ironie du narrateur, fait-il de Duroy un personnage qui joue un rôle ?",
        "Nous verrons d'abord un personnage séduisant, puis un séducteur qui joue la comédie." ] }
    ],
    leurres: [
      "Je pense personnellement que ce poème est très beau et que je l'aime beaucoup.",
      "Dans cette conclusion, nous avons montré que le texte est riche.",
      "Le texte est une description.",
      "Voici le résumé complet du livre, chapitre par chapitre.",
      "Premièrement, il y a une comparaison au vers 3.",
      "Pourquoi l'auteur a-t-il écrit ce texte ?",
      "Pour conclure, l'auteur montre que sa pensée est actuelle.",
      "Ce texte parle de la vie et de la mort.",
      "Nous ne verrons rien de plus car le texte est simple.",
      "Ce genre est apparu il y a longtemps et on l'utilise encore aujourd'hui.",
      "Je vais maintenant analyser le texte en détail ligne par ligne.",
      "Le texte comporte quatorze lignes et quatre paragraphes."
    ] } },

  // q : question ; o : options ; a : bonne réponse ; ref : leçon
  "boss-bac-blanc": { titre: "Boss final : le Bac blanc", data: [
    { q: "« Comme des avirons traîner à côté d'eux » est…", o: ["une comparaison", "une métaphore", "une litote", "une anaphore"], a: 0, ref: "2.1" },
    { q: "« Cette obscure clarté » est…", o: ["un oxymore", "un chiasme", "un euphémisme", "une allitération"], a: 0, ref: "2.2" },
    { q: "« Au voleur ! au voleur ! à l'assassin ! » est un extrait de…", o: ["théâtre", "poésie", "récit", "argumentation"], a: 0, ref: "3.3" },
    { q: "« Waterloo ! Waterloo ! morne plaine ! » relève du registre…", o: ["épique", "comique", "réaliste", "fantastique"], a: 0, ref: "4.3" },
    { q: "Quelle est la meilleure problématique sur « Le Dormeur du val » ?", o: ["Rimbaud aime-t-il la nature ?", "La guerre chez Rimbaud", "Comment Rimbaud, par un jeu de contrastes, dénonce-t-il la guerre ?", "Le poème a quatre strophes"], a: 2, ref: "6.1" },
    { q: "Quel axe de plan est valide ?", o: ["Les figures de style", "Les vers 1 à 4", "Un paysage idyllique", "Le champ lexical"], a: 2, ref: "6.2" },
    { q: "Dans l'introduction, la 3e étape est…", o: ["le résumé / la situation", "l'amorce", "l'annonce du plan", "la problématique"], a: 0, ref: "7.1" },
    { q: "Combien de syllabes dans « Je ne puis demeurer loin de toi plus longtemps » ?", o: ["10", "11", "12", "13"], a: 2, ref: "3.2" },
    { q: "Si le terme Procédé vaut 0, l'analyse vaut…", o: ["0 (paraphrase)", "2 sur 4", "3 sur 4", "4 sur 4"], a: 0, ref: "5.3" },
    { q: "Le passé simple sert surtout à…", o: ["raconter des actions de premier plan", "décrire un décor", "exprimer un ordre", "exprimer un souhait"], a: 0, ref: "1.2" },
    { q: "Un narrateur qui sait tout a une focalisation…", o: ["omnisciente", "interne", "externe", "nulle"], a: 0, ref: "3.1" },
    { q: "Quelle étape de la conclusion est facultative mais récompensée ?", o: ["l'ouverture", "le bilan", "la réponse nette", "l'amorce"], a: 0, ref: "7.2" },
    { q: "L'ironie consiste à…", o: ["dire le contraire de ce que l'on pense", "exagérer", "répéter", "décrire"], a: 0, ref: "4.2" },
    { q: "Des rimes A B A B sont…", o: ["croisées", "suivies", "embrassées", "plates"], a: 0, ref: "3.2" },
    { q: "La double énonciation signifie qu'une réplique s'adresse…", o: ["à un personnage et au public", "à l'auteur seul", "à deux personnages", "au metteur en scène"], a: 0, ref: "3.3" },
    { q: "« Va, je ne te hais point » est…", o: ["une litote", "une hyperbole", "une gradation", "un chiasme"], a: 0, ref: "2.3" }
  ] },

  // sujets : s ; args : [texte, T|A|X] ; dep : dépassements (le 1er est le bon) ; ref
  "these-ou-antithese": { titre: "Thèse ou Antithèse ?", data: [
    { s: "Pensez-vous que la littérature doive avant tout divertir ?", args: [
      ["Les histoires captivantes donnent le goût de lire", "T"], ["Le plaisir est la porte d'entrée vers la culture", "T"], ["La comédie de Molière touche le public par le rire", "T"],
      ["Candide dénonce la guerre et fait réfléchir", "A"], ["Les œuvres qui dérangent ont un rôle critique", "A"], ["Hugo utilise la poésie pour dénoncer la misère", "A"],
      ["Maupassant est né en 1850", "X"], ["Un roman est imprimé sur du papier", "X"] ],
      dep: ["La littérature divertit en faisant réfléchir : le plaisir rend la réflexion plus efficace", "La littérature est un peu divertissante et un peu sérieuse", "La littérature doit être abandonnée"] },
    { s: "La poésie peut-elle changer le monde ?", args: [
      ["Les poèmes engagés mobilisent les consciences (Hugo, Les Châtiments)", "T"], ["Les mots peuvent transformer les mentalités", "T"], ["Rimbaud dénonce la guerre dans « Le Dormeur du val »", "T"],
      ["Aucune loi n'a jamais été changée par un poème", "A"], ["La poésie touche peu de lecteurs", "A"], ["Les puissants ignorent souvent les poètes", "A"],
      ["Le sonnet a quatorze vers", "X"], ["Baudelaire est né à Paris", "X"] ],
      dep: ["La poésie change le regard sur le monde, ce qui prépare le changement", "La poésie change un peu le monde et un peu pas", "Le monde n'a pas besoin de poésie"] },
    { s: "Le théâtre doit-il d'abord faire rire ?", args: [
      ["Le rire désarme le public et le rend réceptif (Molière)", "T"], ["La comédie corrige les mœurs en les moquant", "T"], ["Le comique attire le public au théâtre", "T"],
      ["La tragédie émeut et fait réfléchir (Phèdre)", "A"], ["Le théâtre peut aussi bouleverser et faire pleurer", "A"], ["Le public vient aussi chercher l'émotion", "A"],
      ["Molière est mort en 1673", "X"], ["Une pièce comporte plusieurs actes", "X"] ],
      dep: ["Le théâtre cherche à toucher le spectateur : le rire ou les larmes servent à le faire réfléchir", "Le théâtre fait rire parfois et pleurer parfois", "Le théâtre est inutile"] },
    { s: "Faut-il lire des romans pour mieux comprendre la société ?", args: [
      ["Le roman réaliste décrit les milieux sociaux (Zola, Germinal)", "T"], ["Bel-Ami montre les mécanismes de l'ambition à Paris", "T"], ["Le roman donne à voir des vies différentes de la nôtre", "T"],
      ["Le roman reste une fiction qui déforme le réel", "A"], ["Les sciences sociales décrivent mieux la société", "A"], ["Un roman ne donne que le point de vue de son auteur", "A"],
      ["Zola est né en 1840", "X"], ["Un roman a une couverture", "X"] ],
      dep: ["Le roman éclaire la société par la fiction : il révèle ce que les faits seuls ne montrent pas", "Le roman est un peu vrai et un peu faux", "On ne devrait plus lire de romans"] }
  ] }
};


// --- Métadonnées des mini-jeux (les données des jeux sont dans la section JEUX plus bas) ---
const JEUX_META = [
  { id: "sudoku", module: 1, icone: "🔢", titre: "Champ lexical Sudoku", desc: "Place les mots : chaque ligne et chaque colonne contient un mot de chaque champ lexical.", ref: "1.1" },
  { id: "chasse-aux-figures", module: 2, icone: "🎯", titre: "La Chasse aux figures", desc: "Clique les vers qui contiennent la figure demandée avant qu'ils ne disparaissent.", ref: "2.1" },
  { id: "compteur-de-syllabes", module: 3, icone: "🥁", titre: "Le Compteur de syllabes", desc: "Frappe une fois par syllabe, puis valide le total.", ref: "3.2" },
  { id: "registre-roulette", module: 4, icone: "🎡", titre: "Registre Roulette", desc: "La roue tombe sur un extrait : trouve son registre avant la fin du temps.", ref: "4.1" },
  { id: "formule-express", module: 5, icone: "⚡", titre: "Formule Express", desc: "Reconstitue P, C, E, I dans l'ordre. Attention aux pièges (paraphrase) !", ref: "5.1" },
  { id: "plan-puzzle", module: 6, icone: "🧩", titre: "Plan Puzzle", desc: "Trie les idées en Axe I, Axe II ou Hors sujet.", ref: "6.2" },
  { id: "intro-builder", module: 7, icone: "🏗️", titre: "Intro Builder", desc: "Assemble les 5 étapes d'une introduction ; écarte les intrus.", ref: "7.1" },
  { id: "boss-bac-blanc", module: 8, icone: "👹", titre: "Boss final : le Bac blanc", desc: "10 questions chronométrées pour vaincre le boss.", ref: "8.1" },
  { id: "these-ou-antithese", module: 9, icone: "⚖️", titre: "Thèse ou Antithèse ?", desc: "Classe les arguments, puis choisis le meilleur dépassement.", ref: "9.2" }
];

// --- Rangs et badges ---
const RANGS = [
  { nom: "Axiome", min: 1 }, { nom: "Lemme", min: 3 }, { nom: "Corollaire", min: 5 },
  { nom: "Théorème", min: 7 }, { nom: "Démonstration", min: 10 }, { nom: "CQFD", min: 13 }
];

const nbLecons = () => Object.values(S.lessons).filter(l => l.done).length;
const bestControle = (id) => (S.controles[id] ? S.controles[id].best : 0);
const BADGES = [
  { id: "premier-pas", icone: "👣", titre: "Premier pas", desc: "Terminer une première leçon.", condition: (s) => nbLecons() >= 1 },
  { id: "premier-commentaire", icone: "✍️", titre: "Premier commentaire", desc: "Terminer le commentaire guidé (leçon 8.3).", condition: (s) => !!(s.lessons["8.3"] && s.lessons["8.3"].done) },
  { id: "controle-reussi", icone: "✅", titre: "Contrôle réussi", desc: "Réussir un contrôle (≥ 70 %).", condition: (s) => Object.values(s.controles).some(c => c.best >= 0.7) },
  { id: "sans-faute", icone: "💯", titre: "Sans faute", desc: "Obtenir 100 % à un contrôle.", condition: (s) => Object.values(s.controles).some(c => c.best >= 1) },
  { id: "trois-etoiles", icone: "🌟", titre: "Trois étoiles", desc: "Obtenir ★★★ à une leçon.", condition: (s) => Object.values(s.lessons).some(l => l.best >= 0.9) },
  { id: "chasseur-metaphores", icone: "🏹", titre: "Chasseur de métaphores", desc: "Trouver 50 figures dans La Chasse aux figures.", condition: (s) => s.stats.figures >= 50 },
  { id: "zero-paraphrase", icone: "🚫", titre: "Zéro paraphrase", desc: "10 analyses PCEI parfaites d'affilée.", condition: (s) => s.stats.pceiBest >= 10 },
  { id: "alexandrin-parfait", icone: "📏", titre: "Alexandrin parfait", desc: "Réussir toutes les questions du Compteur de syllabes.", condition: (s) => s.stats.syllabePerfect >= 1 },
  { id: "serie-7", icone: "🔥", titre: "Série de 7 jours", desc: "Pratiquer 7 jours de suite.", condition: (s) => s.streak.count >= 7 },
  { id: "boss-vaincu", icone: "🏆", titre: "Boss vaincu", desc: "Vaincre le boss du Bac blanc.", condition: (s) => s.stats.boss >= 1 },
  { id: "correcteur", icone: "🩹", titre: "Correcteur", desc: "Corriger 10 erreurs du Carnet.", condition: (s) => s.stats.corrections >= 10 },
  { id: "joueur", icone: "🎮", titre: "Joueur", desc: "Jouer 5 parties de mini-jeux.", condition: (s) => s.stats.parties >= 5 },
  { id: "plan-parfait", icone: "🧭", titre: "Plan parfait", desc: "Réussir un Plan Puzzle sans erreur.", condition: (s) => s.stats.planParfait >= 1 },
  { id: "dissertateur", icone: "🎓", titre: "Dissertateur", desc: "Réussir le contrôle de dissertation.", condition: (s) => bestControle(9) >= 0.7 },
  { id: "lecteur-actif", icone: "📚", titre: "Lecteur actif", desc: "Ajouter un texte dans « Mes textes ».", condition: (s) => s.mesTextes.length >= 1 },
  { id: "niveau-5", icone: "🚀", titre: "Niveau 5", desc: "Atteindre le niveau 5.", condition: (s) => levelOf(s.xp) >= 5 }
];


/* ===================== 2. ÉTAT ===================== */
const KEY = 'theoremeDuTexte.v1';
const INTERVALLES = [1, 3, 7]; // Carnet d'erreurs : revoir après 1, 3 puis 7 jours

function defaultState() {
  return {
    version: 1, xp: 0,
    streak: { count: 0, lastDay: '' },
    dailyGoal: 50, dailyXp: 0, dailyDay: '',
    lessons: {}, controles: {}, games: {}, erreurs: [], badges: [], mesTextes: [],
    got: {}, // exercices déjà réussis (pour ne donner l'XP qu'une fois)
    stats: { figures: 0, pceiSerie: 0, pceiBest: 0, boss: 0, syllabePerfect: 0, parties: 0, corrections: 0, planParfait: 0 },
    settings: { theme: 'system', controleTimer: null }
  };
}
let S = defaultState();

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const o = JSON.parse(raw), d = defaultState();
    S = Object.assign(d, o);
    S.streak = Object.assign(d.streak, o.streak);
    S.stats = Object.assign(d.stats, o.stats);
    S.settings = Object.assign(d.settings, o.settings);
  } catch (e) { /* stockage indisponible : l'appli fonctionne en mémoire */ }
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignoré */ } }
// Toute modification d'état passe par save() : sauvegarde, badges, en-tête.
function save() { persist(); checkBadges(); renderHeader(); }

// --- Dates ---
function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
}
function daysBetween(a, b) {
  const p = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((p(b) - p(a)) / 864e5);
}

// --- XP, niveaux, série ---
const levelOf = (xp) => Math.floor(Math.sqrt(xp / 50)) + 1;
const xpForLevel = (l) => 50 * (l - 1) * (l - 1);
function rankOf(level) { let r = RANGS[0]; for (const x of RANGS) if (level >= x.min) r = x; return r.nom; }
function currentStreak() {
  const t = today();
  return S.streak.lastDay && daysBetween(S.streak.lastDay, t) <= 1 ? S.streak.count : 0;
}
function rollDay() { const t = today(); if (S.dailyDay !== t) { S.dailyDay = t; S.dailyXp = 0; } }
// Première activité du jour : met à jour la série et donne le bonus (10 × jours, max 100).
function touchStreak() {
  rollDay();
  const t = today();
  if (S.streak.lastDay === t) return;
  S.streak.count = S.streak.lastDay && daysBetween(S.streak.lastDay, t) === 1 ? S.streak.count + 1 : 1;
  S.streak.lastDay = t;
  const bonus = Math.min(100, 10 * S.streak.count);
  S.xp += bonus; S.dailyXp += bonus;
  toast('🔥 Série de ' + S.streak.count + ' jour' + (S.streak.count > 1 ? 's' : '') + ' : +' + bonus + ' XP');
}
function addXp(n, anchor) {
  if (!(n > 0)) return;
  touchStreak();
  const avant = levelOf(S.xp);
  S.xp += n; S.dailyXp += n;
  save();
  floatText('+' + n + ' XP', anchor);
  const apres = levelOf(S.xp);
  if (apres > avant) toast('⬆️ Niveau ' + apres + ' — rang « ' + rankOf(apres) + ' »');
}
// Une activité sans XP (ex. jeu à 0 point) compte quand même pour la série.
function markActive() { touchStreak(); save(); }

function checkBadges() {
  let nouveau = false;
  for (const b of BADGES) {
    if (!S.badges.includes(b.id) && b.condition(S)) { S.badges.push(b.id); nouveau = true; toast('🏅 Badge : ' + b.titre); }
  }
  if (nouveau) persist();
}

// --- Modules et leçons ---
const modById = (id) => MODULES.find(m => m.id === +id);
function findLesson(id) {
  const m = modById(String(id).split('.')[0]);
  return m ? m.lessons.find(l => l.id === id) : null;
}
const lessonDone = (id) => !!(S.lessons[id] && S.lessons[id].done);
const moduleLessonsDone = (m) => m.lessons.every(l => lessonDone(l.id));
const moduleMastered = (id) => bestControle(id) >= 0.7;
const moduleUnlocked = (id) => id === 0 || moduleMastered(id - 1);
const gameUnlocked = (jeu) => moduleMastered(jeu.module);
const starsOf = (p) => (p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0);
const starsTxt = (p) => '★'.repeat(starsOf(p)) + '☆'.repeat(3 - starsOf(p));

// --- Carnet d'erreurs ---
function getExercise(exId) {
  const [k, i] = exId.split('#');
  if (k[0] === 'c') { const m = modById(k.slice(1)); return m ? m.controle[+i] : null; }
  const l = findLesson(k);
  return l ? l.exercices[+i] : null;
}
function noteError(exId) {
  const e = S.erreurs.find(x => x.exId === exId);
  if (e) { e.step = 0; e.due = addDays(today(), 1); }
  else S.erreurs.push({ exId, due: addDays(today(), 1), step: 0, correct: 0 });
}
// Après une révision : 1, 3 puis 7 jours, jusqu'à 2 bonnes réponses.
function reviewResult(exId, ok) {
  const i = S.erreurs.findIndex(x => x.exId === exId);
  if (i < 0) return;
  const e = S.erreurs[i];
  e.step++;
  if (ok) e.correct++;
  if (ok && e.correct >= 2) { S.erreurs.splice(i, 1); S.stats.corrections++; addXp(15); return; }
  e.due = addDays(today(), INTERVALLES[Math.min(e.step, 2)]);
  save();
}
const erreursDues = () => S.erreurs.filter(e => e.due <= today());


/* ===================== 3. ROUTEUR ===================== */
const cleanups = [];
const onLeave = (fn) => cleanups.push(fn);
function runCleanups() { while (cleanups.length) { try { cleanups.pop()(); } catch (e) { /* ignoré */ } } }
const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

// Les vues dont la fonction n'existe pas encore affichent un message d'attente.
const vue = (nom, ...args) => (typeof window[nom] === 'function' ? window[nom](...args) : viewSoon());
const ROUTES = [
  [/^#\/home$/, () => viewHome()],
  [/^#\/module\/(\d+)$/, (m) => viewModule(+m)],
  [/^#\/module\/(\d+)\/lesson\/(\d+)$/, (m, l) => viewLesson(+m, m + '.' + l)],
  [/^#\/module\/(\d+)\/controle$/, (m) => vue('viewControle', +m)],
  [/^#\/module\/(\d+)\/memo$/, (m) => viewMemo(+m)],
  [/^#\/games$/, () => vue('viewGames')],
  [/^#\/game\/([\w-]+)$/, (id) => vue('viewGame', id)],
  [/^#\/formulaire$/, () => vue('viewFormulaire')],
  [/^#\/erreurs$/, () => vue('viewErreurs')],
  [/^#\/mes-textes$/, () => vue('viewMesTextes')],
  [/^#\/mes-textes\/(\w+)$/, (id) => vue('viewMesTexteExo', id)],
  [/^#\/profil$/, () => viewProfil()]
];
function route() {
  runCleanups();
  const hash = location.hash || '#/home';
  let ok = false;
  for (const [re, fn] of ROUTES) { const m = hash.match(re); if (m) { fn(...m.slice(1)); ok = true; break; } }
  if (!ok) { go('#/home'); return; }
  const seg = (hash.split('/')[1] || 'home').split('?')[0];
  $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === seg || (seg === 'game' && a.dataset.r === 'games') || (seg === 'module' && a.dataset.r === 'home')));
  renderHeader();
  window.scrollTo(0, 0);
  $('#app').focus({ preventScroll: true });
}
function setView(titre, ...nodes) {
  const app = $('#app');
  app.replaceChildren(...nodes);
  document.title = titre + ' — Le Théorème du Texte';
}
function viewSoon() {
  setView('Bientôt', h('div', { class: 'card' }, h('h2', {}, 'Bientôt disponible'), h('p', {}, 'Cette page sera ajoutée dans une prochaine passe.'), h('a', { class: 'btn', href: '#/home' }, 'Retour à l\'accueil')));
}

/* ===================== 4. RENDUS ===================== */
// --- En-tête : XP, niveau, série, pastille d'erreurs ---
function renderHeader() {
  rollDay();
  const lvl = levelOf(S.xp), a = xpForLevel(lvl), b = xpForLevel(lvl + 1);
  $('#levelTxt').textContent = 'Niv. ' + lvl + ' · ' + rankOf(lvl);
  $('#xpFill').style.width = Math.round(100 * (S.xp - a) / (b - a)) + '%';
  $('#xpTxt').textContent = S.xp + ' XP';
  const st = currentStreak();
  $('#streak').textContent = '🔥 ' + st;
  $('#streak').title = 'Série : ' + st + ' jour(s) de suite';
  const n = erreursDues().length, eb = $('#errBadge');
  eb.hidden = n === 0; eb.textContent = n;
  applyTheme();
}
function applyTheme() { document.documentElement.dataset.theme = S.settings.theme; }
function cycleTheme() {
  const ordre = ['system', 'light', 'dark'];
  S.settings.theme = ordre[(ordre.indexOf(S.settings.theme) + 1) % 3];
  save();
  toast('Thème : ' + { system: 'automatique', light: 'clair', dark: 'sombre' }[S.settings.theme]);
}

// --- Extraits : numéros de ligne, mots cliquables ---
function tokenize(texte, prose) {
  let lignes = texte.split('\n');
  if (prose) {
    const mots = texte.split(/\s+/).filter(Boolean);
    lignes = [];
    for (let i = 0; i < mots.length; i += 9) lignes.push(mots.slice(i, i + 9).join(' '));
  }
  let idx = 0;
  return lignes.map(l => (l.trim() === '' ? null : l.split(/([\p{L}\p{M}]+)/u).filter(p => p !== '').map(p => (/^[\p{L}\p{M}]+$/u.test(p) ? { w: p.toLowerCase(), t: p, i: idx++ } : { t: p }))));
}
const motsDe = (texte, prose) => tokenize(texte, prose).flat().filter(p => p && p.w !== undefined).map(p => p.w);
function resolveExtrait(cle) {
  const e = EXTRAITS[cle];
  if (e) return e;
  const mt = S.mesTextes.find(t => t.id === cle);
  if (mt) return { auteur: mt.auteur, titre: mt.titre, texte: mt.texte, prose: mt.texte.split('\n').length < 3, perso: true };
  return { texte: cle }; // texte brut donné directement dans l'exercice
}
// opts.clic : fonction appelée avec (index, bouton) quand on clique un mot.
function extraitEl(cle, opts = {}) {
  const e = resolveExtrait(cle);
  const box = h('div', { class: 'extrait' });
  if (e.titre) {
    const src = h('div', { class: 'src' }, (e.auteur ? e.auteur + ', ' : '') + '« ' + e.titre + ' »' + (e.annee ? ' (' + e.annee + ')' : ''));
    if (e.programme) src.append(h('span', { class: 'badge-prog' }, 'Œuvre au programme'));
    if (e.perso) src.append(h('span', { class: 'badge-prog mine' }, 'Mon texte'));
    box.append(src);
  }
  const boutons = [];
  let n = 0;
  tokenize(e.texte, e.prose).forEach(ligne => {
    if (!ligne) { box.append(h('div', { style: 'height:.6em' })); return; }
    n++;
    const t = h('div', { class: 't' });
    ligne.forEach(p => {
      if (p.w === undefined || !opts.clic) { t.append(p.t); return; }
      const b = h('button', { type: 'button', class: 'w', 'aria-pressed': 'false' }, p.t);
      b.onclick = () => opts.clic(p.i, b);
      boutons[p.i] = b; t.append(b);
    });
    box.append(h('div', { class: 'ln' }, h('span', { class: 'n', 'aria-hidden': 'true' }, n % 5 === 0 || n === 1 ? String(n) : ''), t));
  });
  box.boutons = boutons;
  return box;
}

// --- Blocs de leçon ---
function blocEl(b) {
  switch (b.type) {
    case 'definition': return h('div', { class: 'box def' }, h('div', { class: 'bt' }, 'Définition' + (b.titre ? ' — ' + b.titre : '')), h('div', { html: b.html }));
    case 'theoreme': return h('div', { class: 'box thm' }, h('div', { class: 'bt' }, b.genre + (b.titre ? ' — ' + b.titre : '')), h('div', { html: b.html }));
    case 'formule': return h('div', { class: 'box for' }, h('div', { class: 'bt' }, 'Formule — ' + b.titre), h('div', { class: 'formula' }, b.formule), b.html ? h('div', { html: b.html }) : null);
    case 'attention': return h('div', { class: 'box att' }, h('div', { class: 'bt' }, '⚠ Attention'), h('div', { html: b.html }));
    case 'arbre': return arbreEl(b.cle);
    case 'exemple': return exempleEl(b);
  }
  return h('div');
}
function exempleEl(b) {
  const box = h('div', { class: 'box exe' }, h('div', { class: 'bt' }, 'Exemple résolu'));
  if (b.intro) box.append(h('p', { html: b.intro }));
  if (b.extrait) box.append(extraitEl(b.extrait));
  const steps = h('div', { class: 'steps', 'aria-live': 'polite' });
  let k = 0;
  const btn = h('button', { type: 'button', class: 'btn' }, 'Étape suivante');
  btn.onclick = () => {
    steps.append(h('div', { class: 'step' }, h('b', {}, 'Étape ' + (k + 1) + '. '), h('span', { html: b.etapes[k] })));
    if (++k >= b.etapes.length) btn.remove(); else btn.textContent = 'Étape suivante (' + (k + 1) + '/' + b.etapes.length + ')';
  };
  box.append(steps, btn);
  return box;
}
// Arbre de décision interactif : une question par clic (4.7).
function arbreEl(cle) {
  const A_ = ARBRES[cle];
  const box = h('div', { class: 'box for tree' }, h('div', { class: 'bt' }, 'Arbre de décision — ' + A_.titre));
  const zone = h('div', { 'aria-live': 'polite' });
  const trace = [];
  const afficher = (id) => {
    zone.replaceChildren();
    trace.forEach(t => zone.append(h('div', { class: 'small muted' }, t)));
    const n = A_.noeuds[id];
    zone.append(h('div', { class: 'q' }, n.q), h('div', { class: 'row', style: 'justify-content:center' },
      h('button', { type: 'button', class: 'btn', onclick: () => suite(n, 'oui') }, 'Oui'),
      h('button', { type: 'button', class: 'btn', onclick: () => suite(n, 'non') }, 'Non')));
    const f = zone.querySelector('button'); if (f && trace.length) f.focus();
  };
  const suite = (n, rep) => {
    trace.push(n.q + ' → ' + (rep === 'oui' ? 'Oui' : 'Non'));
    const nx = n[rep];
    if (typeof nx === 'string') { afficher(nx); return; }
    zone.replaceChildren();
    trace.forEach(t => zone.append(h('div', { class: 'small muted' }, t)));
    zone.append(h('div', { class: 'q' }, '✔ ' + nx.res), h('button', { type: 'button', class: 'btn', onclick: () => { trace.length = 0; afficher(A_.debut); } }, 'Recommencer'));
  };
  afficher(A_.debut);
  box.append(zone);
  return box;
}

// --- Accueil : carte du cours ---
function nextTodo() {
  for (const m of MODULES) {
    if (!moduleUnlocked(m.id)) break;
    for (const l of m.lessons) if (!lessonDone(l.id)) return { hash: '#/module/' + m.id + '/lesson/' + l.id.split('.')[1], txt: 'Continuer : leçon ' + l.id };
    if (!moduleMastered(m.id)) return { hash: '#/module/' + m.id + '/controle', txt: 'Continuer : contrôle du chapitre ' + m.id };
  }
  return { hash: '#/games', txt: 'Aller à la salle de jeux' };
}
function viewHome() {
  const pct = Math.min(100, Math.round(100 * S.dailyXp / S.dailyGoal));
  const todo = nextTodo();
  const map = h('div', { class: 'map', role: 'list' });
  MODULES.forEach(m => {
    const ok = moduleUnlocked(m.id), maitre = moduleMastered(m.id);
    const faites = m.lessons.filter(l => lessonDone(l.id)).length;
    const stat = !ok ? '🔒 Réussis le contrôle du chapitre ' + (m.id - 1) : maitre ? '✔ Maîtrisé · ' + Math.round(100 * bestControle(m.id)) + ' %' : faites + '/' + m.lessons.length + ' leçons';
    map.append(h('a', { class: 'node' + (ok ? '' : ' locked') + (maitre ? ' mastered' : ''), href: ok ? '#/module/' + m.id : null, role: 'listitem', 'aria-disabled': ok ? null : 'true' },
      h('span', { class: 'nb' }, String(m.id)), h('span', {}, h('div', { class: 'nt' }, m.titre), h('div', { class: 'ns' }, stat))));
  });
  setView('Accueil',
    h('h1', {}, 'Le Théorème du Texte'),
    h('p', { class: 'muted' }, 'Le français comme les maths : des formules, des théorèmes, des algorithmes.'),
    h('div', { class: 'card row' },
      h('div', { class: 'ring', style: '--p:' + pct, role: 'img', 'aria-label': 'Objectif du jour : ' + pct + ' %' }, h('span', {}, S.dailyXp + ' / ' + S.dailyGoal + ' XP')),
      h('div', {}, h('h3', {}, 'Objectif du jour'), h('p', { class: 'small muted' }, 'Réglable dans ton profil.'),
        h('div', { class: 'row' }, h('a', { class: 'btn primary', href: todo.hash }, todo.txt),
          h('button', { type: 'button', class: 'btn', onclick: startRevision }, '🎲 Mode révision')))),
    h('h2', {}, 'Carte du cours'), map);
}
function startRevision() {
  const ouverts = JEUX_META.filter(gameUnlocked);
  if (!ouverts.length) { toast('Réussis d\'abord un contrôle pour débloquer un jeu.'); return; }
  go('#/game/' + ouverts[Math.floor(Math.random() * ouverts.length)].id);
}

// --- Chapitre ---
function viewModule(id) {
  const m = modById(id);
  if (!m || !moduleUnlocked(id)) { toast('Ce chapitre est verrouillé.'); go('#/home'); return; }
  const jeu = JEUX_META.find(j => j.id === m.jeu);
  const tout = moduleLessonsDone(m);
  const liste = m.lessons.map(l => {
    const r = S.lessons[l.id], n = l.id.split('.')[1];
    return h('a', { class: 'card lesson-row', href: '#/module/' + id + '/lesson/' + n, style: 'text-decoration:none;color:inherit' },
      h('b', {}, l.id), h('span', { style: 'flex:1' }, l.titre),
      r && r.done ? h('span', { class: 'stars', 'aria-label': starsOf(r.best) + ' étoile(s)' }, starsTxt(r.best)) : h('span', { class: 'muted small' }, 'à faire'));
  });
  const c = S.controles[id];
  setView('Chapitre ' + id,
    h('div', { class: 'crumb' }, h('a', { href: '#/home' }, 'Accueil'), ' › Chapitre ' + id),
    h('h1', {}, 'Chapitre ' + id + ' — ' + m.titre),
    ...liste,
    h('div', { class: 'row mt' },
      tout ? h('a', { class: 'btn primary', href: '#/module/' + id + '/controle' }, 'Passer le contrôle' + (c ? ' (meilleur : ' + Math.round(100 * c.best) + ' %)' : ''))
        : h('button', { class: 'btn', type: 'button', disabled: true }, '🔒 Contrôle (termine toutes les leçons)'),
      h('a', { class: 'btn', href: '#/module/' + id + '/memo' }, '📄 Fiche-mémo'),
      jeu ? (gameUnlocked(jeu) ? h('a', { class: 'btn', href: '#/game/' + jeu.id }, jeu.icone + ' Jouer : ' + jeu.titre) : h('span', { class: 'muted small' }, 'Jeu « ' + jeu.titre + ' » débloqué par le contrôle (≥ 70 %)')) : null),
    c && c.best < 0.7 ? h('p', { class: 'muted' }, 'Il faut au moins 70 % au contrôle pour débloquer le chapitre suivant.') : null);
}

// --- Fiche-mémo imprimable ---
function viewMemo(id) {
  const m = modById(id);
  if (!m) { go('#/home'); return; }
  setView('Fiche-mémo ' + id,
    h('div', { class: 'crumb no-print' }, h('a', { href: '#/module/' + id }, 'Chapitre ' + id), ' › Fiche-mémo'),
    h('h1', {}, 'Chapitre ' + id + ' — ' + m.titre),
    h('div', { class: 'card', html: m.memo }),
    h('button', { type: 'button', class: 'btn primary no-print', onclick: () => window.print() }, '🖨 Imprimer'));
}

// --- Leçon ---
function viewLesson(mid, lid) {
  const m = modById(mid), l = findLesson(lid);
  if (!m || !l || !moduleUnlocked(mid)) { go('#/home'); return; }
  const exo = h('div', { id: 'exos' });
  setView('Leçon ' + lid,
    h('div', { class: 'crumb' }, h('a', { href: '#/home' }, 'Accueil'), ' › ', h('a', { href: '#/module/' + mid }, 'Chapitre ' + mid), ' › Leçon ' + lid),
    h('h1', {}, lid + ' · ' + l.titre),
    h('p', { class: 'objectif' }, '🎯 ' + l.objectif),
    ...l.blocs.map(blocEl),
    h('h2', {}, 'Exercices'), exo);
  vue('mountLessonExercises', exo, l, m);
}

// --- Profil ---
function viewProfil() {
  const lvl = levelOf(S.xp);
  const badges = h('div', { class: 'grid' }, ...BADGES.map(b => h('div', { class: 'badge' + (S.badges.includes(b.id) ? '' : ' off'), title: b.desc },
    h('div', { class: 'ic' }, b.icone), h('b', {}, b.titre), h('div', { class: 'small muted' }, b.desc), h('div', { class: 'small' }, S.badges.includes(b.id) ? '✓ obtenu' : '✗ à gagner'))));
  const stats = MODULES.map(m => {
    const c = S.controles[m.id];
    return h('tr', {}, h('td', {}, m.id + ' · ' + m.titre), h('td', {}, m.lessons.filter(l => lessonDone(l.id)).length + '/' + m.lessons.length), h('td', {}, c ? Math.round(100 * c.best) + ' %' : '—'));
  });
  const goal = h('input', { type: 'number', min: 10, max: 500, step: 10, value: S.dailyGoal, 'aria-label': 'Objectif quotidien en XP' });
  goal.onchange = () => { S.dailyGoal = Math.max(10, Math.min(500, +goal.value || 50)); save(); toast('Objectif : ' + S.dailyGoal + ' XP/jour'); };
  setView('Profil',
    h('h1', {}, 'Profil'),
    h('div', { class: 'card' },
      h('h2', {}, 'Rang : ' + rankOf(lvl)),
      h('p', {}, h('b', {}, S.xp + ' XP'), ' · niveau ', h('b', {}, lvl)),
      h('div', { class: 'box for' }, h('div', { class: 'bt' }, 'Formule du niveau'), h('div', { class: 'formula' }, 'niveau = ⌊√(XP / 50)⌋ + 1'), h('div', { class: 'small' }, '√(' + S.xp + ' / 50) = ' + Math.sqrt(S.xp / 50).toFixed(2) + ' → niveau ' + lvl)),
      h('p', { class: 'small muted' }, 'Rangs : Axiome (1–2) · Lemme (3–4) · Corollaire (5–6) · Théorème (7–9) · Démonstration (10–12) · CQFD (13+)'),
      h('p', {}, '🔥 Série : ' + currentStreak() + ' jour(s)'),
      h('label', {}, 'Objectif du jour (XP) : ', goal)),
    h('h2', {}, 'Badges (' + S.badges.length + '/' + BADGES.length + ')'), badges,
    h('h2', {}, 'Statistiques par chapitre'),
    h('div', { class: 'card' }, h('table', { style: 'width:100%;border-collapse:collapse' }, h('thead', {}, h('tr', {}, h('th', { align: 'left' }, 'Chapitre'), h('th', { align: 'left' }, 'Leçons'), h('th', { align: 'left' }, 'Contrôle'))), h('tbody', {}, ...stats))),
    h('div', { class: 'card' }, h('button', { type: 'button', class: 'btn danger', onclick: confirmReset }, 'Réinitialiser ma progression')));
}
function confirmReset() {
  modal(h('div', { class: 'card' }, h('h2', {}, 'Tout effacer ?'), h('p', {}, 'Ton XP, tes badges, ton carnet d\'erreurs et tes textes seront supprimés. Cette action est définitive.'),
    h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn danger', onclick: () => { const th = S.settings.theme; S = defaultState(); S.settings.theme = th; save(); closeModal(); toast('Progression réinitialisée.'); go('#/home'); } }, 'Oui, tout effacer'),
      h('button', { type: 'button', class: 'btn', onclick: closeModal }, 'Annuler'))));
}


/* ===================== 5. MOTEURS D'EXERCICES ===================== */
// Un moteur par type : render(ex, corps, st) construit l'interface à partir de l'état st,
// grade(ex, st) renvoie un score entre 0 et 1, reveal(ex, corps, st) affiche la solution.
const TYPE_LABEL = { qcm: 'QCM', multi: 'Choix multiples', highlight: 'Surligner', match: 'Associer', order: 'Ordonner', fill: 'Compléter', count: 'Compter', pcei: 'Analyse PCEI', write: 'Rédaction' };
const lettre = ['P — Procédé', 'C — Citation', 'E — Effet', 'I — Interprétation'];

const MOTEURS = {
  qcm: {
    render(ex, corps, st) {
      if (st.sel === undefined) { st.sel = -1; st.perm = shuffle(ex.options.map((_, i) => i)); }
      st.perm.forEach(i => {
        const b = h('button', { type: 'button', class: 'opt', 'data-i': i, 'aria-pressed': String(st.sel === i) }, ex.options[i]);
        b.onclick = () => { st.sel = i; $$('.opt', corps).forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.i === i))); };
        corps.append(b);
      });
    },
    grade: (ex, st) => (st.sel === ex.reponse ? 1 : 0),
    reveal(ex, corps, st) { $$('.opt', corps).forEach(b => { const i = +b.dataset.i; if (i === ex.reponse) b.classList.add('ok'); else if (i === st.sel) b.classList.add('ko'); }); }
  },
  multi: {
    render(ex, corps, st) {
      if (!st.sel) { st.sel = []; st.perm = shuffle(ex.options.map((_, i) => i)); }
      st.perm.forEach(i => {
        const b = h('button', { type: 'button', class: 'opt', 'data-i': i, 'aria-pressed': String(st.sel.includes(i)) }, ex.options[i]);
        b.onclick = () => {
          const k = st.sel.indexOf(i);
          if (k >= 0) st.sel.splice(k, 1); else st.sel.push(i);
          b.setAttribute('aria-pressed', String(st.sel.includes(i)));
        };
        corps.append(b);
      });
      corps.prepend(h('p', { class: 'small muted' }, 'Plusieurs réponses possibles.'));
    },
    grade(ex, st) {
      const bon = st.sel.filter(i => ex.reponse.includes(i)).length, faux = st.sel.length - bon;
      return Math.max(0, (bon - faux) / ex.reponse.length);
    },
    reveal(ex, corps, st) { $$('.opt', corps).forEach(b => { const i = +b.dataset.i; if (ex.reponse.includes(i)) b.classList.add('ok'); else if (st.sel.includes(i)) b.classList.add('ko'); }); }
  },
  highlight: {
    render(ex, corps, st) {
      if (!st.sel) st.sel = [];
      const el = extraitEl(ex.extrait, {
        clic(i, b) {
          const k = st.sel.indexOf(i);
          if (k >= 0) st.sel.splice(k, 1); else st.sel.push(i);
          b.classList.toggle('sel', k < 0); b.setAttribute('aria-pressed', String(k < 0));
        }
      });
      st.sel.forEach(i => { if (el.boutons[i]) { el.boutons[i].classList.add('sel'); el.boutons[i].setAttribute('aria-pressed', 'true'); } });
      corps.append(el); corps.__el = el;
    },
    bons(ex) {
      const e = resolveExtrait(ex.extrait);
      return motsDe(e.texte, e.prose).map((w, i) => (ex.mots.includes(w) ? i : -1)).filter(i => i >= 0);
    },
    grade(ex, st) {
      const bons = MOTEURS.highlight.bons(ex);
      const ok = st.sel.filter(i => bons.includes(i)).length, faux = st.sel.length - ok;
      return Math.max(0, (ok - faux) / bons.length);
    },
    reveal(ex, corps, st) {
      const bons = MOTEURS.highlight.bons(ex);
      corps.__el.boutons.forEach((b, i) => {
        if (!b) return;
        const s = st.sel.includes(i), g = bons.includes(i);
        if (s && g) b.classList.add('good'); else if (s) b.classList.add('bad'); else if (g) b.classList.add('miss');
      });
    }
  },
  match: {
    render(ex, corps, st) {
      if (!st.lien) { st.lien = {}; st.perm = shuffle(ex.paires.map((_, i) => i)); st.pend = null; }
      const colG = h('div'), colD = h('div'), g = [], d = [];
      const maj = () => {
        g.forEach((b, i) => { b.querySelector('.num') && b.querySelector('.num').remove(); if (st.lien[i] !== undefined) b.prepend(h('span', { class: 'num' }, String(i + 1))); b.classList.toggle('on', !!st.pend && st.pend.s === 'g' && st.pend.i === i); });
        d.forEach((b, r) => { b.querySelector('.num') && b.querySelector('.num').remove(); const l = Object.keys(st.lien).find(k => st.lien[k] === r); if (l !== undefined) b.prepend(h('span', { class: 'num' }, String(+l + 1))); b.classList.toggle('on', !!st.pend && st.pend.s === 'd' && st.pend.i === r); });
      };
      const clic = (s, i) => {
        if (st.pend && st.pend.s !== s) {
          const l = s === 'g' ? i : st.pend.i, r = s === 'd' ? i : st.pend.i;
          Object.keys(st.lien).forEach(k => { if (st.lien[k] === r) delete st.lien[k]; });
          st.lien[l] = r; st.pend = null;
        } else st.pend = st.pend && st.pend.s === s && st.pend.i === i ? null : { s, i };
        maj();
      };
      ex.paires.forEach((p, i) => { const b = h('button', { type: 'button', class: 'opt' }, p[0]); b.onclick = () => clic('g', i); g[i] = b; colG.append(b); });
      st.perm.forEach(r => { const b = h('button', { type: 'button', class: 'opt', 'data-r': r }, ex.paires[r][1]); b.onclick = () => clic('d', r); d[r] = b; colD.append(b); });
      corps.append(h('p', { class: 'small muted' }, 'Clique un élément à gauche puis son correspondant à droite (ou l\'inverse).'), h('div', { class: 'pair' }, colG, colD));
      corps.__g = g; maj();
    },
    grade: (ex, st) => ex.paires.filter((_, i) => st.lien[i] === i).length / ex.paires.length,
    reveal(ex, corps, st) {
      corps.__g.forEach((b, i) => {
        const ok = st.lien[i] === i;
        b.classList.add(ok ? 'ok' : 'ko');
        if (!ok) b.append(h('div', { class: 'small' }, '→ ' + ex.paires[i][1]));
      });
    }
  },
  order: {
    render(ex, corps, st) {
      if (!st.seq) { st.seq = []; st.perm = shuffle(ex.items.map((_, i) => i)); }
      const pool = h('div'), chosen = h('div', { class: 'chosen', 'aria-label': 'Ta réponse' });
      const maj = () => {
        pool.replaceChildren(); chosen.replaceChildren();
        st.perm.filter(i => !st.seq.includes(i)).forEach(i => { const b = h('button', { type: 'button', class: 'opt' }, ex.items[i]); b.onclick = () => { st.seq.push(i); maj(); }; pool.append(b); });
        st.seq.forEach((i, k) => { const b = h('button', { type: 'button', class: 'opt on', 'data-k': k }, h('span', { class: 'num' }, String(k + 1)), ex.items[i]); b.onclick = () => { st.seq.splice(k, 1); maj(); }; chosen.append(b); });
        if (!st.seq.length) chosen.append(h('span', { class: 'muted small' }, 'Clique les éléments dans le bon ordre (clique à nouveau pour retirer).'));
      };
      corps.append(chosen, pool); corps.__maj = maj; maj();
    },
    grade: (ex, st) => ex.items.filter((_, k) => st.seq[k] === k).length / ex.items.length,
    reveal(ex, corps, st) {
      $$('.chosen .opt', corps).forEach(b => b.classList.add(st.seq[+b.dataset.k] === +b.dataset.k ? 'ok' : 'ko'));
      corps.append(h('p', {}, h('b', {}, 'Ordre correct : '), ex.items.map((t, k) => (k + 1) + '. ' + t).join('  →  ')));
    }
  },
  fill: {
    render(ex, corps, st) {
      if (!st.vals) st.vals = ex.blancs.map(() => -1);
      const p = h('p', { style: 'line-height:2.3' });
      ex.texte.split(/(\{\d+\})/).forEach(part => {
        const m = part.match(/^\{(\d+)\}$/);
        if (!m) { p.append(part); return; }
        const k = +m[1], sel = h('select', { 'aria-label': 'Blanc ' + (k + 1), 'data-k': k }, h('option', { value: -1 }, '…'), ...ex.blancs[k].o.map((o, i) => h('option', { value: i }, o)));
        sel.value = st.vals[k];
        sel.onchange = () => { st.vals[k] = +sel.value; };
        p.append(sel);
      });
      corps.append(p);
    },
    grade: (ex, st) => ex.blancs.filter((b, k) => st.vals[k] === b.a).length / ex.blancs.length,
    reveal(ex, corps, st) {
      $$('select', corps).forEach(s => {
        const k = +s.dataset.k, ok = st.vals[k] === ex.blancs[k].a;
        s.after(h('span', { class: ok ? 'ok' : 'ko', style: 'font-weight:700;margin:0 6px' }, ok ? ' ✓' : ' ✗ → ' + ex.blancs[k].o[ex.blancs[k].a]));
      });
    }
  },
  count: {
    render(ex, corps, st) {
      const inp = h('input', { type: 'number', min: 0, max: 99, inputmode: 'numeric', 'aria-label': 'Ta réponse', style: 'width:6em' });
      if (st.val !== undefined) inp.value = st.val;
      inp.oninput = () => { st.val = inp.value; };
      corps.append(inp);
    },
    grade: (ex, st) => (st.val !== undefined && st.val !== '' && Number(st.val) === ex.reponse ? 1 : 0),
    reveal(ex, corps, st) { corps.append(h('p', {}, h('b', {}, 'Décomposition : '), ex.decomposition)); }
  },
  pcei: {
    render(ex, corps, st) {
      if (!st.vals) { st.vals = [-1, -1, -1, -1]; st.perms = ex.termes.map(t => shuffle(t.o.map((_, i) => i))); }
      if (ex.texte) corps.append(extraitEl(ex.texte));
      ex.termes.forEach((t, k) => {
        const g = h('div', { class: 'mt', role: 'group', 'aria-label': lettre[k] }, h('b', {}, lettre[k]));
        st.perms[k].forEach(i => {
          const b = h('button', { type: 'button', class: 'opt', 'data-k': k, 'data-i': i, 'aria-pressed': String(st.vals[k] === i) }, t.o[i]);
          b.onclick = () => { st.vals[k] = i; $$('.opt[data-k="' + k + '"]', g).forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.i === i))); };
          g.append(b);
        });
        corps.append(g);
      });
    },
    points: (ex, st) => ex.termes.filter((t, k) => st.vals[k] === t.a).length,
    // Théorème de non-paraphrase : si le terme Procédé vaut 0, l'analyse entière vaut 0.
    grade(ex, st) { return st.vals[0] !== ex.termes[0].a ? 0 : MOTEURS.pcei.points(ex, st) / 4; },
    reveal(ex, corps, st) {
      $$('.opt', corps).forEach(b => { const k = +b.dataset.k, i = +b.dataset.i; if (i === ex.termes[k].a) b.classList.add('ok'); else if (st.vals[k] === i) b.classList.add('ko'); });
      const pts = MOTEURS.pcei.points(ex, st);
      corps.append(h('p', { class: 'mt' }, h('b', {}, 'Termes justes : ' + pts + ' / 4. '),
        st.vals[0] !== ex.termes[0].a ? 'Théorème de non-paraphrase : Procédé = 0 ⇒ l\'analyse entière vaut 0.' : ''));
    }
  },
  write: {
    render(ex, corps, st) {
      if (!st.ticks) st.ticks = ex.checklist.map(() => false);
      const ta = h('textarea', { 'aria-label': 'Ta rédaction', placeholder: 'Écris ici…' });
      ta.value = st.text || '';
      ta.oninput = () => { st.text = ta.value; };
      const cl = h('div', { class: 'checks' }, h('b', {}, 'Auto-évaluation : coche ce que tu as fait'));
      ex.checklist.forEach((c, k) => {
        const cb = h('input', { type: 'checkbox' }); cb.checked = st.ticks[k];
        cb.onchange = () => { st.ticks[k] = cb.checked; };
        cl.append(h('label', {}, cb, ' ' + c[0]));
      });
      corps.append(ta, cl);
    },
    detecte: (ex, st, k) => { const re = ex.checklist[k][1]; return re ? new RegExp(re, 'i').test(st.text || '') : null; },
    grade(ex, st) {
      return ex.checklist.reduce((s, c, k) => {
        if (!st.ticks[k]) return s;
        const d = MOTEURS.write.detecte(ex, st, k);
        return s + (d === false ? 0.5 : 1);
      }, 0) / ex.checklist.length;
    },
    reveal(ex, corps, st) {
      const ul = h('ul');
      ex.checklist.forEach((c, k) => {
        const d = MOTEURS.write.detecte(ex, st, k);
        ul.append(h('li', {}, c[0] + ' — ' + (st.ticks[k] ? 'coché' : 'non coché') + (d === null ? '' : d ? ' · ✓ détecté dans ton texte' : ' · ⚠ non détecté dans ton texte')));
      });
      corps.append(ul, h('div', { class: 'box exe' }, h('div', { class: 'bt' }, 'Corrigé (modèle)'), h('p', {}, ex.corrige)));
    }
  }
};

// --- Carte d'exercice : rendu, validation, retour ---
const enonce = (ex) => ex.question || ex.consigne || (ex.texte ? ex.texte.replace(/\{\d+\}/g, '…') : 'Exercice');
function retourEl(ex, score) {
  const ok = score >= 1;
  const titre = ok ? '✓ Correct !' : score > 0 ? '◐ Partiel (' + Math.round(100 * score) + ' %)' : '✗ Incorrect';
  const fb = h('div', { class: 'fb ' + (ok ? 'ok' : 'ko') }, h('b', {}, titre));
  if (ex.explication) fb.append(h('div', { class: 'rappel' }, 'Rappel : ' + (ex.ref || 'cours') + ' — ' + ex.explication));
  return fb;
}
// opts : mode 'learn' | 'test' | 'review' | 'correction' ; num [i, n] ; st ; onDone(res, carte)
function mountExercise(parent, ex, exId, opts) {
  const mode = opts.mode, st = opts.st || {}, M = MOTEURS[ex.type];
  const carte = h('div', { class: 'exo' });
  carte.append(h('div', { class: 'tag' }, (opts.num ? 'Exercice ' + opts.num[0] + ' / ' + opts.num[1] + ' · ' : '') + TYPE_LABEL[ex.type]));
  if (ex.extrait && ex.type !== 'highlight') carte.append(extraitEl(ex.extrait));
  const q = ex.question || ex.consigne;
  if (q) carte.append(h('div', { class: 'q' }, q));
  const fs = h('fieldset'), corps = h('div');
  fs.append(corps); carte.append(fs);
  M.render(ex, corps, st);
  const zone = h('div', { 'aria-live': 'polite' });
  carte.append(zone);
  const finir = (score) => {
    fs.disabled = true;
    if (mode === 'test') zone.append(h('p', { class: 'muted' }, '✔ Réponse enregistrée.'));
    else {
      M.reveal(ex, corps, st);
      zone.append(retourEl(ex, score));
      carte.classList.add(score >= 1 ? 'flash' : 'shake');
    }
    if (opts.onDone) opts.onDone({ score, st, exId }, carte, zone);
  };
  if (mode === 'correction') { fs.disabled = true; M.reveal(ex, corps, st); zone.append(retourEl(ex, M.grade(ex, st))); }
  else {
    const btn = h('button', { type: 'button', class: 'btn primary mt' }, 'Valider');
    btn.onclick = () => { btn.remove(); finir(M.grade(ex, st)); };
    zone.append(btn);
  }
  parent.append(carte);
  return carte;
}
// XP (une fois par exercice, proportionnel au score), carnet d'erreurs, série PCEI.
function award(exId, ex, score, carte, mode) {
  if (mode === 'review') { reviewResult(exId, score >= 1); return; }
  const prev = S.got[exId] || 0;
  if (score > prev) { S.got[exId] = score; addXp(Math.round(10 * (score - prev)), carte); }
  if (score < 1) noteError(exId);
  if (ex.type === 'pcei') {
    if (score >= 1) { S.stats.pceiSerie++; S.stats.pceiBest = Math.max(S.stats.pceiBest, S.stats.pceiSerie); } else S.stats.pceiSerie = 0;
  }
  save();
}

// --- Leçon : exercices un par un, puis bilan ---
function mountLessonExercises(box, lesson, module) {
  const exs = lesson.exercices;
  let i = 0, scores = [], xp0 = S.xp;
  const barre = h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Avancement des exercices' }, h('i'));
  const zone = h('div');
  box.append(barre, zone);
  const maj = () => { barre.firstChild.style.width = Math.round(100 * i / exs.length) + '%'; };
  const suivant = () => { i++; maj(); montrer(); };
  function montrer() {
    zone.replaceChildren();
    if (i >= exs.length) { bilan(); return; }
    mountExercise(zone, exs[i], lesson.id + '#' + i, {
      mode: 'learn', num: [i + 1, exs.length],
      onDone(res, carte, z) {
        scores.push(res.score);
        award(res.exId, exs[i], res.score, carte, 'learn');
        z.append(h('button', { type: 'button', class: 'btn primary mt', autofocus: true, onclick: suivant }, i + 1 < exs.length ? 'Exercice suivant →' : 'Voir le bilan →'));
      }
    });
  }
  function bilan() {
    const moy = scores.reduce((a, b) => a + b, 0) / scores.length;
    const premiere = !lessonDone(lesson.id);
    const prec = S.lessons[lesson.id] ? S.lessons[lesson.id].best : 0;
    S.lessons[lesson.id] = { done: true, best: Math.max(prec, moy) };
    save();
    if (premiere) addXp(50);
    const fin = moduleLessonsDone(module);
    if (fin && premiere) confetti();
    const idx = module.lessons.findIndex(l => l.id === lesson.id), nx = module.lessons[idx + 1];
    zone.append(h('div', { class: 'card center' },
      h('h2', {}, 'Bilan de la leçon ' + lesson.id),
      h('div', { class: 'stars', 'aria-label': starsOf(moy) + ' étoiles' }, starsTxt(moy)),
      h('p', {}, h('b', {}, Math.round(100 * moy) + ' %'), ' de réussite · ', h('b', {}, '+' + (S.xp - xp0) + ' XP'), ' sur cette séance'),
      premiere ? h('p', {}, '🎉 Leçon terminée (+50 XP la première fois).') : null,
      fin && premiere ? h('p', {}, 'Tous les exercices du chapitre sont faits : le contrôle est débloqué !') : null,
      h('div', { class: 'row', style: 'justify-content:center' },
        nx ? h('a', { class: 'btn primary', href: '#/module/' + module.id + '/lesson/' + nx.id.split('.')[1] }, 'Leçon suivante : ' + nx.id)
          : h('a', { class: 'btn primary', href: '#/module/' + module.id + (fin ? '/controle' : '') }, fin ? 'Passer le contrôle' : 'Retour au chapitre'),
        h('button', { type: 'button', class: 'btn', onclick: () => { i = 0; scores = []; xp0 = S.xp; maj(); montrer(); } }, 'Refaire les exercices'),
        h('a', { class: 'btn', href: '#/module/' + module.id }, 'Chapitre'))));
    barre.firstChild.style.width = '100%';
  }
  montrer();
}

// --- Contrôle : 10 questions, aucun retour avant la fin, pas de limite de temps ---
function viewControle(mid) {
  const m = modById(mid);
  if (!m || !moduleUnlocked(mid)) { go('#/home'); return; }
  if (!moduleLessonsDone(m)) { toast('Termine d\'abord toutes les leçons du chapitre.'); go('#/module/' + mid); return; }
  const racine = h('div');
  setView('Contrôle ' + mid, h('div', { class: 'crumb' }, h('a', { href: '#/module/' + mid }, 'Chapitre ' + mid), ' › Contrôle'), h('h1', {}, 'Contrôle — ' + m.titre), racine);
  const q = m.controle;
  const etats = q.map(() => ({}));
  const scores = [];
  let i = 0, minuteur = null;
  // Prêt pour une limite de temps facultative (settings.controleTimer, en minutes) ; null = aucun minuteur affiché.
  if (S.settings.controleTimer) {
    const fin = Date.now() + S.settings.controleTimer * 60000;
    const aff = h('div', { class: 'muted', 'aria-live': 'off' });
    racine.before(aff);
    minuteur = setInterval(() => {
      const r = Math.max(0, fin - Date.now());
      aff.textContent = '⏱ ' + Math.floor(r / 60000) + ':' + String(Math.floor(r / 1000) % 60).padStart(2, '0');
      if (r <= 0) { clearInterval(minuteur); while (scores.length < q.length) scores.push(MOTEURS[q[scores.length].type].grade(q[scores.length], etats[scores.length])); resultat(); }
    }, 500);
    onLeave(() => clearInterval(minuteur));
  }
  function intro() {
    racine.replaceChildren(h('div', { class: 'card' }, h('p', {}, '10 questions. Tu ne vois la correction qu\'à la fin. ' + (S.settings.controleTimer ? '' : 'Pas de limite de temps : l\'objectif est de prendre de bonnes habitudes.')), h('p', {}, 'Il faut au moins 70 % pour débloquer le chapitre suivant et le jeu associé.'), h('button', { type: 'button', class: 'btn primary', onclick: question }, 'Commencer')));
  }
  function question() {
    racine.replaceChildren(h('div', { class: 'progress' }, h('i', { style: 'width:' + (100 * i / q.length) + '%' })));
    mountExercise(racine, q[i], 'c' + mid + '#' + i, {
      mode: 'test', num: [i + 1, q.length], st: etats[i],
      onDone(res, carte, z) {
        scores[i] = res.score;
        z.append(h('button', { type: 'button', class: 'btn primary mt', onclick: () => { i++; if (i < q.length) question(); else resultat(); } }, i + 1 < q.length ? 'Question suivante →' : 'Terminer le contrôle'));
      }
    });
  }
  function resultat() {
    if (minuteur) clearInterval(minuteur);
    const moy = scores.reduce((a, b) => a + b, 0) / q.length;
    const reussi = moy >= 0.7, premier = reussi && !(S.controles[mid] && S.controles[mid].passed);
    const prec = S.controles[mid] ? S.controles[mid].best : 0;
    S.controles[mid] = { best: Math.max(prec, moy), passed: reussi || !!(S.controles[mid] && S.controles[mid].passed) };
    q.forEach((ex, k) => {
      const id = 'c' + mid + '#' + k, p = S.got[id] || 0;
      if (scores[k] > p) { S.got[id] = scores[k]; S.xp += Math.round(10 * (scores[k] - p)); S.dailyXp += Math.round(10 * (scores[k] - p)); }
      if (scores[k] < 1) noteError(id);
    });
    save();
    if (premier) { addXp(200); confetti(); } else markActive();
    const liste = h('div');
    q.forEach((ex, k) => mountExercise(liste, ex, 'c' + mid + '#' + k, { mode: 'correction', num: [k + 1, q.length], st: etats[k] }));
    const suiv = modById(mid + 1);
    racine.replaceChildren(
      h('div', { class: 'card center' }, h('h2', {}, Math.round(100 * moy) + ' %'), h('div', { class: 'stars' }, starsTxt(moy)),
        h('p', {}, reussi ? '✔ Contrôle réussi ! ' + (premier ? '(+200 XP)' : '') + (suiv ? ' Le chapitre ' + suiv.id + ' est débloqué.' : '') : '✗ Il faut 70 % pour valider. Relis les rappels ci-dessous et recommence : tes erreurs sont dans le Carnet.'),
        h('div', { class: 'row', style: 'justify-content:center' },
          h('a', { class: 'btn primary', href: '#/module/' + mid }, 'Retour au chapitre'),
          h('button', { type: 'button', class: 'btn', onclick: () => route() }, 'Recommencer'),
          reussi && m.jeu ? h('a', { class: 'btn', href: '#/game/' + m.jeu }, 'Jouer au jeu débloqué') : null)),
      h('h2', {}, 'Correction détaillée'), liste);
  }
  intro();
}

// --- Carnet d'erreurs ---
function viewErreurs() {
  const racine = h('div');
  const dues = erreursDues(), autres = S.erreurs.filter(e => e.due > today());
  const ligne = (e) => {
    const ex = getExercise(e.exId);
    return ex ? h('div', { class: 'card' }, h('div', { class: 'small muted' }, e.exId.startsWith('c') ? 'Contrôle ' + e.exId.slice(1).split('#')[0] : 'Leçon ' + e.exId.split('#')[0]), h('div', {}, enonce(ex)), h('div', { class: 'small muted' }, 'À revoir le ' + e.due)) : null;
  };
  function reviser(liste, k) {
    racine.replaceChildren();
    if (k >= liste.length) { racine.append(h('div', { class: 'card center' }, h('h2', {}, 'Révision terminée 🎉'), h('a', { class: 'btn primary', href: '#/erreurs' }, 'Retour au carnet'))); renderHeader(); return; }
    const e = liste[k], ex = getExercise(e.exId);
    if (!ex) { S.erreurs = S.erreurs.filter(x => x !== e); save(); reviser(liste, k + 1); return; }
    mountExercise(racine, ex, e.exId, {
      mode: 'review', num: [k + 1, liste.length],
      onDone(res, carte, z) {
        award(e.exId, ex, res.score, carte, 'review');
        z.append(h('button', { type: 'button', class: 'btn primary mt', onclick: () => reviser(liste, k + 1) }, k + 1 < liste.length ? 'Suivant →' : 'Terminer'));
      }
    });
  }
  racine.append(
    h('div', { class: 'card' }, h('p', {}, 'Chaque erreur revient après 1, puis 3, puis 7 jours, jusqu\'à ce que tu la réussisses deux fois (+15 XP à la correction).'),
      dues.length ? h('button', { type: 'button', class: 'btn primary', onclick: () => reviser(dues.slice(), 0) }, '🩹 Réviser maintenant (' + dues.length + ')') : h('p', { class: 'muted' }, 'Rien à revoir aujourd\'hui. Bravo !')),
    h('h2', {}, 'À revoir aujourd\'hui (' + dues.length + ')'), ...dues.map(ligne),
    h('h2', {}, 'Plus tard (' + autres.length + ')'), ...autres.map(ligne));
  setView('Carnet d\'erreurs', h('h1', {}, 'Carnet d\'erreurs'), racine);
}


/* ===================== 6. JEUX ===================== */
// Chaque jeu est un objet { init(g), render(g), handleInput(g, action), end(g) }.
// g = contexte de partie : g.root, g.score, g.erreurs, minuteurs nettoyés à la sortie de l'écran.
const lienLecon = (ref) => '#/module/' + ref.split('.')[0] + '/lesson/' + ref.split('.')[1];

function makeCtx(meta, root) {
  const nettoyage = [];
  const g = { meta, root, score: 0, max: 0, erreurs: [] };
  g.apres = (fn, ms) => { const t = setTimeout(fn, ms); nettoyage.push(() => clearTimeout(t)); return t; };
  g.frame = (fn) => {
    let on = true, last = performance.now();
    const boucle = (now) => { if (!on) return; const dt = Math.min(0.1, (now - last) / 1000); last = now; fn(dt); if (on) requestAnimationFrame(boucle); };
    requestAnimationFrame(boucle);
    const stop = () => { on = false; };
    nettoyage.push(stop); return stop;
  };
  g.touches = (fn) => { document.addEventListener('keydown', fn); nettoyage.push(() => document.removeEventListener('keydown', fn)); };
  // Chronomètre avec barre : appelle onFin quand le temps est écoulé.
  g.chrono = (sec, barre, onFin) => {
    let t = sec;
    const stop = g.frame((dt) => { t -= dt; barre.firstChild.style.width = Math.max(0, 100 * t / sec) + '%'; if (t <= 0) { stop(); onFin(); } });
    return { stop, reste: () => Math.max(0, t) };
  };
  g.clear = () => { while (nettoyage.length) nettoyage.pop()(); };
  g.erreur = (e) => g.erreurs.push(e);
  return g;
}
const barreChrono = () => h('div', { class: 'timer', role: 'img', 'aria-label': 'Temps restant' }, h('i'));
const hudJeu = (...p) => h('div', { class: 'hud-g' }, ...p.map(x => h('span', {}, x)));

// --- Salle de jeux ---
function viewGames() {
  const cartes = JEUX_META.map(j => {
    const ok = gameUnlocked(j), rec = S.games[j.id];
    return h('div', { class: 'card gcard' + (ok ? '' : ' locked') },
      h('h3', {}, j.icone + ' ' + j.titre), h('p', { class: 'small' }, j.desc),
      ok ? h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/game/' + j.id }, 'Jouer'), h('span', { class: 'small muted' }, rec ? 'Record : ' + rec.best + ' · ' + rec.plays + ' partie(s)' : 'Jamais joué'))
        : h('p', { class: 'muted' }, '🔒 Débloqué par le Module ' + j.module + ' (contrôle ≥ 70 %)'));
  });
  setView('Salle de jeux', h('h1', {}, 'Salle de jeux'), h('p', { class: 'muted' }, 'Jouer, c\'est réviser : chaque jeu reprend les notions du chapitre qui le débloque.'),
    h('button', { type: 'button', class: 'btn', onclick: startRevision }, '🎲 Mode révision (jeu au hasard)'), h('div', { class: 'grid mt' }, ...cartes));
}
function viewGame(id) {
  const meta = JEUX_META.find(j => j.id === id), impl = JEUX_IMPL[id];
  if (!meta || !impl) { go('#/games'); return; }
  if (!gameUnlocked(meta)) { toast('Jeu verrouillé : réussis le contrôle du chapitre ' + meta.module + '.'); go('#/games'); return; }
  const root = h('div');
  setView(meta.titre, h('div', { class: 'crumb' }, h('a', { href: '#/games' }, 'Salle de jeux'), ' › ' + meta.titre), h('h1', {}, meta.icone + ' ' + meta.titre), root);
  const rec = S.games[id];
  root.append(h('div', { class: 'card' }, h('p', {}, meta.desc), h('p', { class: 'small muted' }, rec ? 'Record : ' + rec.best : 'Premier essai !'),
    h('button', { type: 'button', class: 'btn primary', onclick: () => lancer(id, root) }, '▶ Jouer')));
}
let ctxCourant = null;
function lancer(id, root) {
  if (ctxCourant) ctxCourant.clear();
  const g = makeCtx(JEUX_META.find(j => j.id === id), root);
  ctxCourant = g; onLeave(() => g.clear());
  g.rejouer = () => lancer(id, root);
  JEUX_IMPL[id].init(g); JEUX_IMPL[id].render(g);
}
// Fin de partie : XP = 5 + bonus selon le score (max 50), record, écran de correction.
function finishGame(g, score, max) {
  g.clear();
  const ratio = max > 0 ? Math.max(0, Math.min(1, score / max)) : 0;
  const xp = 5 + Math.round(50 * ratio);
  const prev = S.games[g.meta.id] || { best: 0, plays: 0 };
  const record = score > prev.best;
  S.games[g.meta.id] = { best: Math.max(prev.best, score), plays: prev.plays + 1 };
  S.stats.parties++;
  save(); addXp(xp);
  const corr = g.erreurs.length ? h('ul', {}, ...g.erreurs.map(e => h('li', { style: 'margin:6px 0' },
    h('b', {}, e.q), e.ta ? h('div', { class: 'small' }, '✗ Ta réponse : ' + e.ta) : null, h('div', { class: 'small' }, '✓ Correct : ' + e.bonne),
    e.ref ? h('a', { href: lienLecon(e.ref), class: 'small' }, 'Revoir : Leçon ' + e.ref) : null))) : h('p', {}, '🎉 Aucune erreur : bravo !');
  g.root.replaceChildren(
    h('div', { class: 'card center' }, h('h2', {}, 'Partie terminée'), h('p', { class: 'hand', style: 'font-size:2.4rem' }, score + ' / ' + max),
      record ? h('p', {}, '🏅 Nouveau record !') : h('p', { class: 'muted' }, 'Record : ' + S.games[g.meta.id].best),
      h('p', {}, '+' + xp + ' XP (5 + bonus selon le score)'),
      h('div', { class: 'row', style: 'justify-content:center' }, h('button', { type: 'button', class: 'btn primary', onclick: g.rejouer }, '↻ Rejouer'), h('a', { class: 'btn', href: '#/games' }, 'Salle de jeux'))),
    h('div', { class: 'card' }, h('h2', {}, 'Correction'), corr));
}
const bouton = (txt, fn, cls = 'btn') => h('button', { type: 'button', class: cls, onclick: fn }, txt);

const JEUX_IMPL = {
  /* ---------- 1. Champ lexical Sudoku ---------- */
  "sudoku": {
    init(g) {
      const data = JEUX.sudoku.data, champs = Object.keys(data);
      const sym = shuffle([0, 1, 2, 3]), rp = shuffle([0, 1, 2, 3]), cp = shuffle([0, 1, 2, 3]);
      g.sol = [];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) g.sol.push(sym[(rp[r] + cp[c]) % 4]);
      const mots = champs.map(c => pick(data[c], 4)), util = [0, 0, 0, 0];
      g.cells = g.sol.map(s => ({ champ: s, mot: mots[s][util[s]++] }));
      const dons = new Set(pick([...Array(16).keys()], 6));
      g.given = g.cells.map((c, i) => dons.has(i));
      g.board = g.cells.map((c, i) => (dons.has(i) ? c.mot : null));
      g.tray = shuffle(g.cells.filter((c, i) => !dons.has(i)).map(c => c.mot));
      g.champOf = {}; g.cells.forEach(c => { g.champOf[c.mot] = champs[c.champ]; });
      g.champs = champs; g.mots = mots; g.sel = null; g.essais = 0; g.mauvais = new Set(); g.msg = ''; g.max = 100;
    },
    render(g) {
      const grille = h('div', { class: 'sgrid', role: 'grid', 'aria-label': 'Grille 4 par 4' });
      g.board.forEach((m, i) => {
        const b = h('button', { type: 'button', class: 'cell' + (g.given[i] ? ' given' : '') + (g.mauvais.has(i) ? ' ko' : ''), 'aria-label': 'Ligne ' + (Math.floor(i / 4) + 1) + ' colonne ' + (i % 4 + 1) + (m ? ' : ' + m : ' : vide') }, m || '·');
        b.onclick = () => JEUX_IMPL.sudoku.handleInput(g, { cell: i });
        grille.append(b);
      });
      const plateau = h('div', { class: 'row', style: 'margin:8px 0' }, ...g.tray.map(m => {
        const b = h('button', { type: 'button', class: 'btn' + (g.sel === m ? ' primary' : '') }, m);
        b.onclick = () => JEUX_IMPL.sudoku.handleInput(g, { mot: m });
        return b;
      }));
      g.root.replaceChildren(
        h('div', { class: 'card' }, h('p', {}, 'Règle : chaque ligne et chaque colonne contient un mot de chacun des 4 champs lexicaux : ', h('b', {}, g.champs.join(' · ')), '.'),
          h('p', { class: 'small muted' }, 'Clique un mot, puis une case vide. Clique une case remplie pour reprendre son mot.')),
        grille, h('p', { class: 'small' }, 'Mots à placer :'), plateau,
        h('p', { class: 'fb ' + (g.msg ? 'ko' : ''), 'aria-live': 'polite', hidden: !g.msg }, g.msg),
        h('div', { class: 'row' }, bouton('✔ Vérifier', () => JEUX_IMPL.sudoku.handleInput(g, { verifier: true }), 'btn primary'), bouton('Abandonner', () => JEUX_IMPL.sudoku.end(g, false))));
    },
    handleInput(g, a) {
      if (a.mot !== undefined) g.sel = g.sel === a.mot ? null : a.mot;
      else if (a.cell !== undefined) {
        const i = a.cell;
        if (g.given[i]) return;
        if (g.sel) { if (g.board[i]) g.tray.push(g.board[i]); g.board[i] = g.sel; g.tray = g.tray.filter(m => m !== g.sel); g.sel = null; }
        else if (g.board[i]) { g.tray.push(g.board[i]); g.board[i] = null; }
        g.mauvais = new Set(); g.msg = '';
      } else if (a.verifier) {
        if (g.board.some(m => !m)) { g.msg = 'Remplis toute la grille avant de vérifier.'; }
        else {
          g.mauvais = new Set();
          g.board.forEach((m, i) => g.board.forEach((n, j) => { if (i !== j && g.champOf[m] === g.champOf[n] && (Math.floor(i / 4) === Math.floor(j / 4) || i % 4 === j % 4)) g.mauvais.add(i); }));
          if (!g.mauvais.size) { JEUX_IMPL.sudoku.end(g, true); return; }
          g.essais++; g.msg = '✗ Un champ lexical apparaît deux fois dans une ligne ou une colonne (cases en rouge).';
        }
      }
      JEUX_IMPL.sudoku.render(g);
    },
    end(g, reussi) {
      if (!reussi || g.essais) g.erreur({ q: 'Les mots et leurs champs lexicaux', bonne: g.champs.map((c, k) => c + ' : ' + g.mots[k].join(', ')).join(' — '), ref: '1.1' });
      finishGame(g, reussi ? Math.max(20, 100 - 10 * g.essais) : 0, 100);
    }
  },

  /* ---------- 2. La Chasse aux figures ---------- */
  "chasse-aux-figures": {
    init(g) {
      g.data = JEUX['chasse-aux-figures'].data;
      const figs = [...new Set(g.data.map(d => d.f))];
      g.cibles = pick(figs, Math.min(10, figs.length));
      g.vies = 3; g.manche = 0; g.items = []; g.file = []; g.spawnT = 0; g.fini = false; g.max = 0;
    },
    render(g) {
      g.hud = h('div', { class: 'hud-g', 'aria-live': 'polite' });
      g.banniere = h('div', { class: 'target', 'aria-live': 'polite' });
      g.scene = h('div', { class: 'gstage' });
      g.root.replaceChildren(g.hud, g.banniere, h('p', { class: 'small muted' }, 'Clique les lignes qui contiennent la figure demandée avant qu\'elles ne sortent par le haut. Une mauvaise ligne ou une ligne manquée coûte une vie.'), g.scene);
      JEUX_IMPL['chasse-aux-figures'].manche(g);
      g.frame((dt) => JEUX_IMPL['chasse-aux-figures'].tic(g, dt));
    },
    majHud(g) { g.hud.replaceChildren(h('span', {}, '❤'.repeat(Math.max(0, g.vies)) || '💔'), h('span', {}, 'Score : ' + g.score), h('span', {}, 'Manche ' + g.manche + '/' + g.cibles.length)); },
    manche(g) {
      g.manche++;
      const cible = g.cibles[g.manche - 1];
      const ok = g.data.filter(d => d.f === cible || (d.aussi || []).includes(cible));
      const non = g.data.filter(d => d.f !== cible && !(d.aussi || []).includes(cible));
      const bons = pick(ok, Math.min(2, ok.length));
      g.cible = cible; g.max += bons.length * 10;
      g.file = shuffle([...bons.map(d => ({ d, ok: true })), ...pick(non, 4 - bons.length).map(d => ({ d, ok: false }))]);
      g.spawnT = 99;
      g.banniere.textContent = '🎯 ' + cible.toUpperCase();
      JEUX_IMPL['chasse-aux-figures'].majHud(g);
    },
    tic(g, dt) {
      if (g.fini) return;
      const H = g.scene.clientHeight, vitesse = 50 + 6 * g.manche;
      g.spawnT += dt;
      if (g.file.length && g.spawnT > Math.max(0.9, 1.5 - 0.05 * g.manche)) {
        g.spawnT = 0;
        const it = g.file.shift(), el = h('button', { type: 'button', class: 'btn gline' }, it.d.v);
        it.el = el; it.y = H; el.style.top = '0'; el.style.transform = 'translateY(' + H + 'px)';
        el.onclick = () => JEUX_IMPL['chasse-aux-figures'].handleInput(g, it);
        g.scene.append(el); g.items.push(it);
      }
      for (const it of g.items.slice()) {
        it.y -= vitesse * dt;
        it.el.style.transform = 'translateY(' + it.y + 'px)';
        if (it.y < -50) {
          it.el.remove(); g.items.splice(g.items.indexOf(it), 1);
          if (it.ok) { g.vies--; g.erreur({ q: '« ' + it.d.v + ' »', ta: 'ligne manquée (cible : ' + g.cible + ')', bonne: it.d.f, ref: it.d.ref }); }
        }
      }
      JEUX_IMPL['chasse-aux-figures'].majHud(g);
      if (g.vies <= 0) { JEUX_IMPL['chasse-aux-figures'].end(g); return; }
      if (!g.file.length && !g.items.length) {
        if (g.manche >= g.cibles.length) JEUX_IMPL['chasse-aux-figures'].end(g);
        else if (!g.attente) { g.attente = true; g.apres(() => { g.attente = false; JEUX_IMPL['chasse-aux-figures'].manche(g); }, 700); }
      }
    },
    handleInput(g, it) {
      const i = g.items.indexOf(it);
      if (i < 0 || g.fini) return;
      if (it.ok) { floatText('+10', it.el); }
      g.items.splice(i, 1); it.el.remove();
      if (it.ok) { g.score += 10; S.stats.figures++; }
      else { g.vies--; g.erreur({ q: '« ' + it.d.v + ' »', ta: 'cliquée pour « ' + g.cible + ' »', bonne: it.d.f, ref: it.d.ref }); }
      JEUX_IMPL['chasse-aux-figures'].majHud(g);
    },
    end(g) { g.fini = true; finishGame(g, g.score, Math.max(g.max, 1)); }
  },

  /* ---------- 3. Le Compteur de syllabes ---------- */
  "compteur-de-syllabes": {
    init(g) { g.v = pick(JEUX['compteur-de-syllabes'].data, 8); g.i = 0; g.n = 0; g.rep = false; g.ok = 0; g.max = 80; },
    render(g) {
      const d = g.v[g.i], me = JEUX_IMPL['compteur-de-syllabes'];
      const pts = h('div', { class: 'center', style: 'font-size:1.6rem;min-height:2.2rem', 'aria-live': 'polite' }, '●'.repeat(g.n) || '—');
      const tap = h('button', { type: 'button', class: 'btn primary tap' }, '🥁 Une frappe = une syllabe (' + g.n + ')');
      tap.onclick = () => { g.n++; pts.textContent = '●'.repeat(g.n); tap.textContent = '🥁 Une frappe = une syllabe (' + g.n + ')'; };
      const corps = [h('div', { class: 'progress' }, h('i', { style: 'width:' + 100 * g.i / g.v.length + '%' })),
        h('p', { class: 'small muted' }, 'Vers ' + (g.i + 1) + ' / ' + g.v.length + ' — compte les syllabes (e muet, diérèse…).'),
        h('p', { class: 'hand center', style: 'font-size:1.9rem' }, d.v)];
      if (!g.rep) corps.push(tap, pts, h('div', { class: 'row mt' }, bouton('Effacer', () => me.handleInput(g, { effacer: true })), bouton('✔ Valider', () => me.handleInput(g, { valider: true }), 'btn primary')));
      else {
        const juste = g.n === d.n;
        corps.push(h('div', { class: 'fb ' + (juste ? 'ok' : 'ko') }, h('b', {}, juste ? '✓ Exact : ' + d.n + ' syllabes.' : '✗ Tu as compté ' + g.n + ', il y en a ' + d.n + '.'),
          h('p', {}, d.s.split('/').map((s, k) => h('span', { class: 'syl' }, s))), h('div', { class: 'small' }, 'Rappel : Théorème 4.8 — e muet compté devant une consonne, élidé devant une voyelle et en fin de vers.')),
          bouton(g.i + 1 < g.v.length ? 'Vers suivant →' : 'Terminer', () => me.handleInput(g, { suite: true }), 'btn primary mt'));
      }
      g.root.replaceChildren(...corps);
    },
    handleInput(g, a) {
      const d = g.v[g.i];
      if (a.effacer) g.n = 0;
      else if (a.valider) {
        g.rep = true;
        if (g.n === d.n) { g.ok++; g.score += 10; } else g.erreur({ q: d.v, ta: g.n + ' syllabes', bonne: d.n + ' syllabes : ' + d.s.replace(/\//g, ' / '), ref: d.ref });
      } else if (a.suite) { g.i++; g.n = 0; g.rep = false; if (g.i >= g.v.length) { JEUX_IMPL['compteur-de-syllabes'].end(g); return; } }
      JEUX_IMPL['compteur-de-syllabes'].render(g);
    },
    end(g) { if (g.ok === g.v.length) S.stats.syllabePerfect++; finishGame(g, g.score, g.max); }
  },

  /* ---------- 4. Registre Roulette ---------- */
  "registre-roulette": {
    init(g) { g.v = pick(JEUX['registre-roulette'].data, 8); g.i = 0; g.combo = 0; g.max = 190; g.temps = 12; },
    render(g) {
      const me = JEUX_IMPL['registre-roulette'], d = g.v[g.i];
      const roue = h('div', { class: 'wheel', role: 'img', 'aria-label': 'Roue en rotation' });
      g.root.replaceChildren(h('div', { class: 'progress' }, h('i', { style: 'width:' + 100 * g.i / g.v.length + '%' })), hudJeu('Score : ' + g.score, 'Combo ×' + (1 + 0.5 * Math.min(g.combo, 4))), roue);
      requestAnimationFrame(() => { roue.style.transform = 'rotate(' + (720 + Math.floor(Math.random() * 360)) + 'deg)'; });
      g.apres(() => me.question(g, d), reduit() ? 50 : 1200);
    },
    question(g, d) {
      const me = JEUX_IMPL['registre-roulette'];
      const REG = ['lyrique', 'pathétique', 'tragique', 'comique', 'satirique', 'ironique', 'épique', 'fantastique', 'réaliste'];
      const opts = shuffle([d.r, ...pick(REG.filter(r => r !== d.r), 3)]);
      const barre = barreChrono(), zone = h('div');
      g.root.replaceChildren(hudJeu('Score : ' + g.score, 'Combo ×' + (1 + 0.5 * Math.min(g.combo, 4)), 'Extrait ' + (g.i + 1) + '/' + g.v.length), barre,
        h('div', { class: 'extrait' }, h('div', { class: 'src' }, d.a), h('div', { class: 't', style: 'padding:4px 0' }, d.t)), h('p', { class: 'q' }, 'Quel est le registre dominant ?'), zone);
      let fini = false;
      const rep = (choix) => { if (fini) return; fini = true; ch.stop(); me.handleInput(g, { choix, d }); };
      opts.forEach(o => zone.append(h('button', { type: 'button', class: 'opt', onclick: () => rep(o) }, o)));
      const ch = g.chrono(g.temps, barre, () => rep(null));
    },
    handleInput(g, a) {
      const d = a.d, ok = a.choix === d.r;
      const pts = Math.round(10 * (1 + 0.5 * Math.min(g.combo, 4)));
      if (ok) { g.score += pts; g.combo++; } else { g.combo = 0; g.erreur({ q: '« ' + d.t.slice(0, 90) + (d.t.length > 90 ? '…' : '') + ' » (' + d.a + ')', ta: a.choix || 'temps écoulé', bonne: d.r, ref: d.ref }); }
      g.root.replaceChildren(h('div', { class: 'fb ' + (ok ? 'ok' : 'ko') }, h('b', {}, ok ? '✓ Bien vu ! +' + pts : '✗ C\'était : ' + d.r + (a.choix ? '' : ' (temps écoulé)')),
        h('div', { class: 'small' }, 'Revoir : Leçon ' + d.ref)), bouton(g.i + 1 < g.v.length ? 'Extrait suivant →' : 'Terminer', () => { g.i++; if (g.i >= g.v.length) JEUX_IMPL['registre-roulette'].end(g); else JEUX_IMPL['registre-roulette'].render(g); }, 'btn primary mt'));
    },
    end(g) { finishGame(g, g.score, g.max); }
  },

  /* ---------- 5. Formule Express ---------- */
  "formule-express": {
    init(g) { g.v = pick(JEUX['formule-express'].data, 8); g.i = 0; g.max = 240; },
    render(g) {
      const me = JEUX_IMPL['formule-express'], d = g.v[g.i];
      g.cartes = shuffle([{ k: 'P', t: d.P }, { k: 'C', t: d.C }, { k: 'E', t: d.E }, { k: 'I', t: d.I }, { k: 'T', t: d.piege }]);
      g.slots = [null, null, null, null]; g.piege = false; g.valide = false;
      g.barre = barreChrono(); g.zone = h('div');
      g.root.replaceChildren(hudJeu('Score : ' + g.score, 'Analyse ' + (g.i + 1) + '/' + g.v.length), g.barre, h('p', {}, h('b', {}, d.src), ' — Reconstitue l\'analyse. ', h('span', { class: 'small muted' }, 'Une carte est un piège (paraphrase).')), g.zone);
      me.dessiner(g);
      g.ch = g.chrono(30, g.barre, () => me.valider(g));
    },
    dessiner(g) {
      const noms = ['Procédé', 'Citation', 'Effet', 'Interprétation'], me = JEUX_IMPL['formule-express'];
      const slots = h('div', {}, ...g.slots.map((c, i) => h('button', { type: 'button', class: 'opt' + (c ? ' on' : ''), disabled: g.valide, onclick: () => { if (c) { g.cartes.push(c); g.slots[i] = null; me.dessiner(g); } } },
        h('b', {}, (i + 1) + '. ' + noms[i] + ' : '), c ? c.t : '…')));
      const cartes = h('div', {}, ...g.cartes.map(c => h('button', { type: 'button', class: 'opt', disabled: g.valide, onclick: () => me.handleInput(g, c) }, c.t)));
      g.zone.replaceChildren(slots, h('p', { class: 'small muted mt' }, 'Cartes :'), cartes);
    },
    handleInput(g, c) {
      const me = JEUX_IMPL['formule-express'];
      g.cartes = g.cartes.filter(x => x !== c);
      if (c.k === 'T') { g.piege = true; toast('✗ Piège : c\'est une paraphrase ! −5'); }
      else { g.slots[g.slots.indexOf(null)] = c; }
      me.dessiner(g);
      if (!g.slots.includes(null)) me.valider(g);
    },
    valider(g) {
      if (g.valide) return;
      g.valide = true; g.ch.stop();
      const d = g.v[g.i], noms = ['Procédé', 'Citation', 'Effet', 'Interprétation'], cles = ['P', 'C', 'E', 'I'];
      let bons = 0;
      g.slots.forEach((c, i) => {
        if (c && c.k === cles[i]) bons++;
        else g.erreur({ q: noms[i] + ' attendu (' + d.src + ')', ta: c ? '« ' + c.t + ' »' : 'case vide', bonne: d[cles[i]], ref: '5.1' });
      });
      if (g.piege) g.erreur({ q: 'Carte piège (' + d.src + ')', ta: 'paraphrase placée dans l\'analyse', bonne: 'Une phrase sans procédé vaut 0 : « ' + d.piege + ' »', ref: '5.3' });
      const bonus = bons === 4 ? Math.round(10 * g.ch.reste() / 30) : 0;
      const pts = Math.max(0, bons * 5 + bonus - (g.piege ? 5 : 0));
      g.score += pts;
      if (bons === 4 && !g.piege) { S.stats.pceiSerie++; S.stats.pceiBest = Math.max(S.stats.pceiBest, S.stats.pceiSerie); } else S.stats.pceiSerie = 0;
      const me = JEUX_IMPL['formule-express'];
      me.dessiner(g);
      g.zone.append(h('div', { class: 'fb ' + (bons === 4 ? 'ok' : 'ko') }, h('b', {}, bons + '/4 bien placés · +' + pts + ' points'), bons < 4 ? h('div', { class: 'small' }, 'Ordre correct : ' + cles.map((k, i) => noms[i] + ' → ' + d[k]).join(' | ')) : null),
        bouton(g.i + 1 < g.v.length ? 'Analyse suivante →' : 'Terminer', () => { g.i++; if (g.i >= g.v.length) me.end(g); else me.render(g); }, 'btn primary mt'));
    },
    end(g) { finishGame(g, g.score, g.max); }
  },

  /* ---------- 6. Plan Puzzle ---------- */
  "plan-puzzle": {
    init(g) { g.v = pick(JEUX['plan-puzzle'].data, 2); g.i = 0; g.max = 180; g.parfait = false; },
    render(g) {
      const me = JEUX_IMPL['plan-puzzle'], p = g.v[g.i];
      g.cartes = shuffle(p.cartes.map(([t, c]) => ({ t, c, rep: null }))); g.valide = false;
      g.zone = h('div');
      g.root.replaceChildren(hudJeu('Score : ' + g.score, 'Problématique ' + (g.i + 1) + '/' + g.v.length),
        h('div', { class: 'box for' }, h('div', { class: 'bt' }, 'Problématique'), h('p', {}, p.pb)),
        h('p', { class: 'small muted' }, 'Classe chaque carte : Axe I (le plus visible), Axe II (le plus profond) ou Hors sujet (procédé, vers, paraphrase : jamais un axe valide).'), g.zone);
      me.dessiner(g);
    },
    dessiner(g) {
      const me = JEUX_IMPL['plan-puzzle'], noms = { I: 'Axe I', II: 'Axe II', X: 'Hors sujet' };
      g.zone.replaceChildren(...g.cartes.map(c => h('div', { class: 'card' + (g.valide ? (c.rep === c.c ? ' ok' : ' ko') : ''), style: 'padding:8px 12px' },
        h('div', {}, h('b', {}, c.t), g.valide ? (c.rep === c.c ? '  ✓' : '  ✗ → ' + noms[c.c]) : ''),
        h('div', { class: 'row', role: 'group', 'aria-label': 'Classer « ' + c.t + ' »' }, ...['I', 'II', 'X'].map(k => h('button', { type: 'button', class: 'btn' + (c.rep === k ? ' primary' : ''), disabled: g.valide, 'aria-pressed': String(c.rep === k), onclick: () => { c.rep = k; me.dessiner(g); } }, noms[k]))))),
        g.valide ? null : h('button', { type: 'button', class: 'btn primary', disabled: g.cartes.some(c => !c.rep), onclick: () => me.handleInput(g, { valider: true }) }, '✔ Valider le plan'));
    },
    handleInput(g, a) {
      const me = JEUX_IMPL['plan-puzzle'], noms = { I: 'Axe I', II: 'Axe II', X: 'Hors sujet' };
      if (!a.valider) return;
      g.valide = true;
      const bons = g.cartes.filter(c => c.rep === c.c).length;
      g.score += bons * 10;
      if (bons === 9) { S.stats.planParfait++; }
      g.cartes.filter(c => c.rep !== c.c).forEach(c => g.erreur({ q: '« ' + c.t + ' »', ta: noms[c.rep], bonne: noms[c.c] + (c.c === 'X' ? ' (un axe est une idée, pas un procédé ni des vers)' : ''), ref: '6.2' }));
      me.dessiner(g);
      g.zone.append(h('div', { class: 'fb ' + (bons === 9 ? 'ok' : 'ko') }, h('b', {}, bons + '/9 bien classées')),
        bouton(g.i + 1 < g.v.length ? 'Plan suivant →' : 'Terminer', () => { g.i++; if (g.i >= g.v.length) me.end(g); else me.render(g); }, 'btn primary mt'));
    },
    end(g) { finishGame(g, g.score, g.max); }
  },

  /* ---------- 7. Intro Builder ---------- */
  "intro-builder": {
    init(g) { g.v = pick(JEUX['intro-builder'].data.intros, 3); g.i = 0; g.max = 210; g.etapes = JEUX['intro-builder'].data.etapes; },
    render(g) {
      const me = JEUX_IMPL['intro-builder'], it = g.v[g.i];
      g.frags = shuffle([...it.f.map((t, k) => ({ t, k })), ...pick(JEUX['intro-builder'].data.leurres, 3).map(t => ({ t, k: -1 }))]);
      g.choisis = []; g.valide = false; g.t0 = Date.now(); g.zone = h('div');
      g.root.replaceChildren(hudJeu('Score : ' + g.score, 'Introduction ' + (g.i + 1) + '/' + g.v.length), h('p', {}, 'Texte : ', h('b', {}, it.titre), '. Assemble l\'introduction en 5 étapes, dans l\'ordre ; 3 fragments sont des intrus.'), g.zone);
      me.dessiner(g);
    },
    dessiner(g) {
      const me = JEUX_IMPL['intro-builder'];
      const construit = h('div', { class: 'chosen' }, ...g.choisis.map((f, p) => h('button', { type: 'button', class: 'opt on', disabled: g.valide, onclick: () => { g.choisis.splice(p, 1); me.dessiner(g); } }, h('span', { class: 'num' }, String(p + 1)), f.t)));
      if (!g.choisis.length) construit.append(h('span', { class: 'muted small' }, 'Clique les fragments dans l\'ordre (clique un fragment placé pour le retirer).'));
      const reste = g.frags.filter(f => !g.choisis.includes(f));
      g.zone.replaceChildren(construit, ...reste.map(f => h('button', { type: 'button', class: 'opt frag', disabled: g.valide || g.choisis.length >= 5, onclick: () => { g.choisis.push(f); me.dessiner(g); } }, f.t)),
        g.valide ? null : h('button', { type: 'button', class: 'btn primary mt', disabled: g.choisis.length < 5, onclick: () => me.handleInput(g, { valider: true }) }, '✔ Valider mon introduction'));
    },
    handleInput(g, a) {
      const me = JEUX_IMPL['intro-builder'];
      if (!a.valider) return;
      g.valide = true;
      const bons = g.choisis.filter((f, p) => f.k === p).length, sec = (Date.now() - g.t0) / 1000;
      const bonus = bons === 5 ? Math.max(0, Math.round(20 * (1 - Math.min(sec, 90) / 90))) : 0;
      g.score += bons * 10 + bonus;
      const it = g.v[g.i];
      g.choisis.forEach((f, p) => { if (f.k !== p) g.erreur({ q: 'Étape ' + (p + 1) + ' : ' + g.etapes[p] + ' (' + it.titre + ')', ta: '« ' + f.t + ' »' + (f.k < 0 ? ' (intrus)' : ' (étape ' + g.etapes[f.k] + ')'), bonne: '« ' + it.f[p] + ' »', ref: '7.1' }); });
      me.dessiner(g);
      g.zone.append(h('div', { class: 'fb ' + (bons === 5 ? 'ok' : 'ko') }, h('b', {}, bons + '/5 étapes justes · +' + (bons * 10 + bonus)), bons < 5 ? h('ol', {}, ...it.f.map((t, k) => h('li', {}, h('b', {}, g.etapes[k] + ' : '), t))) : h('div', { class: 'small' }, 'Bonus de rapidité : +' + bonus)),
        bouton(g.i + 1 < g.v.length ? 'Introduction suivante →' : 'Terminer', () => { g.i++; if (g.i >= g.v.length) me.end(g); else me.render(g); }, 'btn primary mt'));
    },
    end(g) { finishGame(g, g.score, g.max); }
  },

  /* ---------- 8. Boss final : le Bac blanc ---------- */
  "boss-bac-blanc": {
    init(g) { g.v = pick(JEUX['boss-bac-blanc'].data, 10); g.i = 0; g.hp = 100; g.bons = 0; g.max = 200; g.temps = 20; },
    render(g) {
      const me = JEUX_IMPL['boss-bac-blanc'], d = g.v[g.i];
      const barre = barreChrono(), zone = h('div');
      const opts = shuffle(d.o.map((t, k) => ({ t, k })));
      g.root.replaceChildren(h('div', { class: 'boss', 'aria-hidden': 'true' }, g.hp <= 0 ? '💀' : '👹'),
        h('div', { class: 'hp', role: 'progressbar', 'aria-label': 'Points de vie du boss', 'aria-valuenow': Math.max(0, g.hp) }, h('i', { style: 'width:' + Math.max(0, g.hp) + '%' })),
        hudJeu('Score : ' + g.score, 'Question ' + (g.i + 1) + '/' + g.v.length), barre, h('p', { class: 'q' }, d.q), zone);
      let fini = false;
      const rep = (k) => { if (fini) return; fini = true; ch.stop(); me.handleInput(g, { k, reste: ch.reste() }); };
      opts.forEach(o => zone.append(h('button', { type: 'button', class: 'opt', onclick: () => rep(o.k) }, o.t)));
      const ch = g.chrono(g.temps, barre, () => rep(-1));
    },
    handleInput(g, a) {
      const d = g.v[g.i], ok = a.k === d.a;
      if (ok) { g.bons++; g.hp -= 15; g.score += 10 + Math.round(a.reste / 2); }
      else g.erreur({ q: d.q, ta: a.k < 0 ? 'temps écoulé' : d.o[a.k], bonne: d.o[d.a], ref: d.ref });
      g.root.replaceChildren(h('div', { class: 'boss', 'aria-hidden': 'true' }, ok ? '💥' : '😈'),
        h('div', { class: 'hp' }, h('i', { style: 'width:' + Math.max(0, g.hp) + '%' })),
        h('div', { class: 'fb ' + (ok ? 'ok' : 'ko') }, h('b', {}, ok ? '✓ Touché ! Le boss perd 15 PV.' : '✗ Raté. Bonne réponse : ' + d.o[d.a]), h('div', { class: 'small' }, 'Revoir : Leçon ' + d.ref)),
        bouton(g.i + 1 < g.v.length ? 'Question suivante →' : 'Terminer', () => { g.i++; if (g.i >= g.v.length) JEUX_IMPL['boss-bac-blanc'].end(g); else JEUX_IMPL['boss-bac-blanc'].render(g); }, 'btn primary mt'));
    },
    end(g) {
      if (g.hp <= 0) { S.stats.boss++; confetti(); toast('🏆 Boss vaincu !'); } else toast('Le boss résiste… il lui reste ' + g.hp + ' PV.');
      finishGame(g, g.score, g.max);
    }
  },

  /* ---------- 9. Thèse ou Antithèse ? ---------- */
  "these-ou-antithese": {
    init(g) { g.v = pick(JEUX['these-ou-antithese'].data, 2); g.i = 0; g.k = 0; g.phase = 'args'; g.max = 220; g.ordre = null; },
    render(g) {
      const me = JEUX_IMPL['these-ou-antithese'], s = g.v[g.i];
      if (!g.ordre) g.ordre = shuffle(s.args);
      const tete = [hudJeu('Score : ' + g.score, 'Sujet ' + (g.i + 1) + '/' + g.v.length), h('div', { class: 'box for' }, h('div', { class: 'bt' }, 'Sujet de dissertation'), h('p', { class: 'formula' }, s.s))];
      if (g.phase === 'args') {
        const [t] = g.ordre[g.k];
        g.root.replaceChildren(...tete, h('p', { class: 'small muted' }, 'Argument ' + (g.k + 1) + '/' + g.ordre.length + ' — raccourcis : ← Thèse · → Antithèse · ↓ Hors sujet'),
          h('div', { class: 'flycard', 'aria-live': 'polite' }, t),
          h('div', { class: 'row' }, bouton('← Thèse', () => me.handleInput(g, 'T'), 'btn primary'), bouton('Antithèse →', () => me.handleInput(g, 'A'), 'btn primary'), bouton('↓ Hors sujet', () => me.handleInput(g, 'X'))));
      } else {
        const opts = shuffle(s.dep.map((t, k) => ({ t, k })));
        g.root.replaceChildren(...tete, h('h3', {}, '⭐ Manche bonus : le dépassement'), h('p', {}, 'Dans un plan dialectique, la partie III est une idée nouvelle, jamais « un peu des deux ». Choisis le meilleur dépassement.'),
          ...opts.map(o => h('button', { type: 'button', class: 'opt', onclick: () => me.handleInput(g, { dep: o.k }) }, o.t)));
      }
    },
    handleInput(g, a) {
      const me = JEUX_IMPL['these-ou-antithese'], s = g.v[g.i], noms = { T: 'Thèse', A: 'Antithèse', X: 'Hors sujet' };
      if (g.phase === 'args') {
        const [t, bon] = g.ordre[g.k];
        if (a === bon) { g.score += 10; toast('✓ ' + noms[bon]); }
        else g.erreur({ q: '« ' + t + ' » (sujet : ' + s.s + ')', ta: noms[a], bonne: noms[bon], ref: '9.2' });
        g.k++;
        if (g.k >= g.ordre.length) g.phase = 'bonus';
        me.render(g);
      } else {
        if (a.dep === 0) { g.score += 30; toast('✓ Dépassement : une idée nouvelle'); }
        else g.erreur({ q: 'Dépassement pour : ' + s.s, ta: s.dep[a.dep], bonne: s.dep[0] + ' (le III est une idée nouvelle, jamais « un peu des deux »)', ref: '9.2' });
        g.i++; g.k = 0; g.phase = 'args'; g.ordre = null;
        if (g.i >= g.v.length) me.end(g); else me.render(g);
      }
    },
    end(g) { finishGame(g, g.score, g.max); }
  }
};
// Raccourcis clavier (flèches) pour « Thèse ou Antithèse ? », actifs seulement pendant la partie.
const initOrigine = JEUX_IMPL['these-ou-antithese'].init;
JEUX_IMPL['these-ou-antithese'].init = function (g) {
  initOrigine(g);
  g.touches((e) => {
    if (g.phase !== 'args' || !g.ordre) return;
    const m = { ArrowLeft: 'T', ArrowRight: 'A', ArrowDown: 'X' }[e.key];
    if (m) { e.preventDefault(); JEUX_IMPL['these-ou-antithese'].handleInput(g, m); }
  });
};


/* ---------- Pages complémentaires : Formulaire, Mes textes ---------- */
// --- Formulaire : toutes les formules et tous les théorèmes, avec recherche ---
function viewFormulaire() {
  const liste = h('div'), nb = h('p', { class: 'small muted', 'aria-live': 'polite' });
  const champ = h('input', { type: 'text', 'aria-label': 'Rechercher une formule', placeholder: 'Rechercher (ex. problématique, PCEI, alexandrin…)', style: 'width:100%' });
  const dessiner = () => {
    const q = norm(champ.value.trim());
    const res = FORMULES.filter(f => !q || norm(f.titre + ' ' + f.formule + ' ' + f.texte.replace(/<[^>]+>/g, ' ')).includes(q));
    liste.replaceChildren(...res.map(f => h('div', { class: 'box for' },
      h('div', { class: 'bt' }, f.titre), h('div', { class: 'formula' }, f.formule), h('div', { html: f.texte }),
      f.arbre ? h('div', {}, arbreEl('genres'), arbreEl('registres')) : null,
      h('a', { class: 'small', href: '#/module/' + f.lecon[0] + '/lesson/' + f.lecon[1] }, 'Revoir : Leçon ' + f.lecon[0] + '.' + f.lecon[1]))));
    nb.textContent = res.length + ' résultat' + (res.length > 1 ? 's' : '') + ' sur ' + FORMULES.length;
    if (!res.length) liste.append(h('p', { class: 'muted' }, 'Aucune formule ne correspond.'));
  };
  champ.oninput = dessiner;
  setView('Formulaire', h('h1', {}, 'Formulaire'), h('p', { class: 'muted' }, 'Comme au collège en maths : toutes les formules, théorèmes et algorithmes sur une seule page.'), champ, nb, liste,
    h('button', { type: 'button', class: 'btn no-print', onclick: () => window.print() }, '🖨 Imprimer'));
  dessiner();
}

// --- Mes textes : extraits collés par l'élève (stockés uniquement dans le navigateur) ---
function viewMesTextes() {
  const liste = h('div');
  const dessiner = () => {
    liste.replaceChildren(...(S.mesTextes.length ? S.mesTextes.map(t => h('div', { class: 'card' },
      h('h3', {}, t.titre + (t.auteur ? ' — ' + t.auteur : '')), h('p', { class: 'small muted' }, t.texte.length > 160 ? t.texte.slice(0, 160) + '…' : t.texte),
      h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/mes-textes/' + t.id }, 'Pratiquer'),
        h('button', { type: 'button', class: 'btn danger', onclick: () => supprimer(t) }, 'Supprimer')))) : [h('p', { class: 'muted' }, 'Aucun texte pour l\'instant.')]));
  };
  const supprimer = (t) => modal(h('div', { class: 'card' }, h('h2', {}, 'Supprimer ce texte ?'), h('p', {}, '« ' + t.titre + ' » sera effacé de ce navigateur.'),
    h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn danger', onclick: () => { S.mesTextes = S.mesTextes.filter(x => x.id !== t.id); save(); closeModal(); dessiner(); } }, 'Supprimer'), h('button', { type: 'button', class: 'btn', onclick: closeModal }, 'Annuler'))));
  const titre = h('input', { type: 'text', 'aria-label': 'Titre', placeholder: 'Titre (ex. Art, scène 1)', maxlength: 120, style: 'width:100%' });
  const auteur = h('input', { type: 'text', 'aria-label': 'Auteur', placeholder: 'Auteur (ex. Yasmina Reza)', maxlength: 120, style: 'width:100%' });
  const texte = h('textarea', { 'aria-label': 'Texte', placeholder: 'Colle ici un court extrait de ton propre exemplaire (quelques lignes).', maxlength: 4000 });
  const msg = h('p', { class: 'small', 'aria-live': 'polite' });
  const form = h('form', { class: 'card' }, h('h2', {}, 'Ajouter un texte'),
    h('p', { class: 'small muted' }, '🔒 Ton texte reste uniquement dans ce navigateur (localStorage) : il n\'est jamais envoyé ni intégré au code. Colle seulement un court extrait de ton exemplaire.'),
    h('label', {}, 'Titre', titre), h('label', {}, 'Auteur', auteur), h('label', {}, 'Texte (4 000 caractères maximum)', texte), msg,
    h('button', { type: 'submit', class: 'btn primary mt' }, 'Enregistrer'));
  form.onsubmit = (e) => {
    e.preventDefault();
    if (!titre.value.trim() || !texte.value.trim()) { msg.textContent = '✗ Le titre et le texte sont obligatoires.'; return; }
    S.mesTextes.push({ id: 't' + Date.now().toString(36), titre: titre.value.trim(), auteur: auteur.value.trim(), texte: texte.value.replace(/\r/g, '').trim() });
    save(); titre.value = auteur.value = texte.value = ''; msg.textContent = '✓ Texte enregistré.'; toast('Texte ajouté à « Mes textes ».'); dessiner();
  };
  setView('Mes textes', h('h1', {}, 'Mes textes'),
    h('p', {}, 'Pour les œuvres de ta classe encore protégées (comme « Art » de Yasmina Reza), colle ici un extrait de ton livre : l\'application ne le contient pas, mais tu peux t\'entraîner dessus avec tous les outils du cours.'),
    liste, form);
  dessiner();
}

// Exercice libre sur un texte de l'élève : surligner, PCEI, problématique, plan.
const RE_PROCEDE = /comparaison|métaphore|personnification|allégorie|antith[eè]se|oxymore|chiasme|hyperbole|gradation|accumulation|anaphore|litote|euph[eé]misme|allitération|assonance|champ lexical|imparfait|passé simple|présent|futur|ponctuation|exclamati|interrogati|ironie|antiphrase|rythme|focalisation|énonciation|registre/i;
function listeChecks(items) {
  return h('ul', { 'aria-live': 'polite' }, ...items.map(([ok, txt]) => h('li', { style: 'color:' + (ok ? 'var(--ok)' : 'var(--ko)') }, (ok ? '✓ ' : '✗ ') + txt)));
}
function viewMesTexteExo(id) {
  const t = S.mesTextes.find(x => x.id === id);
  if (!t) { go('#/mes-textes'); return; }
  const corps = h('div'), onglets = h('div', { class: 'row', role: 'tablist' });
  const annotations = [];
  const ONGLETS = [['Surligner', surligner], ['Analyse PCEI', analyse], ['Problématique', problematique], ['Plan', plan]];
  function ouvrir(k) {
    $$('button', onglets).forEach((b, i) => { b.classList.toggle('primary', i === k); b.setAttribute('aria-selected', String(i === k)); });
    corps.replaceChildren(); ONGLETS[k][1]();
    markActive();
  }
  function surligner() {
    const sel = new Set(), liste = h('ul');
    const el = extraitEl(id, { clic(i, b) { if (sel.has(i)) sel.delete(i); else sel.add(i); b.classList.toggle('sel', sel.has(i)); b.setAttribute('aria-pressed', String(sel.has(i))); } });
    const choix = h('select', { 'aria-label': 'Procédé' }, ...['champ lexical', 'comparaison', 'métaphore', 'personnification', 'antithèse', 'hyperbole', 'anaphore', 'accumulation', 'allitération / assonance', 'temps verbal', 'ponctuation expressive', 'autre'].map(o => h('option', {}, o)));
    const maj = () => liste.replaceChildren(...annotations.map((a, k) => h('li', {}, h('b', {}, a.procede), ' : « ' + a.mots + ' » ', h('button', { type: 'button', class: 'btn icon', 'aria-label': 'Retirer ce relevé', onclick: () => { annotations.splice(k, 1); maj(); } }, '✕'))));
    corps.append(h('p', { class: 'muted' }, 'Clique les mots d\'un procédé, choisis son nom, puis étiquette-le. Pour chaque relevé, demande-toi : quel effet ? quelle interprétation ?'), el,
      h('div', { class: 'row' }, choix, h('button', { type: 'button', class: 'btn primary', onclick: () => {
        const mots = [...sel].sort((a, b) => a - b).map(i => el.boutons[i].textContent).join(' ');
        if (!mots) { toast('Sélectionne d\'abord des mots.'); return; }
        annotations.push({ procede: choix.value, mots }); sel.clear(); el.boutons.forEach(b => b && (b.classList.remove('sel'), b.setAttribute('aria-pressed', 'false'))); maj();
      } }, 'Étiqueter la sélection')), h('h3', {}, 'Mes relevés'), liste);
    maj();
  }
  function analyse() {
    const champs = ['Procédé', 'Citation (copie-la du texte)', 'Effet', 'Interprétation'].map(l => h('textarea', { 'aria-label': l, placeholder: l, style: 'min-height:60px' }));
    const res = h('div');
    corps.append(h('p', { class: 'muted' }, 'Analyse = Procédé + Citation + Effet + Interprétation (Axiome 1).'), extraitEl(id), ...champs,
      h('button', { type: 'button', class: 'btn primary mt', onclick: () => {
        const [p, c, e, i] = champs.map(x => x.value.trim());
        const norme = (s) => norm(s).replace(/[«»"'’\s]+/g, ' ').trim();
        const cite = c.replace(/[«»"]/g, '').trim();
        const pts = [[RE_PROCEDE.test(p), 'Procédé nommé (comparaison, anaphore, champ lexical…)'], [cite.length > 3 && norme(t.texte).includes(norme(cite)), 'Citation exacte, retrouvée dans ton texte'], [e.split(/\s+/).filter(Boolean).length >= 4, 'Effet développé (au moins 4 mots)'], [/montre|révèle|suggère|dénonce|symbolise|exprime|traduit|évoque|met en valeur/i.test(i) || i.split(/\s+/).filter(Boolean).length >= 8, 'Interprétation : ce que le texte révèle']];
        const n = pts.filter(x => x[0]).length;
        res.replaceChildren(h('b', {}, 'Note : ' + (pts[0][0] ? n : 0) + ' / 4'), listeChecks(pts), !pts[0][0] ? h('p', { class: 'fb ko' }, 'Théorème de non-paraphrase : Procédé = 0 ⇒ l\'analyse entière vaut 0.') : null);
      } }, 'Vérifier'), res);
  }
  function problematique() {
    const ta = h('textarea', { 'aria-label': 'Ta problématique', placeholder: 'Comment … ?' }), res = h('div');
    corps.append(h('p', { class: 'muted' }, 'Problématique = Comment + auteur + procédés dominants + effet/visée (Théorème 4.3).'), ta,
      h('button', { type: 'button', class: 'btn primary mt', onclick: () => {
        const v = ta.value.trim(), nom = (t.auteur || '').split(' ').pop().toLowerCase();
        res.replaceChildren(listeChecks([[/^\s*(comment|en quoi)/i.test(v), 'Commence par « Comment » ou « En quoi »'], [/\?\s*$/.test(v), 'Se termine par un point d\'interrogation'], [!!nom && v.toLowerCase().includes(nom) || v.toLowerCase().includes(t.titre.toLowerCase().slice(0, 12)), 'Cite l\'auteur ou le texte'], [RE_PROCEDE.test(v), 'Nomme un procédé dominant'], [/dénonce|exprime|montre|révèle|suggère|traduit|fait|suscite/i.test(v), 'Exprime un effet ou une visée']]));
      } }, 'Vérifier'), res);
  }
  function plan() {
    const axes = ['I', 'II', 'III (facultatif)'].map(l => h('input', { type: 'text', 'aria-label': 'Axe ' + l, placeholder: 'Axe ' + l + ' : une idée, pas un procédé', style: 'width:100%;margin:4px 0' })), res = h('div');
    corps.append(h('p', { class: 'muted' }, 'Un axe est une idée (une interprétation), jamais un procédé ni un numéro de vers (Théorème 4.4).'), ...axes,
      h('button', { type: 'button', class: 'btn primary mt', onclick: () => {
        const v = axes.map(a => a.value.trim()).filter(Boolean);
        const invalide = (a) => RE_PROCEDE.test(a) || /\bvers\b|strophe|\bv\.\s*\d|\d/i.test(a);
        res.replaceChildren(listeChecks([[v.length >= 2 && v.length <= 3, '2 ou 3 axes'], ...v.map((a, k) => [!invalide(a), 'Axe ' + (k + 1) + ' : « ' + a + ' » ' + (invalide(a) ? '— contient un procédé ou un numéro de vers : ce n\'est pas une idée' : '— une idée valide')])]), h('p', { class: 'small muted' }, 'Progression attendue : de l\'axe I (sens visible) à l\'axe II (sens plus profond).'));
      } }, 'Vérifier'), res);
  }
  ONGLETS.forEach(([nom], k) => onglets.append(h('button', { type: 'button', class: 'btn', role: 'tab', onclick: () => ouvrir(k) }, nom)));
  setView('Pratiquer', h('div', { class: 'crumb' }, h('a', { href: '#/mes-textes' }, 'Mes textes'), ' › ' + t.titre), h('h1', {}, t.titre + (t.auteur ? ' — ' + t.auteur : '')), onglets, h('div', { class: 'mt' }, corps));
  ouvrir(0);
}


/* ===================== 7. UTILITAIRES ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
// Échappe tout texte saisi par l'utilisateur avant insertion dans du HTML.
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
// Constructeur DOM : h('div', {class:'x', onclick(){}}, enfants…)
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'html') el.innerHTML = v;
    else if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  const add = (c) => {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(add);
    else el.append(c.nodeType ? c : document.createTextNode(String(c)));
  };
  kids.forEach(add);
  return el;
}
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
const pick = (a, n) => shuffle(a).slice(0, n);
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const reduit = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toast(msg) {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  $('#toasts').append(t);
  setTimeout(() => t.remove(), 3600);
}
// Petit « +10 XP » qui flotte près d'un élément (ou en haut de l'écran).
function floatText(txt, anchor) {
  const r = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
  const f = h('div', { class: 'float', 'aria-hidden': 'true' }, txt);
  f.style.left = (r ? r.left + r.width / 2 - 30 : window.innerWidth / 2 - 30) + 'px';
  f.style.top = (r ? Math.max(60, r.top) : 90) + 'px';
  document.body.append(f);
  setTimeout(() => f.remove(), 1200);
}
function confetti() {
  if (reduit()) return;
  const couleurs = ['#e6a23c', '#4c8bf5', '#34a853', '#d93025', '#a142f4'];
  for (let i = 0; i < 46; i++) {
    const c = h('div', { class: 'confetti', 'aria-hidden': 'true' });
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = couleurs[i % couleurs.length];
    c.style.animationDelay = Math.random() * .8 + 's';
    document.body.append(c);
    setTimeout(() => c.remove(), 3400);
  }
}
function modal(node) { const m = $('#modal'); m.replaceChildren(node); m.hidden = false; const b = $('button', m); if (b) b.focus(); }
function closeModal() { const m = $('#modal'); m.hidden = true; m.replaceChildren(); }


/* ===================== 8. DÉMARRAGE ===================== */
function boot() {
  loadState();
  rollDay();
  applyTheme();
  $('#themeBtn').onclick = cycleTheme;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  window.addEventListener('hashchange', route);
  route();
}
boot();

