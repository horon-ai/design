import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/liquid_glass.dart';

import '../section_scaffold.dart';

/// `liquid_glass` 갤러리 섹션입니다.
///
/// 네 겹(그라디언트 채움·4px 블러·1px 그라디언트 테두리·두 겹 그림자)을 눈으로
/// 확인할 수 있게 색 배경 위에 얹습니다. 채움 두 가지(헤더·패널)와 반경 변화를
/// 나열합니다.
class HoronLiquidGlassGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronLiquidGlassGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Liquid Glass',
      variants: <Widget>[
        const _LiquidCell(
          label: 'Header fill',
          child: HoronLiquidGlass(
            padding: EdgeInsets.symmetric(
              horizontal: HoronSpace.s4,
              vertical: HoronSpace.s3,
            ),
            child: Text('헤더 표면'),
          ),
        ),
        const _LiquidCell(
          label: 'Panel fill',
          child: HoronLiquidGlass.panel(
            padding: EdgeInsets.symmetric(
              horizontal: HoronSpace.s4,
              vertical: HoronSpace.s3,
            ),
            child: Text('패널 표면'),
          ),
        ),
        _LiquidCell(
          label: 'Pill radius',
          child: HoronLiquidGlass(
            borderRadius: BorderRadius.circular(HoronRadiusRole.pill),
            padding: const EdgeInsets.symmetric(
              horizontal: HoronSpace.s5,
              vertical: HoronSpace.s2,
            ),
            child: const Text('알약'),
          ),
        ),
      ],
      states: <Widget>[
        const _LiquidCell(
          label: 'Default',
          child: HoronLiquidGlass(
            padding: EdgeInsets.symmetric(
              horizontal: HoronSpace.s4,
              vertical: HoronSpace.s3,
            ),
            child: Text('기본'),
          ),
        ),
        _LiquidCell(
          label: 'Wide (shadow spread)',
          child: HoronLiquidGlass(
            padding: const EdgeInsets.symmetric(
              horizontal: HoronSpace.s6,
              vertical: HoronSpace.s4,
            ),
            child: Wrap(
              spacing: HoronSpace.s4,
              runSpacing: HoronSpace.s2,
              children: <Widget>[Text('브랜드'), Text('문서'), Text('가격')],
            ),
          ),
        ),
      ],
      notes:
          'baalda.com 헤더에서 실측한 레시피입니다. 채움은 세로 그라디언트(light 흰색 40→80%, '
          'dark 8→14%), 블러는 4px, 테두리는 마스킹된 1px 그라디언트, 그림자는 12px/12px/spread 2와 '
          '2px/4px/-1 두 겹입니다. 패널 채움은 94→98%로 진해 목록이 뒤 내용으로 읽히지 않습니다.',
    );
  }
}

/// 액체 유리 표면 하나를 색 배경 위에 얹어 보여 주는 칸입니다.
class _LiquidCell extends StatelessWidget {
  const _LiquidCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          ClipRRect(
            borderRadius: BorderRadius.circular(HoronRadiusRole.card),
            // 표면 뒤에 색과 무늬를 깔아야 낮은 4px 블러와 그라디언트 채움이 보입니다.
            // 다크에서 밝은 배경을 깔면 어두운 유리가 실제보다 밝게 보이므로, 밝기마다
            // 그 밝기의 잉크·강조색으로 뒤판을 만듭니다.
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: Theme.of(context).brightness == Brightness.dark
                      // 다크에서는 밝은 뒤판이 유리를 밝게 보이게 하므로 잉크 계열로 깝니다.
                      ? <Color>[
                          horon.brandInk,
                          horon.brandInk2,
                          Color.alphaBlend(
                            horon.info.withValues(alpha: 0.35),
                            horon.brandInk2,
                          ),
                        ]
                      : <Color>[horon.info, horon.brandGoldSoft, horon.success],
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(HoronSpace.s5),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    for (int index = 0; index < 3; index++)
                      Padding(
                        padding: const EdgeInsets.only(bottom: HoronSpace.s2),
                        child: SizedBox(
                          height: HoronSpace.s2,
                          child: ColoredBox(color: horon.glassFillSolid),
                        ),
                      ),
                    const SizedBox(height: HoronSpace.s2),
                    Align(alignment: Alignment.center, child: child),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
