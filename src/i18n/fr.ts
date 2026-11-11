/* Les textes du site en français : traduction du catalogue anglais src/i18n/en.ts. */
import type { Catalogue } from './en.ts';
import { statusDate } from './status-date.ts';
import { PUBLIC_NAME } from './terms.ts';

/** The day the status sentences were checked, in this language (status-date.ts). */
const AS_OF = statusDate('fr');

export const fr: Catalogue = {
  site: {
    name: PUBLIC_NAME,
    claim: 'La confiance entre deux entreprises avant qu’elles se rencontrent.',
    skip: 'Aller au contenu',
    menu: 'Menu',
    toc: 'Sur cette page',
    language: 'Langue',
    nav: { docs: 'Documentation', developers: 'Développeurs' },
    footer: {
      product: PUBLIC_NAME,
      legal: 'Informations légales',
      imprint: 'Mentions légales',
      privacy: 'Notice de confidentialité',
      contact: 'Contact',
      contactPending: `Les coordonnées sont en préparation, ce site n’indique donc encore aucune adresse et n’a pas de formulaire de contact.`,
      line: 'Ce site ne dépose aucun cookie, ne charge rien de tiers et n’utilise aucune mesure d’audience.',
    },
    synthetic: 'Tout sur ce site décrit le contrat Space API et ce qui tourne sur l’espace de test synthétique, avec des données synthétiques. Aucune personne réelle et aucune organisation réelle ne l’utilise encore.',
  },

  developers: {
    title: 'Pour les développeurs : intégrer le widget ou bâtir sur Space API',
    description: 'Où se trouve la documentation de Connect, l’intégration la plus courte, un court exemple SDK pour votre serveur, et ce qui manque encore : npm et MCP.',
    eyebrow: 'Pour les développeurs',
    h1: ['Un script,', 'ou votre propre interface.'],
    lede: `Deux façons de bâtir avec un espace : l’intégration, un script et un élément sur votre page, ou votre propre interface sur Space API par le SDK, un client typé par le contrat. La documentation de Connect montre les deux. Au ${AS_OF}, elle se trouve dans le dépôt de Connect, qui n’est pas encore public.`,
    toc: [['embed', 'L’intégration la plus courte'], ['sdk', 'Le SDK sur votre serveur'], ['docs', 'La documentation'], ['not-yet', 'Pas encore disponible']] as [string, string][],
    embed: {
      title: 'L’intégration la plus courte',
      lede: 'Placez-la là où le formulaire doit apparaître : votre clé publiable dans l’élément, l’adresse de votre espace dans le script.',
      url: 'EMBED_URL désigne cette adresse, sur l’instance propre à votre espace ; il n’y a pas d’hôte central :',
      notes: [
        'Le mode est describe, board, watch ou mine ; le côté est seeking ou offer. Sans langue, le widget suit le navigateur du visiteur.',
        'La clé publiable ne fonctionne que sur les origines que votre espace autorise. Une clé secrète n’a jamais sa place dans une page : le widget refuse de démarrer avec elle.',
        `Au ${AS_OF}, l’instance de l’espace de test synthétique sert la version 0.6.1-v1 du widget.`,
      ],
    },
    sdk: {
      title: 'Le SDK sur votre serveur',
      lede: 'Une fois, depuis votre serveur, avec la clé secrète : il enregistre votre récepteur de webhooks et renvoie le secret de signature, montré cette seule fois.',
      notes: [
        `Au ${AS_OF}, le SDK n’est pas sur npm. On l’utilise depuis un clone du dépôt de Connect, où il est un paquet du workspace.`,
        `Le test de cet exemple tourne contre un substitut, pas contre un espace. Au ${AS_OF}, l’espace de test n’envoie pas de webhooks.`,
      ],
    },
    docs: {
      title: 'La documentation',
      lede: `Générée sur ce site à partir de l’export open core du dépôt Connect, en anglais. Au ${AS_OF}, le dépôt lui-même est privé et rien n’en est publié.`,
      sections: {
        quickstart: { name: 'Démarrage rapide (5 minutes)', body: 'Une balise script, votre clé publiable et l’origine de votre page ; puis le démarrage rapide complet et le parcours d’une personne à travers l’API.' },
        widget: { name: 'Widget', body: 'Chaque attribut de l’embed, le wrapper React et des recettes pour HTML simple, Astro, Next.js et WordPress.' },
        sdk: { name: 'SDK', body: 'Les clients typés pour votre serveur et pour le côté de la personne, et le contrôle de la signature des webhooks.' },
        cli: { name: 'CLI', body: 'La commande linkbot : essayer le widget sur votre machine, l’intégrer à votre site, vérifier la configuration. Pas encore publiée.' },
        protocol: { name: 'Protocole', body: 'Le contrat de la Space API, les trois étapes qu’il respecte et qui détient quelle clé.' },
        api: { name: 'Référence de l’API', body: 'Chaque route de la Space API, générée à partir du contrat.' },
        open: { name: 'Ce qui est ouvert, ce qui est hébergé', body: 'Ce qu’une plateforme fait tourner elle-même et ce qui reste au service hébergé.' },
      },
    },
    notYet: {
      title: 'Pas encore disponible',
      items: [
        `Paquets npm : le SDK, le wrapper React et les paquets Next.js et Astro ne sont pas publiés au ${AS_OF}. Aujourd’hui, ils tournent depuis un clone du dépôt de Connect.`,
        'MCP : prévu, pas construit. Il n’existe aucun point d’accès MCP à utiliser.',
        `Le dépôt lui-même : il est privé au ${AS_OF}.`,
        'Un espace pour essayer : aucun n’est encore proposé aux développeurs. Les exemples tournent contre un exemple local ou un substitut.',
      ],
    },
  },

  status: {
    title: 'Statut : ce qui tourne sur l’espace de test, ce qui est fait, ce qui est prévu',
    description: `Où en est chaque partie de ${PUBLIC_NAME}, d’après la liste de contrôle du site : sur l’espace de test synthétique, construite sans y tourner, ou prévue.`,
    eyebrow: 'Statut',
    h1: ['Où cela en est,', 'partie par partie.'],
    lede: `Contrôlé le ${AS_OF} d’après le rapport d’état de l’espace de test et le plan de Connect. Cette page est générée à partir de la liste de contrôle du site ; elle ne dit rien que cette liste ne dise.`,
    states: {
      test: { title: 'Sur l’espace de test', lead: 'Données synthétiques, en allemand et en anglais.' },
      built: { title: 'Construit ou dans le contrat, pas sur l’espace de test', lead: 'N’y tourne pas et n’est pas publié.' },
      planned: { title: 'Prévu, pas construit', lead: 'Aucune date promise.' },
    },
    items: {
      form: 'Décrire une demande ou une offre par formulaire, avec l’avis d’identité là où l’espace en a un',
      text: 'Décrire une demande ou une offre avec vos propres mots, lus par des règles fixes sans modèle',
      board: 'Le tableau, avec les valeurs simplifiées de l’espace, qui ne liste que ce que son propriétaire a choisi',
      watches: 'Les recherches ouvertes ; leurs e-mails vont dans une boîte de test et n’atteignent personne',
      control: 'Les réglages, origines, clés et l’entonnoir d’un espace, via la Space API',
      confirm: 'Confirmer ; le navigateur qui a confirmé gère ce qu’il a créé',
      matching: 'L’appariement avec un verdict par critère',
      gates: 'Les gates et l’approbation par un opérateur identifié',
      introductions: 'Les mises en relation en mode opérateur, avec reçus',
      outcomes: 'Les résultats, les changements, la mise en pause et la fermeture',
      deletion: 'La suppression avec le journal des suppressions de l’instance',
      widget: 'Le widget, servi par l’instance elle-même depuis une version épinglée (0.6.1-v1)',
      webhooks: 'Les webhooks vers le serveur de la plateforme : dans le contrat, et le SDK contrôle leurs signatures ; l’espace de test ne les envoie pas',
      mail: 'Les e-mails qui atteignent une vraie boîte ; ceux de l’espace de test vont dans une boîte de test',
      sdk: 'Le SDK et le wrapper React, dans le dépôt de Connect ; non publiés sur npm',
      console: 'La console pour l’équipe d’une plateforme ; non publiée',
      recipes: 'Des recettes pour WordPress, Next.js et Astro ; elles tournent en CI sur un build d’exemple et ne sont pas publiées comme paquets',
      reader: 'Un modèle qui lit le texte, à côté des règles fixes ; il attend une politique de lecture approuvée',
      mcp: 'MCP, pour qu’un agent IA prépare et qu’une personne confirme ; prévu, il n’y a pas d’endpoint',
      demo: 'Une démo du widget sur ce site ; elle attend un espace de démonstration avec des données synthétiques',
    },
    source: 'La source de chaque ligne se trouve dans docs/truth-check.md, dans le dépôt de ce site.',
    link: 'Le statut, partie par partie',
  },
  changelog: {
    title: `Nouveautés : les étapes du produit ${PUBLIC_NAME}, datées`,
    description: `Chaque étape de ${PUBLIC_NAME} qu’un client peut remarquer, datée, avec son état : sur l’espace de test synthétique, ou construite et pas encore disponible.`,
    eyebrow: 'Nouveautés',
    h1: ['Ce qui a changé,', 'étape par étape.'],
    lede: 'Une entrée par étape du produit qu’un client peut remarquer, la plus récente d’abord. Chacune dit si elle tourne sur l’espace de test synthétique ou si elle est construite et pas encore disponible. Rien de tout cela n’est encore publié pour de vrais utilisateurs.',
    states: { test: 'Sur l’espace de test', built: 'Construit, pas encore disponible' },
    note: 'Chaque entrée provient d’un fichier du dépôt de ce site qui nomme les pull requests sur lesquelles elle repose ; une entrée sans elles arrête la compilation.',
    link: 'Nouveautés',
  },

  privacy: {
    title: `Notice de confidentialité · ${PUBLIC_NAME}`,
    description: 'La notice de confidentialité est en préparation. Déjà vrai : le site ne dépose aucun cookie, ne charge rien de tiers et n’utilise aucune mesure d’audience.',
    eyebrow: 'Notice de confidentialité',
    h1: 'En préparation',
    lede: 'La notice de confidentialité de ce site est en cours de rédaction et de relecture. Elle apparaîtra ici une fois publiée. Rien n’est affiché d’ici là, car un texte juridique ne peut pas être rédigé au jugé.',
    released: { description: `La notice de confidentialité du site de ${PUBLIC_NAME} : ce que le site traite, pourquoi, sur quelle base juridique, et vos droits.` },
    facts: {
      title: 'Ce qui est déjà vrai de ce site',
      items: [
        'Il ne dépose aucun cookie et n’utilise ni mesure d’audience ni suivi.',
        'Il ne charge rien de tiers : les polices et les images viennent de ce site.',
        'Il n’a pas de compte et n’envoie nulle part rien de ce que vous tapez : les champs de la page d’accueil fonctionnent uniquement dans votre navigateur, et le site n’enregistre rien.',
        'Le produit tourne sur les pages propres d’une plateforme, sous l’avis de données de cette plateforme, à côté des lignes fixes du widget.',
      ],
    },
  },

  imprint: {
    title: `Mentions légales · ${PUBLIC_NAME}`,
    description: `Les mentions légales du site de ${PUBLIC_NAME} : éditeur et coordonnées. Le texte est en préparation.`,
    eyebrow: 'Mentions légales',
    h1: 'En préparation',
    lede: 'Les mentions légales (éditeur, adresse, représentants, registre et données fiscales, contact) sont en préparation et apparaîtront ici une fois confirmées. Rien n’est affiché d’ici là, car rien de cela ne peut être inventé.',
    released: { description: `Les mentions légales du site de ${PUBLIC_NAME} : éditeur, adresse, représentants, registre et données fiscales, et coordonnées.` },
  },

  contact: {
    title: `Contact · ${PUBLIC_NAME}`,
    description: `Comment joindre ${PUBLIC_NAME}. Les coordonnées sont en préparation : cette page indiquera l’adresse dès que sa boîte existera.`,
    eyebrow: 'Contact',
    h1: 'En préparation',
    released: { h1: 'Écrivez-nous', description: `Comment joindre ${PUBLIC_NAME} : l’adresse à laquelle écrire pour une question sur ${PUBLIC_NAME} ou sur un espace sur votre plateforme.` },
    write: 'Écrivez à {email}.',
  },

  notFound: {
    title: `Page introuvable · ${PUBLIC_NAME}`,
    description: 'Cette page n’existe pas. Allez à la page d’accueil, ou lisez le site dans une autre langue.',
    eyebrow: 'Page introuvable',
    h1: 'Il n’y a rien ici.',
    lede: 'La page a peut-être été déplacée.',
    home: 'Aller à la page d’accueil',
    languages: 'Ce site dans d’autres langues',
  },
};
