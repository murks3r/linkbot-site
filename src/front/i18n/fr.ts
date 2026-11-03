/* fr: the front's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';

export const fr: FrontCopy = {
  a: {
    ledger: {
      label: 'Synthétique · valeurs fixes, écrites pour cette page · rien n’est apparié ici',
      space: 'Un espace pour les minéraux industriels',
      need: 'La demande',
      offer: 'L’offre',
      table: 'La paire, critère par critère',
      columns: { criterion: 'Critère', need: 'La demande indique', offer: 'L’offre indique', verdict: 'Verdict' },
      importance: { must: 'Obligatoire', nice_to_have: 'Souhaitable' },
      verdicts: { meets: 'Correspond', partly: 'Correspond en partie', conflicts: 'Contredit', unknown: 'Inconnu' },
      state: 'Chaque critère obligatoire correspond, donc cette paire peut être une correspondance. Les critères souples ne font que s’afficher ; ils ne décident pas.',
      before: 'Avant toute mise en relation',
      stages: [
        {
          name: 'Gate',
          text: 'Un opérateur identifié enregistre comme franchi le contrôle que l’espace exige. Le système ne décide jamais une gate.',
        },
        {
          name: 'Approbation',
          text: 'Un opérateur identifié et actif approuve le dossier. Une approbation seule ne divulgue rien.',
        },
        {
          name: 'Double oui',
          text: 'Chaque côté répond pour lui-même. Avant que les deux aient dit oui, l’autre côté n’apprend rien.',
        },
        {
          name: 'Mise en relation',
          text: 'Le serveur la crée quand la dernière des trois conditions est remplie, dans n’importe quel ordre, et refuse toute autre voie. Chaque côté reçoit un reçu.',
        },
      ],
      notice: 'Une correspondance possible ne divulgue que les verdicts, et un avis fixe selon lequel les personnes décident.',
      legend: 'Carré plein : correspond. Carré partagé : correspond en partie. Carré barré : contredit. Carré en pointillés : inconnu, qui n’est jamais une correspondance.',
    },
  },
  landing: {
    meta: {
      title: 'Linkbot : votre plateforme réunit acheteurs et vendeurs, Linkbot trouve qui correspond',
      description: 'Un widget pour les plateformes qui réunissent acheteurs et vendeurs : il demande à chaque côté ce qu’il cherche, juge chaque critère et attend deux oui.',
    },
    opening: {
      h1: 'Votre plateforme réunit acheteurs et vendeurs. Linkbot trouve qui correspond.',
      sub: 'Son widget demande à chaque côté ce qu’il cherche ; Linkbot montre un verdict pour chaque critère et ne met les deux côtés en relation qu’après le oui des deux.',
      button: 'Voir étape par étape',
    },
    cards: {
      h2: 'Ce qu’il fait pour vous',
      items: [
        { name: 'Demander avec les mots de votre marché', text: 'Chaque côté dit ce qu’il cherche ou propose, en une ligne ou par des questions adaptées à son marché ; rien n’est enregistré avant sa confirmation.', button: 'Voir la demande' },
        { name: 'Nous continuons à chercher', text: 'Si rien ne correspond encore, Linkbot continue à chercher et ne prévient que vous quand quelque chose de nouveau correspond.', small: 'Dans la démo, ses e-mails vont à une boîte de test et n’atteignent personne.', button: 'Voir comment il continue à chercher' },
        { name: 'Mis en relation seulement après deux oui', text: 'Deux côtés ne sont mis en relation qu’après l’accord d’une personne nommée et le oui des deux.', button: 'Voir la mise en relation' },
      ],
    },
    stage: {
      h2: 'Une mise en relation, des deux côtés',
      p: 'Une demande et une offre ne sont mises en relation qu’après l’accord d’une personne nommée et le oui des deux côtés.',
      roles: 'Quel côté montrer',
      buyer: 'Côté acheteur',
      supplier: 'Côté fournisseur',
      label: 'Parcours enregistré · données fictives',
      supplierNote: 'Du côté du fournisseur, seul son oui est enregistré pour l’instant ; le fournisseur décrit son offre dans le même widget.',
      link: 'Parcourir les six étapes',
    },
    sees: {
      h2: 'Qui voit quoi, et quand',
      p: 'Chaque étape ne montre que ce qu’elle permet ; les informations d’une mise en relation ne sortent qu’après le oui des deux côtés.',
      link: 'Qui voit quoi, étape par étape',
    },
    platforms: {
      h2: 'Pour les plateformes',
      p: 'Un script et un élément sur votre page ; les questions s’adaptent à votre marché.',
      snippet: 'L’intégration la plus courte',
      later: 'L’ajouter avec vos propres outils de build',
      button: 'Pour les plateformes',
      developers: 'Pour les développeurs',
    },
    bottom: {
      h2: 'Votre marché n’y est pas encore ? Dites-nous ce que vous réunissez.',
      button: 'Dites-nous ce que vous réunissez',
      prepared: 'L’adresse à laquelle écrire est en préparation ; la page derrière le bouton dit comment vous nous joindrez.',
      line: 'Tout ce qui est montré ici fonctionne avec des données fictives ; contrôlé le {date}.',
      status: 'L’état complet',
    },
    labels: { live: 'Live', soon: 'Bientôt' },
  },
  c: {
    meta: {
      title: 'Linkbot : qui voit quoi, et quand',
      description: 'Une couche d’appariement que toute plateforme peut intégrer, autour d’une question : qui voit quoi, et quand. Une offre synthétique, étape par étape.',
    },
    hero: {
      eyebrow: 'Une couche d’appariement que toute plateforme peut intégrer',
      h1: ['Qui voit quoi,', 'et quand.'],
      lede: 'Un pack donne une étape à chaque critère, et une étape est le point le plus loin qu’une valeur atteint : le tableau, une correspondance possible, la mise en relation, ou seulement l’équipe de la plateforme. Ci-dessous : une offre synthétique, étape par étape, et le reçu qui borne chaque lecture.',
      primary: 'Ce qu’une plateforme obtient',
      secondary: 'Qui voit quoi, en entier',
    },
    stages: {
      label: 'Synthétique · une offre, écrite pour cette page · personne n’est apparié ni mis en relation ici',
      sees: 'Qui le voit',
      shows: 'Ce que cela montre',
      not: 'Pas à cette étape',
      receipt: {
        h3: 'Le reçu',
        lines: [
          'Qui peut voir quels champs, et à partir de quand.',
          'Chaque lecture d’une mise en relation, avec son horodatage.',
          'Les clés de champs et les horodatages, jamais les valeurs.',
          'Ce qui n’est pas dans le reçu n’est jamais révélé plus tard.',
        ],
      },
    },
    why: {
      h2: 'Pourquoi une plateforme peut laisser Linkbot approcher ses utilisateurs',
      items: [
        {
          h3: 'Un espace par marché, sur sa propre instance',
          p: 'Un espace est un marché sur une plateforme, avec sa propre application, sa base de données, ses clés et son journal des suppressions. L’appariement tourne à l’intérieur ; aucune demande, aucune offre et aucune correspondance n’est partagée avec un autre espace.',
        },
        {
          h3: 'Vos pages, vos clés, votre équipe',
          p: 'Le widget tourne dans vos pages sous votre propre avis de données. Votre page porte une Publishable Key qui ne fonctionne que sur vos origines ; la Secret Key reste sur votre serveur ; votre équipe approuve les dossiers dans une console derrière votre propre connexion, et il n’existe pas de connexion Linkbot pour les opérateurs.',
        },
        {
          h3: 'Une personne identifiée, jamais le système',
          p: 'Les gates sont enregistrées par un opérateur identifié, avec une référence et sans données personnelles, et un opérateur identifié approuve. Une approbation seule ne divulgue rien ; chaque écriture nomme qui l’a faite et apparaît dans le journal d’audit.',
        },
        {
          h3: 'Les personnes décident, chacune pour elle-même',
          p: 'Chaque côté répond à une correspondance possible pour son propre côté. Avant que les deux aient dit oui, l’autre côté n’apprend rien, et un non ultérieur révoque un oui. Le serveur crée la mise en relation quand la dernière condition est remplie, et refuse toute autre voie.',
        },
      ],
    },
    deletion: { h2: 'Suppression : ce qui part, et ce qui reste' },
    platforms: {
      h2: 'Pour les plateformes',
      p: 'Un script et un élément mettent un espace sur votre page ; la console de votre équipe tourne sur votre machine ou derrière votre propre connexion ; votre serveur apprend les événements par des webhooks signés, qui sont dans le contrat et ne sont pas encore envoyés par l’espace staging.',
      link: 'Ce qu’une plateforme obtient',
    },
    verticals: {
      h2: 'Pour les secteurs',
      p: 'Un pack décrit un marché : ses critères, options et unités, ses libellés et questions dans les langues de l’espace, ce que chaque critère divulgue à chaque étape, et les gates dont le marché a besoin. Le premier est celui des minéraux industriels.',
      link: 'Ce qu’un pack contient',
    },
    state: {
      h2: 'État actuel',
      p: 'L’offre ci-dessus est un texte fixe, écrit pour cette page dans le vocabulaire d’un pack synthétique ; le produit n’a pas tourné ici. La page de démo parcourt tout le chemin, étape par étape.',
    },
  },
  demo: {
    meta: {
      title: 'Linkbot : tout le parcours, de la demande à la mise en relation',
      description: 'Le parcours d’un acheteur dans Linkbot en six étapes, de la demande au oui des deux côtés et à la mise en relation. Avec des données fictives.',
    },
    hero: {
      eyebrow: 'Démo · données fictives',
      h1: ['De la demande à la mise en relation,', 'en six étapes.'],
      lede: 'Ce qui se passe entre la première ligne d’un acheteur et le moment où deux entreprises sont mises en relation, étape par étape, et qui agit à chaque étape.',
    },
    test: 'Ceci est un espace de test aux données fictives. Chaque demande, offre, entreprise et valeur ici est inventée pour des tests. N’y saisissez rien de réel : aucune entreprise, aucune personne, aucune adresse à vous. Ses e-mails vont dans une boîte de test et n’atteignent personne.',
    steps: {
      h2: 'Le parcours, étape par étape',
      who: 'Qui agit',
      items: [
        { name: 'La demande', who: 'L’acheteur', text: 'L’acheteur décrit le besoin sur la page d’une plateforme, dans le formulaire que génère le pack du marché, ou en une ligne de texte que des règles fixes lisent et transforment en valeurs proposées. Rien n’est présélectionné, et ce que l’acheteur n’a pas indiqué reste inconnu.' },
        { name: 'Les critères, confirmés', who: 'L’acheteur', text: 'L’acheteur contrôle chaque valeur et confirme. C’est seulement alors que quelque chose est enregistré : le serveur contrôle chaque valeur par rapport au pack et nomme chaque champ qui ne convient pas. L’adresse e-mail est confirmée par un lien.' },
        { name: 'Les correspondances possibles', who: 'L’espace', text: 'Le matching compare les critères enregistrés à ceux de l’autre côté, un par un : un verdict par critère, correspond, correspond en partie, contredit ou inconnu, jamais un score. Une correspondance possible ne montre à chaque côté que les verdicts et un avis indiquant que ce sont les personnes qui décident.' },
        { name: 'Les deux disent oui', who: 'L’acheteur et le fournisseur', text: 'Chaque côté répond à la correspondance possible pour lui-même. Avant que les deux aient dit oui, l’autre côté n’apprend rien, et un non ultérieur révoque un oui.' },
        { name: 'L’opérateur approuve', who: 'L’équipe de la plateforme', text: 'Un opérateur nommé enregistre les contrôles que l’espace exige et approuve la paire. Une approbation seule ne révèle rien, et chaque écriture indique qui l’a faite.' },
        { name: 'La mise en relation', who: 'Le serveur', text: 'Quand la dernière des trois conditions est remplie, dans n’importe quel ordre, le serveur crée la mise en relation, et la refuse par toute autre voie. Chaque côté reçoit un reçu indiquant qui peut voir quels champs. En mode direct, celui de cet enregistrement, chaque côté peut ensuite ouvrir les champs que l’autre partage à cette étape. Une plateforme peut choisir à la place le mode opérateur : seule son équipe voit alors les deux côtés, et c’est elle qui les contacte.' },
      ],
    },
    replay: {
      label: 'Parcours enregistré · données fictives',
      lede: 'Des images du widget et de la console de l’opérateur à chaque étape, enregistrées sur un seul ordinateur. Chaque partie, entreprise et valeur qui y figure est fictive.',
      note: 'Enregistré le 25 octobre 2026 sur la scène de démonstration de Linkbot Connect, qui fait tourner le widget et la console de l’opérateur contre une Space API d’exemple sur un seul ordinateur. Rien de ces images n’a atteint un espace ni une personne. L’enregistrement met en relation en mode direct : après l’approbation de l’opérateur, chaque partie peut ouvrir ce que l’autre partage.',
      steps: 'Les six étapes',
      position: 'Étape {n} sur {total}',
      previous: 'Étape précédente',
      next: 'Étape suivante',
      screens: [
        ['Le widget de l’acheteur : le formulaire que génère le pack d’exemple, avec le phosphate naturel choisi et un minimum de P₂O₅ de 30 %. L’importance est marquée comme suggérée, et rien d’autre n’est choisi.'],
        ['Le widget de l’acheteur après la confirmation : la demande est active, avec chaque critère et son importance. Aucune offre à afficher pour l’instant.'],
        ['Le widget de l’acheteur : une offre qui pourrait convenir, avec une coche par critère, la question « Souhaitez-vous une mise en relation ? » et la mention que ce sont les personnes qui décident.'],
        ['Le widget de l’acheteur après le oui : « Votre oui est enregistré. Sample space l’examine d’abord. »', 'Le widget du fournisseur : la même correspondance possible, vue du côté de l’offre comme une demande avec une coche par critère, après le propre oui du fournisseur, avec les mêmes mots.'],
        ['Le dossier dans la console de l’opérateur : le contrôle de chaque partie et le contrôle KYC et sanctions du dossier, enregistrés comme réussis par l’opérateur d’exemple, puis « Approuvé par votre équipe. »'],
        ['Le widget de l’acheteur sous « Mes demandes et offres » : les deux parties ont dit oui, la demande est mise en relation, et un bouton montre ce que l’autre partie partage.', 'Les mises en relation dans la console de l’opérateur : une mise en relation, en mode direct, listée sans coordonnées.'],
      ],
    },
    watch: {
      name: 'Si rien ne convient encore : un suivi',
      who: 'L’acheteur',
      text: 'Après avoir confirmé, l’acheteur peut garder la demande ouverte et la suivre : à quelle fréquence, chaque semaine ou chaque jour ; sur quoi être informé ; et, dans les options d’e-mail, au plus combien par e-mail et aucun e-mail avant un jour choisi. Un suivi n’informe que son titulaire lorsque quelque chose de nouveau convient, et commence une fois l’adresse e-mail confirmée. Il dure 90 jours et peut être mis en pause, repris ou arrêté à tout moment, aussi depuis un lien dans ses e-mails.',
      screens: ['Le widget de l’acheteur après la confirmation, encore sans offre à afficher : un suivi hebdomadaire, sur tout ce qui remplit les critères obligatoires, au plus 5 par e-mail.', 'Le même widget après le lancement du suivi : il attend la confirmation de l’adresse e-mail, au plus 5 par e-mail, jusqu’au 23 janvier 2027. L’enregistrement n’a envoyé aucun e-mail, et l’adresse fictive n’existe pas.'],
    },
    space: {
      h2: 'Le tableau de l’espace de test',
      on: 'Ci-dessous, le widget lui-même, servi par l’espace de test, en mode tableau : les demandes et offres ouvertes que leurs titulaires ont choisi de montrer, rendues moins précises comme le pack le déclare. Répondre à l’une d’elles commence à l’étape 1, de l’autre côté.',
      off: 'Cette page ne montre encore aucun widget : il attend un espace de démonstration aux données synthétiques. D’ici là, le parcours ci-dessus est montré en images.',
      notice: 'Un espace de test aux données fictives : n’y saisissez rien de réel. Ses e-mails n’atteignent personne.',
    },
  },
  stages: [
    {
      key: 'board',
      name: 'Tableau',
      eyes: 3,
      open: 1,
      who: 'Toute personne qui peut voir le tableau',
      rule: 'Seulement les champs à l’étape tableau, simplifiés comme le pack le déclare, et seulement pour les offres dont le propriétaire a donné son accord. Jamais l’auteur.',
      fields: [
        { label: 'Produit', value: 'Phosphate naturel' },
        { label: 'Teneur en P₂O₅', value: '31–32 %' },
        { label: 'Quantité', value: '20 000–25 000 t, par tranche de 5 000 t' },
        { label: 'Conditions de livraison', value: 'CFR, CIF ou FOB' },
        { label: 'Port convenu', value: 'Italie ou Espagne, d’après le pays des ports' },
        { label: 'Période d’expédition', value: 'de janvier à février 2027' },
      ],
      not: ['Cadmium, paiement, conditionnement, pays d’origine et inspection : étape correspondance, pas tableau', 'Qui l’a publié'],
    },
    {
      key: 'match',
      name: 'Correspondance',
      eyes: 2,
      open: 0.75,
      who: 'Les deux côtés d’une correspondance possible',
      rule: 'Les verdicts sur les champs à l’étape correspondance ou plus bas, avec la règle et les valeurs qu’elle cite. Pas de nom, pas de coordonnées, aucun signe de la réponse de l’autre côté.',
      fields: [
        { label: 'Cadmium', value: 'au plus 18 mg/kg par kg de P₂O₅', verdict: 'meets' },
        { label: 'Paiement', value: 'paiement contre documents ; une lettre de crédit avait été demandée', verdict: 'conflicts' },
        { label: 'Conditionnement', value: 'non indiqué dans l’offre', verdict: 'unknown' },
        { label: 'Pays d’origine', value: 'Égypte ; le Maroc ou la Jordanie avait été demandé', verdict: 'conflicts' },
        { label: 'Inspection indépendante', value: 'non indiqué dans l’offre', verdict: 'unknown' },
      ],
      not: ['Le nom affiché et l’adresse e-mail de l’offre', 'La réponse de la demande, jusqu’à ce que les deux aient dit oui'],
    },
    {
      key: 'introduction',
      name: 'Mise en relation',
      eyes: 1,
      open: 0.5,
      who: 'En mode opérateur l’équipe de la plateforme ; en mode direct les deux côtés',
      rule: 'Le nom affiché, l’adresse e-mail confirmée et les critères que le pack garde pour cette étape. Chaque lecture est enregistrée sur le reçu.',
      fields: [
        { label: 'Nom affiché', value: 'celui de l’offre, tel qu’il a été donné' },
        { label: 'Adresse e-mail', value: 'une seule, confirmée par un lien' },
        { label: 'Critères à l’étape mise en relation', value: 'comme le pack le déclare' },
      ],
      not: [
        'Les champs que le pack garde pour l’opérateur',
        'En mode opérateur : quoi que ce soit de l’autre côté ; le reçu de chaque côté dit que les deux ont accepté et que la plateforme les contactera',
      ],
    },
    {
      key: 'operator',
      name: 'Opérateur',
      eyes: 1,
      open: 0.3,
      who: 'Seulement l’équipe de la plateforme',
      rule: 'Les champs que le pack garde pour la plateforme, comme les détails d’identité pour un contrôle de partie. Ils n’atteignent jamais l’autre côté, et chaque accès est enregistré.',
      fields: [
        { label: 'Détails d’identité', value: 'pour le contrôle de partie de l’espace, vus par l’équipe' },
        { label: 'L’enregistrement de la gate', value: 'franchie, échouée ou renvoyée, avec une référence et sans données personnelles' },
      ],
      not: ['Rien de tout cela, pour l’autre côté'],
    },
  ],
};
