import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `tool_calls_header`의 갤러리 섹션입니다.
///
/// 도구 칩 세 개와 접히는 카드 두 장을 보여 줍니다.
class HoronToolCallsHeaderGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronToolCallsHeaderGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 460,
        child: HoronToolCallsHeader(
          toolIcons: const <Widget>[
            Icon(Icons.search),
            Icon(Icons.code),
            Icon(Icons.link),
          ],
          elapsed: '4.0s',
          children: <Widget>[
            HoronCodePanel(code: "grep -r 'TODO' packages/flutter/lib"),
            HoronCard(title: '요약', description: '남은 작업 12건을 찾았습니다.'),
          ],
        ),
      ),
    );
  }
}
