import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart' show defaultTargetPlatform;
import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'checkbox.dart';
import 'select.dart';

/// `native-select.tsx`의 `data-[size=default]:h-[37px]`입니다.
const double _fieldHeight = 37;

/// `native-select.tsx`의 `data-[size=sm]:h-7`입니다.
const double _fieldHeightSm = 28;

/// `native-select.tsx`의 `data-[size=default]:pl-3`입니다.
const double _paddingStart = HoronSpace.s3;

/// `native-select.tsx`의 `data-[size=default]:pr-9`입니다. 셰브론 자리까지 비웁니다.
const double _paddingEnd = HoronSpace.s9;

/// `native-select.tsx`의 `data-[size=sm]:pl-2.5`입니다.
const double _paddingStartSm = HoronSpace.s2_5;

/// `native-select.tsx`의 `data-[size=sm]:pr-7`입니다.
const double _paddingEndSm = HoronSpace.s7;

/// 셰브론 `size-4`입니다.
const double _chevronSize = HoronSpace.s4;

/// 셰브론의 오른쪽 여백 `right-3`입니다.
const double _chevronInset = HoronSpace.s3;

/// 글자 크기 `text-sm`입니다.
const double _fontSize = HoronText.body;

/// `sm` 글자 크기 `text-xs`입니다.
const double _fontSizeSm = HoronText.caption;

/// 목록 시트의 최대 높이 비율입니다. 화면 높이의 60%를 넘지 않게 합니다.
const double _sheetMaxHeightRatio = 0.6;

/// 목록 시트의 항목 한 줄 높이입니다.
const double _rowHeight = HoronSpace.s11;

/// iOS 바퀴의 높이입니다. `CupertinoDatePicker`의 관례와 같은 216입니다.
const double _wheelHeight = 216;

/// 바퀴 시트 머리(취소·완료)의 높이입니다.
const double _wheelHeaderHeight = 44;

/// 포커스 링 두께입니다. React `focus-visible:ring-3`입니다.
const double _ringWidth = 3;

/// 포커스 링 투명도입니다. React `ring-ring/50`입니다.
const double _focusRingAlpha = 0.5;

/// 오류 링 투명도입니다. React `aria-invalid:ring-destructive/20`입니다.
const double _invalidRingAlpha = 0.2;

/// 다크의 오류 링 투명도입니다. React `dark:aria-invalid:ring-destructive/40`입니다.
const double _invalidRingAlphaDark = 0.4;

/// 다크의 오류 테두리 투명도입니다. React `dark:aria-invalid:border-destructive/50`입니다.
const double _invalidBorderAlphaDark = 0.5;

/// 비활성 채움 배수입니다. React `disabled:bg-input/50`입니다.
const double _disabledFillAlpha = 0.5;

/// 다크의 비활성 채움 배수입니다. React `dark:disabled:bg-input/80`입니다.
const double _disabledFillAlphaDark = 0.8;

/// 비활성 불투명도입니다. React `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// 체크 표시의 선 두께입니다. lucide `Check`의 `stroke-width` 2를 16px 상자로
/// 옮긴 값입니다.
const double _checkStrokeWidth = 1.4;

/// 플랫폼 선택기의 항목 하나입니다.
class HoronNativeSelectOption<T> {
  /// 항목 하나를 만듭니다.
  const HoronNativeSelectOption({required this.value, required this.label, this.enabled = true});

  /// 선택될 값입니다.
  final T value;

  /// 화면에 보이는 글자입니다.
  final String label;

  /// 고를 수 있는 상태인지 여부입니다. React `<option disabled>`에 대응합니다.
  final bool enabled;
}

