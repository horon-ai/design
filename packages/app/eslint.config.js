import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

// Import boundary: @horon/app is the native-only package. It must never reach
// into the web package or into DOM-only modules.
export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			"react-refresh/only-export-components": "off",
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["@horon/web", "@horon/web/*"],
							message:
								"@horon/app is the native-only package. Web components live in @horon/web and must not be imported here.",
						},
						{
							group: [
								"react-native-web",
								"react-native-web/*",
								"react-dom",
								"react-dom/*",
							],
							message:
								"Native code must not import DOM-only modules. Use react-native primitives instead.",
						},
					],
				},
			],
		},
	},
])
