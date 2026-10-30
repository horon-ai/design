import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `agent_panel`의 갤러리 섹션입니다.
///
/// 필터와 작업 행을 담은 판, 그리고 작성 상자를 함께 보여 줍니다.
class HoronAgentPanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronAgentPanelGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 640),
        child: HoronAgentPanel(
          filter: HoronBadge(
            label: '실행 중 3',
            tone: HoronBadgeTone.brand,
            dot: true,
          ),
          children: <Widget>[
            HoronTaskRow(
              status: HoronTaskStatus.running,
              title: 'Q3 보드 덱을 준비합니다',
              botInitial: 'A',
              botName: 'Analyst',
              message: '지표를 모으는 중',
              elapsed: '1m 56s',
              project: 'Q3 board',
              onCancel: () {},
            ),
            HoronTaskComposer(
              pickers: const <Widget>[
                HoronComposerChip(label: 'Analyst', initial: 'A'),
                HoronComposerChip(
                  label: 'Q3 board',
                  icon: Icon(Icons.folder_outlined),
                ),
              ],
              onStart: () {},
            ),
          ],
        ),
      ),
    );
  }
}
