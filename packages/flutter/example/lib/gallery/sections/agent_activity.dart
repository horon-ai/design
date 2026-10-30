import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `agent_activity`의 갤러리 섹션입니다.
///
/// 생각 중 표시, 스트리밍 말풍선, 도구 단계 세 상태, 작업 기록을 세로로 보여 줍니다.
class HoronAgentActivityGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronAgentActivityGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 460,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: theme.space.s3,
          children: <Widget>[
            const HoronThinkingIndicator(),
            const HoronStreamingText(text: '세 개의 문서를 읽고 요약을 준비하고 있습니다'),
            const HoronToolStep(
              title: 'Q3 지표를 검색한다',
              detail: 'notion · search',
              state: HoronToolStepState.done,
            ),
            const HoronToolStep(
              title: '요약을 생성한다',
              detail: 'claude · 2.6k tokens',
            ),
            const HoronToolStep(
              title: '슬라이드를 만든다',
              detail: 'deck · failed',
              state: HoronToolStepState.failed,
            ),
            const HoronWorkLog(
              summary: '도구 3개 · 4.2s',
              steps: <HoronWorkLogStep>[
                HoronWorkLogStep(title: '문서를 열었다', detail: 'notion'),
                HoronWorkLogStep(title: '지표를 모았다', detail: 'brave'),
                HoronWorkLogStep(title: '요약을 쓰는 중', running: true),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
