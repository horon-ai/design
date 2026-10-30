import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `chat_bubble`의 갤러리 섹션입니다.
///
/// 내 쪽 잉크 말풍선과 봇 쪽 옅은 말풍선을 번갈아 보여 줍니다.
class HoronChatBubbleGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronChatBubbleGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: theme.space.s3,
        children: <Widget>[
          const HoronChatBubble(fromMe: false, child: Text('무엇을 도와드릴까요?')),
          const HoronChatBubble(child: Text('이번 주 배포 요약을 만들어 줘')),
          const HoronChatBubble(
            fromMe: false,
            child: Text('네, 세 개의 변경 묶음을 요약했습니다. 리스크는 두 건입니다.'),
          ),
          const HoronChatBubble(child: Text('고마워요')),
        ],
      ),
    );
  }
}
