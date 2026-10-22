import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'calendar.dart';
import 'glass_surface.dart';

/// 달력 팝업을 트리거의 어느 쪽에 맞출지 정합니다.
///
/// `date-picker.tsx`의 `align` prop을 옮겼습니다. React 소스에 cva `variants:` 블록이
/// 없으므로 변형 enum이 아니라 배치 값입니다.
enum HoronDatePickerAlign {
  /// 트리거의 시작 쪽에 맞춥니다. React의 기본값입니다.
  start,

  /// 트리거의 가운데에 맞춥니다.
  center,

  /// 트리거의 끝 쪽에 맞춥니다.
  end,
}

/// `date-picker.tsx` 단일 선택 트리거의 `w-60`입니다.
const double _singleTriggerWidth = 240;

/// `date-picker.tsx` 범위 선택 트리거의 `w-72`입니다.
const double _rangeTriggerWidth = 288;

/// `button.tsx` `outline` 변형의 높이 `h-[37px]`입니다.
const double _triggerHeight = HoronButtonMetrics.height;

/// `button.tsx` `outline` 변형의 `px-5`입니다.
const double _triggerPadding = HoronSpace.s5;

/// `has-data-[icon=inline-start]:pl-2`입니다. 아이콘이 앞에 붙으면 시작 패딩이 8입니다.
const double _triggerIconPadding = HoronSpace.s2;

/// `button.tsx`의 `gap-2`입니다.
const double _triggerGap = HoronSpace.s2;

/// `[&_svg:not([class*='size-'])]:size-4`입니다.
const double _triggerIconSize = HoronSpace.s4;

/// `button.tsx`의 `text-sm`입니다.
const double _triggerFontSize = HoronText.body;

/// `dark:bg-input/30`입니다. `--input` 알파에 곱하는 배수입니다.
const double _darkFillAlpha = 0.3;

/// `dark:hover:bg-input/50`입니다.
const double _darkHoverAlpha = 0.5;

/// `focus-visible:ring-3`의 링 두께입니다.
const double _ringWidth = 3;

/// `ring-ring/50`입니다.
const double _ringAlpha = 0.5;

/// `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// `popover.tsx`의 `sideOffset` 기본값 4입니다.
const double _panelGap = HoronSpace.s1;

/// `popover.tsx`의 `p-3`입니다.
const double _panelPadding = HoronSpace.s3;

/// `calendar.tsx`의 `--cell-size` 기본값 32입니다.
const double _cellSize = HoronSpace.s8;

/// `calendar.tsx`의 `months: gap-4`입니다.
const double _monthGap = HoronSpace.s4;

/// 팝업이 이보다 짧게밖에 안 들어가면 반대편으로 뒤집습니다.
///
/// 한 달 그리드는 캡션 32, 요일 줄 32, 주 다섯 줄과 그 사이 간격 200을 더해 약 280에
/// 팝업 여백 24를 더합니다. 그보다 조금 작은 값을 경계로 씁니다.
const double _panelMinHeight = 240;

/// 팝업과 화면 가장자리 사이에 두는 여백입니다.
const double _screenMargin = HoronSpace.s2;

/// 하루를 고르는 날짜 선택기입니다.
///
/// `date-picker.tsx`의 `DatePicker`를 옮긴 것입니다. 트리거는 테두리 버튼이고, 누르면
/// 달력이 유리 패널(`glass-strong`)로 열립니다. 날짜를 고르면 팝업이 닫히고 트리거가
/// 그 날짜를 보여 줍니다.
///
/// [value]를 넘기면 제어 모드, 넘기지 않으면 이 위젯이 고른 날짜를 기억합니다.
/// 화면 문구는 패키지가 들고 있지 않으므로 [placeholder]와 [icon]은 호스트가 넘깁니다.
///
/// ```dart
/// HoronDatePicker(
///   placeholder: 'Pick a date',
///   icon: const Icon(Icons.calendar_today),
///   onValueChanged: (DateTime? date) => setDue(date),
/// );
/// ```
///
/// 배치는 todo 18의 공유 위치 유틸이 생기면 그쪽으로 수렴합니다. 지금은 이 파일이
/// `OverlayPortal`과 `CompositedTransformTarget`/`Follower`로 직접 놓습니다.
class HoronDatePicker extends StatefulWidget {
  /// 팝업 패널의 바깥 상자를 찾는 키입니다. React의 `popover-content` 자리입니다.
  static const Key panelKey = ValueKey<String>('horon-date-picker-panel');

