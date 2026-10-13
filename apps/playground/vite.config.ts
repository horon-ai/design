import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const src = fileURLToPath(new URL("./src", import.meta.url))

// Web app: DOM components from @horon/web only. No react-native here.
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: { "@": src },
		dedupe: ["react", "react-dom"],
	},
})
