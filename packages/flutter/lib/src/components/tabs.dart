import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `tabs.tsx`의 `tabsListVariants` 변형입니다.
///
/// React의 cva 키를 그대로 옮겼고, Dart 예약어인 `default`만 `defaultValue`로 적습니다.
enum HoronTabsVariant {
  /// `bg-muted` - 목록이 홈을 파고 선택된 탭이 카드처럼 떠오릅니다.
  defaultValue,

  /// `bg-transparent` - 배경 없이 밑줄 인디케이터만 그립니다.
  line,
}

/// `tabs.tsx` 루트의 `gap-2`입니다. 목록과 내용 사이 거리입니다.
const double _tabsRootGap = HoronSpace.s2;

/// `tabs.tsx` 목록의 `gap-1`입니다. 탭 사이 거리입니다.
const double _tabsListGap = HoronSpace.s1;

/// `tabs.tsx` 목록의 `p-1`입니다.
const double _tabsListPadding = HoronSpace.s1;

/// `tabs.tsx` 목록의 `h-8`입니다. React는 목록 높이를 32로 고정하지만, Flutter는
/// 글자 높이가 그 상자를 넘지 않게 목록을 내용에 맞춰 그립니다. 이 값은 목록이
/// 지켜야 하는 최소 높이로 씁니다.
const double _tabsListMinHeight = HoronSpace.s8;

/// `tabs.tsx` 트리거의 `px-3.5`입니다.
const double _tabsTriggerPaddingH = HoronSpace.s3_5;

/// `tabs.tsx` 트리거의 `py-1.5`입니다.
const double _tabsTriggerPaddingV = HoronSpace.s1_5;

/// `tabs.tsx` 트리거의 `gap-1.5`입니다. 아이콘과 글자 사이 거리입니다.
const double _tabsTriggerGap = HoronSpace.s1_5;

/// `tabs.tsx` 트리거의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값이라
/// 이름을 붙입니다.
const double _tabsFontSize = 13.0;

/// `tabs.tsx` 인디케이터의 `after:h-0.5`/`after:w-0.5`입니다.
const double _tabsIndicatorThickness = HoronSpace.s0_5;

/// `tabs.tsx` 인디케이터의 `after:bottom-[-5px]`입니다.
///
/// 5는 4px 눈금의 단계가 아니라 React가 직접 적은 값이라 이름을 붙입니다.
const double _tabsUnderlineOffset = 5.0;

/// `tabs.tsx` 인디케이터의 `after:-right-1`입니다.
const double _tabsIndicatorOffset = HoronSpace.s1;

/// `text-foreground/60`의 불투명도입니다. 선택되지 않은 탭의 글자입니다.
const double _tabsInactiveOpacity = 0.6;

/// `focus-visible:ring-[3px]`을 4px 눈금의 2px 단계로 옮긴 값입니다.
const double _tabsFocusRingSpread = HoronSpace.s0_5;

/// `focus-visible:ring-ring/50`의 불투명도입니다.
const double _tabsFocusRingAlpha = 0.5;

/// `disabled:opacity-50`입니다.
const double _tabsDisabledOpacity = 0.5;

/// 탭 하나의 선택 상태를 자식에게 알리는 스코프입니다.
class _HoronTabsScope extends InheritedWidget {
  const _HoronTabsScope({required this.selected, required this.onSelect, required this.vertical, required super.child});

  /// 지금 선택된 값입니다. 아직 아무것도 고르지 않았으면 null입니다.
  final String? selected;

  /// 탭 하나를 눌렀을 때 루트가 부르는 콜백입니다.
  final ValueChanged<String> onSelect;

  /// 세로 방향 여부입니다. React `orientation="vertical"`에 해당합니다.
  final bool vertical;

  static _HoronTabsScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronTabsScope>();

  @override
  bool updateShouldNotify(_HoronTabsScope oldWidget) =>
      selected != oldWidget.selected || vertical != oldWidget.vertical;
}

