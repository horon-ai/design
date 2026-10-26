import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'separator.dart';

/// `list.tsx`의 `px-4`입니다.
const double _listHorizontalPadding = HoronSpace.s4;

/// `list.tsx`의 `py-3`입니다.
const double _listVerticalPadding = HoronSpace.s3;

/// `list.tsx`의 `gap-3`입니다.
const double _listGap = HoronSpace.s3;

/// `list.tsx`의 `size-9`입니다. 미디어 자리의 정사각 크기입니다.
const double _listMediaSize = HoronSpace.s9;

/// `list.tsx`의 `gap-0.5`입니다. 제목과 설명 사이 간격입니다.
const double _listContentGap = HoronSpace.s0_5;

/// `list.tsx`의 `gap-2`입니다. 뒤쪽 슬롯 안의 간격입니다.
const double _listTrailingGap = HoronSpace.s2;

/// `list.tsx`의 `text-sm`입니다.
const double _listFontSize = HoronText.body;

/// `list.tsx`의 `hover:bg-muted/60`입니다.
const double _listHoverAlpha = 0.6;

/// `list.tsx`의 `divide-y`가 그리는 선 두께입니다.
const double _listDividerThickness = 1.0;

/// 섹션 라벨의 위아래 여백입니다. React에는 섹션 라벨이 없어 이 패키지가 더한 값입니다.
const double _listSectionLabelPadding = HoronSpace.s2;

/// 테두리와 카드 표면을 가진 목록입니다.
///
/// `list.tsx`의 `List`를 옮긴 것입니다. React는 `flex w-full flex-col divide-y
/// divide-border overflow-hidden rounded-md border border-border bg-card
/// text-card-foreground`라서 행 사이에 1px 구분선이 있고 바깥에는 테두리와 반경
/// 12가 있습니다. [divided]와 [bordered]는 그 두 성질을 각각 끄는 스위치입니다.
/// React의 기본값은 둘 다 참이므로 아무것도 넘기지 않으면 웹과 같은 모양입니다.
///
/// 행은 [HoronListItem]으로 넣고, 그 안에 [HoronListItemMedia]·
/// [HoronListItemContent]·[HoronListItemTrailing]을 조합합니다.
///
/// ```dart
/// HoronList(
///   children: <Widget>[
///     HoronListItem(
///       interactive: true,
///       onTap: open,
///       children: <Widget>[
///         HoronListItemMedia(child: Icon(Icons.inbox)),
///         HoronListItemContent(
///           children: <Widget>[
///             HoronListItemTitle(text: '받은 편지함'),
///             HoronListItemDescription(text: '읽지 않은 메시지 3개'),
///           ],
///         ),
///       ],
///     ),
///   ],
/// );
/// ```
class HoronList extends StatelessWidget {
  /// 목록 하나를 만듭니다.
  const HoronList({super.key, required this.children, this.divided = true, this.bordered = true});

  /// 목록의 행들입니다. [HoronListItem]이나 [HoronListSection]을 넣습니다.
  final List<Widget> children;

  /// 참이면 행 사이에 1px 구분선을 그립니다(`divide-y divide-border`).
  final bool divided;

  /// 참이면 목록 바깥에 테두리를 두릅니다(`border border-border`).
  final bool bordered;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final BorderRadius radius = BorderRadius.circular(HoronRadiusRole.card);
    final List<Widget> rows = <Widget>[];
    for (int index = 0; index < children.length; index++) {
      if (divided && index > 0) {
        rows.add(const SizedBox(height: _listDividerThickness, child: HoronSeparator()));
      }
      rows.add(children[index]);
    }

    return DecoratedBox(
      decoration: BoxDecoration(
        color: scheme.surfaceContainerLow,
        borderRadius: radius,
        border: bordered ? Border.all(color: scheme.outline) : null,
      ),
      child: ClipRRect(
        borderRadius: radius,
        child: DefaultTextStyle.merge(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _listFontSize,
            fontWeight: HoronFontWeight.regular,
            height: HoronLineHeight.normal,
            color: scheme.onSurface,
            // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중
            // 밑줄이 새어 들어오지 않게 명시합니다.
            decoration: TextDecoration.none,
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: rows),
        ),
      ),
    );
  }
}

