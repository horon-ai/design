import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

// Import boundary: @horon/web is the web-only package. It must never reach into
// the native package or into react-native itself.
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
							group: ["@horon/app", "@horon/app/*"],
							message:
								"@horon/web is the web-only package. Native components live in @horon/app and must not be imported here.",
						},
						{
							group: ["react-native", "react-native/*"],
							message:
								"Web code must not import react-native. Use the DOM components in @horon/web.",
						},
					],
				},
			],
		},
	},
])
