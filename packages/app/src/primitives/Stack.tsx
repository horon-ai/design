import { View, type ViewProps, type ViewStyle } from "react-native"
import { useTheme } from "../theme"

export type StackProps = ViewProps & {
	direction?: "row" | "column"
	gap?: keyof ReturnType<typeof useTheme>["space"]
	align?: ViewStyle["alignItems"]
	justify?: ViewStyle["justifyContent"]
	wrap?: boolean
	flex?: number
	flex1?: boolean
}

export function Stack({
	direction = "column",
	gap = 0,
	align,
	justify,
	wrap,
	flex,
	flex1,
	style,
	...rest
}: StackProps) {
	const t = useTheme()

	return (
		<View
			{...rest}
			style={[
				{
					flexDirection: direction,
					gap: t.space[gap],
					alignItems: align,
					justifyContent: justify,
					flexWrap: wrap ? "wrap" : "nowrap",
					flex: flex1 ? 1 : flex,
				},
				style,
			]}
		/>
	)
}

export function VStack(props: Omit<StackProps, "direction">) {
	return <Stack {...props} direction="column" />
}

export function HStack(props: Omit<StackProps, "direction">) {
	return <Stack {...props} direction="row" />
}
