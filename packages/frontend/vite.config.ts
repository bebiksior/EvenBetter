import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "plugin-template-frontend",
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
});