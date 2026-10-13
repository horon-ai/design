import { ActivityIndicator, type ActivityIndicatorProps } from "react-native"
import { useTheme } from "../theme"

export type SpinnerProps = ActivityIndicatorProps

export function Spinner({ color, ...rest }: SpinnerProps) {
	const t = useTheme()
	return <ActivityIndicator color={color ?? t.colors["muted-foreground"]} {...rest} />
}
