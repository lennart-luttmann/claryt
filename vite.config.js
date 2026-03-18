import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    root: "src",
    plugins: [svelte()],
    build: {
        outDir: "../build",
        emptyOutDir: false,
        rollupOptions: {
            input: {
                dashboard: "dashboard/index.html",
                background: "background/init.ts",
                content: "content/init.ts",
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
                chunkFileNames: "[name][extname]",
            },
        },
    },
});
