import { withThemeByClassName } from "@storybook/addon-themes"
import type { Decorator, Preview } from "@storybook/react-vite"
import { ThemeProvider as NativeThemeProvider } from "@horon/app"

import "@horon/web/globals.css"

/**
 * The class-based theme drives the DOM (shadcn/ui) components; the
 * NativeThemeProvider drives the React Native components, which cannot read a
 * CSS class. Both follow the same toolbar selection.
 */
const withNativeTheme: Decorator = (Story, context) => {
	const theme = context.globals.theme === "dark" ? "dark" : "light"
	return (
		<NativeThemeProvider scheme={theme}>
			<div className="bg-background text-foreground min-h-40 p-6">
				<Story />
			</div>
		</NativeThemeProvider>
	)
}

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: "padded",
		a11y: { test: "todo" },
	},
	decorators: [
		withThemeByClassName({
			themes: { light: "", dark: "dark" },
			defaultTheme: "light",
		}),
		withNativeTheme,
	],
}

export default preview
