/**
 * Configuración estática de la red Red Piscina.
 * Empresa de mantenimiento, reparación, cubiertas, bombas de calor,
 * depuradoras, rehabilitación y construcción de piscinas.
 *
 * Se importa desde layouts y pages.
 * El contenido IA por ciudad vive en src/content/cities/<slug>.json y se
 * carga vía import.meta.glob en [city].astro.
 */
import servicesData from "../data/services.json";

export const NETWORK = {
  gtmId: "GTM-W8BNHVSV",
  slug: "redpiscina",
  domain: "redpiscina.es",
  brand: "Red Piscina",
  sector: "piscina",
  tagline:
    "Mantenimiento, reparación, cubiertas, climatización y construcción de piscinas en toda España. Servicio profesional durante todo el año, con presupuesto sin compromiso.",
  phone: "",
  phoneDisplay: "",
  whatsapp: "",
  email: "",
  heroImage: "/img/hero.webp", // se sube vía panel /webs/redes/redpiscina
} as const;

// Servicios (cards en #servicios). Texto base — el copy de cada
// ciudad puede sobreescribir vía content/cities/<slug>.json.
// Los servicios se gestionan en el panel (Redes › Servicios), que escribe
// src/data/services.json: ahí se añaden, se editan, se ordenan y se ocultan,
// para toda la red o ciudad por ciudad. Un servicio oculto no llega al HTML.
type ServiceItem = { id: string; title: string; icon: string; summary: string; hidden?: boolean };
const SERVICES_DATA = servicesData as { services: ServiceItem[]; cities?: Record<string, string[]> };

/** Servicios visibles en toda la red. */
export const SERVICES: ServiceItem[] = SERVICES_DATA.services.filter((s) => !s.hidden);

/** Servicios visibles en una ciudad: los de la red menos los ocultos en esa ciudad. */
export function servicesFor(citySlug?: string): ServiceItem[] {
  const off = new Set((citySlug && SERVICES_DATA.cities?.[citySlug]) || []);
  return SERVICES.filter((s) => !off.has(s.id));
}

export const FAQ_BASE = [
  {
    q: "¿Cuánto cuesta el mantenimiento de una piscina?",
    a: "Depende del tamaño del vaso, del sistema de filtración y de cuántas visitas necesite: no es lo mismo una piscina privada de 8×4 m con visita quincenal que una comunitaria con controles diarios. Por eso no publicamos una tarifa cerrada; cuéntanos por el formulario medidas, tipo de piscina y qué quieres que hagamos, y te preparamos un presupuesto sin compromiso.",
  },
  {
    q: "¿Trabajáis todo el año o solo en verano?",
    a: "Todo el año. Fuera de temporada se hacen el invernaje, las reparaciones, las rehabilitaciones y las obras nuevas, que en verano dejan la piscina sin uso. De mayo a septiembre la demanda de mantenimiento y puestas a punto se dispara, así que conviene pedirlo con antelación, en marzo o abril.",
  },
  {
    q: "¿Hacéis piscinas de obra nuevas?",
    a: "Sí: piscinas de hormigón gunitado, de liner y piscinas naturales. Una obra pasa por proyecto y licencia, movimiento de tierras, estructura, impermeabilización, acabados (gresite, coronación y playa) e instalación de los equipos. El plazo depende del tamaño, del acceso para la maquinaria y de lo que tarde el ayuntamiento en dar la licencia.",
  },
  {
    q: "Mi piscina pierde agua, ¿puede ser una fuga?",
    a: "Una piscina al aire libre pierde unos milímetros al día por evaporación, más en días de calor y viento. Si el nivel baja bastante más, o baja igual con la depuradora parada, lo normal es que haya una fuga en el vaso, en las tuberías o en las piezas empotradas. Se localiza con pruebas de presión y de estanqueidad y, en la mayoría de casos, se repara sin vaciar la piscina.",
  },
  {
    q: "¿Instaláis bombas de calor para alargar la temporada?",
    a: "Sí. Una bomba de calor bien dimensionada para el volumen de la piscina permite bañarse desde la primavera hasta bien entrado el otoño, y en zonas de clima suave casi todo el año si se combina con una cubierta. El equipo se elige según los metros cúbicos, la temperatura que quieras y si la piscina está cubierta o no.",
  },
] as const;