/// 목록의 변형을 트리거에게 알리는 스코프입니다.
///
/// React는 `group-data-[variant=line]/tabs-list`로 목록의 변형을 자식에게 내려
/// 보냅니다. Flutter에는 그런 선택자가 없으므로 목록이 이 스코프를 놓습니다.
class _HoronTabsListScope extends InheritedWidget {
  const _HoronTabsListScope({required this.variant, required super.child});

  /// 목록의 변형입니다.
  final HoronTabsVariant variant;

  static _HoronTabsListScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronTabsListScope>();

  @override
  bool updateShouldNotify(_HoronTabsListScope oldWidget) => variant != oldWidget.variant;
}

/// 탭 하나를 고르는 묶음입니다.
///
/// `tabs.tsx`의 `Tabs`를 옮긴 것입니다. React 루트는 `flex gap-2`에
/// `data-horizontal:flex-col`이라, 수평 방향이면 목록이 내용 위에 오고 수직
/// 방향이면 목록이 내용 왼쪽에 옵니다. `orientation`은 cva 변형 그룹이 아니라
/// 공개 enum을 두지 않으므로 [vertical]로 고릅니다.
///
/// [value]를 넘기면 제어 모드가 되어 선택을 호스트가 소유하고, 넘기지 않으면 이
/// 위젯이 기억합니다.
///
/// ```dart
/// HoronTabs(
///   initialValue: 'account',
///   children: <Widget>[
///     HoronTabsList(
///       children: <Widget>[
///         HoronTabsTrigger(value: 'account', label: '계정'),
///         HoronTabsTrigger(value: 'password', label: '비밀번호'),
///       ],
///     ),
///     HoronTabsContent(value: 'account', child: Text('계정 설정')),
///     HoronTabsContent(value: 'password', child: Text('비밀번호 설정')),
///   ],
/// );
/// ```
class HoronTabs extends StatefulWidget {
  /// 탭 묶음 하나를 만듭니다.
  const HoronTabs({
    super.key,
    this.value,
    this.initialValue,
    this.onValueChanged,
    this.vertical = false,
    required this.children,
  });

  /// 선택된 값입니다. null이면 이 위젯이 상태를 소유합니다.
  final String? value;

  /// 제어 모드가 아닐 때의 처음 선택입니다.
  final String? initialValue;

  /// 선택이 바뀔 때 부르는 콜백입니다.
  final ValueChanged<String>? onValueChanged;

  /// 세로 방향 여부입니다. React `orientation="vertical"`에 해당합니다.
  final bool vertical;

  /// 목록과 내용 파트입니다.
  final List<Widget> children;

  @override
  State<HoronTabs> createState() => _HoronTabsState();
}

class _HoronTabsState extends State<HoronTabs> {
  late String? _internalValue = widget.initialValue;

  String? get _selected => widget.value ?? _internalValue;

  void _select(String next) {
    if (widget.value == null) setState(() => _internalValue = next);
    widget.onValueChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final bool vertical = widget.vertical;
    return _HoronTabsScope(
      selected: _selected,
      onSelect: _select,
      vertical: vertical,
      child: Flex(
        direction: vertical ? Axis.horizontal : Axis.vertical,
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: _tabsRootGap,
        children: widget.children,
      ),
    );
  }
}

/// 탭 버튼을 담는 목록입니다.
///
/// `tabs.tsx`의 `TabsList`를 옮긴 것입니다. React는 `inline-flex w-fit gap-1
/// rounded-sm p-1`이고 수평 방향에서 `h-8`, 수직 방향에서 `h-fit flex-col`입니다.
/// [HoronTabsVariant.defaultValue]는 `bg-muted`로 홈을 파고,
/// [HoronTabsVariant.line]은 `rounded-none bg-transparent`로 배경을 지웁니다.
class HoronTabsList extends StatelessWidget {
  /// 목록 하나를 만듭니다.
  const HoronTabsList({super.key, this.variant = HoronTabsVariant.defaultValue, required this.children});

  /// 목록의 변형입니다.
  final HoronTabsVariant variant;

  /// 목록에 넣을 [HoronTabsTrigger]들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool vertical = _HoronTabsScope.maybeOf(context)?.vertical ?? false;
    final bool filled = variant == HoronTabsVariant.defaultValue;

