import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'checkbox.dart';
import 'glass_surface.dart';

/// `select.tsx` 트리거의 `size` 옵션입니다.
///
/// React는 이 값을 cva 변형이 아니라 트리거의 `size?: "sm" | "default"` prop으로
/// 받습니다. 이름은 React와 같게 두되, `default`는 Dart 예약어라 `defaultValue`로
/// 씁니다.
enum HoronSelectSize {
  /// `data-[size=default]:h-[37px]` - 높이 37입니다.
  defaultValue,

  /// `data-[size=sm]:h-7` - 높이 28이고 반경이 10입니다.
  sm,
}

/// `select.tsx` 트리거의 높이 `h-[37px]`입니다.
const double _triggerHeight = 37;

/// `select.tsx` 트리거의 좌우 여백 `px-3`입니다.
const double _triggerPadding = HoronSpace.s3;

/// `select.tsx` 트리거의 `gap-1.5`입니다.
const double _triggerGap = HoronSpace.s1_5;

/// `select.tsx`의 `size-4`(셰브론·체크 표시·항목 아이콘)입니다.
const double _iconSize = HoronSpace.s4;

/// `select.tsx` 항목의 `py-1`과 `text-sm`이 만드는 높이입니다. 20 + 4 + 4입니다.
const double _itemHeight = 28;

/// `select.tsx` 항목의 `pl-1.5`입니다.
const double _itemPaddingStart = HoronSpace.s1_5;

/// `select.tsx` 항목의 `pr-8`입니다. 체크 표시 자리를 비워 둡니다.
const double _itemPaddingEnd = HoronSpace.s8;

/// `select.tsx` 항목의 `py-1`입니다.
const double _itemPaddingVertical = HoronSpace.s1;

/// `select.tsx` 항목 안 아이콘과 글자 사이의 `gap-1.5`입니다.
const double _itemGap = HoronSpace.s1_5;

/// `select.tsx` 체크 표시의 `right-2`입니다.
const double _checkInset = HoronSpace.s2;

/// 체크 표시의 선 두께입니다. lucide `Check`의 `stroke-width` 2를 16px 상자로
/// 옮긴 값입니다.
const double _checkStrokeWidth = 1.4;

/// `select.tsx` 그룹의 `p-1`입니다.
const double _groupPadding = HoronSpace.s1;

/// `select.tsx` 그룹 라벨의 `px-1.5`입니다.
const double _labelPadding = HoronSpace.s1_5;

/// `select.tsx` 그룹 라벨의 `text-xs`입니다.
const double _labelFontSize = HoronText.caption;

/// `select.tsx` 목록의 `min-w-36`입니다.
const double _contentMinWidth = 144;

/// 목록과 트리거 사이의 `sideOffset` 기본값 4입니다.
const double _contentGap = HoronSpace.s1;

/// 목록이 화면 가장자리에서 비워 두는 여백입니다.
const double _screenMargin = HoronSpace.s2;

/// 목록의 높이 상한입니다. React는 `max-h-(--available-height)`로 화면에 남은
/// 자리를 쓰고, 여기서는 그 자리와 이 값 중 작은 쪽을 씁니다.
const double _contentPreferredMaxHeight = 320;

/// `select.tsx` 구분선의 `my-1`입니다.
const double _separatorMargin = HoronSpace.s1;

/// 구분선 두께입니다. CSS `h-px`입니다.
const double _separatorThickness = 1;

/// 포커스 링 두께입니다. `focus-visible:ring-3`입니다.
const double _focusRingWidth = 3;

/// 포커스 링 투명도입니다. `ring-ring/50`입니다.
const double _focusRingAlpha = 0.5;

/// 오류 링 투명도입니다. `aria-invalid:ring-destructive/20`입니다.
const double _invalidRingAlpha = 0.2;

/// 다크의 오류 링 투명도입니다. `dark:aria-invalid:ring-destructive/40`입니다.
const double _invalidRingAlphaDark = 0.4;

/// 다크의 오류 테두리 투명도입니다. `dark:aria-invalid:border-destructive/50`입니다.
const double _invalidBorderAlphaDark = 0.5;

/// 비활성 불투명도입니다. `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// 다크에서 트리거에 마우스를 올렸을 때 채우는 `dark:hover:bg-input/50`의 배수입니다.
const double _darkHoverAlphaFactor = 0.5;

