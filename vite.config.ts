import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [TanStackRouterVite(), tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  {
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
  server: {
    port: 8080,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
