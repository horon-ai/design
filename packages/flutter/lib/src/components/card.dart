import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `card.tsx`의 `size` 옵션입니다.
///
/// React는 cva 대신 `size?: "default" | "sm"`을 직접 받습니다. 키 이름은 같고
/// Dart 예약어인 `default`만 `defaultValue`로 적습니다.
enum HoronCardSize {
  /// `[--card-spacing:18px]` - 기본 크기입니다.
  defaultValue,

  /// `data-[size=sm]:[--card-spacing:--spacing(3)]` - 여백이 12로 줄어듭니다.
  sm,
}

/// `card.tsx`의 `[--card-spacing:18px]`입니다. 4px 스케일의 단계가 아니라
/// 카드가 자기 여백으로 들고 있는 값이라 이름을 붙입니다.
const double _cardSpacing = 18.0;

/// `card.tsx`의 `data-[size=sm]:[--card-spacing:--spacing(3)]`입니다. `spacing(3)`은 12입니다.
const double _cardSpacingSm = HoronSpace.s3;

/// `card.tsx`의 `gap-2.5`입니다. 2.5 × 4 = 10입니다.
const double _cardGap = HoronSpace.s2_5;

/// `card.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값이라 이름을 붙입니다.
const double _cardFontSize = 13.0;

/// `card.tsx`의 `text-base`입니다. 생성 스케일의 `lead`(16)와 같은 값입니다.
const double _cardTitleFontSize = HoronText.lead;

/// `card.tsx`의 `group-data-[size=sm]/card:text-sm`입니다.
const double _cardTitleFontSizeSm = HoronText.body;

/// 카드 안쪽 여백을 자식에게 알리는 스코프입니다.
///
/// React는 `--card-spacing` 커스텀 프로퍼티를 카드에 심고 헤더·내용·푸터가 그것을
/// 읽습니다. Flutter에는 상속되는 커스텀 프로퍼티가 없으므로 이 스코프가 그 자리를
/// 대신합니다. 카드 밖에서 파트를 단독으로 쓸 때는 기본 여백(18)을 씁니다.
class _HoronCardScope extends InheritedWidget {
  const _HoronCardScope({required this.spacing, required this.size, required super.child});

  final double spacing;
  final HoronCardSize size;

  static _HoronCardScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronCardScope>();

  @override
  bool updateShouldNotify(_HoronCardScope oldWidget) => spacing != oldWidget.spacing || size != oldWidget.size;
}

/// `size` 하나가 쓰는 안쪽 여백입니다.
double _spacingOf(HoronCardSize size) => size == HoronCardSize.sm ? _cardSpacingSm : _cardSpacing;

/// 테두리와 카드 색을 가진 표면 하나입니다.
///
/// `card.tsx`의 `Card`를 옮긴 것입니다. `flex flex-col gap-2.5 overflow-hidden
/// rounded-md border border-border bg-card`에 세로 여백 18을 더하고, 자식 사이를
/// 10만큼 띄웁니다. 여백은 [HoronCardHeader]·[HoronCardContent]·[HoronCardFooter]가
/// 스코프로 이어받습니다.
///
/// 푸터가 있으면 아래 여백을 0으로 둡니다(`has-data-[slot=card-footer]:pb-0`).
/// 첫 자식이 이미지면 위 여백을 0으로 둡니다(`has-[>img:first-child]:pt-0`).
///
/// ```dart
/// HoronCard(
///   children: <Widget>[
///     HoronCardHeader(children: <Widget>[HoronCardTitle(text: '제목')]),
///     HoronCardContent(child: Text('본문')),
///   ],
/// );
/// ```
class HoronCard extends StatelessWidget {
  /// 카드 하나를 만듭니다.
  const HoronCard({super.key, this.size = HoronCardSize.defaultValue, required this.children});

  /// 크기입니다. `sm`은 여백을 12로 줄입니다.
  final HoronCardSize size;

  /// 카드 안에 세로로 쌓을 파트들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double spacing = _spacingOf(size);
    final bool hasFooter = children.any((Widget child) => child is HoronCardFooter);
    final bool firstIsImage = children.isNotEmpty && children.first is Image;
    final BorderRadius radius = BorderRadius.circular(HoronRadiusRole.card);

    final TextStyle baseStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _cardFontSize,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중 밑줄이
      // 새어 들어오지 않게 명시합니다.
      decoration: TextDecoration.none,
    );

    return _HoronCardScope(
      spacing: spacing,
      size: size,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: scheme.surfaceContainerLow,
          borderRadius: radius,
          border: Border.all(color: scheme.outline),
        ),
        child: ClipRRect(
          borderRadius: radius,
          child: Padding(
            padding: EdgeInsets.only(
              top: firstIsImage ? HoronSpace.s0 : spacing,
              bottom: hasFooter ? HoronSpace.s0 : spacing,
            ),
            child: DefaultTextStyle.merge(
              style: baseStyle,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                spacing: _cardGap,
                children: children,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 카드의 머리말입니다.
///
/// `card.tsx`의 `CardHeader`입니다. React는 `grid auto-rows-min items-start gap-1`에
/// 액션이 있으면 두 번째 열을 더하고 설명이 있으면 두 번째 행을 더합니다. Flutter는
/// [HoronCardAction]이 자식에 있으면 오른쪽 열로, 나머지를 왼쪽 열로 나눠 같은 배치를
/// 만듭니다.
class HoronCardHeader extends StatelessWidget {
  /// 머리말 하나를 만듭니다.
  const HoronCardHeader({super.key, required this.children, this.padding});

  /// 제목·설명·액션 파트입니다. 액션은 오른쪽 위로 빠집니다.
  final List<Widget> children;

  /// 좌우 여백을 직접 정합니다. 없으면 카드 스코프의 여백을 씁니다.
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final double spacing = padding == null
        ? (_HoronCardScope.maybeOf(context)?.spacing ?? _cardSpacing)
        : HoronSpace.s0;
    HoronCardAction? action;
    final List<Widget> stacked = <Widget>[];
    for (final Widget child in children) {
      if (action == null && child is HoronCardAction) {
        action = child;
      } else {
        stacked.add(child);
      }
    }

    return Padding(
      padding: padding ?? EdgeInsets.symmetric(horizontal: spacing),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              spacing: HoronSpace.s1,
              children: stacked,
            ),
          ),
          if (action != null) ...<Widget>[const SizedBox(width: HoronSpace.s2), action],
        ],
      ),
    );
  }
}