  /// 날짜 선택기를 만듭니다.
  const HoronDatePicker({
    super.key,
    this.value,
    this.defaultValue,
    this.onValueChanged,
    this.placeholder,
    this.disabled = false,
    this.align = HoronDatePickerAlign.start,
    this.icon,
    this.formatDate,
    this.width = _singleTriggerWidth,
    this.initialMonth,
    this.today,
    this.semanticLabel,
  });

  /// 고른 날짜입니다. null이면 이 위젯이 상태를 소유합니다.
  final DateTime? value;

  /// 상태를 소유할 때 시작할 날짜입니다.
  final DateTime? defaultValue;

  /// 날짜가 바뀔 때 부릅니다.
  final ValueChanged<DateTime?>? onValueChanged;

  /// 아무것도 고르지 않았을 때 보이는 안내 문구입니다. React의 기본값은
  /// `Pick a date`이지만 이 패키지는 화면 문구를 들고 있지 않습니다.
  final String? placeholder;

  /// 눌러도 열리지 않는 상태입니다.
  final bool disabled;

  /// 팝업을 트리거의 어느 쪽에 맞출지입니다.
  final HoronDatePickerAlign align;

  /// 트리거 앞에 붙는 아이콘입니다. 이 패키지는 아이콘 폰트를 들고 있지 않으므로
  /// 기본값을 강제하지 않습니다.
  final Widget? icon;

  /// 날짜를 글자로 바꾸는 함수입니다. 없으면 [formatHoronDate]가
  /// `HoronStrings.monthNames`의 달 이름으로 씁니다.
  final String Function(DateTime date)? formatDate;

  /// 트리거의 폭입니다. React의 `w-60`은 240입니다.
  final double width;

  /// 달력이 처음 보여 줄 달입니다. 없으면 고른 날짜의 달, 그것도 없으면 이번 달입니다.
  final DateTime? initialMonth;

  /// 달력에서 오늘로 강조할 날짜입니다. 없으면 오늘입니다. 테스트가 실행 날짜에
  /// 흔들리지 않도록 넘길 수 있게 두었습니다.
  final DateTime? today;

  /// 보조 기술이 읽을 트리거의 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDatePicker> createState() => _HoronDatePickerState();
}

class _HoronDatePickerState extends State<HoronDatePicker> {
  DateTime? _internalValue;

  DateTime? get _selected => widget.value ?? _internalValue;

  @override
  void initState() {
    super.initState();
    _internalValue = widget.defaultValue;
  }

  String? _label(BuildContext context, DateTime? date) {
    if (date == null) return widget.placeholder;
    final List<String> months = HoronTheme.of(context).strings.monthNames;
    return widget.formatDate?.call(date) ?? formatHoronDate(date, months);
  }

  @override
  Widget build(BuildContext context) {
    final DateTime? selected = _selected;
    final String? label = _label(context, selected);

    return _HoronDatePopover(
      align: widget.align,
      panelWidth: _panelWidth(1),
      trigger: (BuildContext context, VoidCallback toggle) => _HoronDatePickerTrigger(
        label: label,
        muted: selected == null,
        width: widget.width,
        icon: widget.icon,
        disabled: widget.disabled,
        semanticLabel: widget.semanticLabel ?? label,
        onTap: toggle,
      ),
      panel: (BuildContext context, VoidCallback close) => HoronCalendar(
        selected: selected,
        today: widget.today,
        initialMonth: selected ?? widget.initialMonth,
        background: false,
        onSelected: (DateTime? date) {
          if (widget.value == null) setState(() => _internalValue = date);
          widget.onValueChanged?.call(date);
          close();
        },
      ),
    );
  }
}

