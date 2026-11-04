import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `usage_meter`의 갤러리 섹션입니다.
///
/// 세 사용량(25%, 48%, 64%, 100%)과 캡션 유무를 solid와 glass 두 표면에 같은
/// 목록으로 보여 줍니다.
class HoronUsageMeterGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronUsageMeterGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s6,
        children: <Widget>[
          SurfaceGroup(
            label: 'Solid',
            child: _meters(theme, HoronSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _meters(theme, HoronSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 사용량 표본 목록입니다. 표면만 바뀌고 값은 같습니다.
  Widget _meters(HoronThemeData theme, HoronSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      children: <Widget>[
        HoronUsageMeter(label: '작업', value: 25, surface: surface),
        HoronUsageMeter(label: '저장 공간', value: 48, surface: surface),
        HoronUsageMeter(
          label: '작업',
          value: 64,
          surface: surface,
          detail: '10,000개 중 6,420개',
          note: '11월 1일 초기화',
        ),
        HoronUsageMeter(
          label: '토큰',
          value: 100,
          surface: surface,
          detail: '한도를 모두 썼습니다',
          note: '한도 상향',
        ),
      ],
    );
  }
}
