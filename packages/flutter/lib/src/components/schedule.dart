import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 고를 수 있는 목록 항목 하나입니다. React `PickerFieldProps.items`의 한 줄.
@immutable
class HoronPickerItem {
  /// 값을 만들고 보여 줄 라벨을 받습니다.
  const HoronPickerItem({required this.value, required this.label});

  /// 목록에서 이 항목을 가리키는 값입니다. React `value`.
  final String value;

  /// 줄에 그릴 라벨입니다. React `label`(`ReactNode`).
  final Widget label;
}

/// 요일 하나입니다. React `WeekdayPickerProps.days`의 한 줄.
@immutable
class HoronWeekday {
  /// 요일을 만듭니다.
  const HoronWeekday({required this.value, required this.label, required this.name});

  /// 요일을 가리키는 값입니다. 예: `mon`. React `value`.
  final String value;

  /// 버튼에 보이는 짧은 글자입니다. 예: `M`. React `label`.
  final String label;

  /// 화면 읽기 프로그램이 읽을 이름입니다. 예: `Monday`. React `name`.
  final String name;
}

/// 값 하나를 고르는 필드입니다.
///
/// React `PickerField`(Figma `Time field` 110:765): 40px 높이, 12 반경, 8 간격,
/// 16px 앞 아이콘과 14px 캐럿입니다. 누르면 최대 288px까지 자라는 유리 목록이
/// 8px 아래에 열립니다.
///
/// React의 `surface: "glass" | "inset"`은 `export type`이 아닌 인라인 유니온이라
/// 공개 enum이 될 수 없습니다. variant 게이트가 React에 없는 공개 enum을 거부하므로
/// [glass] 불리언으로 옮겼습니다. 거짓이면 스케줄 카드 안의 4% 잉크 필드가 됩니다.
class HoronPickerField extends StatefulWidget {
  /// 필드를 만듭니다.
  const HoronPickerField({
    super.key,
    required this.items,
    this.value,
    this.defaultValue,
    this.onChanged,
    this.icon,
    this.glass = true,
    this.label,
  });

  /// 고를 수 있는 항목입니다. React `items`.
  final List<HoronPickerItem> items;

  /// 지금 고른 값입니다. React `value`.
  final String? value;

  /// 처음 고른 값입니다. React `defaultValue`.
  final String? defaultValue;

  /// 값을 골랐을 때 호출됩니다. React `onValueChange`.
  final ValueChanged<String?>? onChanged;

  /// 앞에 놓을 16px 아이콘입니다. 생략하면 시계입니다. React `icon`.
  final Widget? icon;

  /// 유리 표면으로 그립니다. React `surface: "glass"`.
  final bool glass;

  /// 필드의 이름입니다. React `aria-label`.
  final String? label;

  @override
  State<HoronPickerField> createState() => _HoronPickerFieldState();
}

class _HoronPickerFieldState extends State<HoronPickerField> {
  /// `w-40` — 필드의 폭입니다. 부모가 더 좁으면 그 폭을 따릅니다.
  static const double _width = 160;

  /// `h-10` — 필드와 목록 줄의 높이입니다.
  static const double _height = 40;

  /// `[&>svg]:size-4` — 앞 아이콘.
  static const double _iconSize = 16;

  /// `size-3.5` — 캐럿.
  static const double _caretSize = 14;

  /// `[&_svg]:size-4.5` — 고른 줄의 체크.
  static const double _checkSize = 18;

  /// `max-h-72` — 목록의 최대 높이입니다.
  static const double _maxPopupHeight = 288;

  /// `transition-transform duration-200` — 캐럿이 도는 시간입니다.
  static const Duration _caretTurn = Duration(milliseconds: 200);

  late String? _value;
  bool _open = false;
  final MenuController _menu = MenuController();

  @override
  void initState() {
    super.initState();
    _value = widget.value ?? widget.defaultValue;
  }

