/* Les textes du site en français : traduction du catalogue anglais src/i18n/en.ts. */
import type { Catalogue, Section, Status } from './en.ts';
import { statusDate } from './status-date.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('fr');

export const fr: Catalogue = {
  site: {
    name: 'Linkbot',
    claim: 'Une couche d’appariement que toute plateforme peut intégrer.',
    skip: 'Aller au contenu',
    menu: 'Menu',
    toc: 'Sur cette page',
    language: 'Langue',
    nav: { how: 'Comment ça marche', sees: 'Qui voit quoi', platforms: 'Pour les plateformes', verticals: 'Pour les secteurs', integrations: 'Intégrations' },
    footer: {
      product: 'Linkbot',
      legal: 'Informations légales',
      imprint: 'Mentions légales',
      privacy: 'Notice de confidentialité',
      line: 'Ce site ne dépose aucun cookie, ne charge rien de tiers et n’utilise aucune mesure d’audience.',
    },
    status: { now: 'Sur l’espace staging', contract: 'Dans le contrat, pas sur l’espace staging', later: 'Pas construit' },
    synthetic: 'Tout sur ce site décrit le contrat Space API et ce qui tourne sur l’espace staging synthétique de Geoprocure, avec des données synthétiques. Aucune personne réelle et aucune organisation réelle ne l’utilise encore.',
    more: 'En savoir plus',
  },

  home: {
    title: 'Linkbot : les demandes rencontrent les offres, les personnes décident',
    description: 'Couche d’appariement pour toute plateforme : espace par marché, demandes et offres en critères confirmés, mise en relation seulement après un double oui.',
    h1: ['Les demandes rencontrent les offres.', 'Les personnes décident.'],
    lede: 'Linkbot est une couche d’appariement qu’une plateforme intègre dans ses propres pages. Un espace par marché. Des demandes et des offres en critères confirmés. Un verdict par critère, jamais un score. Une mise en relation seulement après un oui des deux côtés.',
    actions: { how: 'Comment ça marche', platforms: 'Pour les plateformes' },
    flow: {
      label: 'D’une demande à une mise en relation',
      steps: [
        { name: 'Décrire', note: 'une demande ou une offre, par formulaire' },
        { name: 'Confirmer', note: 'rien n’est stocké avant' },
        { name: 'Correspondre', note: 'un verdict par critère' },
        { name: 'Approuver', note: 'un opérateur identifié, après les gates' },
        { name: 'Double oui', note: 'chaque côté pour lui-même' },
        { name: 'Mettre en relation', note: 'alors, et seulement alors' },
      ],
    },
    pillars: [
      { title: 'Un espace par marché.', body: 'Un espace est un marché sur une plateforme, avec sa propre instance, sa base de données et ses clés. Un pack lui donne le vocabulaire de son secteur : les critères, les options, les unités, les questions. Le premier espace est celui de Geoprocure, pour les minéraux industriels.' },
      { title: 'Des critères, confirmés.', body: 'Une demande ou une offre est un ensemble de critères, chacun avec sa source et son importance. Rien n’est présélectionné, rien n’est deviné, et ce qui n’est pas indiqué reste inconnu. La personne confirme le formulaire ; c’est seulement alors que quelque chose est stocké.' },
      { title: 'Une mise en relation seulement après un double oui.', body: 'L’appariement compare les critères stockés et affiche un verdict par critère. Une mise en relation exige les gates de l’espace, l’approbation d’un opérateur identifié et un oui des deux côtés. Le serveur la crée à ce moment, et refuse toute autre voie.' },
    ],
    ways: {
      title: 'Quatre façons de dire ce que vous demandez ou offrez',
      lede: `Au ${AS_OF}, le formulaire, le texte, le tableau et les suivis tournent sur l’espace staging. Ses e-mails vont dans une boîte de test et n’atteignent personne.`,
      items: [
        { name: 'Par formulaire', status: 'now' as Status, body: 'Le formulaire vient du pack : les critères obligatoires d’abord, chaque liste avec « Autre / ne figure pas dans la liste », « Je ne sais pas » et « Indifférent ». Le widget l’affiche dans les pages de la plateforme.' },
        { name: 'Avec vos propres mots', status: 'now' as Status, body: 'Une lecture propose des valeurs avec la citation dont chacune vient et demande où elle hésite. Elle n’écrase jamais ce qu’une personne a choisi. Sur l’espace staging, ce sont des règles fixes qui lisent, pas un modèle.' },
        { name: 'Sur le tableau', status: 'now' as Status, body: 'Des demandes et des offres ouvertes, listées seulement quand leur propriétaire l’a choisi, avec les valeurs simplifiées du pack et jamais l’auteur. Répondre à l’une ouvre un brouillon de l’autre côté.' },
        { name: 'Avec un suivi', status: 'now' as Status, body: 'Un suivi garde une demande ou une offre ouverte et n’informe que son propriétaire quand quelque chose de nouveau correspond.' },
      ],
    },
    rules: {
      title: 'Les règles, appliquées par le serveur',
      items: [
        'Ne jamais deviner : chaque valeur stockée porte sa source, et « Autre » n’est jamais rapproché de l’option la plus proche.',
        'Rien n’est présélectionné : le formulaire n’a pas de valeur par défaut, seulement des suggestions indiquées comme telles.',
        'L’inconnu reste inconnu : un critère qu’un côté n’a pas indiqué n’est jamais compté comme une correspondance.',
        'Rien n’est stocké avant qu’une personne confirme.',
        'Une correspondance ne divulgue rien : seulement des verdicts, à l’étape que le pack permet, et un avis indiquant que les personnes décident.',
        'Pas de mise en relation sans les gates, l’approbation d’un opérateur identifié et un oui des deux côtés.',
        'Aucun modèle ne passe outre une condition stricte : Obligatoire et Jamais sont décidés par du code déterministe.',
        'Chaque écriture nomme qui l’a faite et apparaît dans le journal d’audit.',
      ],
      link: 'Comment l’appariement fonctionne, étape par étape',
    },
    platforms: { title: 'Pour les plateformes', body: 'Un script et un élément mettent un espace sur votre page. Votre page porte une Publishable Key qui ne fonctionne que sur vos origines ; la Secret Key reste sur votre serveur. Votre équipe approuve les dossiers dans une console qui tourne sur votre machine ou derrière votre propre connexion.', link: 'Ce qu’une plateforme obtient' },
    verticals: { title: 'Pour les secteurs', body: 'Un pack décrit un marché : ses critères, options et unités, ses libellés et questions dans les langues de l’espace, ce que chaque critère divulgue à chaque étape, et les gates dont le marché a besoin. Le premier est celui des minéraux industriels.', link: 'Ce qu’un pack contient' },
    state: { title: 'État actuel', body: 'Ce site ne montre aucune démo du widget tant qu’il n’existe pas d’espace de démonstration avec des données synthétiques.' },
  },

  how: {
    title: 'Comment Linkbot fonctionne : d’une demande confirmée à une mise en relation',
    description: 'Un espace, un pack, quatre façons de décrire une demande ou une offre, un verdict par critère, une approbation, une mise en relation après un double oui.',
    eyebrow: 'Comment ça marche',
    h1: ['D’une demande confirmée', 'à une mise en relation.'],
    lede: 'Chaque étape ci-dessous figure dans le contrat Space API. Là où l’espace staging ne fait pas encore tourner une étape, la page le dit.',
    toc: [['blocks', 'Trois briques'], ['rule', 'Le oui des deux côtés'], ['path', 'Le parcours en six étapes'], ['space', 'Un espace'], ['pack', 'Un pack'], ['describe', 'Quatre façons de décrire'], ['confirm', 'Confirmer'], ['matching', 'L’appariement'], ['approval', 'Approbation et gates'], ['yes', 'Le double oui'], ['introduction', 'La mise en relation'], ['after', 'Ensuite'], ['sees', 'Qui voit quoi'], ['languages', 'Cinq langues'], ['today', 'Ce qui tourne sur l’espace staging']] as [string, string][],
    blocks: {
      title: 'Trois briques',
      lede: 'Un espace se compose de trois parties. Chacune est un groupe de routes du contrat Space API.',
      items: [
        { name: 'Saisie', text: 'Un acheteur ou un fournisseur décrit un besoin ou une offre, par formulaire ou avec ses propres mots, contrôle chaque valeur et confirme. Rien n’est enregistré avant la confirmation, et le serveur contrôle chaque valeur par rapport au pack de l’espace.' },
        { name: 'Suivi', text: `Un suivi garde ouvert un besoin ou une offre confirmés et prévient seulement son titulaire quand quelque chose de nouveau correspond, par e-mail ou webhook. Le titulaire le met en pause ou y met fin à tout moment, aussi depuis un lien. Au ${AS_OF}, les e-mails de suivi de l’espace staging vont dans une boîte de test et n’atteignent personne, et il n’envoie pas encore de webhooks.` },
        { name: 'Mises en relation', text: 'Une fois que les deux côtés ont dit oui et qu’un opérateur nommé a approuvé, le serveur met les deux côtés en relation et remet à chacun un reçu indiquant qui peut voir quels champs. Ensuite, on demande aux deux côtés le résultat.' },
      ],
    },
    rule: {
      title: 'Aucune mise en relation sans le oui des deux côtés',
      paras: [
        'L’appariement trouve des correspondances possibles ; il ne met personne en relation. Chaque côté répond pour lui-même à une correspondance possible. Avant que les deux aient dit oui, l’autre côté n’apprend rien, et un non ultérieur révoque un oui.',
        'L’espace exige aussi l’approbation d’un opérateur nommé après les contrôles qu’il fixe. Le serveur crée une mise en relation seulement quand les trois conditions sont réunies, dans n’importe quel ordre, et refuse toute autre voie.',
      ],
    },
    path: { title: 'Le parcours en six étapes', lede: 'Les six étapes de la page de démonstration, et qui agit à chacune.', link: 'La page de démonstration' },
    space: {
      title: 'Un espace est un marché sur une plateforme',
      paras: [
        'Chaque espace est sa propre instance : sa propre application, sa base de données, ses clés et son journal des suppressions. L’adresse de l’instance identifie l’espace ; aucun id d’espace n’apparaît dans un chemin.',
        'Un espace est configuré avec un pack et une version de celui-ci, les langues qu’il propose, le mode de ses mises en relation, les gates qu’il exige et les origines sur lesquelles ses pages sont autorisées. La page de la plateforme porte une Publishable Key, qui identifie seulement l’espace et ne fonctionne que sur ces origines. La Secret Key reste sur le serveur de la plateforme et n’apparaît jamais dans une page.',
        'L’appariement tourne à l’intérieur d’un espace. Rien n’en sort : aucune demande, aucune offre et aucune correspondance n’est partagée avec un autre espace.',
        'Le premier espace est celui de Geoprocure, pour les minéraux industriels. Il tourne sur une instance staging synthétique avec des données synthétiques.',
      ],
    },
    pack: {
      title: 'Un pack est le vocabulaire d’un secteur',
      paras: [
        'Un pack liste les critères qu’une demande et une offre peuvent indiquer, chacun avec son contrôle : un choix, plusieurs choix, un nombre avec une unité, un intervalle, une fenêtre de dates, une liste interrogeable comme les ports, ou du texte libre. Là où une quantité dépend d’une base, le pack le dit, et « Je ne sais pas » garde la base inconnue plutôt que d’en choisir une.',
        'Le pack dit quelles réponses spéciales un critère permet : « Autre / ne figure pas dans la liste », qui garde les mots de la personne et n’est jamais rapproché d’une option ; « Je ne sais pas » ; et « Indifférent ». Il porte les libellés, les questions, les synonymes et les avis dans les langues de l’espace.',
        'Il fixe aussi ce que chaque critère divulgue à chaque étape : sur le tableau, dans une correspondance possible, dans une mise en relation, ou seulement à l’équipe de la plateforme ; comment une valeur est simplifiée pour le tableau ; quelles importances un critère permet ; et les gates et les catégories de résultat du marché.',
        'Un espace épingle une version de son pack, et le serveur valide chaque soumission contre cette version. On ne fait jamais confiance au client.',
      ],
    },
    describe: {
      title: 'Quatre façons de dire ce que vous demandez ou offrez',
      lede: `Au ${AS_OF}, le formulaire, le texte, le tableau et les suivis tournent sur l’espace staging. Les webhooks n’y tournent pas encore, et ses e-mails vont dans une boîte de test qui n’atteint personne.`,
      items: [
        { name: 'Par formulaire', status: 'now' as Status, paras: [
          'Le formulaire est généré à partir du pack. Les critères obligatoires viennent d’abord ; le reste se trouve derrière « plus de détails ». Rien n’est présélectionné : ni option, ni unité, ni base, ni type de partie. Chaque liste propose « Autre / ne figure pas dans la liste », « Je ne sais pas » et « Indifférent » là où le pack les permet.',
          'Chaque critère porte une importance. Obligatoire et Jamais sont stricts ; Souhaitable, Acceptable et Plutôt pas sont souples. Le pack peut en suggérer une, marquée « suggérée », et la personne peut la changer sauf si le pack la verrouille. Choisir Jamais demande une confirmation séparée.',
        ] },
        { name: 'Avec vos propres mots', status: 'now' as Status, paras: [
          'Une personne écrit ce qu’elle demande ou offre. Une lecture propose des valeurs pour les mêmes critères, chacune affichée à côté des mots dont elle vient, et demande où elle ne peut pas décider : une unité, une option, un nombre que deux conventions lisent différemment. Une lecture n’écrase jamais ce qu’une personne a choisi ; une différence devient une question.',
          'Sur l’espace staging, des règles fixes lisent le texte, sans modèle ; un lecteur avec un modèle attend une politique de lecture approuvée. Quel que soit le lecteur du texte, les conditions strictes restent au code déterministe : aucun modèle ne passe outre un critère Obligatoire ou Jamais.',
        ] },
        { name: 'Sur le tableau', status: 'now' as Status, paras: [
          'Le tableau liste les demandes et les offres dont le propriétaire l’a choisi, jamais par défaut. Il n’affiche que les champs que le pack permet à l’étape tableau, simplifiés comme le pack le déclare, et jamais l’auteur. Répondre à une annonce ouvre un brouillon de l’autre côté, dans le même formulaire.',
        ] },
        { name: 'Avec un suivi', status: 'now' as Status, paras: [
          'Un suivi garde une demande ou une offre ouverte et informe son propriétaire quand quelque chose de nouveau correspond, par e-mail ou, pour la plateforme, par webhook. Il n’avertit que son propriétaire et ne divulgue jamais plus que le tableau. Une personne peut le mettre en pause, le reprendre ou y mettre fin, aussi depuis le lien d’un message.',
        ] },
      ],
    },
    confirm: {
      title: 'La confirmation est la première chose stockée',
      paras: [
        'Avant qu’une personne confirme, rien de personnel n’est stocké : décrire, répondre et valider ne laissent rien derrière. Le widget le dit au-dessus du bouton de confirmation : « Rien n’est utilisé avant votre confirmation. » Un brouillon vit dans l’onglet du navigateur et disparaît quand l’onglet se ferme.',
        'L’étape de confirmation est le formulaire. Le serveur valide chaque valeur contre le pack épinglé et nomme chaque champ en échec. Ce qui est stocké : les critères avec leurs valeurs, sources et importances ; la partie, une personne ou une organisation avec un nom affiché facultatif ; et, si elle est donnée, une adresse e-mail, que la personne confirme par un lien.',
        'Le navigateur qui a confirmé gère ce qu’il a créé : il affiche « Mes demandes et offres », répond aux correspondances possibles et modifie le suivi, pendant soixante jours à partir de la dernière utilisation, et seulement dans cet onglet. Un nouveau navigateur retrouve l’accès par un lien envoyé à l’adresse confirmée.',
        'Sur un espace avec un contrôle de partie, comme celui de Geoprocure, l’étape de confirmation affiche l’avis propre à l’espace. La personne coche elle-même le consentement à révéler son identité pour ce contrôle ; rien n’est coché à l’avance, et une confirmation sans cela est refusée.',
      ],
    },
    matching: {
      title: 'L’appariement : un verdict par critère, jamais un score',
      paras: [
        'L’appariement tourne sur les valeurs stockées avec des règles déterministes, après une confirmation, après un changement et une fois par jour. Elle compare les exigences de la demande avec les faits que l’offre indique.',
        'Pour chaque critère que le pack lui laisse comparer, une correspondance montre un verdict : correspond, correspond en partie, contredit ou inconnu, avec la règle qui l’a décidé et les valeurs stockées qu’elle cite. Une limite respectée correspond, un intervalle qui chevauche la limite correspond en partie, une limite manquée contredit. « Indifférent » du côté de la demande correspond. « Je ne sais pas » ou « Autre » d’un côté ou de l’autre est inconnu, et l’inconnu n’est jamais une correspondance.',
        'Le fait qu’une paire puisse correspondre découle des seules conditions strictes, Obligatoire et Jamais. Rien d’autre ne change ce que l’autre côté voit. Il n’y a pas de score.',
        'Une correspondance possible ne divulgue rien par elle-même : seulement les verdicts sur les champs que le pack permet à l’étape correspondance, et un avis fixe selon lequel les personnes décident. Quand une demande ou une offre a eu beaucoup de nouvelles correspondances en peu de temps, l’espace retient le reste et une exécution ultérieure les propose.',
      ],
    },
    approval: {
      title: 'Approbation et gates : une personne identifiée, jamais le système',
      paras: [
        'Chaque dossier est approuvé par un opérateur identifié et actif de la plateforme. Avant cela, chaque gate que l’espace exige doit être enregistrée comme franchie par un opérateur identifié. Une gate n’est jamais décidée par le système : l’opérateur enregistre un contrôle fait ailleurs, avec une référence et sans données personnelles.',
        'La gate exigée par Geoprocure est un contrôle KYC et de sanctions. Elle ne peut pas être levée. Un opérateur peut la renvoyer à un conseil juridique, ce qui la laisse ouverte. Le dernier enregistrement d’une gate décide.',
        'Une approbation seule ne divulgue rien. Un dossier refusé est enregistré comme refusé ; sa raison reste dans le journal d’audit.',
      ],
    },
    yes: {
      title: 'Les deux côtés disent oui, chacun pour lui-même',
      paras: [
        'Chaque côté répond à une correspondance possible pour son propre côté : oui, non ou pas maintenant. Avant que les deux aient dit oui, l’autre côté n’apprend rien de la réponse. La dernière réponse compte, donc un non ultérieur révoque un oui.',
        'Le serveur crée lui-même la mise en relation au moment où la dernière des trois conditions est remplie, dans n’importe quel ordre : les gates franchies, le dossier approuvé, le oui des deux côtés. Il refuse toute autre voie.',
      ],
    },
    introduction: {
      title: 'La mise en relation, dans le mode choisi par l’espace',
      paras: [
        'En mode opérateur, celui de Geoprocure par défaut, les champs de l’étape mise en relation ne vont qu’à l’équipe de la plateforme : les noms affichés, les adresses e-mail confirmées, les critères que le pack garde pour cette étape. Chaque côté reçoit un reçu qui dit que les deux côtés ont accepté et que la plateforme les contactera, et qui ne porte rien de l’autre côté.',
        'En mode direct, chaque côté voit les champs de l’autre côté à l’étape mise en relation. L’équipe de la plateforme voit les deux. Un champ que le pack garde pour l’opérateur n’atteint jamais l’autre côté.',
        'Un reçu enregistre qui peut voir quels champs, et chaque lecture d’une mise en relation y est enregistrée. Ce qui n’est pas dans le reçu n’est jamais révélé plus tard.',
      ],
    },
    after: {
      title: 'Ensuite : résultats, changements, suppression',
      paras: [
        'Les deux côtés sont interrogés sur le résultat après trente, soixante et quatre-vingt-dix jours ; l’équipe de la plateforme peut aussi l’enregistrer. Les catégories viennent des réglages de l’espace.',
        'Une personne peut modifier une demande ou une offre confirmée par le même formulaire, la mettre en pause, la reprendre ou la fermer. Chaque changement relance l’appariement.',
        'Une personne peut demander la suppression de ses données depuis le navigateur qui a confirmé ; la demande doit être confirmée par un lien envoyé à une adresse confirmée auparavant. La plateforme peut supprimer pour le compte d’une personne, avec une référence. Ce qui part : le nom affiché, les adresses, chaque critère et consentement, les verdicts de ses correspondances, ses jetons et ses messages. Ce qui reste : les ids, les clés de champs, les horodatages et les états, afin que les reçus et le journal d’audit restent cohérents. Chaque suppression est écrite dans le journal des suppressions de l’instance, et rien ne prétend rappeler des copies qui ont quitté l’instance.',
      ],
    },
    sees: {
      title: 'Qui voit quoi, étape par étape',
      lede: 'Le pack donne une étape à chaque critère. Une étape est le plus loin qu’une valeur voyage : une correspondance ne montre pas plus que ce que son étape permet, et un suivi ne divulgue jamais plus que le tableau.',
      stages: [
        { name: 'Tableau', who: 'Toute personne qui peut voir le tableau', what: 'Seulement les champs à l’étape tableau, simplifiés comme le pack le déclare, seulement pour les demandes et les offres dont le propriétaire l’a choisi. Jamais l’auteur.' },
        { name: 'Correspondance', who: 'Les deux côtés d’une correspondance possible', what: 'Les verdicts sur les champs à l’étape correspondance ou plus bas, avec la règle et les valeurs qu’elle cite. Pas de nom, pas de coordonnées, aucun signe de la réponse de l’autre côté.' },
        { name: 'Mise en relation', who: 'En mode opérateur l’équipe de la plateforme ; en mode direct les deux côtés', what: 'Le nom affiché, l’adresse e-mail confirmée et les critères que le pack garde pour cette étape. Chaque lecture est enregistrée sur le reçu.' },
        { name: 'Opérateur', who: 'Seulement l’équipe de la plateforme', what: 'Les champs que le pack garde pour la plateforme, comme les détails d’identité pour un contrôle KYC. Ils n’atteignent jamais l’autre côté, et chaque accès est enregistré.' },
      ],
    },
    languages: {
      title: 'Cinq langues, et aucune traduction de vos mots',
      paras: [
        'Le widget fonctionne en anglais, allemand, espagnol, italien et français. La page fixe la langue, puis le navigateur du visiteur, puis la valeur par défaut de l’espace ; une langue que l’espace ne propose pas bascule sur une autre, et le widget le dit à l’écran.',
        'La Space API répond dans la langue demandée, ou dans la valeur par défaut de l’espace, et dit laquelle. Les libellés, les questions, les explications et les avis viennent dans cette langue.',
        'Le texte propre d’une personne n’est jamais traduit. La langue du formulaire et la langue des mots sont indépendantes.',
      ],
    },
    today: {
      title: 'Ce qui tourne sur l’espace staging, et ce qui ne tourne pas encore',
      lede: `Contrôlé le ${AS_OF} d’après le rapport d’état de l’espace staging et le plan de Connect : quelles parties y tournent, avec les mêmes carrés que le produit utilise comme preuve.`,
      columns: [
        { status: 'now' as Status, title: 'Sur l’espace staging', lead: 'Données synthétiques, en allemand et en anglais.', items: [
          'Décrire une demande ou une offre par formulaire, avec l’avis d’identité là où l’espace en a un',
          'Décrire une demande ou une offre avec vos propres mots, lus par des règles fixes sans modèle',
          'Le tableau, avec les valeurs simplifiées du pack, qui ne liste que ce que son propriétaire a choisi',
          'Les suivis ; leurs e-mails vont dans une boîte de test et n’atteignent personne',
          'Les réglages, origines, clés et l’entonnoir d’un espace, via la Space API',
          'Confirmer ; le navigateur qui a confirmé gère ce qu’il a créé',
          'L’appariement avec un verdict par critère',
          'Les gates et l’approbation par un opérateur identifié',
          'Les mises en relation en mode opérateur, avec reçus',
          'Les résultats, les changements, la mise en pause et la fermeture',
          'La suppression avec le journal des suppressions de l’instance',
          'Le widget, servi par l’instance elle-même depuis une version épinglée (0.3.0-v1)',
        ] },
        { status: 'contract' as Status, title: 'Dans le contrat, pas sur l’espace staging', lead: 'Chacune attend que sa tranche y soit déployée.', items: [
          'Les webhooks vers le serveur de la plateforme',
          'Les e-mails qui atteignent une vraie boîte ; ceux de l’espace staging vont dans une boîte de test',
        ] },
        { status: 'later' as Status, title: 'Pas construit', lead: 'Aucune date promise.', items: [
          'Une démo du widget sur ce site ; elle attend un espace de démonstration avec des données synthétiques',
          'Des paquets publiés pour WordPress, Next.js et Astro ; les recettes existent et tournent en CI',
        ] },
      ],
    },
  },

  platforms: {
    title: 'Intégrations : un espace Linkbot sur vos propres pages',
    description: 'Un espace Linkbot sur vos pages : un script, un élément, une Publishable Key, votre avis de données, une console pour l’équipe, des webhooks pour votre serveur.',
    eyebrow: 'Intégrations',
    h1: ['Un espace', 'sur vos propres pages.'],
    lede: 'Un script et un élément affichent le widget dans votre page, dans vos polices et vos couleurs. Votre équipe approuve les dossiers dans une console sur votre machine ou derrière votre propre connexion. Votre serveur apprend les événements par des webhooks signés.',
    toc: [['pages', 'Chaque intégration'], ['embed', 'L’embed'], ['keys', 'Clés et origines'], ['console', 'La console'], ['server', 'SDK et webhooks'], ['recipes', 'Recettes'], ['state', 'État actuel']] as [string, string][],
    embed: {
      title: 'L’embed : un script, un élément',
      paras: [
        'Le script vient de l’instance propre de votre espace. L’élément porte votre Publishable Key, le mode (describe, board ou mine), le côté (une demande ou une offre) et la langue. Plusieurs éléments sur une page font plusieurs widgets.',
        'Le widget s’affiche dans un shadow root, reprend la police et la couleur de texte de votre page et règle tout le reste par des variables CSS sur l’élément. Il n’a pas besoin de « unsafe-inline » sous une Content Security Policy.',
        'Votre propre avis de données va à l’intérieur de l’élément et apparaît au-dessus du bouton de confirmation, à côté des lignes fixes du widget. Le widget ne dépose aucun cookie, garde son brouillon et ses jetons dans l’onglet du navigateur, et n’envoie rien à personne d’autre que votre espace.',
      ],
    },
    keys: {
      title: 'Clés et origines',
      paras: [
        'Une Publishable Key identifie votre espace et ne fonctionne que sur les origines que votre espace permet ; elle a sa place dans la page. Une Secret Key a sa place sur votre serveur ; le widget refuse de démarrer avec elle et vous dit de la renouveler.',
        'Les origines autorisées sont fixées au moment où un espace est configuré. Depuis le contrat 0.2.9, la Space API peut les changer, et la console aussi.',
      ],
    },
    console: {
      title: 'La console pour votre équipe',
      paras: [
        'La console affiche la file d’approbation, chaque dossier avec ses gates et son approbation, les mises en relation avec leurs reçus, les résultats, les points de terminaison webhook et les opérateurs. Elle tourne sur une de vos machines ou derrière votre propre connexion ; la Secret Key reste sur son serveur. Il n’y a pas de connexion Linkbot pour les opérateurs.',
        'Ses écrans de réglages et d’ajustements des critères, de clés, d’origines et d’entonnoir utilisent les routes que la Space API a depuis le contrat 0.2.9.',
      ],
    },
    server: {
      title: 'Votre serveur : le SDK et les webhooks',
      paras: [
        `Le SDK donne à votre serveur un client typé par le contrat Space API : une route, un champ ou une valeur que le contrat n’a pas est une erreur de type. Il contrôle aussi les livraisons webhook exactement comme le contrat le précise. Au ${AS_OF}, il n’est pas publié ; son code est dans le dépôt Connect.`,
        `Les webhooks portent des ids et des états, jamais de données de contact ; votre serveur récupère les détails avec sa Secret Key. Les livraisons sont signées et réessayées. Elles sont dans le contrat ; au ${AS_OF}, l’espace staging ne les envoie pas.`,
      ],
    },
    recipes: {
      title: 'Recettes : HTML simple, Astro, Next.js, WordPress',
      paras: [
        'Chaque recette est un fichier qui tourne dans la CI de Connect sur trois moteurs de navigateur contre la build d’exemple avec données synthétiques : une page simple avec une Content Security Policy stricte, un composant Astro, une page Next.js avec le wrapper React, et un petit plugin WordPress avec un shortcode.',
        `Au ${AS_OF}, elles tournent dans la CI de Connect contre la build d’exemple, pas contre un espace ; l’instance staging elle-même sert la version 0.3.0-v1 du widget.`,
      ],
    },
    state: { title: 'État actuel' },
  },

  forPlatforms: {
    title: 'Pour les plateformes : ce qu’un opérateur obtient avec un espace Linkbot',
    description: 'Pour un opérateur qui veut un espace pour son marché : les quatre voies d’accès, ce qu’obtient une plateforme et ce qui reste à elle : ses données et sa décision.',
    eyebrow: 'Pour les plateformes',
    h1: ['Votre marché, vos pages,', 'votre décision.'],
    lede: 'Pour un opérateur qui veut un espace pour son propre marché : comment un espace atteint vos utilisateurs, ce que vous obtenez et ce qui reste à vous. Cette page décrit le contrat Space API et l’espace staging synthétique de Geoprocure. Aucune plateforme réelle ne fait encore tourner d’espace, et cette page n’indique aucun prix.',
    toc: [['ways', 'Quatre voies d’accès'], ['gets', 'Ce que vous obtenez'], ['yours', 'Ce qui reste à vous'], ['details', 'Les détails']] as [string, string][],
    ways: {
      title: 'Quatre voies d’accès',
      lede: `Au ${AS_OF}, deux d’entre elles tournent sur l’espace staging, et deux ne sont pas construites.`,
      items: [
        { name: 'Pages hébergées', status: 'later' as Status, body: 'Une page servie pour vous, vers laquelle vous créez un lien au lieu d’intégrer. Elle n’est pas construite. Aujourd’hui, un espace n’apparaît que sur vos propres pages, par l’intégration ou par votre propre serveur.' },
        { name: 'L’intégration', status: 'now' as Status, body: 'Un script et un élément sur votre page. Le script vient de l’instance propre à votre espace ; l’élément porte votre clé publiable, qui ne fonctionne que sur les origines que votre espace autorise. Ses modes : décrire, tableau, suivi et les miens. L’instance staging sert la version 0.3.0-v1 du widget.' },
        { name: 'L’API et le SDK', status: 'now' as Status, body: `Votre serveur parle à Space API avec la clé secrète, qui n’apparaît jamais dans une page : il peut créer des besoins et des offres, enregistrer des contrôles et des approbations, et lire les mises en relation et les résultats. Le SDK donne à votre serveur un client typé par le contrat. Au ${AS_OF}, le SDK n’est pas publié ; son code est dans le dépôt de Connect.` },
        { name: 'MCP', status: 'later' as Status, body: 'Prévu, non construit : un serveur MCP par espace, par lequel un agent d’IA prépare un besoin ou une offre et une personne confirme et répond. Le propriétaire a choisi cette direction ; sa conception est proposée et son contrat est un squelette.' },
      ],
    },
    gets: {
      title: 'Ce qu’obtient une plateforme',
      items: [
        'Un espace à elle : une instance pour un marché, avec sa propre base de données, ses clés et son journal de suppression.',
        'Un pack avec le vocabulaire de votre marché. Le formulaire, la lecture du texte, le tableau et les règles d’appariement en découlent.',
        'Un widget qui reprend la police et la couleur du texte de votre page, avec votre propre mention sur les données au-dessus de son bouton de confirmation.',
        'Un appariement avec un verdict par critère, jamais un score, et une mise en relation seulement après le oui des deux côtés et l’approbation de votre équipe.',
        `Une console pour votre équipe : la file d’approbation, les dossiers avec leurs contrôles, les mises en relation avec reçus, et les résultats. Elle tourne sur votre machine ou derrière votre propre connexion. Au ${AS_OF}, elle tourne sur un échantillon de données synthétiques et n’est pas publiée.`,
        `Des webhooks vers votre serveur, avec des ids et des états, jamais de coordonnées. Ils sont dans le contrat ; au ${AS_OF}, l’espace staging ne les envoie pas.`,
      ],
    },
    yours: {
      title: 'Ce qui reste à vous',
      items: [
        'Votre décision. Aucune mise en relation n’a lieu sans qu’un opérateur nommé de votre équipe l’approuve, après les contrôles que fixe votre espace. Le système ne tranche jamais un contrôle, et chaque côté dit oui ou non pour lui-même.',
        'Vos données. Les besoins, offres et correspondances d’un espace ne sont partagés avec aucun autre espace. Les webhooks ne portent aucune coordonnée ; votre serveur récupère les détails avec sa clé secrète.',
        'Vos pages. Votre propre mention sur les données, votre police et vos couleurs. Le widget ne dépose aucun cookie et n’envoie rien à personne d’autre que votre espace.',
        'Votre connexion. Votre équipe se connecte par votre propre connexion ; il n’existe pas de connexion Linkbot pour les opérateurs.',
      ],
    },
    details: { title: 'Les détails', lede: 'Les pages d’intégration montrent comment fonctionne chaque partie : l’intégration, les clés et origines, la console, le SDK et les webhooks, et des recettes pour HTML simple, WordPress, Next.js et Astro.', link: 'Intégrations' },
  },

  verticals: {
    title: 'Pour les secteurs : un pack par marché',
    description: 'Un pack porte le vocabulaire d’un marché : critères, options, unités, divulgation par étape, gates, résultats. Premier espace : les minéraux industriels.',
    eyebrow: 'Pour les secteurs',
    h1: ['Un pack', 'par marché.'],
    lede: 'Un secteur rejoint Linkbot sous forme de pack : les critères de son marché, les réponses qu’ils permettent, ce que chacun divulgue et quand, et les gates dont le marché a besoin. Un espace épingle le pack ; le formulaire, la lecture, le tableau et les règles d’appariement en découlent.',
    toc: [['holds', 'Ce qu’un pack contient'], ['first', 'Le premier espace'], ['next', 'D’autres secteurs']] as [string, string][],
    holds: {
      title: 'Ce qu’un pack contient',
      items: [
        'Les critères avec leurs contrôles : un choix, plusieurs choix, un nombre avec une unité, un intervalle, une fenêtre de dates, une liste interrogeable, du texte libre',
        'Les options, unités et bases, avec les conversions que le pack déclare ; une conversion ne passe que par la base indiquée de l’offre, jamais par supposition',
        'Quelles réponses spéciales chaque critère permet : « Autre / ne figure pas dans la liste », « Je ne sais pas », « Indifférent »',
        'Quelles importances un critère permet, et celle qui est suggérée',
        'L’étape de chaque critère, tableau, correspondance, mise en relation ou opérateur, et comment une valeur est simplifiée pour le tableau',
        'Les libellés, questions, synonymes et avis dans les langues de l’espace',
        'Les gates du marché et les catégories d’un résultat',
      ],
    },
    first: {
      title: 'Le premier espace : les minéraux industriels',
      paras: [
        'Geoprocure fait tourner le premier espace, pour les minéraux industriels, sur une instance staging synthétique. Sa gate exigée est un contrôle KYC et de sanctions, enregistré par un opérateur identifié et jamais levé. Ses mises en relation se font en mode opérateur : l’équipe de Geoprocure met les deux côtés en contact.',
      ],
    },
    next: {
      title: 'D’autres secteurs',
      paras: [
        'Un secteur a besoin de son pack et d’une plateforme qui fait tourner l’espace. Un deuxième pack avec des données synthétiques est prévu, afin qu’un espace de démonstration puisse montrer le widget sur ce site sans marché réel.',
      ],
    },
  },

  privacy: {
    title: 'Notice de confidentialité · Linkbot',
    description: 'La notice de confidentialité est en préparation. Déjà vrai : le site ne dépose aucun cookie, ne charge rien de tiers et n’utilise aucune mesure d’audience.',
    eyebrow: 'Notice de confidentialité',
    h1: 'En préparation',
    lede: 'La notice de confidentialité de ce site est en cours de rédaction et de relecture. Elle apparaîtra ici une fois publiée. Rien n’est affiché d’ici là, car un texte juridique ne peut pas être rédigé au jugé.',
    facts: {
      title: 'Ce qui est déjà vrai de ce site',
      items: [
        'Il ne dépose aucun cookie et n’utilise ni mesure d’audience ni suivi.',
        'Il ne charge rien de tiers : les polices et les images viennent de ce site.',
        'Il n’a ni formulaire ni compte. Rien de ce que vous tapez n’atteint quiconque.',
        'Le produit tourne sur les pages propres d’une plateforme, sous l’avis de données de cette plateforme, à côté des lignes fixes du widget.',
      ],
    },
  },

  imprint: {
    title: 'Mentions légales · Linkbot',
    description: 'Les mentions légales du site de Linkbot : éditeur et coordonnées. Le texte est en préparation.',
    eyebrow: 'Mentions légales',
    h1: 'En préparation',
    lede: 'Les mentions légales (éditeur, adresse, représentants, registre et données fiscales, contact) sont en préparation et apparaîtront ici une fois confirmées. Rien n’est affiché d’ici là, car rien de cela ne peut être inventé.',
  },

  notFound: {
    title: 'Page introuvable · Linkbot',
    description: 'Cette page n’existe pas. Allez à la page d’accueil, ou lisez le site dans une autre langue.',
    eyebrow: 'Page introuvable',
    h1: 'Il n’y a rien ici.',
    lede: 'La page a peut-être été déplacée.',
    home: 'Aller à la page d’accueil',
    languages: 'Ce site dans d’autres langues',
  },

  /* S2 : une page par intégration, chacune avec seulement ce que les docs de la voie Connect montrent aujourd’hui. Les sections portent des paragraphes, une liste ou un tableau (lignes à deux ou trois colonnes). */
  integrations: {
    eyebrow: 'Pour les plateformes',
    hub: 'Chaque intégration sur sa propre page',
    state: 'État actuel',
    pages: {
      embed: {
        nav: 'L’embed',
        title: 'L’embed : un script, un élément · Linkbot pour les plateformes',
        description: 'Ce qu’une page règle : les attributs, l’avis de données, les variables de thème, la Content Security Policy, ce que le widget garde et envoie.',
        h1: ['Un script,', 'un élément.'],
        lede: 'Le widget est un script et un élément par endroit où il apparaît. Votre page règle sa clé, son mode, son côté et sa langue ; tout le reste vient de votre espace.',
        sections: [
          { id: 'element', title: 'L’élément', paras: [
            'Chargez le script une fois par page, avec async, pour que votre page s’affiche sans l’attendre. Placez l’élément là où le formulaire doit apparaître. Plusieurs éléments sur une page font plusieurs widgets, et les éléments ajoutés plus tard, comme le font les applications monopage, démarrent d’eux-mêmes.',
            'Une valeur que le widget ne connaît pas bascule sur la valeur par défaut, avec un avertissement dans la console du navigateur. Une langue que l’espace ne propose pas bascule aussi, et le widget le dit à l’écran.',
          ], code: true, columns: ['Attribut', 'Valeurs', 'Défaut'], rows: [
            { name: 'data-linkbot', what: 'votre Publishable Key. Le widget refuse de démarrer avec une Secret Key et vous dit de la renouveler', more: 'obligatoire' },
            { name: 'data-mode', what: 'describe (dites ce que vous demandez ou offrez), board (parcourez les annonces et répondez-y), mine (mes demandes, mes suivis et les correspondances possibles)', more: 'describe' },
            { name: 'data-side', what: 'seeking (une demande) ou offer', more: 'seeking' },
            { name: 'data-locale', what: 'en, de, es, it ou fr', more: 'la langue du navigateur du visiteur, puis la valeur par défaut de l’espace' },
            { name: 'data-input', what: 'form, text ou both ; il ne peut que restreindre ce que l’espace permet', more: 'le réglage de l’espace' },
            { name: 'data-api', what: 'la base API de votre espace, https uniquement (http sur localhost)', more: 'l’origine d’où le script a été chargé' },
          ] },
          { id: 'notice', title: 'Votre avis de données', paras: ['Un enfant avec slot="notice" apparaît juste au-dessus du bouton de confirmation, stylé par le CSS de votre page. Le widget ajoute ses propres lignes fixes à côté, comme « Rien n’est utilisé avant votre confirmation. » Ce que vous y écrivez vient de vos propres textes de confidentialité.'] },
          { id: 'design', title: 'Design', paras: [
            'Le widget reprend la police et la couleur de texte de votre page. Tout le reste est réglé par des variables CSS sur l’élément : l’accent du bouton principal, des choix sélectionnés et des anneaux de focus, son survol, le rayon des coins, le texte et le texte secondaire, les titres et leur police, la police des libellés de champs, les bordures de cartes et les séparateurs, les bordures de champs, les fonds de carte et de surface, et la couleur et le fond d’erreur.',
            'Le widget choisit un texte noir ou blanc pour l’accent, celui qui contraste le plus. Si votre page est sombre, réglez color-scheme: dark sur l’élément. Les autres styles de votre page n’atteignent pas l’intérieur du widget, qui s’affiche dans un shadow root, et les styles du widget n’atteignent pas votre page.',
          ] },
          { id: 'csp', title: 'Content Security Policy', paras: [
            'Autorisez l’origine du script dans script-src, et l’origine de la Space API dans connect-src, plus l’origine du script si elle diffère : le widget charge une langue autre que l’anglais depuis l’endroit où il est servi et la contrôle contre un sha256 intégré au script.',
            'Les styles n’ont pas besoin de « unsafe-inline » : le widget utilise une feuille de style constructible. Dans les navigateurs qui n’en ont pas, il ajoute un seul élément style portant le nonce de sa propre balise script ; mettez donc votre nonce sur la balise script si votre politique utilise des nonces. Si vous hébergez le script vous-même, copiez son dossier locales avec lui.',
          ] },
          { id: 'global', title: 'Le global de la page', paras: ['Le script définit un seul global, window.Linkbot, et rien d’autre : la version de l’embed, s’il s’agit de la build d’exemple, et mount et unmount pour un élément que le balayage ne peut pas voir, par exemple à l’intérieur de votre propre shadow root.'] },
          { id: 'keeps', title: 'Ce que le widget garde, et ce qu’il envoie', paras: [
            'Ses jetons de session invité et de propriétaire sont dans sessionStorage, par onglet et par espace. Il n’utilise ni cookie ni localStorage. Les requêtes ne vont qu’à la Space API, sans identifiants. Il n’y a aucune mesure d’audience. La build d’exemple n’envoie rien sur le réseau.',
            'sessionStorage appartient à l’origine de votre page ; tout script que vous exécutez sur cette page peut donc lire le brouillon et les jetons. N’exécutez aucun script en qui vous n’avez pas confiance sur les pages qui portent le widget.',
          ] },
        ] as Section[],
        state: [`Le script vient de l’instance propre de votre espace. Au ${AS_OF}, l’instance staging sert la version 0.3.0-v1 du widget depuis un fichier épinglé, comme le montre son rapport d’état ; les contrôles de Connect sur le tableau et sur les textes du widget ont réussi contre ce fichier servi le 24 octobre 2026.`],
      },
      sdk: {
        nav: 'SDK et webhooks',
        title: 'Le SDK, le wrapper React et les webhooks · Linkbot pour les plateformes',
        description: 'Un client serveur typé par le contrat Space API, le contrôle webhook, le wrapper React, et comment votre serveur reçoit les événements de Linkbot.',
        h1: ['Votre serveur,', 'typé par le contrat.'],
        lede: `Rien du SDK ne va dans une page de navigateur : l’embed prend la Publishable Key, et le client du SDK refuse de démarrer dans un navigateur. Au ${AS_OF}, il n’est pas publié ; son code est dans le dépôt Connect.`,
        sections: [
          { id: 'client', title: 'Le client', paras: [
            'Le client prend la base API de votre espace (https uniquement, sauf sur localhost), votre Secret Key depuis le magasin de secrets de votre serveur (une valeur qui n’a pas la forme d’une Secret Key est refusée) et, si vous le voulez, le fetch de votre environnement. Ses chemins, paramètres, corps et réponses sont ceux du contrat, générés à partir du YAML publié par Core et épinglés par sha256 : une route, un champ ou une valeur que le contrat n’a pas est une erreur de type.',
            'Une nouvelle clé d’idempotence s’obtient en un appel. Les écritures que le contrat marque en ont besoin ; gardez la clé avec l’écriture et renvoyez la même clé quand vous la réessayez, pour que l’espace fasse l’écriture une seule fois.',
          ] },
          { id: 'seeding', title: 'Semer l’offre de votre propre plateforme', paras: ['Votre serveur sème une offre sur la voie opérateur, et un second opérateur la confirme : quatre yeux. Sur un espace qui contrôle chaque partie, comme celui de Geoprocure, semer l’offre de votre propre organisation compte comme une confirmation ; elle porte donc le consentement à révéler l’identité que demande l’avis de l’espace, et l’espace la refuse sans lui. C’est réservé à votre propre organisation ; le consentement de toute autre partie revient à cette partie, dans le widget.'] },
          { id: 'webhooks', title: 'Webhooks', paras: [
            'Enregistrez un point de terminaison avec votre Secret Key, https uniquement. Le secret de signature n’est montré qu’une fois et a sa place dans votre magasin de secrets, jamais dans le code. Chaque livraison porte un id, un horodatage en secondes et une signature : le HMAC-SHA256 de l’horodatage, d’un point et du corps brut, signé avec votre secret.',
            'Refusez une livraison vieille de plus de cinq minutes ou dont la signature ne correspond pas. Le contrôle du SDK fait les deux, en comparant en temps constant avec Web Crypto, dans Node, Deno, Bun et les environnements edge. Contrôlez le corps brut avant de le parser. Répondez 2xx rapidement : toute autre réponse est réessayée avec backoff pendant 24 heures, puis la livraison est marquée comme échouée. Un nouvel essai porte le même id ; traitez donc chaque id une fois, avec les ids dans votre base de données plutôt qu’en mémoire.',
            `Renouvelez le secret quand il le faut : l’ancien reste valide jusqu’à sept jours, et le contrôle accepte les deux. Les livraisons portent des ids et des états, jamais de données de contact ; récupérez les détails avec votre Secret Key. Le journal des livraisons liste le statut, les tentatives et une empreinte du corps, jamais le corps. Les webhooks sont dans le contrat ; au ${AS_OF}, l’espace staging ne les envoie pas.`,
          ] },
          { id: 'events', title: 'Types d’événements', paras: ['Chaque événement a un id, un type, l’id de l’espace, l’heure où il s’est produit, la version du contrat et l’objet qu’il concerne, avec son type, son id et son état quand il y en a un. Les types :'], code: true, items: ['intent.confirmed', 'intent.revised', 'intent.status_changed', 'match.proposed', 'match.updated', 'gate.recorded', 'approval.recorded', 'answer.recorded', 'clarification.requested', 'review.recorded', 'introduction.created', 'outcome.recorded', 'watch.delivered', 'channel.verified', 'deletion.completed', 'key.rotated'] },
          { id: 'react', title: 'Le wrapper React', paras: [
            'Le wrapper affiche le même élément que l’extrait et charge le script une fois par adresse ; l’embed démarre ensuite dans son propre shadow root, que React ne touche jamais. C’est un composant client ; il fonctionne donc dans l’App Router de Next.js, et n’ajoute aucun CSS global.',
            `Ses props sont les attributs de l’élément : la Publishable Key et l’adresse du script sont obligatoires (une Secret Key lève une erreur), puis mode, side, locale, input, api, votre avis, un nom de classe et un style pour les variables de thème. Quand une prop que l’embed lit change, le wrapper donne à React un nouvel élément et l’embed redémarre. Une page qui veut le script chargé avant d’afficher un élément peut aussi le demander. Pas publié au ${AS_OF}.`,
          ] },
        ] as Section[],
        state: [`Le SDK et le wrapper sont construits et testés dans le dépôt Connect et, au ${AS_OF}, pas publiés. Le récepteur du guide des webhooks est testé contre des livraisons d’exemple signées ; l’espace staging n’envoie pas de webhooks.`],
      },
      console: {
        nav: 'La console',
        title: 'La console pour votre équipe · Linkbot pour les plateformes',
        description: 'File d’approbation, dossiers avec gates et approbation, mises en relation, webhooks et opérateurs, sur votre machine ou derrière votre connexion.',
        h1: ['La console de votre équipe,', 'derrière votre propre connexion.'],
        lede: 'La console est un petit serveur, le seul endroit où la Secret Key de l’espace est utilisée, plus la page dans laquelle votre équipe travaille. Il n’y a pas de connexion Linkbot pour les opérateurs : votre plateforme connecte son équipe. Vous la lancez sur votre propre machine comme outil local, ou montez son gestionnaire derrière la connexion de votre plateforme. Ce n’est jamais une page Linkbot publique.',
        sections: [
          { id: 'views', title: 'Ce qu’elle montre', columns: ['Vue', 'Ce qu’elle montre'], rows: [
            { name: 'File d’approbation', what: 'Les dossiers qui attendent votre équipe, sans identités : la correspondance par critère, les réponses des deux côtés, les gates manquantes.' },
            { name: 'Dossier', what: 'La correspondance par critère et pourquoi. Votre équipe enregistre les contrôles du dossier et le contrôle de chaque partie (franchie, échouée, renvoyée, et levée seulement là où la gate le permet), le contrôle d’une partie côte à côte pour que l’enregistrement d’une partie ne se lise jamais comme celui de l’autre ; approuve ou refuse avec une raison facultative pour le journal d’audit ; répond pour les seules offres ou demandes de votre plateforme, en tant qu’opérateur connecté ; demande à un côté de préciser.' },
            { name: 'Mises en relation', what: 'Listées sans coordonnées. Pour en ouvrir une, une confirmation est demandée d’abord, puis les champs de contact s’affichent et la lecture est enregistrée. Une valeur d’une longue liste, comme un pays ou un port, s’affiche par son nom avec son code. Reçus et résultats.' },
            { name: 'Webhooks', what: 'Ajouter un point de terminaison (https uniquement) ; le secret de signature n’est montré qu’une fois ; renouveler, l’ancien secret restant valide jusqu’à sept jours ; retirer ; le journal des livraisons.' },
            { name: 'Opérateurs', what: 'Le registre : ajouter, désactiver, réactiver.' },
            { name: 'Espace et extrait', what: 'Les réglages tels que la Space API les rapporte, et l’extrait avec votre Publishable Key et l’adresse du script de votre instance.' },
            { name: 'Mise en place', what: 'Les cinq étapes, avec ce que votre espace a pour chacune.' },
          ] },
          { id: 'safe', title: 'Comment la clé reste en sécurité', items: [
            'La clé reste sur le serveur. La page reçoit ses réglages du serveur, et les tests contrôlent que cette réponse ne porte aucune Secret Key.',
            'Pas de proxy : chaque opération est listée avec les champs qu’elle peut envoyer ; tout le reste est refusé et les champs non listés sont retirés.',
            'Le serveur nomme l’opérateur d’après votre connexion ; un id envoyé par la page est ignoré.',
            'Il ne répond que pour le propre côté de votre plateforme dans un dossier, calculé sur le serveur ; la page ne choisit jamais un côté et ne reçoit jamais les intents, qui contiennent des champs d’identité.',
            'Seule la page propre de la console peut l’appeler : son propre en-tête, sa propre origine, des requêtes same-origin, des corps JSON.',
            'Le mode local ne se lie qu’à la machine locale et ne répond qu’à son propre nom, ce qui bloque le rebinding DNS.',
            'Une politique de page stricte : pas de script ni de style inline, pas de mise en cadre, pas de mise en cache.',
          ] },
          { id: 'run', title: 'La lancer', paras: [
            'Sur des données d’exemple : l’API opérateur d’exemple répond de mémoire avec des données synthétiques, n’a besoin d’aucune clé et n’envoie rien sur le réseau, et chaque page le dit dans un bandeau. Elle suit les règles du contrat, pour que vous puissiez les essayer : une gate qui ne peut pas être levée, l’approbation seulement après les gates exigées, une mise en relation seulement avec chaque gate, l’approbation et un oui des deux côtés, et un reçu de lecture quand votre équipe ouvre les coordonnées.',
            'Contre un espace : la base API, votre Secret Key depuis votre magasin de secrets, votre id dans le registre d’opérateurs de l’espace et, si vous voulez l’extrait affiché, la Publishable Key. Derrière votre connexion : un gestionnaire ; votre session décide qui agit, et sans opérateur connecté il répond 401. Derrière un proxy, il lui faut l’adresse publique qu’a utilisée le navigateur.',
            'Cette voie a tourné contre l’espace staging synthétique de Geoprocure le 23 octobre 2026 : la file, un dossier, les deux sortes de contrôle, l’approbation, une réponse pour l’offre propre de la plateforme, et une mise en relation avec son reçu.',
          ] },
          { id: 'notyet', title: 'Pas encore là, et pourquoi', items: [
            'Un nouvel espace se crée avec l’outil de configuration de Core, pas depuis la console ; l’assistant en cinq étapes de la console écrit et valide le fichier que cet outil lit.',
            'Pas de « renvoyer » pour une livraison tant qu’il n’y a pas de livraisons réelles sur lesquelles l’essayer.',
          ] },
        ] as Section[],
        state: ['La console est construite sur le contrat Space API et a tourné contre l’espace staging synthétique le 23 octobre 2026 ; ses tests tournent contre une API opérateur d’exemple avec des données synthétiques.'],
      },
      wordpress: {
        nav: 'WordPress',
        title: 'WordPress · Linkbot pour les plateformes',
        description: 'Un petit plugin ajoute le shortcode pour chaque éditeur : installez-le, placez-le où le formulaire doit apparaître, gardez les plugins de cache loin du script.',
        h1: ['Un shortcode', 'pour chaque éditeur.'],
        lede: 'Coller l’extrait dans un bloc HTML personnalisé ne fonctionne que pour les utilisateurs que WordPress laisse publier des scripts, ce qui exclut les éditeurs des réseaux multisite. Le plugin ajoute un shortcode qui fonctionne pour chaque éditeur, charge le script une fois par page par le chargement de script propre de WordPress, et contrôle chaque valeur qu’il imprime.',
        sections: [
          { id: 'install', title: 'Installer le plugin', paras: ['Copiez le dossier du plugin dans le répertoire plugins, ou zippez-le et téléversez-le sous Plugins, puis activez-le. Le plugin entier est un seul fichier.'] },
          { id: 'shortcode', title: 'Le shortcode', paras: ['Dans l’éditeur de blocs, ajoutez un bloc Shortcode. Le texte entre le shortcode ouvrant et le shortcode fermant devient votre avis de données, affiché au-dessus du bouton de confirmation. Utilisez la même adresse de script dans chaque shortcode d’une page : le plugin charge le script une fois, depuis le premier.'], code: true, columns: ['Attribut', 'Ce que c’est'], rows: [
            { name: 'src', what: 'l’adresse https du script sur l’instance de votre espace ; elle doit être en https' },
            { name: 'key', what: 'votre Publishable Key. Une Secret Key montre un avertissement aux personnes qui peuvent modifier la page, et rien aux visiteurs' },
            { name: 'mode, side, locale, input, api', what: 'les attributs de l’élément sans le préfixe data-. Une valeur que le plugin ne connaît pas est laissée de côté, le widget utilise donc sa valeur par défaut' },
          ] },
          { id: 'caching', title: 'Plugins de cache et d’optimisation', paras: ['Les plugins qui combinent, minifient, déplacent ou retardent les scripts doivent laisser le script tranquille : excluez-le par son adresse ou par son identifiant. Le widget charge ses autres langues depuis l’endroit où il est servi et contrôle chacune contre un sha256 qu’il porte ; une copie ailleurs ne peut donc pas les charger. Si votre hébergeur n’autorise pas les plugins, le shortcode n’est pas disponible, et un bloc HTML personnalisé ne fonctionne que pour les utilisateurs que WordPress laisse publier des scripts.'] },
        ] as Section[],
        state: ['La CI de Connect fait tourner le plugin dans un vrai WordPress 6.8 sur PHP 8.3 par WordPress Playground et charge ses pages dans trois moteurs de navigateur contre la build d’exemple : le shortcode démarre le widget avec votre avis, deux shortcodes sur une page chargent le script une fois, un shortcode avec une Secret Key ne montre rien à un visiteur. Il n’a pas encore tourné contre un espace réel tel quel. La recette est aujourd’hui le plugin entier ; une page de réglages n’en fait pas partie.'],
      },
      nextjs: {
        nav: 'Next.js',
        title: 'Next.js · Linkbot pour les plateformes',
        description: 'Le wrapper React dans l’App Router : un composant client affichable par un composant serveur, les variables publiques, la politique et les webhooks.',
        h1: ['Le wrapper', 'dans l’App Router.'],
        lede: 'Utilisez le wrapper React. C’est un composant client ; un composant serveur peut donc l’afficher : l’adresse du script et votre Publishable Key en props, le mode, le côté et la langue, votre avis de données, et les variables de thème dans son style.',
        sections: [
          { id: 'props', title: 'Props et variables', paras: ['L’adresse du script et la Publishable Key sont obligatoires. Elles sont publiques par conception : la clé identifie seulement votre espace et ne fonctionne que sur vos origines autorisées. Les variables publiques sont fixées au moment de la build. L’avis est votre avis de données, affiché au-dessus du bouton de confirmation ; le style règle les variables de thème et réserve de la place avant le chargement du widget, pour que la page en dessous ne saute pas.'] },
          { id: 'csp', title: 'Content Security Policy', paras: ['Ajoutez l’origine du script à script-src, et l’origine de la Space API avec l’origine du script à connect-src. Le wrapper ajoute la balise script depuis le navigateur : sous une politique à base de nonce avec strict-dynamic, cette balise est autorisée parce qu’un code de confiance l’ajoute ; sans strict-dynamic, listez l’origine du script. L’exemple n’envoie aucune politique, la CI de Connect n’en teste donc pas encore une pour Next.js.'] },
          { id: 'server', title: 'Votre côté serveur', paras: ['Les webhooks arrivent à un route handler ; le guide des webhooks en montre un pour l’App Router, dans du code que la CI fait tourner. La Secret Key reste sur le serveur, jamais dans une variable publique.'] },
        ] as Section[],
        state: ['La CI de Connect construit l’exemple avec Next.js 16.3.8 et React 19.3, ce qui contrôle ses types, puis le démarre et fait tourner la page dans trois moteurs de navigateur contre la build d’exemple : le wrapper charge le script une fois, le widget démarre avec l’avis et le thème, et la console ne montre aucune erreur. Il n’a pas encore tourné contre un espace réel tel quel. Aucun paquet n’est publié.'],
      },
      astro: {
        nav: 'Astro',
        title: 'Astro · Linkbot pour les plateformes',
        description: 'Un composant : le script laissé inline pour qu’Astro ne l’empaquette pas, l’avis par un wrapper, trois variables publiques, et une build statique.',
        h1: ['Un composant,', 'une build statique.'],
        lede: 'Copiez un composant dans votre site. Il affiche la balise script et l’élément à partir de trois variables publiques : l’adresse du script sur l’instance de votre espace, votre Publishable Key et, si le script vient d’une autre origine, votre base API. La page n’a besoin d’aucun serveur : une build Astro statique suffit.',
        sections: [
          { id: 'inline', title: 'Le script reste inline', paras: ['La balise script porte is:inline, pour qu’Astro la laisse tranquille. Le script doit se charger depuis là où il est servi, car il récupère ses autres langues depuis l’endroit où il est servi et contrôle chacune contre un sha256 qu’il porte.'] },
          { id: 'notice', title: 'L’avis', paras: ['Astro utilise le nom de slot notice pour ses propres slots et supprime l’attribut ; le composant place donc votre avis dans un wrapper que le widget reprend. Le CSS de votre page lui donne son style.'] },
          { id: 'twice', title: 'Deux fois sur une page', paras: ['Si vous utilisez le composant deux fois sur une page, la balise script apparaît deux fois ; le second chargement ne fait rien. Réglez les variables publiques dans l’environnement de votre build ou dans un fichier d’environnement que vous ne versionnez pas ; elles sont publiques par conception.'] },
        ] as Section[],
        state: ['La CI de Connect construit l’exemple avec Astro 7.3.5 et fait tourner la page construite dans trois moteurs de navigateur contre la build d’exemple : le widget démarre, affiche l’avis, reprend le thème, et Astro a laissé la balise script tranquille. Il n’a pas encore tourné contre un espace réel tel quel. Aucune intégration Astro empaquetée n’est construite.'],
      },
    },
  },
};