/// 플랫폼 선택기를 여는 일을 호스트에 넘기는 콜백입니다.
///
/// 이 콜백을 넘기면 [HoronNativeSelect]는 어떤 선택기도 열지 않습니다. 호스트는
/// 자기 선택기를 열고 고른 값을 돌려주면 됩니다. 돌려준 값이 null이면 아무 일도
/// 일어나지 않습니다(사용자가 취소한 경우).
typedef HoronNativeSelectPicker<T> = Future<T?> Function(
  BuildContext context,
  List<HoronNativeSelectOption<T>> options,
  T? current,
);

/// 플랫폼 기본 선택기를 감싼 선택 필드입니다.
///
/// `native-select.tsx`를 옮긴 것입니다. 겉모양은 React의 `<select>`와 같습니다:
/// 높이 37, 반경 8, 채움 `bg-card`, 테두리 `border-input`, 오른쪽에 셰브론.
/// 안쪽 선택기는 플랫폼 것을 씁니다. iOS·macOS에서는 `CupertinoPicker` 바퀴,
/// 그 밖에서는 체크 표시가 붙은 목록 시트입니다. **Material `DropdownButton`은
/// 쓰지 않습니다.**
///
/// 라벨과 오류 문구는 Horon의 것입니다. [label]은 필드 위에, [error]는 아래에
/// 그려지고, [error]가 있으면 테두리가 destructive로 바뀝니다.
///
/// [onRequestPicker]를 넘기면 이 위젯이 선택기를 열지 않고 그 콜백만 부릅니다.
/// 호스트 앱이 이미 자기 선택기(예: 네이티브 액션 시트)를 갖고 있을 때 씁니다.
///
/// ```dart
/// HoronNativeSelect<String>(
///   label: '언어',
///   value: language,
///   options: const <HoronNativeSelectOption<String>>[
///     HoronNativeSelectOption<String>(value: 'ko', label: '한국어'),
///     HoronNativeSelectOption<String>(value: 'en', label: 'English'),
///   ],
///   onChanged: (String value) => setLanguage(value),
/// );
/// ```
class HoronNativeSelect<T> extends StatefulWidget {
  /// 기본 크기(높이 37)의 선택 필드를 만듭니다.
  const HoronNativeSelect({
    super.key,
    required this.options,
    this.value,
    this.onChanged,
    this.label,
    this.error,
    this.placeholder,
    this.enabled = true,
    this.semanticLabel,
    this.onRequestPicker,
  }) : size = HoronSelectSize.defaultValue;

  /// 바퀴 시트의 취소 버튼을 찾는 키입니다.
  static const Key cancelKey = ValueKey<String>('horon-native-select-cancel');

  /// 바퀴 시트의 완료 버튼을 찾는 키입니다.
  static const Key confirmKey = ValueKey<String>('horon-native-select-confirm');

  /// `sm` 크기(높이 28)의 선택 필드를 만듭니다.
  const HoronNativeSelect.sm({
    super.key,
    required this.options,
    this.value,
    this.onChanged,
    this.label,
    this.error,
    this.placeholder,
    this.enabled = true,
    this.semanticLabel,
    this.onRequestPicker,
  }) : size = HoronSelectSize.sm;

  /// 고를 수 있는 항목입니다.
  final List<HoronNativeSelectOption<T>> options;

  /// 지금 값입니다. null이면 [placeholder]를 보여 줍니다.
  final T? value;

  /// 값이 바뀔 때 부릅니다.
  final ValueChanged<T>? onChanged;

  /// 필드 위에 붙는 라벨입니다. Horon의 라벨 모양으로 그립니다.
  final String? label;

  /// 필드 아래에 붙는 오류 문구입니다. 있으면 오류 상태로 그립니다.
  final String? error;

  /// 값이 없을 때 보이는 안내 문구입니다. 호스트가 넘깁니다.
  final String? placeholder;

  /// 필드를 누를 수 있는 상태인지 여부입니다.
  final bool enabled;

  /// 보조 기술이 읽을 이름입니다. 없으면 [label]을 씁니다.
  final String? semanticLabel;

