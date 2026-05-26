/**
 * Cloudflare Pages middleware.
 *
 * El repo construye:
 *   - /        → master directorio (todas las ciudades agrupadas por CCAA)
 *   - /<slug>/ → one-page de la ciudad <slug>
 *
 * El dominio sirve:
 *   - redtalleres.es / www.redtalleres.es  → master directorio
 *   - <slug>.redtalleres.es                → reescribe a /<slug>/ vía env.ASSETS
 *
 * Importante: usamos `env.ASSETS.fetch()` (binding inyectado por CF Pages) en
 * lugar de `fetch()` global. El fetch global mantiene el hostname público y
 * CF detecta loop → 403. ASSETS sirve directamente los archivos estáticos
 * construidos por el build.
 */
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();

  // Dominio principal sin subdominio relevante → master directorio
  const isApex = hostname === "redtalleres.es";
  const isWww = hostname === "www.redtalleres.es";

  if (isApex) {
    // Redirige apex a www para consolidar señales SEO
    const target = new URL(url);
    target.hostname = "www.redtalleres.es";
    return Response.redirect(target.toString(), 301);
  }

  if (isWww) {
    return next();
  }

  // Subdominio de ciudad: <slug>.redtalleres.es
  if (hostname.endsWith(".redtalleres.es")) {
    const subdomain = hostname.replace(/\.redtalleres\.es$/, "");
    if (subdomain && !subdomain.includes(".") && subdomain !== "www") {
      // Assets puros (.css/.webp/.js/.svg/etc) → servir tal cual.
      // NO incluimos .txt/.xml aquí porque /llms.txt, /robots.txt, /sitemap.xml
      // deben reescribirse a /<slug>/* para servir contenido específico de ciudad.
      if (/\.(css|js|mjs|map|webp|avif|jpe?g|png|svg|gif|ico|woff2?|ttf|otf|eot|webmanifest|json)$/i.test(url.pathname)) {
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