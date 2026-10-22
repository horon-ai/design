import 'package:flutter/foundation.dart' show setEquals;
import 'package:flutter/gestures.dart' show PointerEnterEvent, PointerExitEvent;
import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `toggle-group.tsx`의 `variant` 옵션입니다.
///
/// 컨테이너가 그리는 표면입니다. `default`는 `bg-muted`로 홈을 파고, `outline`은
/// 테두리만 두릅니다.
enum HoronToggleGroupVariant {
  /// `bg-muted`
  defaultValue,

  /// `border border-border bg-transparent`
  outline,
}

/// `toggle-group.tsx`의 항목 `size` 옵션입니다.
enum HoronToggleGroupItemSize {
  /// `h-7 min-w-7 px-2.5`
  defaultValue,

  /// `h-6 min-w-6 px-2`
  sm,

  /// `h-8 min-w-8 px-3`
  lg,
}

/// 선택 방식입니다. React에서는 base-ui의 `toggleMultiple`에 해당합니다.
///
/// 공개하지 않습니다. 변형 게이트가 이 파일의 공개 enum 값 전부를 React의 cva 키와
/// 비교하므로, cva에 없는 이름을 공개하면 게이트가 실패합니다.
enum _HoronToggleGroupMode { single, multiple }

// toggle-group.tsx 항목의 size 클래스를 픽셀로 옮긴 값입니다.
const double _itemHeightDefault = 28.0; // "h-7 min-w-7"
const double _itemHeightSm = 24.0; // "h-6 min-w-6"
const double _itemHeightLg = 32.0; // "h-8 min-w-8"

/// `toggle-group.tsx` 항목의 `text-[13px]`입니다.
const double _itemFontSize = 13.0;

/// 항목 크기 하나가 그리는 치수입니다.
class _HoronToggleGroupItemSpec {
  const _HoronToggleGroupItemSpec({required this.height, required this.minWidth, required this.padding});

  /// 높이입니다.
  final double height;

  /// 최소 폭입니다.
  final double minWidth;

  /// 좌우 패딩입니다.
  final double padding;
}

const Map<HoronToggleGroupItemSize, _HoronToggleGroupItemSpec> _itemSpecs =
    <HoronToggleGroupItemSize, _HoronToggleGroupItemSpec>{
      HoronToggleGroupItemSize.defaultValue: _HoronToggleGroupItemSpec(
        height: _itemHeightDefault,
        minWidth: _itemHeightDefault,
        padding: HoronSpace.s2_5,
      ),
      HoronToggleGroupItemSize.sm: _HoronToggleGroupItemSpec(
        height: _itemHeightSm,
        minWidth: _itemHeightSm,
        padding: HoronSpace.s2,
      ),
      HoronToggleGroupItemSize.lg: _HoronToggleGroupItemSpec(
        height: _itemHeightLg,
        minWidth: _itemHeightLg,
        padding: HoronSpace.s3,
      ),
    };

/// 그룹이 자기 항목에게 선택 상태와 컨테이너 변형을 알리는 스코프입니다.
class _HoronToggleGroupScope extends InheritedWidget {
  const _HoronToggleGroupScope({
    required this.selected,
    required this.mode,
    required this.variant,
    required this.onToggle,
    required super.child,
  });

  /// 지금 선택된 값들입니다.
  final Set<String> selected;

  /// 단일·다중 선택 방식입니다.
  final _HoronToggleGroupMode mode;

  /// 컨테이너 변형입니다.
  final HoronToggleGroupVariant variant;

  /// 항목 하나를 눌렀을 때 그룹이 부르는 콜백입니다.
  final ValueChanged<String> onToggle;

  @override
  bool updateShouldNotify(_HoronToggleGroupScope oldWidget) =>
      !setEquals(selected, oldWidget.selected) || mode != oldWidget.mode || variant != oldWidget.variant;
}