    final Widget row = Flex(
      direction: vertical ? Axis.vertical : Axis.horizontal,
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: vertical ? CrossAxisAlignment.stretch : CrossAxisAlignment.center,
      spacing: _tabsListGap,
      children: children,
    );

    final Widget list = DecoratedBox(
      decoration: BoxDecoration(
        color: filled ? scheme.surfaceContainerHighest : Colors.transparent,
        borderRadius: filled ? BorderRadius.circular(HoronRadius.sm) : BorderRadius.zero,
      ),
      child: Padding(
        padding: const EdgeInsets.all(_tabsListPadding),
        // 수직 목록의 트리거는 `w-full`입니다. React는 목록이 `w-fit`으로 줄어든 뒤
        // 트리거가 그 폭을 채우므로, 가장 넓은 트리거의 폭을 모든 트리거가 나눠 갖습니다.
        child: vertical ? IntrinsicWidth(child: row) : row,
      ),
    );

    // "inline-flex w-fit" - 목록은 내용 폭만 차지하고 왼쪽 위에 붙습니다.
    return _HoronTabsListScope(
      variant: variant,
      child: Align(
        alignment: AlignmentDirectional.topStart,
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: vertical ? HoronSpace.s0 : _tabsListMinHeight),
          child: list,
        ),
      ),
    );
  }
}

/// 탭 버튼 하나입니다.
///
/// `tabs.tsx`의 `TabsTrigger`를 옮긴 것입니다. `rounded-sm border border-transparent
/// px-3.5 py-1.5 text-[13px] font-medium text-foreground/60`이고, 선택되면
/// `border-border bg-background font-semibold text-foreground`가 됩니다.
/// [HoronTabsVariant.line] 목록에서는 배경이 투명해지고 선택된 탭의 바깥쪽에
/// 2px 인디케이터가 그려집니다(수평은 아래, 수직은 오른쪽).
class HoronTabsTrigger extends StatefulWidget {
  /// 탭 버튼 하나를 만듭니다.
  const HoronTabsTrigger({super.key, required this.value, this.label, this.child, this.icon, this.disabled = false})
    : assert(label != null || child != null, 'HoronTabsTrigger needs a label or a child.');

  /// 선택 집합에 들어가는 값입니다. [HoronTabsContent.value]와 짝을 이룹니다.
  final String value;

  /// 버튼 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다. 이 패키지는 기본 아이콘을 넣지 않습니다.
  final Widget? icon;

  /// 누를 수 없는 상태입니다. React `disabled`/`aria-disabled`에 해당합니다.
  final bool disabled;

  /// 밑줄 인디케이터를 찾는 키입니다.
  ///
  /// [HoronTabsVariant.line] 목록의 선택된 탭에만 붙으므로, 테스트는 이 키로
  /// 인디케이터의 존재와 위치를 확인합니다.
  static Key indicatorKeyFor(String value) => ValueKey<String>('horon-tabs-indicator-$value');

  @override
  State<HoronTabsTrigger> createState() => _HoronTabsTriggerState();
}

