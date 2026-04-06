import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const iban =
    env.VITE_BANK_IBAN || env.BANK_IBAN || env.BANK_TRANSFER_IBAN || "";
  const bankName =
    env.VITE_BANK_NAME ||
    env.BANK_NAME ||
    env.BANK_TRANSFER_BANK_NAME ||
    env.BANK_TRANSFER_BANK ||
    "";
  const accountName =
    env.VITE_BANK_ACCOUNT_NAME ||
    env.BANK_ACCOUNT_NAME ||
    env.BANK_TRANSFER_RECIPIENT_NAME ||
    env.BANK_TRANSFER_NAME ||
    "";
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "robots.txt", "sitemap.xml", "offline.html"],
        manifest: {
          name: "Sanrı",
          short_name: "SANRI",
          description:
            "Bilinç ve anlam zekası — N.O.M.A.D. offline içerik ve yerel ağ (Sanrı Ağı) desteği.",
          theme_color: "#1a0d2e",
          background_color: "#0d0818",
          display: "standalone",
          orientation: "portrait-primary",
          scope: "/",
          start_url: "/",
          categories: ["lifestyle", "education"],
          icons: [
            {
              src: "/assets/gates/sanri.jpg",
              sizes: "512x512",
              type: "image/jpeg",
              purpose: "any",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff2,json,mp3}"],
          navigateFallback: "index.html",
          navigateFallbackDenylist: [/^\/auth\/callback/, /\.(?:png|jpg|jpeg|svg|webp|gif|ico|mp3|woff2)$/i],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "sanri-pages",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.startsWith("/assets/") || url.pathname.startsWith("/audio/"),
              handler: "CacheFirst",
              options: {
                cacheName: "sanri-static-media",
                expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
        /* Dev’de virtual:pwa-register üretilir; kapalıyken OfflineMeshContext vb. import hatası verir */
        devOptions: { enabled: true, type: "module" },
      }),
    ],
    build: { sourcemap: true },
    define: {
      "import.meta.env.VITE_BANK_IBAN": JSON.stringify(iban),
      "import.meta.env.VITE_BANK_NAME": JSON.stringify(bankName),
      "import.meta.env.VITE_BANK_ACCOUNT_NAME": JSON.stringify(accountName),
      /* @vercel/analytics vb. paketler process.env.NODE_ENV okur; yoksa bazı ortamlarda davranış bozulabilir */
      "process.env.NODE_ENV": JSON.stringify(mode === "production" ? "production" : "development"),
    },
  };
});