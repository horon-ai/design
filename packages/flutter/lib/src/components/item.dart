import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';
import 'separator.dart';

/// `item.tsx`의 `itemVariants` `variant` 옵션입니다.
enum HoronItemVariant {
  /// `bg-transparent` - 표면 없이 내용만 놓습니다.
  defaultValue,

  /// `border-border` - 테두리만 있는 변형입니다.
  outline,

  /// `bg-muted/50` - 흐린 표면을 깔아 묶음을 구분합니다.
  muted,
}

/// `item.tsx`의 `itemVariants` `size` 옵션입니다.
enum HoronItemSize {
  /// `gap-4 p-4` - 간격 16, 여백 16입니다.
  defaultValue,

  /// `gap-2.5 px-4 py-3` - 간격 10, 좌우 16, 위아래 12입니다.
  sm,
}

/// `item.tsx`의 `itemMediaVariants` `variant` 옵션입니다.
enum HoronItemMediaVariant {
  /// `bg-transparent` - 배경 없이 내용만 놓습니다.
  defaultValue,

  /// `size-8 rounded-sm border border-border bg-muted` - 아이콘을 담는 32 정사각입니다.
  icon,

  /// `size-10 overflow-hidden rounded-sm` - 이미지를 담는 40 정사각입니다.
  image,
}

/// `item.tsx`의 `text-sm`입니다.
const double _itemFontSize = HoronText.body;

/// `item.tsx`의 `rounded-md`입니다. 항목 표면의 반경입니다.
const double _itemRadius = HoronRadius.md;

/// `item.tsx`의 `p-4`/`px-4`입니다.
const double _itemPadding = HoronSpace.s4;

/// `item.tsx`의 `py-3`입니다.
const double _itemPaddingSmVertical = HoronSpace.s3;

/// `item.tsx`의 `gap-4`입니다.
const double _itemGap = HoronSpace.s4;

/// `item.tsx`의 `gap-2.5`입니다.
const double _itemGapSm = HoronSpace.s2_5;

/// `item.tsx`의 `gap-1`입니다. 본문 안쪽 간격입니다.
const double _itemContentGap = HoronSpace.s1;

/// `item.tsx`의 `gap-2`입니다. 제목 안과 액션 안의 간격입니다.
const double _itemInlineGap = HoronSpace.s2;

/// `item.tsx`의 `size-8`입니다.
const double _itemMediaIconSize = HoronSpace.s8;

/// `item.tsx`의 `size-10`입니다.
const double _itemMediaImageSize = HoronSpace.s10;

/// `item.tsx`의 `rounded-sm`입니다.
const double _itemMediaRadius = HoronRadius.sm;

/// `item.tsx`의 `bg-muted/50`입니다.
const double _itemMutedAlpha = 0.5;

/// `item.tsx`의 `line-clamp-2`입니다.
const int _itemDescriptionMaxLines = 2;

/// `item.tsx`의 `group-has-[[data-slot=item-description]]/item:translate-y-0.5`입니다.
const double _itemMediaDescriptionShift = HoronSpace.s0_5;

/// 항목 조각들이 부모의 구성을 읽는 범위입니다.
///
/// React는 부모의 `data-slot`을 CSS 선택자로 읽어 설명이 있으면 미디어를 2만큼
/// 아래로 내립니다. Flutter에는 그 선택자가 없으므로 이 범위가 같은 정보를 나릅니다.
class _HoronItemScope extends InheritedWidget {
  const _HoronItemScope({required this.hasDescription, required super.child});

  final bool hasDescription;

  static bool hasDescriptionOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronItemScope>()?.hasDescription ?? false;

  @override
  bool updateShouldNotify(_HoronItemScope oldWidget) => hasDescription != oldWidget.hasDescription;
}

/// [children] 안에 설명이 있는지 찾습니다.
///
/// React의 `group-has-[[data-slot=item-description]]/item`은 직계 자식이 아니라
/// 서브트리 전체를 봅니다. 설명은 보통 [HoronItemContent] 안에 들어가므로 그 안까지
/// 내려가서 찾습니다.
bool _containsDescription(List<Widget> children) {
  for (final Widget child in children) {
    if (child is HoronItemDescription) return true;
    if (child is HoronItemContent && _containsDescription(child.children)) return true;
  }
  return false;
}

/// 변형과 크기 하나가 그리는 표면 값입니다.
class _HoronItemSpec {
  const _HoronItemSpec({required this.background, required this.border, required this.gap, required this.padding});

  final Color background;
  final Color border;
  final double gap;
  final EdgeInsetsGeometry padding;
}

