"use client"

import * as React from "react"
import { Toaster as SonnerToasterPrimitive, toast as sonnerToast } from "sonner"
import type { ToasterProps } from "sonner"

import { cn } from "cn"

function useDocumentTheme(): "light" | "dark" {
	const [theme, setTheme] = React.useState<"light" | "dark">("light")

	React.useEffect(() => {
		const root = document.documentElement
		const read = () => setTheme(root.classList.contains("dark") ? "dark" : "light")
		read()
		const observer = new MutationObserver(read)
		observer.observe(root, { attributes: true, attributeFilter: ["class"] })
		return () => observer.disconnect()
	}, [])

	return theme
}

function SonnerToaster({
	className,
	theme,
	toastOptions,
	...props
}: ToasterProps) {
	const documentTheme = useDocumentTheme()

	return (
		<SonnerToasterPrimitive
			theme={theme ?? documentTheme}
			className={cn("toaster group", className)}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius-md)",
				} as React.CSSProperties
			}
			toastOptions={{
				...toastOptions,
				classNames: {
					toast: "group toast group-[.toaster]:text-sm",
					title: "text-[13px] font-semibold",
					description: "text-[13px] text-muted-foreground",
					actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
					closeButton: "group-[.toast]:bg-popover group-[.toast]:text-muted-foreground",
					...toastOptions?.classNames,
				},
			}}
			{...props}
		/>
	)
}

export { SonnerToaster, sonnerToast }