/// 카드의 제목입니다.
///
/// `card.tsx`의 `CardTitle`입니다. `text-base leading-snug font-semibold`이고,
/// 카드가 `sm`이면 `text-sm`으로 줄어듭니다.
class HoronCardTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronCardTitle({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronCardTitle needs a text or a child.');

  /// 제목 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final bool small = _HoronCardScope.maybeOf(context)?.size == HoronCardSize.sm;
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: small ? _cardTitleFontSizeSm : _cardTitleFontSize,
      fontWeight: HoronFontWeight.semibold,
      height: HoronLineHeight.snug,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    if (text != null) {
      return Text(text!, style: base.merge(style));
    }
    return DefaultTextStyle.merge(style: base.merge(style), child: child!);
  }
}

/// 카드의 설명입니다.
///
/// `card.tsx`의 `CardDescription`입니다. `text-[13px] text-muted-foreground`입니다.
class HoronCardDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronCardDescription({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronCardDescription needs a text or a child.');

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
      fontSize: _cardFontSize,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );

    if (text != null) {
      return Text(text!, style: base.merge(style));
    }
    return DefaultTextStyle.merge(style: base.merge(style), child: child!);
  }
}

/// 카드 오른쪽 위에 놓는 액션 자리입니다.
///
/// `card.tsx`의 `CardAction`입니다. React는 `col-start-2 row-span-2 row-start-1
/// self-start justify-self-end`로 두 번째 열의 두 행을 차지합니다. Flutter는
/// [HoronCardHeader]가 이 파트를 찾아 오른쪽 열에 놓습니다. 단독으로 쓰면 오른쪽
/// 위로 붙습니다.
class HoronCardAction extends StatelessWidget {
  /// 액션 자리 하나를 만듭니다.
  const HoronCardAction({super.key, required this.child});

  /// 액션 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) => Align(alignment: AlignmentDirectional.topEnd, child: child);
}

/// 카드의 본문입니다.
///
/// `card.tsx`의 `CardContent`입니다. 좌우 여백만 카드 스코프에서 받습니다.
class HoronCardContent extends StatelessWidget {
  /// 본문 하나를 만듭니다.
  const HoronCardContent({super.key, required this.child, this.padding});

  /// 본문 내용입니다.
  final Widget child;

  /// 좌우 여백을 직접 정합니다. 없으면 카드 스코프의 여백을 씁니다.
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final double spacing = _HoronCardScope.maybeOf(context)?.spacing ?? _cardSpacing;
    return Padding(
      padding: padding ?? EdgeInsets.symmetric(horizontal: spacing),
      child: child,
    );
  }
}

/// 카드의 꼬리말입니다.
///
/// `card.tsx`의 `CardFooter`입니다. `flex items-center rounded-b-md border-t
/// bg-muted/50 p-(--card-spacing)`이라 카드 폭을 꽉 채우고 위에 구분선을 그립니다.
/// 카드는 이 파트가 있으면 아래 여백을 0으로 두어 푸터가 카드 바닥에 붙게 합니다.
class HoronCardFooter extends StatelessWidget {
  /// 꼬리말 하나를 만듭니다.
  const HoronCardFooter({super.key, this.child, this.children, this.padding});

  /// 꼬리말 내용 하나입니다.
  final Widget? child;

  /// 나란히 놓을 내용들입니다. [child]와 함께 쓰지 않습니다.
  final List<Widget>? children;

  /// 안쪽 여백을 직접 정합니다. 없으면 카드 스코프의 여백을 씁니다.
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double spacing = _HoronCardScope.maybeOf(context)?.spacing ?? _cardSpacing;
    final List<Widget> items = children ?? <Widget>[?child];

    return DecoratedBox(
      decoration: BoxDecoration(
        // `bg-muted/50`입니다. muted는 `ColorScheme.surfaceContainer`와 같은 값입니다.
        color: scheme.surfaceContainer.withValues(alpha: 0.5),
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(HoronRadiusRole.card)),
        border: Border(top: BorderSide(color: scheme.outline)),
      ),
      child: Padding(
        padding: padding ?? EdgeInsets.all(spacing),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            for (int index = 0; index < items.length; index++) ...<Widget>[
              if (index > 0) const SizedBox(width: HoronSpace.s2),
              Flexible(child: items[index]),
            ],
          ],
        ),
      ),
    );
  }
}
