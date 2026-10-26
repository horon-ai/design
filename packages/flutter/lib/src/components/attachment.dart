import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'file_upload.dart' show formatBytes;

/// `attachment.tsx`의 `attachmentVariants` `size` 옵션입니다.
enum HoronAttachmentSize {
  /// `gap-2 text-sm` - 기본 크기입니다.
  defaultValue,

  /// `gap-2.5 text-xs`
  sm,

  /// `gap-1.5 rounded-md text-xs`
  xs,
}

/// `attachment.tsx`의 `attachmentVariants` `orientation` 옵션입니다.
enum HoronAttachmentOrientation {
  /// `min-w-40 items-center` - 미디어·본문·액션이 한 줄에 섭니다.
  horizontal,

  /// `w-24 flex-col` - 미디어가 위, 본문이 아래에 서고 액션은 오른쪽 위에 겹칩니다.
  vertical,
}

/// `attachment.tsx`의 `attachmentMediaVariants` `variant` 옵션입니다.
enum HoronAttachmentMediaVariant {
  /// 아이콘을 그대로 놓습니다.
  icon,

  /// 그림을 채워 넣고, 끝나기 전에는 60% 불투명도로 보여 줍니다.
  image,
}

/// 첨부의 상태입니다.
///
/// React는 이 값을 cva 변형이 아니라 `state` prop으로 받습니다. 공개 enum으로 두면
/// 변형 게이트가 React에 없는 이름을 보게 되므로 이 파일 안에만 두고, 호출자는
/// [HoronAttachment]·[HoronAttachment.idle]·[HoronAttachment.uploading]·
/// [HoronAttachment.processing]·[HoronAttachment.error]로 고릅니다.
enum _HoronAttachmentState { idle, uploading, processing, error, done }

/// `attachment.tsx`의 `w-10`입니다. 미디어 타일의 기본 한 변입니다.
const double _attachmentMediaSize = HoronSpace.s10;

/// `attachment.tsx`의 `w-8`입니다. `sm`의 미디어 한 변입니다.
const double _attachmentMediaSizeSm = HoronSpace.s8;

/// `attachment.tsx`의 `w-7`입니다. `xs`의 미디어 한 변입니다.
const double _attachmentMediaSizeXs = HoronSpace.s7;

/// `attachment.tsx`의 `w-24`입니다. 수직 방향의 폭입니다.
const double _attachmentWidthVertical = HoronSpace.s24;

/// `attachment.tsx`의 수직 방향 `has-data-[slot=attachment-content]:w-30`입니다.
///
/// 본문이 있으면 폭이 96에서 120으로 늘어납니다. 미디어만 있으면 96 그대로입니다.
const double _attachmentWidthVerticalWithContent = HoronSpace.s24 + HoronSpace.s6;

/// `attachment.tsx`의 `min-w-40`입니다. 수평 방향의 최소 폭입니다.
const double _attachmentMinWidthHorizontal = HoronSpace.s10 * 4;

/// `attachment.tsx`의 `rounded-lg`입니다. 표면과 미디어 타일의 반경입니다.
const double _attachmentRadius = HoronRadius.lg;

/// `attachment.tsx`의 `xs` 변형 `rounded-md`입니다.
const double _attachmentRadiusXs = HoronRadius.md;

/// `attachment.tsx`의 `[&_svg]:size-4`입니다.
const double _attachmentIconSize = HoronSpace.s4;

/// `attachment.tsx`의 수직 방향 `[&_svg]:size-6`입니다.
const double _attachmentIconSizeVertical = HoronSpace.s6;

/// `attachment.tsx`의 `xs` 변형 `[&_svg]:size-3.5`입니다.
const double _attachmentIconSizeXs = HoronSpace.s3_5;

/// `attachment.tsx`의 `gap-1`입니다. 액션 안쪽 간격입니다.
const double _attachmentActionGap = HoronSpace.s1;

/// `attachment.tsx`의 수직 방향 액션 `top-3 right-3`입니다.
const double _attachmentActionInset = HoronSpace.s3;

/// `attachment.tsx`의 `mt-0.5`입니다. 제목과 설명 사이 간격입니다.
const double _attachmentDescriptionGap = HoronSpace.s0_5;

/// `attachment.tsx`의 `text-xs`입니다. 설명의 크기입니다.
const double _attachmentDescriptionFontSize = HoronText.caption;

