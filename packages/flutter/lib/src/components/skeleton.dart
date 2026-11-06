import 'package:flutter/material.dart';

import '../contracts/surface.dart';
import '../glass/glass_geometry.dart';
import '../glass/horon_surface.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `skeleton.tsx`의 `rounded-xs`입니다. 블록 자리표시자의 반경입니다.
const double _skeletonBlockRadius = 6;

/// `skeleton.tsx`의 `p-4`입니다.
const double _skeletonCardPadding = 16;

/// `skeleton.tsx`의 `gap-3`입니다.
const double _skeletonCardGap = 12;

/// 7% 잉크 자리표시자입니다.
///
/// `skeleton.tsx`를 옮긴 것입니다. React의 `shape`는 props 안의 인라인 유니온이라
/// variant 어휘가 아니므로, Dart는 [pill] 플래그로 받습니다. 반짝임은 React의
/// `animate-shimmer`와 같은 1.6초 주기로 왼쪽에서 오른쪽으로 한 번씩만 지나갑니다
/// (`bg-no-repeat` — 띠가 트랙 밖에서 되돌아오지 않습니다).
class HoronSkeleton extends StatefulWidget {
  /// 자리표시자를 만듭니다.
  const HoronSkeleton({super.key, this.width, this.height, this.pill = false});

  /// 폭입니다.
  final double? width;

  /// 높이입니다.
  final double? height;

  /// `shape="pill"` 자리입니다. 참이면 완전히 둥글고, 아니면 반경 6입니다.
  final bool pill;

  @override
  State<HoronSkeleton> createState() => _HoronSkeletonState();
}

class _HoronSkeletonState extends State<HoronSkeleton> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(vsync: this, duration: HoronMotion.shimmerDuration);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.stop();
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool pill = widget.pill;
    final BorderRadius radius = BorderRadius.circular(pill ? theme.radius.full : _skeletonBlockRadius);
    final bool isDark = theme.brightness == Brightness.dark;
    // 반짝임은 표면색 파생입니다. React는 라이트에 흰색 40%, 다크에 흰색 6%를 씁니다.
    final Color sheen = isDark
        ? theme.colors.textOnInk.withValues(alpha: 0.06)
        : theme.colors.bgSurface.withValues(alpha: 0.4);

    return ExcludeSemantics(
      child: SizedBox(
        width: widget.width,
        height: widget.height,
        child: ClipRRect(
          borderRadius: radius,
          child: ColoredBox(
            color: theme.colors.overlayInk7,
            // `bg-no-repeat` — 띠 하나가 지나가고 트랙 밖에서는 다시 그리지 않습니다.
            // 0.3 폭 띠를 왼쪽 끝 바깥(-1)에서 오른쪽 바깥(약 3.33)까지 옮깁니다.
            child: ClipRect(
              child: Align(
                alignment: AlignmentDirectional.centerStart,
                child: AnimatedBuilder(
                  animation: _controller,
                  builder: (BuildContext context, Widget? child) {
                    return FractionallySizedBox(
                      widthFactor: 0.3,
                      heightFactor: 1,
                      child: FractionalTranslation(
                        // 띠 폭이 트랙의 0.3이므로 -1(왼쪽 바깥)에서 1/0.3(오른쪽 바깥)까지
                        // 옮기면 트랙 전체를 가로지릅니다.
                        translation: Offset(-1 + 4.3333 * _controller.value, 0),
                        child: child,
                      ),
                    );
                  },
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: <Color>[Colors.transparent, sheen, Colors.transparent]),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Figma `Skeleton`(Loading 109:733)의 카드 자리표시자입니다.
///
/// React의 `type`은 props 안의 인라인 유니온이라 어휘가 아니므로, 세 가지 모양을
/// 이름 있는 생성자로 엽니다: [HoronSkeletonCard.row], [HoronSkeletonCard.card],
/// [HoronSkeletonCard.text]. 표면은 `bg-glass-thick`이라 두꺼운 유리가 깔립니다.
class HoronSkeletonCard extends StatelessWidget {
  /// 행 모양입니다. 40px 원형과 두 줄이 가로로 놓입니다.
  const HoronSkeletonCard.row({super.key, this.surface = HoronSurface.solid}) : _kind = _SkeletonCardKind.row;

  /// 카드 모양입니다. 제목 한 줄과 본문 세 줄, 알약 하나가 세로로 쌓입니다.
  const HoronSkeletonCard.card({super.key, this.surface = HoronSurface.solid}) : _kind = _SkeletonCardKind.card;

  /// 글 모양입니다. 세 줄만 놓입니다.
  const HoronSkeletonCard.text({super.key, this.surface = HoronSurface.solid}) : _kind = _SkeletonCardKind.text;

  /// 표면입니다. 기본값은 [HoronSurface.solid]입니다.
  final HoronSurface surface;

  final _SkeletonCardKind _kind;

  @override
  Widget build(BuildContext context) {
    final bool row = _kind == _SkeletonCardKind.row;
    final BorderRadius radius = BorderRadius.circular(HoronTheme.of(context).radius.xl); // rounded-xl = 20

    return Semantics(
      label: 'Loading',
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: HoronSurfaceLayer(
                surface: surface,
                tier: HoronGlassTier.thick,
                borderRadius: radius,
                child: const SizedBox.expand(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(_skeletonCardPadding),
              child: SizedBox(
                width: row ? 300 : 280,
                child: row
                    ? const Row(
                        children: <Widget>[
                          HoronSkeleton(width: 36, height: 36, pill: true),
                          SizedBox(width: _skeletonCardGap),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                HoronSkeleton(width: 140, height: 10),
                                SizedBox(height: 8),
                                HoronSkeleton(width: 200, height: 8),
                              ],
                            ),
                          ),
                        ],
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          if (_kind == _SkeletonCardKind.card) ...<Widget>[
                            const HoronSkeleton(width: 120, height: 12),
                            const SizedBox(height: _skeletonCardGap),
                          ],
                          const HoronSkeleton(width: 248, height: 8),
                          const SizedBox(height: 8),
                          HoronSkeleton(width: _kind == _SkeletonCardKind.card ? 220 : 236, height: 8),
                          const SizedBox(height: 8),
                          HoronSkeleton(width: _kind == _SkeletonCardKind.card ? 160 : 180, height: 8),
                          if (_kind == _SkeletonCardKind.card) ...<Widget>[
                            const SizedBox(height: _skeletonCardGap),
                            const HoronSkeleton(width: 80, height: 28, pill: true),
                          ],
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

enum _SkeletonCardKind { row, card, text }
