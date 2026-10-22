import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'glass_surface.dart';
import 'select.dart';

/// `autocomplete.tsx` 입력의 높이 `h-[37px]`입니다.
const double _fieldHeight = 37;

/// `autocomplete.tsx` 목록의 `min-w-36`입니다.
const double _contentMinWidth = 144;

/// 목록과 입력 사이의 `sideOffset` 기본값 4입니다.
const double _contentGap = HoronSpace.s1;

/// 목록이 화면 가장자리에서 비워 두는 여백입니다.
const double _screenMargin = HoronSpace.s2;

/// 목록의 높이 상한입니다. React는 `max-h-(--available-height)`를 씁니다.
const double _contentPreferredMaxHeight = 320;

/// 후보 한 줄의 최소 높이입니다. React `py-1.5`와 14px 글자가 만드는 30입니다.
const double _itemHeight = 30;

/// 후보의 좌우 여백 `px-2`입니다.
const double _itemPadding = HoronSpace.s2;

/// 후보의 세로 여백 `py-1.5`입니다.
const double _itemPaddingVertical = HoronSpace.s1_5;

/// 펼침 버튼 `size-5`입니다.
const double _toggleSize = HoronSpace.s5;

/// 셰브론 `size-4`입니다.
const double _iconSize = HoronSpace.s4;

/// 입력·후보 글자 크기 `text-sm`입니다.
const double _fontSize = HoronText.body;

/// 설명·빈 상태 문구 크기 `text-xs`입니다.
const double _smallFontSize = HoronText.caption;

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

/// 비활성 불투명도입니다. React `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// 입력 중에 제안할 후보 하나입니다.
///
/// React `autocomplete.tsx`에서 `<Autocomplete.Item value="…">글자</Autocomplete.Item>`
/// 으로 쓰는 자리의 데이터입니다. 값을 고르면 그 글자가 입력에 들어가고
/// [HoronAutocomplete.onSelected]가 불립니다.
class HoronAutocompleteSuggestion {
  /// 후보 하나를 만듭니다.
  const HoronAutocompleteSuggestion({required this.value, this.label, this.description, this.enabled = true});

  /// 입력에 들어갈 값입니다.
  final String value;

  /// 목록에 보이는 글자입니다. 없으면 [value]입니다.
  final String? label;

  /// 글자 아래에 붙는 짧은 설명입니다.
  final String? description;

  /// 고를 수 있는 상태인지 여부입니다.
  final bool enabled;
}

