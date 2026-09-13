/**
 * Blog de la www (https://www.<dominio>/blog/). Solo existe en la www:
 * las páginas viven en src/pages/blog/ (no bajo [city]) y el middleware
 * no sirve /blog/* como asset en los subdominios de ciudad.
 *
 * - Metadatos: public/blog/posts.json (lo lee también el panel).
 * - Cuerpo: src/content/www-blog/<slug>.md (frontmatter: metaTitle, metaDescription).
 * No usa la colección "blog", que es la que leen las páginas de ciudad.
 */
import rawPosts from "../../public/blog/posts.json";

export interface WwwPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishDate: string;
  readTime: number;
  image: string;
  author?: string;
}

export const POSTS: WwwPost[] = [...(rawPosts as WwwPost[])].sort(
  (a, b) => b.publishDate.localeCompare(a.publishDate),
);

interface MdModule {
  frontmatter: { metaTitle?: string; metaDescription?: string };
  Content: any;
}

const bodies = import.meta.glob<MdModule>("../content/www-blog/*.md", { eager: true });

export function bodyFor(slug: string): MdModule {
  const m = bodies[`../content/www-blog/${slug}.md`];
  if (!m) throw new Error(`Falta src/content/www-blog/${slug}.md`);
  return m;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T09:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
