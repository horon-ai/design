import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `plan_step`의 갤러리 섹션입니다.
///
/// 네 상태를 한 줄씩 이어 붙여 레일과 표식이 어떻게 이어지는지 보여 줍니다.
class HoronPlanStepGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronPlanStepGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 460,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const HoronPlanStep(
              status: HoronPlanStepStatus.done,
              index: 1,
              title: '커밋을 모은다',
              elapsed: '2s',
            ),
            const HoronPlanStep(
              status: HoronPlanStepStatus.running,
              index: 2,
              title: '변경을 분류한다',
              description: '변경 묶음을 세 갈래로 나눕니다',
              tool: 'git.log',
              elapsed: '3s',
            ),
            HoronPlanStep(
              status: HoronPlanStepStatus.failed,
              index: 3,
              title: '노트를 쓴다',
              error: '모델 응답이 잘렸습니다',
              onRetry: () {},
            ),
            const HoronPlanStep(
              status: HoronPlanStepStatus.pending,
              index: 4,
              title: '게시한다',
              last: true,
            ),
          ],
        ),
      ),
    );
  }
}