class _HoronTabsTriggerState extends State<HoronTabsTrigger> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final _HoronTabsScope? tabs = _HoronTabsScope.maybeOf(context);
    final HoronTabsVariant variant = _HoronTabsListScope.maybeOf(context)?.variant ?? HoronTabsVariant.defaultValue;
    final bool vertical = tabs?.vertical ?? false;
    final bool active = tabs?.selected == widget.value;
    final bool enabled = !widget.disabled;
    final bool line = variant == HoronTabsVariant.line;

    // "data-active:bg-background"이고, line 목록은
    // "group-data-[variant=line]/tabs-list:data-active:bg-transparent"로 배경을 지웁니다.
    final Color background = active && !line ? scheme.surface : Colors.transparent;
    // "data-active:border-border"이고, 다크의 line 목록만 테두리를 지웁니다
    // ("dark:group-data-[variant=line]/tabs-list:data-active:border-transparent").
    final Color borderColor = active && !(isDark && line) ? scheme.outline : Colors.transparent;
    // "text-foreground/60"과 "dark:text-muted-foreground"이고,
    // "hover:text-foreground"가 쉬는 상태의 흐린 글자를 전경 색으로 되돌립니다.
    final Color foreground = active || _hovered
        ? scheme.onSurface
        : (isDark ? scheme.onSurfaceVariant : scheme.onSurface.withValues(alpha: _tabsInactiveOpacity));

    final List<BoxShadow> shadows = <BoxShadow>[
      // "group-data-[variant=default]/tabs-list:data-active:shadow-sm"
      if (active && !line) ...HoronShadow.sm,
      if (_focused)
        BoxShadow(
          color: horon.ring.withValues(alpha: _tabsFocusRingAlpha),
          spreadRadius: _tabsFocusRingSpread,
        ),
    ];

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _tabsFontSize,
      fontWeight: active ? HoronFontWeight.semibold : HoronFontWeight.medium,
      height: HoronLineHeight.none,
      color: foreground,
      // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중 밑줄이
      // 새어 들어오지 않게 명시합니다.
      decoration: TextDecoration.none,
    );

    final Widget face = DecoratedBox(
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(HoronRadius.sm),
        border: Border.all(color: borderColor),
        boxShadow: shadows.isEmpty ? null : shadows,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _tabsTriggerPaddingH, vertical: _tabsTriggerPaddingV),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: vertical ? MainAxisAlignment.start : MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            if (widget.icon != null) ...<Widget>[
              IconTheme.merge(
                data: IconThemeData(size: HoronSpace.s4, color: foreground),
                child: widget.icon!,
              ),
              const SizedBox(width: _tabsTriggerGap),
            ],
            if (widget.label != null)
              Text(widget.label!, maxLines: 1, softWrap: false, style: textStyle)
            else
              DefaultTextStyle.merge(style: textStyle, child: widget.child!),
          ],
        ),
      ),
    );

    // "after:absolute after:bg-foreground after:opacity-0 … data-active:after:opacity-100"
    final Widget body = line && active
        ? Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              face,
              Positioned(
                key: HoronTabsTrigger.indicatorKeyFor(widget.value),
                left: vertical ? null : HoronSpace.s0,
                right: vertical ? -_tabsIndicatorOffset : HoronSpace.s0,
                top: vertical ? HoronSpace.s0 : null,
                bottom: vertical ? HoronSpace.s0 : -_tabsUnderlineOffset,
                width: vertical ? _tabsIndicatorThickness : null,
                height: vertical ? null : _tabsIndicatorThickness,
                child: DecoratedBox(decoration: BoxDecoration(color: scheme.onSurface)),
              ),
            ],
          )
        : face;

    final Widget interactive = Semantics(
      button: true,
      selected: active,
      enabled: enabled,
      child: FocusableActionDetector(
        enabled: enabled,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              if (enabled) tabs?.onSelect(widget.value);
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: enabled ? () => tabs?.onSelect(widget.value) : null,
            child: body,
          ),
        ),
      ),
    );

    return enabled ? interactive : Opacity(opacity: _tabsDisabledOpacity, child: interactive);
  }
}

/// 선택된 탭의 내용입니다.
///
/// `tabs.tsx`의 `TabsContent`를 옮긴 것입니다. React 패널은 `flex-1 text-sm`이라
/// 남는 자리를 채우고, 선택되지 않은 패널은 숨습니다. 이 위젯은 [HoronTabs]의
/// 직계 자식이어야 합니다: 남는 자리를 차지하려고 [Flexible]을 씁니다.
class HoronTabsContent extends StatelessWidget {
  /// 내용 하나를 만듭니다.
  const HoronTabsContent({super.key, required this.value, required this.child});

  /// 이 내용이 보이는 탭의 값입니다.
  final String value;

  /// 탭이 선택됐을 때 보이는 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool active = _HoronTabsScope.maybeOf(context)?.selected == value;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.body,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return Flexible(
      fit: FlexFit.loose,
      child: active ? DefaultTextStyle.merge(style: style, child: child) : const SizedBox.shrink(),
    );
  }
}
