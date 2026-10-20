import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(here, "..", "..", "..", "assets");
const outDir = join(here, "..", "public", "mascots");

const SIZE = 768;
const QUALITY = 88;

const files = (await readdir(assetsDir)).filter((file) => /^horon-mascot-.+\.png$/.test(file));

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const manifest = await Promise.all(
  files.map(async (file) => {
    const slug = file.replace(/^horon-mascot-/, "").replace(/\.png$/, "");
    const source = Bun.file(join(assetsDir, file));
    const webp = await source.image().resize(SIZE, SIZE).webp({ quality: QUALITY }).bytes();
    await writeFile(join(outDir, `horon-mascot-${slug}.webp`), webp);
    return { slug, bytes: webp.byteLength };
  }),
);

manifest.sort((a, b) => a.slug.localeCompare(b.slug));
await writeFile(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 1)}\n`);

const total = manifest.reduce((sum, item) => sum + item.bytes, 0);
console.log(`mascots: ${manifest.length} cuts, ${(total / 1024).toFixed(0)}KB total`);
