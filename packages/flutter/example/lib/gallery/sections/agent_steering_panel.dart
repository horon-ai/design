import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `agent_steering_panel`의 갤러리 섹션입니다.
///
/// 쪽지 대기열이 붙은 실행 중 판과, 쪽지 없이 멈춘 판을 나란히 보여 줍니다.
/// [Wrap]이라 휴대폰 폭에서는 두 판이 위아래로 섭니다.
class HoronAgentSteeringPanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronAgentSteeringPanelGallerySection({super.key});

  /// 판이 넘지 않는 폭입니다(`max-w-130` = 520).
  static const double _maxWidth = 520;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);

    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double width = constraints.maxWidth.clamp(0.0, _maxWidth);
          return Wrap(
            spacing: theme.space.s6,
            runSpacing: theme.space.s6,
            children: <Widget>[
              SizedBox(
                width: width,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: theme.space.s2,
                  children: <Widget>[
                    _Caption('대기열과 조타 상자'),
                    HoronAgentSteeringPanel(
                      title: 'Draft the reply',
                      subtitle: 'Inbox · 3 threads',
                      status: 'Running · 2m 10s',
                      steps: _steps,
                      notes: _notes,
                      onApplyNow: (String id) {},
                      onRemoveNote: (String id) {},
                      onSteer: (String text, bool interrupt) {},
                    ),
                  ],
                ),
              ),
              SizedBox(
                width: width,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: theme.space.s2,
                  children: <Widget>[
                    _Caption('멈춘 판 · 쪽지 없음'),
                    HoronAgentSteeringPanel(
                      title: 'Summarise the thread',
                      subtitle: 'Inbox · 1 thread',
                      status: 'Paused · 0m 42s',
                      paused: true,
                      steps: _pausedSteps,
                      onPausedChange: (bool paused) {},
                      onSteer: (String text, bool interrupt) {},
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

/// 판 위의 작은 설명입니다.
class _Caption extends StatelessWidget {
  const _Caption(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Text(
      text,
      style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
    );
  }
}

/// 실행 중인 판의 단계입니다. 세 상태를 모두 보여 줍니다.
const List<HoronSteeringStep> _steps = <HoronSteeringStep>[
  HoronSteeringStep(
    id: 'read',
    label: '메일을 읽습니다',
    status: HoronSteeringStepStatus.done,
    time: '1.4s',
  ),
  HoronSteeringStep(
    id: 'plan',
    label: '답장을 계획합니다',
    status: HoronSteeringStepStatus.active,
  ),
  HoronSteeringStep(
    id: 'send',
    label: '답장을 보냅니다',
    status: HoronSteeringStepStatus.todo,
  ),
];

/// 대기 중인 쪽지 한 장과 이미 적용된 쪽지 한 장입니다.
const List<HoronSteeringNote> _notes = <HoronSteeringNote>[
  HoronSteeringNote(id: 'tone', text: '더 짧게 써 주세요'),
  HoronSteeringNote(id: 'sign', text: '서명을 빼 주세요', applied: true),
];

/// 멈춘 판의 단계입니다.
const List<HoronSteeringStep> _pausedSteps = <HoronSteeringStep>[
  HoronSteeringStep(
    id: 'read',
    label: '메일을 읽습니다',
    status: HoronSteeringStepStatus.done,
    time: '0.8s',
  ),
  HoronSteeringStep(
    id: 'summarise',
    label: '스레드를 요약합니다',
    status: HoronSteeringStepStatus.todo,
  ),
];
