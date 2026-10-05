import { existsSync } from "node:fs";

/**
 * Versión móvil del hero (768×432, ~30 KB) que el panel genera junto a cada
 * hero.webp (1920×1080, 150-220 KB). Si no existe, null y se usa la grande.
 * En PageSpeed móvil la imagen grande del hero era el LCP (≈5 s).
 */
export function heroMovil(src: string): string | null {
  const sm = src.replace(/\.webp$/, "-sm.webp");
  if (sm === src || !src.startsWith("/")) return null;
  return existsSync(`public${sm}`) ? sm : null;
}