/// 목록 안의 한 묶음입니다.
///
/// React `list.tsx`에는 없는 이 패키지의 구성 요소입니다. 계획서가 `ListSection`을
/// 요구했고, 긴 목록을 라벨로 나눌 자리가 필요합니다. [label]을 넘기면 그 위에 흐린
/// 라벨이 붙고, 묶음 안의 행 사이에도 같은 1px 구분선이 그려집니다. 묶음 자체는
/// 목록의 표면을 그리지 않으므로 [HoronList] 안에 넣어 씁니다.
class HoronListSection extends StatelessWidget {
  /// 목록의 한 묶음을 만듭니다.
  const HoronListSection({super.key, required this.children, this.label, this.divided = true});

  /// 묶음의 행들입니다.
  final List<Widget> children;

  /// 묶음 위에 붙는 라벨입니다. 없으면 라벨 행을 그리지 않습니다.
  final String? label;

  /// 참이면 묶음 안의 행 사이에 1px 구분선을 그립니다.
  final bool divided;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final List<Widget> rows = <Widget>[];
    if (label != null) {
      rows.add(
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: _listHorizontalPadding, vertical: _listSectionLabelPadding),
          child: Text(
            label!,
            style: TextStyle(
              fontFamily: HoronFont.body,
              fontFamilyFallback: HoronFont.fontFamilyFallback,
              fontSize: HoronText.caption,
              fontWeight: HoronFontWeight.medium,
              height: HoronLineHeight.normal,
              color: scheme.onSurfaceVariant,
              decoration: TextDecoration.none,
            ),
          ),
        ),
      );
    }
    for (int index = 0; index < children.length; index++) {
      if (divided && index > 0) {
        rows.add(const SizedBox(height: _listDividerThickness, child: HoronSeparator()));
      }
      rows.add(children[index]);
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: rows);
  }
}

/// 목록의 한 행입니다.
///
/// `list.tsx`의 `ListItem`입니다. React는 `flex items-center gap-3 px-4 py-3
/// text-sm`이고, `interactive`이면 `cursor-pointer transition-colors hover:bg-muted/60
/// active:bg-muted`가 붙습니다. 터치에는 hover가 없으므로 [interactive]와 [onTap]이
/// 함께 있으면 누를 수 있는 행이 되고, 누르는 동안 `active:bg-muted`가 칠해집니다.
class HoronListItem extends StatefulWidget {
  /// 목록의 한 행을 만듭니다.
  const HoronListItem({super.key, this.child, this.children, this.interactive = false, this.onTap, this.padding})
    : assert(child != null || children != null, 'HoronListItem needs a child or children.');

  /// 행의 내용 하나입니다. [children]과 함께 쓰지 않습니다.
  final Widget? child;

  /// 행에 나란히 놓을 내용들입니다. [HoronListItemContent]는 남는 폭을 채웁니다.
  final List<Widget>? children;

  /// 참이면 누를 수 있는 행이 됩니다(`data-interactive`).
  final bool interactive;

  /// 누르면 부르는 콜백입니다. [interactive]가 참일 때만 쓰입니다.
  final VoidCallback? onTap;

  /// 좌우·위아래 여백을 직접 정합니다. 없으면 `px-4 py-3`을 씁니다.
  final EdgeInsetsGeometry? padding;

  @override
  State<HoronListItem> createState() => _HoronListItemState();
}

class _HoronListItemState extends State<HoronListItem> {
  bool _hovered = false;
  bool _focused = false;
  bool _pressed = false;

  bool get _interactive => widget.interactive || widget.onTap != null;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final List<Widget> items = widget.children ?? <Widget>[?widget.child];

    final List<Widget> rowChildren = <Widget>[];
    for (int index = 0; index < items.length; index++) {
      if (index > 0) rowChildren.add(const SizedBox(width: _listGap));
      final Widget item = items[index];
      // `ListItemContent`는 `flex-1 min-w-0`이라 남는 폭을 채웁니다.
      rowChildren.add(item is HoronListItemContent ? Expanded(child: item) : item);
    }

    final Color background = !_interactive
        ? Colors.transparent
        : _pressed
        ? scheme.surfaceContainerHighest
        : _hovered
        ? scheme.surfaceContainerHighest.withValues(alpha: _listHoverAlpha)
        : Colors.transparent;

    final Widget content = ColoredBox(
      color: background,
      child: Padding(
        padding:
            widget.padding ??
            const EdgeInsets.symmetric(horizontal: _listHorizontalPadding, vertical: _listVerticalPadding),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: rowChildren,
        ),
      ),
    );

    if (!_interactive) return content;

    return FocusableActionDetector(
      onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
      onShowFocusHighlight: (bool value) => setState(() => _focused = value),
      actions: <Type, Action<Intent>>{
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (ActivateIntent intent) {
            widget.onTap?.call();
            return null;
          },
        ),
      },
      child: Semantics(
        button: true,
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.onTap,
            onTapDown: (_) => setState(() => _pressed = true),
            onTapCancel: () => setState(() => _pressed = false),
            onTapUp: (_) => setState(() => _pressed = false),
            child: DecoratedBox(
              decoration: BoxDecoration(
                boxShadow: _focused
                    ? <BoxShadow>[BoxShadow(color: horon.ring.withValues(alpha: 0.5), spreadRadius: 2)]
                    : null,
              ),
              child: content,
            ),
          ),
        ),
      ),
    );
  }
}

