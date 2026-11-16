/**
 * /llms.txt de la red (www.{dominio}/llms.txt) — sigue el estándar
 * https://llmstxt.org/
 *
 * Versión de red: da una vista de conjunto (marca, cobertura, servicios,
 * FAQ genérica) y enlaza al llms.txt específico de cada ciudad, que tiene
 * el detalle local. Se sirve en el dominio www/apex; cada subdominio de
 * ciudad tiene su propio /llms.txt en src/pages/[city]/llms.txt.ts.
 */
import type { APIRoute } from "astro";
import { NETWORK, SERVICES, FAQ_BASE } from "../lib/network.ts";
import { POSTS } from "../lib/wwwblog.ts";

interface CityRef {
  slug: string;
  name: string;
  province: string;
  ccaa: string;
}

export const GET: APIRoute = async () => {
  const mods = import.meta.glob<{ default: CityRef }>(
    "../content/cities/*.json",
    { eager: true },
  );
  const cities = Object.values(mods)
    .map((m) => m.default)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const base = `https://www.${NETWORK.domain}`;
  const lines: string[] = [];

  // ───── Bloque superior obligatorio del estándar llmstxt.org ─────
  lines.push(`# ${NETWORK.brand}`);
  lines.push("");
  lines.push(`> ${NETWORK.tagline}`);
  lines.push("");

  // ───── Identidad ─────
  lines.push("## Identidad de la red");
  lines.push("");
  lines.push(`- Nombre comercial: ${NETWORK.brand}`);
  lines.push(`- Dominio: ${NETWORK.domain}`);
  lines.push(`- Web de la red: ${base}/`);
  lines.push(`- Ciudades con página propia: ${cities.length}`);
  lines.push("");

  lines.push("## Cómo funciona");
  lines.push("");
  lines.push(
    "Red Piscina atiende solicitudes de mantenimiento, reparación, climatización, cubiertas, rehabilitación y construcción de piscinas " +
    "de particulares, comunidades de vecinos y negocios. El contacto es solo por formulario (sin teléfono ni WhatsApp públicos): " +
    "la persona indica ciudad, tipo de piscina, medidas aproximadas y qué necesita, y recibe respuesta con un presupuesto sin compromiso. " +
    "Las solicitudes pueden atenderlas el titular de la red o profesionales colaboradores de la zona, que informan de sus condiciones antes de contratar. " +
    "La web no publica tarifas cerradas: el precio depende del vaso, del acceso y del estado de los equipos.",
  );
  lines.push("");

  // ───── Contacto ─────
  lines.push("## Contacto");
  lines.push("");
  lines.push(`- Formulario de contacto: ${base}/#formulario`);
  if (NETWORK.email) lines.push(`- Email: ${NETWORK.email}`);
  if (NETWORK.phone) lines.push(`- Teléfono: ${NETWORK.phoneDisplay || NETWORK.phone} (${NETWORK.phone})`);
  if (NETWORK.whatsapp) lines.push(`- WhatsApp: +${NETWORK.whatsapp}`);
  lines.push("");

  // ───── Servicios ─────
  lines.push("## Servicios ofrecidos");
  lines.push("");
  for (const s of SERVICES) {
    lines.push(`- **${s.title}**: ${s.summary}`);
  }
  lines.push("");

  // ───── Blog ─────
  lines.push("## Blog");
  lines.push("");
  lines.push(`Índice: ${base}/blog/ (listado en JSON: ${base}/blog/posts.json)`);
  lines.push("");
  for (const p of POSTS) {
    lines.push(`- [${p.title}](${base}/blog/${p.slug}/) (${p.publishDate}): ${p.excerpt}`);
  }
  lines.push("");

  // ───── Cobertura ─────
  lines.push("## Ciudades con página propia");
  lines.push("");
  lines.push(
    "Cada ciudad tiene una página con los servicios, los problemas de piscinas más habituales en la zona y preguntas frecuentes locales, " +
    "y su propio /llms.txt. No son oficinas físicas: son zonas de servicio.",
  );
  lines.push("");
  for (const c of cities) {
    lines.push(`- ${c.name} (${c.province}): https://${c.slug}.${NETWORK.domain}/ · llms.txt: https://${c.slug}.${NETWORK.domain}/llms.txt`);
  }
  lines.push("");

  // ───── FAQ genérica ─────
  if (FAQ_BASE.length > 0) {
    lines.push("## Preguntas frecuentes");
    lines.push("");
    for (const f of FAQ_BASE) {
      lines.push(`### ${f.q}`);
      lines.push("");
      lines.push(f.a);
      lines.push("");
    }
  }

  // ───── Pie ─────
  lines.push("---");
  lines.push("");
  lines.push(`Network: ${NETWORK.brand} (${NETWORK.domain}).`);

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
};
