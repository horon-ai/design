import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `card` 갤러리 섹션입니다.
///
/// React `card.tsx`에는 cva 변형이 없고 `size`만 있습니다. 그래서 변형 칸에는 크기
/// 두 가지를, 상태 칸에는 파트 조합(액션·푸터·이미지·설명)을 놓습니다.
class HoronCardGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Card',
      variants: <Widget>[
        for (final HoronCardSize size in HoronCardSize.values)
          _CardCell(
            label: size.name,
            child: HoronCard(
              size: size,
              children: <Widget>[
                HoronCardHeader(
                  children: <Widget>[
                    HoronCardTitle(text: '결제 수단'),
                    HoronCardDescription(text: '등록된 카드 두 장'),
                  ],
                ),
                HoronCardContent(child: Text('본문 내용이 여기에 들어갑니다.')),
              ],
            ),
          ),
      ],
      states: <Widget>[
        _CardCell(
          label: 'With action',
          child: HoronCard(
            children: <Widget>[
              HoronCardHeader(
                children: <Widget>[
                  HoronCardTitle(text: '팀 멤버'),
                  HoronCardDescription(text: '이번 달 초대 3건'),
                  HoronCardAction(child: Icon(Icons.more_horiz)),
                ],
              ),
              HoronCardContent(child: Text('초대는 7일 뒤 만료됩니다.')),
            ],
          ),
        ),
        _CardCell(
          label: 'With footer',
          child: HoronCard(
            children: <Widget>[
              HoronCardHeader(
                children: <Widget>[
                  HoronCardTitle(text: '요금제'),
                  HoronCardDescription(text: '다음 결제일 11월 3일'),
                ],
              ),
              HoronCardContent(child: Text('월 29,000원')),
              HoronCardFooter(children: <Widget>[Text('변경'), Text('해지')]),
            ],
          ),
        ),
        _CardCell(
          label: 'Title only',
          child: HoronCard(
            children: <Widget>[
              HoronCardHeader(
                children: <Widget>[HoronCardTitle(text: '제목만 있는 카드')],
              ),
            ],
          ),
        ),
        _CardCell(
          label: 'Long description',
          child: HoronCard(
            children: <Widget>[
              HoronCardHeader(
                children: <Widget>[
                  HoronCardTitle(text: '설명이 긴 카드'),
                  HoronCardDescription(
                    text: '설명이 두 줄을 넘어가면 카드가 세로로 늘어나고, 카드 안의 여백은 그대로 유지됩니다.',
                  ),
                ],
              ),
              HoronCardContent(child: Text('본문')),
            ],
          ),
        ),
      ],
      notes:
          'React `card.tsx`의 여백은 `--card-spacing`(18, sm이면 12)이고 자식 사이 간격은 '
          '`gap-2.5`(10)입니다. 푸터가 있으면 아래 여백이 0이 되어 푸터가 카드 바닥에 붙습니다. '
          '반경은 card 역할(12)입니다.',
    );
  }
}

/// 한 카드를 이름과 함께 보여 주는 칸입니다.
class _CardCell extends StatelessWidget {
  const _CardCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          child,
        ],
      ),
    );
  }
}
