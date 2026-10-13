import type { ReactNode } from "react"
import {
	Modal,
	Pressable,
	StyleSheet,
	View,
	type ViewProps,
} from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type DialogProps = {
	open: boolean
	onOpenChange?: (open: boolean) => void
	children: ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
	const t = useTheme()

	return (
		<Modal
			visible={open}
			transparent
			animationType="fade"
			onRequestClose={() => onOpenChange?.(false)}
		>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					padding: t.space[4],
				}}
			>
				<Pressable
					accessibilityLabel="Close dialog"
					onPress={() => onOpenChange?.(false)}
					style={[
						StyleSheet.absoluteFill,
						{ backgroundColor: t.colors.foreground, opacity: 0.45 },
					]}
				/>
				{children}
			</View>
		</Modal>
	)
}

export function DialogContent({ style, ...rest }: ViewProps) {
	const t = useTheme()
	return (
		<View
			{...rest}
			style={[
				{
					width: "100%",
					maxWidth: 420,
					backgroundColor: t.colors.card,
					borderRadius: t.radius.xl,
					borderWidth: 1,
					borderColor: t.colors.border,
					padding: t.space[6],
					gap: t.space[4],
					...t.shadow.lg.native.ios,
					...t.shadow.lg.native.android,
				},
				style,
			]}
		/>
	)
}

export function DialogHeader({ style, ...rest }: ViewProps) {
	const t = useTheme()
	return <View {...rest} style={[{ gap: t.space[1.5] }, style]} />
}

export function DialogTitle({
	children,
	...rest
}: React.ComponentProps<typeof Text>) {
	return (
		<Text variant="subtitle" {...rest}>
			{children}
		</Text>
	)
}

export function DialogDescription({
	children,
	...rest
}: React.ComponentProps<typeof Text>) {
	return (
		<Text variant="bodySm" tone="muted" {...rest}>
			{children}
		</Text>
	)
}

export function DialogFooter({ style, ...rest }: ViewProps) {
	const t = useTheme()
	return (
		<View
			{...rest}
			style={[
				{
					flexDirection: "row",
					justifyContent: "flex-end",
					gap: t.space[2],
					marginTop: t.space[2],
				},
				style,
			]}
		/>
	)
}
