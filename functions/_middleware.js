/**
 * Cloudflare Pages middleware.
 *
 * El repo construye:
 *   - /        → master directorio (todas las ciudades agrupadas por CCAA)
 *   - /<slug>/ → one-page de la ciudad <slug>
 *
 * El dominio sirve:
 *   - redpiscina.es / www.redpiscina.es  → master directorio
 *   - <slug>.redpiscina.es               → reescribe a /<slug>/ vía env.ASSETS
 *
 * Importante: usamos `env.ASSETS.fetch()` (binding inyectado por CF Pages) en
 * lugar de `fetch()` global. El fetch global mantiene el hostname público y
 * CF detecta loop → 403. ASSETS sirve directamente los archivos estáticos
 * construidos por el build.
 */
/**
 * Ciudades retiradas (03-oct-2026): más de 28 días con 0 impresiones en
 * Google, sin ningún lead y sin socio ni teléfono propio. Su página ya no se
 * construye (se borró su src/content/cities/<slug>.json) y el subdominio
 * entero responde 301 a la www, conservando la ruta solo si existe allí
 * (RETIRED_KEEP_PATHS); si no, a la portada. Reduce la huella de páginas de
 * ciudad casi idénticas (doorway pages).
 * Para reactivar una ciudad hay que quitarla también de esta lista.
 */
const RETIRED_CITIES = new Set([
  "barakaldo",
  "ciudad-lineal",
  "fuenlabrada",
  "getafe",
  "jaen",
  "les-cabanyes",
  "palma",
  "parla",
  "torrejon-de-ardoz",
  "vigo",
]);
const RETIRED_KEEP_PATHS = new Set(["/", "/blog/", "/llms.txt", "/robots.txt", "/sitemap.xml"]);

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const hostname = (request.headers.get("x-forwarded-host") || url.hostname).toLowerCase();

  // Dominio principal sin subdominio relevante → master directorio
  const isApex = hostname === "redpiscina.es";
  const isWww = hostname === "www.redpiscina.es";

  if (isApex) {
    // Redirige apex a www para consolidar señales SEO
    const target = new URL(url);
    target.hostname = "www.redpiscina.es";
    return Response.redirect(target.toString(), 301);
  }

  if (isWww) {
    return next();
  }

  // Subdominio de ciudad: <slug>.redpiscina.es
  if (hostname.endsWith(".redpiscina.es")) {
    const subdomain = hostname.replace(/\.redpiscina\.es$/, "");
    if (subdomain && !subdomain.includes(".") && subdomain !== "www") {
      // Ciudad retirada → 301 a la www (ver RETIRED_CITIES arriba).
      if (RETIRED_CITIES.has(subdomain)) {
        let p = url.pathname || "/";
        if (!p.endsWith("/") && !/\.\w+$/.test(p)) p += "/";
        const dest = RETIRED_KEEP_PATHS.has(p) ? p : "/";
        return Response.redirect(`https://www.redpiscina.es${dest}`, 301);
      }

      // Assets puros (.css/.webp/.js/.svg/etc) → servir tal cual.
      // NO incluimos .txt/.xml aquí porque /llms.txt, /robots.txt, /sitemap.xml
      // deben reescribirse a /<slug>/* para servir contenido específico de ciudad.
      // /blog/* es solo de la www (incluido /blog/posts.json): en una ciudad se
      // reescribe a /<slug>/blog/... y da 404 si no existe.
      if (!url.pathname.startsWith("/blog/") && /\.(css|js|mjs|map|webp|avif|jpe?g|png|svg|gif|ico|woff2?|ttf|otf|eot|webmanifest|json)$/i.test(url.pathname)) {
        return env.ASSETS.fetch(request);
      }

      // Rewrite interno: /<algo> o / → /<slug>/<resto>
      let rewrittenPath = url.pathname === "/" || url.pathname === ""
        ? `/${subdomain}/`
        : `/${subdomain}${url.pathname}`;

      // Asegurar trailing slash en rutas que no son archivos. Sin esto, ASSETS
      // devuelve un 308 redirect a /<slug>/path/ cuyo Location expone el prefijo
      // interno al navegador → el usuario ve /<slug>/<slug>/path/ en la barra.
      if (!rewrittenPath.endsWith("/") && !/\.\w+$/.test(rewrittenPath)) {
        rewrittenPath += "/";
      }

      const rewritten = new URL(url);
      rewritten.pathname = rewrittenPath;
      return env.ASSETS.fetch(new Request(rewritten.toString(), request));
    }
  }

  // pages.dev directo y otros casos → continuar
  return next();
}
