#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Define directories.
const STATIC = "static";
const BUILD = "build";

/**
 * Copy directory to target recursively.
 */
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Run linter check.
console.log("Running ESLint...");
execSync(`npx eslint ${STATIC}`, { stdio: "inherit" });

// Copy static files.
fs.rmSync(BUILD, { recursive: true, force: true });
copyDir(STATIC, BUILD);
console.log("Build complete →", BUILD);
