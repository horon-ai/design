import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `empty.tsx`의 `w-[240px]`입니다. 4px 눈금에 없는 값이라 이름을 붙입니다. React는
/// `w-[240px] min-w-0 flex-1`이라 240에서 시작해 부모가 넓으면 늘어납니다. Flutter에서는
/// 고정 240으로 그리고, 늘려야 하는 자리는 호출자가 `Expanded`로 감쌉니다.
const double _emptyWidth = 240.0;

/// `empty.tsx`의 `max-w-sm`입니다. Tailwind의 24rem을 px로 옮긴 384입니다.
const double _emptyMaxWidth = 384.0;

/// `empty.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값입니다.
const double _emptyTitleFontSize = 13.0;

/// `empty.tsx`의 `EmptyMedia`가 고르는 모양입니다.
///
/// cva `variants: { variant: { default, icon } }`의 두 키를 그대로 옮겼습니다.
enum HoronEmptyMediaVariant {
  /// `bg-transparent` - 배경 없이 아이콘만 놓습니다.
  defaultValue,

  /// `size-8 rounded-lg bg-muted text-muted-foreground` - 회색 상자에 24px 아이콘을
  /// 넣습니다.
  icon,
}

/// 비어 있는 상태를 알리는 상자입니다.
///
/// `empty.tsx`를 옮긴 것입니다. React는 `flex w-[240px] min-w-0 flex-1 flex-col
/// items-center justify-center gap-2 rounded-md border p-5 text-center`입니다. 폭은
/// 240으로 시작하고, 부모가 더 넓으면 `flex-1`처럼 늘어납니다. 반경은 `rounded-md`라
/// [HoronRadius.md]이고 테두리는 `border`입니다.
///
/// ```dart
/// const HoronEmpty(
///   header: HoronEmptyHeader(
///     media: HoronEmptyMedia(variant: HoronEmptyMediaVariant.icon, icon: Icon(Icons.inbox)),
///     title: HoronEmptyTitle('받은 편지가 없습니다'),
///     description: HoronEmptyDescription('새 메시지가 오면 여기에 보입니다.'),
///   ),
/// );
/// ```
class HoronEmpty extends StatelessWidget {
  /// 빈 상태 상자 하나를 만듭니다.
  const HoronEmpty({super.key, this.header, this.content, this.child});

  /// 제목·설명 묶음입니다. React의 `EmptyHeader` 자리입니다.
  final HoronEmptyHeader? header;

  /// 다음 행동 묶음입니다. React의 `EmptyContent` 자리입니다.
  final HoronEmptyContent? content;

  /// 위 두 슬롯 대신 넣는 임의 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: _emptyWidth,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(HoronRadius.md),
          border: Border.all(color: scheme.outline),
        ),
        child: Padding(
          padding: const EdgeInsets.all(HoronSpace.s5),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              ?header,
              if (header != null && content != null) const SizedBox(height: HoronSpace.s2),
              ?content,
              ?child,
            ],
          ),
        ),
      ),
    );
  }
}

/// `empty.tsx`의 `EmptyHeader`입니다.
///
/// React는 `flex max-w-sm flex-col items-center gap-2`입니다. 미디어·제목·설명을
/// 세로로 묶고 가운데로 맞춥니다.
class HoronEmptyHeader extends StatelessWidget {
  /// 헤더 하나를 만듭니다.
  const HoronEmptyHeader({super.key, this.media, this.title, this.description, this.child});

  /// 아이콘 또는 미디어입니다.
  final HoronEmptyMedia? media;

  /// 제목입니다.
  final HoronEmptyTitle? title;

  /// 설명입니다.
  final HoronEmptyDescription? description;

  /// 슬롯 대신 넣는 임의 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final List<Widget> children = <Widget>[?media, ?title, ?description, ?child];
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: _emptyMaxWidth),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          for (int index = 0; index < children.length; index++) ...<Widget>[
            if (index > 0) const SizedBox(height: HoronSpace.s2),
            children[index],
          ],
        ],
      ),
    );
  }
}

/// `empty.tsx`의 `EmptyMedia`입니다.
///
/// `variant="icon"`이면 `size-8 rounded-lg bg-muted text-muted-foreground`인 상자에
/// 24px 아이콘을 넣고, 기본값이면 배경 없이 아이콘만 놓습니다. React는 아이콘 위에
/// `mb-2`를 얹습니다.
class HoronEmptyMedia extends StatelessWidget {
  /// 미디어 하나를 만듭니다.
  const HoronEmptyMedia({super.key, this.icon, this.child, this.variant = HoronEmptyMediaVariant.defaultValue});

  /// 표시할 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 아이콘 대신 넣는 내용입니다.
  final Widget? child;

  /// `empty.tsx`의 `variant`입니다.
  final HoronEmptyMediaVariant variant;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Widget? content = child ?? icon;
    if (content == null) return const SizedBox.shrink();

    final Widget iconSlot = IconTheme.merge(
      data: IconThemeData(size: HoronSpace.s6, color: scheme.onSurfaceVariant),
      child: content,
    );

    return ExcludeSemantics(
      child: Padding(
        padding: const EdgeInsets.only(bottom: HoronSpace.s2),
        child: switch (variant) {
          HoronEmptyMediaVariant.defaultValue => iconSlot,
          HoronEmptyMediaVariant.icon => SizedBox.square(
            dimension: HoronSpace.s8,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: scheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(HoronRadius.lg),
              ),
              child: Center(child: iconSlot),
            ),
          ),
        },
      ),
    );
  }
}

/// `empty.tsx`의 `EmptyTitle`입니다.
///
/// React는 `text-[13px] font-semibold tracking-tight`입니다.
class HoronEmptyTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronEmptyTitle(this.title, {super.key, this.child});

  /// 제목 글자입니다.
  final String? title;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _emptyTitleFontSize,
      fontWeight: HoronFontWeight.semibold,
      height: HoronLineHeight.snug,
      letterSpacing: HoronLetterSpacing.tight,
      color: scheme.onSurface,
    );
    return title != null
        ? Text(title!, textAlign: TextAlign.center, style: style)
        : DefaultTextStyle(style: style, textAlign: TextAlign.center, child: child!);
  }
}

/// `empty.tsx`의 `EmptyDescription`입니다.
///
/// React는 `text-xs text-muted-foreground`입니다.
class HoronEmptyDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronEmptyDescription(this.description, {super.key, this.child});

  /// 설명 글자입니다.
  final String? description;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.caption,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
    );
    return description != null
        ? Text(description!, textAlign: TextAlign.center, style: style)
        : DefaultTextStyle(style: style, textAlign: TextAlign.center, child: child!);
  }
}

/// `empty.tsx`의 `EmptyContent`입니다.
///
/// React는 `flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm`입니다.
/// 버튼처럼 다음 행동을 담습니다.
class HoronEmptyContent extends StatelessWidget {
  /// 행동 묶음 하나를 만듭니다.
  const HoronEmptyContent({super.key, this.child});

  /// 묶음 안의 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: _emptyMaxWidth),
      child: DefaultTextStyle(
        style: TextStyle(
          fontFamily: HoronFont.body,
          fontFamilyFallback: HoronFont.fontFamilyFallback,
          fontSize: HoronText.body,
          fontWeight: HoronFontWeight.regular,
          height: HoronLineHeight.normal,
          color: scheme.onSurface,
        ),
        textAlign: TextAlign.center,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            if (child != null) ...<Widget>[const SizedBox(height: HoronSpace.s2_5), child!],
          ],
        ),
      ),
    );
  }
}
