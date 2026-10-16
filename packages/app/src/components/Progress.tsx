import { useEffect, useState } from "react"
import {
	Animated,
	Easing,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type ProgressVariant =
	| "default"
	| "success"
	| "warning"
	| "destructive"

export type ProgressProps = {
	value?: number
	max?: number
	variant?: ProgressVariant
	label?: string
	showValue?: boolean
	indeterminate?: boolean
	style?: StyleProp<ViewStyle>
}

export function Progress({
	value = 0,
	max = 100,
	variant = "default",
	label,
	showValue = false,
	indeterminate = false,
	style,
}: ProgressProps) {
	const t = useTheme()
	const [trackWidth, setTrackWidth] = useState(0)
	const [anim] = useState(() => new Animated.Value(0))

	useEffect(() => {
		if (!indeterminate) return
		const loop = Animated.loop(
			Animated.timing(anim, {
				toValue: 1,
				duration: 1100,
				easing: Easing.inOut((progress) => Easing.ease(progress)),
				useNativeDriver: false,
			}),
		)
		loop.start()
		return () => loop.stop()
	}, [anim, indeterminate])

	const barWidth = trackWidth * 0.4
	const translateX = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [-barWidth, trackWidth],
	})

	const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
	const fillColor = {
		default: t.colors.primary,
		success: t.colors.success,
		warning: t.colors.warning,
		destructive: t.colors.destructive,
	}[variant]

	return (
		<View style={[{ gap: t.space[1.5], alignSelf: "stretch" }, style]}>
			{label || showValue ? (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					{label ? (
						<Text variant="label" tone="muted">
							{label}
						</Text>
					) : (
						<View />
					)}
					{showValue ? (
						<Text variant="caption" tone="muted">
							{Math.round(pct)}%
						</Text>
					) : null}
				</View>
			) : null}
			<View
				onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
				accessibilityRole="progressbar"
				accessibilityValue={
					indeterminate ? undefined : { min: 0, max, now: value }
				}
				aria-valuemin={indeterminate ? undefined : 0}
				aria-valuemax={indeterminate ? undefined : max}
				aria-valuenow={indeterminate ? undefined : value}
				style={{
					height: 8,
					width: "100%",
					borderRadius: t.radius.full,
					backgroundColor: t.colors.muted,
					overflow: "hidden",
				}}
			>
				{indeterminate ? (
					<Animated.View
						style={{
							height: "100%",
							width: barWidth,
							borderRadius: t.radius.full,
							backgroundColor: fillColor,
							transform: [{ translateX }],
						}}
					/>
				) : (
					<View
						style={{
							height: "100%",
							width: `${pct}%`,
							borderRadius: t.radius.full,
							backgroundColor: fillColor,
						}}
					/>
				)}
			</View>
		</View>
	)
}