  @override
  void didUpdateWidget(covariant HoronPickerField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) _value = widget.value;
  }

  void _select(HoronPickerItem item) {
    setState(() => _value = item.value);
    widget.onChanged?.call(item.value);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    HoronPickerItem? selected;
    for (final HoronPickerItem item in widget.items) {
      if (item.value == _value) {
        selected = item;
        break;
      }
    }

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite ? math.min(_width, constraints.maxWidth) : _width;
        return MenuAnchor(
          controller: _menu,
          // `sideOffset={8}` — 목록은 필드 8px 아래에 열립니다.
          alignmentOffset: Offset(0, space.s2),
          onOpen: () => setState(() => _open = true),
          onClose: () => setState(() => _open = false),
          style: MenuStyle(
            // `bg-glass-thick`.
            backgroundColor: WidgetStatePropertyAll<Color>(colors.glassThick),
            surfaceTintColor: const WidgetStatePropertyAll<Color>(Colors.transparent),
            shadowColor: const WidgetStatePropertyAll<Color>(Colors.transparent),
            elevation: const WidgetStatePropertyAll<double>(0),
            // `p-1.5`.
            padding: WidgetStatePropertyAll<EdgeInsets>(EdgeInsets.all(space.s1_5)),
            // `min-w-(--anchor-width)`.
            minimumSize: WidgetStatePropertyAll<Size>(Size(width, 0)),
            // `rounded-xl border border-glass-rim-strong`.
            shape: WidgetStatePropertyAll<OutlinedBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(theme.radius.xl),
                side: BorderSide(color: colors.glassRimStrong),
              ),
            ),
          ),
          menuChildren: <Widget>[
            SizedBox(
              width: width,
              child: ConstrainedBox(
                // `max-h-72 overflow-y-auto`.
                constraints: const BoxConstraints(maxHeight: _maxPopupHeight),
                child: SingleChildScrollView(
                  // 메뉴 패널이 이미 스크롤 컨트롤러를 씁니다. 여기서 primary를 쓰면 두
                  // 스크롤 위치가 같은 컨트롤러에 붙어 스크롤바가 그릴 수 없습니다.
                  primary: false,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    // `gap-0.5`.
                    spacing: space.s0_5,
                    children: <Widget>[
                      for (final HoronPickerItem item in widget.items)
                        MenuItemButton(
                          key: ValueKey<String>('horon-picker-item-${item.value}'),
                          onPressed: () => _select(item),
                          style: ButtonStyle(
                            minimumSize: WidgetStatePropertyAll<Size>(Size(0, _height)),
                            maximumSize: const WidgetStatePropertyAll<Size>(Size(double.infinity, _height)),
                            // `px-3`.
                            padding: WidgetStatePropertyAll<EdgeInsets>(EdgeInsets.symmetric(horizontal: space.s3)),
                            // `rounded-md`.
                            shape: WidgetStatePropertyAll<OutlinedBorder>(
                              RoundedRectangleBorder(borderRadius: BorderRadius.circular(theme.radius.md)),
                            ),
                            // `data-highlighted:bg-overlay-ink-6 data-selected:bg-overlay-ink-6`.
                            backgroundColor: WidgetStateProperty.resolveWith<Color?>((Set<WidgetState> states) {
                              final bool lit =
                                  states.contains(WidgetState.hovered) ||
                                  states.contains(WidgetState.focused) ||
                                  states.contains(WidgetState.pressed);
                              return lit ? colors.overlayInk6 : Colors.transparent;
                            }),
                            overlayColor: const WidgetStatePropertyAll<Color>(Colors.transparent),
                            // `text-label-md text-text-primary`.
                            textStyle: WidgetStatePropertyAll<TextStyle>(theme.text.labelMd),
                            foregroundColor: WidgetStatePropertyAll<Color>(colors.textPrimary),
                          ),
                          child: Row(
                            // `gap-2.5`.
                            spacing: space.s2_5,
                            children: <Widget>[
                              Expanded(
                                child: DefaultTextStyle.merge(
                                  style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  child: item.label,
                                ),
                              ),
                              if (item.value == _value) Icon(Icons.check, size: _checkSize, color: colors.textPrimary),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ],
          builder: (BuildContext context, MenuController controller, Widget? child) =>
              SizedBox(width: width, child: _trigger(theme, animate, selected, controller)),
        );
      },
    );
  }

  Widget _trigger(HoronThemeData theme, bool animate, HoronPickerItem? selected, MenuController controller) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(theme.radius.md);

    // `h-10 items-center gap-2 rounded-md px-3 text-left`.
    final Widget content = Padding(
      padding: EdgeInsets.symmetric(horizontal: space.s3),
      child: Row(
        spacing: space.s2,
        children: <Widget>[
          IconTheme.merge(
            data: IconThemeData(size: _iconSize, color: colors.textSecondary),
            child: SizedBox(width: _iconSize, height: _iconSize, child: widget.icon ?? const Icon(Icons.schedule)),
          ),
          Expanded(
            child: DefaultTextStyle.merge(
              key: const Key('horon-picker-value'),
              // `text-body-sm text-text-primary`.
              style: theme.text.bodySm.copyWith(color: colors.textPrimary),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              child: selected?.label ?? const SizedBox.shrink(),
            ),
          ),
          AnimatedRotation(
            // `group-data-popup-open:rotate-180`.
            turns: _open ? 0.5 : 0,
            duration: animate ? _caretTurn : Duration.zero,
            curve: HoronMotion.easeOutQuint,
            child: Icon(Icons.keyboard_arrow_down, size: _caretSize, color: colors.textSecondary),
          ),
        ],
      ),
    );

    final Widget surface = widget.glass
        // `border-glass-rim-strong bg-glass-regular` + LiquidGlass regular.
        ? HoronLiquidGlass(
            tier: HoronGlassTier.regular,
            borderRadius: radius,
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: radius,
                border: Border.all(color: colors.glassRimStrong),
              ),
              child: SizedBox(height: _height, child: content),
            ),
          )
        // `bg-overlay-ink-4`.
        : DecoratedBox(
            decoration: BoxDecoration(color: colors.overlayInk4, borderRadius: radius),
            child: SizedBox(height: _height, child: content),
          );

    return Semantics(
      button: true,
      label: widget.label,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          key: const Key('horon-picker-trigger'),
          behavior: HitTestBehavior.opaque,
          onTap: () => controller.isOpen ? controller.close() : controller.open(),
          child: surface,
        ),
      ),
    );
  }
}

