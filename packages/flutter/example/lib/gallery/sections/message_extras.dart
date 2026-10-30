import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `message_extras`의 갤러리 섹션입니다.
///
/// 날짜 구분선, 메시지 동작 알약, 첨부 카드, 잉크 코드 블록을 세로로 보여 줍니다.
class HoronMessageExtrasGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronMessageExtrasGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 520,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: theme.space.s4,
          children: <Widget>[
            const HoronDateSeparator(label: '오늘'),
            HoronMessageActions(
              actions: <HoronMessageAction>[
                HoronMessageAction(
                  label: '복사',
                  icon: const Icon(Icons.copy),
                  onPressed: () {},
                ),
                HoronMessageAction(
                  label: '다시 생성',
                  icon: const Icon(Icons.refresh),
                  onPressed: () {},
                ),
                HoronMessageAction(
                  label: '좋아요',
                  icon: const Icon(Icons.thumb_up_outlined),
                  onPressed: () {},
                ),
              ],
            ),
            const HoronAttachment(
              name: 'Q3-board-deck.pdf',
              detail: 'PDF · 2.4 MB',
            ),
            HoronAttachment(
              name: 'screenshot.png',
              detail: 'PNG · 480 KB',
              onRemove: () {},
            ),
            const HoronCodeBlock(
              code: 'const total = items.length;',
              language: 'ts',
            ),
          ],
        ),
      ),
    );
  }
}
