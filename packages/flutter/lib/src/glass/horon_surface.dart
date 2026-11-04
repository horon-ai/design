import 'package:flutter/widgets.dart';

import '../contracts/surface.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'glass_geometry.dart';
import 'horon_glass.dart';
import 'horon_veil.dart';

/// 컴포넌트가 쓰는 표면 한 겹입니다.
///
/// solid는 유리 없이 `bg-surface` 채움과 `border-default` 1px을 그리고, glass는
/// [HoronLiquidGlass]를, veilField·veilOverlay는 [HoronVeil]을 깝니다. 떠 있는 표면은
/// 자기 그림자를 답니다. veil은 토큰이 정한 soft shadow를 스스로 그리므로 [shadow]를
/// 넘기지 않습니다.
class HoronSurfaceLayer extends StatelessWidget {
  /// 표면 한 겹을 만듭니다.
  const HoronSurfaceLayer({
    super.key,
    this.surface = HoronSurface.solid,
    this.tier = HoronGlassTier.thick,
    required this.borderRadius,
    this.borderColor,
    this.shadow,
    required this.child,
  });

  /// 표면 종류입니다.
  final HoronSurface surface;

  /// 유리일 때의 채움 두께입니다.
  final HoronGlassTier tier;

  /// 표면의 모서리 반경입니다.
  final BorderRadius borderRadius;

  /// solid 테두리 색을 덮어쓸 때 씁니다. 없으면 `border-default`입니다.
  final Color? borderColor;

  /// solid 표면의 바깥 그림자입니다.
  final List<BoxShadow>? shadow;

  /// 표면 안의 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    switch (surface) {
      case HoronSurface.glass:
        return HoronLiquidGlass(tier: tier, borderRadius: borderRadius, edgeColor: borderColor, child: child);
      case HoronSurface.veilField:
        return HoronVeil(kind: HoronVeilKind.field, borderRadius: borderRadius, child: child);
      case HoronSurface.veilOverlay:
        return HoronVeil(kind: HoronVeilKind.overlay, borderRadius: borderRadius, child: child);
      case HoronSurface.solid:
        final HoronColors colors = HoronTheme.of(context).colors;
        return DecoratedBox(
          decoration: BoxDecoration(
            color: colors.bgSurface,
            borderRadius: borderRadius,
            border: Border.all(color: borderColor ?? colors.borderDefault),
            boxShadow: shadow,
          ),
          child: child,
        );
    }
  }
}
