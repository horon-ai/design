import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

// This app renders both layers (@horon/web and @horon/app through
// react-native-web), so unlike the packages it has no import boundary to
// enforce. It also runs bun tests, hence the node/Bun globals.
export default defineConfig([
	globalIgnores(["storybook-static"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, Bun: "readonly" },
		},
		rules: {
			"react-refresh/only-export-components": "off",
		},
	},
])