/// 목록이 나타날 때의 시작 배율입니다. React `data-open:zoom-in-95`입니다.
const double _contentStartScale = 0.95;

/// 셰브론을 그릴 때 쓰는 선 두께 비율입니다. lucide의 24 그리드에서
/// `stroke-width` 2입니다.
const double _iconStrokeRatio = 2 / 24;

/// 목록을 어느 쪽에 놓을지 정한 결과입니다.
///
/// todo 18이 공용 위치 유틸(`lib/src/overlay/horon_overlay.dart`)을 만들면 이 계산과
/// 아래 `_placeContent`는 그쪽으로 옮깁니다. 지금은 이 파일이 자기 팝업만 놓습니다.
class _HoronSelectPlacement {
  const _HoronSelectPlacement({
    required this.targetAnchor,
    required this.followerAnchor,
    required this.offset,
    required this.maxHeight,
    required this.width,
  });

  /// 트리거 쪽 기준점입니다.
  final Alignment targetAnchor;

  /// 목록 쪽 기준점입니다.
  final Alignment followerAnchor;

  /// 기준점을 맞춘 뒤 더 미는 거리입니다.
  final Offset offset;

  /// 목록이 쓸 수 있는 최대 높이입니다.
  final double maxHeight;

  /// 목록의 폭입니다. 트리거 폭과 최소 144 중 큰 쪽입니다.
  final double width;
}

/// 트리거 사각형을 보고 목록을 아래에 둘지 위로 뒤집을지 정합니다.
_HoronSelectPlacement _placeContent({required Rect anchor, required Size screen, required EdgeInsets safeArea}) {
  final double spaceBelow = screen.height - anchor.bottom - _contentGap - _screenMargin - safeArea.bottom;
  final double spaceAbove = anchor.top - _contentGap - _screenMargin - safeArea.top;
  final bool flip = spaceBelow < _contentPreferredMaxHeight && spaceAbove > spaceBelow;
  final double available = math.max(flip ? spaceAbove : spaceBelow, _itemHeight);

  // 목록은 트리거 폭을 따르되 최소 144입니다. 화면 밖으로 나가지 않게 가로 위치를
  // 밀어 넣습니다.
  final double width = math.max(anchor.width, _contentMinWidth);
  final double minLeft = _screenMargin + safeArea.left;
  final double maxLeft = math.max(minLeft, screen.width - _screenMargin - safeArea.right - width);
  final double left = (anchor.center.dx - width / 2).clamp(minLeft, maxLeft);

  return _HoronSelectPlacement(
    targetAnchor: flip ? Alignment.topLeft : Alignment.bottomLeft,
    followerAnchor: flip ? Alignment.bottomLeft : Alignment.topLeft,
    offset: Offset(left - anchor.left, flip ? -_contentGap : _contentGap),
    maxHeight: math.min(available, _contentPreferredMaxHeight),
    width: width,
  );
}

/// `select.tsx`의 루트·트리거·값·목록이 함께 쓰는 상태입니다.
///
/// React는 Base UI의 `Select.Root`가 값을 들고 자손이 그 값을 읽습니다. Flutter에는
/// 그 컨텍스트가 없으므로 이 [InheritedWidget]이 같은 역할을 합니다. 값을 `Object?`로
/// 나르는 이유는 조회하는 자손이 제네릭 인자를 알 필요가 없기 때문입니다. 값을
/// 고르는 쪽([onSelect])도 `Object?`를 받고 루트가 제 타입으로 되돌립니다.
class _HoronSelectScope extends InheritedWidget {
  const _HoronSelectScope({
    required this.value,
    required this.selectedLabel,
    required this.open,
    required this.enabled,
    required this.invalid,
    required this.link,
    required this.anchorKey,
    required this.highlighted,
    required this.onToggle,
    required this.onSelect,
    required super.child,
  });

  /// 지금 값입니다. 없으면 null입니다.
  final Object? value;

  /// 지금 값의 글자입니다. 없으면 null입니다.
  final String? selectedLabel;

  /// 목록이 열려 있는지 여부입니다.
  final bool open;

  /// 값을 고를 수 있는 상태인지 여부입니다.
  final bool enabled;

  /// 오류 상태입니다. React의 `aria-invalid`에 대응합니다.
  final bool invalid;

  /// 트리거와 목록을 잇는 레이어 링크입니다.
  final LayerLink link;