/// 요일을 여러 개 고르는 36px 둥근 토글 줄입니다.
///
/// React `WeekdayPicker`(Figma `Weekday picker` 110:765): 켜지면 잉크색 바탕에
/// 밝은 글자, 꺼지면 6% 잉크 바탕에 보조 글자입니다. 폭이 모자라면 다음 줄로
/// 넘어갑니다.
class HoronWeekdayPicker extends StatefulWidget {
  /// 요일 줄을 만듭니다.
  const HoronWeekdayPicker({super.key, required this.days, this.value, this.defaultValue, this.onChanged, this.label});

  /// 표시 순서대로 놓을 요일입니다. React `days`.
  final List<HoronWeekday> days;

  /// 지금 켜진 요일 값입니다. React `value`.
  final List<String>? value;

  /// 처음 켜진 요일 값입니다. React `defaultValue`.
  final List<String>? defaultValue;

  /// 켜진 요일이 바뀔 때 호출됩니다. React `onValueChange`.
  final ValueChanged<List<String>>? onChanged;

  /// 줄의 이름입니다. React `aria-label`(기본 `Days`).
  final String? label;

  @override
  State<HoronWeekdayPicker> createState() => _HoronWeekdayPickerState();
}

class _HoronWeekdayPickerState extends State<HoronWeekdayPicker> {
  /// `size-9` — 토글의 지름입니다.
  static const double _toggleSize = 36;

  late List<String> _selected;

  @override
  void initState() {
    super.initState();
    _selected = <String>[...?widget.value ?? widget.defaultValue];
  }

  @override
  void didUpdateWidget(covariant HoronWeekdayPicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value && widget.value != null) {
      _selected = <String>[...widget.value!];
    }
  }

  void _toggle(String value) {
    final Set<String> next = _selected.toSet();
    if (!next.remove(value)) next.add(value);
    // React `ToggleGroup`은 표시 순서대로 값을 돌려줍니다.
    final List<String> ordered = <String>[
      for (final HoronWeekday day in widget.days)
        if (next.contains(day.value)) day.value,
    ];
    setState(() => _selected = ordered);
    widget.onChanged?.call(ordered);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    return Semantics(
      container: true,
      label: widget.label ?? 'Days',
      child: Wrap(
        // `gap-1.5`.
        spacing: space.s1_5,
        runSpacing: space.s1_5,
        children: <Widget>[
          for (final HoronWeekday day in widget.days)
            _WeekdayToggle(
              key: ValueKey<String>('horon-weekday-${day.value}'),
              label: day.label,
              name: day.name,
              selected: _selected.contains(day.value),
              size: _toggleSize,
              onTap: () => _toggle(day.value),
            ),
        ],
      ),
    );
  }
}

/// 요일 토글 하나입니다. React `Toggle`과 같은 눌림 배율을 씁니다.
class _WeekdayToggle extends StatefulWidget {
  const _WeekdayToggle({
    super.key,
    required this.label,
    required this.name,
    required this.selected,
    required this.size,
    required this.onTap,
  });

  final String label;
  final String name;
  final bool selected;
  final double size;
  final VoidCallback onTap;

  @override
  State<_WeekdayToggle> createState() => _WeekdayToggleState();
}

class _WeekdayToggleState extends State<_WeekdayToggle> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      toggled: widget.selected,
      label: widget.name,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
        onTapUp: (TapUpDetails details) => setState(() => _pressed = false),
        onTapCancel: () => setState(() => _pressed = false),
        onTap: widget.onTap,
        child: AnimatedScale(
          // `motion-press` — 누르면 0.97.
          scale: _pressed ? HoronMotion.pressScale : 1,
          duration: animate ? HoronMotion.pressDuration : Duration.zero,
          curve: HoronMotion.pressCurve,
          child: AnimatedContainer(
            duration: animate ? HoronMotion.colorsDuration : Duration.zero,
            curve: HoronMotion.colorsCurve,
            width: widget.size,
            height: widget.size,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              // `bg-overlay-ink-6` / `data-pressed:bg-interactive-primary`.
              color: widget.selected ? colors.interactivePrimary : colors.overlayInk6,
            ),
            // `text-label-md text-text-secondary` / `data-pressed:text-text-inverse`.
            child: Text(
              widget.label,
              maxLines: 1,
              style: theme.text.labelMd.copyWith(color: widget.selected ? colors.textInverse : colors.textSecondary),
            ),
          ),
        ),
      ),
    );
  }
}

