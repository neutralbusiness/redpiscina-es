# redtalleres.es — Red de talleres mecánicos

Sitio único Astro estático que sirve:
- `www.redtalleres.es/` → master directorio (todas las ciudades agrupadas por CCAA → provincia)
- `<slug>.redtalleres.es/` → one-page de cada ciudad activa

## Arquitectura

- **Astro estático** — pre-renderiza todas las páginas en build time
- **Cloudflare Pages** con DNS wildcard `*.redtalleres.es`
- **Middleware CF Pages** (`functions/_middleware.js`) reescribe el hostname al path interno (`/<slug>/`)
- **Contenido por ciudad** en `src/content/cities/<slug>.json` — generado por el panel `panel.neutralb.es` al activar una ciudad (IA: GPT-4o-mini)

## Comandos

```bash
npm install
npm run dev      # localhost:4321
npm run build    # dist/
npm run preview
```

## Cómo se añade una ciudad

Desde el panel `panel.neutralb.es/webs/redes/redtalleres`:
1. Toggle ⭕ → ✅ en la fila de la ciudad
2. El panel genera el JSON de la ciudad con IA (GPT-4o-mini para cuerpo, Sonnet 4.6 para hero si está habilitado)
3. Commitea `src/content/cities/<slug>.json` a este repo
4. CF Pages rebuildea automáticamente
5. `<slug>.redtalleres.es` queda servida en 1-2 min

No hay que tocar manualmente este repo. Todo se gestiona desde el panel.

## SEO

- Schema.org `LocalBusiness` por ciudad con geo + areaServed
- Canonical apuntando al subdominio propio
- Texto único por ciudad (anti doorway pages)
- Sitemap auto-generado por Astro
- Apex → www redirect via middleware

## Stack

- Astro 5.x
- Cloudflare Pages (build + CDN + middleware)
- Generación de contenido: GPT-4o-mini (cuerpo) + Claude Sonnet 4.6 (hero copy opcional)
