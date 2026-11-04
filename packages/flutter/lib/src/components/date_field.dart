import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../contracts/surface.dart';
import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'calendar.dart';
import 'input.dart';

/// 날짜를 고르는 40px 유리 필드입니다. 누르면 달력이 아래에 열립니다.
///
/// React `DateField`(Figma `Date field` 60:244): 280px 필드에 14px 여백, 12 반경,
/// 8 간격, 16px 달력 아이콘을 씁니다. 값이 없으면 자리표시자를 흐린 글자로, 값이
/// 있으면 본문 색으로, 비활성이면 비활성 색으로 그립니다.
///
/// [HoronCalendar]의 속성을 그대로 받아 팝업 안의 달력에 넘깁니다. React처럼
/// 날짜 하나와 범위를 모두 다루되, 값은 [value]/[onValueChange] 또는
/// `date-field.tsx`의 `DateFieldSize`(`ControlSize`)입니다.
enum HoronDateFieldSize {
  /// `size="sm"` — 높이 32, `body-sm`, 칸 32.
  sm,

  /// `size="md"` — 높이 40, `body-md`, 칸 40. 기본값입니다.
  md,

  /// `size="lg"` — 높이 48, `body-lg`, 칸 48.
  lg,
}

HoronCalendarSize _calendarSizeOf(HoronDateFieldSize size) => switch (size) {
  HoronDateFieldSize.sm => HoronCalendarSize.sm,
  HoronDateFieldSize.md => HoronCalendarSize.md,
  HoronDateFieldSize.lg => HoronCalendarSize.lg,
};

HoronInputSize _inputSizeOf(HoronDateFieldSize size) => switch (size) {
  HoronDateFieldSize.sm => HoronInputSize.sm,
  HoronDateFieldSize.md => HoronInputSize.md,
  HoronDateFieldSize.lg => HoronInputSize.lg,
};

/// [range]/[onRangeChange] 중 한 쪽만 넘깁니다.
class HoronDateField extends StatefulWidget {
  /// 필드를 만듭니다.
  const HoronDateField({
    super.key,
    this.placeholder = 'Pick a date',
    this.invalid = false,
    this.disabled = false,
    this.formatDate,
    this.formatRange,
    this.value,
    this.onValueChange,
    this.range,
    this.onRangeChange,
    this.defaultMonth,
    this.month,
    this.onMonthChange,
    this.isDateDisabled,
    this.weekStartsOn = 0,
    this.today,
    this.popover = false,
    this.size = HoronDateFieldSize.md,
    this.surface = HoronSurface.solid,
  }) : assert(
         range == null && onRangeChange == null || value == null && onValueChange == null,
         'single 모드(value)와 range 모드(range)를 함께 넘길 수 없습니다.',
       );

  /// 값이 없을 때 보이는 문구입니다. React `placeholder`.
  final String placeholder;

  /// 값이 잘못됐음을 알리는 빨간 테두리입니다. React `invalid`.
  final bool invalid;

  /// 눌러도 열리지 않는 상태입니다. React `disabled`.
  final bool disabled;

  /// 날짜 하나를 글로 바꾸는 함수입니다. React `format`(single 모드).
  final String Function(DateTime value)? formatDate;

  /// 범위를 글로 바꾸는 함수입니다. React `format`(range 모드).
  final String Function(HoronDateRange range)? formatRange;

  /// 고른 날짜입니다. React `value`(single 모드).
  final DateTime? value;

  /// 날짜를 골랐을 때 호출됩니다. React `onValueChange`(single 모드).
  final ValueChanged<DateTime>? onValueChange;

  /// 고른 범위입니다. React `value`(range 모드).
  final HoronDateRange? range;

  /// 범위를 골랐을 때 호출됩니다. React `onValueChange`(range 모드).
  final ValueChanged<HoronDateRange>? onRangeChange;

  /// 처음 보이는 달입니다. React `defaultMonth`.
  final DateTime? defaultMonth;

  /// 보이는 달을 바깥에서 정합니다. React `month`.
  final DateTime? month;

  /// 보이는 달이 바뀔 때 호출됩니다. React `onMonthChange`.
  final ValueChanged<DateTime>? onMonthChange;

