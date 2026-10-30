import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'icon_button.dart';
import 'liquid_glass.dart';

/// `size-[9px]` — 라이브 점의 지름입니다.
const double _liveDotSize = 9;

/// `live-pulse`의 `box-shadow: 0 0 0 6px` — 번지는 고리의 최대 반경입니다.
const double _livePulseSpread = 6;

/// `live-pulse`의 `currentColor 45%` — 고리 색의 투명도입니다.
const double _livePulseAlpha = 0.45;

/// `avatar.tsx`의 bot·md — 32px 원과 18px 로봇 아이콘입니다.
const double _avatarSize = 32;
const double _botIconSize = 18;

/// `h-10` — `icon-button.tsx`의 md 상자 40px입니다.
///
/// `HoronIconButton`은 44px 터치 영역을 깔지만 React의 탑 바는 `overflow-clip`으로 그
/// 영역을 잘라 내므로, 여기서는 40px 상자로 고정해 56px 높이를 맞춥니다.
const double _iconButtonSide = 10;

/// Paper `Top bar`입니다.
///
/// 뒤로 버튼, 라이브 점이 붙은 봇 아바타, 제목과 부제, 더 보기 버튼을 regular 유리 위에
/// 놓습니다. React의 `title`·`subtitle`은 노드이지만 여기서는 한 줄 글자로 그리므로
/// [String]을 받습니다.
class HoronTopBar extends StatelessWidget {
  /// 탑 바를 만듭니다.
  const HoronTopBar({
    super.key,
    required this.title,
    this.subtitle,
    this.live = false,
    this.onBack,
    this.onMore,
    this.backLabel = 'Back',
    this.moreLabel = 'More',
  });

  /// 제목입니다. `truncate text-label-lg`로 한 줄입니다.
  final String title;

  /// 부제입니다. `truncate text-caption`로 한 줄입니다.
  final String? subtitle;

  /// 참이면 아바타 아래에 라이브 점을 그립니다.
  final bool live;

  /// 뒤로 버튼을 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onBack;

  /// 더 보기 버튼을 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onMore;

  /// 뒤로 버튼의 접근성 이름입니다.
  final String backLabel;

  /// 더 보기 버튼의 접근성 이름입니다.
  final String moreLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    // `flex items-center gap-2 rounded-full bg-glass-regular p-2`입니다.
    return HoronLiquidGlass(
      tier: HoronGlassTier.regular,
      borderRadius: BorderRadius.circular(theme.radius.full),
      child: Padding(
        padding: EdgeInsets.all(space.s2), // p-2
        child: Row(
          spacing: space.s2, // gap-2
          children: <Widget>[
            SizedBox(
              width: space.step(_iconButtonSide),
              height: space.step(_iconButtonSide),
              child: HoronIconButton(icon: const Icon(Icons.chevron_left), label: backLabel, onPressed: onBack),
            ),
            _BotAvatar(live: live),
            Expanded(
              // `min-w-0 flex-1 flex-col overflow-clip`입니다.
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    title,
                    style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (subtitle != null)
                    Text(
                      subtitle!,
                      style: theme.text.caption.copyWith(color: colors.textSecondary),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                ],
              ),
            ),
            SizedBox(
              width: space.step(_iconButtonSide),
              height: space.step(_iconButtonSide),
              child: HoronIconButton(icon: const Icon(Icons.more_horiz), label: moreLabel, onPressed: onMore),
            ),
          ],
        ),
      ),
    );
  }
}

/// `Avatar type="bot" size="md"`입니다. `avatar.dart`가 이 랜드에 없으므로 여기서 그립니다.
class _BotAvatar extends StatelessWidget {
  const _BotAvatar({required this.live});

  final bool live;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    return SizedBox(
      width: _avatarSize,
      height: _avatarSize,
      child: Stack(
        clipBehavior: Clip.none,
        children: <Widget>[
          Positioned.fill(
            child: DecoratedBox(
              // `bg-bg-brand text-text-brand`입니다.
              decoration: BoxDecoration(color: colors.bgBrand, shape: BoxShape.circle),
              child: Center(
                child: IconTheme.merge(
                  data: IconThemeData(size: _botIconSize, color: colors.textBrand),
                  child: const Icon(Icons.smart_toy_outlined),
                ),
              ),
            ),
          ),
          if (live)
            Positioned(
              right: 0, // right-0
              bottom: 0, // bottom-0
              child: _LiveDot(color: colors.statusLive),
            ),
        ],
      ),
    );
  }
}

/// `size-[9px] animate-live-pulse bg-status-live` 라이브 점입니다.
///
/// 웹의 `live-pulse`는 무한 반복이지만, 끝없이 프레임을 예약하는 애니메이션은 갤러리
/// 스윕의 `pumpAndSettle`을 끝나지 않게 만듭니다. 그래서 Flutter 판은 진입할 때 2초짜리
/// 한 주기를 재생하고 같은 자리에서 멈춥니다.
class _LiveDot extends StatefulWidget {
  const _LiveDot({required this.color});

  final Color color;

  @override
  State<_LiveDot> createState() => _LiveDotState();
}

class _LiveDotState extends State<_LiveDot> with SingleTickerProviderStateMixin {
  late final AnimationController _pulse = AnimationController(vsync: this, duration: HoronMotion.livePulseDuration);
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    if (!MediaQuery.disableAnimationsOf(context)) _pulse.forward();
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Widget dot = AnimatedBuilder(
      animation: _pulse,
      builder: (BuildContext context, Widget? child) {
        // `box-shadow: 0 0 0 0 → 0 0 0 6px`, `currentColor 45% → transparent`.
        final double t = Curves.easeOutQuint.transform(_pulse.value);
        return Container(
          width: _liveDotSize,
          height: _liveDotSize,
          decoration: BoxDecoration(
            color: widget.color,
            shape: BoxShape.circle,
            boxShadow: reduceMotion || t >= 1
                ? null
                : <BoxShadow>[
                    BoxShadow(
                      color: widget.color.withValues(alpha: _livePulseAlpha * (1 - t)),
                      spreadRadius: _livePulseSpread * t,
                    ),
                  ],
          ),
        );
      },
    );

    // `animate-pop-in`: scale 0.6 → 1, 220ms spring.
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: dot,
    );
  }
}
