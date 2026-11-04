import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/horon_veil.dart';
import '../overlay/horon_menu_anchor.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';
import 'input_group.dart';

/// `combobox.tsx`의 `ComboboxSize`(`ControlSize`)입니다.
enum HoronComboboxSize {
  /// `size="sm"` — 높이 32, `label-sm`, 칩 높이 20.
  sm,

  /// `size="md"` — 높이 40, `label-md`, 칩 높이 24. 기본값입니다.
  md,

  /// `size="lg"` — 높이 48, `label-lg`, 칩 높이 28.
  lg,
}

/// 검색과 선택을 합친 목록의 항목입니다. React `ComboboxItemData`.
class HoronComboboxItem {
  /// 항목을 만듭니다.
  const HoronComboboxItem({
    required this.value,
    required this.label,
    this.selectedLabel,
    this.keywords = const <String>[],
    this.trailing,
    this.disabled = false,
  });

  /// 항목의 값입니다.
  final String value;

  /// 목록에 보이고 검색이 맞추는 문구입니다.
  final String label;

  /// 선택된 뒤 필드에 보이는 짧은 문구입니다. 없으면 [label]을 씁니다.
  final String? selectedLabel;

  /// 화면에 보이지 않지만 검색에 쓰는 말입니다.
  final List<String> keywords;

  /// 목록 오른쪽에 붙는 보조 문구입니다. 예: 국가 코드.
  final Widget? trailing;

  /// 고를 수 없는 항목인지 여부입니다.
  final bool disabled;
}

typedef _ComboboxMetrics = ({
  double fieldHeight,
  double paddingX,
  double gap,
  double itemHeight,
  double itemGap,
  double itemPaddingX,
  double chipHeight,
  double chipGap,
  double chipPaddingX,
  double chipIcon,
  double icon,
  double check,
  TextStyle fieldText,
  TextStyle itemText,
  TextStyle chipText,
});

_ComboboxMetrics _metricsOf(HoronComboboxSize size, HoronThemeData theme) => switch (size) {
  HoronComboboxSize.sm => (
    fieldHeight: theme.space.step(8),
    paddingX: theme.space.s3,
    gap: theme.space.s1_5,
    itemHeight: theme.space.step(8),
    itemGap: theme.space.s2,
    itemPaddingX: theme.space.s2_5,
    chipHeight: theme.space.step(5),
    chipGap: theme.space.s0_5,
    chipPaddingX: theme.space.s1_5,
    chipIcon: 12, // chipClass sm `[&_svg]:size-3`
    icon: 16,
    check: 16,
    fieldText: theme.text.bodySm,
    itemText: theme.text.labelSm,
    chipText: theme.text.labelSm,
  ),
  HoronComboboxSize.md => (
    fieldHeight: theme.space.step(10),
    paddingX: theme.space.s3_5,
    gap: theme.space.s2,
    itemHeight: theme.space.step(10),
    itemGap: theme.space.s2_5,
    itemPaddingX: theme.space.s3,
    chipHeight: theme.space.step(6),
    chipGap: theme.space.s1,
    chipPaddingX: theme.space.s2,
    chipIcon: 14, // chipClass md `[&_svg]:size-3.5`
    icon: 16, // md `[&_svg]:size-4`
    check: 16,
    fieldText: theme.text.bodyMd,
    itemText: theme.text.labelMd,
    chipText: theme.text.labelSm,
  ),
  HoronComboboxSize.lg => (
    fieldHeight: theme.space.step(12),
    paddingX: theme.space.s5,
    gap: theme.space.s2_5,
    itemHeight: theme.space.step(12),
    itemGap: theme.space.s3,
    itemPaddingX: theme.space.s4,
    chipHeight: theme.space.step(7),
    chipGap: theme.space.s1,
    chipPaddingX: theme.space.s2_5,
    chipIcon: 16, // chipClass lg `[&_svg]:size-4`
    icon: 20,
    check: 20,
    fieldText: theme.text.bodyLg,
    itemText: theme.text.labelLg,
    chipText: theme.text.labelMd,
  ),
};

