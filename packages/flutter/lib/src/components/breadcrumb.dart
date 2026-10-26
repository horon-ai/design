import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `breadcrumb.tsx`의 `gap-1.5`입니다. 좁은 폭의 항목 간격입니다.
const double _breadcrumbGap = HoronSpace.s1_5;

/// `breadcrumb.tsx`의 `sm:gap-2`입니다. 넓은 폭의 항목 간격입니다.
const double _breadcrumbGapWide = HoronSpace.s2;

/// `breadcrumb.tsx`의 `text-sm`입니다.
const double _breadcrumbFontSize = HoronText.body;

/// `breadcrumb.tsx`의 `rounded-sm`입니다. 링크의 포커스 반경입니다.
const double _breadcrumbLinkRadius = HoronRadius.sm;

/// `breadcrumb.tsx`의 `[&>svg]:size-3.5`입니다. 구분자 아이콘 크기입니다.
const double _breadcrumbSeparatorSize = HoronSpace.s3_5;

/// `breadcrumb.tsx`의 `text-muted-foreground/70`입니다.
const double _breadcrumbSeparatorAlpha = 0.7;

/// `breadcrumb.tsx`의 `size-6`입니다. 말줄임 자리의 정사각 크기입니다.
const double _breadcrumbEllipsisSize = HoronSpace.s6;

/// `breadcrumb.tsx`의 `[&>svg]:size-4`입니다. 말줄임 아이콘 크기입니다.
const double _breadcrumbEllipsisIconSize = HoronSpace.s4;

/// `breadcrumb.tsx`의 `focus-visible:ring-3`입니다.
const double _breadcrumbRingWidth = 3.0;

/// `breadcrumb.tsx`의 `ring-ring/50`입니다.
const double _breadcrumbRingAlpha = 0.5;

/// 접을 때 남겨야 하는 최소 자리 수입니다. 첫 항목·말줄임·마지막 항목이 함께 남아야
/// 하므로 [HoronBreadcrumb.maxItems]는 3 이상이어야 합니다.
const int _breadcrumbMinSlots = 3;

/// 경로를 보여 주는 내비게이션입니다.
///
/// `breadcrumb.tsx`의 `Breadcrumb`입니다. React는 `nav aria-label="breadcrumb"`에
/// `w-full`을 줍니다. 이 위젯은 [children]을 받아 항목 사이에 [HoronBreadcrumbSeparator]를
/// 자동으로 넣고, [maxItems]를 넘기면 **가운데 항목만** 말줄임으로 접습니다. 첫 항목과
/// 마지막 항목은 어떤 경우에도 그대로 남습니다.
///
/// 조각을 직접 배치하려면 [HoronBreadcrumbList]에 항목과 구분자를 섞어 넣으십시오.
///
/// ```dart
/// HoronBreadcrumb(
///   maxItems: 4,
///   children: <Widget>[
///     HoronBreadcrumbItem(child: HoronBreadcrumbLink(text: '홈', onTap: goHome)),
///     HoronBreadcrumbItem(child: HoronBreadcrumbLink(text: '설정', onTap: goSettings)),
///     HoronBreadcrumbItem(child: HoronBreadcrumbPage(text: '프로필')),
///   ],
/// );
/// ```
class HoronBreadcrumb extends StatelessWidget {
  /// 경로 내비게이션 하나를 만듭니다.
  const HoronBreadcrumb({
    super.key,
    required this.children,
    this.maxItems,
    this.separator = const HoronBreadcrumbSeparator(),
    this.semanticLabel,
  }) : assert(
         maxItems == null || maxItems >= _breadcrumbMinSlots,
         'maxItems must leave room for the first item, the ellipsis and the last item.',
       );

  /// 항목들입니다. 보통 [HoronBreadcrumbItem]을 넣습니다.
  final List<Widget> children;

  /// 한 줄에 보여 줄 자리 수의 상한입니다. 항목 수가 이보다 많으면 가운데 항목이
  /// 말줄임 하나로 접힙니다. null이면 접지 않습니다.
  final int? maxItems;

  /// 항목 사이에 넣는 구분자입니다. 기본값은 오른쪽 화살표입니다.
  final Widget separator;

  /// 내비게이션의 접근성 이름입니다. React의 `aria-label="breadcrumb"` 자리입니다.
  final String? semanticLabel;