/// 목록을 어느 쪽에 놓을지 정한 결과입니다.
///
/// todo 18이 공용 위치 유틸(`lib/src/overlay/horon_overlay.dart`)을 만들면 이 계산은
/// 그쪽으로 옮깁니다. 지금은 이 파일이 자기 팝업만 놓습니다.
class _HoronAutocompletePlacement {
  const _HoronAutocompletePlacement({
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
_HoronAutocompletePlacement _placeContent({required Rect anchor, required Size screen, required EdgeInsets safeArea}) {
  final double spaceBelow = screen.height - anchor.bottom - _contentGap - _screenMargin - safeArea.bottom;
  final double spaceAbove = anchor.top - _contentGap - _screenMargin - safeArea.top;
  final bool flip = spaceBelow < _contentPreferredMaxHeight && spaceAbove > spaceBelow;
  final double available = math.max(flip ? spaceAbove : spaceBelow, _itemHeight);

  final double width = math.max(anchor.width, _contentMinWidth);
  final double minLeft = _screenMargin + safeArea.left;
  final double maxLeft = math.max(minLeft, screen.width - _screenMargin - safeArea.right - width);
  final double left = (anchor.center.dx - width / 2).clamp(minLeft, maxLeft);

  return _HoronAutocompletePlacement(
    targetAnchor: flip ? Alignment.topLeft : Alignment.bottomLeft,
    followerAnchor: flip ? Alignment.bottomLeft : Alignment.topLeft,
    offset: Offset(left - anchor.left, flip ? -_contentGap : _contentGap),
    maxHeight: math.min(available, _contentPreferredMaxHeight),
    width: width,
  );
}

/// 입력하는 동안 후보를 제안하는 자동 완성 필드입니다.
///
/// `autocomplete.tsx`를 옮긴 것입니다. 글자를 넣으면 목록이 그 글자를 품은 후보만
/// 남고, 후보를 고르면 그 값이 입력에 들어갑니다. **키보드 없이도 동작합니다.**
/// 오른쪽 펼침 버튼을 누르면 지금 글자로 거른 목록이 열리고 닫힙니다. 후보가 하나도
/// 없으면 빈 상태 문구를 그립니다.
///
/// 목록은 `.glass-strong` 패널이고 아래에 자리가 없으면 입력 위로 뒤집힙니다.
///
/// ```dart
/// HoronAutocomplete(
///   suggestions: const <HoronAutocompleteSuggestion>[
///     HoronAutocompleteSuggestion(value: 'Seoul'),
///     HoronAutocompleteSuggestion(value: 'Seattle'),
///   ],
///   placeholder: '도시 검색',
///   onSelected: (String city) => setCity(city),
/// );
/// ```
class HoronAutocomplete extends StatefulWidget {
  /// 자동 완성 필드를 만듭니다.
  const HoronAutocomplete({
    super.key,
    required this.suggestions,
    this.controller,
    this.focusNode,
    this.placeholder,
    this.emptyLabel,
    this.invalid = false,
    this.enabled = true,
    this.onSelected,
    this.onChanged,
    this.semanticLabel,
  });

  /// 목록 패널을 찾는 키입니다. React의 `data-slot="autocomplete-content"` 자리입니다.
  static const Key contentKey = ValueKey<String>('horon-autocomplete-content');

  /// 오른쪽 펼침 버튼을 찾는 키입니다. 키보드 없이 목록을 여는 길입니다.
  static const Key toggleKey = ValueKey<String>('horon-autocomplete-toggle');

  /// 제안할 후보입니다.
  final List<HoronAutocompleteSuggestion> suggestions;

  /// 입력 글자를 읽고 쓰는 컨트롤러입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final TextEditingController? controller;

  /// 입력의 포커스 노드입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final FocusNode? focusNode;

  /// 입력이 비었을 때 보이는 안내 문구입니다.
  final String? placeholder;

  /// 후보가 하나도 없을 때 보이는 문구입니다. 없으면 `strings.noResults`입니다.
  final String? emptyLabel;

  /// 오류 상태입니다. React의 `aria-invalid`에 대응합니다.
  final bool invalid;

  /// 입력과 목록을 받는 상태인지 여부입니다.
  final bool enabled;

  /// 후보를 골랐을 때 그 값을 받습니다.
  final ValueChanged<String>? onSelected;

  /// 입력 글자가 바뀔 때 부릅니다.
  final ValueChanged<String>? onChanged;

  /// 입력의 접근성 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronAutocomplete> createState() => _HoronAutocompleteState();
}

class _HoronAutocompleteState extends State<HoronAutocomplete> {
  final OverlayPortalController _portal = OverlayPortalController();
  final LayerLink _link = LayerLink();
  final GlobalKey _anchorKey = GlobalKey();
  final FocusNode _panelFocus = FocusNode(debugLabel: 'HoronAutocompletePanel');

  TextEditingController? _ownedController;
  FocusNode? _ownedFocusNode;
  bool _open = false;
  bool _focused = false;
  Rect? _anchorRect;
  String? _highlighted;

  TextEditingController get _controller => widget.controller ?? (_ownedController ??= TextEditingController());

  FocusNode get _focusNode => widget.focusNode ?? (_ownedFocusNode ??= FocusNode(debugLabel: 'HoronAutocomplete'));

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _ownedFocusNode?.dispose();
    _ownedController?.dispose();
    _panelFocus.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (!mounted) return;
    final bool focused = _focusNode.hasFocus;
    setState(() => _focused = focused);
    if (focused && widget.enabled && !_open) _openPanel();
  }

  /// 입력 글자로 거른 후보입니다.
  List<HoronAutocompleteSuggestion> get _filtered {
    final String query = _controller.text.trim().toLowerCase();
    if (query.isEmpty) return widget.suggestions;
    return <HoronAutocompleteSuggestion>[
      for (final HoronAutocompleteSuggestion suggestion in widget.suggestions)
        if (_labelOf(suggestion).toLowerCase().contains(query) || suggestion.value.toLowerCase().contains(query))
          suggestion,
    ];
  }

  String _labelOf(HoronAutocompleteSuggestion suggestion) => suggestion.label ?? suggestion.value;

  void _measureAnchor() {
    final RenderObject? anchorObject = _anchorKey.currentContext?.findRenderObject();
    if (anchorObject is! RenderBox || !anchorObject.hasSize) return;
    _anchorRect = anchorObject.localToGlobal(Offset.zero) & anchorObject.size;
  }

  void _openPanel() {
    if (!widget.enabled || _open) return;
    _measureAnchor();
    final List<HoronAutocompleteSuggestion> filtered = _filtered;
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
    setState(() {
      _open = false;
      _highlighted = null;
    });
  }

  void _toggle() {
    if (_open) {
      _closePanel();
      _focusNode.unfocus();
    } else {
      _focusNode.requestFocus();
      _openPanel();
    }
  }

  void _pick(HoronAutocompleteSuggestion suggestion) {
    if (!suggestion.enabled) return;
    _controller.text = suggestion.value;
    _controller.selection = TextSelection.collapsed(offset: suggestion.value.length);
    widget.onChanged?.call(suggestion.value);
    widget.onSelected?.call(suggestion.value);
    _closePanel();
  }

  void _moveHighlight(int delta) {
    final List<HoronAutocompleteSuggestion> visible = <HoronAutocompleteSuggestion>[
      for (final HoronAutocompleteSuggestion suggestion in _filtered)
        if (suggestion.enabled) suggestion,
    ];
    if (visible.isEmpty) return;
    final int current = visible.indexWhere(
      (HoronAutocompleteSuggestion suggestion) => suggestion.value == _highlighted,
    );
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
        for (final HoronAutocompleteSuggestion suggestion in _filtered) {
          if (suggestion.value == highlighted) {
            _pick(suggestion);
            return KeyEventResult.handled;
          }
        }
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final List<HoronAutocompleteSuggestion> filtered = _filtered;

    return OverlayPortal(
      controller: _portal,
      overlayChildBuilder: (BuildContext overlayContext) => _buildOverlay(filtered),
      child: CompositedTransformTarget(
        key: _anchorKey,
        link: _link,
        child: HoronAutocompleteInput(
          controller: _controller,
          focusNode: _focusNode,
          focused: _focused,
          placeholder: widget.placeholder,
          invalid: widget.invalid,
          enabled: widget.enabled,
          open: _open,
          semanticLabel: widget.semanticLabel,
          onToggle: widget.enabled ? _toggle : null,
          onChanged: (String value) {
            widget.onChanged?.call(value);
            if (!widget.enabled) return;
            final List<HoronAutocompleteSuggestion> next = _filtered;
            setState(() => _highlighted = next.isEmpty ? null : next.first.value);
            if (!_open) _openPanel();
          },
        ),
      ),
    );
  }

  Widget _buildOverlay(List<HoronAutocompleteSuggestion> filtered) {
    final MediaQueryData media = MediaQuery.of(context);
    final _HoronAutocompletePlacement placement = _placeContent(
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
                child: HoronAutocompleteList(
                  suggestions: filtered,
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

/// `autocomplete.tsx`의 `AutocompleteInput`입니다.
class HoronAutocompleteInput extends StatefulWidget {
  /// 입력 필드를 만듭니다.
  const HoronAutocompleteInput({
    super.key,
    required this.controller,
    this.focusNode,
    this.focused = false,
    this.placeholder,
    this.invalid = false,
    this.enabled = true,
    this.open = false,
    this.semanticLabel,
    this.onToggle,
    this.onChanged,
  });

  /// 입력 글자를 읽고 쓰는 컨트롤러입니다.
  final TextEditingController controller;

  /// 입력의 포커스 노드입니다.
  final FocusNode? focusNode;

  /// 입력이 포커스를 받았는지 여부입니다. 테두리 색을 정합니다.
  final bool focused;

  /// 입력이 비었을 때 보이는 안내 문구입니다.
  final String? placeholder;

  /// 오류 상태입니다.
  final bool invalid;

  /// 입력을 받는 상태인지 여부입니다.
  final bool enabled;

  /// 목록이 열려 있는지 여부입니다. 열려 있으면 셰브론이 위를 향합니다.
  final bool open;

  /// 입력의 접근성 이름입니다.
  final String? semanticLabel;

  /// 오른쪽 펼침 버튼을 눌렀을 때 부릅니다.
  final VoidCallback? onToggle;

  /// 입력 글자가 바뀔 때 부릅니다.
  final ValueChanged<String>? onChanged;

  @override
  State<HoronAutocompleteInput> createState() => _HoronAutocompleteInputState();
}

class _HoronAutocompleteInputState extends State<HoronAutocompleteInput> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;

    // "h-[37px] w-full rounded-sm border border-input bg-card px-3 py-1 text-sm
    //  focus-visible:border-ring focus-visible:ring-3 ring-ring/50"
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

    return Semantics(
      textField: true,
      enabled: widget.enabled,
      label: widget.semanticLabel,
      child: Opacity(
        opacity: widget.enabled ? 1 : _disabledOpacity,
        child: SizedBox(
          height: _fieldHeight,
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: scheme.surfaceContainerLowest,
              borderRadius: BorderRadius.circular(HoronRadiusRole.input),
              border: Border.all(color: borderColor),
              boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _ringWidth)],
            ),
            child: Row(
              children: <Widget>[
                Expanded(
                  child: Padding(
                    padding: const EdgeInsetsDirectional.only(start: HoronSpace.s3),
                    child: TextField(
                      controller: widget.controller,
                      focusNode: widget.focusNode,
                      enabled: widget.enabled,
                      onChanged: widget.onChanged,
                      cursorColor: horon.ring,
                      style: textStyle,
                      decoration: InputDecoration(
                        filled: false,
                        isDense: true,
                        isCollapsed: true,
                        hintText: widget.placeholder,
                        hintStyle: textStyle.copyWith(color: scheme.onSurfaceVariant),
                        contentPadding: EdgeInsets.zero,
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        focusedErrorBorder: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsetsDirectional.only(end: HoronSpace.s1_5),
                  child: MouseRegion(
                    cursor: widget.enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
                    onEnter: (_) => setState(() => _hovered = true),
                    onExit: (_) => setState(() => _hovered = false),
                    child: GestureDetector(
                      key: HoronAutocomplete.toggleKey,
                      behavior: HitTestBehavior.opaque,
                      onTap: widget.onToggle,
                      child: SizedBox.square(
                        dimension: _toggleSize,
                        child: Center(
                          child: CustomPaint(
                            size: const Size.square(_iconSize),
                            painter: HoronChevronPainter(
                              color: _hovered && widget.enabled ? scheme.onSurface : scheme.onSurfaceVariant,
                              pointsUp: widget.open,
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
      ),
    );
  }
}

/// `autocomplete.tsx`의 `AutocompleteList`입니다. `.glass-strong` 팝업 패널입니다.
class HoronAutocompleteList extends StatelessWidget {
  /// 팝업 패널을 만듭니다.
  const HoronAutocompleteList({super.key, required this.suggestions, this.highlighted, this.emptyLabel, this.onPick});

  /// 패널에 그릴 후보입니다. 이미 걸러진 목록을 받습니다.
  final List<HoronAutocompleteSuggestion> suggestions;

  /// 키보드로 강조된 값입니다.
  final String? highlighted;

  /// 후보가 없을 때 보이는 문구입니다.
  final String? emptyLabel;

  /// 후보를 눌렀을 때 부릅니다.
  final ValueChanged<HoronAutocompleteSuggestion>? onPick;

  @override
  Widget build(BuildContext context) {
    return KeyedSubtree(
      key: HoronAutocomplete.contentKey,
      child: ClipRRect(
        // `BackdropFilter`는 자신을 자르는 clip이 없으면 뒤 화면 전체를 흐립니다.
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
        child: HoronGlassSurface.strong(
          padding: EdgeInsets.zero,
          borderRadius: BorderRadius.circular(HoronRadiusRole.card),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(HoronSpace.s1),
            child: suggestions.isEmpty
                ? HoronAutocompleteEmpty(label: emptyLabel)
                : Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      for (final HoronAutocompleteSuggestion suggestion in suggestions)
                        HoronAutocompleteItem(
                          suggestion: suggestion,
                          highlighted: highlighted == suggestion.value,
                          onTap: onPick == null ? null : () => onPick!(suggestion),
                        ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}

/// `autocomplete.tsx`의 `AutocompleteItem`입니다.
class HoronAutocompleteItem extends StatefulWidget {
  /// 후보 한 줄을 만듭니다.
  const HoronAutocompleteItem({super.key, required this.suggestion, this.highlighted = false, this.onTap});

  /// 이 줄의 후보입니다.
  final HoronAutocompleteSuggestion suggestion;

  /// 키보드로 강조된 줄인지 여부입니다.
  final bool highlighted;

  /// 눌렀을 때 부릅니다.
  final VoidCallback? onTap;

  @override
  State<HoronAutocompleteItem> createState() => _HoronAutocompleteItemState();
}

class _HoronAutocompleteItemState extends State<HoronAutocompleteItem> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool enabled = widget.suggestion.enabled;
    final bool active = enabled && (_hovered || widget.highlighted);

    // "rounded-md px-2 py-1.5 text-sm data-highlighted:bg-accent"
    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _fontSize,
      height: HoronLineHeight.none,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );
    final String? description = widget.suggestion.description;

    return Semantics(
      button: true,
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
            child: Container(
              constraints: const BoxConstraints(minHeight: _itemHeight),
              padding: const EdgeInsetsDirectional.only(
                start: _itemPadding,
                end: _itemPadding,
                top: _itemPaddingVertical,
                bottom: _itemPaddingVertical,
              ),
              decoration: BoxDecoration(
                color: active ? scheme.surfaceContainerHighest : Colors.transparent,
                borderRadius: BorderRadius.circular(HoronRadius.md),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    widget.suggestion.label ?? widget.suggestion.value,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    softWrap: false,
                    style: textStyle,
                  ),
                  if (description != null) ...<Widget>[
                    const SizedBox(height: HoronSpace.s0_5),
                    Text(
                      description,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: textStyle.copyWith(fontSize: _smallFontSize, color: scheme.onSurfaceVariant),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `autocomplete.tsx`의 `AutocompleteEmpty`입니다.
class HoronAutocompleteEmpty extends StatelessWidget {
  /// 빈 상태를 만듭니다.
  const HoronAutocompleteEmpty({super.key, this.label});

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
            fontSize: _smallFontSize,
            height: HoronLineHeight.normal,
            color: scheme.onSurfaceVariant,
            decoration: TextDecoration.none,
          ),
        ),
      ),
    );
  }
}