  /// 트리거의 자리입니다. 목록을 놓기 전에 이 사각형을 잽니다.
  final GlobalKey anchorKey;

  /// 키보드로 강조된 항목의 값입니다.
  final Object? highlighted;

  /// 목록을 열고 닫습니다.
  final VoidCallback onToggle;

  /// 항목 하나를 골랐을 때 부릅니다.
  final ValueChanged<Object?> onSelect;

  static _HoronSelectScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronSelectScope>();

  @override
  bool updateShouldNotify(_HoronSelectScope oldWidget) =>
      oldWidget.value != value ||
      oldWidget.selectedLabel != selectedLabel ||
      oldWidget.open != open ||
      oldWidget.enabled != enabled ||
      oldWidget.invalid != invalid ||
      oldWidget.highlighted != highlighted;
}

/// 값을 고르는 목록 상자입니다.
///
/// `select.tsx`를 옮긴 것입니다. [HoronSelectTrigger]가 지금 값을 보여 주고, 눌러서
/// 열린 [HoronSelectContent]에서 항목을 고르면 [onChanged]가 그 값을 받습니다. 목록은
/// `.glass-strong` 표면이고, 아래에 자리가 없으면 트리거 위로 뒤집힙니다.
///
/// React처럼 합성 위젯입니다. [children]에 트리거와 목록을 넣고, 목록은 루트가
/// 오버레이에 직접 놓습니다.
///
/// ```dart
/// HoronSelect<String>(
///   onChanged: (String city) => setCity(city),
///   children: <Widget>[
///     const HoronSelectTrigger(child: HoronSelectValue(placeholder: '도시')),
///     const HoronSelectContent(
///       children: <Widget>[
///         HoronSelectItem<String>(value: 'seoul', label: '서울'),
///         HoronSelectItem<String>(value: 'busan', label: '부산'),
///       ],
///     ),
///   ],
/// );
/// ```
///
/// [value]를 넘기면 제어 모드, 넘기지 않고 [initialValue]만 주면 이 위젯이 선택을
/// 기억합니다.
class HoronSelect<T> extends StatefulWidget {
  /// 목록 상자를 만듭니다.
  const HoronSelect({
    super.key,
    required this.children,
    this.value,
    this.initialValue,
    this.onChanged,
    this.enabled = true,
    this.invalid = false,
    this.semanticLabel,
  });

  /// 목록 패널을 찾는 키입니다. React의 `data-slot="select-content"` 자리입니다.
  static const Key contentKey = ValueKey<String>('horon-select-content');

  /// 선택된 항목의 체크 표시를 찾는 키입니다.
  static const Key checkKey = ValueKey<String>('horon-select-check');

  /// 트리거([HoronSelectTrigger])와 목록([HoronSelectContent])입니다.
  final List<Widget> children;

  /// 지금 값입니다. null이면 [initialValue]에서 시작해 이 위젯이 값을 소유합니다.
  final T? value;

  /// 제어 모드가 아닐 때의 처음 값입니다.
  final T? initialValue;

  /// 값이 바뀔 때 부릅니다.
  final ValueChanged<T>? onChanged;

  /// 눌러서 열 수 있는 상태인지 여부입니다. React의 `disabled`에 대응합니다.
  final bool enabled;

  /// 오류 상태입니다.
  final bool invalid;

  /// 목록의 접근성 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronSelect<T>> createState() => _HoronSelectState<T>();
}

class _HoronSelectState<T> extends State<HoronSelect<T>> {
  final OverlayPortalController _portal = OverlayPortalController();
  final LayerLink _link = LayerLink();
  final GlobalKey _anchorKey = GlobalKey();

  late T? _internalValue = widget.initialValue;
  bool _open = false;
  Rect? _anchorRect;
  Object? _highlighted;

  T? get _value => widget.value ?? _internalValue;

