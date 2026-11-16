import type { APIRoute, GetStaticPaths } from "astro";
import { NETWORK } from "../../lib/network.ts";

interface CityRef { slug: string; }

export const getStaticPaths: GetStaticPaths = async () => {
  const mods = import.meta.glob<{ default: CityRef }>("../../content/cities/*.json", { eager: true });
  return Object.values(mods).map(m => ({ params: { city: m.default.slug } }));
};

export const GET: APIRoute = async ({ params }) => {
  const base = `https://${params.city}.${NETWORK.domain}`;

  // Sin lastmod: la página no tiene una fecha de cambio fiable (antes se ponía
  // la del día de compilación). El blog solo existe en la www.

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
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
