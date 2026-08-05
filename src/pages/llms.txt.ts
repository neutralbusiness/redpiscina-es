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
  lines.push(`- Ciudades con centro propio: ${cities.length}`);
  lines.push("");

  // ───── Contacto ─────
  lines.push("## Contacto");
  lines.push("");
  lines.push(`- Email: ${NETWORK.email}`);
  lines.push(`- Teléfono: ${NETWORK.phoneDisplay} (${NETWORK.phone})`);
  lines.push(`- WhatsApp: +${NETWORK.whatsapp}`);
  lines.push("");

  // ───── Servicios ─────
  lines.push("## Servicios ofrecidos");
  lines.push("");
  for (const s of SERVICES) {
    lines.push(`- **${s.title}**: ${s.summary}`);
  }
  lines.push("");

  // ───── Cobertura ─────
  lines.push("## Ciudades con centro propio");
  lines.push("");
  lines.push(
    "Cada ciudad tiene su propia web con información local (dirección, horario, contexto de la zona) " +
    "y su propio /llms.txt con el detalle completo:",
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
  lines.push(`Última actualización del contenido: generado dinámicamente desde ${base}/llms.txt`);
  lines.push(`Network: ${NETWORK.brand} (${NETWORK.domain}).`);

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
};
