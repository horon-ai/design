import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `card`의 갤러리 섹션입니다.
///
/// 유리 카드의 기본·상호작용·선택 상태와 Paper 서리 카드를 나란히 보여 줍니다.
class HoronCardGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s4,
        runSpacing: theme.space.s4,
        children: <Widget>[
          SizedBox(
            width: 320,
            child: HoronCard(
              title: '기본 카드',
              description: '두꺼운 유리 위에 제목과 설명이 놓입니다.',
            ),
          ),
          SizedBox(
            width: 320,
            child: HoronCard(
              title: '상호작용 카드',
              description: '누르면 0.99로 줄고 오른쪽에 캐럿이 붙습니다.',
              interactive: true,
              onTap: () {},
            ),
          ),
          SizedBox(
            width: 320,
            child: HoronCard(
              title: '선택된 카드',
              description: '브랜드 테두리가 붙습니다.',
              selected: true,
            ),
          ),
          SizedBox(
            width: 320,
            child: HoronCard(
              title: '서리 카드',
              description: 'Paper 홈 보드 카드입니다.',
              frost: true,
              child: HoronUsageMeter(label: '작업', value: 42),
            ),
          ),
        ],
      ),
    );
  }
}