/// `attachment.tsx`의 `data-[state=error]:border-destructive/30`입니다.
const double _attachmentErrorBorderAlpha = 0.3;

/// `attachment.tsx`의 `group-data-[state=error]/attachment:text-destructive/80`입니다.
const double _attachmentErrorTextAlpha = 0.8;

/// `attachment.tsx`의 `bg-destructive/10`입니다. 오류 상태 미디어 타일의 채움입니다.
const double _attachmentErrorFillAlpha = 0.1;

/// `attachment.tsx`의 `variant="image"`가 끝나기 전에 쓰는 `opacity-60`입니다.
const double _attachmentPendingImageOpacity = 0.6;

/// `has-[>a,>button]:hover:bg-muted/50`의 불투명도입니다.
const double _attachmentHoverAlpha = 0.5;

/// `focus-within:ring-1 focus-within:ring-ring/50`입니다.
const double _attachmentRingAlpha = 0.5;

/// 점선 테두리의 한 조각과 틈입니다. React의 `border-dashed`는 브라우저가 그리므로
/// 값이 토큰에 없어 4px 눈금의 3과 2를 씁니다.
const double _attachmentDashLength = HoronSpace.s3;
const double _attachmentDashGap = HoronSpace.s2;

/// 크기 하나가 쓰는 간격·여백·글자 크기입니다.
class _HoronAttachmentSpec {
  const _HoronAttachmentSpec({
    required this.gap,
    required this.contentPadding,
    required this.mediaPadding,
    required this.fontSize,
    required this.mediaSize,
    required this.iconSize,
    required this.radius,
  });

  /// `gap-…`입니다.
  final double gap;

  /// 내용이 있을 때의 안쪽 여백입니다(`has-data-[slot=attachment-content]:px-… py-…`).
  final EdgeInsets contentPadding;

  /// 미디어만 있을 때의 여백입니다(`has-data-[slot=attachment-media]:p-…`).
  final double mediaPadding;

  /// 글자 크기입니다(`text-sm`/`text-xs`).
  final double fontSize;

  /// 미디어 타일의 한 변입니다.
  final double mediaSize;

  /// 미디어 안 아이콘의 크기입니다.
  final double iconSize;

  /// 표면의 반경입니다.
  final double radius;
}

/// `attachment.tsx`의 size 클래스를 픽셀로 옮긴 표입니다.
const Map<HoronAttachmentSize, _HoronAttachmentSpec> _attachmentSpecs = <HoronAttachmentSize, _HoronAttachmentSpec>{
  // "gap-2 text-sm … px-2.5 py-2 … p-2"
  HoronAttachmentSize.defaultValue: _HoronAttachmentSpec(
    gap: HoronSpace.s2,
    contentPadding: EdgeInsets.symmetric(horizontal: HoronSpace.s2_5, vertical: HoronSpace.s2),
    mediaPadding: HoronSpace.s2,
    fontSize: HoronText.body,
    mediaSize: _attachmentMediaSize,
    iconSize: _attachmentIconSize,
    radius: _attachmentRadius,
  ),
  // "gap-2.5 text-xs … px-2 py-1.5 … p-1.5"
  HoronAttachmentSize.sm: _HoronAttachmentSpec(
    gap: HoronSpace.s2_5,
    contentPadding: EdgeInsets.symmetric(horizontal: HoronSpace.s2, vertical: HoronSpace.s1_5),
    mediaPadding: HoronSpace.s1_5,
    fontSize: HoronText.caption,
    mediaSize: _attachmentMediaSizeSm,
    iconSize: _attachmentIconSize,
    radius: _attachmentRadius,
  ),
  // "gap-1.5 rounded-md text-xs … px-1.5 py-1 … p-1"
  HoronAttachmentSize.xs: _HoronAttachmentSpec(
    gap: HoronSpace.s1_5,
    contentPadding: EdgeInsets.symmetric(horizontal: HoronSpace.s1_5, vertical: HoronSpace.s1),
    mediaPadding: HoronSpace.s1,
    fontSize: HoronText.caption,
    mediaSize: _attachmentMediaSizeXs,
    iconSize: _attachmentIconSizeXs,
    radius: _attachmentRadiusXs,
  ),
};

