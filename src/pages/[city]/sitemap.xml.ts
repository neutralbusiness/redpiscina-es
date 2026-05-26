import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { NETWORK } from "../../lib/network.ts";

interface CityRef { slug: string; }

export const getStaticPaths: GetStaticPaths = async () => {
  const mods = import.meta.glob<{ default: CityRef }>("../../content/cities/*.json", { eager: true });
  return Object.values(mods).map(m => ({ params: { city: m.default.slug } }));
};

export const GET: APIRoute = async ({ params }) => {
  const base = `https://${params.city}.${NETWORK.domain}`;
  const lastmod = new Date().toISOString().slice(0, 10);

  // Blog posts visibles para esta ciudad = específicos de la ciudad + globales
  const all = await getCollection("blog");
  const cityPosts = all.filter(p => {
    const parts = p.id.split("/");
    if (parts.length === 1) return true;     // global
    return parts[0] === params.city;          // city-specific
  });

  const blogUrls = cityPosts.map(p => {
    const slug = p.id.split("/").pop();
    const last = (p.data.updatedDate || p.data.publishDate).toISOString().slice(0, 10);
    return `  <url>
    <loc>${base}/blog/${slug}/</loc>
    <lastmod>${last}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${base}/blog/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${blogUrls}
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
