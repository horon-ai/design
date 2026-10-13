import { describe, expect, mock, test } from "bun:test"

const repoRoot = `${import.meta.dir}/../../..`

const reactNativeSpecifier: string = "react-native-web"
const reactNativeWeb = await import(reactNativeSpecifier)
mock.module("react-native", () => reactNativeWeb)

const web = await import("@horon/web")
const app = await import("@horon/app")

type Layer = {
	label: string
	componentsDir: string
	barrelPath: string
	storiesDir: string
	namespace: Record<string, unknown>
}

const layers: Layer[] = [
	{
		label: "@horon/web",
		componentsDir: `${repoRoot}/packages/web/src/components`,
		barrelPath: `${repoRoot}/packages/web/src/index.ts`,
		storiesDir: `${repoRoot}/apps/storybook/stories/web`,
		namespace: web as unknown as Record<string, unknown>,
	},
	{
		label: "@horon/app",
		componentsDir: `${repoRoot}/packages/app/src/components`,
		barrelPath: `${repoRoot}/packages/app/src/index.ts`,
		storiesDir: `${repoRoot}/apps/storybook/stories/app`,
		namespace: app as unknown as Record<string, unknown>,
	},
]

const listFiles = (dir: string, pattern: string) =>
	[...new Bun.Glob(pattern).scanSync(dir)].sort()

const withoutExtension = (file: string) => file.replace(/\.tsx$/, "")

const pascalCase = (name: string) =>
	name
		.split(/[-_]/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("")

const valueExports = (source: string): string[] => {
	const names = new Set<string>()
	for (const block of source.match(/export\s*\{[^}]*\}/g) ?? []) {
		const inner = block.replace(/^export\s*\{/, "").replace(/\}\s*$/, "")
		for (const raw of inner.split(",")) {
			const entry = raw.trim()
			if (!entry || entry.startsWith("type ")) continue
			const match = entry.match(/^([A-Za-z0-9_$]+)(?:\s+as\s+([A-Za-z0-9_$]+))?$/)
			if (match) names.add(match[2] ?? match[1])
		}
	}
	const declaration =
		/export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z0-9_$]+)/g
	for (const match of source.matchAll(declaration)) names.add(match[1])
	return [...names]
}

for (const layer of layers) {
	const files = listFiles(layer.componentsDir, "*.tsx")
	const storyFiles = listFiles(layer.storiesDir, "*.stories.tsx")

	describe(`${layer.label} export coverage`, () => {
		test("has components to cover", () => {
			expect(files.length).toBeGreaterThan(0)
		})

		test("every component file is re-exported from the entry point", async () => {
			const barrel = await Bun.file(layer.barrelPath).text()
			for (const file of files) {
				expect(barrel).toContain(`./components/${withoutExtension(file)}`)
			}
		})

		test("every component value export is importable by name from the entry point", async () => {
			for (const file of files) {
				const source = await Bun.file(`${layer.componentsDir}/${file}`).text()
				const names = valueExports(source)
				expect(names.length).toBeGreaterThan(0)
				for (const name of names) {
					expect(layer.namespace[name]).toBeDefined()
				}
			}
		})

		test("every component has a story", () => {
			for (const file of files) {
				expect(storyFiles).toContain(
					`${pascalCase(withoutExtension(file))}.stories.tsx`,
				)
			}
		})
	})
}
