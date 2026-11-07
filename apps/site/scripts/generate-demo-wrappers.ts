import { readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "..", "src");
const demosDir = join(src, "components", "demos");
const outDir = join(src, "components", "demo-wrappers");
const examplesDir = join(src, "components", "examples");
const exampleOutDir = join(src, "components", "example-wrappers");

const wrapper = (importPath: string): string => `---\nimport Demo from "${importPath}";\n---\n\n<Demo client:load />\n`;

const entries = await readdir(demosDir).catch(() => [] as string[]);
const names = entries.filter((entry) => entry.endsWith(".tsx")).map((entry) => entry.slice(0, -4));

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await Promise.all(
  names.map((name) => writeFile(join(outDir, `${name}.astro`), wrapper(`../demos/${name}.tsx`), "utf8")),
);

// Reference examples live one folder deeper: one island per sample file, so a
// page can render `src/components/examples/<slug>/<id>.tsx` on its own.
const directories = (await readdir(examplesDir, { withFileTypes: true }).catch(() => [])).filter((entry) =>
  entry.isDirectory(),
);

const examples = (
  await Promise.all(
    directories.map(async (directory) => ({
      slug: directory.name,
      ids: (await readdir(join(examplesDir, directory.name)).catch(() => [] as string[]))
        .filter((file) => file.endsWith(".tsx"))
        .map((file) => file.slice(0, -4)),
    })),
  )
).filter((entry) => entry.ids.length > 0);

await rm(exampleOutDir, { recursive: true, force: true });
await mkdir(exampleOutDir, { recursive: true });
await Promise.all(examples.map((entry) => mkdir(join(exampleOutDir, entry.slug), { recursive: true })));
await Promise.all(
  examples.flatMap((entry) =>
    entry.ids.map((id) =>
      writeFile(
        join(exampleOutDir, entry.slug, `${id}.astro`),
        wrapper(`../../examples/${entry.slug}/${id}.tsx`),
        "utf8",
      ),
    ),
  ),
);

const exampleCount = examples.reduce((total, entry) => total + entry.ids.length, 0);

console.log(`demo-wrappers: ${names.length} generated`);
console.log(`example-wrappers: ${exampleCount} generated`);
