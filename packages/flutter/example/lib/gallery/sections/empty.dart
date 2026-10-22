import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/empty.dart';

import '../section_scaffold.dart';

/// `empty` 갤러리 섹션입니다.
class HoronEmptyGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronEmptyGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Empty',
      variants: <Widget>[
        const HoronEmpty(
          header: HoronEmptyHeader(
            title: HoronEmptyTitle('받은 편지가 없습니다'),
            description: HoronEmptyDescription('새 메시지가 오면 여기에 보입니다.'),
          ),
        ),
        const HoronEmpty(
          header: HoronEmptyHeader(
            media: HoronEmptyMedia(
              variant: HoronEmptyMediaVariant.icon,
              icon: Icon(Icons.inbox),
            ),
            title: HoronEmptyTitle('아이콘 있음'),
            description: HoronEmptyDescription(
              '`variant="icon"`은 32px 회색 상자에 아이콘을 넣습니다.',
            ),
          ),
        ),
        const HoronEmpty(
          header: HoronEmptyHeader(
            media: HoronEmptyMedia(icon: Icon(Icons.search)),
            title: HoronEmptyTitle('아이콘만'),
            description: HoronEmptyDescription(
              '`variant="default"`는 배경 없이 아이콘만 놓습니다.',
            ),
          ),
        ),
      ],
      states: <Widget>[
        HoronEmpty(
          header: const HoronEmptyHeader(
            title: HoronEmptyTitle('결과가 없습니다'),
            description: HoronEmptyDescription('검색어를 바꿔 다시 시도해 주세요.'),
          ),
          content: HoronEmptyContent(
            child: TextButton(onPressed: () {}, child: const Text('다시 시도')),
          ),
        ),
        const HoronEmpty(
          header: HoronEmptyHeader(title: HoronEmptyTitle('제목만')),
        ),
        const HoronEmpty(
          header: HoronEmptyHeader(
            description: HoronEmptyDescription('설명만 있는 빈 상태입니다.'),
          ),
        ),
        HoronEmpty(
          header: const HoronEmptyHeader(
            media: HoronEmptyMedia(
              variant: HoronEmptyMediaVariant.icon,
              icon: Icon(Icons.inbox),
            ),
            title: HoronEmptyTitle('아이콘과 버튼'),
            description: HoronEmptyDescription('여섯 조각이 모두 있는 경우입니다.'),
          ),
          content: HoronEmptyContent(
            child: FilledButton(onPressed: () {}, child: const Text('새로 만들기')),
          ),
        ),
      ],
      notes:
          'React `empty.tsx`의 여섯 조각입니다. 폭은 240에서 시작하고 테두리는 `border`, 반경은 '
          '`rounded-md`(12)입니다. `EmptyMedia`의 `icon` 변형만 32px 회색 상자를 그립니다.',
    );
  }
}
