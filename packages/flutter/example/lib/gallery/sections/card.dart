import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `card`의 갤러리 섹션입니다.
///
/// 기본·상호작용·선택 상태를 solid와 glass 두 표면에 같은 목록으로 보여 주고,
/// Paper 서리 카드를 따로 놓습니다.
class HoronCardGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronCardGallerySection({super.key});

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
            child: _cards(theme, HoronCardSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _cards(theme, HoronCardSurface.glass),
          ),
          SurfaceGroup(
            label: 'Frost',
            child: SizedBox(
              width: 320,
              child: HoronCard(
                title: '서리 카드',
                description: 'Paper 홈 보드 카드입니다.',
                surface: HoronCardSurface.frost,
                child: const HoronUsageMeter(label: '작업', value: 42),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 카드 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _cards(HoronThemeData theme, HoronCardSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        SizedBox(
          width: 320,
          child: HoronCard(
            title: '기본 카드',
            description: '제목과 설명이 표면 위에 놓입니다.',
            surface: surface,
          ),
        ),
        SizedBox(
          width: 320,
          child: HoronCard(
            title: '상호작용 카드',
            description: '누르면 0.99로 줄고 오른쪽에 캐럿이 붙습니다.',
            surface: surface,
            interactive: true,
            onTap: () {},
          ),
        ),
        SizedBox(
          width: 320,
          child: HoronCard(
            title: '선택된 카드',
            description: '브랜드 테두리가 붙습니다.',
            surface: surface,
            selected: true,
          ),
        ),
      ],
    );
  }
}