  @override
  void didUpdateWidget(covariant HoronSelect<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!widget.enabled && _open) _close();
  }

  /// 목록에 들어 있는 항목을 값에서 글자로 풀기 위한 표입니다.
  Map<Object?, String> get _labels {
    final Map<Object?, String> labels = <Object?, String>{};
    void walk(Widget child) {
      if (child is HoronSelectItem<T>) {
        final String? label = child.label;
        if (label != null && label.isNotEmpty) labels[child.value] = label;
      } else if (child is HoronSelectGroup) {
        for (final Widget grandChild in child.children) {
          walk(grandChild);
        }
      } else if (child is HoronSelectContent) {
        for (final Widget grandChild in child.children) {
          walk(grandChild);
        }
      }
    }

    for (final Widget child in widget.children) {
      walk(child);
    }
    return labels;
  }

  /// 키보드 이동이 지나는 항목의 값 목록입니다. 비활성 항목은 건너뜁니다.
  List<Object?> get _selectableValues {
    final List<Object?> values = <Object?>[];
    void walk(Widget child) {
      if (child is HoronSelectItem<T>) {
        if (child.enabled) values.add(child.value);
      } else if (child is HoronSelectGroup) {
        for (final Widget grandChild in child.children) {
          walk(grandChild);
        }
      } else if (child is HoronSelectContent) {
        for (final Widget grandChild in child.children) {
          walk(grandChild);
        }
      }
    }

    for (final Widget child in widget.children) {
      walk(child);
    }
    return values;
  }

  void _measureAnchor() {
    final RenderObject? anchorObject = _anchorKey.currentContext?.findRenderObject();
    if (anchorObject is! RenderBox || !anchorObject.hasSize) return;
    _anchorRect = anchorObject.localToGlobal(Offset.zero) & anchorObject.size;
  }

  void _toggle() {
    if (!widget.enabled) return;
    if (_open) {
      _close();
      return;
    }
    _measureAnchor();
    _highlighted = _value;
    _portal.show();
    setState(() => _open = true);
  }

  void _close() {
    if (!_open) return;
    _portal.hide();
    setState(() {
      _open = false;
      _highlighted = null;
    });
  }

  void _select(Object? value) {
    if (value is! T) return;
    if (widget.value == null) setState(() => _internalValue = value);
    widget.onChanged?.call(value);
    _close();
  }

  void _moveHighlight(int delta) {
    final List<Object?> values = _selectableValues;
    if (values.isEmpty) return;
    final int current = values.indexOf(_highlighted);
    setState(() {
      _highlighted = current < 0 ? values.first : values[(current + delta) % values.length];
    });
  }

  KeyEventResult _handlePopupKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    switch (event.logicalKey) {
      case LogicalKeyboardKey.escape:
        _close();
        return KeyEventResult.handled;
      case LogicalKeyboardKey.arrowDown:
        _moveHighlight(1);
        return KeyEventResult.handled;
      case LogicalKeyboardKey.arrowUp:
        _moveHighlight(-1);
        return KeyEventResult.handled;
      case LogicalKeyboardKey.enter:
      case LogicalKeyboardKey.space:
        final Object? highlighted = _highlighted;
        if (highlighted != null) _select(highlighted);
        return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final Map<Object?, String> labels = _labels;
    final T? value = _value;

    HoronSelectContent? content;
    final List<Widget> inline = <Widget>[];
    for (final Widget child in widget.children) {
      if (child is HoronSelectContent) {
        content = child;
      } else {
        inline.add(child);
      }
    }

    return _HoronSelectScope(
      value: value,
      selectedLabel: value == null ? null : labels[value],
      open: _open,
      enabled: widget.enabled,
      invalid: widget.invalid,
      link: _link,
      anchorKey: _anchorKey,
      highlighted: _highlighted,
      onToggle: _toggle,
      onSelect: _select,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          ...inline,
          if (content != null)
            OverlayPortal(
              controller: _portal,
              overlayChildBuilder: (BuildContext overlayContext) => _buildOverlay(content!),
            ),
        ],
      ),
    );
  }

  Widget _buildOverlay(HoronSelectContent content) {
    final MediaQueryData media = MediaQuery.of(context);
    final _HoronSelectPlacement placement = _placeContent(
      anchor: _anchorRect ?? Rect.zero,
      screen: media.size,
      safeArea: media.padding,
    );

    return Stack(
      children: <Widget>[
        // 목록 밖을 누르면 닫힙니다. React의 `Portal` 바깥 클릭 처리에 해당합니다.
        Positioned.fill(
          child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: _close, child: const SizedBox.expand()),
        ),
        CompositedTransformFollower(
          link: _link,
          showWhenUnlinked: false,
          targetAnchor: placement.targetAnchor,
          followerAnchor: placement.followerAnchor,
          offset: placement.offset,
          child: Focus(
            autofocus: true,
            onKeyEvent: _handlePopupKey,
            child: ConstrainedBox(
              constraints: BoxConstraints(maxHeight: placement.maxHeight),
              child: SizedBox(width: placement.width, child: content),
            ),
          ),
        ),
      ],
    );
  }
}

