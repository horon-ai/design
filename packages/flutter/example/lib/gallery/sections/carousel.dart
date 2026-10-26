import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `carousel` 갤러리 섹션입니다.
class HoronCarouselGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCarouselGallerySection({super.key});

  Widget _slide(BuildContext context, int index) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: index.isEven
            ? scheme.surfaceContainerHighest
            : scheme.secondaryContainer,
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
      ),
      child: Center(
        child: Text(
          '슬라이드 ${index + 1}',
          style: TextStyle(
            color: scheme.onSurface,
            decoration: TextDecoration.none,
          ),
        ),
      ),
    );
  }

  Widget _carousel(
    BuildContext context, {
    int initialPage = 0,
    int count = 3,
    double width = 460,
  }) => SizedBox(
    width: width,
    child: HoronCarousel(
      extent: 140,
      initialPage: initialPage,
      semanticLabel: '가로 캐러셀',
      children: <Widget>[
        HoronCarouselContent(
          children: <Widget>[
            for (int index = 0; index < count; index++)
              HoronCarouselItem(
                semanticLabel: '슬라이드 ${index + 1}',
                child: _slide(context, index),
              ),
          ],
        ),
        const HoronCarouselPrevious(),
        const HoronCarouselNext(),
        const HoronCarouselDots(),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Carousel',
      variants: <Widget>[
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: HoronSpace.s5,
          children: <Widget>[
            _carousel(context),
            SizedBox(
              width: 320,
              child: HoronCarousel.vertical(
                extent: 120,
                semanticLabel: '세로 캐러셀',
                children: <Widget>[
                  HoronCarouselContent(
                    children: <Widget>[
                      for (int index = 0; index < 2; index++)
                        HoronCarouselItem(child: _slide(context, index)),
                    ],
                  ),
                  const HoronCarouselPrevious(),
                  const HoronCarouselNext(),
                  const HoronCarouselDots(),
                ],
              ),
            ),
          ],
        ),
      ],
      states: <Widget>[
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: HoronSpace.s5,
          children: <Widget>[
            _carousel(context, initialPage: 0),
            _carousel(context, initialPage: 1),
            _carousel(context, initialPage: 2),
            _carousel(context, count: 1),
          ],
        ),
      ],
      notes:
          'React `carousel.tsx`의 다섯 조각입니다. `PageView`가 한 번에 한 장씩 스냅하고, '
          '첫 장에서는 이전 화살표가, 마지막 장에서는 다음 화살표가 비활성입니다. 자동 재생·'
          '루프·무한 스크롤은 없습니다. 점 줄은 React에 없는 이 패키지의 추가 파트입니다. '
          '`extent`는 슬라이드 높이로, `PageView`가 넘기는 축과 직각인 길이를 부모에게서 '
          '받아야 해서 호출자가 정합니다.',
    );
  }
}
