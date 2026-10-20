import { readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "..", "src");
const demosDir = join(src, "components", "demos");
const outDir = join(src, "components", "demo-wrappers");

const entries = await readdir(demosDir).catch(() => [] as string[]);
const names = entries.filter((entry) => entry.endsWith(".tsx")).map((entry) => entry.slice(0, -4));

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await Promise.all(
  names.map((name) =>
    writeFile(
      join(outDir, `${name}.astro`),
      `---\nimport Demo from "../demos/${name}.tsx";\n---\n\n<Demo client:load />\n`,
    ),
  ),
);

console.log(`demo-wrappers: ${names.length} generated`);
