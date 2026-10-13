import { StyleSheet, View, type ViewProps } from "react-native"
import { useTheme } from "../theme"

export type DividerProps = ViewProps & {
	orientation?: "horizontal" | "vertical"
}

export function Divider({
	orientation = "horizontal",
	style,
	...rest
}: DividerProps) {
	const t = useTheme()
	const thickness = StyleSheet.hairlineWidth

	return (
		<View
			{...rest}
			style={[
				orientation === "horizontal"
					? { height: thickness, alignSelf: "stretch" }
					: { width: thickness, alignSelf: "stretch" },
				{ backgroundColor: t.colors.border },
				style,
			]}
		/>
	)
}
