import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" }, environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
