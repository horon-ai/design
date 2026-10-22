import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 고른 날짜 범위입니다.
///
/// `date-picker.tsx`가 `react-day-picker`에서 다시 내보내는 `DateRange`를 옮긴 것입니다.
/// React는 `{ from, to? }`라 두 번째 날짜를 아직 고르지 않은 상태가 표현되지만,
/// Flutter의 `DateTimeRange`는 양 끝이 모두 있어야 하므로 이 타입을 따로 둡니다.
@immutable
class HoronDateRange {
  /// 범위를 만듭니다.
  const HoronDateRange({this.from, this.to});

  /// 범위의 시작입니다.
  final DateTime? from;

  /// 범위의 끝입니다. 아직 고르지 않았으면 null입니다.
  final DateTime? to;

  /// 두 끝이 모두 정해졌는지 여부입니다.
  bool get isComplete => from != null && to != null;

  @override
  bool operator ==(Object other) => other is HoronDateRange && other.from == from && other.to == to;

  @override
  int get hashCode => Object.hash(from, to);

  @override
  String toString() => 'HoronDateRange(from: $from, to: $to)';
}

/// 선택 방식입니다.
///
/// React `calendar.tsx`에는 cva `variants:` 블록이 없으므로 공개 변형 enum을 두지
/// 않습니다. 호출자는 [HoronCalendar]와 [HoronCalendar.range]로 고릅니다.
enum _HoronCalendarMode { single, range }

/// `calendar.tsx`의 `[--cell-size:--spacing(8)]`입니다.
const double _cellSize = HoronSpace.s8;

/// `calendar.tsx`의 `p-3`입니다.
const double _calendarPadding = HoronSpace.s3;

/// `calendar.tsx`의 `gap-4`입니다. 캡션과 그리드 사이, 달과 달 사이 간격입니다.
const double _calendarGap = HoronSpace.s4;

/// `calendar.tsx`의 `week: mt-2`입니다. 주 사이 세로 간격입니다.
const double _weekGap = HoronSpace.s2;

/// `weekday`와 날짜 숫자의 `text-xs`/`text-sm` 중 요일 쪽 크기입니다.
const double _weekdayFontSize = HoronText.caption;

/// 캡션과 날짜 숫자의 `text-sm`입니다.
const double _dayFontSize = HoronText.body;

/// `[&>span]:opacity-70`입니다. 선택되지 않은 날짜 숫자를 70% 불투명도로 그립니다.
const double _dayNumberAlpha = 0.7;

/// `focus-visible:ring-3`의 링 두께입니다.
const double _ringWidth = 3;

/// `ring-ring/50`입니다.
const double _ringAlpha = 0.5;

/// lucide 셰브론의 `stroke-width` 2를 24 단위로 나눈 값입니다.
const double _chevronStrokeRatio = 2 / 24;

/// 하루 칸이 그리는 색과 모서리입니다.
class _HoronDayPaint {
  const _HoronDayPaint({
    required this.background,
    required this.foreground,
    required this.radius,
    required this.selected,
  });

  /// 칸의 배경입니다. null이면 배경을 칠하지 않습니다.
  final Color? background;

  /// 날짜 숫자의 색입니다.
  final Color foreground;

  /// 배경의 모서리입니다.
  final BorderRadius radius;

  /// 선택된 칸인지 여부입니다. 참이면 숫자를 100% 불투명도로 그립니다.
  final bool selected;
}

/// 한 달 그리드의 칸 배치입니다.
///
/// 그리드를 그리는 위젯과 그 배치를 검사하는 테스트가 같은 계산을 읽도록 칸 수를
/// 위젯 밖으로 뺐습니다. 달마다 며칠인지는 `DateTime(year, month + 1, 0).day`로
/// 구합니다. Dart가 13월을 다음 해 1월로, 0일을 그 전 달의 마지막 날로 해석하므로
/// 윤년 2월과 31일이 없는 달이 예외 없이 같은 식을 지납니다.
@immutable
class HoronCalendarGrid {
  /// 배치를 직접 만듭니다.
  const HoronCalendarGrid({
    required this.month,
    required this.daysInMonth,
    required this.leadingBlanks,
    required this.trailingBlanks,
  });

