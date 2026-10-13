import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

// This is a web app: it imports from @horon/web only.
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
							group: [
								"@horon/app",
								"@horon/app/*",
								"react-native",
								"react-native/*",
								"react-native-web",
								"react-native-web/*",
							],
							message:
								"This is a web app. Import components from @horon/web only.",
						},
					],
				},
			],
		},
	},
])
