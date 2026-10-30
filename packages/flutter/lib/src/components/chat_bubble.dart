import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `chat-bubble.tsx`의 `max-w-[min(100%,560px)]`입니다.
const double _bubbleMaxWidth = 560;

/// `chat-bubble.tsx`의 `px-4`입니다.
const double _bubblePaddingX = 16;

/// `chat-bubble.tsx`의 `py-3`입니다.
const double _bubblePaddingY = 12;

/// Figma `Chat bubble`(64:359): 16/12 여백, 20 반경, `body-md` 글자의 말풍선입니다.
///
/// `chat-bubble.tsx`를 옮긴 것입니다. `from`은 props 안의 인라인 유니온이라
/// variant 어휘가 아니므로 [fromMe] 플래그로 받습니다. 내 쪽은 잉크 바탕에 반대색
/// 글자, 봇 쪽은 옅은 표면입니다. 유리는 쓰지 않습니다. 등장할 때 React의
/// `tab-panel-in 220ms`와 같은 페이드·이동을 씁니다.
class HoronChatBubble extends StatelessWidget {
  /// 말풍선을 만듭니다.
  const HoronChatBubble({super.key, required this.child, this.fromMe = true});

  /// 내용입니다.
  final Widget child;

  /// `from="me"` 자리입니다. 기본값은 참입니다.
  final bool fromMe;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    final Widget bubble = Container(
      constraints: const BoxConstraints(maxWidth: _bubbleMaxWidth),
      padding: const EdgeInsets.symmetric(horizontal: _bubblePaddingX, vertical: _bubblePaddingY),
      decoration: BoxDecoration(
        color: fromMe ? theme.colors.interactivePrimary : theme.colors.bgSubtle,
        borderRadius: BorderRadius.circular(theme.radius.xl),
      ),
      child: DefaultTextStyle.merge(
        style: theme.text.bodyMd.copyWith(color: fromMe ? theme.colors.interactiveOnPrimary : theme.colors.textPrimary),
        child: child,
      ),
    );

    final Widget aligned = Align(alignment: fromMe ? Alignment.centerRight : Alignment.centerLeft, child: bubble);
    if (!animate) return aligned;

    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: const Duration(milliseconds: 220),
      curve: HoronMotion.easeOutQuint,
      builder: (BuildContext context, double t, Widget? child) => Opacity(
        opacity: t,
        child: Transform.translate(offset: Offset(0, 4 * (1 - t)), child: child),
      ),
      child: aligned,
    );
  }
}
