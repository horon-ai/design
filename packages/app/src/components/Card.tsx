import { View, type ViewProps } from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export function Card({ style, ...rest }: ViewProps) {
	const t = useTheme()
	return (
		<View
			{...rest}
			style={[
				{
					backgroundColor: t.colors.card,
					borderRadius: t.radius.xl,
					borderWidth: 1,
					borderColor: t.colors.border,
					padding: t.space[4],
				},
				style,
			]}
		/>
	)
}

export function CardHeader({ style, ...rest }: ViewProps) {
	const t = useTheme()
	return <View {...rest} style={[{ gap: t.space[1.5] }, style]} />
}

export function CardTitle({
	children,
	...rest
}: React.ComponentProps<typeof Text>) {
	return (
		<Text variant="subtitle" {...rest}>
			{children}
		</Text>
	)
}

export function CardDescription({
	children,
	...rest
}: React.ComponentProps<typeof Text>) {
	return (
		<Text variant="bodySm" tone="muted" {...rest}>
			{children}
		</Text>
	)
}

export function CardContent({ style, ...rest }: ViewProps) {
	const t = useTheme()
	return <View {...rest} style={[{ gap: t.space[3] }, style]} />
}

export function CardFooter({ style, ...rest }: ViewProps) {
	const t = useTheme()
	return (
		<View
			{...rest}
			style={[{ flexDirection: "row", alignItems: "center", gap: t.space[2], marginTop: t.space[4] }, style]}
		/>
	)
}
