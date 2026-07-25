export interface SceneProgress { t: number; }

export function phaseOf(t: number): 'exposed' | 'horror' | 'lockdown' | 'matched' {
  if (t < 0.25) return 'exposed';
  if (t < 0.55) return 'horror';
  if (t < 0.8) return 'lockdown';
  return 'matched';
}

export function subProgress(
  t: number,
  start: number,
  end: number,
  ease: (x: number) => number = (x) => x,
): number {
  if (end <= start) return 0;
  const x = Math.min(1, Math.max(0, (t - start) / (end - start)));
  return ease(x);
}

export const ease = {
  inOut: (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
  out: (x: number) => 1 - Math.pow(1 - x, 3),
  in: (x: number) => x * x * x,
};