  /// 고를 수 없는 날을 알려 줍니다. React `isDateDisabled`.
  final bool Function(DateTime date)? isDateDisabled;

  /// 0이면 일요일, 1이면 월요일에서 한 주가 시작합니다. React `weekStartsOn`.
  final int weekStartsOn;

  /// 오늘로 칠 날입니다. React `today`.
  final DateTime? today;

  /// 팝업 안의 달력을 팝오버 모양으로 그립니다. React `variant: "popover"`.
  final bool popover;

  /// 크기입니다. 기본값은 [HoronDateFieldSize.md]입니다.
  final HoronDateFieldSize size;

  /// 표면입니다. 기본값은 [HoronSurface.solid]입니다.
  final HoronSurface surface;

  @override
  State<HoronDateField> createState() => _HoronDateFieldState();
}

class _HoronDateFieldState extends State<HoronDateField> {
  /// `w-70` — 필드의 폭입니다. 부모가 더 좁으면 그 폭을 따릅니다.
  static const double _width = 280;

  /// `size-10` 일곱 칸 + `p-4` 좌우 — 기본 달력의 자연 폭입니다.
  static const double _calendarWidth = 7 * 40 + 2 * 16;

  /// `size-10` 일곱 칸 + `p-3.5` 좌우 — 팝오버 달력의 자연 폭입니다.
  static const double _calendarPopoverWidth = 7 * 40 + 2 * 14;

  final MenuController _menu = MenuController();

