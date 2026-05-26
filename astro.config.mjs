// @ts-check
import { defineConfig } from "astro/config";

// Master domain. Cada ciudad activada se sirve en {slug}.redpiscina.es vía
// middleware de CF Pages (functions/_middleware.js) que reescribe el path al
// directorio /<slug>/ del build.
export default defineConfig({
  site: "https://redpiscina.es",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  output: "static",
});
