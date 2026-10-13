import { type ReactNode } from "react"
import {
	ActivityIndicator,
	Pressable,
	Text,
	type PressableProps,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from "react-native"
import { useTheme } from "../theme"

export type ButtonVariant =
	| "default"
	| "secondary"
	| "outline"
	| "ghost"
	| "destructive"
	| "link"

export type ButtonSize = "sm" | "md" | "lg" | "icon"

export type ButtonProps = Omit<PressableProps, "style" | "children"> & {
	variant?: ButtonVariant
	size?: ButtonSize
	label?: string
	children?: ReactNode
	loading?: boolean
	fullWidth?: boolean
	style?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
}

export function Button({
	variant = "default",
	size = "md",
	label,
	children,
	loading = false,
	disabled,
	fullWidth = false,
	style,
	textStyle,
	...rest
}: ButtonProps) {
	const t = useTheme()

	const metrics = {
		sm: { height: 32, paddingHorizontal: t.space[3], fontSize: t.fontSize.xs, gap: t.space[1.5], radius: t.radius.sm },
		md: { height: 36, paddingHorizontal: t.space[4], fontSize: t.fontSize.sm, gap: t.space[2], radius: t.radius.md },
		lg: { height: 44, paddingHorizontal: t.space[5], fontSize: t.fontSize.base, gap: t.space[2], radius: t.radius.md },
		icon: { height: 36, paddingHorizontal: 0, fontSize: t.fontSize.sm, gap: 0, radius: t.radius.md },
	}[size]

	const palette = {
		default: { bg: t.colors.primary, fg: t.colors["primary-foreground"], border: "transparent", underline: false },
		secondary: { bg: t.colors.secondary, fg: t.colors["secondary-foreground"], border: "transparent", underline: false },
		outline: { bg: "transparent", fg: t.colors.foreground, border: t.colors.border, underline: false },
		ghost: { bg: "transparent", fg: t.colors.foreground, border: "transparent", underline: false },
		destructive: { bg: t.colors.destructive, fg: t.colors["destructive-foreground"], border: "transparent", underline: false },
		link: { bg: "transparent", fg: t.colors.primary, border: "transparent", underline: true },
	}[variant]

	const isDisabled = disabled || loading
	const content = children ?? label
	const isTextOnly = typeof content === "string" || typeof content === "number"

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled: Boolean(isDisabled), busy: loading }}
			disabled={isDisabled}
			style={({ pressed }) => [
				{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: metrics.gap,
					height: metrics.height,
					width: size === "icon" ? metrics.height : undefined,
					paddingHorizontal: metrics.paddingHorizontal,
					borderRadius: metrics.radius,
					borderWidth: variant === "outline" ? 1 : 0,
					borderColor: palette.border,
					backgroundColor: palette.bg,
					opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
					alignSelf: fullWidth ? "stretch" : "flex-start",
				},
				style,
			]}
			{...rest}
		>
			{loading ? <ActivityIndicator size="small" color={palette.fg} /> : null}
			{isTextOnly ? (
				<Text
					style={[
						{
							color: palette.fg,
							fontSize: metrics.fontSize,
							fontWeight: t.fontWeight.medium,
							textDecorationLine: palette.underline ? "underline" : "none",
						},
						textStyle,
					]}
				>
					{content}
				</Text>
			) : (
				content
			)}
		</Pressable>
	)
}
