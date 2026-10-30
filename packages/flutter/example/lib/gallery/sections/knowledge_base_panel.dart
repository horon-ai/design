import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `max-w-200` — 패널이 넘지 않는 폭 800입니다.
const double _panelWidth = 800;

/// `knowledge_base_panel` 갤러리 섹션입니다.
///
/// 점선 드롭존과 색인 진행이 붙은 기본 패널, 드롭존 없이 둘째 탭을 고른 패널을
/// 나란히 보여 줍니다. 행은 [HoronSourceRow]의 목록 변형입니다.
class HoronKnowledgeBasePanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronKnowledgeBasePanelGallerySection({super.key});

  static const List<HoronKnowledgeBaseTab> _tabs = <HoronKnowledgeBaseTab>[
    HoronKnowledgeBaseTab(id: 'sources', label: 'Sources', count: 12),
    HoronKnowledgeBaseTab(id: 'chunks', label: 'Chunks', count: 248),
    HoronKnowledgeBaseTab(id: 'bots', label: 'Bots', count: 3),
  ];

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s4,
        runSpacing: theme.space.s4,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          _Labelled(
            caption: 'dropzone · indexing · list rows',
            child: HoronKnowledgeBasePanel(
              title: 'Knowledge base',
              meta: '12 sources · 248 chunks · 3 bots',
              tabs: _tabs,
              indexing: 2,
              onSettings: () {},
              onAddSource: () {},
              onFiles: (Object payload) {},
              onBrowse: () {},
              children: const <Widget>[
                HoronSourceRow(
                  status: HoronSourceStatus.ready,
                  icon: Icon(Icons.description_outlined),
                  name: 'Q3 metrics dashboard',
                  detail: '12 pages · 44 chunks',
                  card: false,
                  stages: <HoronSourceStage>[
                    HoronSourceStage.done,
                    HoronSourceStage.done,
                    HoronSourceStage.done,
                    HoronSourceStage.done,
                  ],
                ),
                HoronSourceRow(
                  status: HoronSourceStatus.indexing,
                  icon: Icon(Icons.article_outlined),
                  name: 'Pricing research',
                  detail: '6 pages · 18 chunks',
                  progress: 62,
                  card: false,
                  last: true,
                  stages: <HoronSourceStage>[
                    HoronSourceStage.done,
                    HoronSourceStage.done,
                    HoronSourceStage.active,
                    HoronSourceStage.todo,
                  ],
                ),
              ],
            ),
          ),
          _Labelled(
            caption: 'no dropzone · second tab',
            child: HoronKnowledgeBasePanel(
              title: 'Team knowledge',
              meta: '248 chunks · 3 bots',
              tabs: _tabs,
              defaultValue: 'chunks',
              stages: const <String>['Parse', 'Chunk', 'Embed', 'Index'],
              children: const <Widget>[
                HoronSourceRow(
                  status: HoronSourceStatus.failed,
                  icon: Icon(Icons.link),
                  name: 'Notion workspace',
                  detail: '연결이 끊겼습니다',
                  card: false,
                  last: true,
                  stages: <HoronSourceStage>[
                    HoronSourceStage.done,
                    HoronSourceStage.failed,
                    HoronSourceStage.todo,
                    HoronSourceStage.todo,
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// 상태 이름을 붙인 800 폭 상자입니다.
class _Labelled extends StatelessWidget {
  const _Labelled({required this.caption, required this.child});

  final String caption;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      width: _panelWidth,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s2,
        children: <Widget>[
          Text(
            caption,
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
          child,
        ],
      ),
    );
  }
}
