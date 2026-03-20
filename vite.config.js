import { defineConfig } from "vite";
import { extname } from "path";
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
    define: {
        __DEV_MODE__: JSON.stringify(!!process.env.DEV_MODE),
    },
    build: {
        outDir: process.env.DEV_MODE ? "../dev" : "../build",
        watch: process.env.DEV_MODE ? {} : null,
        emptyOutDir: false,
        rollupOptions: {
            input: {
                dashboard: "./dashboard/index.html",
                background: "./background/init.ts",
                content: "./content/init.ts",
            },
            output: {
                format: "es",
                entryFileNames: (chunk) => {
                    switch (chunk.name) {
                        case "dashboard":
                            return "[name]/main.js";
                        default:
                            return "[name].js";
                    }
                },
                chunkFileNames: (chunk) => {
                    return "[name].js";
                    switch (extname(chunk.name)) {
                        case ".json":
                            return "[name].js";
                        default:
                            return "[name][extname]";
                    }
                },
                assetFileNames: "[name]/[name][extname]",
            },
        },
    },
});
