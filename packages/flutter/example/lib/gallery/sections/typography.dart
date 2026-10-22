import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `typography` 갤러리 섹션입니다.
class HoronTypographyGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTypographyGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Typography',
      variants: <Widget>[
        for (final HoronTypographyLevel level in HoronTypographyLevel.values)
          HoronTypographyHeading(data: 'Heading ${level.name}', level: level),
      ],
      states: <Widget>[
        const SizedBox(
          width: 480,
          child: HoronTypography(
            children: <Widget>[
              HoronTypographyHeading(
                data: 'Composed article',
                level: HoronTypographyLevel.level2,
              ),
              HoronTypographyLead(
                data:
                    'A lead paragraph sets the tone for the rest of the page.',
              ),
              Text('Body copy sits on the 13px base with relaxed line height.'),
              HoronTypographyList(
                items: <String>[
                  'First bullet',
                  'Second bullet',
                  'Third bullet',
                ],
              ),
              HoronTypographyList(
                items: <String>['First step', 'Second step'],
                ordered: true,
              ),
              HoronTypographyInlineCode(data: 'flutter test test/components'),
              HoronTypographyMuted(data: 'Last updated today'),
            ],
          ),
        ),
        const HoronTypographyInlineCode(data: 'HoronTypographyInlineCode'),
        const HoronTypographyMuted(data: 'HoronTypographyMuted'),
        const HoronTypographyLead(data: 'HoronTypographyLead'),
      ],
      notes:
          'React `typography.tsx`의 계열입니다. 제목 `level` 4단계는 `text-display`(36), '
          '`text-heading`(24), `text-subtitle`(18), `text-lead`(16)를 읽고, 인라인 코드는 '
          '상속 크기의 0.85배입니다. `HoronTypographyList`는 이 파일의 목록이며, `list` '
          '슬러그의 별도 컴포넌트와는 다른 것입니다.',
    );
  }
}
