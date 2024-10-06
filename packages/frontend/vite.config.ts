import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "frontend",
      fileName: (format) => "script.js",
      formats: ["es"],
    },
    outDir: "../../dist/frontend",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
