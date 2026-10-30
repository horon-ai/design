import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../contracts/horon_strings.dart';
import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 날짜 범위입니다. React `calendar.tsx`의 `DateRange`와 같은 모양이고, 시작과 끝이
/// 모두 비어 있을 수 있습니다.
@immutable
class HoronDateRange {
  /// 범위를 만듭니다. 두 끝을 모두 생략하면 빈 범위입니다.
  const HoronDateRange({this.start, this.end});

  /// 범위의 시작입니다. React `start`.
  final DateTime? start;

  /// 범위의 끝입니다. React `end`.
  final DateTime? end;
}

/// 한 달을 고르는 달력입니다.
///
/// React `Calendar`: 유리 판 하나에 월 제목, 요일 줄, 날짜 칸이 위에서 아래로
/// 쌓입니다. 날짜 칸은 40px 정사각형이고, 고른 날은 잉크색 원, 범위 안의 날은
/// 사각 띠, 오늘은 아래쪽 4px 점으로 표시합니다.
///
/// 두 가지 모양이 있습니다. [popover]가 거짓이면 날짜 고르기 달력(60:245)으로
/// 가운데 정렬한 `title-sm` 제목과 20px 화살표를 쓰고, 참이면 캘린더 팝오버
/// (88:495)로 왼쪽 정렬한 `label-lg` 제목과 32px 둥근 화살표를 씁니다.
///
/// React는 `mode: "single" | "range"`로 값의 모양을 가릅니다. Dart에는 그 차이를
/// [range]와 [onRangeChange]를 넘겼는지로 표현합니다. 둘 다 넘기지 않으면 날짜
/// 하나를 고르고, 넘기면 범위를 고릅니다.
class HoronCalendar extends StatefulWidget {
  /// 날짜 하나를 고르는 달력을 만듭니다(React `mode: "single"`).
  const HoronCalendar({
    super.key,
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
    this.width,
  }) : assert(
         range == null && onRangeChange == null || value == null && onValueChange == null,
         'single 모드(value)와 range 모드(range)를 함께 넘길 수 없습니다.',
       );

  /// 고른 날짜입니다. React `value`(single 모드).
  final DateTime? value;

  /// 달력의 고유 폭입니다. 넘기면 [LayoutBuilder] 없이 그 폭으로 그립니다.
  ///
  /// 팝업처럼 자식의 고유 크기를 묻는 부모 아래에서는 반드시 넘겨야 합니다.
  /// `LayoutBuilder` 는 고유 크기 질문에 답하지 못해 예외가 나기 때문입니다.
  final double? width;

  /// 날짜를 골랐을 때 호출됩니다. React `onValueChange`(single 모드).
  final ValueChanged<DateTime>? onValueChange;

  /// 고른 범위입니다. React `value`(range 모드).
  final HoronDateRange? range;

  /// 범위를 골랐을 때 호출됩니다. React `onValueChange`(range 모드).
  final ValueChanged<HoronDateRange>? onRangeChange;

  /// 처음 보이는 달입니다. 생략하면 고른 날이나 오늘이 있는 달입니다.
  final DateTime? defaultMonth;

  /// 보이는 달을 바깥에서 정합니다. React `month`(제어 모드).
  final DateTime? month;

  /// 보이는 달이 바뀔 때 호출됩니다. React `onMonthChange`.
  final ValueChanged<DateTime>? onMonthChange;

  /// 고를 수 없는 날을 알려 줍니다. React `isDateDisabled`.
  final bool Function(DateTime date)? isDateDisabled;

  /// 0이면 일요일, 1이면 월요일에서 한 주가 시작합니다. React `weekStartsOn`.
  final int weekStartsOn;

  /// 오늘로 칠 날입니다. 생략하면 기기 시각입니다. React `today`.
  final DateTime? today;

  /// 팝오버 모양으로 그립니다. React `variant: "popover"`.
  ///
  /// React의 `variant`는 `export type`이 아닌 인라인 유니온이라 공개 enum이 될 수
  /// 없습니다. variant 게이트는 React에 없는 공개 enum을 거부하므로 불리언으로
  /// 옮겼습니다.
  final bool popover;

  @override
  State<HoronCalendar> createState() => _HoronCalendarState();
}

class _HoronCalendarState extends State<HoronCalendar> {
  /// `size-10` — 날짜 칸의 한 변입니다.
  static const double _cellSize = 40;

