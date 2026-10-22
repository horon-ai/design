import 'package:flutter/material.dart';

import '../contracts/horon_strings.dart';
import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `pagination.tsx`의 `gap-1`입니다.
const double _paginationGap = HoronSpace.s1;

/// `pagination.tsx`의 `size-8`입니다. 페이지 번호 링크의 정사각 크기입니다.
const double _paginationIconLinkSize = HoronSpace.s8;

/// `pagination.tsx`의 `[&_svg]:size-4`입니다.
const double _paginationIconSize = HoronSpace.s4;

/// `pagination.tsx`의 `PaginationPrevious`가 쓰는 `button.tsx`의 `size="default"`입니다.
const double _paginationTextLinkHeight = HoronButtonMetrics.height;

/// `pagination.tsx`의 `px-2.5`입니다.
const double _paginationTextLinkPadding = HoronSpace.s2_5;

/// `button.tsx`의 `size="default"`가 쓰는 `text-sm`입니다.
const double _paginationFontSize = HoronText.body;

/// `pagination.tsx`의 `rounded-md`입니다.
const double _paginationRadius = HoronRadiusRole.control;

/// `pagination.tsx`의 `focus-visible:ring-[3px] ring-ring/50`입니다.
const double _paginationRingWidth = 3.0;

/// 링의 불투명도입니다(`ring-ring/50`).
const double _paginationRingAlpha = 0.5;

/// 누를 수 없는 링크의 불투명도입니다. React에는 `disabled:` 클래스가 없고 링크를
/// 그리지 않는 쪽으로 끝을 표현하므로, 이 패키지가 흐린 색으로 같은 뜻을 보입니다.
const double _paginationDisabledAlpha = 0.5;

/// 페이지를 넘기는 내비게이션입니다.
///
/// `pagination.tsx`의 `Pagination`입니다. React는 `nav role="navigation"` 안에 `ul`을
/// 두고 그 안에 링크를 나열합니다. 이 위젯은 [page]·[pageCount]를 받아 이전/다음과
/// 페이지 번호, 말줄임을 한 번에 그립니다. 첫 페이지에서는 이전이, 마지막 페이지에서는
/// 다음이 비활성이 됩니다.
///
/// 번호를 직접 배치하려면 [HoronPaginationContent]에 [HoronPaginationItem]과
/// [HoronPaginationLink]를 넣으십시오.
///
/// ```dart
/// HoronPagination(page: page, pageCount: 12, onPageChanged: (int next) => setPage(next));
/// ```
class HoronPagination extends StatelessWidget {
  /// 페이지 내비게이션 하나를 만듭니다.
  const HoronPagination({
    super.key,
    required this.page,
    required this.pageCount,
    this.onPageChanged,
    this.siblingCount = 1,
    this.showLabels = true,
    this.semanticLabel,
  }) : assert(pageCount >= 1, 'pageCount must be at least 1.'),
       assert(page >= 1 && page <= pageCount, 'page must sit between 1 and pageCount.'),
       assert(siblingCount >= 0, 'siblingCount cannot be negative.');

  /// 이전 링크를 찾는 테스트용 키입니다. React의 `data-slot="pagination-previous"` 자리입니다.
  static const Key previousKey = ValueKey<String>('horon-pagination-previous');

  /// 다음 링크를 찾는 테스트용 키입니다. React의 `data-slot="pagination-next"` 자리입니다.
  static const Key nextKey = ValueKey<String>('horon-pagination-next');

  /// 현재 페이지입니다. 1부터 셉니다.
  final int page;

  /// 전체 페이지 수입니다.
  final int pageCount;

  /// 다른 페이지를 고르면 부르는 콜백입니다. null이면 아무 번호도 반응하지 않습니다.
  final ValueChanged<int>? onPageChanged;

  /// 현재 페이지 양옆에 더 보여 줄 페이지 수입니다.
  final int siblingCount;

