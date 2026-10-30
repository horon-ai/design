import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../board_frame.dart';

/// `orchestrator_panel` 갤러리 섹션입니다.
///
/// 리드를 맨 위에 두고 병렬 수를 고르는 머리, 계획 목록, 레인 세 개, 그리고
/// 돌아온 결과를 요약하는 상자를 한 화면에 보여 줍니다. 레인은 이 패널이
/// 소유하지 않으므로, 호출하는 쪽이 만든 위젯을 그대로 넘깁니다.
class HoronOrchestratorPanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronOrchestratorPanelGallerySection({super.key});

  static const HoronOrchestratorLead _lead = HoronOrchestratorLead(
    initial: 'R',
    name: 'Research lead',
    role: 'orchestrator',
    status: 'asking four bots',
    running: true,
    elapsed: '2m 14s',
  );

  /// 계획 목록입니다. 끝난 단계의 점은 주 색, 진행 중인 단계는 맥동합니다.
  static List<HoronOrchestratorPlanItem> _plan(HoronThemeData theme) =>
      <HoronOrchestratorPlanItem>[
        HoronOrchestratorPlanItem(
          label: '수집',
          dotColor: theme.colors.interactivePrimary,
        ),
        HoronOrchestratorPlanItem(
          label: '대조',
          dotColor: theme.colors.interactivePrimary,
        ),
        const HoronOrchestratorPlanItem(label: '요약', running: true),
        const HoronOrchestratorPlanItem(label: '검토'),
      ];

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return BoardFrame(
      designWidth: 640,
      child: Padding(
        padding: EdgeInsets.all(theme.space.s4),
        child: HoronOrchestratorPanel(
          title: 'Research run',
          parallelLabel: 'Bots in parallel',
          parallelOptions: const <int>[2, 3, 4],
          parallelValue: 3,
          onParallelChange: (int _) {},
          stopLabel: 'Stop',
          onStop: () {},
          lead: _lead,
          plan: _plan(theme),
          summary: const HoronOrchestratorSummary(
            title: 'Summary',
            count: '2 of 3 returned',
            body: '두 레인이 근거 21건을 모았고, 반대 근거는 아직 확인 중입니다.',
          ),
          children: <Widget>[
            _Lane(
              theme: theme,
              name: 'collector-a',
              detail: '12 sources · 8s',
              done: true,
            ),
            _Lane(
              theme: theme,
              name: 'collector-b',
              detail: '9 sources · 11s',
              done: true,
            ),
            _Lane(theme: theme, name: 'skeptic', detail: '대조 중', running: true),
          ],
        ),
      ),
    );
  }
}

/// 레인 한 줄입니다. 호출하는 쪽이 만든 위젯이 그대로 들어가는 자리를 보여 줍니다.
class _Lane extends StatelessWidget {
  const _Lane({
    required this.theme,
    required this.name,
    required this.detail,
    this.done = false,
    this.running = false,
  });

  final HoronThemeData theme;
  final String name;
  final String detail;
  final bool done;
  final bool running;

  @override
  Widget build(BuildContext context) {
    final HoronColors colors = theme.colors;
    return Row(
      children: <Widget>[
        HoronAvatar.initials(
          name.substring(0, 1).toUpperCase(),
          size: HoronAvatarSize.sm,
          sky: running,
        ),
        SizedBox(width: theme.space.s2),
        Flexible(
          child: Text(
            name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: theme.text.labelSm.copyWith(color: colors.textPrimary),
          ),
        ),
        SizedBox(width: theme.space.s2),
        Flexible(
          child: Text(
            detail,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: theme.text.caption.copyWith(
              color: done ? colors.textPlaceholder : colors.textSecondary,
            ),
          ),
        ),
      ],
    );
  }
}
