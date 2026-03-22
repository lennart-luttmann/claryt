import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    root: "src",
    plugins: [
        svelte(),
        viteStaticCopy({
            targets: [{ src: "../static/*", dest: ".", flatten: true }],
        }),
    ],
    build: {
        outDir: process.env.DEV_MODE ? "../dev" : "../build",
        watch: process.env.DEV_MODE ? {} : null,
        emptyOutDir: false,
        rollupOptions: {
            input: {
                dashboard: "./dashboard/index.html",
                background: "./background/init.ts",
                feed_watchdog: "./content/feed_watchdog.ts",
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name][extname]",
            },
        },
    },
});
