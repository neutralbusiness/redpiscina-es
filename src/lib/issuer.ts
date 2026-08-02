/**
 * Carga los datos societarios del titular desde la API pública del panel.
 * Se usa en build time (Astro SSG) para las páginas legales.
 */

const ISSUER_URL = "https://panel.neutralb.es/api/public/issuer";

export interface IssuerPublic {
  titular: string;
  cifDisplay: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  phoneDisplay: string;
}

let _cache: IssuerPublic | null = null;

export async function loadIssuer(): Promise<IssuerPublic> {
  if (_cache) return _cache;
  const res = await fetch(ISSUER_URL);
  if (!res.ok) throw new Error(`issuer API ${res.status}`);
  _cache = (await res.json()) as IssuerPublic;
  return _cache;
}
