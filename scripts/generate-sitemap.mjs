import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { indexableSeoRoutes } from "../src/seo/routes.js";
import { absoluteUrl } from "../src/seo/siteConfig.js";

const today = new Date().toISOString().slice(0, 10);

const urls = indexableSeoRoutes
  .map((route) => `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq || "monthly"}</changefreq>
    <priority>${route.priority || "0.6"}</priority>
  </url>`)
  .join("\n\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(resolve("public", "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${indexableSeoRoutes.length} URLs.`);
