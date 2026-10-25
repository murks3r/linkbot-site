/* wawoff2 ships no types: the one function the build uses (src/lib/brand-fonts.ts). */
declare module 'wawoff2' {
  export function decompress(woff2: Uint8Array): Promise<Uint8Array>;
}
