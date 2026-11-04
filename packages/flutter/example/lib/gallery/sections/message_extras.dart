import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `message_extras`의 갤러리 섹션입니다.
///
/// 메시지 동작 알약을 solid와 glass 두 표면에 같은 목록으로 보여 주고, 날짜
/// 구분선·첨부 카드·잉크 코드 블록을 함께 놓습니다.
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
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: theme.space.s6,
          children: <Widget>[
            SurfaceGroup(label: 'Solid', child: _actions(HoronSurface.solid)),
            SurfaceGroup(
              label: 'Glass',
              glass: true,
              child: _actions(HoronSurface.glass),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: theme.space.s4,
              children: <Widget>[
                const HoronDateSeparator(label: '오늘'),
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
          ],
        ),
      ),
    );
  }

  /// 한 표면의 동작 알약 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _actions(HoronSurface surface) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        HoronMessageActions(
          surface: surface,
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
          ],
        ),
        SizedBox(height: HoronSpace.s3),
        HoronMessageActions(
          surface: surface,
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
      ],
    );
  }
}