/// 변형·크기 하나의 표면 값을 만듭니다.
_HoronItemSpec _itemSpecFor(HoronItemVariant variant, HoronItemSize size, ColorScheme scheme) {
  final Color background = switch (variant) {
    HoronItemVariant.defaultValue => Colors.transparent,
    HoronItemVariant.outline => Colors.transparent,
    HoronItemVariant.muted => scheme.surfaceContainerHighest.withValues(alpha: _itemMutedAlpha),
  };
  final Color border = variant == HoronItemVariant.outline ? scheme.outline : Colors.transparent;
  final double gap = size == HoronItemSize.sm ? _itemGapSm : _itemGap;
  final EdgeInsetsGeometry padding = size == HoronItemSize.sm
      ? const EdgeInsets.symmetric(horizontal: _itemPadding, vertical: _itemPaddingSmVertical)
      : const EdgeInsets.all(_itemPadding);
  return _HoronItemSpec(background: background, border: border, gap: gap, padding: padding);
}

/// 항목 하나를 담는 표면입니다.
///
/// `item.tsx`의 `Item`입니다. React는 `flex flex-wrap items-center rounded-md
/// border border-transparent text-sm`에 변형과 크기 클래스를 더합니다. Flutter에는
/// 줄바꿈 flex가 없으므로, 본문인 [HoronItemContent]가 남는 폭을 채우고 나머지
/// 파트는 고정 폭으로 양옆에 놓는 `Row`로 옮겼습니다. 좁은 폭에서도 넘치지 않는
/// 이유는 줄어들 수 있는 쪽이 본문 하나이기 때문입니다.
///
/// ```dart
/// HoronItem(
///   variant: HoronItemVariant.outline,
///   children: <Widget>[
///     HoronItemMedia(variant: HoronItemMediaVariant.icon, child: Icon(Icons.mail)),
///     HoronItemContent(
///       children: <Widget>[
///         HoronItemTitle(text: '알림'),
///         HoronItemDescription(text: '새 메시지가 도착했습니다.'),
///       ],
///     ),
///     HoronItemActions(children: <Widget>[Text('열기')]),
///   ],
/// );
/// ```
class HoronItem extends StatelessWidget {
  /// 항목 하나를 만듭니다.
  const HoronItem({
    super.key,
    required this.children,
    this.variant = HoronItemVariant.defaultValue,
    this.size = HoronItemSize.defaultValue,
  });

  /// 항목 안에 나란히 놓을 파트들입니다.
  final List<Widget> children;

  /// 변형입니다. React의 `defaultVariants.variant`와 같은 기본값입니다.
  final HoronItemVariant variant;

  /// 크기입니다. React의 `defaultVariants.size`와 같은 기본값입니다.
  final HoronItemSize size;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronItemSpec spec = _itemSpecFor(variant, size, scheme);
    final bool hasDescription = _containsDescription(children);

    final List<Widget> rowChildren = <Widget>[];
    for (int index = 0; index < children.length; index++) {
      if (index > 0) rowChildren.add(SizedBox(width: spec.gap));
      final Widget child = children[index];
      // `ItemContent`는 `flex-1`이라 남는 폭을 채웁니다.
      rowChildren.add(child is HoronItemContent ? Expanded(child: child) : child);
    }

    return _HoronItemScope(
      hasDescription: hasDescription,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: spec.background,
          borderRadius: BorderRadius.circular(_itemRadius),
          border: Border.all(color: spec.border),
        ),
        child: Padding(
          padding: spec.padding,
          child: DefaultTextStyle.merge(
            style: TextStyle(
              fontFamily: HoronFont.body,
              fontFamilyFallback: HoronFont.fontFamilyFallback,
              fontSize: _itemFontSize,
              fontWeight: HoronFontWeight.regular,
              height: HoronLineHeight.normal,
              color: scheme.onSurface,
              // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중
              // 밑줄이 새어 들어오지 않게 명시합니다.
              decoration: TextDecoration.none,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: rowChildren,
            ),
          ),
        ),
      ),
    );
  }
}

/// 항목의 미디어 자리입니다.
///
/// `item.tsx`의 `ItemMedia`입니다. `default`는 배경이 없고, `icon`은 32 정사각에
/// 테두리와 흐린 배경을, `image`는 40 정사각에 잘라 넣은 그림을 그립니다. 설명이
/// 함께 있으면 React는 미디어를 2만큼 아래로 내립니다.
class HoronItemMedia extends StatelessWidget {
  /// 미디어 자리를 만듭니다.
  const HoronItemMedia({super.key, required this.child, this.variant = HoronItemMediaVariant.defaultValue});

  /// 자리 안에 넣는 내용입니다.
  final Widget child;

  /// 변형입니다.
  final HoronItemMediaVariant variant;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double shift = _HoronItemScope.hasDescriptionOf(context) ? _itemMediaDescriptionShift : HoronSpace.s0;

