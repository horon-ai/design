import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `task_row`의 갤러리 섹션입니다.
///
/// 실행 중·검토·실패·완료 네 상태를 목록으로 쌓아 보여 줍니다.
class HoronTaskRowGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronTaskRowGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 560),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: theme.space.s3,
          children: <Widget>[
            HoronTaskRow(
              status: HoronTaskStatus.running,
              title: 'Q3 보드 덱을 준비합니다',
              botInitial: 'A',
              botName: 'Analyst',
              message: '지표를 모으는 중',
              elapsed: '1m 56s',
              project: 'Q3 board',
              detail: '2 drafts · 1 calendar change',
              onCancel: () {},
            ),
            HoronTaskRow(
              status: HoronTaskStatus.review,
              title: '릴리스 노트 초안',
              botInitial: 'B',
              botName: 'Writer',
              message: '초안이 준비되었습니다',
              elapsed: '4m 02s',
              project: 'release',
              onReview: () {},
              onArchive: () {},
            ),
            HoronTaskRow(
              status: HoronTaskStatus.failed,
              title: '슬라이드를 만들지 못했습니다',
              botInitial: 'C',
              botName: 'Deck',
              message: '도구가 실패했습니다',
              detail: 'model timeout',
              onRetry: () {},
            ),
            HoronTaskRow(
              status: HoronTaskStatus.done,
              title: '문서를 색인했습니다',
              botInitial: 'D',
              botName: 'Indexer',
              message: '완료',
              elapsed: '12s',
              onArchive: () {},
            ),
          ],
        ),
      ),
    );
  }
}
