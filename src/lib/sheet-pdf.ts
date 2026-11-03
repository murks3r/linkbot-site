/* The one-page sheet as an A4 PDF, drawn at build time from the same structure as the print page (src/lib/sheet.ts),
   with the site's own typefaces (src/lib/brand-fonts.ts) embedded as subsets, so its text can be selected and searched.
   It is one page by construction: a column that does not fit, or a character a typeface lacks, stops the build. The
   file's dates are the day of the status check, so the same sources give the same file. */
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { brandFonts } from './brand-fonts';
import { STATUS_CHECKED } from '../i18n/status-date';
import type { Block, Sheet, SheetSection } from './sheet';

const A4 = { width: 595.28, height: 841.89 } as const;
const M = 36;
const GAP = 24;
const COL = (A4.width - 2 * M - GAP) / 2;
const hex = (value: string) => rgb(...([1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16) / 255) as [number, number, number]));
const C = { ink: hex('#15171a'), ink2: hex('#4a4f55'), line: hex('#cfd1cb') };
const TEXT = { size: 7.6, leading: 9.6 };

interface Run { text: string; font: PDFFont; size: number }
interface Fonts { display: PDFFont; text: PDFFont }

/** Words of runs set into lines no wider than `width`; a run keeps its font across the break. */
const wrap = (runs: Run[], width: number): Run[][] => {
  const lines: Run[][] = [[]];
  let x = 0;
  for (const run of runs) for (const word of run.text.split(/\s+/).filter(Boolean)) {
    const line = lines[lines.length - 1];
    const space = line.length ? run.font.widthOfTextAtSize(' ', run.size) : 0;
    const w = run.font.widthOfTextAtSize(word, run.size);
    if (line.length && x + space + w > width) { lines.push([{ ...run, text: word }]); x = w; continue; }
    const last = line[line.length - 1];
    if (last && last.font === run.font && last.size === run.size) last.text += ` ${word}`;
    else line.push({ ...run, text: line.length ? ` ${word}` : word });
    x += space + w;
  }
  return lines;
};

/** A frame drawn from the top down, one column after another; past the last column's floor it stops the build. */
interface Box { x: number; top: number; floor: number }
class Frame {
  private box = 0;
  private y: number;
  constructor(private page: PDFPage, private boxes: Box[], private width: number, private name: string) { this.y = boxes[0].top; }

  private get x() { return this.boxes[this.box].x; }

  private take(height: number) {
    if (this.y - height < this.boxes[this.box].floor && this.box < this.boxes.length - 1) { this.box += 1; this.y = this.boxes[this.box].top; }
    this.y -= height;
    const floor = this.boxes[this.box].floor;
    if (this.y < floor) throw new Error(`the one-page sheet does not fit one page: the ${this.name} overflows by ${Math.ceil(floor - this.y)} pt`);
  }

  /** Moves to the next column unless `height` still fits in this one: keeps a heading with its first lines. */
  keep(height: number) {
    if (this.y - height < this.boxes[this.box].floor && this.box < this.boxes.length - 1) { this.box += 1; this.y = this.boxes[this.box].top; }
  }

  line(runs: Run[], leading: number, indent = 0, color = C.ink, marker?: Run) {
    this.take(leading);
    const base = this.y + (leading - TEXT.size) / 2 + 1;
    if (marker) this.page.drawText(marker.text, { x: this.x, y: base, font: marker.font, size: marker.size, color: C.ink2 });
    let x = this.x + indent;
    for (const run of runs) {
      this.page.drawText(run.text, { x, y: this.y + (leading - run.size) / 2 + 1, font: run.font, size: run.size, color });
      x += run.font.widthOfTextAtSize(run.text, run.size);
    }
  }

  lines(runs: Run[], leading: number, indent = 0, color = C.ink, marker?: Run) {
    wrap(runs, this.width - indent).forEach((line, index) => this.line(line, leading, indent, color, index ? undefined : marker));
  }

  /** Space between pieces; dropped at the top of a column. */
  space(height: number) { if (this.y !== this.boxes[this.box].top) this.take(height); }

  rule(thickness = 0.6, color = C.line) {
    this.page.drawLine({ start: { x: this.x, y: this.y }, end: { x: this.x + this.width, y: this.y }, thickness, color });
  }

