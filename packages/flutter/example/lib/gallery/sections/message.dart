import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/bubble.dart';
import 'package:horon_ui/src/components/message.dart';

import '../section_scaffold.dart';

/// `message` 갤러리 섹션입니다.
///
/// React `message.tsx`에는 cva 변형이 없습니다. 변형 칸에는 메시지의 다섯 파트가 모두
/// 들어간 모양과 파트별 모양을, 상태 칸에는 두 정렬과 꼬리말로 인한 아바타 이동을
/// 놓습니다.
class HoronMessageGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMessageGallerySection({super.key});

  /// 메시지 하나를 만듭니다.
  Widget _message({
    required String author,
    required String body,
    bool alignEnd = false,
    String? footer,
    bool withAvatar = true,
  }) {
    return HoronMessage(
      alignEnd: alignEnd,
      children: <Widget>[
        if (withAvatar)
          HoronMessageAvatar(child: Text(author.characters.first)),
        HoronMessageContent(
          children: <Widget>[
            HoronMessageHeader(child: Text(author)),
            HoronBubble(
              alignEnd: alignEnd,
              children: <Widget>[HoronBubbleContent(child: Text(body))],
            ),
            if (footer != null) HoronMessageFooter(child: Text(footer)),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Message',
      variants: <Widget>[
        _MessageCell(
          label: 'avatar + content',
          child: _message(author: '민열', body: '안녕하세요. 오늘 회의는 세 시입니다.'),
        ),
        _MessageCell(
          label: 'with header',
          child: _message(author: '지수', body: '확인했습니다.'),
        ),
        _MessageCell(
          label: 'with footer',
          child: _message(author: '지수', body: '자료를 올렸습니다.', footer: '오후 3:12'),
        ),
        _MessageCell(
          label: 'content only',
          child: HoronMessage(
            children: <Widget>[
              HoronMessageContent(
                children: <Widget>[
                  HoronBubble(
                    children: <Widget>[
                      HoronBubbleContent(child: Text('아바타 없는 메시지')),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
        _MessageCell(
          label: 'avatar only',
          child: const HoronMessage(
            children: <Widget>[HoronMessageAvatar(child: Text('민'))],
          ),
        ),
      ],
      states: <Widget>[
        _MessageCell(
          label: 'align start',
          child: _message(
            author: '지수',
            body: '시작 쪽에 놓인 메시지',
            footer: '오후 3:12',
          ),
        ),
        _MessageCell(
          label: 'align end',
          child: _message(
            author: '민열',
            body: '끝 쪽에 놓인 메시지',
            alignEnd: true,
            footer: '오후 3:13',
          ),
        ),
        _MessageCell(
          label: 'no footer, no lift',
          child: _message(author: '지수', body: '아바타가 바닥에 붙어 있습니다'),
        ),
        _MessageCell(
          label: 'footer lifts the avatar',
          child: _message(
            author: '지수',
            body: '꼬리말이 있으면 아바타가 32px 올라갑니다',
            footer: '오후 3:14',
          ),
        ),
      ],
      notes:
          'React `message.tsx`의 다섯 파트를 그대로 옮겼습니다. `align="end"`는 행을 뒤집어 '
          '아바타를 끝 쪽에 두고, 꼬리말이 있으면 아바타를 `-translate-y-8`만큼 올립니다. '
          '정렬은 주변 방향을 따르므로 오른쪽에서 왼쪽 화면에서는 좌우가 뒤집힙니다.',
    );
  }
}

/// 메시지 하나를 이름과 함께 보여 주는 칸입니다.
class _MessageCell extends StatelessWidget {
  const _MessageCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 380,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          DecoratedBox(
            decoration: BoxDecoration(
              color: scheme.surface,
              borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              border: Border.all(color: scheme.outline),
            ),
            child: Padding(
              padding: const EdgeInsets.all(HoronSpace.s3),
              child: child,
            ),
          ),
        ],
      ),
    );
  }
}
