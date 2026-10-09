import { GLYPHS, type GlyphDef, type GlyphName } from './glyphs.ts';

interface GlyphProps {
  name: GlyphName;
  size?: number;
  className?: string;
  /** When set, the glyph is exposed to assistive tech under this name. */
  title?: string;
}

/** Render one shared glyph definition. Decorative by default. */
export function Glyph({ name, size = 12, className, title }: GlyphProps) {
  const def: GlyphDef = GLYPHS[name];
  const strokeWidth = def.strokeWidth ?? 1.4;
  return (
    <svg
      viewBox={def.viewBox}
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {(def.stroke ?? []).map((d, i) => (
        <path
          key={`s${i}`}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {(def.fill ?? []).map((d, i) => (
        <path key={`f${i}`} d={d} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}
