/**
 * Sitemap Index (www.bmw-taller.es/sitemap-index.xml)
 *
 * Referencia el sitemap del propio www Y los sitemaps de cada subdominio
 * de ciudad. Esto da a Google un punto de entrada único para descubrir
 * las 561+ ciudades sin tener que rastrear cada subdomain por separado.
 *
 * Spec: https://www.sitemaps.org/protocol.html#index
 * "A Sitemap index file can include Sitemaps that are provided on
 *  different hosts, as long as both hosts are verified in Search Console."
 */
import type { APIRoute } from "astro";
import { NETWORK } from "../lib/network.ts";

interface CityRef { slug: string; }

export const GET: APIRoute = async () => {
  const mods = import.meta.glob<{ default: CityRef }>(
    "../content/cities/*.json",
    { eager: true },
  );
  const cities = Object.values(mods).map(m => m.default);
  cities.sort((a, b) => a.slug.localeCompare(b.slug));

  const base = `https://www.${NETWORK.domain}`;

  const entries = [
    `  <sitemap>\n    <loc>${base}/sitemap-www.xml</loc>\n  </sitemap>`,
    ...cities.map(
      c =>
        `  <sitemap>\n    <loc>https://${c.slug}.${NETWORK.domain}/sitemap.xml</loc>\n  </sitemap>`,
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</sitemapindex>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
