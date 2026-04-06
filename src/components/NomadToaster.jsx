import { Toaster } from "sonner";
import { useTheme } from "../contexts/ThemeContext";

/** Sonner; next-themes yok — SANRI ThemeContext ile tema. */
export function NomadToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme === "light" ? "light" : "dark"}
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "sanri-toast",
        },
      }}
    />
  );
}
