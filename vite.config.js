import { defineConfig } from "vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteSingleFile } from "vite-plugin-singlefile";
import sveltePreprocess from "svelte-preprocess";
import { build } from "./build";

export default defineConfig(({ mode }) => {
  build(process.argv.includes("--watch"));

  return {
    plugins: [
      tsconfigPaths({ loose: true }),
      svelte({
        preprocess: [sveltePreprocess()],
      }),
      viteSingleFile(),
    ],
    root: resolve(__dirname, "src/nui"),
    publicDir: mode == "development" && resolve(__dirname),

    build: {
      target: ["chrome93"],
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: false,
      cssCodeSplit: false,
      assetsInlineLimit: 100000000,
    },
  };
});
