import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/button.dart';

import '../section_scaffold.dart';

/// `button` 갤러리 섹션입니다.
///
/// 여섯 변형 × 여덟 크기를 전부 그립니다. 한 줄이 변형 하나이고, 그 줄에 여덟 크기가
/// React의 선언 순서대로 놓입니다. 아이콘 크기는 글자가 없으므로 아이콘 하나로 그립니다.
class HoronButtonGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronButtonGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return const GallerySectionScaffold(
      title: 'Button',
      variants: <Widget>[_ButtonMatrix()],
      states: <Widget>[
        HoronButton(label: 'Disabled', disabled: true, onPressed: _noop),
        HoronButton(label: 'No callback'),
        HoronButton(label: 'Invalid', invalid: true, onPressed: _noop),
        HoronButton(
          label: 'Leading',
          leading: Icon(Icons.add),
          onPressed: _noop,
        ),
        HoronButton(
          label: 'Trailing',
          trailing: Icon(Icons.expand_more),
          onPressed: _noop,
        ),
        HoronButton(
          label: 'Both',
          leading: Icon(Icons.add),
          trailing: Icon(Icons.expand_more),
          onPressed: _noop,
        ),
        HoronButton(
          label: 'Link disabled',
          variant: HoronButtonVariant.link,
          disabled: true,
          onPressed: _noop,
        ),
      ],
      notes:
          'React `button.tsx`의 variant 6개와 size 8개를 그대로 옮겼습니다. '
          '높이는 h-[26px]·h-[32px]·h-[37px]·h-[44px]와 size-6·size-7·size-8·size-9입니다.',
    );
  }

  static void _noop() {}
}

/// 변형 하나가 한 줄인 6×8 행렬입니다.
///
/// 갤러리 셸은 미리보기 프레임의 폭을 `MediaQuery`에 넣어 두므로, 그 폭을 줄마다
/// 명시해 한 변형이 한 줄을 차지하게 합니다. `Wrap`은 자식에게 무한 폭을 주므로
/// 폭을 지정하지 않으면 두 변형이 한 줄에 섞입니다.
class _ButtonMatrix extends StatelessWidget {
  const _ButtonMatrix();

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    final double width = MediaQuery.sizeOf(context).width - HoronSpace.s12;
    return SizedBox(
      width: width,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          for (final HoronButtonVariant variant
              in HoronButtonVariant.values) ...<Widget>[
            Text(
              variant.name,
              style: text.labelSmall?.copyWith(color: scheme.onSurfaceVariant),
            ),
            const SizedBox(height: HoronSpace.s2),
            Wrap(
              spacing: HoronSpace.s2,
              runSpacing: HoronSpace.s2,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                for (final HoronButtonSize size in HoronButtonSize.values)
                  HoronButton(
                    label: _isIcon(size) ? null : _sizeLabel(size),
                    leading: _isIcon(size) ? const Icon(Icons.star) : null,
                    variant: variant,
                    size: size,
                    onPressed: HoronButtonGallerySection._noop,
                  ),
              ],
            ),
            const SizedBox(height: HoronSpace.s4),
          ],
        ],
      ),
    );
  }

  bool _isIcon(HoronButtonSize size) => size.name.startsWith('icon');

  String _sizeLabel(HoronButtonSize size) => switch (size) {
    HoronButtonSize.defaultValue => 'Default',
    HoronButtonSize.xs => 'xs',
    HoronButtonSize.sm => 'sm',
    HoronButtonSize.lg => 'lg',
    HoronButtonSize.icon => 'icon',
    HoronButtonSize.iconXs => 'iconXs',
    HoronButtonSize.iconSm => 'iconSm',
    HoronButtonSize.iconLg => 'iconLg',
  };
}