  /// 좁은 폭에서도 칸이 글자를 담을 수 있는 최소 크기입니다.
  static const double _minCellSize = 28;

  /// `h-6` — 요일 줄의 높이입니다.
  static const double _weekdayHeight = 24;

  /// `rounded-[24px]` — 팝오버 변형의 반경입니다.
  static const double _popoverRadius = 24;

  /// `size-8` — 팝오버 변형 화살표 버튼의 한 변입니다.
  static const double _popoverArrowSize = 32;

  /// `size-4.5` — 팝오버 변형 화살표 아이콘입니다.
  static const double _popoverArrowIcon = 18;

  /// `size-5` — 기본 변형 화살표 버튼과 아이콘의 한 변입니다.
  static const double _defaultArrowSize = 20;

  /// `size-1` — 오늘을 표시하는 점의 지름입니다.
  static const double _todayDotSize = 4;

  /// `top-8` — 오늘 점이 칸 위에서 떨어진 거리입니다.
  static const double _todayDotTop = 32;

  /// `outline-2` — 포커스 테두리 두께입니다.
  static const double _focusWidth = 2;

  late DateTime _monthState;
  late DateTime _focused;
  final FocusNode _gridFocus = FocusNode(debugLabel: 'horon-calendar-grid');

  bool get _isRange => widget.range != null || widget.onRangeChange != null;

  DateTime get _anchor => widget.range?.start ?? widget.value ?? _today;

  DateTime get _today => _startOfDay(widget.today ?? DateTime.now());

  DateTime get _visibleMonth => widget.month == null ? _monthState : _firstOfMonth(widget.month!);

  @override
  void initState() {
    super.initState();
    _monthState = _firstOfMonth(widget.defaultMonth ?? _anchor);
    _focused = _anchor;
  }

  @override
  void dispose() {
    _gridFocus.dispose();
    super.dispose();
  }

  void _setMonth(DateTime next) {
    if (widget.month == null) setState(() => _monthState = _firstOfMonth(next));
    widget.onMonthChange?.call(_firstOfMonth(next));
  }

  bool _isSelected(DateTime date) {
    if (_isRange) {
      final HoronDateRange? range = widget.range;
      return _sameDay(date, range?.start) || _sameDay(date, range?.end);
    }
    return _sameDay(date, widget.value);
  }

  bool _inRange(DateTime date) {
    final HoronDateRange? range = widget.range;
    if (range?.start == null || range?.end == null) return false;
    final DateTime start = _startOfDay(range!.start!);
    final DateTime end = _startOfDay(range.end!);
    return date.isAfter(start) && date.isBefore(end);
  }

  void _select(DateTime date) {
    setState(() => _focused = date);
    _gridFocus.requestFocus();
    if (_isRange) {
      final HoronDateRange current = widget.range ?? const HoronDateRange();
      final bool restart = current.start == null || current.end != null || date.isBefore(current.start!);
      widget.onRangeChange?.call(
        restart ? HoronDateRange(start: date) : HoronDateRange(start: current.start, end: date),
      );
      return;
    }
    widget.onValueChange?.call(date);
  }

  void _moveFocus(DateTime next) {
    setState(() => _focused = next);
    final DateTime month = _visibleMonth;
    if (next.month != month.month || next.year != month.year) {
      _setMonth(_firstOfMonth(next));
    }
  }

