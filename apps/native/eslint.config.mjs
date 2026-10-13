import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

// This is the Expo native app: it imports from @horon/app only.
export default defineConfig([
	globalIgnores([".expo", "ios", "android"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, __DEV__: "readonly" },
		},
		rules: {
			"react-refresh/only-export-components": "off",
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: [
								"@horon/web",
								"@horon/web/*",
								"react-native-web",
								"react-native-web/*",
								"react-dom",
								"react-dom/*",
							],
							message:
								"This is the native app. Import components from @horon/app only.",
						},
					],
				},
			],
		},
	},
]);
