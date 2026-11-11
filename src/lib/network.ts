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
    "Mantenimiento, reparación, cubiertas, climatización y construcción de piscinas en toda España. Servicio profesional todo el año con amplia disponibilidad en temporada alta.",
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
    q: "¿Cuánto cuesta el mantenimiento mensual de una piscina?",
    a: "Depende del tamaño del vaso, el sistema de filtración y la frecuencia de visitas. Te damos presupuesto cerrado tras una primera visita de valoración — sin compromiso ni coste. Un mantenimiento típico para una piscina residencial de 8×4 m parte de unos 80-120 €/mes con visita semanal.",
  },
  {
    q: "¿Trabajáis durante todo el año o solo en verano?",
    a: "Todo el año. En temporada baja hacemos invernaje, mantenimiento preventivo, reparaciones, rehabilitaciones y construcción. La temporada alta (mayo-septiembre) la reservamos con prioridad para mantenimiento y puestas a punto. Te recomendamos reservar tu cita con antelación en primavera.",
  },
  {
    q: "¿Hacéis piscinas de obra nuevas?",
    a: "Sí. Construimos piscinas de hormigón gunitado, de liner y piscinas naturales. El proceso incluye proyecto, movimiento de tierras, estructura, impermeabilización, acabados (gresite, coronación, playa) e instalación de todos los equipos (depuradora, iluminación, climatización). Plazo orientativo: 6-10 semanas según tamaño.",
  },
  {
    q: "Mi piscina pierde agua, ¿puede ser una fuga?",
    a: "Es muy probable. Una piscina puede perder 3-5 mm al día por evaporación, pero si baja más, hay fuga. Hacemos prueba de estanqueidad, detección de fugas con equipos profesionales y reparación sin necesidad de vaciar el vaso en la mayoría de casos.",
  },
  {
    q: "¿Instaláis bombas de calor para alargar la temporada?",
    a: "Sí. Instalamos bombas de calor inverter de alta eficiencia que permiten usar la piscina desde abril hasta octubre, o incluso todo el año en zonas de clima suave. Te dimensionamos el equipo según el volumen de tu piscina y la temperatura objetivo.",
  },
  {
    q: "¿Tenéis disponibilidad en temporada alta?",
    a: "Sí, mantenemos un equipo amplio precisamente para dar servicio en los meses de máxima demanda. Aun así, te recomendamos contratar el mantenimiento de temporada entre marzo y abril para garantizar plaza y tener la piscina lista para el primer baño.",
  },
] as const;