/// `select.tsx`의 `SelectTrigger`입니다.
///
/// 값을 보여 주고 눌러서 목록을 엽니다. 높이는 React의 `h-[37px]`이고 [size]가
/// [HoronSelectSize.sm]이면 `h-7`(28)과 반경 10입니다. 테두리는 입력 토큰,
/// 포커스는 금색 링, 오류는 destructive 테두리입니다.
class HoronSelectTrigger extends StatefulWidget {
  /// 트리거를 만듭니다.
  const HoronSelectTrigger({
    super.key,
    required this.child,
    this.size = HoronSelectSize.defaultValue,
    this.semanticLabel,
  });

  /// 트리거 안에 넣을 내용입니다. 보통 [HoronSelectValue]입니다.
  final Widget child;

  /// 크기입니다.
  final HoronSelectSize size;

  /// 보조 기술이 읽을 이름입니다. 없으면 선택된 값이나 안내 문구를 씁니다.
  final String? semanticLabel;

  @override
  State<HoronSelectTrigger> createState() => _HoronSelectTriggerState();
}

class _HoronSelectTriggerState extends State<HoronSelectTrigger> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronSelectScope? scope = _HoronSelectScope.maybeOf(context);
    final bool enabled = scope?.enabled ?? true;
    final bool invalid = scope?.invalid ?? false;
    final bool isDark = theme.brightness == Brightness.dark;

    // "rounded-sm border border-input bg-transparent px-3 focus-visible:border-ring
    //  focus-visible:ring-3 ring-ring/50 dark:hover:bg-input/50"
    final Color borderColor = invalid
        ? (isDark ? scheme.error.withValues(alpha: _invalidBorderAlphaDark) : scheme.error)
        : (_focused ? horon.ring : scheme.outline);
    final Color fill = _hovered && isDark && enabled
        ? scheme.outline.withValues(alpha: scheme.outline.a * _darkHoverAlphaFactor)
        : Colors.transparent;
    final Color? ring = invalid
        ? scheme.error.withValues(alpha: isDark ? _invalidRingAlphaDark : _invalidRingAlpha)
        : (_focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null);
    final bool compact = widget.size == HoronSelectSize.sm;

    final Widget body = AnimatedContainer(
      duration: const Duration(milliseconds: HoronDuration.fast),
      curve: HoronEasing.easingDefault,
      height: compact ? HoronSpace.s7 : _triggerHeight,
      padding: const EdgeInsets.symmetric(horizontal: _triggerPadding),
      decoration: BoxDecoration(
        color: fill,
        borderRadius: BorderRadius.circular(compact ? HoronSpace.s2_5 : HoronRadiusRole.input),
        border: Border.all(color: borderColor),
        boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _focusRingWidth)],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Flexible(child: widget.child),
          const SizedBox(width: _triggerGap),
          CustomPaint(
            size: const Size.square(_iconSize),
            painter: HoronChevronPainter(color: scheme.onSurfaceVariant),
          ),
        ],
      ),
    );

    final Widget interactive = MouseRegion(
      cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: FocusableActionDetector(
        enabled: enabled,
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              scope?.onToggle();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: enabled ? scope?.onToggle : null,
          child: Opacity(opacity: enabled ? 1 : _disabledOpacity, child: body),
        ),
      ),
    );

    final Widget anchored = scope == null
        ? interactive
        : CompositedTransformTarget(key: scope.anchorKey, link: scope.link, child: interactive);

    return Semantics(
      button: true,
      enabled: enabled,
      expanded: scope?.open ?? false,
      label: widget.semanticLabel ?? scope?.selectedLabel,
      child: anchored,
    );
  }
}

/// `select.tsx`의 `SelectValue`입니다.
///
/// 지금 값의 글자를 보여 주고, 값이 없으면 [placeholder]를 `text-muted-foreground`로
/// 그립니다. React는 이 자리에 `data-placeholder`를 붙여 색을 바꿉니다.
class HoronSelectValue extends StatelessWidget {
  /// 값 표시를 만듭니다.
  const HoronSelectValue({super.key, this.placeholder, this.style});

