import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `usage_meter`의 갤러리 섹션입니다.
///
/// 세 사용량(25%, 64%, 100%)을 나란히 보여 주고 캡션 유무를 함께 봅니다.
class HoronUsageMeterGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronUsageMeterGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s4,
        runSpacing: theme.space.s4,
        children: <Widget>[
          const HoronUsageMeter(label: '작업', value: 25),
          const HoronUsageMeter(
            label: '작업',
            value: 64,
            detail: '10,000개 중 6,420개',
            note: '11월 1일 초기화',
          ),
          const HoronUsageMeter(
            label: '토큰',
            value: 100,
            detail: '한도를 모두 썼습니다',
            note: '한도 상향',
          ),
        ],
      ),
    );
  }
}
