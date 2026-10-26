import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `tooltip` 갤러리 섹션입니다.
///
/// 툴팁은 상호작용해야 뜨므로, 표면 자체는 [HoronTooltipContent]를 정적으로 놓아
/// 네 방향의 화살표를 한눈에 보여 줍니다. 트리거는 포인터를 올리거나 길게 눌러
/// 열 수 있습니다.
class HoronTooltipGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTooltipGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return HoronTooltipProvider(
      delay: const Duration(milliseconds: 200),
      child: GallerySectionScaffold(
        title: 'Tooltip',
        variants: <Widget>[
          HoronTooltip(
            trigger: const _Trigger(label: '기본'),
            child: const Text('저장합니다'),
          ),
          HoronTooltip(
            kbd: const HoronKbd(label: 'K'),
            trigger: const _Trigger(label: '단축키'),
            child: const Text('검색'),
          ),
          HoronTooltip(
            side: HoronOverlaySide.bottom,
            trigger: const _Trigger(label: '아래'),
            child: const Text('아래로 뜹니다'),
          ),
          HoronTooltip(
            side: HoronOverlaySide.right,
            trigger: const _Trigger(label: '오른쪽'),
            child: const Text('오른쪽으로 뜹니다'),
          ),
        ],
        states: <Widget>[
          for (final HoronOverlaySide side in HoronOverlaySide.values)
            HoronTooltipContent(
              side: side,
              kbd: side == HoronOverlaySide.top
                  ? const HoronKbd(label: 'K')
                  : null,
              child: Text('side: ${side.name}'),
            ),
        ],
        notes:
            'React `tooltip.tsx`를 옮긴 것입니다. 표면은 유리이고 화살표가 트리거를 가리킵니다. '
            '포인터가 올라오면 Provider의 지연 뒤에, 터치에서는 길게 누르는 동안 뜹니다.',
      ),
    );
  }
}

/// 툴팁을 여는 트리거 모양입니다.
class _Trigger extends StatelessWidget {
  const _Trigger({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(HoronRadiusRole.control),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: HoronSpace.s3,
          vertical: HoronSpace.s2,
        ),
        child: Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium
              ?.copyWith(color: scheme.onSurface),
        ),
      ),
    );
  }
}
