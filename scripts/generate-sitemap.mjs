/**
 * Generates sitemap.xml from okuma slugs + static routes.
 * Run: node scripts/generate-sitemap.mjs
 * Called automatically via `postbuild` in package.json.
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = "https://asksanri.com";

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/okuma-alani", changefreq: "daily", priority: "0.9" },
  { path: "/rol-okuma", changefreq: "weekly", priority: "0.9" },
  { path: "/frekans", changefreq: "weekly", priority: "0.7" },
  { path: "/yanki", changefreq: "daily", priority: "0.8" },
  { path: "/kod-egitmeni", changefreq: "weekly", priority: "0.8" },
  { path: "/kod-ogrenmeye-giris", changefreq: "weekly", priority: "0.85" },
  { path: "/an-kod", changefreq: "weekly", priority: "0.9" },
  { path: "/library", changefreq: "weekly", priority: "0.7" },
  { path: "/sanri", changefreq: "weekly", priority: "0.7" },
  { path: "/rituel-alani", changefreq: "weekly", priority: "0.6" },
  { path: "/giris", changefreq: "monthly", priority: "0.4" },
  { path: "/hakkimizda", changefreq: "monthly", priority: "0.3" },
  { path: "/gizlilik-politikasi", changefreq: "monthly", priority: "0.2" },
];

function extractSlugs() {
  const src = readFileSync(
    resolve(__dirname, "../src/data/okumaData.js"),
    "utf-8"
  );
  const slugs = [];
  const re = /slug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) slugs.push(m[1]);
  return [...new Set(slugs)];
}

function buildXml(slugs) {
  const urls = [];
  for (const r of STATIC_ROUTES) {
    urls.push(
      `  <url>\n    <loc>${SITE}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
    );
  }
  for (const slug of slugs) {
    urls.push(
      `  <url>\n    <loc>${SITE}/okuma-alani/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    );
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

const slugs = extractSlugs();
const xml = buildXml(slugs);
const outPath = resolve(__dirname, "../dist/sitemap.xml");

try {
  writeFileSync(outPath, xml, "utf-8");
  console.log(`[sitemap] Generated ${slugs.length} okuma + ${STATIC_ROUTES.length} static routes → dist/sitemap.xml`);
} catch {
  const publicPath = resolve(__dirname, "../public/sitemap.xml");
  writeFileSync(publicPath, xml, "utf-8");
  console.log(`[sitemap] Generated → public/sitemap.xml (dist not found, pre-build mode)`);
}
