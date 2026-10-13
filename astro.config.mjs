// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const site = process.env.SITE;

// https://astro.build/config
export default defineConfig({
  ...(site ? { site, integrations: [sitemap()] } : {}),
});
