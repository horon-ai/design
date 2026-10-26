import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `glass_surface` 갤러리 섹션입니다.
///
/// 유리 표면은 뒤에 있는 내용을 흐리는 효과라, 색이 있는 배경 위에 겹쳐 놓아야
/// 블러가 보입니다. 그래서 이 섹션은 표면마다 색 배경과 글자를 뒤에 깔고 그 위에
/// 유리를 얹습니다.
class HoronGlassSurfaceGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronGlassSurfaceGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Glass Surface',
      variants: <Widget>[
        _GlassCell(
          label: 'glass',
          child: const HoronGlassSurface(child: Text('유리 위 글자')),
        ),
        _GlassCell(
          label: 'glass-strong',
          child: const HoronGlassSurface.strong(child: Text('진한 유리 위 글자')),
        ),
        _GlassCell(
          label: 'pill radius',
          child: HoronGlassSurface(
            borderRadius: BorderRadius.circular(HoronRadiusRole.pill),
            child: const Text('알약 모양 유리'),
          ),
        ),
      ],
      states: <Widget>[
        const _GlassCell(
          label: 'Default',
          child: HoronGlassSurface(child: Text('기본 단계')),
        ),
        const _GlassCell(
          label: 'Solid (no backdrop-filter)',
          child: HoronGlassSurface(solid: true, child: Text('불투명 단계')),
        ),
        _GlassCell(
          label: 'Frost (reduced transparency)',
          child: MediaQuery(
            // 웹의 `prefers-reduced-transparency: reduce`에 대응하는 앱 쪽 신호입니다.
            data: MediaQuery.of(context).copyWith(disableAnimations: true),
            child: const HoronGlassSurface(child: Text('서리 단계')),
          ),
        ),
      ],
      notes:
          'React `glass-surface.tsx`의 `.glass`입니다. 채움은 glassFill, 테두리는 glassBorder, '
          '블러는 32px입니다. 접근성 설정(disableAnimations·accessibleNavigation)이 켜지면 '
          'frost 단계(불투명도 90%)로 내려가고 블러를 걸지 않습니다. solid를 켜면 불투명 단계입니다.',
    );
  }
}

/// 유리 표면 하나를 색 배경 위에 얹어 보여 주는 칸입니다.
class _GlassCell extends StatelessWidget {
  const _GlassCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 280,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          ClipRRect(
            borderRadius: BorderRadius.circular(HoronRadiusRole.card),
            // 블러가 보이도록 표면 뒤에 무늬를 깝니다. 이 무늬가 없으면 유리가
            // 투명해도 뒤가 단색이라 흐림을 확인할 수 없습니다.
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: <Color>[horon.brandInk, horon.brandGold, horon.info],
                ),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.all(HoronSpace.s6),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        for (int index = 0; index < 4; index++)
                          Padding(
                            padding: const EdgeInsets.only(
                              bottom: HoronSpace.s2,
                            ),
                            child: SizedBox(
                              width: 180,
                              height: HoronSpace.s2,
                              child: ColoredBox(
                                color: scheme.surface.withValues(alpha: 0.7),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(HoronSpace.s4),
                    child: child,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