/// 스케줄 카드입니다.
///
/// React `ScheduleCard`(Figma `Routine schedule card` 110:765): 380px 유리 카드에
/// 18px 여백과 14px 간격을 씁니다. 제목 줄에는 반복 아이콘이, 아래쪽에는 "다음
/// 실행" 줄이 하늘색 16% 바탕으로 들어갑니다.
class HoronScheduleCard extends StatelessWidget {
  /// 카드를 만듭니다.
  const HoronScheduleCard({super.key, required this.title, required this.children, this.nextRun});

  /// 카드의 제목입니다. React `title`(`ReactNode`).
  final Widget title;

  /// 제목 아래에 14px 간격으로 쌓을 내용입니다. React `children`.
  final List<Widget> children;

  /// 카드 맨 아래의 "다음 실행" 줄입니다. React `nextRun`.
  final Widget? nextRun;

  /// `w-95` — 카드의 폭입니다. 부모가 더 좁으면 그 폭을 따릅니다.
  static const double _width = 380;

  /// `size-4.5` — 제목 줄의 반복 아이콘입니다.
  static const double _repeatIcon = 18;

  /// `size-4` — "다음 실행" 줄의 달력 아이콘입니다.
  static const double _nextRunIcon = 16;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite ? math.min(_width, constraints.maxWidth) : _width;
        return SizedBox(
          width: width,
          child: HoronLiquidGlass(
            tier: HoronGlassTier.thick,
            borderRadius: radius,
            child: DecoratedBox(
              key: const Key('horon-schedule-card-surface'),
              decoration: BoxDecoration(
                borderRadius: radius,
                border: Border.all(color: colors.glassRimStrong),
              ),
              child: Padding(
                padding: EdgeInsets.all(space.step(4.5)),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  // `gap-3.5`.
                  spacing: space.s3_5,
                  children: <Widget>[
                    Row(
                      // `gap-2.5`.
                      spacing: space.s2_5,
                      children: <Widget>[
                        Icon(Icons.repeat, size: _repeatIcon, color: colors.textPrimary),
                        Expanded(
                          child: DefaultTextStyle.merge(
                            // `text-label-lg text-text-primary`.
                            style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                            child: title,
                          ),
                        ),
                      ],
                    ),
                    ...children,
                    if (nextRun != null)
                      Container(
                        key: const Key('horon-schedule-card-next-run'),
                        // `rounded-md bg-accent-sky-500-16 px-3 py-2.5`.
                        padding: EdgeInsets.symmetric(horizontal: space.s3, vertical: space.s2_5),
                        decoration: BoxDecoration(
                          color: colors.accentSky500_16,
                          borderRadius: BorderRadius.circular(theme.radius.md),
                        ),
                        child: Row(
                          spacing: space.s2,
                          children: <Widget>[
                            Icon(Icons.calendar_today_outlined, size: _nextRunIcon, color: colors.textPrimary),
                            Expanded(
                              child: DefaultTextStyle.merge(
                                // `text-label-md text-text-primary`.
                                style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                                child: nextRun!,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// 스케줄 카드 안의 캡션 붙은 묶음입니다. 예: "Repeat", "Days".
///
/// React `ScheduleSection`: 작은 보조 글자 캡션 아래에 6px 간격으로 내용을
/// 쌓습니다.
class HoronScheduleSection extends StatelessWidget {
  /// 묶음을 만듭니다.
  const HoronScheduleSection({super.key, required this.label, required this.children});

  /// 묶음의 캡션입니다. React `label`(`ReactNode`).
  final Widget label;

  /// 캡션 아래에 쌓을 내용입니다. React `children`.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    return Column(
      mainAxisSize: MainAxisSize.min,
      // React `flex-col`의 stretch 대신 start를 씁니다. React는 필드에 `w-40`을
      // 직접 적어 stretch를 막으므로, 자식이 자기 폭을 유지하는 쪽이 같은 그림입니다.
      crossAxisAlignment: CrossAxisAlignment.start,
      // `gap-1.5`.
      spacing: space.s1_5,
      children: <Widget>[
        DefaultTextStyle.merge(
          // `text-caption text-text-secondary`.
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
          child: label,
        ),
        ...children,
      ],
    );
  }
}