/// `w-60` — 다중 선택 필드의 폭 240입니다. 칩이 여러 줄로 늘어서므로 폭을 고정합니다.
const double _multiFieldWidth = 240;

/// 검색과 선택을 합친 필드입니다. React `Combobox`.
///
/// [multiple]이 참이면 고른 항목이 칩으로 쌓이고, 거짓이면 하나만 고릅니다.
/// [segment]를 켜면 [HoronInputGroup]의 앞·뒤 칸으로 쓰이며 그룹의 크기와 비활성
/// 상태를 따릅니다. 검색 상자는 목록 위에 있고, 입력한 말로 목록을 거릅니다.
class HoronCombobox extends StatefulWidget {
  /// 콤보박스를 만듭니다.
  const HoronCombobox({
    super.key,
    required this.items,
    this.value,
    this.values,
    this.onChanged,
    this.onValuesChanged,
    this.placeholder = 'Search',
    this.searchPlaceholder = 'Search',
    this.emptyLabel = 'No results',
    this.size = HoronComboboxSize.md,
    this.surface = HoronInputSurface.solid,
    this.segment = false,
    this.multiple = false,
    this.invalid = false,
    this.disabled = false,
    this.semanticLabel,
  });

  /// 고를 수 있는 항목입니다.
  final List<HoronComboboxItem> items;

  /// 단일 선택 값입니다. [multiple]이면 무시합니다.
  final String? value;

  /// 복수 선택 값입니다. [multiple]이 참일 때 씁니다.
  final List<String>? values;

  /// 단일 선택이 바뀔 때 호출됩니다.
  final ValueChanged<String?>? onChanged;

  /// 복수 선택이 바뀔 때 호출됩니다.
  final ValueChanged<List<String>>? onValuesChanged;

  /// 값이 없을 때 보이는 문구입니다.
  final String placeholder;

  /// 목록 위 검색 상자의 안내 문구입니다.
  final String searchPlaceholder;

  /// 검색 결과가 없을 때 보이는 문구입니다.
  final String emptyLabel;

  /// 크기입니다. 기본값은 [HoronComboboxSize.md]입니다.
  final HoronComboboxSize size;

  /// 필드 표면입니다.
  final HoronInputSurface surface;

  /// [HoronInputGroup]의 칸으로 쓰는 표면입니다.
  final bool segment;

  /// 여러 항목을 칩으로 고를지 여부입니다.
  final bool multiple;

  /// 오류 상태입니다.
  final bool invalid;

  /// 비활성 상태입니다.
  final bool disabled;

  /// 접근성 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronCombobox> createState() => _HoronComboboxState();
}

class _HoronComboboxState extends State<HoronCombobox> {
  final LayerLink _link = LayerLink();
  final MenuController _menu = MenuController();
  final TextEditingController _search = TextEditingController();
  final FocusNode _searchFocus = FocusNode(debugLabel: 'HoronCombobox.search');

  String? _innerValue;
  List<String> _innerValues = <String>[];
  String _query = '';

  HoronInputGroupScope? get _group => HoronInputGroupScope.maybeOf(context);

  bool get _disabled => widget.disabled || (widget.segment && (_group?.disabled ?? false));

  List<String> get _selectedValues {
    if (widget.multiple) return widget.values ?? _innerValues;
    final String? single = widget.value ?? _innerValue;
    return single == null ? <String>[] : <String>[single];
  }

  String? get _selectedSingle => widget.value ?? _innerValue;

  HoronComboboxItem? _find(String value) {
    for (final HoronComboboxItem item in widget.items) {
      if (item.value == value) return item;
    }
    return null;
  }

  String _shortLabel(HoronComboboxItem item) => item.selectedLabel ?? item.label;

  List<HoronComboboxItem> get _filtered {
    final String needle = _query.trim().toLowerCase();
    if (needle.isEmpty) return widget.items;
    return <HoronComboboxItem>[
      for (final HoronComboboxItem item in widget.items)
        if (<String>[
          item.label,
          item.value,
          ...item.keywords,
        ].any((String text) => text.toLowerCase().contains(needle)))
          item,
    ];
  }