  /// 선택기를 여는 일을 호스트에 넘기는 콜백입니다.
  final HoronNativeSelectPicker<T>? onRequestPicker;

  /// 크기입니다. React의 `data-[size]`에 대응합니다.
  final HoronSelectSize size;

  @override
  State<HoronNativeSelect<T>> createState() => _HoronNativeSelectState<T>();
}

class _HoronNativeSelectState<T> extends State<HoronNativeSelect<T>> {
  bool _focused = false;
  bool _hovered = false;

  /// 지금 값의 항목입니다.
  HoronNativeSelectOption<T>? get _selected {
    for (final HoronNativeSelectOption<T> option in widget.options) {
      if (option.value == widget.value) return option;
    }
    return null;
  }

  Future<void> _open() async {
    if (!widget.enabled) return;
    final HoronNativeSelectPicker<T>? injected = widget.onRequestPicker;
    final T? picked = injected != null
        ? await injected(context, widget.options, widget.value)
        : await _showPlatformPicker();
    if (!mounted || picked == null) return;
    widget.onChanged?.call(picked);
  }

  Future<T?> _showPlatformPicker() {
    final TargetPlatform platform = defaultTargetPlatform;
    final bool usesWheel = platform == TargetPlatform.iOS || platform == TargetPlatform.macOS;
    return usesWheel ? _showWheel() : _showList();
  }

