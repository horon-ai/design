import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `source_row`의 갤러리 섹션입니다.
///
/// 준비·색인 중·실패 세 상태를 카드로, 목록 변형도 함께 보여 줍니다.
class HoronSourceRowGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronSourceRowGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 620),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: theme.space.s3,
          children: <Widget>[
            const HoronSourceRow(
              status: HoronSourceStatus.ready,
              icon: Icon(Icons.description_outlined),
              name: 'Q3 metrics dashboard',
              detail: '12 pages · 44 chunks',
            ),
            const HoronSourceRow(
              status: HoronSourceStatus.indexing,
              icon: Icon(Icons.description_outlined),
              name: 'Pricing research',
              detail: '색인 중입니다',
              progress: 62,
            ),
            HoronSourceRow(
              status: HoronSourceStatus.failed,
              icon: const Icon(Icons.description_outlined),
              name: 'Broken PDF',
              detail: '파싱에 실패했습니다',
              onRetry: () {},
            ),
            HoronSourceRow(
              status: HoronSourceStatus.ready,
              icon: const Icon(Icons.article_outlined),
              name: '목록 변형',
              detail: '3 pages · 9 chunks',
              card: false,
              last: true,
            ),
          ],
        ),
      ),
    );
  }
}