/// 범위를 고르는 날짜 선택기입니다.
///
/// `date-picker.tsx`의 `DateRangePicker`를 옮긴 것입니다. 첫 날짜를 고른 뒤에도 팝업이
/// 열려 있어 두 번째 날짜를 이어서 고를 수 있고, 두 끝이 모두 정해지면 트리거가
/// `시작 – 끝`을 보여 줍니다.
///
/// ```dart
/// HoronDateRangePicker(
///   placeholder: 'Pick a date range',
///   icon: const Icon(Icons.date_range),
///   onValueChanged: (HoronDateRange? range) => setRange(range),
/// );
/// ```
class HoronDateRangePicker extends StatefulWidget {
  /// 범위 선택기를 만듭니다.
  const HoronDateRangePicker({
    super.key,
    this.value,
    this.defaultValue,
    this.onValueChanged,
    this.placeholder,
    this.numberOfMonths = 2,
    this.disabled = false,
    this.align = HoronDatePickerAlign.start,
    this.icon,
    this.formatDate,
    this.width = _rangeTriggerWidth,
    this.initialMonth,
    this.today,
    this.semanticLabel,
  }) : assert(numberOfMonths > 0, 'HoronDateRangePicker draws at least one month.');

  /// 고른 범위입니다. null이면 이 위젯이 상태를 소유합니다.
  final HoronDateRange? value;

  /// 상태를 소유할 때 시작할 범위입니다.
  final HoronDateRange? defaultValue;

  /// 범위가 바뀔 때 부릅니다.
  final ValueChanged<HoronDateRange?>? onValueChanged;

  /// 아무것도 고르지 않았을 때 보이는 안내 문구입니다. React의 기본값은
  /// `Pick a date range`입니다.
  final String? placeholder;

  /// 팝업에 나란히 그릴 달의 수입니다. React의 기본값은 2입니다.
  final int numberOfMonths;

  /// 눌러도 열리지 않는 상태입니다.
  final bool disabled;

  /// 팝업을 트리거의 어느 쪽에 맞출지입니다.
  final HoronDatePickerAlign align;

  /// 트리거 앞에 붙는 아이콘입니다.
  final Widget? icon;

  /// 날짜를 글자로 바꾸는 함수입니다. 없으면 [formatHoronDate]를 씁니다.
  final String Function(DateTime date)? formatDate;

  /// 트리거의 폭입니다. React의 `w-72`는 288입니다.
  final double width;

  /// 달력이 처음 보여 줄 달입니다.
  final DateTime? initialMonth;

  /// 달력에서 오늘로 강조할 날짜입니다.
  final DateTime? today;

  /// 보조 기술이 읽을 트리거의 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDateRangePicker> createState() => _HoronDateRangePickerState();
}

class _HoronDateRangePickerState extends State<HoronDateRangePicker> {
  HoronDateRange? _internalValue;

  HoronDateRange? get _range => widget.value ?? _internalValue;

  @override
  void initState() {
    super.initState();
    _internalValue = widget.defaultValue;
  }

  String? _label(BuildContext context, HoronDateRange? range) {
    final DateTime? from = range?.from;
    if (from == null) return widget.placeholder;
    final List<String> months = HoronTheme.of(context).strings.monthNames;
    String format(DateTime date) => widget.formatDate?.call(date) ?? formatHoronDate(date, months);
    final DateTime? to = range?.to;
    return to == null ? format(from) : '${format(from)} – ${format(to)}';
  }

  @override
  Widget build(BuildContext context) {
    final HoronDateRange? range = _range;
    final String? label = _label(context, range);

    return _HoronDatePopover(
      align: widget.align,
      panelWidth: _panelWidth(widget.numberOfMonths),
      trigger: (BuildContext context, VoidCallback toggle) => _HoronDatePickerTrigger(
        label: label,
        muted: range?.from == null,
        width: widget.width,
        icon: widget.icon,
        disabled: widget.disabled,
        semanticLabel: widget.semanticLabel ?? label,
        onTap: toggle,
      ),
      panel: (BuildContext context, VoidCallback close) => HoronCalendar.range(
        range: range,
        today: widget.today,
        initialMonth: range?.from ?? widget.initialMonth,
        months: widget.numberOfMonths,
        background: false,
        onRangeSelected: (HoronDateRange? next) {
          if (widget.value == null) setState(() => _internalValue = next);
          widget.onValueChanged?.call(next);
          // 두 끝이 모두 정해졌을 때만 닫습니다. React도 첫 날짜만 고른 상태에서는
          // 팝업을 열어 둡니다.
          if (next?.to != null) close();
        },
      ),
    );
  }
}