  /// iOS·macOS의 바퀴입니다. `CupertinoPicker`를 그대로 씁니다.
  ///
  /// `showCupertinoModalPopup`은 확인 버튼을 주지 않으므로 시트 머리에 취소·완료를
  /// 직접 둡니다. 완료를 눌러야 지금 바퀴 위치의 값이 돌아옵니다. 바깥을 누르면
  /// 취소이고 아무 값도 바뀌지 않습니다.
  Future<T?> _showWheel() {
    final HoronThemeData horon = HoronTheme.of(context);
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final List<HoronNativeSelectOption<T>> selectable = <HoronNativeSelectOption<T>>[
      for (final HoronNativeSelectOption<T> option in widget.options)
        if (option.enabled) option,
    ];
    if (selectable.isEmpty) return Future<T?>.value();

    int index = selectable.indexWhere((HoronNativeSelectOption<T> option) => option.value == widget.value);
    if (index < 0) index = 0;

    return showCupertinoModalPopup<int>(
      context: context,
      builder: (BuildContext sheetContext) => Material(
        color: horon.glassFillSolid,
        child: SizedBox(
          height: _wheelHeight + _wheelHeaderHeight,
          child: Column(
            children: <Widget>[
              SizedBox(
                height: _wheelHeaderHeight,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    _HoronWheelAction(
                      key: HoronNativeSelect.cancelKey,
                      label: horon.strings.close,
                      onTap: () => Navigator.of(sheetContext).pop(),
                    ),
                    _HoronWheelAction(
                      key: HoronNativeSelect.confirmKey,
                      label: _confirmLabel,
                      emphasised: true,
                      onTap: () => Navigator.of(sheetContext).pop(index),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: CupertinoPicker(
                  itemExtent: _rowHeight,
                  scrollController: FixedExtentScrollController(initialItem: index),
                  onSelectedItemChanged: (int value) => index = value,
                  children: <Widget>[
                    for (final HoronNativeSelectOption<T> option in selectable)
                      Center(
                        child: Text(
                          option.label,
                          style: TextStyle(
                            fontFamily: HoronFont.body,
                            fontFamilyFallback: HoronFont.fontFamilyFallback,
                            fontSize: _fontSize,
                            color: scheme.onSurface,
                            decoration: TextDecoration.none,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ).then((int? picked) => picked == null ? null : selectable[picked].value);
  }

  /// 바퀴 시트의 완료 버튼 글자입니다.
  ///
  /// [HoronStrings]에는 확인에 해당하는 슬롯이 없습니다. 이 패키지는 화면 문구를
  /// 창작하지 않는다는 규칙을 지키면서도 시트를 닫을 방법이 필요하므로, 취소는
  /// `strings.close`를 쓰고 확인은 영어 `Done`을 씁니다. 언어를 바꾸려면 호스트가
  /// [onRequestPicker]로 자기 선택기를 넘기면 됩니다.
  String get _confirmLabel => 'Done';

  /// 그 밖의 플랫폼의 목록 시트입니다. 항목마다 체크 표시가 붙습니다.
  Future<T?> _showList() {
    final HoronThemeData horon = HoronTheme.of(context);
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return showModalBottomSheet<T>(
      context: context,
      backgroundColor: horon.glassFillSolid,
      isScrollControlled: true,
      constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * _sheetMaxHeightRatio),
      shape: RoundedRectangleBorder(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(HoronRadiusRole.panel)),
        side: BorderSide(color: scheme.outline),
      ),
      builder: (BuildContext sheetContext) => SafeArea(
        top: false,
        child: ListView(
          shrinkWrap: true,
          padding: const EdgeInsets.symmetric(vertical: HoronSpace.s2),
          children: <Widget>[
            for (final HoronNativeSelectOption<T> option in widget.options)
              _HoronNativeSelectRow<T>(
                option: option,
                selected: option.value == widget.value,
                onTap: option.enabled ? () => Navigator.of(sheetContext).pop(option.value) : null,
              ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool invalid = widget.error != null && widget.error!.isNotEmpty;
    final bool isDark = theme.brightness == Brightness.dark;
    final bool compact = widget.size == HoronSelectSize.sm;
    final HoronNativeSelectOption<T>? selected = _selected;

    // "rounded-sm border border-input bg-card text-sm text-foreground
    //  focus-visible:border-ring focus-visible:ring-3 ring-ring/50
    //  disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive"
    final Color borderColor = invalid
        ? (isDark ? scheme.error.withValues(alpha: _invalidBorderAlphaDark) : scheme.error)
        : (_focused ? horon.ring : scheme.outline);
    final Color fill = widget.enabled
        ? scheme.surfaceContainerLowest
        : Color.alphaBlend(
            scheme.outline.withValues(alpha: scheme.outline.a * (isDark ? _disabledFillAlphaDark : _disabledFillAlpha)),
            scheme.surfaceContainerLow,
          );
    final Color? ring = invalid
        ? scheme.error.withValues(alpha: isDark ? _invalidRingAlphaDark : _invalidRingAlpha)
        : (_focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null);

    final TextStyle valueStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: compact ? _fontSizeSm : _fontSize,
      height: HoronLineHeight.none,
      color: selected == null ? scheme.onSurfaceVariant : scheme.onSurface,
      decoration: TextDecoration.none,
    );

    final Widget field = SizedBox(
      height: compact ? _fieldHeightSm : _fieldHeight,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: fill,
          borderRadius: BorderRadius.circular(HoronRadiusRole.input),
          border: Border.all(color: borderColor),
          boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _ringWidth)],
        ),
        child: Stack(
          children: <Widget>[
            Padding(
              padding: EdgeInsetsDirectional.only(
                start: compact ? _paddingStartSm : _paddingStart,
                end: compact ? _paddingEndSm : _paddingEnd,
              ),
              child: Align(
                alignment: AlignmentDirectional.centerStart,
                child: Text(
                  selected?.label ?? widget.placeholder ?? '',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  softWrap: false,
                  style: valueStyle,
                ),
              ),
            ),
            PositionedDirectional(
              end: compact ? HoronSpace.s2_5 : _chevronInset,
              top: 0,
              bottom: 0,
              child: Center(
                child: CustomPaint(
                  size: const Size.square(_chevronSize),
                  painter: HoronChevronPainter(
                    color: _hovered && widget.enabled ? scheme.onSurface : scheme.onSurfaceVariant,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        if (widget.label != null) ...<Widget>[
          Text(
            widget.label!,
            style: TextStyle(
              fontFamily: HoronFont.body,
              fontFamilyFallback: HoronFont.fontFamilyFallback,
              fontSize: _fontSize,
              height: HoronLineHeight.none,
              color: widget.enabled ? scheme.onSurface : scheme.onSurfaceVariant,
              decoration: TextDecoration.none,
            ),
          ),
          const SizedBox(height: HoronSpace.s2),
        ],
        Semantics(
          button: true,
          enabled: widget.enabled,
          label: widget.semanticLabel ?? widget.label,
          value: selected?.label ?? widget.placeholder,
          child: MouseRegion(
            cursor: widget.enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
            onEnter: (_) => setState(() => _hovered = true),
            onExit: (_) => setState(() => _hovered = false),
            child: FocusableActionDetector(
              enabled: widget.enabled,
              onShowFocusHighlight: (bool value) => setState(() => _focused = value),
              actions: <Type, Action<Intent>>{
                ActivateIntent: CallbackAction<ActivateIntent>(
                  onInvoke: (ActivateIntent intent) {
                    _open();
                    return null;
                  },
                ),
              },
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: widget.enabled ? _open : null,
                child: Opacity(opacity: widget.enabled ? 1 : _disabledOpacity, child: field),
              ),
            ),
          ),
        ),
        if (invalid) ...<Widget>[
          const SizedBox(height: HoronSpace.s2),
          Semantics(
            liveRegion: true,
            child: Text(
              widget.error!,
              style: TextStyle(
                fontFamily: HoronFont.body,
                fontFamilyFallback: HoronFont.fontFamilyFallback,
                fontSize: _fontSizeSm,
                height: HoronLineHeight.normal,
                color: scheme.error,
                decoration: TextDecoration.none,
              ),
            ),
          ),
        ],
      ],
    );
  }
}

/// 바퀴 시트 머리의 버튼 하나입니다. 취소와 완료가 같은 모양을 씁니다.
class _HoronWheelAction extends StatelessWidget {
  const _HoronWheelAction({super.key, required this.label, required this.onTap, this.emphasised = false});

  final String label;
  final VoidCallback onTap;
  final bool emphasised;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    return Semantics(
      button: true,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s4),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontFamily: HoronFont.body,
                fontFamilyFallback: HoronFont.fontFamilyFallback,
                fontSize: _fontSize,
                height: HoronLineHeight.none,
                fontWeight: emphasised ? HoronFontWeight.semibold : HoronFontWeight.regular,
                color: emphasised ? horon.brandGoldText : scheme.onSurfaceVariant,
                decoration: TextDecoration.none,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 목록 시트의 항목 한 줄입니다. 선택된 항목에 체크 표시가 붙습니다.
class _HoronNativeSelectRow<T> extends StatelessWidget {
  const _HoronNativeSelectRow({required this.option, required this.selected, required this.onTap});

  final HoronNativeSelectOption<T> option;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool enabled = option.enabled;
    return Semantics(
      button: true,
      selected: selected,
      enabled: enabled,
      child: InkWell(
        onTap: onTap,
        child: SizedBox(
          height: _rowHeight,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s4),
            child: Row(
              children: <Widget>[
                Expanded(
                  child: Text(
                    option.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: HoronFont.body,
                      fontFamilyFallback: HoronFont.fontFamilyFallback,
                      fontSize: _fontSize,
                      height: HoronLineHeight.none,
                      color: enabled ? scheme.onSurface : scheme.onSurfaceVariant,
                      decoration: TextDecoration.none,
                    ),
                  ),
                ),
                if (selected)
                  CustomPaint(
                    key: const ValueKey<String>('horon-native-select-check'),
                    size: const Size.square(_chevronSize),
                    painter: HoronCheckMarkPainter(
                      color: scheme.onSurface,
                      indeterminate: false,
                      strokeWidth: _checkStrokeWidth,
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
