import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `hover_card` 갤러리 섹션입니다.
///
/// 터치에서는 길게 눌러 미리보기가 뜨고, 포인터가 있으면 호버로 뜹니다. 표면
/// 자체는 [HoronHoverCardContent]를 정적으로 놓아 폭과 여백을 보여 줍니다.
class HoronHoverCardGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronHoverCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Hover Card',
      variants: <Widget>[
        HoronHoverCard(
          trigger: const _Link(label: '@horon'),
          child: const _Profile(),
        ),
        HoronHoverCard(
          side: HoronOverlaySide.top,
          trigger: const _Link(label: '위로 뜨기'),
          child: const _Profile(),
        ),
        HoronHoverCard(
          side: HoronOverlaySide.right,
          align: HoronOverlayAlign.start,
          openDelay: Duration.zero,
          trigger: const _Link(label: '즉시'),
          child: const _Profile(),
        ),
      ],
      states: <Widget>[
        const SizedBox(
          width: 256,
          child: HoronHoverCardContent(child: _Profile()),
        ),
        HoronHoverCard(
          trigger: const _Link(label: '긴 내용'),
          child: const Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Horon'),
              SizedBox(height: HoronSpace.s1),
              Text('디자인 시스템을 옮기고 있습니다. 이 문단은 미리보기 안에서 여러 줄로 접힙니다.'),
            ],
          ),
        ),
      ],
      notes:
          'React `hover-card.tsx`를 옮긴 것입니다. 터치에서는 길게 눌러 미리보기가 뜨고 '
          '놓으면 닫힙니다. 포인터가 있으면 호버로 뜨고, 카드로 옮겨 가는 동안 닫히지 않습니다.',
    );
  }
}

/// 미리보기를 여는 링크 모양입니다.
class _Link extends StatelessWidget {
  const _Link({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
        color: HoronTheme.of(context).brandGoldText,
        decoration: TextDecoration.underline,
        decorationColor: HoronTheme.of(context).brandGoldText,
      ),
    );
  }
}

/// 미리보기 안의 프로필 내용입니다.
class _Profile extends StatelessWidget {
  const _Profile();

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          'Horon',
          style: text.titleSmall?.copyWith(color: scheme.onSurface),
        ),
        const SizedBox(height: HoronSpace.s0_5),
        Text(
          '@horon',
          style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
        ),
        const SizedBox(height: HoronSpace.s2),
        Text(
          '디자인 시스템과 제품 표면을 함께 관리합니다.',
          style: text.bodySmall?.copyWith(color: scheme.onSurface),
        ),
      ],
    );
  }
}
