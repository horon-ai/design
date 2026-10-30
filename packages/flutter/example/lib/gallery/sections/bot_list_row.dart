import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `bot_list_row`의 갤러리 섹션입니다.
///
/// 일반·선택·실행 중 세 상태를 세로로 보여 줍니다.
class HoronBotListRowGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronBotListRowGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 380,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            HoronBotListRow(
              name: '지원 봇',
              time: '8:41 AM',
              preview: '세 개의 문서를 요약했습니다',
              onTap: () {},
            ),
            HoronBotListRow(
              name: '리서치 봇',
              time: '어제',
              preview: '시장 조사를 마쳤습니다',
              selected: true,
              onTap: () {},
            ),
            HoronBotListRow(
              name: '오케스트레이터',
              time: '방금',
              preview: '네 개의 레인을 실행 중입니다',
              live: true,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }
}