  /// [month]가 속한 달의 배치를 계산합니다.
  ///
  /// [firstDayOfWeek]는 [DateTime.monday](1)부터 [DateTime.sunday](7)까지입니다.
  factory HoronCalendarGrid.of(DateTime month, {int firstDayOfWeek = DateTime.monday}) {
    assert(
      firstDayOfWeek >= DateTime.monday && firstDayOfWeek <= DateTime.sunday,
      'firstDayOfWeek must be a DateTime weekday constant (1..7).',
    );
    final DateTime first = DateTime(month.year, month.month);
    final int daysInMonth = DateTime(month.year, month.month + 1, 0).day;
    final int leading = (first.weekday - firstDayOfWeek + 7) % 7;
    final int trailing = (7 - (leading + daysInMonth) % 7) % 7;
    return HoronCalendarGrid(month: first, daysInMonth: daysInMonth, leadingBlanks: leading, trailingBlanks: trailing);
  }

  /// 그리드가 그리는 달의 1일입니다.
  final DateTime month;

  /// 그 달의 일 수입니다.
  final int daysInMonth;

  /// 1일 앞에 놓이는 칸 수입니다.
  final int leadingBlanks;

  /// 마지막 날 뒤에 놓이는 칸 수입니다.
  final int trailingBlanks;

  /// 그리는 주의 수입니다.
  int get weekCount => (leadingBlanks + daysInMonth + trailingBlanks) ~/ 7;

  /// 그리는 칸의 수입니다. 언제나 7의 배수입니다.
  int get cellCount => weekCount * 7;

  /// [cellIndex]번째 칸이 가리키는 날짜입니다.
  ///
  /// 앞·뒤 칸은 이웃 달의 날짜를 가리킵니다. 그 칸을 빈 칸으로 그릴지는 호출자가
  /// 정합니다.
  DateTime dateAt(int cellIndex) => DateTime(month.year, month.month, cellIndex - leadingBlanks + 1);

  @override
  bool operator ==(Object other) =>
      other is HoronCalendarGrid &&
      other.month == month &&
      other.daysInMonth == daysInMonth &&
      other.leadingBlanks == leadingBlanks &&
      other.trailingBlanks == trailingBlanks;

  @override
  int get hashCode => Object.hash(month, daysInMonth, leadingBlanks, trailingBlanks);

  @override
  String toString() =>
      'HoronCalendarGrid(${month.year}-${month.month}, days: $daysInMonth, '
      'leading: $leadingBlanks, trailing: $trailingBlanks, weeks: $weekCount)';
}

/// 월 그리드를 그리는 달력입니다.
///
/// `calendar.tsx`를 옮긴 것입니다. `react-day-picker`의 `DayPicker`를 그대로 쓰지 않고
/// 그리드를 직접 그리는 이유는, 이 패키지가 CSS도 아이콘 폰트도 들고 있지 않아 셀
/// 크기·강조 색·주 시작일을 여기서 정해야 하기 때문입니다.
///
/// [HoronCalendar]는 하루를 고르고, [HoronCalendar.range]는 시작과 끝을 고릅니다.
/// 범위 모드에서 두 번째로 누른 날짜가 첫 날짜보다 앞서면 그 날짜를 새 시작으로 삼고
/// 끝은 비웁니다(`react-day-picker`와 같은 동작).
///
/// 그리드는 `Table`이 아니라 `Column`·`Row`·`Expanded`로 짭니다. 그래야 한 칸의 크기를
/// `--cell-size`(32)로 고정하고 달 수를 바꿀 수 있습니다.
///
/// 칸은 [ValueKey]를 들고 있어 테스트와 호스트가 직접 찾을 수 있습니다.
///
/// - 이번 달의 날짜: `calendar-day-<달 번호>-<yyyy-mm-dd>`
/// - 이웃 달의 날짜: `calendar-outside-<달 번호>-<yyyy-mm-dd>`
/// - [showOutsideDays]가 거짓일 때의 빈 칸: `calendar-blank-<달 번호>-<칸 번호>`
///
/// ```dart
/// HoronCalendar(
///   selected: due,
///   firstDayOfWeek: DateTime.sunday,
///   onSelected: (DateTime? date) => setDue(date),
/// );
/// ```
class HoronCalendar extends StatefulWidget {
  /// 이전 달 버튼의 키입니다. React의 `button_previous` 자리입니다.
  static const Key previousMonthKey = ValueKey<String>('horon-calendar-previous');

