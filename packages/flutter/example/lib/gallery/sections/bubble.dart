import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/bubble.dart';

import '../section_scaffold.dart';

/// `bubble` 갤러리 섹션입니다.
///
/// React `bubble.tsx`의 변형 일곱 개를 모두 그리고, 정렬 둘과 꼬리 모서리를 상태 칸에
/// 놓습니다. 말풍선은 폭 제한(80%)을 스스로 걸므로 칸 안에서 줄어드는 폭을 보려면
/// 고정 폭 상자에 넣어야 합니다.
class HoronBubbleGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronBubbleGallerySection({super.key});

  /// 말풍선 하나를 만듭니다.
  Widget _bubble(
    HoronBubbleVariant variant,
    String text, {
    bool alignEnd = false,
    bool tail = true,
  }) {
    return HoronBubble(
      variant: variant,
      alignEnd: alignEnd,
      tail: tail,
      children: <Widget>[HoronBubbleContent(child: Text(text))],
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Bubble',
      variants: <Widget>[
        for (final HoronBubbleVariant variant in HoronBubbleVariant.values)
          _BubbleCell(
            label: variant.name,
            child: _bubble(variant, '${variant.name} 말풍선입니다'),
          ),
      ],
      states: <Widget>[
        _BubbleCell(
          label: 'align start',
          child: _bubble(HoronBubbleVariant.defaultValue, '시작 쪽에 붙은 말풍선'),
        ),
        _BubbleCell(
          label: 'align end',
          child: _bubble(
            HoronBubbleVariant.defaultValue,
            '끝 쪽에 붙은 말풍선',
            alignEnd: true,
          ),
        ),
        _BubbleCell(
          label: 'no tail',
          child: _bubble(
            HoronBubbleVariant.secondary,
            '꼬리 없이 네 모서리가 같은 말풍선',
            tail: false,
          ),
        ),
        _BubbleCell(
          label: 'group',
          child: HoronBubbleGroup(
            children: <Widget>[
              _bubble(HoronBubbleVariant.muted, '그룹의 첫 말풍선'),
              _bubble(HoronBubbleVariant.muted, '두 번째 말풍선'),
              _bubble(
                HoronBubbleVariant.defaultValue,
                '내가 보낸 말풍선',
                alignEnd: true,
              ),
            ],
          ),
        ),
        _BubbleCell(
          label: 'tappable',
          child: HoronBubble(
            children: <Widget>[
              HoronBubbleContent(
                onTap: () {},
                child: const Text('누를 수 있는 말풍선'),
              ),
            ],
          ),
        ),
        _BubbleCell(
          label: 'long text',
          child: _bubble(
            HoronBubbleVariant.outline,
            '폭 제한 80%에서 줄바꿈되는 긴 문장입니다. 말풍선은 내용 폭만큼만 넓어지고, 넘치면 접힙니다.',
          ),
        ),
      ],
      notes:
          'React `bubble.tsx`의 일곱 변형과 두 정렬을 그대로 옮겼습니다. 반경은 '
          '`rounded-lg`(14)이고 ghost만 `rounded-none`·`p-0`입니다. 꼬리 모서리는 React에 '
          '없고 이 포트가 더한 값으로, 시작 쪽 아래 모서리를 `radius.sm`(8)로 깎습니다.',
    );
  }
}

/// 말풍선 하나를 이름과 함께 보여 주는 칸입니다.
class _BubbleCell extends StatelessWidget {
  const _BubbleCell({required this.label, required this.child});

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
          DecoratedBox(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              border: Border.all(color: Theme.of(context).colorScheme.outline),
            ),
            child: Padding(
              padding: const EdgeInsets.all(HoronSpace.s3),
              child: child,
            ),
          ),
        ],
      ),
    );
  }
}
