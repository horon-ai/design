import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 표면 하나(solid 또는 glass)의 표본 묶음입니다.
///
/// 갤러리는 solid와 glass를 둘 다 지원하는 컴포넌트를 두 묶음으로 나눠 보여 줍니다.
/// 두 묶음의 표본 목록은 같고 표면만 다릅니다. glass 묶음은 하늘 배경 위에 얹어
/// 유리가 뒤 배경을 흐리는 모습을 실제 앱과 같은 조건에서 확인할 수 있게 합니다.
class SurfaceGroup extends StatelessWidget {
  /// 묶음을 만듭니다.
  const SurfaceGroup({
    super.key,
    required this.label,
    required this.child,
    this.glass = false,
  });

  /// 묶음 이름입니다.
  final String label;

  /// 묶음에 담는 표본입니다.
  final Widget child;

  /// 유리 표면 묶음이면 `true`입니다. 하늘 배경을 깔고 그 위에 표본을 얹습니다.
  final bool glass;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s3,
      children: <Widget>[
        Text(
          label,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
        if (glass) _SkyStage(child: child) else child,
      ],
    );
  }
}

/// 표본 뒤에 갤러리가 쓰는 하늘 배경을 깔아 주는 틀입니다.
///
/// 배경은 12초 시점의 정지 프레임입니다. `TickerMode`를 꺼서 갤러리를 스크롤하는
/// 동안 티커가 돌지 않게 합니다. 테두리는 둥글게 잘라 배경이 섹션 밖으로 새지 않게 합니다.
class _SkyStage extends StatelessWidget {
  const _SkyStage({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return ClipRRect(
      borderRadius: BorderRadius.all(Radius.circular(theme.radius.lg)),
      child: Stack(
        children: <Widget>[
          Positioned(
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            child: TickerMode(
              enabled: false,
              child: const HoronFlueBackground(),
            ),
          ),
          Padding(padding: EdgeInsets.all(theme.space.s4), child: child),
        ],
      ),
    );
  }
}
