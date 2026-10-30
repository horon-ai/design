import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `plan_card`의 갤러리 섹션입니다.
///
/// 진행 중인 계획과 실패한 계획을 세로로 보여 줍니다.
class HoronPlanCardGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronPlanCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 460,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: theme.space.s4,
          children: <Widget>[
            HoronPlanCard(
              label: 'Plan · 3 steps',
              title: '릴리스 노트를 정리합니다',
              steps: <Widget>[
                Text(
                  '1. 커밋을 모은다',
                  style: theme.text.bodySm.copyWith(
                    color: theme.colors.textSecondary,
                  ),
                ),
                Text(
                  '2. 변경을 분류한다',
                  style: theme.text.bodySm.copyWith(
                    color: theme.colors.textPrimary,
                  ),
                ),
                Text(
                  '3. 노트를 쓴다',
                  style: theme.text.bodySm.copyWith(
                    color: theme.colors.textDisabled,
                  ),
                ),
              ],
              status: HoronPlanCardStatus.running,
              statusLabel: 'Running · 1 of 3',
              elapsed: '12s',
            ),
            const HoronPlanCard(
              label: 'Plan · 2 steps',
              title: '배포를 준비합니다',
              status: HoronPlanCardStatus.failed,
              statusLabel: 'Stopped · step 2 failed',
              elapsed: '48s',
            ),
          ],
        ),
      ),
    );
  }
}
