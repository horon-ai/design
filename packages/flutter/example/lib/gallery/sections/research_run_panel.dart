import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `research_run_panel`의 갤러리 섹션입니다.
///
/// 실행 중인 판과 끝난 판을 나란히 놓습니다. [Wrap]이라 휴대폰 폭에서는 판이
/// 위아래로 섭니다.
class HoronResearchRunPanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronResearchRunPanelGallerySection({super.key});

  /// 판이 넘지 않는 폭입니다.
  static const double _panelWidth = 420;

  /// 갤러리에서 보여 주는 질의입니다.
  static const List<HoronResearchQuery> _queries = <HoronResearchQuery>[
    HoronResearchQuery(
      id: 'q1',
      text: 'horon design system release notes',
      results: '8 results',
    ),
    HoronResearchQuery(
      id: 'q2',
      text: 'flutter widget rebuild rules',
      results: '5 results',
    ),
    HoronResearchQuery(
      id: 'q3',
      text: 'liquid glass layer stack',
      searching: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s4,
        runSpacing: theme.space.s4,
        children: <Widget>[
          SizedBox(
            width: _panelWidth,
            child: HoronResearchRunPanel(
              question: 'What changed in the Flutter rebuild this week?',
              elapsed: '18s',
              read: 3,
              total: 8,
              queries: _queries,
              sources: const <String>['J', 'M', 'A'],
              onNewResearch: () {},
              onStop: () {},
              onFollowUp: (String value) {},
            ),
          ),
          SizedBox(
            width: _panelWidth,
            child: HoronResearchRunPanel(
              question: 'Which components landed in the agents group?',
              running: false,
              read: 8,
              total: 8,
              queries: const <HoronResearchQuery>[
                HoronResearchQuery(
                  id: 'q1',
                  text: 'agents lane component list',
                  results: '8 results',
                ),
              ],
              sources: const <String>['J', 'M'],
              onNewResearch: () {},
              onFollowUp: (String value) {},
            ),
          ),
        ],
      ),
    );
  }
}