  /// [maxItems]에 맞춰 가운데를 접고, 항목 사이에 구분자를 끼운 목록입니다.
  ///
  /// 접히는 자리는 언제나 가운데입니다. 첫 항목과 마지막 항목은 남고, 그 사이의 연속
  /// 구간 하나가 [HoronBreadcrumbEllipsis]로 바뀝니다.
  List<Widget> get _arranged {
    final int? limit = maxItems;
    final List<Widget> kept;
    if (limit == null || children.length <= limit) {
      kept = children;
    } else {
      // 첫 항목 + 말줄임 + 마지막 항목이 최소 자리이고, 남는 자리는 마지막 앞쪽에
      // 채웁니다. 그래야 접히는 구간이 언제나 가운데에 있습니다.
      final int trailing = limit - _breadcrumbMinSlots;
      kept = <Widget>[
        children.first,
        const HoronBreadcrumbItem(child: HoronBreadcrumbEllipsis()),
        ...children.sublist(children.length - 1 - trailing),
      ];
    }

    final List<Widget> arranged = <Widget>[];
    for (int index = 0; index < kept.length; index++) {
      if (index > 0) arranged.add(separator);
      arranged.add(kept[index]);
    }
    return arranged;
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: semanticLabel,
      child: HoronBreadcrumbList(children: _arranged),
    );
  }
}

/// 경로 항목을 가로로 늘어놓는 줄입니다.
///
/// `breadcrumb.tsx`의 `BreadcrumbList`입니다. React는 `flex flex-wrap items-center
/// gap-1.5 text-sm break-words text-muted-foreground sm:gap-2`라 좁은 폭에서는 항목
/// 사이가 6, [HoronBreakpoint.sm]보다 넓으면 8이 됩니다. 넘치면 다음 줄로 흘립니다.
class HoronBreadcrumbList extends StatelessWidget {
  /// 항목 줄 하나를 만듭니다.
  const HoronBreadcrumbList({super.key, required this.children});

  /// 항목과 구분자들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool wide = MediaQuery.sizeOf(context).width >= HoronBreakpoint.sm;
    return DefaultTextStyle.merge(
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: _breadcrumbFontSize,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.normal,
        color: scheme.onSurfaceVariant,
        // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중 밑줄이
        // 새어 들어오지 않게 명시합니다.
        decoration: TextDecoration.none,
      ),
      child: Wrap(
        crossAxisAlignment: WrapCrossAlignment.center,
        spacing: wide ? _breadcrumbGapWide : _breadcrumbGap,
        runSpacing: _breadcrumbGap,
        children: children,
      ),
    );
  }
}

/// 경로의 한 항목입니다(`li`).
///
/// `breadcrumb.tsx`의 `BreadcrumbItem`입니다. `inline-flex items-center gap-1.5`라
/// 안쪽 조각 사이를 6만큼 띄웁니다.
class HoronBreadcrumbItem extends StatelessWidget {
  /// 항목 하나를 만듭니다.
  const HoronBreadcrumbItem({super.key, this.child, this.children})
    : assert(child != null || children != null, 'HoronBreadcrumbItem needs a child or children.');

  /// 항목의 내용 하나입니다.
  final Widget? child;

  /// 항목에 나란히 놓을 내용들입니다. [child]와 함께 쓰지 않습니다.
  final List<Widget>? children;

  @override
  Widget build(BuildContext context) {
    final List<Widget> items = children ?? <Widget>[?child];
    final List<Widget> rowChildren = <Widget>[];
    for (int index = 0; index < items.length; index++) {
      if (index > 0) rowChildren.add(const SizedBox(width: _breadcrumbGap));
      rowChildren.add(items[index]);
    }
    return Row(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.center, children: rowChildren);
  }
}

/// 누를 수 있는 경로 항목입니다.
///
/// `breadcrumb.tsx`의 `BreadcrumbLink`입니다. React는 `rounded-sm transition-colors
/// outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50`
/// 이라 hover에서 글자가 `foreground`로 진해지고 포커스에서 링이 그려집니다.
class HoronBreadcrumbLink extends StatefulWidget {
  /// 링크 하나를 만듭니다.
  const HoronBreadcrumbLink({super.key, this.text, this.child, this.onTap, this.style})
    : assert(text != null || child != null, 'HoronBreadcrumbLink needs a text or a child.');

  /// 링크 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 누르면 부르는 콜백입니다. null이면 누를 수 없고 hover 반응도 없습니다.
  final VoidCallback? onTap;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  @override
  State<HoronBreadcrumbLink> createState() => _HoronBreadcrumbLinkState();
}

class _HoronBreadcrumbLinkState extends State<HoronBreadcrumbLink> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool interactive = widget.onTap != null;

    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _breadcrumbFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: _hovered && interactive ? scheme.onSurface : scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );

    final Widget content = DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(_breadcrumbLinkRadius),
        boxShadow: _focused && interactive
            ? <BoxShadow>[
                BoxShadow(
                  color: horon.ring.withValues(alpha: _breadcrumbRingAlpha),
                  spreadRadius: _breadcrumbRingWidth,
                ),
              ]
            : null,
      ),
      child: widget.text != null
          ? Text(widget.text!, style: base.merge(widget.style))
          : DefaultTextStyle.merge(style: base.merge(widget.style), child: widget.child!),
    );

    if (!interactive) return content;

    return Semantics(
      button: true,
      child: FocusableActionDetector(
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onTap!();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: widget.onTap, child: content),
        ),
      ),
    );
  }
}