/// 같은 목적의 토글을 한 줄로 묶는 그룹입니다.
///
/// `toggle-group.tsx`를 옮긴 것입니다. `default` 변형은 홈을 `bg-muted`로 파고,
/// 눌린 항목이 `bg-background shadow-sm`으로 떠오릅니다. `outline` 변형은 테두리만
/// 있고, 눌린 항목이 `bg-muted`로 채워집니다.
///
/// [multiple]이 거짓이면 한 번에 하나만 선택되고(단일 선택), 참이면 여러 항목이 함께
/// 남습니다(다중 선택). [selected]를 넘기면 제어 모드가 되고, 넘기지 않으면 그룹이
/// 스스로 선택을 기억합니다.
///
/// ```dart
/// HoronToggleGroup(
///   multiple: true,
///   onChanged: (Set<String> values) => setFilters(values),
///   children: const <Widget>[
///     HoronToggleGroupItem(value: 'bold', label: '굵게'),
///     HoronToggleGroupItem(value: 'italic', label: '기울임'),
///   ],
/// );
/// ```
class HoronToggleGroup extends StatefulWidget {
  /// 그룹 하나를 만듭니다.
  const HoronToggleGroup({
    super.key,
    required this.children,
    this.selected,
    this.initialSelection = const <String>{},
    this.onChanged,
    this.multiple = false,
    this.variant = HoronToggleGroupVariant.defaultValue,
    this.vertical = false,
    this.semanticLabel,
  });

  /// 그룹에 넣을 [HoronToggleGroupItem] 목록입니다.
  final List<Widget> children;

  /// 선택된 값들입니다. null이면 이 위젯이 상태를 소유합니다.
  final Set<String>? selected;

  /// 제어 모드가 아닐 때의 처음 선택입니다.
  final Set<String> initialSelection;

  /// 선택이 바뀔 때 부르는 콜백입니다.
  final ValueChanged<Set<String>>? onChanged;

  /// 여러 항목을 함께 고를 수 있는지 여부입니다.
  final bool multiple;

  /// 컨테이너 변형입니다.
  final HoronToggleGroupVariant variant;

  /// 세로로 쌓을지 여부입니다. React의 `data-[orientation=vertical]:flex-col`입니다.
  final bool vertical;

  /// 스크린리더가 읽을 그룹 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronToggleGroup> createState() => _HoronToggleGroupState();
}

class _HoronToggleGroupState extends State<HoronToggleGroup> {
  late Set<String> _internalSelection = Set<String>.of(widget.initialSelection);

  Set<String> get _selection => widget.selected ?? _internalSelection;

  _HoronToggleGroupMode get _mode => widget.multiple ? _HoronToggleGroupMode.multiple : _HoronToggleGroupMode.single;

  void _toggle(String value) {
    final Set<String> current = _selection;
    final Set<String> next;
    if (widget.multiple) {
      next = Set<String>.of(current);
      if (!next.remove(value)) next.add(value);
    } else {
      // 단일 선택: 이미 눌린 항목을 다시 누르면 아무것도 남지 않습니다(base-ui의
      // 단일 토글과 같은 동작). 다른 항목을 누르면 그 하나만 남습니다.
      next = current.contains(value) ? <String>{} : <String>{value};
    }
    if (widget.selected == null) setState(() => _internalSelection = next);
    widget.onChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    // "group/toggle-group flex w-fit items-center gap-0.5 rounded-md p-0.5"
    final Color background = widget.variant == HoronToggleGroupVariant.defaultValue
        ? scheme.surfaceContainerHighest
        : Colors.transparent;
    final Border? border = widget.variant == HoronToggleGroupVariant.outline ? Border.all(color: scheme.outline) : null;

    final Widget group = Flex(
      direction: widget.vertical ? Axis.vertical : Axis.horizontal,
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        for (int index = 0; index < widget.children.length; index++) ...<Widget>[
          // "gap-0.5" - 항목 사이 2px입니다.
          if (index > 0)
            SizedBox(
              width: widget.vertical ? HoronSpace.s0 : HoronSpace.s0_5,
              height: widget.vertical ? HoronSpace.s0_5 : HoronSpace.s0,
            ),
          widget.children[index],
        ],
      ],
    );

    return Semantics(
      container: true,
      label: widget.semanticLabel,
      child: _HoronToggleGroupScope(
        selected: _selection,
        mode: _mode,
        variant: widget.variant,
        onToggle: _toggle,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: background,
            borderRadius: BorderRadius.circular(HoronRadiusRole.control),
            border: border,
          ),
          child: Padding(
            padding: const EdgeInsets.all(HoronSpace.s0_5),
            // React의 항목은 `shrink-0`이라 좁은 부모에서도 줄지 않고 넘칩니다.
            // Flutter에서 그대로 두면 안쪽 Flex가 부모를 넘어 `RenderFlex
            // overflowed`가 납니다(360 폭에서 40px, 2026-10-22 렌더 스윕).
            // 가로 스크롤 뷰는 자식이 들어가면 자식 폭을 그대로 보고하므로 넓은
            // 자리에서는 모양이 바뀌지 않고, 모자랄 때만 흔려 보냅니다.
            child: widget.vertical
                ? IntrinsicWidth(child: group)
                : SingleChildScrollView(scrollDirection: Axis.horizontal, child: group),
          ),
        ),
      ),
    );
  }
}

