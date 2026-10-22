import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/bubble.dart';
import 'package:horon_ui/src/components/message.dart';
import 'package:horon_ui/src/components/message_scroller.dart';

import '../section_scaffold.dart';

/// `message_scroller` 갤러리 섹션입니다.
///
/// React `message-scroller.tsx`에는 cva 변형이 없습니다. 변형 칸에는 넘치는 대화와 넘치지
/// 않는 대화를, 상태 칸에는 바닥·중간·위 세 위치를 놓습니다. 위치는 스크롤 영역을 직접
/// 움직여 만듭니다.
class HoronMessageScrollerGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMessageScrollerGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Message Scroller',
      variants: <Widget>[
        _ScrollerCell(
          label: 'overflowing (20 messages)',
          child: _Conversation(count: 20),
        ),
        _ScrollerCell(
          label: 'fits (2 messages)',
          child: _Conversation(count: 2),
        ),
        _ScrollerCell(
          label: 'with anchor item',
          child: _Conversation(count: 20, anchorIndex: 10),
        ),
      ],
      states: <Widget>[
        _ScrollerCell(
          label: 'opens at the newest',
          child: _Conversation(count: 20),
        ),
        _ScrollerCell(
          label: 'scrolled up (down button shows)',
          child: _Conversation(count: 20, autoScroll: false, scrolledUp: true),
        ),
        _ScrollerCell(
          label: 'custom buttons off',
          child: _Conversation(count: 20, jumpButtons: false),
        ),
      ],
      notes:
          'React `message-scroller.tsx`의 다섯 조각을 옮겼습니다. 스크롤 앵커와 위·아래 이동 '
          '버튼, 새 메시지에서의 자동 스크롤이 계약입니다. 사용자가 위로 올려 둔 상태에서는 '
          '새 메시지가 와도 강제로 내리지 않고, 대신 아래로 가는 버튼이 나타납니다.',
    );
  }
}

/// 대화 하나를 스크롤 영역 안에 그립니다.
class _Conversation extends StatefulWidget {
  const _Conversation({
    required this.count,
    this.anchorIndex,
    this.autoScroll = true,
    this.jumpButtons = true,
    this.scrolledUp = false,
  });

  final int count;
  final int? anchorIndex;

  /// 참이면 새 내용을 따라 내려갑니다.
  final bool autoScroll;
  final bool jumpButtons;

  /// 참이면 첫 배치 뒤에 위로 올려 둔 상태를 만듭니다. 컨트롤러를 직접 움직이며,
  /// 컴포넌트는 호출자가 이미 옮긴 위치를 덮지 않습니다.
  final bool scrolledUp;

  @override
  State<_Conversation> createState() => _ConversationState();
}

class _ConversationState extends State<_Conversation> {
  ScrollController? _controller;

  @override
  void initState() {
    super.initState();
    if (!widget.scrolledUp) return;
    _controller = ScrollController();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final ScrollController? controller = _controller;
      if (!mounted || controller == null || !controller.hasClients) return;
      final double target = controller.position.maxScrollExtent * 0.5;
      controller.jumpTo(target);
    });
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return HoronMessageScroller(
      controller: _controller,
      autoScroll: widget.autoScroll,
      jumpButtons: widget.jumpButtons,
      semanticLabel: '대화',
      children: <Widget>[
        HoronMessageScrollerViewport(
          children: <Widget>[
            HoronMessageScrollerContent(
              children: <Widget>[
                for (int index = 0; index < widget.count; index++)
                  HoronMessageScrollerItem(
                    scrollAnchor: index == widget.anchorIndex,
                    child: _MessageRow(index: index),
                  ),
              ],
            ),
          ],
        ),
      ],
    );
  }
}

/// 메시지 한 줄입니다. 왼쪽과 오른쪽이 번갈아 놓입니다.
class _MessageRow extends StatelessWidget {
  const _MessageRow({required this.index});

  final int index;

  @override
  Widget build(BuildContext context) {
    final bool mine = index.isOdd;
    return HoronMessage(
      alignEnd: mine,
      children: <Widget>[
        HoronMessageAvatar(child: Text(mine ? '민' : '지')),
        HoronMessageContent(
          children: <Widget>[
            HoronMessageHeader(child: Text(mine ? '민열' : '지수')),
            HoronBubble(
              variant: mine
                  ? HoronBubbleVariant.defaultValue
                  : HoronBubbleVariant.muted,
              alignEnd: mine,
              children: <Widget>[
                HoronBubbleContent(child: Text('${index + 1}번째 메시지입니다')),
              ],
            ),
            HoronMessageFooter(
              child: Text('오후 3:${(index + 10).toString().padLeft(2, '0')}'),
            ),
          ],
        ),
      ],
    );
  }
}

/// 스크롤 영역 하나를 이름과 함께 보여 주는 칸입니다.
class _ScrollerCell extends StatelessWidget {
  const _ScrollerCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 340,
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
            child: SizedBox(height: 280, child: child),
          ),
        ],
      ),
    );
  }
}
