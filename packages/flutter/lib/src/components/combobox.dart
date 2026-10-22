import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'checkbox.dart';
import 'chip.dart';
import 'glass_surface.dart';
import 'select.dart';

/// `combobox.tsx` 입력 그룹의 최소 높이 `min-h-[37px]`입니다.
const double _fieldMinHeight = 37;

/// `combobox.tsx` 목록의 `min-w-36`입니다.
const double _contentMinWidth = 144;

/// 목록과 입력 사이의 `sideOffset` 기본값 4입니다.
const double _contentGap = HoronSpace.s1;

/// 목록이 화면 가장자리에서 비워 두는 여백입니다.
const double _screenMargin = HoronSpace.s2;

/// 목록의 높이 상한입니다. React는 `max-h-(--available-height)`를 씁니다.
const double _contentPreferredMaxHeight = 320;

/// 항목 하나의 최소 높이입니다. React `py-1.5`와 14px 글자가 만드는 30입니다.
const double _itemHeight = 30;

/// 항목의 `pl-2`입니다.
const double _itemPaddingStart = HoronSpace.s2;

/// 항목의 `pr-8`입니다. 체크 표시 자리를 비워 둡니다.
const double _itemPaddingEnd = HoronSpace.s8;

/// 항목의 `py-1.5`입니다.
const double _itemPaddingVertical = HoronSpace.s1_5;

/// 체크 표시의 `right-2`입니다.
const double _checkInset = HoronSpace.s2;

/// 체크 표시의 선 두께입니다.
const double _checkStrokeWidth = 1.4;

/// 체크 표시·셰브론 `size-4`입니다.
const double _iconSize = HoronSpace.s4;

/// 입력 줄 오른쪽 셰브론 버튼 `size-5`입니다.
const double _toggleSize = HoronSpace.s5;

/// 입력 글자 크기 `text-sm`입니다.
const double _fontSize = HoronText.body;

/// 빈 상태 문구 크기 `text-xs`입니다.
const double _emptyFontSize = HoronText.caption;

/// 포커스 링 두께입니다. React `focus-within:ring-3`입니다.
const double _ringWidth = 3;

/// 포커스 링 투명도입니다. React `ring-ring/50`입니다.
const double _focusRingAlpha = 0.5;

/// 오류 링 투명도입니다. React `aria-invalid:ring-destructive/20`입니다.
const double _invalidRingAlpha = 0.2;

/// 다크의 오류 링 투명도입니다. React `dark:aria-invalid:ring-destructive/40`입니다.
const double _invalidRingAlphaDark = 0.4;

/// 다크의 오류 테두리 투명도입니다. React `dark:aria-invalid:border-destructive/50`입니다.
const double _invalidBorderAlphaDark = 0.5;

/// 비활성 불투명도입니다. React `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// 고를 수 있는 항목 하나입니다.
///
/// React `combobox.tsx`에서 `<Combobox.Item value="…">글자</Combobox.Item>`으로 쓰는
/// 자리의 데이터입니다. 목록은 값을 보고 거르므로 항목을 데이터로 먼저 받고,
/// 그리기는 [HoronComboboxItem]이 맡습니다.
class HoronComboboxOption {
  /// 항목 하나를 만듭니다.
  const HoronComboboxOption({required this.value, required this.label, this.enabled = true});

  /// 선택 집합에 들어가는 값입니다.
  final String value;

  /// 목록과 칩에 보이는 글자입니다.
  final String label;

  /// 고를 수 있는 상태인지 여부입니다.
  final bool enabled;
}

/// 목록을 어느 쪽에 놓을지 정한 결과입니다.
///
/// todo 18이 공용 위치 유틸(`lib/src/overlay/horon_overlay.dart`)을 만들면 이 계산은
/// 그쪽으로 옮깁니다. 지금은 이 파일이 자기 팝업만 놓습니다.
class _HoronComboboxPlacement {
  const _HoronComboboxPlacement({
    required this.targetAnchor,
    required this.followerAnchor,
    required this.offset,
    required this.maxHeight,
    required this.width,
  });

  final Alignment targetAnchor;
  final Alignment followerAnchor;
  final Offset offset;
  final double maxHeight;
  final double width;
}

