/* fr: the home's words (src/front/copy.ts); the page's sentences are the site's. Not yet read by a native speaker
   (docs/truth-check.md). */
import type { FrontCopy } from '../copy.ts';
import { PUBLIC_NAME } from '../../i18n/terms.ts';

export const fr: FrontCopy = {
  landing: {
    meta: {
      title: `${PUBLIC_NAME} pour les développeurs : la confiance avant la rencontre, dans votre plateforme`,
      description: `Intégrez ${PUBLIC_NAME} avec un script et un élément, ou bâtissez votre interface sur la Space API. Essayez « les deux disent oui » avec deux entreprises fictives.`,
    },
    opening: {
      h1: 'La confiance avant la rencontre, intégrée à votre plateforme.',
      sub: {
        today: `${PUBLIC_NAME} confirme chaque côté, rapproche en privé et ne met deux entreprises en relation que si les deux disent oui.`,
        full: `${PUBLIC_NAME} contrôle qui est réel, rapproche en privé et ne met deux entreprises en relation que si les deux disent oui.`,
      },
      start: 'Démarrer en 5 minutes',
      docs: 'Lire la documentation',
    },
    trial: {
      h2: 'Essayez : un acheteur, un fournisseur',
      label: 'Données d’exemple inventées · fonctionne dans votre navigateur, rien n’est envoyé',
      steps: ['Contrôle', 'Rapprochement en privé', 'Les deux disent oui'],
      progress: 'Étapes',
      buyer: { role: 'Acheteur', name: 'Northfield Fittings', wants: 'Cherche', text: 'Boîtiers en aluminium, 5 000 par an, ISO 9001, livraison dans l’UE' },
      supplier: { role: 'Fournisseur', name: 'Lakeside Castings', wants: 'Propose', text: 'Pièces en aluminium moulées sous pression dès 1 000 pièces, ISO 9001, expédition dans toute l’UE' },
      hidden: 'Nom masqué',
      email: 'Adresse e-mail',
      check: {
        title: 'Chaque côté confirme son contact',
        p: 'Chaque côté confirme ce qu’il a demandé et ouvre un lien envoyé à son adresse e-mail. Rien n’est enregistré avant sa confirmation.',
        pending: 'Pas encore confirmée',
        done: 'Confirmée par un lien',
        button: 'Confirmer',
        next: 'Chercher une correspondance',
      },
      match: {
        title: 'Une correspondance possible, sans noms',
        p: `${PUBLIC_NAME} compare les deux critère par critère. Chaque côté voit les verdicts, jamais le nom ni le contact de l’autre.`,
        card: 'Correspondance possible',
        criteria: [
          { label: 'Matériau', value: 'Aluminium', verdict: 'meets' },
          { label: 'Quantité', value: '5 000 par an ; dès 1 000 pièces', verdict: 'meets' },
          { label: 'Certificat', value: 'ISO 9001', verdict: 'meets' },
          { label: 'Livraison', value: 'Dans l’UE', verdict: 'meets' },
          { label: 'Procédé', value: 'Moulage sous pression ; la demande ne le dit pas', verdict: 'unknown' },
        ],
        verdicts: { meets: 'Correspond', partly: 'Correspond en partie', conflicts: 'Contredit', unknown: 'Inconnu' },
        approved: 'Une personne désignée de la plateforme a approuvé cette correspondance possible. L’approbation ne révèle rien.',
        next: 'Demander aux deux côtés',
      },
      yes: {
        title: 'Les deux disent oui, ou personne n’apprend rien',
        p: 'Chaque côté répond seul. Tant que les deux n’ont pas dit oui, aucun ne sait qui est l’autre.',
        ask: { buyer: 'Être mis en relation avec ce fournisseur ?', supplier: 'Être mis en relation avec cet acheteur ?' },
        yes: 'Oui',
        no: 'Non',
        waiting: 'Oui. En attente de l’autre côté, qui ne voit pas cette réponse.',
        said: 'Non.',
        introduced: 'Mis en relation. Les deux ont dit oui ; c’est seulement maintenant que les noms et les adresses e-mail sont transmis.',
        mode: 'Montré ici comme une mise en relation directe ; une plateforme peut aussi faire la mise en relation par sa propre équipe.',
        declined: 'Pas de mise en relation. Un côté a dit non, donc aucun ne sait qui est l’autre.',
        reset: 'Recommencer',
      },
    },
    embed: {
      h2: 'L’intégration la plus courte',
      p: 'Un script et un élément sur votre page ; les questions s’adaptent à votre marché.',
      hosted: 'Accès hébergé pour d’autres plateformes',
      developers: 'Pour les développeurs',
      docs: 'Toute la documentation',
    },
    bottom: {
      h2: `Vous ne développez pas ? Ce qu’est ${PUBLIC_NAME}, en mots simples.`,
      button: 'À lire sur sensalio.de',
      line: 'Tout ce qui est montré ici fonctionne avec des données fictives ; contrôlé le {date}.',
      status: 'L’état complet',
    },
    labels: { live: 'Live', soon: 'Bientôt' },
  },
};
