import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `message.tsx`의 `gap-2`입니다. 아바타와 내용 사이의 간격입니다.
const double _messageGap = HoronSpace.s2;

/// `message.tsx`의 `gap-2.5`입니다. 내용 안 조각 사이의 간격입니다.
const double _messageContentGap = HoronSpace.s2_5;

/// `message-avatar`의 `min-w-8`입니다. 아바타 자리의 최소 폭입니다.
const double _messageAvatarMinSize = HoronSpace.s8;

/// `message-header`·`message-footer`의 `px-3`입니다.
const double _messageMetaPadding = HoronSpace.s3;

/// `message-header`·`message-footer`의 `text-xs`입니다.
const double _messageMetaFontSize = HoronText.caption;

/// 꼬리말이 있는 메시지에서 아바타가 올라가는 거리입니다(`-translate-y-8`).
const double _messageAvatarLift = HoronSpace.s8;

/// 부모 [HoronMessage]의 정렬과 꼬리말 유무를 자식 파트가 읽게 하는 스코프입니다.
///
/// React는 `data-align`과 `group-has-data-[slot=message-footer]/message` 선택자로 같은 일을
/// 합니다. Flutter에는 조상 선택자가 없으므로 이 스코프가 그 자리를 맡습니다.
class _HoronMessageScope extends InheritedWidget {
  const _HoronMessageScope({required this.alignEnd, required this.hasFooter, required super.child});

  final bool alignEnd;
  final bool hasFooter;

  static _HoronMessageScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronMessageScope>();

  @override
  bool updateShouldNotify(_HoronMessageScope oldWidget) =>
      alignEnd != oldWidget.alignEnd || hasFooter != oldWidget.hasFooter;
}

/// `message.tsx`의 `Message`입니다.
///
/// React는 `group/message relative flex w-full min-w-0 gap-2 text-sm`이고,
/// `data-[align=end]:flex-row-reverse`가 행을 뒤집습니다. 이 위젯은 그 뒤집기를 그대로
/// 옮깁니다. [alignEnd]가 참이면 자식 순서가 뒤집혀 아바타가 끝 쪽에 서고, 아바타가 아닌
/// 자식은 남은 폭을 채웁니다(React의 `w-full`).
///
/// 정렬은 주변 방향을 따릅니다. 오른쪽에서 왼쪽 화면에서 `align="end"`는 왼쪽이 됩니다.
///
/// ```dart
/// HoronMessage(
///   children: <Widget>[
///     const HoronMessageAvatar(child: Text('민')),
///     HoronMessageContent(
///       children: <Widget>[
///         const HoronMessageHeader(child: Text('민열')),
///         HoronBubble(children: <Widget>[HoronBubbleContent(child: Text('안녕하세요'))]),
///         const HoronMessageFooter(child: Text('오후 3:12')),
///       ],
///     ),
///   ],
/// );
/// ```
class HoronMessage extends StatelessWidget {
  /// 시작(`start`) 정렬의 메시지를 만듭니다.
  const HoronMessage({super.key, this.alignEnd = false, required this.children});

  /// 끝(`end`) 정렬의 메시지를 만듭니다. React의 `align="end"`입니다.
  const HoronMessage.end({super.key, required this.children}) : alignEnd = true;

  /// 참이면 행이 뒤집혀 아바타가 끝 쪽에 섭니다.
  final bool alignEnd;

  /// 메시지의 파트입니다. 보통 [HoronMessageAvatar]와 [HoronMessageContent]입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    // React의 `group-has-data-[slot=message-footer]/message` 자리입니다. 자손 중에
    // 꼬리말이 있는 내용이 하나라도 있으면 아바타가 올라갑니다.
    final bool hasFooter = children.any(_contentHasFooter);
    // `flex-row-reverse`: 순서를 뒤집고, 아바타가 아닌 자식이 남은 폭을 채웁니다.
    final List<Widget> ordered = alignEnd ? children.reversed.toList() : children;
    return _HoronMessageScope(
      alignEnd: alignEnd,
      hasFooter: hasFooter,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        spacing: _messageGap,
        children: <Widget>[
          for (final Widget child in ordered)
            if (child is HoronMessageAvatar) child else Expanded(child: child),
        ],
      ),
    );
  }

  /// [child]가 꼬리말을 가진 내용인지 여부입니다.
  static bool _contentHasFooter(Widget child) => child is HoronMessageContent && child.footer != null;
}