  /// 참이면 이전·다음에 글자를 함께 그립니다. React는 좁은 화면에서 글자를 숨기므로
  /// (`hidden sm:block`) 폭이 [HoronBreakpoint.sm]보다 좁으면 이 값과 무관하게 아이콘만
  /// 그립니다.
  final bool showLabels;

  /// 내비게이션의 접근성 이름입니다. React의 `aria-label="pagination"` 자리입니다.
  final String? semanticLabel;

  /// [page]·[pageCount]·[siblingCount]가 그리는 번호 목록입니다. 말줄임 자리는 null입니다.
  ///
  /// 첫 페이지와 마지막 페이지는 언제나 남고, 가운데가 벌어지면 그 자리를 말줄임 하나로
  /// 접습니다.
  static List<int?> pageNumbersFor(int page, int pageCount, {int siblingCount = 1}) {
    final int visible = siblingCount * 2 + 5;
    if (pageCount <= visible) {
      return <int>[for (int index = 1; index <= pageCount; index++) index];
    }

    final int left = page - siblingCount < 1 ? 1 : page - siblingCount;
    final int right = page + siblingCount > pageCount ? pageCount : page + siblingCount;
    final bool showLeftEllipsis = left > 2;
    final bool showRightEllipsis = right < pageCount - 1;

    final List<int?> numbers = <int?>[1];
    if (showLeftEllipsis) {
      numbers.add(null);
    } else {
      for (int index = 2; index < left; index++) {
        numbers.add(index);
      }
    }
    for (int index = left; index <= right; index++) {
      if (index == 1 || index == pageCount) continue;
      numbers.add(index);
    }
    if (showRightEllipsis) {
      numbers.add(null);
    } else {
      for (int index = right + 1; index < pageCount; index++) {
        numbers.add(index);
      }
    }
    numbers.add(pageCount);
    return numbers;
  }

  @override
  Widget build(BuildContext context) {
    final HoronStrings strings = HoronTheme.of(context).strings;
    final List<int?> numbers = pageNumbersFor(page, pageCount, siblingCount: siblingCount);

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // `hidden sm:block` - 폭이 sm보다 좁으면 이전·다음의 글자를 감춥니다.
        final bool wide = constraints.maxWidth >= HoronBreakpoint.sm;
        return Semantics(
          container: true,
          label: semanticLabel,
          child: HoronPaginationContent(
            children: <Widget>[
              HoronPaginationItem(
                child: HoronPaginationPrevious(
                  key: previousKey,
                  label: strings.previousPage,
                  showLabel: showLabels && wide,
                  disabled: page <= 1,
                  onTap: page <= 1 || onPageChanged == null ? null : () => onPageChanged!(page - 1),
                ),
              ),
              for (final int? number in numbers)
                HoronPaginationItem(
                  child: number == null
                      ? const HoronPaginationEllipsis()
                      : HoronPaginationLink(
                          label: '$number',
                          isActive: number == page,
                          onTap: onPageChanged == null ? null : () => onPageChanged!(number),
                        ),
                ),
              HoronPaginationItem(
                child: HoronPaginationNext(
                  key: nextKey,
                  label: strings.nextPage,
                  showLabel: showLabels && wide,
                  disabled: page >= pageCount,
                  onTap: page >= pageCount || onPageChanged == null ? null : () => onPageChanged!(page + 1),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// 페이지 링크를 담는 줄입니다.
///
/// `pagination.tsx`의 `PaginationContent`입니다. React는 `flex flex-row items-center
/// gap-1`이고 바깥 `nav`가 `mx-auto flex w-full justify-center`라 한 줄로 놓고
/// 가운데로 모읍니다. Flutter 쪽도 한 줄을 유지하되, 좁은 폭에서 링크가 넘치지 않도록
/// 가로 스크롤로 흘려보냅니다. 링크가 폭 안에 들어가면 가운데에 놓입니다.
class HoronPaginationContent extends StatelessWidget {
  /// 링크 줄 하나를 만듭니다.
  const HoronPaginationContent({super.key, required this.children});

  /// 나란히 놓을 링크들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double viewport = constraints.maxWidth.isFinite ? constraints.maxWidth : HoronBreakpoint.sm;
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: viewport),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              spacing: _paginationGap,
              children: children,
            ),
          ),
        );
      },
    );
  }
}