/// 행 왼쪽의 미디어 자리입니다.
///
/// `list.tsx`의 `ListItemMedia`입니다. React는 `flex size-9 shrink-0 items-center
/// justify-center rounded-lg bg-muted text-muted-foreground`이고, 안의 아이콘은
/// `size-4`입니다. 정사각 36에 반경 14(`rounded-lg`)가 붙습니다.
class HoronListItemMedia extends StatelessWidget {
  /// 미디어 자리를 만듭니다.
  const HoronListItemMedia({super.key, required this.child, this.size = _listMediaSize});

  /// 자리 안에 넣는 내용입니다. 아이콘·이니셜·작은 이미지입니다.
  final Widget child;

  /// 자리의 한 변 길이입니다. 기본값은 `size-9`(36)입니다.
  final double size;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox.square(
      dimension: size,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(HoronRadius.lg),
        ),
        child: Center(
          child: IconTheme.merge(
            data: IconThemeData(size: HoronSpace.s4, color: scheme.onSurfaceVariant),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// 행의 제목과 설명을 담는 본문입니다.
///
/// `list.tsx`의 `ListItemContent`입니다. React는 `flex min-w-0 flex-1 flex-col
/// gap-0.5`라 남는 폭을 채우고 자식 사이를 2만큼 띄웁니다. [HoronListItem]이 이
/// 파트를 찾아 `Expanded`로 감싸므로, 넘치는 글자는 말줄임으로 잘립니다.
class HoronListItemContent extends StatelessWidget {
  /// 본문 하나를 만듭니다.
  const HoronListItemContent({super.key, required this.children});

  /// 제목·설명 등 세로로 쌓을 내용입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: _listContentGap,
      children: children,
    );
  }
}

/// 행의 제목입니다.
///
/// `list.tsx`의 `ListItemTitle`입니다. `truncate font-medium text-foreground`라
/// 한 줄로 그리고 넘치면 말줄임합니다.
class HoronListItemTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronListItemTitle({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronListItemTitle needs a text or a child.');

  /// 제목 글자입니다.
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
      fontSize: _listFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );
    if (text != null) {
      return Text(text!, maxLines: 1, overflow: TextOverflow.ellipsis, style: base.merge(style));
    }
    return DefaultTextStyle.merge(style: base.merge(style), child: child!);
  }
}

/// 행의 설명입니다.
///
/// `list.tsx`의 `ListItemDescription`입니다. `truncate text-muted-foreground`라
/// 한 줄로 그리고 넘치면 말줄임합니다.
class HoronListItemDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronListItemDescription({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronListItemDescription needs a text or a child.');

  /// 설명 글자입니다.
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
      fontSize: _listFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );
    if (text != null) {
      return Text(text!, maxLines: 1, overflow: TextOverflow.ellipsis, style: base.merge(style));
    }
    return DefaultTextStyle.merge(style: base.merge(style), child: child!);
  }
}

/// 행 오른쪽 끝의 슬롯입니다.
///
/// `list.tsx`의 `ListItemTrailing`입니다. `ml-auto flex shrink-0 items-center gap-2
/// text-muted-foreground`라 오른쪽으로 붙고 자식 사이를 8만큼 띄웁니다.
class HoronListItemTrailing extends StatelessWidget {
  /// 뒤쪽 슬롯 하나를 만듭니다.
  const HoronListItemTrailing({super.key, this.child, this.children});

  /// 슬롯의 내용 하나입니다.
  final Widget? child;

  /// 슬롯에 나란히 놓을 내용들입니다.
  final List<Widget>? children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final List<Widget> items = children ?? <Widget>[?child];
    final List<Widget> rowChildren = <Widget>[];
    for (int index = 0; index < items.length; index++) {
      if (index > 0) rowChildren.add(const SizedBox(width: _listTrailingGap));
      rowChildren.add(items[index]);
    }
    return IconTheme.merge(
      data: IconThemeData(size: HoronSpace.s4, color: scheme.onSurfaceVariant),
      child: Row(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.center, children: rowChildren),
    );
  }
}