  @override
  void dispose() {
    _search.dispose();
    _searchFocus.dispose();
    super.dispose();
  }

  /// 패널이 처음 그려진 다음 프레임에 검색 상자로 포커스를 옮깁니다.
  void _focusSearch() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_searchFocus.canRequestFocus) return;
      _searchFocus.requestFocus();
    });
  }

  void _toggle() {
    if (_disabled) return;
    if (_menu.isOpen) {
      _menu.close();
    } else {
      _menu.open();
    }
  }

  /// 목록이 닫히면 검색어를 비웁니다.
  void _resetSearch() {
    _search.clear();
    if (!mounted || _query.isEmpty) return;
    setState(() => _query = '');
  }

  void _pick(HoronComboboxItem item) {
    if (item.disabled) return;
    if (widget.multiple) {
      final List<String> next = <String>[..._selectedValues];
      if (!next.remove(item.value)) next.add(item.value);
      if (widget.values == null) setState(() => _innerValues = next);
      widget.onValuesChanged?.call(next);
      return;
    }
    if (widget.value == null) setState(() => _innerValue = item.value);
    _menu.close();
    widget.onChanged?.call(item.value);
  }

  void _remove(String value) {
    final List<String> next = <String>[..._selectedValues]..remove(value);
    if (widget.values == null) setState(() => _innerValues = next);
    widget.onValuesChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final _ComboboxMetrics metrics = _metricsOf(widget.size, theme);
    final bool hasValue = _selectedValues.isNotEmpty;

    return HoronMenuAnchor(
      controller: _menu,
      onOpen: _focusSearch,
      onClose: _resetSearch,
      child: CompositedTransformTarget(
        link: _link,
        child: Semantics(
          button: true,
          label: widget.semanticLabel,
          value: widget.multiple
              ? _selectedValues
                    .map((String value) => _find(value))
                    .whereType<HoronComboboxItem>()
                    .map(_shortLabel)
                    .join(', ')
              : _selectedSingle == null
              ? null
              : _shortLabel(_find(_selectedSingle!) ?? HoronComboboxItem(value: '', label: '')),
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _toggle,
            child: widget.segment
                ? _buildSegment(context, metrics, hasValue)
                : widget.multiple
                ? _buildMultiField(context, metrics)
                : _buildField(context, metrics),
          ),
        ),
      ),
      overlayBuilder: (BuildContext context, RawMenuOverlayInfo info) => _buildPopup(context, metrics, info),
    );
  }

  Widget _buildField(BuildContext context, _ComboboxMetrics metrics) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronComboboxItem? chosen = _selectedSingle == null ? null : _find(_selectedSingle!);
    final Color color = _disabled
        ? colors.textDisabled
        : chosen == null
        ? colors.textPlaceholder
        : colors.textPrimary;
    return SizedBox(
      height: metrics.fieldHeight,
      child: HoronFieldBox(
        surface: widget.surface,
        invalid: widget.invalid,
        enabled: !_disabled,
        padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
        child: Row(
          spacing: metrics.gap,
          children: <Widget>[
            Icon(Icons.search, size: metrics.icon, color: colors.textSecondary),
            Expanded(
              child: Text(
                chosen == null ? widget.placeholder : _shortLabel(chosen),
                style: metrics.fieldText.copyWith(color: color),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Icon(Icons.keyboard_arrow_down, size: metrics.icon, color: colors.textSecondary),
          ],
        ),
      ),
    );
  }

  Widget _buildMultiField(BuildContext context, _ComboboxMetrics metrics) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final List<HoronComboboxItem> chosen = <HoronComboboxItem>[
      for (final String value in _selectedValues) ?_find(value),
    ];
    // `w-60` — 폭이 꽉 찬 부모 안에서도 240을 지키도록 왼쪽으로 붙여 느슨한 제약을 줍니다.
    return Align(
      alignment: AlignmentDirectional.centerStart,
      // 폭·높이를 자식에 맞춰 필드 자체가 240이 되게 합니다(React `w-60`).
      widthFactor: 1,
      heightFactor: 1,
      child: SizedBox(
        width: _multiFieldWidth,
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: metrics.fieldHeight),
          child: HoronFieldBox(
            surface: widget.surface,
            invalid: widget.invalid,
            enabled: !_disabled,
            padding: EdgeInsets.symmetric(horizontal: metrics.chipPaddingX, vertical: metrics.chipGap),
            child: Wrap(
              spacing: metrics.chipGap,
              runSpacing: metrics.chipGap,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                for (final HoronComboboxItem item in chosen)
                  _ComboboxChip(
                    key: ValueKey<String>('horon-combobox-chip-${item.value}'),
                    label: _shortLabel(item),
                    metrics: metrics,
                    onRemove: _disabled ? null : () => _remove(item.value),
                  ),
                Text(
                  chosen.isEmpty ? widget.placeholder : '',
                  style: metrics.fieldText.copyWith(color: _disabled ? colors.textDisabled : colors.textPlaceholder),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSegment(BuildContext context, _ComboboxMetrics metrics, bool hasValue) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronInputGroupSize groupSize = _group?.size ?? HoronInputGroupSize.md;
    final HoronSegmentMetrics segment = horonSegmentMetrics(groupSize, theme);
    final String text = widget.multiple
        ? _selectedValues.map((String value) => _find(value)).whereType<HoronComboboxItem>().map(_shortLabel).join(', ')
        : _selectedSingle == null
        ? ''
        : _shortLabel(_find(_selectedSingle!) ?? HoronComboboxItem(value: '', label: ''));
    return SizedBox(
      height: double.infinity,
      child: ColoredBox(
        color: colors.overlayInk4,
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: segment.paddingX),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: segment.gap,
            children: <Widget>[
              Text(
                hasValue && text.isNotEmpty ? text : widget.placeholder,
                style: segment.textStyle.copyWith(
                  color: _disabled
                      ? colors.textDisabled
                      : hasValue
                      ? colors.textPrimary
                      : colors.textPlaceholder,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              Icon(Icons.keyboard_arrow_down, size: segment.icon, color: colors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPopup(BuildContext context, _ComboboxMetrics metrics, RawMenuOverlayInfo info) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final BorderRadius radius = BorderRadius.all(Radius.circular(theme.radius.xl));
    final List<HoronComboboxItem> filtered = _filtered;

    return CompositedTransformFollower(
      link: _link,
      targetAnchor: Alignment.bottomLeft,
      followerAnchor: Alignment.topLeft,
      offset: const Offset(0, 4),
      child: Align(
        alignment: Alignment.topLeft,
        child: TweenAnimationBuilder<double>(
          tween: Tween<double>(begin: 0, end: 1),
          duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
          curve: HoronMotion.easeOutQuint,
          builder: (BuildContext context, double value, Widget? child) => Opacity(
            opacity: value,
            child: Transform.scale(
              scale: HoronMotion.popupEnterScale + (1 - HoronMotion.popupEnterScale) * value,
              alignment: Alignment.topLeft,
              child: child,
            ),
          ),
          child: SizedBox(
            width: math.max(info.anchorRect.width, 256),
            child: widget.surface == HoronInputSurface.glass
                // React `veil-overlay` — 자체 그림자를 들고 옵니다.
                ? HoronVeil(
                    kind: HoronVeilKind.overlay,
                    borderRadius: radius,
                    child: Padding(
                      padding: EdgeInsets.all(theme.space.s1_5),
                      child: _popupBody(theme, metrics, colors, filtered),
                    ),
                  )
                // React `border border-border-default bg-bg-surface shadow-popover`.
                : DecoratedBox(
                    decoration: BoxDecoration(
                      color: colors.bgSurface,
                      borderRadius: radius,
                      border: Border.all(color: colors.borderDefault),
                      boxShadow: theme.shadows.popover,
                    ),
                    child: ClipRRect(
                      borderRadius: radius,
                      child: Padding(
                        padding: EdgeInsets.all(theme.space.s1_5),
                        child: _popupBody(theme, metrics, colors, filtered),
                      ),
                    ),
                  ),
          ),
        ),
      ),
    );
  }

  /// 검색 상자와 결과 목록입니다. 표면과 무관하게 같은 내용을 그립니다.
  Widget _popupBody(
    HoronThemeData theme,
    _ComboboxMetrics metrics,
    HoronColors colors,
    List<HoronComboboxItem> filtered,
  ) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: theme.space.s1,
      children: <Widget>[
        SizedBox(
          height: metrics.fieldHeight,
          child: HoronFieldBox(
            surface: HoronInputSurface.solid,
            enabled: true,
            padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
            child: Row(
              spacing: metrics.gap,
              children: <Widget>[
                Icon(Icons.search, size: metrics.icon, color: colors.textSecondary),
                Expanded(
                  child: TextField(
                    controller: _search,
                    focusNode: _searchFocus,
                    autofocus: true,
                    onChanged: (String value) => setState(() => _query = value),
                    style: metrics.fieldText.copyWith(color: colors.textPrimary),
                    cursorColor: colors.textPrimary,
                    decoration: InputDecoration.collapsed(
                      hintText: widget.searchPlaceholder,
                      hintStyle: metrics.fieldText.copyWith(color: colors.textPlaceholder),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        if (filtered.isEmpty)
          Padding(
            padding: EdgeInsets.symmetric(horizontal: theme.space.s3, vertical: theme.space.s2),
            child: Text(widget.emptyLabel, style: metrics.fieldText.copyWith(color: colors.textSecondary)),
          )
        else
          ConstrainedBox(
            constraints: const BoxConstraints(maxHeight: 256),
            child: SingleChildScrollView(
              primary: false,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                spacing: theme.space.s0_5,
                children: <Widget>[for (final HoronComboboxItem item in filtered) _row(context, metrics, item)],
              ),
            ),
          ),
      ],
    );
  }

  Widget _row(BuildContext context, _ComboboxMetrics metrics, HoronComboboxItem item) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool selected = _selectedValues.contains(item.value);
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: item.disabled ? null : () => _pick(item),
      child: Opacity(
        opacity: item.disabled ? 0.4 : 1,
        child: Container(
          height: metrics.itemHeight,
          padding: EdgeInsets.symmetric(horizontal: metrics.itemPaddingX),
          decoration: BoxDecoration(
            color: selected ? colors.overlayInk6 : Colors.transparent,
            borderRadius: BorderRadius.all(Radius.circular(theme.radius.md)),
          ),
          child: Row(
            spacing: metrics.itemGap,
            children: <Widget>[
              Expanded(
                child: Text(
                  item.label,
                  style: metrics.itemText.copyWith(color: colors.textPrimary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (item.trailing != null)
                DefaultTextStyle.merge(
                  style: metrics.itemText.copyWith(color: colors.textSecondary),
                  child: item.trailing!,
                ),
              if (selected) Icon(Icons.check, size: metrics.check, color: colors.textPrimary),
            ],
          ),
        ),
      ),
    );
  }
}

/// 다중 선택 필드의 칩 하나입니다. React `Combobox.Chip`(`animate-pop-in`).
///
/// 칩은 목록에서 고를 때마다 새로 생기므로, 처음 그려질 때 0.6배에서 제 크기로
/// 커지며 나타납니다. 제거 버튼은 React `ChipRemove`의 `p-0.5` 자리에 14px
/// (`[&_svg]:size-3.5`) 아이콘을 둡니다.
class _ComboboxChip extends StatelessWidget {
  const _ComboboxChip({super.key, required this.label, required this.metrics, this.onRemove});

  final String label;
  final _ComboboxMetrics metrics;
  final VoidCallback? onRemove;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: Container(
        height: metrics.chipHeight,
        padding: EdgeInsets.only(left: metrics.chipPaddingX, right: metrics.chipGap),
        decoration: BoxDecoration(color: colors.overlayInk6, borderRadius: BorderRadius.circular(theme.radius.full)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: metrics.chipGap,
          children: <Widget>[
            Text(label, style: metrics.chipText.copyWith(color: colors.textPrimary)),
            GestureDetector(
              onTap: onRemove,
              child: Icon(Icons.close, size: metrics.chipIcon, color: colors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