  String _label(MaterialLocalizations localizations) {
    final HoronDateRange? range = widget.range;
    if (range != null) {
      return widget.formatRange?.call(range) ?? _defaultRangeLabel(range, localizations);
    }
    final DateTime? value = widget.value;
    if (value == null) return '';
    return widget.formatDate?.call(value) ?? _defaultDateLabel(value, localizations);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(theme.radius.md);
    final String text = _label(MaterialLocalizations.of(context));
    final HoronFieldMetrics metrics = horonFieldMetrics(_inputSizeOf(widget.size), theme);
    // 달력은 자기 LayoutBuilder로 폭을 정합니다. 메뉴 패널은 자식의 고유 폭을 묻기
    // 때문에(LayoutBuilder는 그 질문에 답할 수 없습니다), 팝업 폭은 화면 폭과
    // 달력의 자연 폭으로 미리 정합니다.
    final double calendarWidth = math.min(
      widget.popover ? _calendarPopoverWidth : _calendarWidth,
      MediaQuery.sizeOf(context).width - space.s4,
    );

    final Color textColor = widget.disabled
        ? colors.textDisabled
        : text.isNotEmpty
        ? colors.textPrimary
        : colors.textPlaceholder;
    final TextStyle valueStyle = metrics.textStyle.copyWith(color: textColor);

    // 메뉴 패널은 앵커 자식에게 고유 폭을 묻습니다. LayoutBuilder 는 그 질문에 답하지
    // 못하므로("LayoutBuilder does not support returning intrinsic dimensions"), 폭은
    // 화면 폭에서 직접 계산합니다.
    final double width = math.min(_width, MediaQuery.sizeOf(context).width - space.s4);

    return MenuAnchor(
      controller: _menu,
      // `sideOffset={8}`.
      alignmentOffset: Offset(0, space.s2),
      style: MenuStyle(
        // 달력이 자기 유리 판을 그리므로 팝업 상자는 아무것도 칠하지 않습니다.
        backgroundColor: const WidgetStatePropertyAll<Color>(Colors.transparent),
        surfaceTintColor: const WidgetStatePropertyAll<Color>(Colors.transparent),
        shadowColor: const WidgetStatePropertyAll<Color>(Colors.transparent),
        elevation: const WidgetStatePropertyAll<double>(0),
        padding: const WidgetStatePropertyAll<EdgeInsets>(EdgeInsets.zero),
        shape: const WidgetStatePropertyAll<OutlinedBorder>(RoundedRectangleBorder()),
      ),
      menuChildren: <Widget>[
        _MotionPopup(
          child: SizedBox(
            width: calendarWidth,
            child: HoronCalendar(
              width: calendarWidth,
              value: widget.value,
              onValueChange: widget.onValueChange,
              range: widget.range,
              onRangeChange: widget.onRangeChange,
              defaultMonth: widget.defaultMonth,
              month: widget.month,
              onMonthChange: widget.onMonthChange,
              isDateDisabled: widget.isDateDisabled,
              weekStartsOn: widget.weekStartsOn,
              today: widget.today,
              popover: widget.popover,
              size: _calendarSizeOf(widget.size),
              surface: widget.surface == HoronSurface.glass ? HoronCalendarSurface.glass : HoronCalendarSurface.solid,
            ),
          ),
        ),
      ],
      builder: (BuildContext context, MenuController controller, Widget? child) => SizedBox(
        width: width,
        child: Semantics(
          button: true,
          enabled: !widget.disabled,
          child: MouseRegion(
            cursor: widget.disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
            child: GestureDetector(
              key: const Key('horon-date-field-trigger'),
              behavior: HitTestBehavior.opaque,
              onTap: widget.disabled ? null : () => controller.isOpen ? controller.close() : controller.open(),
              child: SizedBox(
                key: const Key('horon-date-field-surface'),
                height: metrics.height,
                child: widget.surface == HoronSurface.glass
                    ? HoronLiquidGlass(
                        tier: HoronGlassTier.regular,
                        borderRadius: radius,
                        edgeColor: widget.invalid ? colors.borderDanger : null,
                        child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
                          child: _row(colors, metrics, text, valueStyle),
                        ),
                      )
                    : HoronFieldBox(
                        surface: HoronInputSurface.solid,
                        invalid: widget.invalid,
                        enabled: !widget.disabled,
                        padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
                        child: _row(colors, metrics, text, valueStyle),
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _row(HoronColors colors, HoronFieldMetrics metrics, String text, TextStyle valueStyle) {
    return Row(
      spacing: metrics.gap,
      children: <Widget>[
        Icon(Icons.calendar_today_outlined, size: metrics.icon, color: colors.textSecondary),
        Expanded(
          child: Text(
            text.isEmpty ? widget.placeholder : text,
            key: const Key('horon-date-field-value'),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.left,
            style: valueStyle,
          ),
        ),
      ],
    );
  }
}

/// `motion-popup` — 팝업이 0.95에서 1로 200ms 동안 커집니다.
///
/// React의 팝업은 처음부터 그 크기로 그려지고 CSS 전환이 배율만 옮깁니다. 그래서
/// 첫 프레임은 0.95로 그리고 다음 프레임에 목표 배율로 옮깁니다.
class _MotionPopup extends StatefulWidget {
  const _MotionPopup({required this.child});

  final Widget child;

  @override
  State<_MotionPopup> createState() => _MotionPopupState();
}

class _MotionPopupState extends State<_MotionPopup> {
  bool _entered = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((Duration _) {
      if (mounted) setState(() => _entered = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool animate = !MediaQuery.disableAnimationsOf(context);
    return AnimatedScale(
      scale: !animate || _entered ? 1 : HoronMotion.popupEnterScale,
      duration: animate ? HoronMotion.popupEnterDuration : Duration.zero,
      curve: HoronMotion.easeOutQuint,
      alignment: Alignment.topLeft,
      child: widget.child,
    );
  }
}

/// React `defaultFormat`의 날짜 하나 표기입니다. 예: `Oct 20, 2026`.
String _defaultDateLabel(DateTime date, MaterialLocalizations localizations) =>
    '${localizations.formatShortMonthDay(date)}, ${date.year}';

/// React `defaultFormat`의 범위 표기입니다.
///
/// 해가 같으면 시작에서 해를 빼고, 다르면 양쪽에 붙입니다. 예:
/// `Oct 20 – Oct 24, 2026`, `Dec 28, 2025 – Jan 3, 2026`.
String _defaultRangeLabel(HoronDateRange range, MaterialLocalizations localizations) {
  final DateTime? start = range.start;
  if (start == null) return '';
  final DateTime? end = range.end;
  if (end == null) return _defaultDateLabel(start, localizations);
  final String head = start.year == end.year
      ? localizations.formatShortMonthDay(start)
      : _defaultDateLabel(start, localizations);
  return '$head – ${_defaultDateLabel(end, localizations)}';
}
