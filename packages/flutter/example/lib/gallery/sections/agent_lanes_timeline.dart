import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `agent_lanes_timeline`의 갤러리 섹션입니다.
///
/// 승인 줄과 인계 곡선이 붙은 판, 작업 색 네 가지와 봇 색 네 가지를 한 판에 모은
/// 판을 나란히 보여 줍니다. [Wrap]이라 휴대폰 폭에서는 두 판이 위아래로 섭니다.
class HoronAgentLanesTimelineGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronAgentLanesTimelineGallerySection({super.key});

  /// 판이 넘지 않는 폭입니다.
  static const double _maxWidth = 900;

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
                    _Caption('승인 줄과 인계 곡선'),
                    HoronAgentLanesTimeline(
                      statuses: const <HoronLaneStatus>[
                        HoronLaneStatus(id: 'live', label: '4 running'),
                        HoronLaneStatus(
                          id: 'ink',
                          label: '2 idle',
                          live: false,
                        ),
                      ],
                      bots: _withApproval,
                      handoffs: const <HoronLaneHandoff>[
                        HoronLaneHandoff(from: 'scan', to: 'draft'),
                      ],
                      cursor: 2,
                      approval: HoronAgentLanesTimelineApproval(
                        message: 'Writer가 배포를 기다립니다',
                        onLater: () {},
                        onApprove: () {},
                      ),
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
                    _Caption('작업 색 네 가지 · 봇 색 네 가지'),
                    const HoronAgentLanesTimeline(
                      bots: _withEveryTone,
                      cursor: -4,
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

/// 승인 판의 봇입니다.
const List<HoronLaneBot> _withApproval = <HoronLaneBot>[
  HoronLaneBot(
    id: 'analyst',
    name: 'Analyst',
    initial: 'A',
    tone: HoronLaneBotTone.sky,
    tools: 'Notion · Slack',
    tasks: <HoronLaneTask>[
      HoronLaneTask(
        id: 'scan',
        label: '지표를 모읍니다',
        tone: HoronLaneTaskTone.done,
        start: -28,
        end: -16,
      ),
      HoronLaneTask(
        id: 'chart',
        label: '대시보드를 엽니다',
        tone: HoronLaneTaskTone.running,
        start: -16,
        end: -4,
        badge: 'Needs you',
      ),
    ],
  ),
  HoronLaneBot(
    id: 'writer',
    name: 'Writer',
    initial: 'W',
    tone: HoronLaneBotTone.ink,
    badge: 'Idle',
    badgeInk: true,
    tasks: <HoronLaneTask>[
      HoronLaneTask(
        id: 'draft',
        label: '요약을 씁니다',
        tone: HoronLaneTaskTone.waiting,
        start: -4,
        end: 0,
      ),
    ],
  ),
];

/// 네 가지 작업 색과 네 가지 봇 색을 한 판에 모은 봇 목록입니다.
const List<HoronLaneBot> _withEveryTone = <HoronLaneBot>[
  HoronLaneBot(
    id: 'sky',
    name: 'Sky',
    initial: 'S',
    tone: HoronLaneBotTone.sky,
    badge: 'Done',
    tasks: <HoronLaneTask>[
      HoronLaneTask(
        id: 'sky-done',
        label: 'done',
        tone: HoronLaneTaskTone.done,
        start: -26,
        end: -6,
      ),
    ],
  ),
  HoronLaneBot(
    id: 'steel',
    name: 'Steel',
    initial: 'T',
    tone: HoronLaneBotTone.steel,
    tasks: <HoronLaneTask>[
      HoronLaneTask(
        id: 'steel-running',
        label: 'running',
        tone: HoronLaneTaskTone.running,
        start: -20,
        end: -2,
      ),
    ],
  ),
  HoronLaneBot(
    id: 'neutral',
    name: 'Neutral',
    initial: 'N',
    tone: HoronLaneBotTone.neutral,
    tasks: <HoronLaneTask>[
      HoronLaneTask(
        id: 'neutral-failed',
        label: 'failed',
        tone: HoronLaneTaskTone.failed,
        start: -14,
        end: 0,
      ),
    ],
  ),
  HoronLaneBot(
    id: 'ink',
    name: 'Ink',
    initial: 'I',
    tone: HoronLaneBotTone.ink,
    tasks: <HoronLaneTask>[
      HoronLaneTask(
        id: 'ink-waiting',
        label: 'waiting',
        tone: HoronLaneTaskTone.waiting,
        start: -9,
        end: -1,
      ),
    ],
  ),
];
