import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `agent_lane`의 갤러리 섹션입니다.
///
/// 실행 중·완료·실패 세 레인을 세로로 쌓아 팬아웃 한 판을 보여 줍니다.
class HoronAgentLaneGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronAgentLaneGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 400,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: theme.space.s2,
          children: <Widget>[
            const HoronAgentLane(
              status: HoronAgentLaneStatus.running,
              initial: 'A',
              name: 'Analyst',
              task: '지표 대시보드를 엽니다',
              elapsed: '1.9s',
              tool: 'Notion · Q3 metrics',
            ),
            const HoronAgentLane(
              status: HoronAgentLaneStatus.done,
              initial: 'B',
              name: 'Researcher',
              task: '시장 자료를 모읍니다',
              elapsed: '4.2s',
              tool: 'Brave · search',
              output: '12개 문서를 찾았습니다',
              usage: '2.6k tokens',
            ),
            const HoronAgentLane(
              status: HoronAgentLaneStatus.failed,
              initial: 'C',
              name: 'Writer',
              task: '요약 노트를 씁니다',
              output: '모델 응답이 잘렸습니다',
            ),
          ],
        ),
      ),
    );
  }
}
