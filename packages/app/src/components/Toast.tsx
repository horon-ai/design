import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react"
import {
	Pressable,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type ToastVariant = "default" | "success" | "warning" | "destructive"

export type ToastProps = {
	title?: string
	description?: string
	variant?: ToastVariant
	action?: ReactNode
	onDismiss?: () => void
	duration?: number
	style?: StyleProp<ViewStyle>
}

export function Toast({
	title,
	description,
	variant = "default",
	action,
	onDismiss,
	duration,
	style,
}: ToastProps) {
	const t = useTheme()

	useEffect(() => {
		if (!onDismiss || !duration) return
		const id = setTimeout(onDismiss, duration)
		return () => clearTimeout(id)
	}, [onDismiss, duration])

	const accent = {
		default: t.colors.border,
		success: t.colors.success,
		warning: t.colors.warning,
		destructive: t.colors.destructive,
	}[variant]

	return (
		<View
			accessibilityRole="alert"
			style={[
				{
					width: "100%",
					maxWidth: 380,
					flexDirection: "row",
					alignItems: "flex-start",
					gap: t.space[3],
					padding: t.space[3],
					borderRadius: t.radius.lg,
					borderWidth: 1,
					borderColor: t.colors.border,
					borderLeftWidth: 3,
					borderLeftColor: accent,
					backgroundColor: t.colors.card,
					...t.shadow.md.native.ios,
					...t.shadow.md.native.android,
				},
				style,
			]}
		>
			<View style={{ flex: 1, gap: t.space[1] }}>
				{title ? (
					<Text variant="label" style={{ color: t.colors.foreground }}>
						{title}
					</Text>
				) : null}
				{description ? (
					<Text variant="bodySm" tone="muted">
						{description}
					</Text>
				) : null}
				{action ? <View style={{ marginTop: t.space[1] }}>{action}</View> : null}
			</View>
			{onDismiss ? (
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Dismiss"
					hitSlop={8}
					onPress={onDismiss}
					style={{
						width: 20,
						height: 20,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							color: t.colors["muted-foreground"],
							fontSize: t.fontSize.base,
							lineHeight: t.fontSize.base,
						}}
					>
						×
					</Text>
				</Pressable>
			) : null}
		</View>
	)
}

export type ToastOptions = Omit<ToastProps, "onDismiss" | "style">

type ToastItem = ToastOptions & { id: number }

type ToastContextValue = {
	toast: (options: ToastOptions) => number
	dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
	const ctx = useContext(ToastContext)
	if (!ctx) {
		throw new Error("useToast must be used within a <ToastProvider>")
	}
	return ctx
}

export function ToastProvider({
	children,
	duration = 4000,
}: {
	children: ReactNode
	duration?: number
}) {
	const t = useTheme()
	const [items, setItems] = useState<ToastItem[]>([])
	const idRef = useRef(0)

	const dismiss = useCallback((id: number) => {
		setItems((prev) => prev.filter((item) => item.id !== id))
	}, [])

	const toast = useCallback(
		(options: ToastOptions) => {
			const id = (idRef.current += 1)
			setItems((prev) => [...prev, { id, ...options }])
			const autoDismiss = options.duration ?? duration
			if (autoDismiss > 0) {
				setTimeout(() => dismiss(id), autoDismiss)
			}
			return id
		},
		[dismiss, duration],
	)

	return (
		<ToastContext.Provider value={{ toast, dismiss }}>
			{children}
			<View
				pointerEvents="box-none"
				style={{
					position: "absolute",
					bottom: t.space[4],
					right: t.space[4],
					left: t.space[4],
					alignItems: "flex-end",
					gap: t.space[2],
				}}
			>
				{items.map((item) => {
					const { id, ...rest } = item
					return (
						<Toast key={id} {...rest} onDismiss={() => dismiss(id)} />
					)
				})}
			</View>
		</ToastContext.Provider>
	)
}
