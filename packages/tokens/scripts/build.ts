import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { buildThemeCss } from "../src/css"

const out = fileURLToPath(new URL("../theme.css", import.meta.url))
await writeFile(out, buildThemeCss(), "utf8")
console.log(`@horon/tokens -> ${out}`)
