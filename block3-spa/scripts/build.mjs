import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");
const sourceDir = join(projectRoot, "block3-spa", "src");
const targetDir = join(projectRoot, "src", "main", "resources", "static", "spa");

if (!existsSync(sourceDir)) {
  throw new Error(`Source directory not found: ${sourceDir}`);
}

rmSync(targetDir, { force: true, recursive: true });
mkdirSync(targetDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Block 3 SPA copied to ${targetDir}`);
