import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `alert` 갤러리 섹션입니다.
class HoronAlertGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronAlertGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Alert',
      variants: <Widget>[
        for (final HoronAlertVariant variant in HoronAlertVariant.values)
          SizedBox(
            width: 320,
            child: HoronAlert(
              variant: variant,
              title: HoronAlertTitle(variant.name),
              description: const HoronAlertDescription(
                '변형마다 테두리 30%, 배경 10%, 글자 100%를 씁니다.',
              ),
            ),
          ),
      ],
      states: <Widget>[
        const SizedBox(
          width: 320,
          child: HoronAlert(title: HoronAlertTitle('제목만')),
        ),
        const SizedBox(
          width: 320,
          child: HoronAlert(
            variant: HoronAlertVariant.info,
            icon: Icon(Icons.info_outline),
            title: HoronAlertTitle('아이콘 있음'),
            description: HoronAlertDescription(
              '아이콘이 있으면 첫 열이 생기고 제목이 두 번째 열로 갑니다.',
            ),
          ),
        ),
        SizedBox(
          width: 320,
          child: HoronAlert(
            variant: HoronAlertVariant.destructive,
            icon: const Icon(Icons.error_outline),
            title: const HoronAlertTitle('아이콘과 두 문단'),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: const <Widget>[
                HoronAlertDescription('첫 번째 문단입니다.'),
                SizedBox(height: 4),
                HoronAlertDescription('두 번째 문단입니다.'),
              ],
            ),
          ),
        ),
        const SizedBox(
          width: 320,
          child: HoronAlert(
            variant: HoronAlertVariant.success,
            description: HoronAlertDescription('설명만 있는 성공 알림입니다.'),
          ),
        ),
      ],
      notes:
          'React `alert.tsx`의 다섯 변형입니다. `default`는 카드 표면, 나머지 넷은 각자의 의미 색을 '
          '테두리 30%·배경 10%·전경 100%·설명 90%로 씁니다. 아이콘은 호스트가 넘깁니다.',
    );
  }
}
