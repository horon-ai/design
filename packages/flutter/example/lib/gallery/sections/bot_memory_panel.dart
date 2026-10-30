import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/bot_memory_panel.dart';

/// `bot_memory_panel` 갤러리 섹션입니다.
///
/// 방금 갱신 알약과 새 기억이 붙은 기본 패널, 설정이 두 줄인 패널, 기억만 있는
/// 짧은 패널을 나란히 보여 줍니다. 각 패널 위에 그 상태의 이름을 답니다.
class HoronBotMemoryPanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronBotMemoryPanelGallerySection({super.key});

  static const List<HoronBotMemorySetting> _settings = <HoronBotMemorySetting>[
    HoronBotMemorySetting(
      id: 'remember',
      label: 'Remember this chat',
      description: 'Keeps facts from the conversation',
      defaultChecked: true,
    ),
    HoronBotMemorySetting(
      id: 'infer',
      label: 'Infer preferences',
      description: 'Learns how you like answers written',
    ),
  ];

  static const List<HoronBotMemoryItem> _memories = <HoronBotMemoryItem>[
    HoronBotMemoryItem(id: 'm1', text: '아침 보고서는 9시 전에 받는 편입니다', source: '채팅에서 · 10월 8일', group: 'Work'),
    HoronBotMemoryItem(
      id: 'm2',
      text: '표와 짧은 문단을 함께 쓰는 답을 좋아합니다',
      source: '채팅에서 · 10월 9일',
      group: 'Style',
      fresh: true,
    ),
    HoronBotMemoryItem(id: 'm3', text: '디자인 팀은 네 명입니다', source: '설정에서 · 10월 2일', group: 'Facts'),
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
            caption: 'toast · fresh memory',
            child: HoronBotMemoryPanel(
              usage: 62,
              subtitle: 'Learned from your chats',
              settings: _settings,
              memories: _memories,
              toast: const HoronBotMemoryToast(title: 'Memory updated', message: '표와 짧은 문단을 함께 씁니다'),
            ),
          ),
          _Labelled(
            caption: 'settings only',
            child: const HoronBotMemoryPanel(usage: 18, settings: _settings, memories: <HoronBotMemoryItem>[]),
          ),
          _Labelled(
            caption: 'full meter, one group',
            child: const HoronBotMemoryPanel(
              usage: 100,
              memories: <HoronBotMemoryItem>[
                HoronBotMemoryItem(id: 'm3', text: '디자인 팀은 네 명입니다', source: '설정에서 · 10월 2일', group: 'Facts'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// `max-w-140` — 패널이 넘지 않는 폭 560입니다.
const double _panelWidth = 560;

/// 상태 이름을 붙인 560 폭 상자입니다.
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
          Text(caption, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
          child,
        ],
      ),
    );
  }
}
