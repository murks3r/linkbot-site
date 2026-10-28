# a2 — Wir haben unseren Matcher gegen eine Stichwortsuche gemessen — und auf diesem Pool verloren

```yaml
title: "Wir haben unseren Matcher gegen eine Stichwortsuche gemessen — und auf diesem Pool verloren"
pillar: Agency
language: DE (EN method summary included below the article)
status: DRAFT — not published; evidence-check + owner review required
date: 2026-10-09
target keyword family: evidenzbasierte Shortlist · Kandidaten-Matching messen · Recruiting-Software Vergleich · UNKNOWN
derivatives: P4 (LinkedIn DE), N1 (newsletter main item), Reddit method answer (rules permitting)
```

---

**Kurzfassung:** Wir haben unsere Kandidaten-Bewertung gegen einen einfachen Booleschen Stichwort-Abgleich getestet — 3 echte Mandats-Briefs, 24 synthetische Profile, 72 blinde Bewertungen. Die Stichwortsuche war bei roher Trefferquote besser: 3,67 vs. 2,67 relevante Treffer in den Top 10. Was sie nicht liefert: eine einzige Begründung (Erklärungsabdeckung 1,0 bei uns vs. 0,0 baseline). Wir veröffentlichen beide Ergebnisse — weil genau diese Unterscheidung der Punkt ist.

## Warum wir gegen einen Gegner testen, der „dümmer“ ist

Der ehrlichste Test für ein Ranking ist nicht ein Vergleich mit einem anderen Produkt (deren Daten wir nicht haben), sondern der Vergleich mit der Methode, die jeder Recruiter in fünf Minuten selbst hinbekommt: Stichwortlisten, UND/ODER verknüpft. Wenn wir dagegen verlieren, will man wissen warum — und wenn wir gewinnen, auch.

## Methode

- **Mandate:** 3 echte, öffentlich einsehbare Briefs (u. a. Data Platform Engineer), interpretiert zu strukturierten Kriterien — harte Anforderungen vs. Präferenzen, fehlende Angaben bleiben `UNKNOWN`.
- **Kandidaten:** 24 synthetische Profile (bewusst stichwortnah formuliert — siehe Interpretation).
- **Bewertung:** 72 Bewertungen, score-blind (wer bewertet, sieht nicht, welches System die Reihenfolge erzeugt hat).
- **Baseline:** Boolescher Stichwort-Abgleich über dieselben interpretierten Kriterien.
- **Reproduzierbar:** `evaluation/agency_benchmark.py` (Repo `murks3r/linkbot`, Branch `velocity/supply-matching`, Stand `0eaa83b`; Rohergebnis: `local-reports/agency/agency-eval.json`).

## Ergebnisse

| Metrik | Unser Review-Layer | Stichwort-Baseline |
|---|---|---|
| Relevante Treffer in Top 10 | 2,67 | **3,67** |
| Precision@10 | 0,267 | **0,367** |
| Nützliche Treffer in Top 10* | 4,67 | **6,67** |
| Recall@10 | 0,667 | **0,917** |
| Erster relevanter Treffer (Rang) | 3,0 | **1,0** |
| Aktionen bis 3 relevante Treffer | 7,67 | **7,0** |
| Mandate, die das Ziel erreichten | 1 von 3 | **3 von 3** |
| **Erklärungsabdeckung** | **1,0** | 0,0 |
| Nicht belegte Behauptungen | 0 | 0 |
| Verarbeitungszeit (gemessen) | ~22 ms/Mandat | — |

*„Nützlich“ = relevant oder als prüfenswert markiert. Die Zeile „Aktionen bis 3 relevante“ ist zensiert: Erreicht ein System das Ziel nicht, wird es nicht durch Weglassen des Falls beschönigt.

## Drei Dinge, die wir daraus mitnehmen

**1. Synthetische Profile flanieren die Stichwortsuche.** Unser Testpool ist bewusst stichwortnah — genau die Umgebung, in der Boolesche Suche glänzt. Das ist kein Ausredesatz: Es heißt, dass dieser Benchmark *die Baseline systematisch bevorzugt*, und dass ein echter Pool (freie Formulierungen, implizite Fähigkeiten) andere Ergebnisse zeigen dürfte. Ob das stimmt, ist eine Hypothese, die wir mit echten Briefs testen — nicht ein Ergebnis, das wir behaupten.

