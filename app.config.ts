import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  tsr: {
    appDirectory: "src",
    routesDirectory: "routes",
    generatedRouteTree: "src/routeTree.gen.ts",
    quoteStyle: "single",
    semicolons: false,
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
  server: {
    preset: "cloudflare-worker",
  },
});
