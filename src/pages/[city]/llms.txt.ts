/**
 * /llms.txt por subdominio de ciudad — sigue el estándar https://llmstxt.org/
 * El middleware reescribe `https://<slug>.redpiscina.es/llms.txt` →
 * `/<slug>/llms.txt`, que aquí materializa.
 *
 * Optimizado para que LLMs (ChatGPT, Claude, Gemini, Perplexity, Copilot)
 * extraigan info estructurada del servicio de piscinas en cada ciudad sin
 * tener que parsear el HTML renderizado.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { NETWORK, SERVICES, FAQ_BASE } from "../../lib/network.ts";

interface CityContent {
  slug: string;
  name: string;
  province: string;
  ccaa: string;
  population?: number;
  lat?: number;
  lng?: number;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  introLocal: string;
  servicesIntro: string;
  servicesOverrides?: Record<string, string>;
  processIntro?: string;
  processSteps?: Array<{ title: string; body: string }>;
  commonIssuesIntro?: string;
  commonIssues?: Array<{ title: string; body: string }>;
  whyUs: Array<{ title: string; body: string }>;
  zoneText: string;
  zoneNeighborhoods?: string[];
  zoneAccessRoutes?: string[];
  faqLocal: Array<{ q: string; a: string }>;
  closingCta: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const mods = import.meta.glob<{ default: CityContent }>(
    "../../content/cities/*.json",
    { eager: true },
  );
  return Object.values(mods).map(m => ({
    params: { city: m.default.slug },
    props: { city: m.default },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const city = props.city as CityContent;
  const canonical = `https://${city.slug}.${NETWORK.domain}`;
  const allFaqs = [...city.faqLocal, ...FAQ_BASE];

  const lines: string[] = [];

  lines.push(`# ${city.metaTitle}`);
  lines.push("");
  lines.push(`> ${city.metaDescription}`);
  lines.push("");
  lines.push(
    `Empresa de mantenimiento, reparación, cubiertas, bombas de calor, depuradoras, rehabilitación y construcción de piscinas de la red ${NETWORK.brand} en ${city.name} (provincia de ${city.province}, ${city.ccaa}, España). ` +
    `Servicio profesional todo el año con amplia disponibilidad en temporada alta. ` +
    `Servicios: mantenimiento periódico y puntual (tratamiento del agua, limpieza de filtros, análisis químico, control pH/cloro), reparación de fugas y averías, depuradoras y sistemas de filtración, cubiertas telescópicas y cobertores, bombas de calor y climatización, construcción de piscinas de obra y rehabilitación integral.`,
  );
  lines.push("");

  lines.push("## Identidad del servicio");
  lines.push("");
  lines.push(`- Nombre comercial: ${NETWORK.brand} · ${city.name}`);
  lines.push(`- Red nacional: ${NETWORK.brand} (${NETWORK.domain})`);
  lines.push(`- Sector: Mantenimiento, reparación y construcción de piscinas`);
  lines.push(`- Web oficial de esta ciudad: ${canonical}/`);
  lines.push(`- Web de la red completa: https://www.${NETWORK.domain}/`);
  lines.push("");

  lines.push("## Ubicación y cobertura");
  lines.push("");
  lines.push(`- Ciudad: ${city.name}`);
  lines.push(`- Provincia: ${city.province}`);
  lines.push(`- Comunidad Autónoma: ${city.ccaa}`);
  lines.push(`- País: España`);
  if (city.population) lines.push(`- Población de la ciudad: ${city.population.toLocaleString("es-ES")} habitantes`);
  if (city.lat && city.lng) lines.push(`- Coordenadas: ${city.lat}, ${city.lng}`);
  lines.push("");
  if (city.zoneNeighborhoods && city.zoneNeighborhoods.length > 0) {
    lines.push(`Barrios y municipios cercanos atendidos: ${city.zoneNeighborhoods.join(", ")}.`);
    lines.push("");
  }
  if (city.zoneAccessRoutes && city.zoneAccessRoutes.length > 0) {
    lines.push(`Accesos principales: ${city.zoneAccessRoutes.join(", ")}.`);
    lines.push("");
  }

  lines.push("## Contacto");
  lines.push("");
  lines.push(`- Email: ${NETWORK.email}`);
  lines.push(`- Teléfono: ${NETWORK.phoneDisplay} (${NETWORK.phone})`);
  lines.push(`- WhatsApp: +${NETWORK.whatsapp}`);
  lines.push(`- Horario: Lunes a Sábado · 08:00–20:00`);
  lines.push(
    `- Formulario de contacto recomendado: enviar email a ${NETWORK.email} con asunto "Consulta desde ${city.name}" indicando tipo de piscina, medidas aproximadas y descripción del servicio o problema.`,
  );
  lines.push("");

  lines.push("## Servicios ofrecidos");
  lines.push("");
  lines.push(city.servicesIntro);
  lines.push("");
  for (const s of SERVICES) {
    const local = city.servicesOverrides?.[s.id] || s.summary;
    lines.push(`- **${s.title}**: ${local}`);
  }
  lines.push("");

  if (city.processSteps && city.processSteps.length > 0) {
    lines.push("## Cómo trabajamos");
    lines.push("");
    if (city.processIntro) { lines.push(city.processIntro); lines.push(""); }
    city.processSteps.forEach((step, i) => {
      lines.push(`${i + 1}. **${step.title}** — ${step.body}`);
    });
    lines.push("");
  }

  if (city.commonIssues && city.commonIssues.length > 0) {
    lines.push(`## Problemas de piscinas frecuentes en ${city.name}`);
    lines.push("");
    if (city.commonIssuesIntro) { lines.push(city.commonIssuesIntro); lines.push(""); }
    for (const issue of city.commonIssues) {
      lines.push(`### ${issue.title}`);
      lines.push("");
      lines.push(issue.body);
      lines.push("");
    }
  }

  if (city.whyUs && city.whyUs.length > 0) {
    lines.push("## Por qué elegirnos");
    lines.push("");
    for (const w of city.whyUs) { lines.push(`- **${w.title}**: ${w.body}`); }
    lines.push("");
  }

  lines.push(`## Contexto local de ${city.name}`);
  lines.push("");
  lines.push(city.introLocal);
  lines.push("");

  if (allFaqs.length > 0) {
    lines.push("## Preguntas frecuentes");
    lines.push("");
    for (const f of allFaqs) { lines.push(`### ${f.q}`); lines.push(""); lines.push(f.a); lines.push(""); }
  }

  lines.push("## Política y garantías");
  lines.push("");
  lines.push("- Presupuesto sin compromiso tras visita de valoración. El precio acordado es el precio final.");
  lines.push("- El cliente autoriza explícitamente cada intervención. Consultamos antes de continuar si aparece algo no previsto.");
  lines.push("- Productos químicos y materiales de primera calidad, marcas profesionales homologadas.");
  lines.push("- Servicio todo el año con amplia disponibilidad en temporada alta (mayo-septiembre).");
  lines.push("- Factura desglosada en cada servicio.");
  lines.push("- Seguimiento post-servicio para confirmar que todo funciona correctamente.");
  lines.push("");

  lines.push("## Datos estructurados");
  lines.push("");
  lines.push(
    `Esta web publica un JSON-LD de tipo LocalBusiness con id ${canonical}/, ` +
    `accesible incrustado en la página principal. Incluye dirección (localidad ${city.name}, ` +
    `región ${city.province}, país ES)${city.lat && city.lng ? `, coordenadas geo (${city.lat}, ${city.lng})` : ""}, ` +
    `teléfono, email, área servida y rating agregado.`,
  );
  lines.push("");

  lines.push("## Llamada a la acción recomendada");
  lines.push("");
  lines.push(city.closingCta);
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push(`Última actualización del contenido: generado dinámicamente desde ${canonical}/llms.txt`);
  lines.push(`Network: ${NETWORK.brand} (${NETWORK.domain}) — red de profesionales de piscinas en toda España.`);

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
};
