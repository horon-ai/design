import { useState, type ReactNode } from "react"
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type TooltipSide = "top" | "bottom"

export type TooltipProps = {
	content: ReactNode
	children: ReactNode
	side?: TooltipSide
	defaultOpen?: boolean
	style?: StyleProp<ViewStyle>
}

export function Tooltip({
	content,
	children,
	side = "top",
	defaultOpen = false,
	style,
}: TooltipProps) {
	const t = useTheme()
	const [visible, setVisible] = useState(defaultOpen)

	return (
		<View style={[{ alignSelf: "flex-start" }, style]}>
			{visible ? (
				<View
					pointerEvents="none"
					style={[
						{
							position: "absolute",
							left: 0,
							right: 0,
							alignItems: "center",
						},
						side === "top"
							? { bottom: "100%", marginBottom: t.space[1.5] }
							: { top: "100%", marginTop: t.space[1.5] },
					]}
				>
					<View
						style={{
							backgroundColor: t.colors.foreground,
							paddingHorizontal: t.space[2],
							paddingVertical: t.space[1],
							borderRadius: t.radius.sm,
							maxWidth: 240,
							...t.shadow.md.native.ios,
							...t.shadow.md.native.android,
						}}
					>
						{typeof content === "string" || typeof content === "number" ? (
							<Text
								style={{
									color: t.colors.background,
									fontSize: t.fontSize.xs,
									lineHeight: t.fontSize.xs * t.lineHeight.normal,
								}}
							>
								{content}
							</Text>
						) : (
							content
						)}
					</View>
				</View>
			) : null}
			<Pressable
				onHoverIn={() => setVisible(true)}
				onHoverOut={() => setVisible(false)}
				onLongPress={() => setVisible((current) => !current)}
				delayLongPress={200}
			>
				{children}
			</Pressable>
		</View>
	)
}