/// 첨부 파트가 크기·방향·상태를 읽는 범위입니다.
class _HoronAttachmentScope extends InheritedWidget {
  const _HoronAttachmentScope({
    required this.size,
    required this.orientation,
    required this.state,
    required this.hasContent,
    required super.child,
  });

  final HoronAttachmentSize size;
  final HoronAttachmentOrientation orientation;
  final _HoronAttachmentState state;

  /// 내용 파트가 있는지 여부입니다. React의 `has-data-[slot=attachment-content]` 자리입니다.
  final bool hasContent;

  bool get isVertical => orientation == HoronAttachmentOrientation.vertical;

  bool get isError => state == _HoronAttachmentState.error;

  /// 끝나기 전인지 여부입니다. 그림 변형의 불투명도가 이 값을 봅니다.
  bool get isPending =>
      state == _HoronAttachmentState.idle ||
      state == _HoronAttachmentState.uploading ||
      state == _HoronAttachmentState.processing;

  static _HoronAttachmentScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronAttachmentScope>();

  @override
  bool updateShouldNotify(_HoronAttachmentScope oldWidget) =>
      size != oldWidget.size ||
      orientation != oldWidget.orientation ||
      state != oldWidget.state ||
      hasContent != oldWidget.hasContent;
}

/// 파일 하나를 가리키는 작은 표면입니다.
///
/// `attachment.tsx`의 `Attachment`를 옮긴 것입니다. React는 `rounded-lg border
/// border-border bg-card`에 `state`·`size`·`orientation`을 받고, 자식이 미디어인지
/// 내용인지에 따라 여백을 바꿉니다(`has-data-[slot=…]`). Flutter에는 그 선택자가
/// 없으므로 자식 목록을 보고 같은 규칙을 적용합니다.
///
/// 상태는 cva 변형이 아니라 prop이라 공개 enum을 두지 않았습니다. [HoronAttachment]
/// 는 `done`, [HoronAttachment.idle]은 점선 테두리, [HoronAttachment.error]는 파괴
/// 색 테두리와 아이콘을 씁니다.
///
/// ```dart
/// HoronAttachment(
///   size: HoronAttachmentSize.sm,
///   children: <Widget>[
///     HoronAttachmentMedia(variant: HoronAttachmentMediaVariant.icon, child: const Icon(Icons.description)),
///     HoronAttachmentContent(
///       children: <Widget>[
///         HoronAttachmentTitle(text: 'report.pdf'),
///         HoronAttachmentDescription(text: '1.5 KB'),
///       ],
///     ),
///   ],
/// );
/// ```
class HoronAttachment extends StatefulWidget {
  /// 끝난 상태의 첨부를 만듭니다.
  const HoronAttachment({
    super.key,
    required this.children,
    this.size = HoronAttachmentSize.defaultValue,
    this.orientation = HoronAttachmentOrientation.horizontal,
  }) : _state = _HoronAttachmentState.done;

  /// 아직 시작하지 않은 첨부를 만듭니다. 점선 테두리로 그립니다.
  const HoronAttachment.idle({
    super.key,
    required this.children,
    this.size = HoronAttachmentSize.defaultValue,
    this.orientation = HoronAttachmentOrientation.horizontal,
  }) : _state = _HoronAttachmentState.idle;

  /// 올리는 중인 첨부를 만듭니다.
  const HoronAttachment.uploading({
    super.key,
    required this.children,
    this.size = HoronAttachmentSize.defaultValue,
    this.orientation = HoronAttachmentOrientation.horizontal,
  }) : _state = _HoronAttachmentState.uploading;

  /// 서버가 처리하는 중인 첨부를 만듭니다.
  const HoronAttachment.processing({
    super.key,
    required this.children,
    this.size = HoronAttachmentSize.defaultValue,
    this.orientation = HoronAttachmentOrientation.horizontal,
  }) : _state = _HoronAttachmentState.processing;

  /// 실패한 첨부를 만듭니다.
  const HoronAttachment.error({
    super.key,
    required this.children,
    this.size = HoronAttachmentSize.defaultValue,
    this.orientation = HoronAttachmentOrientation.horizontal,
  }) : _state = _HoronAttachmentState.error;

  /// 미디어·내용·액션 파트입니다.
  final List<Widget> children;

  /// 크기입니다.
  final HoronAttachmentSize size;

  /// 방향입니다.
  final HoronAttachmentOrientation orientation;

  final _HoronAttachmentState _state;

