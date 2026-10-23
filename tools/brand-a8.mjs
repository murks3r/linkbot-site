/* Concept A8's brand exploration: three palettes, each a full set of tokens, each proven for WCAG
   AA with the same relative-luminance maths as the app's tools/design/palette.cjs (body text on
   the ground 7:1, other text 4.5:1, non-text 3:1; a miss fails the run).

     node tools/brand-a8.mjs            print the three palettes and their contrast tables
     node tools/brand-a8.mjs --write    write src/styles/brand-a8.css (the variant blocks keyed on
                                        html[data-v-palette]) and brand-a8-contrast.json

   The default palette "a7" is A7's own (the site's palette.css, synced from the app); the two
   alternatives override only the site's semantic tokens (--paper, --ink, --green, --pink …), so
   the switcher can show them without touching the app's generated block. */
import { writeFileSync } from 'node:fs';

const hex = v => [1, 3, 5].map(i => parseInt(v.slice(i, i + 2), 16));
const toHex = rgb => '#' + rgb.map(c => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('');
const over = (top, alpha, under) => toHex(hex(top).map((c, i) => c * alpha + hex(under)[i] * (1 - alpha)));
const lum = v => { const [r, g, b] = hex(v).map(c => { const s = c / 255; return s <= .03928 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + .05) / (lo + .05); };

/* Each palette: four anchors (paper ground, paper surface, the ink that is also the action green,
   the pink spot) and seven light pigments for the atmosphere; everything else is derived by
   laying one anchor over another, exactly as the app's palette does. */
export const PALETTES = {
  a7: { name: 'A7, refined', why: 'The direction the founder likes, kept: warm paper, one deep organic green as ink and action, pink for the one primary action. Refined only in what A8 changes around it (field radius, spacing, the paper).',
    paper: '#fbf8f1', surface: '#fffdf9', ink: '#123a2c', pink: '#ff9dbb', onPink: '#123a2c',
    air: { sun: '#fed371', peach: '#fdc192', coral: '#fdbca9', rose: '#fdcfd9', sky: '#aecef8', sage: '#bcd3b5', leaf: '#9cdcb8' },
    strengths: ['proven in A5-A7 and in the app', 'the warm paper carries the material', 'pink reads as the one action'], weaknesses: ['the green is close to black at text sizes', 'the atmosphere does most of the colour work'] },
  moss: { name: 'Moss and blush', why: 'The same family, one step more organic: a slightly cooler, mossier green with more life in it, a lighter stone paper, and the pink warmed towards blush so it sits closer to the green. The atmosphere leans to sage and leaf.',
    paper: '#f3f4ea', surface: '#fbfbf4', ink: '#124131', pink: '#ffafc0', onPink: '#124131',
    air: { sun: '#f6d58a', peach: '#f7c9a2', coral: '#f6c2ad', rose: '#f9d2d8', sky: '#b7d3ee', sage: '#bbd3b0', leaf: '#a2dcba' },
    strengths: ['more visibly green in large surfaces', 'calmer paper for long pages', 'blush and moss read as one world'], weaknesses: ['less contrast between paper and the action pink', 'the greener ink costs a little readability at small sizes (still 7:1 on the ground)'] },
  ink: { name: 'Ink and coral', why: 'The bolder sibling: the green goes deeper towards ink-black for maximum authority, the paper a touch whiter, and the pink shifts to a coral that carries more energy against the dark ink. For a brand that wants to feel more editorial.',
    paper: '#fdfcf8', surface: '#ffffff', ink: '#0b2820', pink: '#ff8e9c', onPink: '#0b2820',
    air: { sun: '#ffd25e', peach: '#ffbb85', coral: '#ffb29b', rose: '#ffc9d1', sky: '#a4c9f8', sage: '#bfd6b6', leaf: '#98dcb4' },
    strengths: ['strongest text contrast', 'coral and ink feel decisive', 'whiter paper lets the pigments sing'], weaknesses: ['less warmth in the ground', 'coral competes more with the atmosphere\'s coral and peach', 'furthest from what the founder has already seen'] },
};

function derive(p) {
  const t = {
    '--paper': p.paper, '--lb-cream': p.paper, '--surface': p.surface, '--ink': p.ink, '--green': p.ink,
    '--ink-2': over(p.ink, .84, p.paper), '--ink-3': over(p.ink, .76, p.paper),
    '--line': over(p.ink, .11, p.paper), '--line-strong': over(p.ink, .2, p.paper), '--line-ink': over(p.ink, .55, p.paper),
    '--sand': over(p.ink, .04, p.paper), '--sand-2': over(p.ink, .08, p.paper), '--mist': over(p.ink, .06, p.paper),
    '--green-hover': over(p.surface, .14, p.ink), '--green-press': over(p.surface, .06, p.ink), '--green-wash': over(p.ink, .08, p.paper),
    '--green-line': over(p.ink, .36, p.paper), '--green-rule': over(p.surface, .28, p.ink),
    '--on-green': p.paper, '--on-green-2': over(p.paper, .78, p.ink),
    '--pink': p.pink, '--pink-hover': over(p.ink, .07, p.pink), '--pink-press': over(p.ink, .13, p.pink), '--on-pink': p.onPink,
    '--blush': over(p.pink, .3, p.surface), '--sage': over(p.ink, .09, p.paper), '--dawn': over('#fdc192', .5, p.surface),
    ...Object.fromEntries(Object.entries(p.air).map(([k, v]) => [`--lb-air-${k}`, v])),
  };
  return t;
}

/* The pairs that must hold, as in the app's proof: ink on every ground 7:1, secondary inks 4.5:1, on-green
   and on-pink 4.5:1, the ink line 3:1 on paper and surface (lines on tinted grounds are decoration, as in
   A7 itself), every atmosphere pigment 7:1 for ink and 4.5:1 for secondary ink. */
function prove(name, t) {
  const pairs = [];
  const need = (fg, bg, min, label) => pairs.push({ label, fg, bg, min, ratio: +ratio(t[fg] ?? fg, t[bg] ?? bg).toFixed(2) });
  for (const g of ['--paper', '--surface', '--sand', '--mist', '--green-wash', '--blush']) { need('--ink', g, 7, `ink on ${g}`); need('--ink-2', g, 4.5, `ink-2 on ${g}`); need('--ink-3', g, 4.5, `ink-3 on ${g}`); }
  for (const g of ['--paper', '--surface']) need('--line-ink', g, 3, `line-ink on ${g}`);
  need('--on-green', '--green', 7, 'on-green on green'); need('--on-green-2', '--green', 4.5, 'on-green-2 on green'); need('--on-pink', '--pink', 4.5, 'on-pink on pink'); need('--on-pink', '--pink-hover', 4.5, 'on-pink on pink-hover'); need('--green', '--paper', 3, 'green on paper (non-text)'); need('--pink', '--paper', 1.3, 'pink against paper (a spot, not a signal)');
  for (const k of Object.keys(t).filter(k => k.startsWith('--lb-air-'))) { need('--ink', k, 7, `ink on ${k}`); need('--ink-2', k, 4.5, `ink-2 on ${k}`); }
  const fails = pairs.filter(p => p.ratio < p.min);
  return { pairs, fails };
}

const out = {}; let css = `/* Generated by tools/brand-a8.mjs: Concept A8's palette variants, keyed on the preview's switcher\n   (html[data-v-palette]). The default (a7) is the site's own palette; nothing here changes it. Every\n   pair is proven in tools/brand-a8-contrast.json. Do not edit by hand. */\n`;
let failed = false;
for (const [key, p] of Object.entries(PALETTES)) {
  const t = derive(p), { pairs, fails } = prove(key, t);
  out[key] = { name: p.name, tokens: t, pairs, lowest: Math.min(...pairs.map(x => x.ratio)) };
  if (fails.length) { failed = true; console.error(`${key}: ${fails.length} pair(s) below their minimum: ` + fails.map(f => `${f.label} ${f.ratio}<${f.min}`).join(', ')); }
  else console.log(`${key} (${p.name}): ${pairs.length} pairs pass, lowest ${out[key].lowest}`);
  if (key !== 'a7') css += `html[data-v-palette='${key}'] {\n${Object.entries(t).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
}
if (process.argv.includes('--write')) { writeFileSync(new URL('../src/styles/brand-a8.css', import.meta.url), css); writeFileSync(new URL('./brand-a8-contrast.json', import.meta.url), JSON.stringify(out, null, 1) + '\n'); console.log('written'); }
if (failed) process.exit(1);