/// 입력 사각형을 보고 목록을 아래에 둘지 위로 뒤집을지 정합니다.
_HoronComboboxPlacement _placeContent({required Rect anchor, required Size screen, required EdgeInsets safeArea}) {
  final double spaceBelow = screen.height - anchor.bottom - _contentGap - _screenMargin - safeArea.bottom;
  final double spaceAbove = anchor.top - _contentGap - _screenMargin - safeArea.top;
  final bool flip = spaceBelow < _contentPreferredMaxHeight && spaceAbove > spaceBelow;
  final double available = math.max(flip ? spaceAbove : spaceBelow, _itemHeight);

  final double width = math.max(anchor.width, _contentMinWidth);
  final double minLeft = _screenMargin + safeArea.left;
  final double maxLeft = math.max(minLeft, screen.width - _screenMargin - safeArea.right - width);
  final double left = (anchor.center.dx - width / 2).clamp(minLeft, maxLeft);

  return _HoronComboboxPlacement(
    targetAnchor: flip ? Alignment.topLeft : Alignment.bottomLeft,
    followerAnchor: flip ? Alignment.bottomLeft : Alignment.topLeft,
    offset: Offset(left - anchor.left, flip ? -_contentGap : _contentGap),
    maxHeight: math.min(available, _contentPreferredMaxHeight),
    width: width,
  );
}

/// 입력과 팝업 목록으로 값을 고르는 콤보 상자입니다.
///
/// `combobox.tsx`를 옮긴 것입니다. 입력에 글자를 넣으면 목록이 그 글자를 품은 항목만
/// 남습니다. [multiple]이 참이면 고른 값들이 입력 안에 칩으로 쌓이고, 거짓이면 하나만
/// 남습니다. 칩은 Material `Chip`이 아니라 todo 8의 [HoronChip]입니다.
///
/// 목록은 `.glass-strong` 패널이고, 아래에 자리가 없으면 입력 위로 뒤집힙니다.
/// 항목이 하나도 남지 않으면 [HoronComboboxEmpty]가 빈 상태 문구를 그립니다.
///
/// ```dart
/// HoronCombobox(
///   multiple: true,
///   placeholder: '태그 검색',
///   options: const <HoronComboboxOption>[
///     HoronComboboxOption(value: 'design', label: 'Design'),
///     HoronComboboxOption(value: 'code', label: 'Code'),
///   ],
///   selected: tags,
///   onSelectionChanged: (Set<String> values) => setTags(values),
/// );
/// ```
class HoronCombobox extends StatefulWidget {
  /// 콤보 상자를 만듭니다.
  const HoronCombobox({
    super.key,
    required this.options,
    this.selected = const <String>{},
    this.onSelectionChanged,
    this.multiple = false,
    this.placeholder,
    this.emptyLabel,
    this.invalid = false,
    this.enabled = true,
    this.semanticLabel,
    this.chipRemoveLabel,
  });

  /// 목록 패널을 찾는 키입니다. React의 `data-slot="combobox-content"` 자리입니다.
  static const Key contentKey = ValueKey<String>('horon-combobox-content');

  /// 오른쪽 셰브론 버튼을 찾는 키입니다. React의 `data-slot="combobox-trigger"` 자리입니다.
  static const Key toggleKey = ValueKey<String>('horon-combobox-trigger');

  /// 고를 수 있는 항목입니다.
  final List<HoronComboboxOption> options;

  /// 지금 선택된 값들입니다.
  final Set<String> selected;

  /// 선택이 바뀔 때 부릅니다. 단일 선택에서도 집합으로 옵니다(비어 있거나 한 개).
  final ValueChanged<Set<String>>? onSelectionChanged;

  /// 여러 값을 함께 고를 수 있는지 여부입니다.
  final bool multiple;

  /// 아무것도 고르지 않았을 때 입력에 보이는 안내 문구입니다.
  final String? placeholder;

  /// 거른 결과가 없을 때 보이는 문구입니다. 없으면 `strings.noResults`입니다.
  final String? emptyLabel;