/// 현재 위치를 가리키는 항목입니다.
///
/// `breadcrumb.tsx`의 `BreadcrumbPage`입니다. React는 `role="link"
/// aria-disabled="true" aria-current="page"`에 `font-normal text-foreground`라
/// 누를 수 없고 글자만 진합니다.
class HoronBreadcrumbPage extends StatelessWidget {
  /// 현재 위치 항목 하나를 만듭니다.
  const HoronBreadcrumbPage({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronBreadcrumbPage needs a text or a child.');

  /// 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _breadcrumbFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );
    // React의 `aria-current="page"`에 해당합니다.
    return Semantics(
      selected: true,
      child: text != null
          ? Text(text!, style: base.merge(style))
          : DefaultTextStyle.merge(style: base.merge(style), child: child!),
    );
  }
}

/// 항목 사이의 구분자입니다.
///
/// `breadcrumb.tsx`의 `BreadcrumbSeparator`입니다. React는 `role="presentation"
/// aria-hidden="true"`에 `text-muted-foreground/70`을 주고 기본값으로 오른쪽 화살표를
/// 그립니다. [child]를 넘기면 그 내용이 화살표를 대신합니다.
class HoronBreadcrumbSeparator extends StatelessWidget {
  /// 구분자 하나를 만듭니다.
  const HoronBreadcrumbSeparator({super.key, this.child});

  /// 화살표 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final Color color = Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: _breadcrumbSeparatorAlpha);
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: _breadcrumbSeparatorSize,
        child: child == null
            ? CustomPaint(painter: _HoronBreadcrumbChevronPainter(color))
            : IconTheme.merge(
                data: IconThemeData(size: _breadcrumbSeparatorSize, color: color),
                child: child!,
              ),
      ),
    );
  }
}

/// 가운데 항목이 접혔다는 표시입니다.
///
/// `breadcrumb.tsx`의 `BreadcrumbEllipsis`입니다. React는 `size-6` 자리에
/// `MoreHorizontalIcon`을 그리고 `role="presentation" aria-hidden="true"`로 의미
/// 정보를 감춥니다. 이 위젯도 같은 점 세 개를 직접 그리고 [ExcludeSemantics]로 감춥니다.
class HoronBreadcrumbEllipsis extends StatelessWidget {
  /// 말줄임 표시 하나를 만듭니다.
  const HoronBreadcrumbEllipsis({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: _breadcrumbEllipsisSize,
        child: Center(
          child: SizedBox.square(
            dimension: _breadcrumbEllipsisIconSize,
            child: CustomPaint(painter: _HoronBreadcrumbEllipsisPainter(scheme.onSurfaceVariant)),
          ),
        ),
      ),
    );
  }
}

/// lucide `chevron-right`의 `m9 18 6-6-6-6`을 그립니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않고 호스트 앱이 공급합니다. 아이콘 글리프에
/// 맡기면 폰트를 싣지 않은 호스트에서 빈 네모가 되므로 선 두 개로 그립니다.
class _HoronBreadcrumbChevronPainter extends CustomPainter {
  const _HoronBreadcrumbChevronPainter(this.color);

  /// 선 색입니다. `text-muted-foreground/70`을 씁니다.
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final double unit = size.width / 24;
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = unit * 2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(
      Path()
        ..moveTo(unit * 9, unit * 18)
        ..lineTo(unit * 15, unit * 12)
        ..lineTo(unit * 9, unit * 6),
      stroke,
    );
  }

  @override
  bool shouldRepaint(_HoronBreadcrumbChevronPainter oldDelegate) => color != oldDelegate.color;
}

/// lucide `more-horizontal`의 점 세 개를 그립니다.
class _HoronBreadcrumbEllipsisPainter extends CustomPainter {
  const _HoronBreadcrumbEllipsisPainter(this.color);

  /// 점 색입니다. `text-muted-foreground`를 씁니다.
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    // 24 그리드의 (5,12)·(12,12)·(19,12)에 점을 그립니다.
    final Paint paint = Paint()..color = color;
    final double unit = size.width / 24;
    final double radius = unit * 1.6;
    for (final double x in <double>[5, 12, 19]) {
      canvas.drawCircle(Offset(x * unit, size.height / 2), radius, paint);
    }
  }

  @override
  bool shouldRepaint(_HoronBreadcrumbEllipsisPainter oldDelegate) => color != oldDelegate.color;
}
