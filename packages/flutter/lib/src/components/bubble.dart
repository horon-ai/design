import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `bubble.tsx`의 `variant` 옵션입니다.
///
/// React의 cva 키를 그대로 옮겼고, Dart 예약어인 `default`만 `defaultValue`로 적습니다.
/// 정렬(`align`)은 cva 변형 그룹이 아니라 prop이므로 공개 enum을 두지 않고
/// [HoronBubble.alignEnd]로 엽니다.
enum HoronBubbleVariant {
  /// `bg-primary text-primary-foreground`
  defaultValue,

  /// `bg-secondary text-secondary-foreground`
  secondary,

  /// `bg-muted text-foreground`
  muted,

  /// `bg-accent text-accent-foreground`
  tinted,

  /// `border-border bg-background`
  outline,

  /// 배경도 반경도 패딩도 없는 변형입니다(`rounded-none bg-transparent p-0`).
  ghost,

  /// `bg-destructive/10 text-destructive`
  destructive,
}

/// `bubble.tsx`의 `gap-1`입니다. 한 말풍선 안 조각 사이의 간격입니다.
const double _bubbleInnerGap = HoronSpace.s1;

/// `bubble.tsx`의 `gap-2`입니다. 그룹 안 말풍선 사이의 간격입니다.
const double _bubbleGroupGap = HoronSpace.s2;

/// `bubble.tsx`의 `max-w-[80%]`입니다.
const double _bubbleMaxWidthFactor = 0.8;

/// `BubbleContent`의 `px-3`입니다.
const double _bubbleHorizontalPadding = HoronSpace.s3;

/// `BubbleContent`의 `py-2`입니다.
const double _bubbleVerticalPadding = HoronSpace.s2;

/// `BubbleContent`의 `text-sm`입니다.
const double _bubbleFontSize = HoronText.body;

/// `BubbleContent`의 `leading-relaxed`입니다.
const double _bubbleLineHeight = HoronLineHeight.relaxed;

/// `hover:bg-primary/80` 등에서 쓰는 80% 불투명도입니다.
const double _bubbleHoverAlpha = 0.8;

/// `bg-destructive/10`의 10% 불투명도입니다.
const double _bubbleDestructiveAlpha = 0.1;

/// `hover:bg-destructive/20`의 20% 불투명도입니다.
const double _bubbleDestructiveHoverAlpha = 0.2;

/// 꼬리 모서리에 쓰는 반경입니다.
///
/// React `bubble.tsx`에는 꼬리가 없습니다. 계획이 요구한 이 포트의 추가분이고, 값은
/// 화면 쪽 구현(`mobile/lib/src/features/messages/conversation_bubble.dart`)이 쓰는
/// `HoronRadius.sm`을 그대로 따릅니다.
const Radius _bubbleTailRadius = Radius.circular(HoronRadius.sm);

/// 변형 하나가 그리는 색 쌍입니다.
class _HoronBubblePaint {
  const _HoronBubblePaint({
    required this.background,
    required this.foreground,
    required this.border,
    required this.hoverBackground,
    required this.hoverForeground,
  });

  /// 기본 채움입니다.
  final Color background;

  /// 기본 전경입니다.
  final Color foreground;

  /// 테두리 색입니다. `border-transparent`면 투명입니다.
  final Color border;

  /// 누를 수 있는 내용이 hover일 때의 채움입니다.
  final Color hoverBackground;

  /// 누를 수 있는 내용이 hover일 때의 전경입니다.
  final Color hoverForeground;
}

