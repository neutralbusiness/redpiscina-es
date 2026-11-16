import type { APIRoute } from "astro";
import { NETWORK } from "../lib/network.ts";
import { POSTS } from "../lib/wwwblog.ts";

// Fecha del último cambio de contenido de la portada (se actualiza a mano al tocarla).
const HOME_UPDATED = "2026-11-16";

export const GET: APIRoute = () => {
  const base = `https://www.${NETWORK.domain}`;
  const lastPost = POSTS.map((p) => p.updated || p.publishDate).sort().pop() || HOME_UPDATED;
  const urls = [
    { loc: `${base}/`, lastmod: HOME_UPDATED > lastPost ? HOME_UPDATED : lastPost },
    { loc: `${base}/blog/`, lastmod: lastPost },
    ...POSTS.map((p) => ({ loc: `${base}/blog/${p.slug}/`, lastmod: p.updated || p.publishDate })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