/// 날짜 하나를 `October 5, 2026` 꼴로 씁니다.
///
/// React는 `date-fns`의 `PPP`(단일)와 `LLL dd, y`(범위)를 씁니다. 이 패키지는 날짜
/// 라이브러리를 의존하지 않으므로 `HoronStrings.monthNames`의 달 이름에 일과 연도를
/// 이어 붙입니다. 다른 표기가 필요하면 두 선택기의 `formatDate`로 갈아 끼웁니다.
String formatHoronDate(DateTime date, List<String> monthNames) {
  final String month = monthNames.isEmpty ? '${date.month}' : monthNames[date.month - 1];
  return '$month ${date.day}, ${date.year}';
}

/// 팝업 안쪽의 폭입니다. 달 그리드 폭에 달 사이 간격과 팝업 여백을 더합니다.
double _panelWidth(int months) => _cellSize * 7 * months + _monthGap * (months - 1) + _panelPadding * 2;

/// 트리거에 매달려 팝업을 띄우는 배치입니다.
///
/// `date_picker.dart`의 두 선택기가 함께 씁니다. 트리거 사각형을 재서 아래에 자리가
/// 없으면 위로 뒤집습니다. todo 18의 공유 위치 유틸이 생기면 이 클래스가 그쪽으로
/// 수렴합니다.
class _HoronDatePopover extends StatefulWidget {
  const _HoronDatePopover({required this.trigger, required this.panel, required this.align, required this.panelWidth});

  /// 트리거를 만드는 함수입니다. 넘기는 콜백을 누르면 팝업이 열리고 닫힙니다.
  final Widget Function(BuildContext context, VoidCallback toggle) trigger;

  /// 패널 내용을 만드는 함수입니다. 넘기는 콜백을 부르면 팝업이 닫힙니다.
  final Widget Function(BuildContext context, VoidCallback close) panel;

  /// 패널을 트리거의 어느 쪽에 맞출지입니다.
  final HoronDatePickerAlign align;

  /// 패널의 폭입니다.
  final double panelWidth;

  @override
  State<_HoronDatePopover> createState() => _HoronDatePopoverState();
}

class _HoronDatePopoverState extends State<_HoronDatePopover> {
  final LayerLink _link = LayerLink();
  final OverlayPortalController _portal = OverlayPortalController();
  final GlobalKey _anchorKey = GlobalKey();
  final FocusNode _panelFocus = FocusNode(debugLabel: 'HoronDatePickerPanel');

  bool _open = false;
  bool _flipUp = false;
  double _availableHeight = _panelMinHeight;
  double _availableWidth = double.infinity;
  double _horizontalShift = 0;

  @override
  void dispose() {
    _panelFocus.dispose();
    super.dispose();
  }

  void _measure() {
    final RenderObject? anchorObject = _anchorKey.currentContext?.findRenderObject();
    final RenderBox? overlayBox = Overlay.of(context).context.findRenderObject() as RenderBox?;
    if (anchorObject is! RenderBox || overlayBox == null || !overlayBox.hasSize) return;

    final Rect anchor = MatrixUtils.transformRect(
      anchorObject.getTransformTo(overlayBox),
      Offset.zero & anchorObject.size,
    );
    final double spaceBelow = overlayBox.size.height - anchor.bottom - _panelGap - _screenMargin;
    final double spaceAbove = anchor.top - _panelGap - _screenMargin;
    _flipUp = spaceBelow < _panelMinHeight && spaceAbove > spaceBelow;
    _availableHeight = math.max(_panelMinHeight, _flipUp ? spaceAbove : spaceBelow);
    // 좁은 화면에서는 두 달짜리 패널이 화면보다 넓어집니다. 그대로 두면 그리드가
    // 넘쳐 `RenderFlex overflowed`가 되므로, 폭을 화면에 맞추고 내용을 가로로
    // 스크롤합니다.
    _availableWidth = math.max(0, overlayBox.size.width - _screenMargin * 2);
    final double panelWidth = math.min(widget.panelWidth, _availableWidth);
    // 폭을 줄여도 기준점이 트리거에 붙어 있으면 오른쪽으로 넘칩니다. React의
    // Base UI positioner처럼 화면 안으로 밀어 넣습니다.
    final double left = switch (widget.align) {
      HoronDatePickerAlign.start => anchor.left,
      HoronDatePickerAlign.center => anchor.center.dx - panelWidth / 2,
      HoronDatePickerAlign.end => anchor.right - panelWidth,
    };
    final double clamped = left.clamp(
      _screenMargin,
      math.max(_screenMargin, overlayBox.size.width - _screenMargin - panelWidth),
    );
    _horizontalShift = clamped - left;
  }