  /// 다음 달 버튼의 키입니다. React의 `button_next` 자리입니다.
  static const Key nextMonthKey = ValueKey<String>('horon-calendar-next');

  /// 하루를 고르는 달력을 만듭니다.
  const HoronCalendar({
    super.key,
    this.month,
    this.initialMonth,
    this.selected,
    this.onSelected,
    this.firstDayOfWeek = DateTime.monday,
    this.showOutsideDays = true,
    this.months = 1,
    this.background = true,
    this.onMonthChanged,
    this.today,
    this.semanticLabel,
  }) : _mode = _HoronCalendarMode.single,
       range = null,
       onRangeSelected = null,
       assert(months > 0, 'HoronCalendar draws at least one month.'),
       assert(
         firstDayOfWeek >= DateTime.monday && firstDayOfWeek <= DateTime.sunday,
         'firstDayOfWeek must be a DateTime weekday constant (1..7).',
       );

  /// 범위를 고르는 달력을 만듭니다.
  const HoronCalendar.range({
    super.key,
    this.month,
    this.initialMonth,
    this.range,
    this.onRangeSelected,
    this.firstDayOfWeek = DateTime.monday,
    this.showOutsideDays = true,
    this.months = 1,
    this.background = true,
    this.onMonthChanged,
    this.today,
    this.semanticLabel,
  }) : _mode = _HoronCalendarMode.range,
       selected = null,
       onSelected = null,
       assert(months > 0, 'HoronCalendar draws at least one month.'),
       assert(
         firstDayOfWeek >= DateTime.monday && firstDayOfWeek <= DateTime.sunday,
         'firstDayOfWeek must be a DateTime weekday constant (1..7).',
       );

  /// 보여 줄 달입니다. 넘기면 제어 모드가 되어 이 위젯이 달을 바꾸지 않습니다.
  final DateTime? month;

  /// 처음 보여 줄 달입니다. 없으면 선택된 날짜의 달, 그것도 없으면 이번 달입니다.
  final DateTime? initialMonth;

  /// 하루 선택 모드에서 고른 날짜입니다. [HoronCalendar.range]에서는 null입니다.
  final DateTime? selected;

  /// 하루를 골랐을 때 부릅니다. 같은 날짜를 다시 누르면 null이 옵니다.
  final ValueChanged<DateTime?>? onSelected;

  /// 범위 선택 모드에서 고른 범위입니다. [HoronCalendar]에서는 null입니다.
  final HoronDateRange? range;

  /// 범위를 골랐을 때 부릅니다.
  final ValueChanged<HoronDateRange?>? onRangeSelected;

  /// 한 주의 첫 요일입니다. [DateTime.monday](1)부터 [DateTime.sunday](7)까지입니다.
  final int firstDayOfWeek;

  /// 이번 달이 아닌 날짜도 숫자와 함께 그릴지 여부입니다. React의 `showOutsideDays`
  /// 기본값은 참입니다. 거짓이면 그 자리를 빈 칸으로 둡니다.
  final bool showOutsideDays;

  /// 한 번에 그릴 달의 수입니다. React의 `numberOfMonths`입니다.
  final int months;

  /// 카드 색 배경과 안쪽 여백을 그릴지 여부입니다.
  ///
  /// React는 `bg-card p-3`를 그리고 카드·팝오버 안에서는 투명으로 바꿉니다. 그 자리를
  /// 이 인자가 대신합니다.
  final bool background;

  /// 달이 바뀔 때 부릅니다. 넘기는 값은 새로 보이는 첫 달의 1일입니다.
  final ValueChanged<DateTime>? onMonthChanged;

  /// 오늘로 강조할 날짜입니다. 없으면 오늘입니다. 테스트가 실행 날짜에 흔들리지
  /// 않도록 넘길 수 있게 두었습니다.
  final DateTime? today;

  /// 보조 기술이 읽을 달력의 이름입니다.
  final String? semanticLabel;

  final _HoronCalendarMode _mode;

  @override
  State<HoronCalendar> createState() => _HoronCalendarState();
}

class _HoronCalendarState extends State<HoronCalendar> {
  late DateTime _displayedMonth;
  DateTime? _internalSelected;
  HoronDateRange? _internalRange;

