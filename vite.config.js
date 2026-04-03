import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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
    plugins: [react()],
    build: { sourcemap: true },
    define: {
      "import.meta.env.VITE_BANK_IBAN": JSON.stringify(iban),
      "import.meta.env.VITE_BANK_NAME": JSON.stringify(bankName),
      "import.meta.env.VITE_BANK_ACCOUNT_NAME": JSON.stringify(accountName),
    },
  };
});