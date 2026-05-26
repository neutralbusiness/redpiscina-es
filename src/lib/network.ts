/**
 * Configuración estática de la red. Se importa desde layouts y pages.
 * El contenido IA por ciudad vive en src/content/cities/<slug>.json y se
 * carga vía import.meta.glob en [city].astro.
 */
export const NETWORK = {
  slug: "redpiscina",
  domain: "redpiscina.es",
  brand: "Red Piscina",
  sector: "piscina",
  tagline: "La red de talleres mecánicos más grande de España",
  phone: "+34641161771‬",
  phoneDisplay: "641161771‬",
  whatsapp: "34641161771‬",
  email: "info@redpiscina.es",
  heroImage: "/img/hero.webp",       // se sube vía panel /webs/redes/redtalleres
} as const;

// Servicios del taller (cards en #servicios). Texto base — el copy de cada
// ciudad puede sobreescribir vía content/cities/<slug>.json.
export const SERVICES = [
  {
    id: "revision",
    title: "Revisión y mantenimiento",
    icon: "🛠️",
    summary: "Aceite, filtros y 30 puntos según libro del fabricante.",
  },
  {
    id: "mecanica",
    title: "Mecánica general",
    icon: "⚙️",
    summary: "Distribución, embrague, suspensión, transmisión.",
  },
  {
    id: "averias",
    title: "Averías y diagnóstico",
    icon: "🔧",
    summary: "Detectamos la avería antes de tocar nada y te pasamos presupuesto cerrado.",
  },
  {
    id: "neumaticos",
    title: "Neumáticos y alineación",
    icon: "🛞",
    summary: "Marcas premium con montaje + equilibrado + alineación de dirección.",
  },
  {
    id: "electronica",
    title: "Electrónica y diagnóstico",
    icon: "💻",
    summary: "Centralita, sensores, ABS, airbag, climatizador y módulos de confort.",
  },
  {
    id: "itv",
    title: "Pre-ITV",
    icon: "✅",
    summary: "Revisión previa para pasar la ITV a la primera, sin gastos sorpresa.",
  },
] as const;

export const FAQ_BASE = [
  {
    q: "¿Cuánto cuesta una revisión completa?",
    a: "Depende del fabricante y del tipo de aceite. Te pasamos presupuesto cerrado antes de tocar nada — sin sorpresas en la factura.",
  },
  {
    q: "¿Trabajáis con todas las marcas?",
    a: "Sí, somos multimarca. Lo único que no hacemos en sitio son trabajos con equipo específico de marca (codificación de llaves de algunos modelos premium).",
  },
  {
    q: "¿Cuánto tarda la reparación?",
    a: "Para una revisión estándar, en el día. Las averías mecánicas (distribución, embrague) suelen ser 1-2 días según pieza. Te confirmamos plazo antes de empezar.",
  },
  {
    q: "¿Coche de cortesía?",
    a: "Si la reparación se alarga más de un día, te ofrecemos coche de cortesía sujeto a disponibilidad.",
  },
] as const;
