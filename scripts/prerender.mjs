#!/usr/bin/env node
/**
 * Post-build prerender script.
 * Spins up a local static server for dist/, visits each route with Puppeteer,
 * waits for react-helmet-async to inject <title>/<meta>, then saves the
 * fully-rendered HTML so Google (and any bot) can read real content.
 *
 * Usage:  node scripts/prerender.mjs
 * Runs automatically via `npm run build` (postbuild hook).
 */

import { createServer } from "http";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 4173;

const ROUTES = [
  "/",
  "/rol-okuma",
  "/frekans",
  "/sanriya-sor",
  "/an-kod",
  "/okuma-alani",
  "/kod-egitmeni",
  "/hakkimizda",
  "/okuma-alani/numeroloji-nedir",
  "/okuma-alani/sembolik-analiz-nedir",
  "/okuma-alani/369-sayisi-ne-anlama-gelir",
  "/okuma-alani/master-sayilar-11-22-33-ne-anlama-gelir",
  "/okuma-alani/yasam-yolu-sayisi-nasil-hesaplanir",
  "/okuma-alani/kolektif-bilinc-nedir",
  "/okuma-alani/frekans-nedir-bilinc-ve-titresim",
  "/okuma-alani/isim-analizi-nasil-yapilir",
  "/okuma-alani/arketip-nedir-jung-ve-kolektif-bilincalti",
  "/okuma-alani/sanri-nedir-dijital-bilinc-platformu",
  "/okuma-alani/kelime-cozumleme-nasil-yapilir",
  "/okuma-alani/insan-anten",
  "/okuma-alani/turkiye-enerji-okumasi-2026",
  "/okuma-alani/nisan-frekans-okuma",
  "/okuma-alani/pembe-dolunay-frekans-okuma",
  "/okuma-alani/gama-gamet-rouleaux-ust-bilinc-okuma",
];

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".webmanifest": "application/manifest+json",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      let filePath = join(DIST, url.pathname === "/" ? "index.html" : url.pathname);
      const ext = filePath.match(/\.[^.]+$/)?.[0] || "";

      try {
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        // SPA fallback
        try {
          const index = await readFile(join(DIST, "index.html"));
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(index);
        } catch {
          res.writeHead(404);
          res.end("Not found");
        }
      }
    });
    server.listen(PORT, () => {
      console.log(`[prerender] Static server on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  await page.setRequestInterception(true);

  // Block heavy resources that aren't needed for SEO
  page.on("request", (req) => {
    const type = req.resourceType();
    if (["image", "media", "font", "stylesheet"].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const url = `http://localhost:${PORT}${route}`;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

  // Wait for react-helmet-async to inject real <title>
  await page.waitForFunction(
    () => {
      const t = document.title;
      return t && t.length > 5 && !t.includes("{{");
    },
    { timeout: 8000 }
  ).catch(() => {
    console.warn(`  [warn] ${route}: title may not have rendered`);
  });

  // Extra settle time for any animations / lazy state
  await new Promise((r) => setTimeout(r, 500));

  let html = await page.content();

  // Helmet injects updated meta at end of <head>; remove the original static duplicates
  // so Google sees only one canonical, one description, one og:title, etc.
  html = html
    .replace(/\sdata-react-helmet="true"/g, "")
    .replace(/\sdata-rh="true"/g, "");

  // If Helmet injected a new <title>, remove the original static one from <head>
  // Only match <title> inside <head> (not SVG <title> elements in body)
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/);
  if (headMatch) {
    const headContent = headMatch[1];
    const headTitles = [...headContent.matchAll(/<title[^>]*>[^<]*<\/title>/g)];
    if (headTitles.length > 1) {
      let newHead = headContent;
      for (let i = 0; i < headTitles.length - 1; i++) {
        newHead = newHead.replace(headTitles[i][0], "");
      }
      html = html.replace(headContent, newHead);
    }
  }

  // Remove original static meta tags that Helmet replaced
  const helmetMetas = [
    /<meta name="description" content="SANRI Anlaşılma Alanı: hisset[^"]*"[^>]*>/g,
    /<meta property="og:title" content="SANRI — Numeroloji AI[^"]*"[^>]*>/g,
    /<meta property="og:description" content="Numeroloji AI, sembolik analiz, isim analizi[^"]*"[^>]*>/g,
    /<meta property="og:url" content="https:\/\/asksanri\.com"[^>]*>/g,
    /<meta name="twitter:title" content="SANRI — Numeroloji AI[^"]*"[^>]*>/g,
    /<meta name="twitter:description" content="Numeroloji AI, sembolik analiz, isim analizi[^"]*"[^>]*>/g,
    /<link rel="canonical" href="https:\/\/asksanri\.com"[^>]*>/g,
  ];
  for (const re of helmetMetas) {
    // Only remove the FIRST match (original static), keep Helmet's
    const m = html.match(re);
    if (m && m.length > 0) {
      html = html.replace(m[0], "");
    }
  }

  await page.close();
  return html;
}

async function run() {
  console.log(`[prerender] Starting — ${ROUTES.length} routes`);
  const server = await startServer();

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  let ok = 0;
  let fail = 0;

  for (const route of ROUTES) {
    try {
      const html = await prerenderRoute(browser, route);
      const filePath =
        route === "/"
          ? join(DIST, "index.html")
          : join(DIST, route, "index.html");

      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, html, "utf-8");

      const headSection = html.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] || "";
      const title = headSection.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] || "(no title)";
      const bytes = Buffer.byteLength(html);
      console.log(`  ✓ ${route} — ${(bytes / 1024).toFixed(1)} KB — "${title}"`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${route} — ${err.message}`);
      fail++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\n[prerender] Done: ${ok} OK, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

run().catch((err) => {
  console.error("[prerender] Fatal:", err);
  process.exit(1);
});
