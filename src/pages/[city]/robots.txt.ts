import type { APIRoute, GetStaticPaths } from "astro";
import { NETWORK } from "../../lib/network.ts";

interface CityRef { slug: string; }

export const getStaticPaths: GetStaticPaths = async () => {
  const mods = import.meta.glob<{ default: CityRef }>("../../content/cities/*.json", { eager: true });
  return Object.values(mods).map(m => ({ params: { city: m.default.slug } }));
};

export const GET: APIRoute = ({ params }) => {
  const base = `https://${params.city}.${NETWORK.domain}`;
  const body = `User-agent: *
Allow: /

# AI crawlers — info estructurada en llms.txt
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${base}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
