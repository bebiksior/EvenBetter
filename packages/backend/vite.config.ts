import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "plugin-template-backend",
      fileName: (format) => "script.js",
      formats: ["es"],
    },
    outDir: "../../dist/backend",
    rollupOptions: {
      external: [/caido:.+/],
      output: {
        manualChunks: undefined,
      },
    },
  },
});