  void _openPanel() {
    if (_open) return;
    _measure();
    _panelFocus.requestFocus();
    _portal.show();
    setState(() => _open = true);
  }

  void _closePanel() {
    if (!_open) return;
    _portal.hide();
    _panelFocus.unfocus();
    setState(() => _open = false);
  }

  void _toggle() {
    if (_open) {
      _closePanel();
    } else {
      _openPanel();
    }
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
      _closePanel();
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  /// 트리거 쪽 기준점입니다. 위로 뒤집히면 아래 모서리를 씁니다.
  Alignment get _targetAnchor => switch ((widget.align, _flipUp)) {
    (HoronDatePickerAlign.start, false) => Alignment.bottomLeft,
    (HoronDatePickerAlign.start, true) => Alignment.topLeft,
    (HoronDatePickerAlign.center, false) => Alignment.bottomCenter,
    (HoronDatePickerAlign.center, true) => Alignment.topCenter,
    (HoronDatePickerAlign.end, false) => Alignment.bottomRight,
    (HoronDatePickerAlign.end, true) => Alignment.topRight,
  };

  /// 패널 쪽 기준점입니다. 트리거 기준점과 같은 모서리끼리 붙입니다.
  Alignment get _followerAnchor => switch ((widget.align, _flipUp)) {
    (HoronDatePickerAlign.start, false) => Alignment.topLeft,
    (HoronDatePickerAlign.start, true) => Alignment.bottomLeft,
    (HoronDatePickerAlign.center, false) => Alignment.topCenter,
    (HoronDatePickerAlign.center, true) => Alignment.bottomCenter,
    (HoronDatePickerAlign.end, false) => Alignment.topRight,
    (HoronDatePickerAlign.end, true) => Alignment.bottomRight,
  };

  /// 패널이 화면 폭에 들어가면 그대로, 넘치면 가로로 스크롤하게 감쌉니다.
  ///
  /// 가로 스크롤 뷰는 자식에게 폭을 무한으로 줍니다. 그대로 감싸면 달력의 캡션 줄이
  /// 내용 폭으로 줄어 달 이름이 사라집니다(2026-10-22 렌더에서 확인: 캡션 폭 0).
  /// 그래서 넘칠 때만, 그리고 원래 폭을 [SizedBox]로 고정한 뒤에 감쌉니다.
  Widget _widthBound(Widget panel) {
    if (widget.panelWidth <= _availableWidth) return panel;
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: SizedBox(width: widget.panelWidth, child: panel),
    );
  }

