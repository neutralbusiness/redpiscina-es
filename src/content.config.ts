import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Blog content collection.
 *
 * Convención de paths bajo `src/content/blog/`:
 *   - <city-slug>/<post-slug>.md  → post específico de una ciudad
 *                                   (aparece solo en {city}.{domain}/blog/)
 *   - <post-slug>.md              → post global de la red
 *                                   (aparece en TODOS los subdominios)
 *
 * El id del entry es la ruta relativa sin ".md", p.ej. "madrid/mi-post"
 * o "mi-post-global". Las páginas Astro filtran por ese id.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    category: z.string(),
    image: z.string().optional(),
    readTime: z.number().default(5),
    tags: z.array(z.string()).default([]),
    related: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
