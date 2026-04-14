import path from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension from "vite-plugin-web-extension";

export default defineConfig({
    root: ".",
    resolve: {
        alias: {
            $: path.resolve(__dirname, "./src"),
        },
    },
    plugins: [
        svelte(),
        webExtension({
            manifest: "manifest.json",
            additionalInputs: [],
        }),
    ],
    build: {
        outDir: process.env.DEV_MODE ? "dev" : "build",
        watch: process.env.DEV_MODE ? {} : null,
    },
});