  /// 값이 없을 때 보이는 안내 문구입니다. 호스트가 넘깁니다.
  final String? placeholder;

  /// 글자 스타일을 덮어쓸 때 씁니다. 색은 상태가 정하므로 넘긴 색은 무시됩니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final _HoronSelectScope? scope = _HoronSelectScope.maybeOf(context);
    final String? label = scope?.selectedLabel;
    final String? text = label ?? placeholder;

    final TextStyle resolved = (style ?? theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.body,
      height: HoronLineHeight.none,
      color: label == null ? scheme.onSurfaceVariant : scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return Text(text ?? '', maxLines: 1, overflow: TextOverflow.ellipsis, softWrap: false, style: resolved);
  }
}

/// `select.tsx`의 `SelectContent`입니다. `.glass-strong` 목록 패널입니다.
///
/// React의 `max-h-(--available-height) w-(--anchor-width) min-w-36 rounded-md`를
/// 옮깁니다. 높이 상한·폭·위아래 뒤집기는 [HoronSelect]가 정해 이 위젯을 감쌉니다.
class HoronSelectContent extends StatelessWidget {
  /// 목록 패널을 만듭니다.
  const HoronSelectContent({super.key, required this.children, this.emptyLabel});

  /// 목록에 넣을 [HoronSelectItem]·[HoronSelectGroup]·[HoronSelectLabel]입니다.
  final List<Widget> children;

  /// 항목이 하나도 없을 때 보이는 문구입니다. 없으면 `strings.noResults`입니다.
  final String? emptyLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final ColorScheme scheme = Theme.of(context).colorScheme;

    return KeyedSubtree(
      key: HoronSelect.contentKey,
      child: TweenAnimationBuilder<double>(
        tween: Tween<double>(begin: 0, end: 1),
        duration: const Duration(milliseconds: HoronDuration.fast),
        curve: HoronEasing.easingDefault,
        builder: (BuildContext context, double t, Widget? child) => Opacity(
          opacity: t,
          child: Transform.scale(
            scale: _contentStartScale + (1 - _contentStartScale) * t,
            alignment: Alignment.topLeft,
            child: child,
          ),
        ),
        child: ClipRRect(
          // `BackdropFilter`는 자신을 자르는 clip이 없으면 뒤에 그려진 화면 전체를
          // 흐립니다. 패널 모서리로 잘라 목록 밖은 그대로 남깁니다.
          borderRadius: BorderRadius.circular(HoronRadiusRole.card),
          child: HoronGlassSurface.strong(
            padding: EdgeInsets.zero,
            borderRadius: BorderRadius.circular(HoronRadiusRole.card),
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(vertical: HoronSpace.s1),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: children.isEmpty
                    ? <Widget>[
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s2, vertical: HoronSpace.s6),
                          child: Text(
                            emptyLabel ?? horon.strings.noResults,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontFamily: HoronFont.body,
                              fontFamilyFallback: HoronFont.fontFamilyFallback,
                              fontSize: _labelFontSize,
                              height: HoronLineHeight.normal,
                              color: scheme.onSurfaceVariant,
                              decoration: TextDecoration.none,
                            ),
                          ),
                        ),
                      ]
                    : children,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `select.tsx`의 `SelectItem`입니다.
///
/// 선택된 항목의 오른쪽에 체크 표시가 남습니다. React의 `ItemIndicator`가 그리는
/// lucide `Check`를 [HoronCheckMarkPainter]로 그립니다. 표시 자리는 늘 비워 두므로
/// 선택이 바뀌어도 글자가 흔들리지 않습니다.
class HoronSelectItem<T> extends StatefulWidget {
  /// 항목 하나를 만듭니다.
  const HoronSelectItem({
    super.key,
    required this.value,
    this.label,
    this.child,
    this.icon,
    this.enabled = true,
    this.semanticLabel,
  }) : assert(label != null || child != null, 'HoronSelectItem needs a label or a child.');

  /// 선택될 값입니다.
  final T value;

  /// 항목 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘 슬롯입니다.
  final Widget? icon;

  /// 고를 수 있는 상태인지 여부입니다. React의 `disabled`에 대응합니다.
  final bool enabled;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronSelectItem<T>> createState() => _HoronSelectItemState<T>();
}

class _HoronSelectItemState<T> extends State<HoronSelectItem<T>> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final _HoronSelectScope? scope = _HoronSelectScope.maybeOf(context);
    final bool selected = scope?.value == widget.value;
    final bool enabled = widget.enabled;
    final bool highlighted = _hovered || scope?.highlighted == widget.value;

    // "focus:bg-accent focus:text-accent-foreground" - accent는 muted와 같은 값이라
    // ColorScheme의 surfaceContainerHighest가 그 자리를 맡습니다.
    final Color background = highlighted && enabled ? scheme.surfaceContainerHighest : Colors.transparent;
    final TextStyle textStyle = (theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.body,
      height: HoronLineHeight.none,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return Semantics(
      button: true,
      selected: selected,
      enabled: enabled,
      label: widget.semanticLabel,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: enabled ? () => scope?.onSelect(widget.value) : null,
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
                  decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(HoronRadius.md)),
                  child: Row(
                    children: <Widget>[
                      if (widget.icon != null) ...<Widget>[
                        IconTheme.merge(
                          data: IconThemeData(size: _iconSize, color: scheme.onSurfaceVariant),
                          child: widget.icon!,
                        ),
                        const SizedBox(width: _itemGap),
                      ],
                      Expanded(
                        child: DefaultTextStyle(
                          style: textStyle,
                          child: widget.label != null
                              ? Text(
                                  widget.label!,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  softWrap: false,
                                  style: textStyle,
                                )
                              : widget.child!,
                        ),
                      ),
                    ],
                  ),
                ),
                if (selected)
                  Padding(
                    padding: const EdgeInsetsDirectional.only(end: _checkInset),
                    child: CustomPaint(
                      key: HoronSelect.checkKey,
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

/// `select.tsx`의 `SelectGroup`입니다. React의 `scroll-my-1 p-1`입니다.
class HoronSelectGroup extends StatelessWidget {
  /// 그룹을 만듭니다.
  const HoronSelectGroup({super.key, required this.children});

  /// 그룹에 넣을 항목입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(_groupPadding),
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: children),
    );
  }
}

/// `select.tsx`의 `SelectLabel`입니다. React의 `px-1.5 py-1 text-xs`입니다.
class HoronSelectLabel extends StatelessWidget {
  /// 그룹 라벨을 만듭니다.
  const HoronSelectLabel({super.key, required this.label});

