/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: ["src/lib/**"],
      thresholds: { lines: 80 },
    },

    exclude: ["tests/e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
});