  @override
  State<HoronAttachment> createState() => _HoronAttachmentStateful();
}

class _HoronAttachmentStateful extends State<HoronAttachment> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronAttachmentSpec spec = _attachmentSpecs[widget.size]!;
    final bool vertical = widget.orientation == HoronAttachmentOrientation.vertical;
    final bool isError = widget._state == _HoronAttachmentState.error;
    final bool isIdle = widget._state == _HoronAttachmentState.idle;

    HoronAttachmentMedia? media;
    HoronAttachmentContent? content;
    final List<Widget> actions = <Widget>[];
    for (final Widget child in widget.children) {
      if (child is HoronAttachmentMedia) {
        media = child;
      } else if (child is HoronAttachmentContent) {
        content = child;
      } else if (child is HoronAttachmentActions) {
        actions.add(child);
      } else {
        actions.add(child);
      }
    }

    final bool hasAction = actions.isNotEmpty;
    final EdgeInsetsGeometry padding = content != null ? spec.contentPadding : EdgeInsets.all(spec.mediaPadding);

    final Color borderColor = isError
        ? scheme.error.withValues(alpha: _attachmentErrorBorderAlpha)
        : (_focused ? horon.ring : scheme.outline);
    // `data-[state=idle]:border-dashed`입니다. 점선은 전경 페인터가 그리므로 표면의
    // 실선 테두리는 비워 두어야 두 선이 겹쳐 실선처럼 보이지 않습니다.
    final Color solidBorder = isIdle ? Colors.transparent : borderColor;
    final Color background = _hovered && hasAction
        ? scheme.surfaceContainerHighest.withValues(alpha: _attachmentHoverAlpha)
        : scheme.surfaceContainerLow;
    final BorderRadius radius = BorderRadius.circular(spec.radius);

    // 액션은 React에서 flex 자식이라 흐름 안에 섭니다. 수직 방향에서만
    // `absolute top-3 right-3`처럼 표면 위에 겹칩니다.
    final Widget? actionRow = hasAction
        ? Row(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              for (int index = 0; index < actions.length; index++) ...<Widget>[
                if (index > 0) const SizedBox(width: _attachmentActionGap),
                actions[index],
              ],
            ],
          )
        : null;

    final List<Widget> stacked = <Widget>[?media, if (content != null) const SizedBox(height: HoronSpace.s2), ?content];
    final List<Widget> inline = <Widget>[
      ?media,
      if (content != null) SizedBox(width: spec.gap),
      if (content != null) Flexible(child: content),
      if (!vertical && actionRow != null) SizedBox(width: spec.gap),
      if (!vertical) ?actionRow,
    ];

    final Widget body = vertical
        ? Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: stacked)
        : Row(crossAxisAlignment: CrossAxisAlignment.center, mainAxisSize: MainAxisSize.min, children: inline);

    final Widget surface = DecoratedBox(
      decoration: BoxDecoration(
        color: background,
        borderRadius: radius,
        border: Border.all(color: solidBorder),
        boxShadow: _focused
            ? <BoxShadow>[BoxShadow(color: horon.ring.withValues(alpha: _attachmentRingAlpha), spreadRadius: 1)]
            : null,
      ),
      child: Padding(
        padding: padding,
        child: DefaultTextStyle.merge(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: spec.fontSize,
            height: HoronLineHeight.tight,
            color: scheme.onSurface,
            // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중 밑줄이
            // 새어 들어오지 않게 명시합니다.
            decoration: TextDecoration.none,
          ),
          child: body,
        ),
      ),
    );

    Widget result = _HoronAttachmentScope(
      size: widget.size,
      orientation: widget.orientation,
      state: widget._state,
      hasContent: content != null,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          minWidth: vertical
              ? (content != null ? _attachmentWidthVerticalWithContent : _attachmentWidthVertical)
              : _attachmentMinWidthHorizontal,
          maxWidth: vertical
              ? (content != null ? _attachmentWidthVerticalWithContent : _attachmentWidthVertical)
              : double.infinity,
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: <Widget>[
            surface,
            if (vertical && actionRow != null)
              Positioned(top: _attachmentActionInset, right: _attachmentActionInset, child: actionRow),
          ],
        ),
      ),
    );

    if (isIdle) {
      result = CustomPaint(
        foregroundPainter: _HoronAttachmentDashedPainter(
          color: borderColor,
          radius: spec.radius,
          dashLength: _attachmentDashLength,
          gapLength: _attachmentDashGap,
        ),
        child: result,
      );
    }

    return Semantics(
      container: true,
      child: FocusableActionDetector(
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        child: result,
      ),
    );
  }
}

