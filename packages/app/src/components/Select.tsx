import { useState } from "react"
import {
	Modal,
	Pressable,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type SelectOption = {
	value: string
	label: string
	disabled?: boolean
}

export type SelectProps = {
	value?: string
	onValueChange?: (value: string) => void
	options: SelectOption[]
	placeholder?: string
	disabled?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	style?: StyleProp<ViewStyle>
}

export function Select({
	value,
	onValueChange,
	options,
	placeholder = "Select…",
	disabled = false,
	defaultOpen = false,
	onOpenChange,
	style,
}: SelectProps) {
	const t = useTheme()
	const [open, setOpen] = useState(defaultOpen)
	const selected = options.find((option) => option.value === value)

	const setOpenState = (next: boolean) => {
		setOpen(next)
		onOpenChange?.(next)
	}

	return (
		<>
			<Pressable
				accessibilityRole="button"
				accessibilityState={{ expanded: open, disabled }}
				aria-expanded={open}
				aria-disabled={disabled}
				disabled={disabled}
				onPress={() => setOpenState(true)}
				style={[
					{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: t.space[2],
						height: 36,
						paddingHorizontal: t.space[3],
						borderRadius: t.radius.md,
						borderWidth: 1,
						borderColor: open ? t.colors.ring : t.colors.input,
						backgroundColor: t.colors.background,
						opacity: disabled ? 0.5 : 1,
					},
					style,
				]}
			>
				<Text
					style={{
						color: selected
							? t.colors.foreground
							: t.colors["muted-foreground"],
						fontSize: t.fontSize.sm,
					}}
				>
					{selected ? selected.label : placeholder}
				</Text>
				<View
					style={{
						width: 7,
						height: 7,
						borderRightWidth: 1.5,
						borderBottomWidth: 1.5,
						borderColor: t.colors["muted-foreground"],
						transform: [{ rotate: "45deg" }],
						marginTop: -3,
					}}
				/>
			</Pressable>
			<Modal
				visible={open}
				transparent
				animationType="fade"
				onRequestClose={() => setOpenState(false)}
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
						accessibilityLabel="Close select"
						onPress={() => setOpenState(false)}
						style={[
							StyleSheet.absoluteFill,
							{ backgroundColor: t.colors.foreground, opacity: 0.45 },
						]}
					/>
					<View
						style={{
							width: "100%",
							maxWidth: 320,
							backgroundColor: t.colors.card,
							borderRadius: t.radius.lg,
							borderWidth: 1,
							borderColor: t.colors.border,
							padding: t.space[1.5],
							gap: 2,
							...t.shadow.md.native.ios,
							...t.shadow.md.native.android,
						}}
					>
						{options.map((option) => {
							const isSelected = option.value === value
							return (
								<Pressable
									key={option.value}
									disabled={option.disabled}
									onPress={() => {
										onValueChange?.(option.value)
										setOpenState(false)
									}}
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										paddingHorizontal: t.space[3],
										paddingVertical: t.space[2],
										borderRadius: t.radius.sm,
										backgroundColor: isSelected
											? t.colors.secondary
											: "transparent",
										opacity: option.disabled ? 0.5 : 1,
									}}
								>
									<Text
										style={{
											fontSize: t.fontSize.sm,
											color: t.colors.foreground,
										}}
									>
										{option.label}
									</Text>
									{isSelected ? (
										<View
											style={{
												width: 4,
												height: 8,
												borderRightWidth: 2,
												borderBottomWidth: 2,
												borderColor: t.colors.primary,
												transform: [{ rotate: "45deg" }],
												marginTop: -2,
											}}
										/>
									) : null}
								</Pressable>
							)
						})}
					</View>
				</View>
			</Modal>
		</>
	)
}