/// 변형 하나의 색을 테마에서 고릅니다.
///
/// React는 부모의 `data-variant`에 따라 자식 `bubble-content`의 색을 정합니다. 이 포트도
/// 같은 방향이라, 색은 [HoronBubble]이 정하고 [HoronBubbleContent]가
/// [_HoronBubbleScope]로 읽습니다.
_HoronBubblePaint _paintFor(HoronBubbleVariant variant, ColorScheme scheme) {
  switch (variant) {
    case HoronBubbleVariant.defaultValue:
      return _HoronBubblePaint(
        background: scheme.primary,
        foreground: scheme.onPrimary,
        border: Colors.transparent,
        hoverBackground: scheme.primary.withValues(alpha: _bubbleHoverAlpha),
        hoverForeground: scheme.onPrimary,
      );
    case HoronBubbleVariant.secondary:
      return _HoronBubblePaint(
        background: scheme.secondary,
        foreground: scheme.onSecondary,
        border: Colors.transparent,
        hoverBackground: scheme.secondary.withValues(alpha: _bubbleHoverAlpha),
        hoverForeground: scheme.onSecondary,
      );
    case HoronBubbleVariant.muted:
      // `bg-muted text-foreground`
      return _HoronBubblePaint(
        background: scheme.surfaceContainerHighest,
        foreground: scheme.onSurface,
        border: Colors.transparent,
        hoverBackground: scheme.surfaceContainerHighest.withValues(alpha: _bubbleHoverAlpha),
        hoverForeground: scheme.onSurface,
      );
    case HoronBubbleVariant.tinted:
      // `bg-accent text-accent-foreground`
      return _HoronBubblePaint(
        background: scheme.surfaceContainer,
        foreground: scheme.onSurface,
        border: Colors.transparent,
        hoverBackground: scheme.surfaceContainer.withValues(alpha: _bubbleHoverAlpha),
        hoverForeground: scheme.onSurface,
      );
    case HoronBubbleVariant.outline:
      // `border-border bg-background`, hover는 `bg-muted text-foreground`
      return _HoronBubblePaint(
        background: scheme.surface,
        foreground: scheme.onSurface,
        border: scheme.outline,
        hoverBackground: scheme.surfaceContainerHighest,
        hoverForeground: scheme.onSurface,
      );
    case HoronBubbleVariant.ghost:
      // `rounded-none bg-transparent p-0`, hover는 `bg-muted text-foreground`
      return _HoronBubblePaint(
        background: Colors.transparent,
        foreground: scheme.onSurface,
        border: Colors.transparent,
        hoverBackground: scheme.surfaceContainerHighest,
        hoverForeground: scheme.onSurface,
      );
    case HoronBubbleVariant.destructive:
      // `bg-destructive/10 text-destructive`, hover는 `bg-destructive/20`
      return _HoronBubblePaint(
        background: scheme.error.withValues(alpha: _bubbleDestructiveAlpha),
        foreground: scheme.error,
        border: Colors.transparent,
        hoverBackground: scheme.error.withValues(alpha: _bubbleDestructiveHoverAlpha),
        hoverForeground: scheme.error,
      );
  }
}

/// 부모 [HoronBubble]의 변형·정렬·꼬리를 자식 [HoronBubbleContent]에 내려보냅니다.
///
/// React는 `data-variant`·`data-align` 속성과 `group/…` 선택자로 같은 일을 합니다.
/// Flutter에는 조상 선택자가 없으므로 이 스코프가 그 자리를 맡습니다.
class _HoronBubbleScope extends InheritedWidget {
  const _HoronBubbleScope({required this.variant, required this.alignEnd, required this.tail, required super.child});

  final HoronBubbleVariant variant;
  final bool alignEnd;
  final bool tail;

  static _HoronBubbleScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronBubbleScope>();

  @override
  bool updateShouldNotify(_HoronBubbleScope oldWidget) =>
      variant != oldWidget.variant || alignEnd != oldWidget.alignEnd || tail != oldWidget.tail;
}

/// `bubble.tsx`의 `BubbleGroup`입니다.
///
/// React는 `flex min-w-0 flex-col gap-2`입니다. 말풍선을 세로로 쌓고, 각 말풍선은 자기
/// 정렬을 스스로 정합니다.
///
/// ```dart
/// HoronBubbleGroup(
///   children: <Widget>[
///     HoronBubble(children: <Widget>[HoronBubbleContent(child: Text('안녕하세요'))]),
///     HoronBubble(
///       alignEnd: true,
///       children: <Widget>[HoronBubbleContent(child: Text('네, 반갑습니다'))],
///     ),
///   ],
/// );
/// ```
class HoronBubbleGroup extends StatelessWidget {
  /// 그룹 하나를 만듭니다.
  const HoronBubbleGroup({super.key, required this.children});

  /// 그룹 안에 세로로 쌓을 말풍선입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: _bubbleGroupGap,
      children: children,
    );
  }
}

/// `bubble.tsx`의 `Bubble`입니다.
///
/// React는 `group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1`이고,
/// `align="end"`면 `self-end`가 붙습니다. 이 위젯은 그 폭 제한과 정렬을 맡고,
/// 표면(색·반경·패딩)은 자식 [HoronBubbleContent]가 그립니다.
///
/// 정렬은 방향을 따릅니다. 왼쪽에서 오른쪽이면 `start`가 왼쪽, 오른쪽에서 왼쪽이면
/// 오른쪽입니다. React의 `self-end`도 같은 규칙입니다.
///
/// [tail]은 이 포트가 더한 꼬리 모서리입니다. React에는 없고 계획이 요구했습니다.
/// 여러 말풍선을 이어 붙일 때는 마지막 하나만 [tail]을 켜 둡니다.
class HoronBubble extends StatelessWidget {
  /// 시작(`start`) 정렬의 말풍선을 만듭니다.
  const HoronBubble({
    super.key,
    this.variant = HoronBubbleVariant.defaultValue,
    this.alignEnd = false,
    this.tail = true,
    required this.children,
  });