**2. Der Unterschied liegt nicht in der Reihenfolge, sondern in der Verteidigungsfähigkeit.** Eine Shortlist ist eine Behauptung gegenüber dem Kunden: „Diese Person passt.“ Die Baseline produziert eine Reihenfolge ohne eine einzige Begründung (0,0 Erklärungsabdeckung). Unser Layer produziert zu jedem Kandidaten: was belegt ist, was abgeleitet wurde, was unbekannt bleibt — und **null nicht belegte Behauptungen**. Wenn Sie als Recruiter vor dem Kunden sitzen, entscheidet nicht Rang 1 vs. 3, sondern ob Sie jede Zeile erklären können.

**3. Messen hat unsere Fehler gefunden — nicht die Demo.** Folgende Defekte fanden wir *durch diesen Benchmark*, nicht durch Anschauen der Oberfläche: ein Zweibuchstaben-Feld wurde als Länderkennung gelesen („AI“ → Anguilla blockierte alle Kandidaten); lexikalische Ähnlichkeit schrieb unverwandte Skills als Beleg gut („figma“ ← „spark“); Anforderungs-Fenster waren unbegrenzt und schrieben ganze Absätze jedem Kriterium gut; nach einer Markt-Korrektur blieb das vorherige Land als harte Anforderung fixiert; ein Engineering-Manager-Profil rankte über IC-Kandidaten für ein IC-Mandat. Alles behoben — aber nur, weil gemessen wurde.

## Fragen, die Sie jedem Anbieter stellen sollten (nicht nur uns)

1. Gegen welche Baseline wurde euer Ranking getestet — und was war das Ergebnis?
2. Wie viel Prozent der angezeigten Aussagen sind Belege, wie viel Ableitung, wie viel Lücke?
3. Was passiert mit fehlenden Daten — Score, Ausschluss oder ehrliches `UNKNOWN`?
4. Was war das schlechteste Testergebnis, das ihr je hattet?

Wenn Anbieter 1 und 4 nicht beantworten können, ist ihre „KI“ eine Marketing-Ebene.

## Wie es weitergeht

- Nächster Benchmark: **echte Briefs, echte Recruiter-Urteile** — geplant zusammen mit den ersten Pilot-Agenturen; sie sitzen bei der Bewertung mit am Tisch.
- Bis dahin gilt für alle Zahlen in diesem Text: synthetischer Pool, Stand `0eaa83b`, reproduzierbar per Kommando. Keine Erfolgsversprechen, keine „Validierung“.

---

## EN method summary (for the English blog index / Product Hunt context)

> We benchmarked our evidence review layer against a Boolean keyword baseline on 3 real briefs × 24 synthetic profiles with 72 score-blind judgements. The baseline won raw top-10 relevance (3.67 vs 2.67 relevant in top 10; 3/3 vs 1/3 mandates reaching target); our layer won explanation coverage (1.0 vs 0.0) with zero unsupported claims and ~22 ms per mandate. We publish both — the pool is synthetic and keyword-literal, so it favours the baseline; the differentiator we build and test is defensibility, not leaderboard rank. Reproduce: `evaluation/agency_benchmark.py` @ `0eaa83b`.

## Sources & provenance

- All numbers: `local-reports/agency/agency-eval.json`, repo `murks3r/linkbot`, branch `velocity/supply-matching`, commit `0eaa83b` (repository fact; raw file re-verified 2026-10-09).
- Defect list and benchmark design: commit `d6d44ff` message + `AGENCY_PILOT.md` (repository fact).
- No external statistics are cited in this article; no client, candidate, or employer is identifiable.

## Review gates before publication

- [ ] Re-run the benchmark on the current commit; if numbers moved, update table or add "as of" note — never publish stale numbers as current.
- [ ] Decide on the public reproduction path for a private repo (options: published gist of the eval JSON, redacted print, or method-only note). Do not publish repo internals beyond what's agreed.
- [ ] Native-speaker read of the German text; check tone (no self-loathing, no hedging beyond the facts).
- [ ] Owner sign-off logged.