  /// 오류 상태입니다. React의 `aria-invalid`에 대응합니다.
  final bool invalid;

  /// 입력과 목록을 받는 상태인지 여부입니다.
  final bool enabled;

  /// 입력의 접근성 이름입니다.
  final String? semanticLabel;

  /// 칩의 제거 버튼 접근성 이름입니다. 없으면 `strings.remove`입니다.
  final String? chipRemoveLabel;

  @override
  State<HoronCombobox> createState() => _HoronComboboxState();
}

class _HoronComboboxState extends State<HoronCombobox> {
  final OverlayPortalController _portal = OverlayPortalController();
  final LayerLink _link = LayerLink();
  final GlobalKey _anchorKey = GlobalKey();
  final TextEditingController _query = TextEditingController();
  final FocusNode _inputFocus = FocusNode(debugLabel: 'HoronComboboxInput');
  final FocusNode _panelFocus = FocusNode(debugLabel: 'HoronComboboxPanel');

  bool _open = false;
  bool _focused = false;
  Rect? _anchorRect;
  String? _highlighted;

  @override
  void initState() {
    super.initState();
    _inputFocus.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _inputFocus.removeListener(_handleFocusChange);
    _inputFocus.dispose();
    _panelFocus.dispose();
    _query.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (!mounted) return;
    final bool focused = _inputFocus.hasFocus;
    setState(() => _focused = focused);
    if (focused && widget.enabled && !_open) _openPanel();
  }

  /// 입력 글자로 거른 항목입니다.
  List<HoronComboboxOption> get _filtered {
    final String query = _query.text.trim().toLowerCase();
    if (query.isEmpty) return widget.options;
    return <HoronComboboxOption>[
      for (final HoronComboboxOption option in widget.options)
        if (option.label.toLowerCase().contains(query) || option.value.toLowerCase().contains(query)) option,
    ];
  }

  void _measureAnchor() {
    final RenderObject? anchorObject = _anchorKey.currentContext?.findRenderObject();
    if (anchorObject is! RenderBox || !anchorObject.hasSize) return;
    _anchorRect = anchorObject.localToGlobal(Offset.zero) & anchorObject.size;
  }

  void _openPanel() {
    if (!widget.enabled || _open) return;
    _measureAnchor();
    final List<HoronComboboxOption> filtered = _filtered;
    _panelFocus.requestFocus();
    _portal.show();
    setState(() {
      _open = true;
      _highlighted = filtered.isEmpty ? null : filtered.first.value;
    });
  }

  void _closePanel() {
    if (!_open) return;
    _portal.hide();
    _panelFocus.unfocus();
    _query.clear();
    setState(() {
      _open = false;
      _highlighted = null;
    });
  }

  void _toggle() {
    if (_open) {
      _closePanel();
    } else {
      _openPanel();
    }
  }

  void _pick(HoronComboboxOption option) {
    if (!option.enabled) return;
    final Set<String> next = widget.multiple ? Set<String>.of(widget.selected) : <String>{};
    if (widget.multiple && next.remove(option.value)) {
      // 이미 있던 값을 다시 누르면 빠집니다. base-ui의 다중 선택과 같은 동작입니다.
    } else {
      next.add(option.value);
    }
    widget.onSelectionChanged?.call(next);
    if (widget.multiple) {
      // 다중 선택은 목록을 열어 둔 채 입력만 비웁니다.
      _query.clear();
      _highlighted = null;
      _panelFocus.requestFocus();
      setState(() {});
    } else {
      _closePanel();
    }
  }

  void _remove(String value) {
    final Set<String> next = Set<String>.of(widget.selected)..remove(value);
    widget.onSelectionChanged?.call(next);
  }