  KeyEventResult _handleKeyEvent(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final int? step = switch (event.logicalKey) {
      LogicalKeyboardKey.arrowLeft => -1,
      LogicalKeyboardKey.arrowRight => 1,
      LogicalKeyboardKey.arrowUp => -7,
      LogicalKeyboardKey.arrowDown => 7,
      _ => null,
    };
    if (step == null) return KeyEventResult.ignored;
    _moveFocus(_addDays(_focused, step));
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final HoronStrings strings = theme.strings;

    final DateTime month = _visibleMonth;
    final List<DateTime> days = _monthGrid(month, widget.weekStartsOn);
    final String title = '${strings.monthNames[month.month - 1]} ${month.year}';
    final BorderRadius radius = BorderRadius.circular(widget.popover ? _popoverRadius : theme.radius.xl);
    final double padding = widget.popover ? space.s3_5 : space.s4;
    final double gap = widget.popover ? space.s2 : space.s3;
    final DateTime today = _today;

    // 폭을 호출자가 주면(팝업처럼 자식의 고유 크기를 묻는 부모 아래) LayoutBuilder 를
    // 건너뜁니다. LayoutBuilder 는 고유 크기 질문에 답하지 못해 예외가 납니다.
    if (widget.width != null) {
      return _buildSurface(
        theme: theme,
        strings: strings,
        days: days,
        month: month,
        title: title,
        today: today,
        radius: radius,
        padding: padding,
        gap: gap,
        maxWidth: widget.width!,
      );
    }

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // `w-fit` — 일곱 칸이 자연 폭이지만, 부모가 더 좁으면 칸을 줄여 맞춥니다.
        final double maxWidth = constraints.maxWidth.isFinite ? constraints.maxWidth : _cellSize * 7;
        return _buildSurface(
          theme: theme,
          strings: strings,
          days: days,
          month: month,
          title: title,
          today: today,
          radius: radius,
          padding: padding,
          gap: gap,
          maxWidth: maxWidth,
        );
      },
    );
  }

  Widget _buildSurface({
    required HoronThemeData theme,
    required HoronStrings strings,
    required List<DateTime> days,
    required DateTime month,
    required String title,
    required DateTime today,
    required BorderRadius radius,
    required double padding,
    required double gap,
    required double maxWidth,
  }) {
    final HoronColors colors = theme.colors;
    final double available = maxWidth - padding * 2;
    final double cell = math.min(_cellSize, math.max(_minCellSize, available / 7));

    return Semantics(
      container: true,
      child: HoronLiquidGlass(
        tier: HoronGlassTier.thick,
        borderRadius: radius,
        child: DecoratedBox(
          key: const Key('horon-calendar-surface'),
          decoration: BoxDecoration(
            borderRadius: radius,
            border: Border.all(color: colors.glassRimStrong),
          ),
          child: Padding(
            padding: EdgeInsets.all(padding),
            child: SizedBox(
              width: cell * 7,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: gap,
                children: <Widget>[
                  if (widget.popover) _buildPopoverHeader(theme, title) else _buildDefaultHeader(theme, title),
                  Focus(
                    focusNode: _gridFocus,
                    onKeyEvent: _handleKeyEvent,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        _buildWeekdays(theme, strings, days, cell),
                        for (int week = 0; week < days.length ~/ 7; week++)
                          _buildWeek(
                            theme: theme,
                            days: days.sublist(week * 7, week * 7 + 7),
                            month: month,
                            today: today,
                            cell: cell,
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDefaultHeader(HoronThemeData theme, String title) {
    final HoronColors colors = theme.colors;
    return Row(
      children: <Widget>[
        _CaretButton(
          key: const Key('horon-calendar-prev'),
          icon: Icons.chevron_left,
          color: colors.textSecondary,
          size: _defaultArrowSize,
          iconSize: _defaultArrowSize,
          label: theme.strings.previousPage,
          onPressed: () => _setMonth(_addMonths(_visibleMonth, -1)),
        ),
        Expanded(
          child: Semantics(
            liveRegion: true,
            child: Text(
              title,
              key: const Key('horon-calendar-title'),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              // `text-title-sm text-text-primary`.
              style: theme.text.titleSm.copyWith(color: colors.textPrimary),
            ),
          ),
        ),
        _CaretButton(
          key: const Key('horon-calendar-next'),
          icon: Icons.chevron_right,
          color: colors.textSecondary,
          size: _defaultArrowSize,
          iconSize: _defaultArrowSize,
          label: theme.strings.nextPage,
          onPressed: () => _setMonth(_addMonths(_visibleMonth, 1)),
        ),
      ],
    );
  }

  Widget _buildPopoverHeader(HoronThemeData theme, String title) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return Padding(
      // `pb-1 pl-1.5`.
      padding: EdgeInsets.only(bottom: space.s1, left: space.s1_5),
      child: Row(
        // `gap-1`.
        spacing: space.s1,
        children: <Widget>[
          Expanded(
            child: Semantics(
              liveRegion: true,
              child: Text(
                title,
                key: const Key('horon-calendar-title'),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                // `text-label-lg text-text-primary`.
                style: theme.text.labelLg.copyWith(color: colors.textPrimary),
              ),
            ),
          ),
          _CaretButton(
            key: const Key('horon-calendar-prev'),
            icon: Icons.chevron_left,
            color: colors.textSecondary,
            size: _popoverArrowSize,
            iconSize: _popoverArrowIcon,
            hoverColor: colors.overlayInk6,
            label: theme.strings.previousPage,
            onPressed: () => _setMonth(_addMonths(_visibleMonth, -1)),
          ),
          _CaretButton(
            key: const Key('horon-calendar-next'),
            icon: Icons.chevron_right,
            color: colors.textSecondary,
            size: _popoverArrowSize,
            iconSize: _popoverArrowIcon,
            hoverColor: colors.overlayInk6,
            label: theme.strings.nextPage,
            onPressed: () => _setMonth(_addMonths(_visibleMonth, 1)),
          ),
        ],
      ),
    );
  }

  Widget _buildWeekdays(HoronThemeData theme, HoronStrings strings, List<DateTime> days, double cell) {
    final HoronColors colors = theme.colors;
    return Row(
      children: <Widget>[
        for (final DateTime date in days.take(7))
          SizedBox(
            width: cell,
            height: _weekdayHeight,
            child: Center(
              child: Text(
                _narrowWeekday(strings.weekdayNames[date.weekday - 1]),
                maxLines: 1,
                // `text-caption text-text-secondary`.
                style: theme.text.caption.copyWith(color: colors.textSecondary),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildWeek({
    required HoronThemeData theme,
    required List<DateTime> days,
    required DateTime month,
    required DateTime today,
    required double cell,
  }) {
    return Row(
      children: <Widget>[
        for (final DateTime date in days)
          _DayCell(
            key: ValueKey<String>('horon-calendar-day-${date.year}-${date.month}-${date.day}'),
            date: date,
            cell: cell,
            outside: date.month != month.month,
            selected: _isSelected(date),
            between: _inRange(date),
            isToday: _sameDay(date, today),
            disabled: widget.isDateDisabled?.call(date) ?? false,
            focused: _gridFocus.hasFocus && _sameDay(date, _focused),
            onTap: _select,
          ),
      ],
    );
  }
}

/// 날짜 칸 하나입니다. React `role="gridcell"` 버튼과 같은 상태 조합을 그립니다.
class _DayCell extends StatefulWidget {
  const _DayCell({
    super.key,
    required this.date,
    required this.cell,
    required this.outside,
    required this.selected,
    required this.between,
    required this.isToday,
    required this.disabled,
    required this.focused,
    required this.onTap,
  });

  final DateTime date;
  final double cell;
  final bool outside;
  final bool selected;
  final bool between;
  final bool isToday;
  final bool disabled;
  final bool focused;
  final ValueChanged<DateTime> onTap;

  @override
  State<_DayCell> createState() => _DayCellState();
}

class _DayCellState extends State<_DayCell> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    final TextStyle style = widget.between
        // `bg-overlay-ink-8 text-body-md text-text-primary`.
        ? theme.text.bodyMd.copyWith(color: colors.textPrimary)
        : widget.selected
        // `rounded-full bg-interactive-primary text-label-lg text-interactive-on-primary`.
        ? theme.text.labelLg.copyWith(color: colors.interactiveOnPrimary)
        // `text-text-disabled` / `text-text-placeholder` / `text-text-brand` / `text-text-primary`.
        : widget.disabled
        ? theme.text.bodyMd.copyWith(color: colors.textDisabled)
        : widget.outside
        ? theme.text.bodyMd.copyWith(color: colors.textPlaceholder)
        : widget.isToday
        ? theme.text.labelLg.copyWith(color: colors.textBrand)
        : theme.text.bodyMd.copyWith(color: colors.textPrimary);

    final Color background = widget.between
        ? colors.overlayInk8
        : widget.selected
        ? colors.interactivePrimary
        : _hovered && !widget.disabled
        ? colors.overlayInk5
        : Colors.transparent;

    return Semantics(
      button: true,
      enabled: !widget.disabled,
      selected: widget.selected || widget.between,
      label: MaterialLocalizations.of(context).formatFullDate(widget.date),
      child: MouseRegion(
        cursor: widget.disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
        onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
        onExit: (PointerExitEvent event) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.disabled ? null : () => widget.onTap(widget.date),
          child: SizedBox(
            width: widget.cell,
            height: widget.cell,
            child: Stack(
              alignment: Alignment.center,
              children: <Widget>[
                AnimatedContainer(
                  duration: animate ? HoronMotion.colorsDuration : Duration.zero,
                  curve: HoronMotion.colorsCurve,
                  width: widget.cell,
                  height: widget.cell,
                  alignment: Alignment.center,
                  // `motion-colors` + `rounded-full`; 범위 안의 날만 반경이 없습니다.
                  decoration: BoxDecoration(
                    color: background,
                    borderRadius: widget.between ? BorderRadius.zero : BorderRadius.circular(theme.radius.full),
                    border: widget.focused
                        ? Border.all(color: colors.textBrand, width: _HoronCalendarState._focusWidth)
                        : null,
                  ),
                  child: Text('${widget.date.day}', maxLines: 1, style: style),
                ),
                // `top-8 left-[18px] size-1 rounded-full bg-status-live`.
                if (widget.isToday && !widget.selected && !widget.between)
                  Positioned(
                    top: _HoronCalendarState._todayDotTop,
                    left: (widget.cell - _HoronCalendarState._todayDotSize) / 2,
                    child: Container(
                      key: ValueKey<String>(
                        'horon-calendar-today-dot-${widget.date.year}-${widget.date.month}-${widget.date.day}',
                      ),
                      width: _HoronCalendarState._todayDotSize,
                      height: _HoronCalendarState._todayDotSize,
                      decoration: BoxDecoration(color: colors.statusLive, shape: BoxShape.circle),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 이전·다음 달 화살표 버튼입니다.
///
/// React의 `motion-press`(누르면 0.97)와 팝오버 변형의 `hover:bg-overlay-ink-6`을
/// 옮겼습니다. 기본 변형은 hover 배경이 없습니다.
class _CaretButton extends StatefulWidget {
  const _CaretButton({
    super.key,
    required this.icon,
    required this.color,
    required this.size,
    required this.iconSize,
    required this.label,
    required this.onPressed,
    this.hoverColor,
  });

  final IconData icon;
  final Color color;
  final double size;
  final double iconSize;
  final String label;
  final VoidCallback onPressed;
  final Color? hoverColor;

  @override
  State<_CaretButton> createState() => _CaretButtonState();
}

class _CaretButtonState extends State<_CaretButton> {
  bool _hovered = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final bool animate = !MediaQuery.disableAnimationsOf(context);
    return Semantics(
      button: true,
      label: widget.label,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
        onExit: (PointerExitEvent event) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
          onTapUp: (TapUpDetails details) => setState(() => _pressed = false),
          onTapCancel: () => setState(() => _pressed = false),
          onTap: widget.onPressed,
          child: AnimatedScale(
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
                color: _hovered && widget.hoverColor != null ? widget.hoverColor : Colors.transparent,
              ),
              child: Icon(widget.icon, size: widget.iconSize, color: widget.color),
            ),
          ),
        ),
      ),
    );
  }
}

/// React `Intl.DateTimeFormat(weekday: "narrow")`의 좁은 요일 글자입니다.
///
/// 문구 계약은 요일의 온전한 이름을 주므로 첫 글자를 씁니다(en은 `Monday` → `M`,
/// 한국어는 `월요일` → `월`).
String _narrowWeekday(String weekdayName) => weekdayName.isEmpty ? weekdayName : weekdayName.substring(0, 1);

DateTime _startOfDay(DateTime date) => DateTime(date.year, date.month, date.day);

bool _sameDay(DateTime? a, DateTime? b) =>
    a != null && b != null && a.year == b.year && a.month == b.month && a.day == b.day;

DateTime _addDays(DateTime date, int days) => DateTime(date.year, date.month, date.day + days);

DateTime _firstOfMonth(DateTime date) => DateTime(date.year, date.month);

DateTime _addMonths(DateTime date, int months) => DateTime(date.year, date.month + months);

/// 보이는 달의 첫 주 일요일(또는 월요일)부터 마지막 주 토요일(일요일)까지의 날짜입니다.
List<DateTime> _monthGrid(DateTime month, int weekStartsOn) {
  final DateTime first = _firstOfMonth(month);
  final int lead = (first.weekday % 7 - weekStartsOn + 7) % 7;
  final DateTime start = _addDays(first, -lead);
  final int daysInMonth = DateTime(month.year, month.month + 1, 0).day;
  final int weeks = ((lead + daysInMonth) / 7).ceil();
  return <DateTime>[for (int index = 0; index < weeks * 7; index++) _addDays(start, index)];
}