    final Widget content = switch (variant) {
      HoronItemMediaVariant.defaultValue => child,
      HoronItemMediaVariant.icon => SizedBox.square(
        dimension: _itemMediaIconSize,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(_itemMediaRadius),
            border: Border.all(color: scheme.outline),
          ),
          child: Center(
            child: IconTheme.merge(
              data: IconThemeData(size: HoronSpace.s4, color: scheme.onSurface),
              child: child,
            ),
          ),
        ),
      ),
      HoronItemMediaVariant.image => ClipRRect(
        borderRadius: BorderRadius.circular(_itemMediaRadius),
        child: SizedBox.square(dimension: _itemMediaImageSize, child: child),
      ),
    };

    return Transform.translate(offset: Offset(HoronSpace.s0, shift), child: content);
  }
}

/// 항목의 본문입니다.
///
/// `item.tsx`의 `ItemContent`입니다. `flex flex-1 flex-col gap-1`이라 남는 폭을
/// 채우고 자식 사이를 8만큼 띄웁니다. [HoronItem]이 이 파트를 찾아 `Expanded`로
/// 감싸므로 본문이 줄어들 수 있는 유일한 자리입니다.
class HoronItemContent extends StatelessWidget {
  /// 본문 하나를 만듭니다.
  const HoronItemContent({super.key, required this.children});

  /// 제목·설명 등 세로로 쌓을 내용입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: _itemContentGap,
      children: children,
    );
  }
}

/// 항목의 제목입니다.
///
/// `item.tsx`의 `ItemTitle`입니다. `flex w-fit items-center gap-2 text-sm
/// leading-snug font-medium`이라 내용 폭만큼만 차지하고, 여러 조각을 넣으면 8만큼
/// 띄웁니다.
class HoronItemTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronItemTitle({super.key, this.text, this.child, this.children, this.style})
    : assert(text != null || child != null || children != null, 'HoronItemTitle needs a text, a child or children.');

  /// 제목 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용 하나입니다.
  final Widget? child;

  /// 나란히 놓을 내용들입니다.
  final List<Widget>? children;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _itemFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.snug,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );
    if (text != null) return Text(text!, style: base.merge(style));

    final List<Widget> items = children ?? <Widget>[?child];
    final List<Widget> rowChildren = <Widget>[];
    for (int index = 0; index < items.length; index++) {
      if (index > 0) rowChildren.add(const SizedBox(width: _itemInlineGap));
      rowChildren.add(items[index]);
    }
    return DefaultTextStyle.merge(
      style: base.merge(style),
      child: Row(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.center, children: rowChildren),
    );
  }
}

/// 항목의 설명입니다.
///
/// `item.tsx`의 `ItemDescription`입니다. `line-clamp-2 text-sm leading-normal
/// font-normal text-muted-foreground`라 두 줄까지만 보이고 나머지는 말줄임됩니다.
class HoronItemDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronItemDescription({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronItemDescription needs a text or a child.');

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
      fontSize: _itemFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );
    if (text != null) {
      return Text(text!, maxLines: _itemDescriptionMaxLines, overflow: TextOverflow.ellipsis, style: base.merge(style));
    }
    return DefaultTextStyle.merge(style: base.merge(style), child: child!);
  }
}

/// 항목 오른쪽의 액션 자리입니다.
///
/// `item.tsx`의 `ItemActions`입니다. `flex items-center gap-2`라 자식 사이를 8만큼
/// 띄웁니다.
class HoronItemActions extends StatelessWidget {
  /// 액션 자리 하나를 만듭니다.
  const HoronItemActions({super.key, required this.children});

  /// 나란히 놓을 액션들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final List<Widget> rowChildren = <Widget>[];
    for (int index = 0; index < children.length; index++) {
      if (index > 0) rowChildren.add(const SizedBox(width: _itemInlineGap));
      rowChildren.add(children[index]);
    }
    return Row(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.center, children: rowChildren);
  }
}

/// 항목 여러 개를 세로로 묶는 그룹입니다.
///
/// `item.tsx`의 `ItemGroup`입니다. `flex flex-col`이라 자식 사이에 간격을 두지
/// 않습니다. 구분선은 [HoronItemSeparator]로 직접 넣습니다.
class HoronItemGroup extends StatelessWidget {
  /// 항목 그룹 하나를 만듭니다.
  const HoronItemGroup({super.key, required this.children});

  /// 세로로 쌓을 항목들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: children),
    );
  }
}

/// 항목 사이에 넣는 구분선입니다.
///
/// `item.tsx`의 `ItemSeparator`입니다. 수평 [HoronSeparator]에 `my-0`을 더한 것이라
/// 세로 여백이 없습니다.
class HoronItemSeparator extends StatelessWidget {
  /// 구분선 하나를 만듭니다.
  const HoronItemSeparator({super.key});

  @override
  Widget build(BuildContext context) => const HoronSeparator();
}