  void _moveHighlight(int delta) {
    final List<HoronComboboxOption> visible = <HoronComboboxOption>[
      for (final HoronComboboxOption option in _filtered)
        if (option.enabled) option,
    ];
    if (visible.isEmpty) return;
    final int current = visible.indexWhere((HoronComboboxOption option) => option.value == _highlighted);
    setState(() {
      _highlighted = current < 0 ? visible.first.value : visible[(current + delta) % visible.length].value;
    });
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    switch (event.logicalKey) {
      case LogicalKeyboardKey.escape:
        _closePanel();
        return KeyEventResult.handled;
      case LogicalKeyboardKey.arrowDown:
        _moveHighlight(1);
        return KeyEventResult.handled;
      case LogicalKeyboardKey.arrowUp:
        _moveHighlight(-1);
        return KeyEventResult.handled;
      case LogicalKeyboardKey.enter:
        final String? highlighted = _highlighted;
        if (highlighted == null) return KeyEventResult.ignored;
        for (final HoronComboboxOption option in _filtered) {
          if (option.value == highlighted) {
            _pick(option);
            return KeyEventResult.handled;
          }
        }
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final List<HoronComboboxOption> filtered = _filtered;

    return OverlayPortal(
      controller: _portal,
      overlayChildBuilder: (BuildContext overlayContext) => _buildOverlay(filtered),
      child: CompositedTransformTarget(
        key: _anchorKey,
        link: _link,
        child: HoronComboboxInput(
          controller: _query,
          focusNode: _inputFocus,
          focused: _focused,
          multiple: widget.multiple,
          selected: widget.selected,
          options: widget.options,
          placeholder: widget.placeholder,
          invalid: widget.invalid,
          enabled: widget.enabled,
          semanticLabel: widget.semanticLabel,
          chipRemoveLabel: widget.chipRemoveLabel,
          onToggle: widget.enabled ? _toggle : null,
          onQueryChanged: (String _) {
            if (!widget.enabled) return;
            final List<HoronComboboxOption> next = _filtered;
            setState(() => _highlighted = next.isEmpty ? null : next.first.value);
            if (!_open) _openPanel();
          },
          onRemove: widget.enabled ? _remove : null,
        ),
      ),
    );
  }

  Widget _buildOverlay(List<HoronComboboxOption> filtered) {
    final MediaQueryData media = MediaQuery.of(context);
    final _HoronComboboxPlacement placement = _placeContent(
      anchor: _anchorRect ?? Rect.zero,
      screen: media.size,
      safeArea: media.padding,
    );

    return Stack(
      children: <Widget>[
        Positioned.fill(
          child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: _closePanel, child: const SizedBox.expand()),
        ),
        CompositedTransformFollower(
          link: _link,
          showWhenUnlinked: false,
          targetAnchor: placement.targetAnchor,
          followerAnchor: placement.followerAnchor,
          offset: placement.offset,
          child: Focus(
            focusNode: _panelFocus,
            onKeyEvent: _handleKey,
            child: ConstrainedBox(
              constraints: BoxConstraints(maxHeight: placement.maxHeight),
              child: SizedBox(
                width: placement.width,
                child: HoronComboboxList(
                  options: filtered,
                  selected: widget.selected,
                  highlighted: _highlighted,
                  emptyLabel: widget.emptyLabel,
                  onPick: _pick,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// `combobox.tsx`의 `ComboboxInput`입니다. 입력 줄과 칩 줄입니다.
///
/// React는 단일 선택에서 입력 하나, 다중 선택에서 `ComboboxChips`를 씁니다. 여기서는
/// [multiple]이 참이고 고른 값이 있으면 같은 표면 안에 [HoronComboboxChips]를 먼저
/// 놓고 그 아래에 입력을 둡니다.
class HoronComboboxInput extends StatefulWidget {
  /// 입력 줄을 만듭니다.
  const HoronComboboxInput({
    super.key,
    required this.controller,
    this.focusNode,
    this.focused = false,
    this.multiple = false,
    this.selected = const <String>{},
    this.options = const <HoronComboboxOption>[],
    this.placeholder,
    this.invalid = false,
    this.enabled = true,
    this.semanticLabel,
    this.chipRemoveLabel,
    this.onToggle,
    this.onQueryChanged,
    this.onRemove,
  });

  /// 입력 글자를 읽고 쓰는 컨트롤러입니다.
  final TextEditingController controller;

  /// 입력의 포커스 노드입니다.
  final FocusNode? focusNode;

  /// 입력이 포커스를 받았는지 여부입니다. 테두리 색을 정합니다.
  final bool focused;

  /// 여러 값을 고르는 모드인지 여부입니다.
  final bool multiple;

  /// 지금 선택된 값들입니다.
  final Set<String> selected;

  /// 값에서 글자로 가는 표를 만드는 데 쓰는 항목 목록입니다.
  final List<HoronComboboxOption> options;

  /// 값이 없을 때 보이는 안내 문구입니다.
  final String? placeholder;

  /// 오류 상태입니다.
  final bool invalid;

  /// 입력을 받는 상태인지 여부입니다.
  final bool enabled;

  /// 입력의 접근성 이름입니다.
  final String? semanticLabel;

  /// 칩의 제거 버튼 접근성 이름입니다.
  final String? chipRemoveLabel;

  /// 오른쪽 셰브론 버튼을 눌렀을 때 부릅니다.
  final VoidCallback? onToggle;

  /// 입력 글자가 바뀔 때 부릅니다.
  final ValueChanged<String>? onQueryChanged;

  /// 칩 하나를 지웠을 때 그 값을 받습니다.
  final ValueChanged<String>? onRemove;

  @override
  State<HoronComboboxInput> createState() => _HoronComboboxInputState();
}

class _HoronComboboxInputState extends State<HoronComboboxInput> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;

    // "flex min-h-[37px] w-full items-center gap-1.5 rounded-sm border border-input
    //  bg-card px-3 focus-within:border-ring focus-within:ring-3 ring-ring/50"
    final Color borderColor = widget.invalid
        ? (isDark ? scheme.error.withValues(alpha: _invalidBorderAlphaDark) : scheme.error)
        : (widget.focused ? horon.ring : scheme.outline);
    final Color? ring = widget.invalid
        ? scheme.error.withValues(alpha: isDark ? _invalidRingAlphaDark : _invalidRingAlpha)
        : (widget.focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null);

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _fontSize,
      height: HoronLineHeight.none,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    final List<String> chips = widget.multiple ? widget.selected.toList(growable: false) : const <String>[];
    final Map<String, String> labels = <String, String>{
      for (final HoronComboboxOption option in widget.options) option.value: option.label,
    };
    final bool hasChips = chips.isNotEmpty;

    final Widget field = TextField(
      controller: widget.controller,
      focusNode: widget.focusNode,
      enabled: widget.enabled,
      onChanged: widget.onQueryChanged,
      cursorColor: horon.ring,
      style: textStyle,
      decoration: InputDecoration(
        filled: false,
        isDense: true,
        isCollapsed: true,
        hintText: hasChips ? null : widget.placeholder,
        hintStyle: textStyle.copyWith(color: scheme.onSurfaceVariant),
        contentPadding: EdgeInsets.zero,
        border: InputBorder.none,
        enabledBorder: InputBorder.none,
        focusedBorder: InputBorder.none,
        disabledBorder: InputBorder.none,
        errorBorder: InputBorder.none,
        focusedErrorBorder: InputBorder.none,
      ),
    );

    return Semantics(
      textField: true,
      enabled: widget.enabled,
      label: widget.semanticLabel,
      child: Opacity(
        opacity: widget.enabled ? 1 : _disabledOpacity,
        child: Container(
          constraints: const BoxConstraints(minHeight: _fieldMinHeight),
          padding: EdgeInsetsDirectional.only(
            start: hasChips ? HoronSpace.s2_5 : HoronSpace.s3,
            end: HoronSpace.s1,
            top: hasChips ? HoronSpace.s1_5 : HoronSpace.s0,
            bottom: hasChips ? HoronSpace.s1_5 : HoronSpace.s0,
          ),
          decoration: BoxDecoration(
            color: scheme.surfaceContainerLowest,
            borderRadius: BorderRadius.circular(HoronRadiusRole.input),
            border: Border.all(color: borderColor),
            boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _ringWidth)],
          ),
          child: Row(
            crossAxisAlignment: hasChips ? CrossAxisAlignment.start : CrossAxisAlignment.center,
            children: <Widget>[
              Expanded(
                child: hasChips
                    ? Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          HoronComboboxChips(
                            values: chips,
                            labels: labels,
                            removeLabel: widget.chipRemoveLabel,
                            onRemove: widget.enabled ? widget.onRemove : null,
                          ),
                          const SizedBox(height: HoronSpace.s1_5),
                          field,
                        ],
                      )
                    : field,
              ),
              const SizedBox(width: HoronSpace.s1_5),
              Padding(
                padding: EdgeInsetsDirectional.only(top: hasChips ? HoronSpace.s1 : HoronSpace.s0),
                child: MouseRegion(
                  cursor: widget.enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
                  onEnter: (_) => setState(() => _hovered = true),
                  onExit: (_) => setState(() => _hovered = false),
                  child: GestureDetector(
                    key: HoronCombobox.toggleKey,
                    behavior: HitTestBehavior.opaque,
                    onTap: widget.onToggle,
                    child: SizedBox.square(
                      dimension: _toggleSize,
                      child: Center(
                        child: CustomPaint(
                          size: const Size.square(_iconSize),
                          painter: HoronChevronPainter(
                            color: _hovered && widget.enabled ? scheme.onSurface : scheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// `combobox.tsx`의 `ComboboxChips`입니다. 고른 값들을 칩으로 늘어놓습니다.
class HoronComboboxChips extends StatelessWidget {
  /// 칩 줄을 만듭니다.
  const HoronComboboxChips({
    super.key,
    required this.values,
    this.labels = const <String, String>{},
    this.removeLabel,
    this.onRemove,
  });

  /// 칩으로 그릴 값들입니다.
  final List<String> values;

  /// 값에서 글자로 가는 표입니다.
  final Map<String, String> labels;

  /// 제거 버튼의 접근성 이름입니다.
  final String? removeLabel;

  /// 제거 버튼을 눌렀을 때 그 값을 받습니다. null이면 제거 버튼이 없습니다.
  final ValueChanged<String>? onRemove;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: HoronSpace.s1_5,
      runSpacing: HoronSpace.s1_5,
      children: <Widget>[
        for (final String value in values)
          HoronComboboxChip(
            value: value,
            label: labels[value] ?? value,
            removeLabel: removeLabel,
            onRemove: onRemove == null ? null : () => onRemove!(value),
          ),
      ],
    );
  }
}

/// `combobox.tsx`의 `ComboboxChip`입니다.
///
/// Material `Chip`을 쓰지 않고 todo 8의 [HoronChip]으로 그립니다. React의
/// `bg-secondary text-[11px] font-semibold rounded-full`과 같은 모양입니다.
class HoronComboboxChip extends StatelessWidget {
  /// 칩 하나를 만듭니다.
  const HoronComboboxChip({super.key, required this.value, required this.label, this.removeLabel, this.onRemove});

  /// 이 칩이 나타내는 값입니다.
  final String value;

  /// 칩에 보이는 글자입니다.
  final String label;

  /// 제거 버튼의 접근성 이름입니다.
  final String? removeLabel;

  /// 제거 버튼을 눌렀을 때 부릅니다. null이면 제거 버튼이 없습니다.
  final VoidCallback? onRemove;

  @override
  Widget build(BuildContext context) {
    return HoronChip(
      key: ValueKey<String>('horon-combobox-chip-$value'),
      label: label,
      variant: HoronChipVariant.secondary,
      onRemove: onRemove,
      removeLabel: removeLabel,
    );
  }
}

/// `combobox.tsx`의 `ComboboxList`입니다. `.glass-strong` 팝업 패널입니다.
class HoronComboboxList extends StatelessWidget {
  /// 팝업 패널을 만듭니다.
  const HoronComboboxList({
    super.key,
    required this.options,
    this.selected = const <String>{},
    this.highlighted,
    this.emptyLabel,
    this.onPick,
  });

  /// 패널에 그릴 항목입니다. 이미 걸러진 목록을 받습니다.
  final List<HoronComboboxOption> options;

  /// 지금 선택된 값들입니다.
  final Set<String> selected;

  /// 키보드로 강조된 값입니다.
  final String? highlighted;

  /// 항목이 없을 때 보이는 문구입니다.
  final String? emptyLabel;

  /// 항목을 눌렀을 때 부릅니다.
  final ValueChanged<HoronComboboxOption>? onPick;

  @override
  Widget build(BuildContext context) {
    return KeyedSubtree(
      key: HoronCombobox.contentKey,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
        child: HoronGlassSurface.strong(
          padding: EdgeInsets.zero,
          borderRadius: BorderRadius.circular(HoronRadiusRole.card),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(HoronSpace.s1),
            child: options.isEmpty
                ? HoronComboboxEmpty(label: emptyLabel)
                : Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      for (final HoronComboboxOption option in options)
                        HoronComboboxItem(
                          option: option,
                          selected: selected.contains(option.value),
                          highlighted: highlighted == option.value,
                          onTap: onPick == null ? null : () => onPick!(option),
                        ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}

/// `combobox.tsx`의 `ComboboxItem`입니다. 선택된 항목에 체크 표시가 붙습니다.
class HoronComboboxItem extends StatefulWidget {
  /// 항목 하나를 만듭니다.
  const HoronComboboxItem({
    super.key,
    required this.option,
    this.selected = false,
    this.highlighted = false,
    this.onTap,
  });

  /// 이 항목의 데이터입니다.
  final HoronComboboxOption option;

  /// 선택된 항목인지 여부입니다.
  final bool selected;

  /// 키보드로 강조된 항목인지 여부입니다.
  final bool highlighted;

  /// 눌렀을 때 부릅니다.
  final VoidCallback? onTap;

  @override
  State<HoronComboboxItem> createState() => _HoronComboboxItemState();
}

class _HoronComboboxItemState extends State<HoronComboboxItem> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool enabled = widget.option.enabled;
    final bool active = enabled && (_hovered || widget.highlighted);

    // "rounded-md py-1.5 pr-8 pl-2 text-sm data-highlighted:bg-accent"
    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _fontSize,
      height: HoronLineHeight.none,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return Semantics(
      button: true,
      selected: widget.selected,
      enabled: enabled,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: enabled ? widget.onTap : null,
          child: Opacity(
            opacity: enabled ? 1 : _disabledOpacity,
            child: Stack(
              alignment: Alignment.centerRight,
              children: <Widget>[
                Container(
                  constraints: const BoxConstraints(minHeight: _itemHeight),
                  padding: const EdgeInsetsDirectional.only(
                    start: _itemPaddingStart,
                    end: _itemPaddingEnd,
                    top: _itemPaddingVertical,
                    bottom: _itemPaddingVertical,
                  ),
                  decoration: BoxDecoration(
                    color: active ? scheme.surfaceContainerHighest : Colors.transparent,
                    borderRadius: BorderRadius.circular(HoronRadius.md),
                  ),
                  child: Row(
                    children: <Widget>[
                      Expanded(
                        child: Text(
                          widget.option.label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          softWrap: false,
                          style: textStyle,
                        ),
                      ),
                    ],
                  ),
                ),
                if (widget.selected)
                  Padding(
                    padding: const EdgeInsetsDirectional.only(end: _checkInset),
                    child: CustomPaint(
                      size: const Size.square(_iconSize),
                      painter: HoronCheckMarkPainter(
                        color: scheme.onSurface,
                        indeterminate: false,
                        strokeWidth: _checkStrokeWidth,
                      ),
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

/// `combobox.tsx`의 `ComboboxEmpty`입니다.
///
/// React는 `hidden … group-data-empty/combobox-content:flex`로 목록이 비었을 때만
/// 보입니다. 여기서는 목록이 빈 경우에만 이 위젯을 그립니다.
class HoronComboboxEmpty extends StatelessWidget {
  /// 빈 상태를 만듭니다.
  const HoronComboboxEmpty({super.key, this.label});

  /// 보여 줄 문구입니다. 없으면 `strings.noResults`입니다.
  final String? label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    return Semantics(
      liveRegion: true,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s2, vertical: HoronSpace.s6),
        child: Text(
          label ?? horon.strings.noResults,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _emptyFontSize,
            height: HoronLineHeight.normal,
            color: scheme.onSurfaceVariant,
            decoration: TextDecoration.none,
          ),
        ),
      ),
    );
  }
}