/// 첨부의 미디어 자리입니다.
///
/// `attachment.tsx`의 `AttachmentMedia`입니다. `aspect-square`에 `rounded-lg
/// bg-muted`인 정사각이고, `sm`은 32, `xs`는 28로 줄며 `xs`만 반경이 `rounded-md`가
/// 됩니다. 수직 방향에서는 폭을 꽉 채웁니다. 오류 상태에서는 파괴 색 배경과 전경을
/// 씁니다.
class HoronAttachmentMedia extends StatelessWidget {
  /// 미디어 자리 하나를 만듭니다.
  const HoronAttachmentMedia({super.key, this.child, this.variant = HoronAttachmentMediaVariant.icon, this.image})
    : assert(
        child != null || image != null || variant == HoronAttachmentMediaVariant.icon,
        'An image variant needs a child or an image.',
      );

  /// 아이콘 등 내용입니다. [image]가 있으면 그쪽이 이깁니다.
  final Widget? child;

  /// 변형입니다.
  final HoronAttachmentMediaVariant variant;

  /// 그림 변형에서 채워 넣을 그림입니다.
  final Widget? image;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronAttachmentScope? scope = _HoronAttachmentScope.maybeOf(context);
    final HoronAttachmentSize size = scope?.size ?? HoronAttachmentSize.defaultValue;
    final bool vertical = scope?.isVertical ?? false;
    final bool isError = scope?.isError ?? false;
    final bool isPending = scope?.isPending ?? false;
    final _HoronAttachmentSpec spec = _attachmentSpecs[size]!;

    final double iconSize = vertical ? _attachmentIconSizeVertical : spec.iconSize;
    final Color foreground = isError ? scheme.error : scheme.onSurface;
    final Color background = isError
        ? scheme.error.withValues(alpha: _attachmentErrorFillAlpha)
        : scheme.surfaceContainerHighest;
    final BorderRadius radius = BorderRadius.circular(spec.radius);

    final Widget content = image ?? child ?? const SizedBox.shrink();

    Widget tile = ClipRRect(
      borderRadius: radius,
      child: DecoratedBox(
        decoration: BoxDecoration(color: background, borderRadius: radius),
        child: vertical
            ? AspectRatio(
                aspectRatio: 1,
                child: Center(
                  child: IconTheme.merge(
                    data: IconThemeData(size: iconSize, color: foreground),
                    child: content,
                  ),
                ),
              )
            : SizedBox.square(
                dimension: spec.mediaSize,
                child: Center(
                  child: IconTheme.merge(
                    data: IconThemeData(size: iconSize, color: foreground),
                    child: content,
                  ),
                ),
              ),
      ),
    );

    if (variant == HoronAttachmentMediaVariant.image && isPending) {
      tile = Opacity(opacity: _attachmentPendingImageOpacity, child: tile);
    }
    return tile;
  }
}

/// 첨부의 본문 자리입니다.
///
/// `attachment.tsx`의 `AttachmentContent`입니다. `min-w-0 flex-1 leading-tight`이라
/// 남는 폭을 채우고, 수직 방향에서는 좌우에 4를 더합니다.
class HoronAttachmentContent extends StatelessWidget {
  /// 본문 하나를 만듭니다.
  const HoronAttachmentContent({super.key, required this.children, this.alignment = CrossAxisAlignment.start});

  /// 제목·설명 등 세로로 쌓을 내용입니다.
  final List<Widget> children;

  /// 가로 정렬입니다. 수직 방향의 가운데 정렬에 씁니다.
  final CrossAxisAlignment alignment;

  @override
  Widget build(BuildContext context) {
    final _HoronAttachmentScope? scope = _HoronAttachmentScope.maybeOf(context);
    final bool vertical = scope?.isVertical ?? false;
    final Widget column = Column(crossAxisAlignment: alignment, mainAxisSize: MainAxisSize.min, children: children);
    if (!vertical) return column;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s1),
      child: column,
    );
  }
}