  DateTime? get _selected => widget.selected ?? _internalSelected;

  HoronDateRange? get _range => widget.range ?? _internalRange;

  @override
  void initState() {
    super.initState();
    _internalSelected = widget.selected;
    _internalRange = widget.range;
    _displayedMonth = _monthOf(
      widget.month ?? widget.initialMonth ?? _selected ?? _range?.from ?? widget.today ?? DateTime.now(),
    );
  }

  @override
  void didUpdateWidget(covariant HoronCalendar oldWidget) {
    super.didUpdateWidget(oldWidget);
    final DateTime? next = widget.month;
    if (next != null && next != oldWidget.month) _displayedMonth = _monthOf(next);
  }

  static DateTime _monthOf(DateTime date) => DateTime(date.year, date.month);

  static bool _isSameDay(DateTime? a, DateTime? b) =>
      a != null && b != null && a.year == b.year && a.month == b.month && a.day == b.day;

  static String _isoDate(DateTime date) =>
      '${date.year.toString().padLeft(4, '0')}-'
      '${date.month.toString().padLeft(2, '0')}-'
      '${date.day.toString().padLeft(2, '0')}';

  void _shiftMonth(int delta) {
    final DateTime next = DateTime(_displayedMonth.year, _displayedMonth.month + delta);
    widget.onMonthChanged?.call(next);
    if (widget.month == null) setState(() => _displayedMonth = next);
  }