  /** Where the next line starts. */
  get cursor() { return this.y; }
}

const block = (column: Frame, fonts: Fonts, item: Block) => {
  const text = (value: string): Run => ({ text: value, font: fonts.text, size: TEXT.size });
  if (item.kind === 'para') column.lines([text(item.text)], TEXT.leading, 0, C.ink2);
  if (item.kind === 'list') for (const entry of item.items) {
    column.lines([text(entry)], TEXT.leading, 9, C.ink, text('–'));
    column.space(1.5);
  }
  if (item.kind === 'terms') for (const term of item.items) {
    column.lines([{ text: `${term.name} `, font: fonts.display, size: TEXT.size }, text(term.text)], TEXT.leading);
    column.space(1.5);
  }
  column.space(2);
};

const section = (column: Frame, fonts: Fonts, s: SheetSection) => {
  column.space(5);
  column.keep(13 + 4 + 3 * TEXT.leading);
  column.rule(1, C.ink);
  column.space(2);
  column.lines([{ text: s.title, font: fonts.display, size: 10 }], 13);
  column.space(2);
  for (const item of s.blocks) block(column, fonts, item);
};

/** Every character of the sheet must be in its typefaces; a missing one would print as an empty box. */
const assertGlyphs = (sheet: Sheet, fonts: Fonts) => {
  const have = new Set([...fonts.text.getCharacterSet(), ...fonts.display.getCharacterSet()]);
  const missing = [...new Set(JSON.stringify(sheet))].filter(ch => ch.trim() && !have.has(ch.codePointAt(0)!));
  if (missing.length) throw new Error(`the one-page sheet (${sheet.lang}) uses characters its typefaces lack: ${missing.join(' ')}`);
};

/** The sheet as the bytes of a one-page A4 PDF. */
export const renderSheetPdf = async (sheet: Sheet): Promise<Uint8Array> => {
  const files = await brandFonts();
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fonts: Fonts = { display: await doc.embedFont(files.display, { subset: true }), text: await doc.embedFont(files.text, { subset: true }) };
  assertGlyphs(sheet, fonts);
  const day = new Date(`${STATUS_CHECKED}T00:00:00Z`);
  doc.setTitle(`${sheet.title} · ${sheet.date}`, { showInWindowTitleBar: true });
  doc.setLanguage(sheet.lang);
  doc.setAuthor(sheet.brand);
  doc.setCreator(sheet.brand);
  doc.setProducer(sheet.brand);
  doc.setCreationDate(day);
  doc.setModificationDate(day);

  const page = doc.addPage([A4.width, A4.height]);
  const full = A4.width - 2 * M;
  const head = new Frame(page, [{ x: M, top: A4.height - M, floor: M }], full, 'header');
  head.lines([{ text: sheet.title, font: fonts.display, size: 24 }], 28);
  head.lines([{ text: sheet.claim, font: fonts.text, size: 11 }], 15, 0, C.ink2);
  head.space(4);
  head.lines([{ text: sheet.dated, font: fonts.text, size: TEXT.size }], TEXT.leading, 0, C.ink2);
  head.space(12);

  /* The foot is set first, from the bottom up, so the columns know their floor. */
  const footRuns = (label: string, value: string): Run[] => [{ text: `${label}: `, font: fonts.display, size: 7.5 }, { text: value, font: fonts.text, size: 7.5 }];
  const foot = [footRuns(sheet.contact.label, sheet.contact.text), [{ text: sheet.synthetic, font: fonts.text, size: 7.5 }], footRuns(sheet.more.label, sheet.more.url)];
  const footHeight = foot.reduce((sum, runs) => sum + wrap(runs, full).length * 9.6 + 3, 8);
  const footer = new Frame(page, [{ x: M, top: M + footHeight, floor: M }], full, 'foot');
  footer.rule();
  footer.space(4);
  for (const runs of foot) { footer.lines(runs, 9.6, 0, C.ink2); footer.space(3); }

  const floor = M + footHeight + 8;
  const body = new Frame(page, [0, 1].map(index => ({ x: M + index * (COL + GAP), top: head.cursor, floor })), COL, 'two columns');
  for (const s of sheet.sections) section(body, fonts, s);
  return doc.save({ useObjectStreams: false });
};