/// 첨부의 이름입니다.
///
/// `attachment.tsx`의 `AttachmentTitle`입니다. `truncate font-medium`이라 한 줄에서
/// 잘립니다.
class HoronAttachmentTitle extends StatelessWidget {
  /// 이름 하나를 만듭니다.
  const HoronAttachmentTitle({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronAttachmentTitle needs a text or a child.');

  /// 이름 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronAttachmentScope? scope = _HoronAttachmentScope.maybeOf(context);
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _attachmentSpecs[scope?.size ?? HoronAttachmentSize.defaultValue]!.fontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.tight,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );
    if (text != null) {
      return Text(text!, maxLines: 1, overflow: TextOverflow.ellipsis, style: base.merge(style));
    }
    return DefaultTextStyle.merge(style: base.merge(style), child: child!);
  }
}

/// 첨부의 설명입니다.
///
/// `attachment.tsx`의 `AttachmentDescription`입니다. `mt-0.5 text-xs
/// text-muted-foreground`이고, 오류 상태에서는 파괴 색 80%로 바뀝니다.
class HoronAttachmentDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronAttachmentDescription({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronAttachmentDescription needs a text or a child.');

  /// 설명 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool isError = _HoronAttachmentScope.maybeOf(context)?.isError ?? false;
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _attachmentDescriptionFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: isError ? scheme.error.withValues(alpha: _attachmentErrorTextAlpha) : scheme.onSurfaceVariant,
      fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
      decoration: TextDecoration.none,
    );
    final Widget inner = text != null
        ? Text(text!, maxLines: 1, overflow: TextOverflow.ellipsis, style: base.merge(style))
        : DefaultTextStyle.merge(style: base.merge(style), child: child!);
    return Padding(
      padding: const EdgeInsets.only(top: _attachmentDescriptionGap),
      child: inner,
    );
  }
}

/// 첨부의 액션 자리입니다.
///
/// `attachment.tsx`의 `AttachmentActions`입니다. 수평 방향에서는 오른쪽 끝에 서고,
/// 수직 방향에서는 `absolute top-3 right-3`처럼 표면 위 오른쪽 위에 겹칩니다.
class HoronAttachmentActions extends StatelessWidget {
  /// 액션 자리 하나를 만듭니다.
  const HoronAttachmentActions({super.key, required this.children});

  /// 나란히 놓을 액션들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        for (int index = 0; index < children.length; index++) ...<Widget>[
          if (index > 0) const SizedBox(width: _attachmentActionGap),
          children[index],
        ],
      ],
    );
  }
}

/// 첨부 하나를 아이콘·이름·크기·제거 버튼으로 조립합니다.
///
/// React는 여섯 파트를 소비자가 조립합니다. 이 패키지는 그 조립을 한 번 더 감싸,
/// `mobile`의 `_AttachmentStrip` 같은 자리에서 한 줄로 쓸 수 있게 합니다. [onRemove]를
/// 넘기면 오른쪽에 제거 버튼이 붙고, 그 접근성 이름은 테마의 `strings.remove`입니다.
///
/// ```dart
/// HoronAttachmentFile(
///   name: 'report.pdf',
///   sizeBytes: 1536,
///   onRemove: () => drop(),
/// );
/// ```
class HoronAttachmentFile extends StatelessWidget {
  /// 첨부 하나를 조립합니다.
  const HoronAttachmentFile({
    super.key,
    required this.name,
    this.sizeBytes,
    this.description,
    this.size = HoronAttachmentSize.defaultValue,
    this.orientation = HoronAttachmentOrientation.horizontal,
    this.icon,
    this.image,
    this.onRemove,
  });

  /// 파일 이름입니다.
  final String name;

  /// 바이트 단위 크기입니다. 없으면 설명 줄을 그리지 않습니다.
  final int? sizeBytes;

  /// 크기 대신 보여 줄 설명입니다. 넘기면 이 값이 이깁니다.
  final String? description;

  /// 크기입니다.
  final HoronAttachmentSize size;

  /// 방향입니다.
  final HoronAttachmentOrientation orientation;

  /// 미디어 자리에 넣을 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 미디어 자리에 넣을 그림입니다. 있으면 그림 변형으로 그립니다.
  final Widget? image;

  /// 제거를 눌렀을 때 부르는 콜백입니다. null이면 제거 버튼이 없습니다.
  final VoidCallback? onRemove;