/// 링크 하나를 감싸는 자리입니다.
///
/// `pagination.tsx`의 `PaginationItem`입니다. React는 `li`에 `flex`만 줍니다.
class HoronPaginationItem extends StatelessWidget {
  /// 링크 자리 하나를 만듭니다.
  const HoronPaginationItem({super.key, required this.child});

  /// 자리 안의 링크입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) => child;
}

/// 페이지 번호 하나입니다.
///
/// `pagination.tsx`의 `PaginationLink`입니다. React는 `buttonVariants`의
/// `variant: isActive ? "outline" : "ghost"`, `size: icon`을 쓰고, 활성 링크에
/// `aria-current="page"`를 답니다. 그래서 활성 번호만 테두리가 있고 나머지는 배경이
/// 없습니다.
class HoronPaginationLink extends StatefulWidget {
  /// 페이지 번호 링크 하나를 만듭니다.
  const HoronPaginationLink({
    super.key,
    this.label,
    this.child,
    this.isActive = false,
    this.disabled = false,
    this.onTap,
  }) : assert(label != null || child != null, 'HoronPaginationLink needs a label or a child.');

  /// 번호 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 현재 페이지인지 여부입니다(`aria-current="page"`).
  final bool isActive;

  /// 누를 수 없는 상태입니다.
  final bool disabled;

  /// 누르면 부르는 콜백입니다.
  final VoidCallback? onTap;

  @override
  State<HoronPaginationLink> createState() => _HoronPaginationLinkState();
}

class _HoronPaginationLinkState extends State<HoronPaginationLink> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final bool enabled = !widget.disabled && widget.onTap != null;

    // 활성 링크는 `variant: outline`이고, 다크에서는 `dark:bg-input/30`이 붙습니다.
    // 나머지는 `variant: ghost`라 hover에서만 표면이 칠해집니다.
    final Color background = widget.isActive
        ? (isDark ? scheme.outline.withValues(alpha: 0.3) : scheme.surface)
        : (_hovered && enabled ? scheme.surfaceContainerHighest : Colors.transparent);
    final Color border = widget.isActive ? scheme.outline : Colors.transparent;
    final Color foreground = widget.disabled
        ? scheme.onSurfaceVariant.withValues(alpha: _paginationDisabledAlpha)
        : scheme.onSurface;

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _paginationFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.none,
      color: foreground,
      decoration: TextDecoration.none,
    );

    final Widget content = DecoratedBox(
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(_paginationRadius),
        border: Border.all(color: border),
        boxShadow: _focused && enabled
            ? <BoxShadow>[
                BoxShadow(
                  color: horon.ring.withValues(alpha: _paginationRingAlpha),
                  spreadRadius: _paginationRingWidth,
                ),
              ]
            : null,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minWidth: _paginationIconLinkSize, minHeight: _paginationIconLinkSize),
        child: Center(
          widthFactor: 1,
          heightFactor: 1,
          child: widget.label != null
              ? Text(widget.label!, maxLines: 1, softWrap: false, style: textStyle)
              : DefaultTextStyle(style: textStyle, child: widget.child!),
        ),
      ),
    );

    return Semantics(
      button: true,
      selected: widget.isActive,
      enabled: enabled,
      child: FocusableActionDetector(
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              if (enabled) widget.onTap!();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: enabled ? widget.onTap : null,
            child: content,
          ),
        ),
      ),
    );
  }
}

/// 이전 페이지 링크입니다.
///
/// `pagination.tsx`의 `PaginationPrevious`입니다. React는 왼쪽 화살표를 그리고
/// `size="default"`, `gap-1 px-2.5`를 씁니다. 첫 페이지에서는 비활성입니다.
class HoronPaginationPrevious extends StatelessWidget {
  /// 이전 링크 하나를 만듭니다.
  const HoronPaginationPrevious({
    super.key,
    required this.label,
    this.onTap,
    this.disabled = false,
    this.showLabel = true,
  });

