/* /faq en français (src/faq/en.ts est la source). Écrit par la lane, pas encore relu par un locuteur natif. */
import { statusDate } from '../i18n/status-date.ts';
import type { Faq } from './en.ts';

const AS_OF = statusDate('fr');

export const fr: Faq = {
  title: 'Questions sur Linkbot : ce que c’est et quel problème il résout',
  description: 'Ce qu’est Linkbot, le problème qu’il résout, « les deux disent oui », ce qu’il contrôle aujourd’hui, ce qui est open source ou hébergé, et pour qui.',
  eyebrow: 'Questions fréquentes',
  h1: 'Questions sur Linkbot',
  lede: 'Des réponses courtes, chacune vraie aujourd’hui. Ce qui est prévu le dit.',
  items: [
    {
      q: 'Qu’est-ce que Linkbot ?',
      a: [
        'Linkbot permet à deux entreprises qui ne se connaissent pas de se faire confiance avant de se rencontrer. Il fonctionne en trois étapes : un contrôle de chaque côté, un rapprochement en privé et une mise en relation seulement lorsque les deux disent oui.',
        'Une plateforme intègre Linkbot dans ses propres pages, avec un espace par marché.',
      ],
    },
    {
      q: 'Quel problème Linkbot résout-il ?',
      a: [
        'Dans le commerce B2B, se montrer coûte quelque chose quand l’enjeu est élevé. Un acheteur qui montre un besoin, ou un fournisseur qui montre ce qu’il peut livrer, le dit à tout le marché et ne sait pas qui, de l’autre côté, est réel.',
        'Ainsi, deux entreprises qui ne se connaissent pas ne peuvent pas se faire confiance avant de se rencontrer. Linkbot change cela : il confirme chaque côté et ne montre à chacun que les critères et un verdict par critère, jamais le nom ni le contact de l’autre, jusqu’à ce que les deux disent oui.',
      ],
    },
    {
      q: 'Comment fonctionne « les deux disent oui » ?',
      a: [
        'Après un rapprochement en privé, chaque côté voit une carte du board sans noms : les critères et un verdict par critère. Une personne identifiée de la plateforme approuve la correspondance possible ; l’approbation ne révèle rien.',
        'Ensuite chaque côté répond seul et ne voit pas la réponse de l’autre. Ce n’est que lorsque les deux disent oui que les noms et les adresses e-mail sont transmis, directement ou par l’équipe de la plateforme. Un non de l’un ou de l’autre ne révèle rien à l’autre, et le serveur refuse tout autre chemin vers une mise en relation.',
      ],
    },
    {
      q: 'Que contrôle Linkbot ?',
      a: [
        'Seulement ce qui fonctionne aujourd’hui : chaque côté confirme son adresse e-mail par un lien qui lui est envoyé, et rien n’est enregistré avant qu’il confirme.',
        'Les contrôles d’une entreprise par Linkbot lui-même, par exemple si elle est réelle, sont prévus et pas construits.',
      ],
    },
    {
      q: 'Qu’est-ce qui est open source et qu’est-ce qui est hébergé ?',
      a: [
        `Au ${AS_OF}, rien de Linkbot n’est publié en open source : le dépôt qui contient le widget et le SDK est privé, et le SDK n’est pas sur npm.`,
        'Le plan : le widget, le SDK, un outil en ligne de commande et la description du protocole deviennent open source, avec un démarrage rapide de cinq minutes. Les contrôles, l’historique contrôlé, le rapprochement et la facturation restent un service hébergé par Linkbot. La licence n’est pas encore choisie.',
        'Accès hébergé pour d’autres plateformes : bientôt.',
      ],
    },
    {
      q: 'À qui s’adresse Linkbot ?',
      a: [
        'Aux plateformes qui rapprochent des entreprises et ne veulent une mise en relation que là où les deux côtés la veulent, et aux acheteurs et fournisseurs qui s’y trouvent. Une plateforme l’ajoute avec un script et un élément sur sa page.',
        'Le premier espace est consacré aux minéraux industriels. Il fonctionne comme instance de test avec des données synthétiques ; aucune personne ni organisation réelle ne l’utilise encore.',
      ],
    },
  ],
  terms: {
    title: 'Les termes',
    lede: 'Les mots qu’utilise Linkbot, chacun avec un seul sens, le même sur ce site, dans le widget et dans la documentation.',
  },
};