  /// 변형입니다.
  final HoronBubbleVariant variant;

  /// 참이면 끝(`end`) 정렬입니다. React의 `align="end"`입니다.
  final bool alignEnd;

  /// 참이면 아래 모서리 하나를 꼬리로 깎습니다.
  final bool tail;

  /// 말풍선 안에 넣을 조각입니다. 보통 [HoronBubbleContent] 하나입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    // ghost는 `max-w-full`, 나머지는 `max-w-[80%]`입니다.
    final double factor = variant == HoronBubbleVariant.ghost ? 1 : _bubbleMaxWidthFactor;
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double maxWidth = constraints.maxWidth.isFinite ? constraints.maxWidth * factor : double.infinity;
        return Align(
          alignment: alignEnd ? AlignmentDirectional.centerEnd : AlignmentDirectional.centerStart,
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: maxWidth),
            child: _HoronBubbleScope(
              variant: variant,
              alignEnd: alignEnd,
              tail: tail,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: alignEnd ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                spacing: _bubbleInnerGap,
                children: children,
              ),
            ),
          ),
        );
      },
    );
  }
}

/// `bubble.tsx`의 `BubbleContent`입니다.
///
/// React는 `w-fit max-w-full min-w-0 overflow-hidden rounded-lg border border-transparent
/// px-3 py-2 text-sm leading-relaxed break-words`이고, 색은 부모의 `data-variant`가
/// 정합니다. 반경은 `rounded-lg`라 [HoronRadiusRole.bubble]이고,
/// [HoronBubbleVariant.ghost]에서만 `rounded-none`·`p-0`이 됩니다.
///
/// [onTap]을 넘기면 React의 `[button,a]` 자리처럼 hover 색이 붙고 커서가 손 모양이
/// 됩니다.
class HoronBubbleContent extends StatefulWidget {
  /// 내용 하나를 만듭니다.
  const HoronBubbleContent({super.key, this.child, this.onTap, this.semanticLabel});

  /// 말풍선 안의 내용입니다.
  final Widget? child;

  /// 누르는 동작입니다. 넘기면 hover 반응이 붙습니다.
  final VoidCallback? onTap;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronBubbleContent> createState() => _HoronBubbleContentState();
}

class _HoronBubbleContentState extends State<HoronBubbleContent> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronBubbleScope? scope = _HoronBubbleScope.maybeOf(context);
    final HoronBubbleVariant variant = scope?.variant ?? HoronBubbleVariant.defaultValue;
    final bool alignEnd = scope?.alignEnd ?? false;
    final bool tail = scope?.tail ?? false;
    final bool ghost = variant == HoronBubbleVariant.ghost;

    final _HoronBubblePaint paint = _paintFor(variant, scheme);
    final bool interactive = widget.onTap != null;
    final bool hovered = interactive && _hovered;

    final double radius = ghost ? HoronRadius.none : HoronRadiusRole.bubble;
    final Radius corner = Radius.circular(radius);
    // 꼬리는 글자가 시작하는 쪽 아래 모서리, `align="end"`에서는 끝 쪽 아래 모서리입니다.
    // `BorderRadiusDirectional`이 RTL에서 좌우를 알아서 바꿉니다.
    final BorderRadiusGeometry borderRadius = BorderRadiusDirectional.only(
      topStart: corner,
      topEnd: corner,
      bottomStart: !alignEnd && tail ? _bubbleTailRadius : corner,
      bottomEnd: alignEnd && tail ? _bubbleTailRadius : corner,
    );

    final Widget surface = DecoratedBox(
      decoration: BoxDecoration(
        color: hovered ? paint.hoverBackground : paint.background,
        borderRadius: borderRadius,
        border: Border.all(color: paint.border),
      ),
      child: Padding(
        padding: ghost
            ? EdgeInsets.zero
            : const EdgeInsets.symmetric(horizontal: _bubbleHorizontalPadding, vertical: _bubbleVerticalPadding),
        child: DefaultTextStyle(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _bubbleFontSize,
            fontWeight: HoronFontWeight.regular,
            height: _bubbleLineHeight,
            color: hovered ? paint.hoverForeground : paint.foreground,
          ),
          child: widget.child ?? const SizedBox.shrink(),
        ),
      ),
    );

    if (!interactive) {
      final String? label = widget.semanticLabel;
      if (label == null) return surface;
      return Semantics(container: true, label: label, child: surface);
    }

    return Semantics(
      button: true,
      label: widget.semanticLabel,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: widget.onTap, child: surface),
      ),
    );
  }
}
