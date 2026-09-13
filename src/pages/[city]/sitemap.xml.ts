import type { APIRoute, GetStaticPaths } from "astro";
import { NETWORK } from "../../lib/network.ts";

interface CityRef { slug: string; }

export const getStaticPaths: GetStaticPaths = async () => {
  const mods = import.meta.glob<{ default: CityRef }>("../../content/cities/*.json", { eager: true });
  return Object.values(mods).map(m => ({ params: { city: m.default.slug } }));
};

export const GET: APIRoute = async ({ params }) => {
  const base = `https://${params.city}.${NETWORK.domain}`;
  const lastmod = new Date().toISOString().slice(0, 10);

  // El blog de ciudad no entra en el sitemap: los artículos se publican una sola
  // vez en el blog de la www (www.<dominio>/blog/) y /blog/ de cada ciudad es noindex.

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${base}/llms.txt</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