  @override
  Widget build(BuildContext context) {
    return OverlayPortal(
      controller: _portal,
      overlayChildBuilder: (BuildContext context) => Stack(
        children: <Widget>[
          Positioned.fill(
            child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: _closePanel),
          ),
          CompositedTransformFollower(
            link: _link,
            showWhenUnlinked: false,
            targetAnchor: _targetAnchor,
            followerAnchor: _followerAnchor,
            offset: Offset(_horizontalShift, _flipUp ? -_panelGap : _panelGap),
            child: SizedBox(
              key: HoronDatePicker.panelKey,
              width: math.min(widget.panelWidth, _availableWidth),
              child: ConstrainedBox(
                constraints: BoxConstraints(maxHeight: _availableHeight),
                child: Focus(
                  focusNode: _panelFocus,
                  onKeyEvent: _handleKey,
                  child: ClipRRect(
                    // `BackdropFilter`는 자기 사각형 밖으로도 흐림을 퍼뜨려, 패널 위의
                    // 트리거가 blur에 잡혀 흐려집니다(2026-10-22 픽셀 확인). 반경으로
                    // 잘라 주면 패널 모양대로만 흐려집니다.
                    borderRadius: BorderRadius.circular(HoronRadiusRole.card),
                    child: HoronGlassSurface.strong(
                      padding: const EdgeInsets.all(_panelPadding),
                      borderRadius: BorderRadius.circular(HoronRadiusRole.card),
                      // 세로로 먼저 스크롤하고, 폭이 모자라면 그 안에서 가로로 스크롤합니다.
                      child: SingleChildScrollView(child: _widthBound(widget.panel(context, _closePanel))),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      child: CompositedTransformTarget(key: _anchorKey, link: _link, child: widget.trigger(context, _toggle)),
    );
  }
}

/// `date-picker.tsx`의 트리거입니다. `Button variant="outline"`에
/// `w-60 justify-start text-left font-normal`이 붙은 모양입니다.
///
/// [HoronButton]을 쓰지 않는 이유는 정렬입니다. React는 트리거 내용을 왼쪽에
/// 붙이는데(`justify-start`), 버튼 컴포넌트는 내용을 가운데에 놓습니다. 그래서
/// 표면·테두리·hover·포커스 링은 `button.tsx`의 `outline` 변형과 같은 값으로 이
/// 위젯이 직접 그립니다.
class _HoronDatePickerTrigger extends StatefulWidget {
  const _HoronDatePickerTrigger({
    required this.label,
    required this.muted,
    required this.width,
    required this.icon,
    required this.disabled,
    required this.semanticLabel,
    required this.onTap,
  });

  /// 트리거에 보이는 글자입니다. 고른 값이 없으면 [muted]가 참입니다.
  final String? label;

  /// 글자를 보조 색으로 그릴지 여부입니다. React의 `!selected && "text-muted-foreground"`.
  final bool muted;

  /// 트리거의 폭입니다.
  final double width;

  /// 앞에 붙는 아이콘입니다.
  final Widget? icon;

  /// 누를 수 없는 상태입니다.
  final bool disabled;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticLabel;

  /// 트리거를 눌렀을 때 부릅니다.
  final VoidCallback onTap;

  @override
  State<_HoronDatePickerTrigger> createState() => _HoronDatePickerTriggerState();
}

class _HoronDatePickerTriggerState extends State<_HoronDatePickerTrigger> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final bool enabled = !widget.disabled;

    // "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30
    //  dark:hover:bg-input/50"
    //
    // Tailwind의 `/30`은 `--input` 색의 알파에 0.3을 곱합니다. `--input`은 이미 12%
    // 흰색이라 결과는 3.6%입니다. `withValues(alpha: 0.3)`처럼 알파를 새로 정하면 30%
    // 흰색이 되어 React보다 훨씬 밝아집니다(2026-10-22 렌더 확인).
    final Color background = isDark
        ? scheme.outline.withValues(alpha: scheme.outline.a * (_hovered && enabled ? _darkHoverAlpha : _darkFillAlpha))
        : (_hovered && enabled ? scheme.surfaceContainerHighest : scheme.surface);

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _triggerFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.none,
      color: widget.muted ? scheme.onSurfaceVariant : scheme.onSurface,
      decoration: TextDecoration.none,
    );

    final Widget body = DecoratedBox(
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(HoronRadiusRole.control),
        border: Border.all(color: scheme.outline),
        boxShadow: _focused
            ? <BoxShadow>[
                BoxShadow(
                  color: horon.ring.withValues(alpha: _ringAlpha),
                  spreadRadius: _ringWidth,
                ),
              ]
            : null,
      ),
      child: SizedBox(
        height: _triggerHeight,
        width: widget.width,
        child: Padding(
          padding: EdgeInsetsDirectional.only(
            start: widget.icon == null ? _triggerPadding : _triggerIconPadding,
            end: _triggerPadding,
          ),
          child: Row(
            children: <Widget>[
              if (widget.icon != null) ...<Widget>[
                IconTheme.merge(
                  data: IconThemeData(size: _triggerIconSize, color: scheme.onSurface),
                  child: widget.icon!,
                ),
                const SizedBox(width: _triggerGap),
              ],
              Expanded(
                child: Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: Text(
                    widget.label ?? '',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    softWrap: false,
                    style: textStyle,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.semanticLabel,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: FocusableActionDetector(
          enabled: enabled,
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
            onTap: enabled ? widget.onTap : null,
            child: Opacity(opacity: enabled ? 1 : _disabledOpacity, child: body),
          ),
        ),
      ),
    );
  }
}
