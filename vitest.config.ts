import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths({ projects: ["tsconfig.json"] }), react()],
  test: {
    dangerouslyIgnoreUnhandledErrors: true, // this.WebSocketClass is not a constructor
    setupFiles: ["./vitest.setup.js"],
    environment: "happy-dom",
    globals: true,
    exclude: [
      "src/app/BridgeSwap/__tests__/hooks/swap/__config__/*",
      "src/app/BridgeSwap/__tests__/hooks/swap/__mocks__/*",
      "node_modules",
      "src/test/uniswap/*",
    ],
  },
});