  /// 글자입니다. 보통 [HoronStrings.previousPage]입니다.
  final String label;

  /// 누르면 부르는 콜백입니다.
  final VoidCallback? onTap;

  /// 누를 수 없는 상태입니다. 첫 페이지에서 참이 됩니다.
  final bool disabled;

  /// 글자를 함께 그릴지 여부입니다.
  final bool showLabel;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Color foreground = disabled
        ? scheme.onSurfaceVariant.withValues(alpha: _paginationDisabledAlpha)
        : scheme.onSurface;
    return _HoronPaginationTextLink(
      label: label,
      leading: _HoronPaginationChevron(color: foreground, forward: false),
      onTap: onTap,
      disabled: disabled,
      showLabel: showLabel,
    );
  }
}

/// 다음 페이지 링크입니다.
///
/// `pagination.tsx`의 `PaginationNext`입니다. React는 `size="default"`,
/// `gap-1 px-2.5`에 글자를 먼저, 오른쪽 화살표를 나중에 그립니다. 마지막 페이지에서는
/// 비활성입니다.
class HoronPaginationNext extends StatelessWidget {
  /// 다음 링크 하나를 만듭니다.
  const HoronPaginationNext({super.key, required this.label, this.onTap, this.disabled = false, this.showLabel = true});

  /// 글자입니다. 보통 [HoronStrings.nextPage]입니다.
  final String label;

  /// 누르면 부르는 콜백입니다.
  final VoidCallback? onTap;

  /// 누를 수 없는 상태입니다. 마지막 페이지에서 참이 됩니다.
  final bool disabled;

  /// 글자를 함께 그릴지 여부입니다.
  final bool showLabel;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Color foreground = disabled
        ? scheme.onSurfaceVariant.withValues(alpha: _paginationDisabledAlpha)
        : scheme.onSurface;
    return _HoronPaginationTextLink(
      label: label,
      trailing: _HoronPaginationChevron(color: foreground, forward: true),
      onTap: onTap,
      disabled: disabled,
      showLabel: showLabel,
    );
  }
}

/// 글자가 있는 이전·다음 링크의 공통 모양입니다.
///
/// `button.tsx`의 `size="default"`(높이 37, 좌우 20)에 `pagination.tsx`의
/// `px-2.5`(10)를 적용합니다. 변형은 `ghost`라 배경이 없고 hover에서만 칠해집니다.
class _HoronPaginationTextLink extends StatefulWidget {
  const _HoronPaginationTextLink({
    required this.label,
    required this.onTap,
    required this.disabled,
    required this.showLabel,
    this.leading,
    this.trailing,
  });

  final String label;
  final VoidCallback? onTap;
  final bool disabled;
  final bool showLabel;
  final Widget? leading;
  final Widget? trailing;

  @override
  State<_HoronPaginationTextLink> createState() => _HoronPaginationTextLinkState();
}