/// `message.tsx`의 `MessageAvatar`입니다.
///
/// React는 `flex w-fit min-w-8 shrink-0 items-center justify-center self-end
/// overflow-hidden rounded-full bg-muted`입니다. `self-end`는 행의 바닥에 붙이는 정렬이고,
/// 꼬리말이 있는 메시지에서는 `-translate-y-8`로 32px 올라가 꼬리말 자리를 비웁니다.
///
/// [raised]를 넘기면 부모가 꼬리말을 가졌는지와 무관하게 그 값을 씁니다.
class HoronMessageAvatar extends StatelessWidget {
  /// 아바타 자리 하나를 만듭니다.
  const HoronMessageAvatar({super.key, this.child, this.raised});

  /// 아바타 그림입니다.
  final Widget? child;

  /// 참이면 바닥에서 32px 올라갑니다. 없으면 부모 메시지의 꼬리말 유무를 따릅니다.
  final bool? raised;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool lift = raised ?? (_HoronMessageScope.maybeOf(context)?.hasFooter ?? false);
    final Widget body = ConstrainedBox(
      constraints: const BoxConstraints(minWidth: _messageAvatarMinSize, minHeight: _messageAvatarMinSize),
      child: ClipOval(
        child: ColoredBox(
          color: scheme.surfaceContainerHighest,
          child: Center(widthFactor: 1, heightFactor: 1, child: child),
        ),
      ),
    );
    return Transform.translate(offset: Offset(0, lift ? -_messageAvatarLift : 0), child: body);
  }
}

/// `message.tsx`의 `MessageContent`입니다.
///
/// React는 `flex w-full min-w-0 flex-col gap-2.5 break-words`이고, `align="end"`면 안의
/// 조각들이 끝으로 붙습니다. [children]에 머리말·말풍선·꼬리말을 순서대로 넣습니다.
class HoronMessageContent extends StatelessWidget {
  /// 내용 하나를 만듭니다.
  const HoronMessageContent({super.key, required this.children});

  /// 세로로 쌓을 조각입니다. [HoronMessageHeader], 말풍선, [HoronMessageFooter]를 넣습니다.
  final List<Widget> children;

  /// 이 내용의 꼬리말입니다. 없으면 `null`입니다.
  HoronMessageFooter? get footer {
    for (final Widget child in children) {
      if (child is HoronMessageFooter) return child;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final bool alignEnd = _HoronMessageScope.maybeOf(context)?.alignEnd ?? false;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: alignEnd ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      spacing: _messageContentGap,
      children: children,
    );
  }
}

/// `message.tsx`의 `MessageHeader`입니다.
///
/// React는 `flex max-w-full min-w-0 items-center px-3 text-xs font-medium
/// text-muted-foreground`입니다. ghost 말풍선을 쓰면 React는 자손을 보고 부모의 여백을
/// 없애는데(`group-has-data-[variant=ghost]/message:px-0`), Flutter에는 같은 수단이 없으므로
/// 그 자리는 [flush]로 넘깁니다.
class HoronMessageHeader extends StatelessWidget {
  /// 머리말 하나를 만듭니다.
  const HoronMessageHeader({super.key, required this.child, this.flush = false});

  /// 머리말 내용입니다. 보통 보낸 사람 이름입니다.
  final Widget child;

  /// 참이면 좌우 여백을 없앱니다(React의 ghost 말풍선 자리).
  final bool flush;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: flush ? HoronSpace.s0 : _messageMetaPadding),
      child: DefaultTextStyle(style: _metaStyle(context), child: child),
    );
  }
}

/// `message.tsx`의 `MessageFooter`입니다.
///
/// React는 머리말과 같은 모양에 `align="end"`일 때 `justify-end`가 붙습니다. 이 파트가
/// 내용에 있으면 부모 [HoronMessage]가 아바타를 32px 올립니다.
class HoronMessageFooter extends StatelessWidget {
  /// 꼬리말 하나를 만듭니다.
  const HoronMessageFooter({super.key, required this.child, this.flush = false});

  /// 꼬리말 내용입니다. 보통 시각이나 전달 상태입니다.
  final Widget child;

  /// 참이면 좌우 여백을 없앱니다(React의 ghost 말풍선 자리).
  final bool flush;

  @override
  Widget build(BuildContext context) {
    final bool alignEnd = _HoronMessageScope.maybeOf(context)?.alignEnd ?? false;
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: flush ? HoronSpace.s0 : _messageMetaPadding),
      child: Align(
        alignment: alignEnd ? AlignmentDirectional.centerEnd : AlignmentDirectional.centerStart,
        child: DefaultTextStyle(style: _metaStyle(context), child: child),
      ),
    );
  }
}

/// 머리말·꼬리말의 글자 모양입니다. React `text-xs font-medium text-muted-foreground`입니다.
TextStyle _metaStyle(BuildContext context) {
  final ColorScheme scheme = Theme.of(context).colorScheme;
  return TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: _messageMetaFontSize,
    fontWeight: HoronFontWeight.medium,
    height: HoronLineHeight.normal,
    color: scheme.onSurfaceVariant,
  );
}