  void _handleDayTap(DateTime day) {
    if (widget._mode == _HoronCalendarMode.single) {
      // React DayPicker의 단일 선택은 고른 날을 다시 누르면 선택을 풉니다.
      final DateTime? next = _isSameDay(_selected, day) ? null : day;
      if (widget.selected == null) setState(() => _internalSelected = next);
      widget.onSelected?.call(next);
      return;
    }

    final HoronDateRange current = _range ?? const HoronDateRange();
    final HoronDateRange next;
    if (current.from == null || current.to != null) {
      next = HoronDateRange(from: day);
    } else if (day.isBefore(current.from!)) {
      next = HoronDateRange(from: day);
    } else {
      next = HoronDateRange(from: current.from, to: day);
    }
    if (widget.range == null) setState(() => _internalRange = next);
    widget.onRangeSelected?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final List<DateTime> visible = <DateTime>[
      for (int index = 0; index < widget.months; index++) DateTime(_displayedMonth.year, _displayedMonth.month + index),
    ];

    final Widget body = widget.months == 1
        ? Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              SizedBox(height: _cellSize, child: _captionWithNav(context, visible.first)),
              const SizedBox(height: _calendarGap),
              _monthBody(context, visible.first, 0),
            ],
          )
        : Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              SizedBox(height: _cellSize, child: _navRow(context, visible)),
              const SizedBox(height: _calendarGap),
              Row(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  for (int index = 0; index < visible.length; index++) ...<Widget>[
                    if (index > 0) const SizedBox(width: _calendarGap),
                    SizedBox(
                      width: _cellSize * 7,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          SizedBox(
                            height: _cellSize,
                            child: Center(child: _caption(context, visible[index])),
                          ),
                          const SizedBox(height: _calendarGap),
                          _monthBody(context, visible[index], index),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ],
          );

    // 달력의 폭은 칸 크기와 달 수로 정해집니다(한 달 224, 두 달 488). 폭이 모자라면
    // 그대로 두었을 때 `Row`가 부모를 넘어 `RenderFlex overflowed`가 납니다(360 폭에서
    // 151px·208px, 2026-10-22 렌더 스윕). 가로 스크롤 뷰는 자식이 들어가면 자식 폭을
    // 그대로 보고하므로 넓은 자리에서는 지금과 같은 크기로 서고, 모자랄 때만 흔려
    // 보냅니다. date-picker 패널이 쓰는 방식과 같습니다.
    return Semantics(
      container: true,
      label: widget.semanticLabel,
      // React의 루트는 `w-fit`입니다. 폭을 주지 않으면 부모가 넓을 때 캡션 줄이
      // 화면 폭까지 늘어나 좌우 화살표가 달력에서 멀어집니다(2026-10-22 렌더 확인).
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: SizedBox(
          width: _cellSize * 7 * widget.months + _calendarGap * (widget.months - 1) + _calendarPadding * 2,
          child: widget.background
              ? DecoratedBox(
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(HoronRadiusRole.card),
                  ),
                  child: Padding(padding: const EdgeInsets.all(_calendarPadding), child: body),
                )
              : body,
        ),
      ),
    );
  }

  /// 한 달의 요일 머리글과 주 그리드입니다.
  Widget _monthBody(BuildContext context, DateTime month, int monthIndex) {
    final HoronCalendarGrid grid = HoronCalendarGrid.of(month, firstDayOfWeek: widget.firstDayOfWeek);
    return SizedBox(
      width: _cellSize * 7,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          _weekdayHeader(context),
          for (int week = 0; week < grid.weekCount; week++)
            Padding(
              padding: const EdgeInsets.only(top: _weekGap),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  for (int slot = 0; slot < 7; slot++)
                    Expanded(
                      child: AspectRatio(
                        aspectRatio: 1,
                        child: _cell(context, grid: grid, monthIndex: monthIndex, cellIndex: week * 7 + slot),
                      ),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  /// 캡션 가운데에 달 이름을, 양 끝에 이전·다음 버튼을 놓습니다.
  ///
  /// React는 `nav`를 캡션 위에 절대 배치하고(`absolute inset-x-0 top-0`) 캡션에
  /// `px-(--cell-size)`를 줍니다. 여기서는 같은 결과를 [Stack]으로 만듭니다.
  Widget _captionWithNav(BuildContext context, DateTime month) {
    return Stack(
      children: <Widget>[
        Positioned.fill(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: _cellSize),
            child: Center(child: _caption(context, month)),
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[_navButton(context, delta: -1), _navButton(context, delta: 1)],
        ),
      ],
    );
  }

  /// 여러 달을 그릴 때의 이전·다음 버튼 줄입니다.
  Widget _navRow(BuildContext context, List<DateTime> visible) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        _navButton(context, delta: -1),
        Text(
          '${_monthName(context, visible.first)} – ${_monthName(context, visible.last)}',
          maxLines: 1,
          softWrap: false,
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _weekdayFontSize,
            height: HoronLineHeight.none,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
            decoration: TextDecoration.none,
          ),
        ),
        _navButton(context, delta: 1),
      ],
    );
  }

  Widget _caption(BuildContext context, DateTime month) {
    return Text(
      _monthName(context, month),
      maxLines: 1,
      softWrap: false,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: _dayFontSize,
        fontWeight: HoronFontWeight.medium,
        height: HoronLineHeight.none,
        color: Theme.of(context).colorScheme.onSurface,
        decoration: TextDecoration.none,
      ),
    );
  }

  /// 달 이름과 연도입니다. React `captionLayout="label"`의 기본 표기입니다.
  ///
  /// 달 이름은 [HoronStrings.monthNames]에서 읽습니다. 이 패키지는 번역 데이터를
  /// 들고 있지 않으므로 새 문구를 만들지 않습니다.
  String _monthName(BuildContext context, DateTime month) {
    final List<String> names = HoronTheme.of(context).strings.monthNames;
    final String name = names.isEmpty ? '${month.month}' : names[month.month - 1];
    return '$name ${month.year}';
  }

  Widget _navButton(BuildContext context, {required int delta}) {
    final HoronThemeData horon = HoronTheme.of(context);
    return _HoronCalendarNavButton(
      key: delta < 0 ? HoronCalendar.previousMonthKey : HoronCalendar.nextMonthKey,
      semanticLabel: delta < 0 ? horon.strings.previousPage : horon.strings.nextPage,
      pointsLeft: delta < 0,
      onPressed: () => _shiftMonth(delta),
    );
  }

  Widget _weekdayHeader(BuildContext context) {
    final List<String> names = HoronTheme.of(context).strings.weekdayNames;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: HoronSpace.s1),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          for (int slot = 0; slot < 7; slot++)
            Expanded(
              child: Center(
                child: Text(
                  _weekdayLabel(names, slot),
                  maxLines: 1,
                  softWrap: false,
                  style: TextStyle(
                    fontFamily: HoronFont.body,
                    fontFamilyFallback: HoronFont.fontFamilyFallback,
                    fontSize: _weekdayFontSize,
                    fontWeight: HoronFontWeight.regular,
                    height: HoronLineHeight.none,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    decoration: TextDecoration.none,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  /// 요일 이름을 칸 폭에 맞게 줄입니다.
  ///
  /// `HoronStrings.weekdayNames`는 월요일부터 일요일까지의 온전한 이름이므로, 라틴
  /// 문자는 두 글자(`Monday` → `Mo`), 그 밖의 문자는 첫 글자(`월요일` → `월`)를
  /// 씁니다. 새 문구를 만들지 않고 호스트가 준 이름에서 줄이기만 합니다.
  String _weekdayLabel(List<String> names, int slot) {
    if (names.isEmpty) return '';
    final String name = names[(widget.firstDayOfWeek - 1 + slot) % names.length];
    if (name.isEmpty) return '';
    final int length = name.codeUnitAt(0) < 0x80 ? 2 : 1;
    return name.length <= length ? name : name.substring(0, length);
  }

  Widget _cell(
    BuildContext context, {
    required HoronCalendarGrid grid,
    required int monthIndex,
    required int cellIndex,
  }) {
    final bool outside = cellIndex < grid.leadingBlanks || cellIndex >= grid.leadingBlanks + grid.daysInMonth;
    if (outside && !widget.showOutsideDays) {
      return SizedBox(key: ValueKey<String>('calendar-blank-$monthIndex-$cellIndex'));
    }

    final DateTime day = grid.dateAt(cellIndex);
    final String prefix = outside ? 'calendar-outside' : 'calendar-day';
    return SizedBox(
      key: ValueKey<String>('$prefix-$monthIndex-${_isoDate(day)}'),
      child: _HoronCalendarDay(
        paint: _paintFor(context, day, outside: outside),
        label: '${day.day}',
        semanticLabel: _isoDate(day),
        onTap: () => _handleDayTap(day),
      ),
    );
  }

  /// 하루 칸이 그릴 색을 정합니다.
  ///
  /// React의 우선순위를 그대로 따릅니다. 범위의 시작·끝과 단일 선택은 `bg-primary`,
  /// 범위 안쪽과 오늘은 `bg-accent`입니다.
  _HoronDayPaint _paintFor(BuildContext context, DateTime day, {required bool outside}) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final BorderRadius rounded = BorderRadius.circular(HoronRadius.md);
    final bool isToday = _isSameDay(widget.today ?? DateTime.now(), day);
    final Color plain = outside ? scheme.onSurfaceVariant : scheme.onSurface;

    if (widget._mode == _HoronCalendarMode.single) {
      if (_isSameDay(_selected, day)) {
        return _HoronDayPaint(
          background: scheme.primary,
          foreground: scheme.onPrimary,
          radius: rounded,
          selected: true,
        );
      }
      return _HoronDayPaint(
        background: isToday ? scheme.surfaceContainerHighest : null,
        foreground: plain,
        radius: rounded,
        selected: false,
      );
    }

    final HoronDateRange range = _range ?? const HoronDateRange();
    final DateTime? from = range.from;
    final DateTime? to = range.to;
    final bool isStart = _isSameDay(from, day);
    final bool isEnd = _isSameDay(to, day);
    if (isStart || isEnd) {
      final bool singleDay = isStart && isEnd;
      return _HoronDayPaint(
        background: scheme.primary,
        foreground: scheme.onPrimary,
        radius: singleDay
            ? rounded
            : BorderRadius.horizontal(
                left: isStart ? const Radius.circular(HoronRadius.md) : Radius.zero,
                right: isEnd ? const Radius.circular(HoronRadius.md) : Radius.zero,
              ),
        selected: true,
      );
    }
    if (from != null && to != null && day.isAfter(from) && day.isBefore(to)) {
      return _HoronDayPaint(
        background: scheme.surfaceContainerHighest,
        foreground: scheme.onSurface,
        radius: BorderRadius.zero,
        selected: false,
      );
    }
    return _HoronDayPaint(
      background: isToday ? scheme.surfaceContainerHighest : null,
      foreground: plain,
      radius: rounded,
      selected: false,
    );
  }
}

/// 이전·다음 달 버튼입니다. React는 ghost 변형의 `size-(--cell-size)` 버튼입니다.
class _HoronCalendarNavButton extends StatefulWidget {
  const _HoronCalendarNavButton({
    super.key,
    required this.semanticLabel,
    required this.pointsLeft,
    required this.onPressed,
  });

  final String semanticLabel;
  final bool pointsLeft;
  final VoidCallback onPressed;

  @override
  State<_HoronCalendarNavButton> createState() => _HoronCalendarNavButtonState();
}

class _HoronCalendarNavButtonState extends State<_HoronCalendarNavButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    return Semantics(
      button: true,
      label: widget.semanticLabel,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: FocusableActionDetector(
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                widget.onPressed();
                return null;
              },
            ),
          },
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.onPressed,
            child: SizedBox.square(
              dimension: _cellSize,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: _hovered ? scheme.surfaceContainerHighest : Colors.transparent,
                  borderRadius: BorderRadius.circular(HoronRadius.md),
                  boxShadow: _focused
                      ? <BoxShadow>[
                          BoxShadow(
                            color: horon.ring.withValues(alpha: _ringAlpha),
                            spreadRadius: _ringWidth,
                          ),
                        ]
                      : null,
                ),
                child: Center(
                  child: SizedBox.square(
                    dimension: HoronSpace.s4,
                    child: CustomPaint(
                      painter: _HoronCalendarChevronPainter(color: scheme.onSurface, pointsLeft: widget.pointsLeft),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 날짜 칸 하나입니다.
///
/// React의 `CalendarDayButton`은 ghost 버튼이고 강조 배경은 그 위의 칸이 그립니다.
/// 여기서는 배경과 hover·포커스 링을 이 위젯이 함께 맡습니다.
class _HoronCalendarDay extends StatefulWidget {
  const _HoronCalendarDay({required this.paint, required this.label, required this.semanticLabel, required this.onTap});

  final _HoronDayPaint paint;
  final String label;
  final String semanticLabel;
  final VoidCallback onTap;

  @override
  State<_HoronCalendarDay> createState() => _HoronCalendarDayState();
}

class _HoronCalendarDayState extends State<_HoronCalendarDay> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronDayPaint paint = widget.paint;

    // React `hover:bg-muted`는 강조 배경이 없는 칸에서만 보입니다.
    final Color? background = paint.background ?? (_hovered ? scheme.surfaceContainerHighest : null);
    final BorderRadius radius = paint.background == null && _hovered
        ? BorderRadius.circular(HoronRadius.md)
        : paint.radius;

    return Semantics(
      button: true,
      selected: paint.selected,
      label: widget.semanticLabel,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: FocusableActionDetector(
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                widget.onTap();
                return null;
              },
            ),
          },
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.onTap,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: background,
                borderRadius: radius,
                boxShadow: _focused
                    ? <BoxShadow>[
                        BoxShadow(
                          color: horon.ring.withValues(alpha: _ringAlpha),
                          spreadRadius: _ringWidth,
                        ),
                      ]
                    : null,
              ),
              child: Center(
                child: Text(
                  widget.label,
                  maxLines: 1,
                  softWrap: false,
                  style: TextStyle(
                    fontFamily: HoronFont.body,
                    fontFamilyFallback: HoronFont.fontFamilyFallback,
                    fontSize: _dayFontSize,
                    fontWeight: paint.selected ? HoronFontWeight.medium : HoronFontWeight.regular,
                    height: HoronLineHeight.none,
                    color: paint.selected ? paint.foreground : paint.foreground.withValues(alpha: _dayNumberAlpha),
                    decoration: TextDecoration.none,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// lucide `ChevronLeft`(`m15 18-6-6 6-6`)와 `ChevronRight`(`m9 18 6-6-6-6`)를
/// 24 단위 상자의 비율로 그립니다.
class _HoronCalendarChevronPainter extends CustomPainter {
  const _HoronCalendarChevronPainter({required this.color, required this.pointsLeft});

  final Color color;
  final bool pointsLeft;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * _chevronStrokeRatio
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final double tipX = size.width * (pointsLeft ? 0.375 : 0.625);
    final double backX = size.width * (pointsLeft ? 0.625 : 0.375);
    final Path path = Path()
      ..moveTo(backX, size.height * 0.75)
      ..lineTo(tipX, size.height * 0.5)
      ..lineTo(backX, size.height * 0.25);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_HoronCalendarChevronPainter oldDelegate) =>
      color != oldDelegate.color || pointsLeft != oldDelegate.pointsLeft;
}
