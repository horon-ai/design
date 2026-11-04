import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `chat-bubble.tsx`의 `max-w-[min(100%,560px)]`입니다.
const double _bubbleMaxWidth = 560;

/// `chat-bubble.tsx`의 `ChatBubbleSize`입니다.
enum HoronChatBubbleSize {
  /// `size="sm"` — 좌우 12·위아래 8, `body-sm`.
  sm,

  /// `size="md"` — 좌우 16·위아래 12, `body-md`. 기본값입니다.
  md,

  /// `size="lg"` — 좌우 20·위아래 14, `body-lg`.
  lg,
}

typedef _BubbleMetrics = ({double paddingX, double paddingY, TextStyle textStyle});

_BubbleMetrics _metricsOf(HoronChatBubbleSize size, HoronThemeData theme) => switch (size) {
  HoronChatBubbleSize.sm => (paddingX: theme.space.s3, paddingY: theme.space.s2, textStyle: theme.text.bodySm),
  HoronChatBubbleSize.md => (paddingX: theme.space.s4, paddingY: theme.space.s3, textStyle: theme.text.bodyMd),
  HoronChatBubbleSize.lg => (paddingX: theme.space.s5, paddingY: theme.space.s3_5, textStyle: theme.text.bodyLg),
};

/// Figma `Chat bubble`(64:359): 16/12 여백, 20 반경, `body-md` 글자의 말풍선입니다.
///
/// `chat-bubble.tsx`를 옮긴 것입니다. `from`은 props 안의 인라인 유니온이라
/// variant 어휘가 아니므로 [fromMe] 플래그로 받습니다. 내 쪽은 잉크 바탕에 반대색
/// 글자, 봇 쪽은 옅은 표면입니다. 유리는 쓰지 않습니다. 등장할 때 React의
/// `motion-rise`와 같은 페이드·이동을 씁니다.
class HoronChatBubble extends StatelessWidget {
  /// 말풍선을 만듭니다.
  const HoronChatBubble({super.key, required this.child, this.fromMe = true, this.size = HoronChatBubbleSize.md});

  /// 내용입니다.
  final Widget child;

  /// 크기입니다. 기본값은 [HoronChatBubbleSize.md]입니다.
  final HoronChatBubbleSize size;

  /// `from="me"` 자리입니다. 기본값은 참입니다.
  final bool fromMe;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    final _BubbleMetrics metrics = _metricsOf(size, theme);
    final Widget bubble = Container(
      constraints: const BoxConstraints(maxWidth: _bubbleMaxWidth),
      padding: EdgeInsets.symmetric(horizontal: metrics.paddingX, vertical: metrics.paddingY),
      decoration: BoxDecoration(
        color: fromMe ? theme.colors.interactivePrimary : theme.colors.bgSubtle,
        borderRadius: BorderRadius.circular(theme.radius.xl),
      ),
      child: DefaultTextStyle.merge(
        style: metrics.textStyle.copyWith(color: fromMe ? theme.colors.interactiveOnPrimary : theme.colors.textPrimary),
        child: child,
      ),
    );

    final Widget aligned = Align(alignment: fromMe ? Alignment.centerRight : Alignment.centerLeft, child: bubble);
    if (!animate) return aligned;

    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: HoronMotion.riseDuration,
      curve: HoronMotion.riseCurve,
      builder: (BuildContext context, double t, Widget? child) => Opacity(
        opacity: t,
        child: Transform.translate(offset: Offset(0, HoronMotion.riseOffset * (1 - t)), child: child),
      ),
      child: aligned,
    );
  }
}