/// [HoronToggleGroup] 안의 토글 하나입니다.
///
/// 그룹이 없으면 눌리지 않은 상태로만 그립니다. 선택 상태와 콜백은 그룹이 소유합니다.
class HoronToggleGroupItem extends StatefulWidget {
  /// 항목 하나를 만듭니다.
  const HoronToggleGroupItem({
    super.key,
    required this.value,
    this.label,
    this.child,
    this.icon,
    this.size = HoronToggleGroupItemSize.defaultValue,
    this.semanticLabel,
  }) : assert(
         label != null || child != null || icon != null,
         'HoronToggleGroupItem needs a label, a child or an icon.',
       );

  /// 선택 집합에 들어가는 값입니다.
  final String value;

  /// 항목 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  /// 크기입니다.
  final HoronToggleGroupItemSize size;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronToggleGroupItem> createState() => _HoronToggleGroupItemState();
}

class _HoronToggleGroupItemState extends State<HoronToggleGroupItem> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final _HoronToggleGroupScope? scope = context.dependOnInheritedWidgetOfExactType<_HoronToggleGroupScope>();
    final bool pressed = scope?.selected.contains(widget.value) ?? false;
    final _HoronToggleGroupItemSpec spec = _itemSpecs[widget.size]!;

    // "text-muted-foreground hover:text-foreground
    //  group-data-[variant=default]/toggle-group:data-pressed:bg-background
    //  group-data-[variant=default]/toggle-group:data-pressed:shadow-sm
    //  group-data-[variant=outline]/toggle-group:data-pressed:bg-muted"
    final Color foreground = pressed || _hovered ? scheme.onSurface : scheme.onSurfaceVariant;
    final bool onDefaultContainer = scope?.variant != HoronToggleGroupVariant.outline;
    final Color background = pressed
        ? (onDefaultContainer ? scheme.surface : scheme.surfaceContainerHighest)
        : Colors.transparent;
    final List<BoxShadow>? shadow = pressed && onDefaultContainer ? HoronShadow.sm : null;

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _itemFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.none,
      color: foreground,
      // Material 조상이 없는 자리에서는 Flutter가 기본 `DefaultTextStyle`에 노란
      // 이중 밑줄을 넣습니다. 그 값이 merge로 새어 들어오지 않게 명시합니다.
      decoration: TextDecoration.none,
    );

    final Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        if (widget.icon != null)
          IconTheme.merge(
            data: IconThemeData(size: HoronSpace.s4, color: foreground),
            child: widget.icon!,
          ),
        if (widget.icon != null && (widget.label != null || widget.child != null))
          const SizedBox(width: HoronSpace.s1_5),
        // React는 `whitespace-nowrap`이라 글자를 줄이지 않고, 좁은 부모에서는 그대로
        // 넘깁니다. Flutter에서 그대로 두면 이 Row가 부모를 넘쳐 `RenderFlex
        // overflowed`가 납니다(360 폭에서 40px, 2026-10-22 렌더 스윕).
        if (widget.label != null)
          Flexible(
            child: Text(widget.label!, maxLines: 1, softWrap: false, overflow: TextOverflow.ellipsis, style: textStyle),
          )
        else if (widget.child != null)
          Flexible(
            child: DefaultTextStyle(style: textStyle, child: widget.child!),
          ),
      ],
    );

    return Semantics(
      button: true,
      selected: pressed,
      label: widget.semanticLabel,
      child: MouseRegion(
        cursor: scope == null ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
        onExit: (PointerExitEvent event) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: scope == null ? null : () => scope.onToggle(widget.value),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: HoronDuration.fast),
            curve: HoronEasing.easingDefault,
            decoration: BoxDecoration(
              color: background,
              borderRadius: BorderRadius.circular(HoronRadius.sm),
              boxShadow: shadow,
            ),
            constraints: BoxConstraints(minWidth: spec.minWidth, minHeight: spec.height),
            padding: EdgeInsets.symmetric(horizontal: spec.padding, vertical: HoronSpace.s0),
            child: Center(widthFactor: 1, heightFactor: 1, child: content),
          ),
        ),
      ),
    );
  }
}