  /// 제거 버튼을 찾는 키입니다.
  static const Key removeKey = ValueKey<String>('horon-attachment-remove');

  @override
  Widget build(BuildContext context) {
    final String? caption = description ?? (sizeBytes == null ? null : formatBytes(sizeBytes!));

    return HoronAttachment(
      size: size,
      orientation: orientation,
      children: <Widget>[
        HoronAttachmentMedia(
          variant: image == null ? HoronAttachmentMediaVariant.icon : HoronAttachmentMediaVariant.image,
          image: image,
          child: icon,
        ),
        HoronAttachmentContent(
          alignment: orientation == HoronAttachmentOrientation.vertical
              ? CrossAxisAlignment.center
              : CrossAxisAlignment.start,
          children: <Widget>[
            HoronAttachmentTitle(text: name),
            if (caption != null) HoronAttachmentDescription(text: caption),
          ],
        ),
        if (onRemove != null)
          HoronAttachmentActions(
            children: <Widget>[_HoronAttachmentRemoveButton(name: name, onRemove: onRemove!)],
          ),
      ],
    );
  }
}

/// 첨부의 제거 버튼입니다. `attachment.tsx`는 소비자가 넣는 `button`을 받습니다.
class _HoronAttachmentRemoveButton extends StatefulWidget {
  const _HoronAttachmentRemoveButton({required this.name, required this.onRemove});
  final String name;
  final VoidCallback onRemove;

  @override
  State<_HoronAttachmentRemoveButton> createState() => _HoronAttachmentRemoveButtonState();
}

class _HoronAttachmentRemoveButtonState extends State<_HoronAttachmentRemoveButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final Color color = _hovered ? scheme.onSurface : scheme.onSurfaceVariant;

    return Semantics(
      button: true,
      label: '${horon.strings.remove}: ${widget.name}',
      child: FocusableActionDetector(
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onRemove();
              return null;
            },
          ),
        },
        child: GestureDetector(
          key: HoronAttachmentFile.removeKey,
          behavior: HitTestBehavior.opaque,
          onTap: widget.onRemove,
          child: DecoratedBox(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: _focused
                  ? <BoxShadow>[BoxShadow(color: horon.ring.withValues(alpha: _attachmentRingAlpha), spreadRadius: 1)]
                  : null,
            ),
            child: SizedBox.square(
              dimension: HoronSpace.s5,
              child: Center(
                child: CustomPaint(
                  size: const Size.square(HoronSpace.s3),
                  painter: _HoronAttachmentClosePainter(color: color),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 닫기 아이콘(lucide `x`)을 선 두 개로 그립니다.
class _HoronAttachmentClosePainter extends CustomPainter {
  const _HoronAttachmentClosePainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * 2 / 24
      ..strokeCap = StrokeCap.round;
    final double inset = size.width * 6 / 24;
    canvas.drawLine(Offset(inset, inset), Offset(size.width - inset, size.height - inset), stroke);
    canvas.drawLine(Offset(size.width - inset, inset), Offset(inset, size.height - inset), stroke);
  }

  @override
  bool shouldRepaint(_HoronAttachmentClosePainter oldDelegate) => color != oldDelegate.color;
}

/// 점선 둥근 사각 테두리를 그립니다.
///
/// React의 `data-[state=idle]:border-dashed`입니다. Flutter에는 점선 테두리 장식이
/// 없어 둥근 사각 경로를 따라 조각과 틈을 번갈아 칠합니다.
class _HoronAttachmentDashedPainter extends CustomPainter {
  const _HoronAttachmentDashedPainter({
    required this.color,
    required this.radius,
    required this.dashLength,
    required this.gapLength,
  });

  final Color color;
  final double radius;
  final double dashLength;
  final double gapLength;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    final Path source = Path()
      ..addRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(0.5, 0.5, size.width - 1, size.height - 1), Radius.circular(radius)),
      );
    for (final PathMetric metric in source.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double end = (distance + dashLength).clamp(0, metric.length);
        canvas.drawPath(metric.extractPath(distance, end), stroke);
        distance = end + gapLength;
      }
    }
  }

  @override
  bool shouldRepaint(_HoronAttachmentDashedPainter oldDelegate) =>
      color != oldDelegate.color ||
      radius != oldDelegate.radius ||
      dashLength != oldDelegate.dashLength ||
      gapLength != oldDelegate.gapLength;
}