class _HoronPaginationTextLinkState extends State<_HoronPaginationTextLink> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool enabled = !widget.disabled && widget.onTap != null;
    final Color foreground = widget.disabled
        ? scheme.onSurfaceVariant.withValues(alpha: _paginationDisabledAlpha)
        : scheme.onSurface;

    final Widget content = DecoratedBox(
      decoration: BoxDecoration(
        color: _hovered && enabled ? scheme.surfaceContainerHighest : Colors.transparent,
        borderRadius: BorderRadius.circular(_paginationRadius),
        boxShadow: _focused && enabled
            ? <BoxShadow>[
                BoxShadow(
                  color: horon.ring.withValues(alpha: _paginationRingAlpha),
                  spreadRadius: _paginationRingWidth,
                ),
              ]
            : null,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: _paginationTextLinkHeight),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: _paginationTextLinkPadding),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              if (widget.leading != null) widget.leading!,
              if (widget.showLabel) ...<Widget>[
                if (widget.leading != null) const SizedBox(width: _paginationGap),
                Text(
                  widget.label,
                  maxLines: 1,
                  softWrap: false,
                  style: TextStyle(
                    fontFamily: HoronFont.body,
                    fontFamilyFallback: HoronFont.fontFamilyFallback,
                    fontSize: _paginationFontSize,
                    fontWeight: HoronFontWeight.medium,
                    height: HoronLineHeight.none,
                    color: foreground,
                    decoration: TextDecoration.none,
                  ),
                ),
              ],
              if (widget.trailing != null) ...<Widget>[
                if (widget.showLabel) const SizedBox(width: _paginationGap),
                widget.trailing!,
              ],
            ],
          ),
        ),
      ),
    );

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.label,
      child: FocusableActionDetector(
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              if (enabled) widget.onTap!();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: enabled ? widget.onTap : null,
            child: content,
          ),
        ),
      ),
    );
  }
}

/// 더 많은 페이지가 있다는 표시입니다.
///
/// `pagination.tsx`의 `PaginationEllipsis`입니다. React는 `size-8` 자리에
/// `MoreHorizontalIcon`을 그리고 글자는 스크린리더 전용(`sr-only`)으로 둡니다. 이
/// 위젯은 점 세 개를 직접 그리고 의미 정보를 감춥니다([ExcludeSemantics]) — 화면에
/// 보이는 글자가 없으므로 번역할 문구도 없습니다.
class HoronPaginationEllipsis extends StatelessWidget {
  /// 말줄임 표시 하나를 만듭니다.
  const HoronPaginationEllipsis({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: _paginationIconLinkSize,
        child: Center(
          child: SizedBox.square(
            dimension: _paginationIconSize,
            child: CustomPaint(painter: _HoronPaginationEllipsisPainter(scheme.onSurfaceVariant)),
          ),
        ),
      ),
    );
  }
}

/// lucide `more-horizontal`의 점 세 개를 그립니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않고 호스트 앱이 공급합니다. 아이콘 글리프에
/// 맡기면 폰트를 싣지 않은 호스트에서 빈 네모가 되므로 점을 직접 그립니다.
class _HoronPaginationEllipsisPainter extends CustomPainter {
  const _HoronPaginationEllipsisPainter(this.color);

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
  bool shouldRepaint(_HoronPaginationEllipsisPainter oldDelegate) => color != oldDelegate.color;
}

/// lucide `chevron-left`(`m15 18-6-6 6-6`)와 `chevron-right`(`m9 18 6-6-6-6`)을
/// 선 두 개로 그립니다.
class _HoronPaginationChevron extends StatelessWidget {
  const _HoronPaginationChevron({required this.color, required this.forward});

  final Color color;
  final bool forward;

  @override
  Widget build(BuildContext context) {
    return SizedBox.square(
      dimension: _paginationIconSize,
      child: CustomPaint(
        painter: _HoronPaginationChevronPainter(color: color, forward: forward),
      ),
    );
  }
}

class _HoronPaginationChevronPainter extends CustomPainter {
  const _HoronPaginationChevronPainter({required this.color, required this.forward});

  final Color color;
  final bool forward;

  @override
  void paint(Canvas canvas, Size size) {
    final double unit = size.width / 24;
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = unit * 2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final Path path = Path();
    if (forward) {
      path
        ..moveTo(unit * 9, unit * 18)
        ..lineTo(unit * 15, unit * 12)
        ..lineTo(unit * 9, unit * 6);
    } else {
      path
        ..moveTo(unit * 15, unit * 18)
        ..lineTo(unit * 9, unit * 12)
        ..lineTo(unit * 15, unit * 6);
    }
    canvas.drawPath(path, stroke);
  }

  @override
  bool shouldRepaint(_HoronPaginationChevronPainter oldDelegate) =>
      color != oldDelegate.color || forward != oldDelegate.forward;
}