  /// 라벨 글자입니다. 호스트가 넘깁니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: _labelPadding, vertical: _itemPaddingVertical),
      child: Text(
        label,
        style: TextStyle(
          fontFamily: HoronFont.body,
          fontFamilyFallback: HoronFont.fontFamilyFallback,
          fontSize: _labelFontSize,
          height: HoronLineHeight.none,
          color: scheme.onSurfaceVariant,
          decoration: TextDecoration.none,
        ),
      ),
    );
  }
}

/// `select.tsx`의 `SelectSeparator`입니다. React의 `-mx-1 my-1 h-px bg-border`입니다.
class HoronSelectSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronSelectSeparator({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: _separatorMargin),
      child: SizedBox(
        height: _separatorThickness,
        child: ColoredBox(color: scheme.outline),
      ),
    );
  }
}

/// lucide `ChevronDown`(`M6 9l6 6 6-6`)을 24 단위 상자의 비율로 그립니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않으므로 셰브론을 선 두 개로 그립니다. 같은
/// 표시를 `native_select.dart`와 `combobox.dart`도 이 페인터로 그립니다.
/// [pointsUp]이 참이면 같은 선을 뒤집어 `ChevronUp`이 됩니다.
class HoronChevronPainter extends CustomPainter {
  /// 아래(또는 위)를 향하는 셰브론을 그리는 페인터를 만듭니다.
  const HoronChevronPainter({required this.color, this.pointsUp = false});

  /// 선 색입니다.
  final Color color;

  /// 위를 향하게 그릴지 여부입니다.
  final bool pointsUp;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * _iconStrokeRatio
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final double edgeY = size.height * (pointsUp ? 0.625 : 0.375);
    final double tipY = size.height * (pointsUp ? 0.375 : 0.625);
    final Path path = Path()
      ..moveTo(size.width * 0.25, edgeY)
      ..lineTo(size.width * 0.5, tipY)
      ..lineTo(size.width * 0.75, edgeY);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(HoronChevronPainter oldDelegate) => color != oldDelegate.color || pointsUp != oldDelegate.pointsUp;
}
