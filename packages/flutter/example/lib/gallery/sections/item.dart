import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/item.dart';

import '../section_scaffold.dart';

/// `item` 갤러리 섹션입니다.
///
/// 변형 칸에는 `variant` 세 가지와 `size` 두 가지를, 상태 칸에는 미디어 세 변형과
/// 액션·설명 조합, 그리고 그룹·구분선을 놓습니다.
class HoronItemGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronItemGallerySection({super.key});

  /// 한 항목을 만듭니다.
  Widget _item(
    BuildContext context, {
    HoronItemVariant variant = HoronItemVariant.defaultValue,
    HoronItemSize size = HoronItemSize.defaultValue,
    HoronItemMediaVariant media = HoronItemMediaVariant.icon,
    bool withDescription = true,
    bool withActions = true,
  }) {
    return HoronItem(
      variant: variant,
      size: size,
      children: <Widget>[
        HoronItemMedia(variant: media, child: _media(context, media)),
        HoronItemContent(
          children: <Widget>[
            HoronItemTitle(text: '알림'),
            if (withDescription) HoronItemDescription(text: '새 메시지가 도착했습니다.'),
          ],
        ),
        if (withActions) HoronItemActions(children: <Widget>[const Text('열기')]),
      ],
    );
  }

  /// 미디어 변형에 맞는 내용입니다.
  ///
  /// `image`는 40 정사각을 꽉 채우는 그림을 받는 자리라, 갤러리에서는 같은 자리를
  /// 단색 사각형으로 보여 줍니다.
  Widget _media(BuildContext context, HoronItemMediaVariant media) {
    if (media != HoronItemMediaVariant.image) return const Icon(Icons.mail);
    return ColoredBox(
      color: HoronTheme.of(context).brandGoldSoft,
      child: const Center(child: Icon(Icons.image)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Item',
      variants: <Widget>[
        for (final HoronItemVariant variant in HoronItemVariant.values)
          for (final HoronItemSize size in HoronItemSize.values)
            _ItemCell(
              label: '${variant.name} / ${size.name}',
              child: _item(context, variant: variant, size: size),
            ),
      ],
      states: <Widget>[
        for (final HoronItemMediaVariant media in HoronItemMediaVariant.values)
          _ItemCell(
            label: 'media: ${media.name}',
            child: _item(context, media: media),
          ),
        _ItemCell(
          label: 'Title only',
          child: _item(context, withDescription: false, withActions: false),
        ),
        _ItemCell(
          label: 'Group with separator',
          child: HoronItemGroup(
            children: <Widget>[
              _item(context, withActions: false),
              const HoronItemSeparator(),
              _item(context, withActions: false),
            ],
          ),
        ),
      ],
      notes:
          'React `item.tsx`의 변형 3개(`default`·`outline`·`muted`)와 크기 2개'
          '(`default`·`sm`), 미디어 변형 3개(`default`·`icon`·`image`)를 그대로 옮겼습니다. '
          '설명이 있으면 미디어가 2만큼 내려가고(`translate-y-0.5`), 설명은 두 줄에서 '
          '말줄임됩니다(`line-clamp-2`).',
    );
  }
}

/// 항목 하나를 이름과 함께 보여 주는 칸입니다.
class _ItemCell extends StatelessWidget {
  const _ItemCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 320,
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
