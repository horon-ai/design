import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `choice_card` 갤러리 섹션입니다.
///
/// 꺼짐, 켜짐, 중립 배지, 설명만 있는 카드, 비활성 다섯 상태를 나란히 보여 줍니다.
class HoronChoiceCardGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronChoiceCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          _Sample(
            label: '꺼짐',
            child: HoronChoiceCard(
              title: const Text('Workspace connection'),
              description: const Text('Share this workspace with the bot'),
              badge: const Text('Recommended'),
              onTap: () {},
            ),
          ),
          _Sample(
            label: '켜짐',
            child: HoronChoiceCard(
              title: const Text('Workspace connection'),
              description: const Text('Share this workspace with the bot'),
              badge: const Text('Recommended'),
              checked: true,
              onTap: () {},
            ),
          ),
          _Sample(
            label: '중립 배지',
            child: HoronChoiceCard(
              title: const Text('Personal account'),
              description: const Text('Keep the bot out of team folders'),
              badge: const Text('Default'),
              neutralBadge: true,
              onTap: () {},
            ),
          ),
          _Sample(
            label: '설명만',
            child: HoronChoiceCard(
              title: const Text('Read-only access'),
              description: const Text(
                'The bot can look but not change anything',
              ),
              checked: true,
              onTap: () {},
            ),
          ),
          _Sample(
            label: '비활성',
            child: HoronChoiceCard(
              title: const Text('Team workspace'),
              description: const Text('Ask an admin to enable this'),
              badge: const Text('Locked'),
              neutralBadge: true,
              disabled: true,
              onTap: () {},
            ),
          ),
        ],
      ),
    );
  }
}

class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          label,
          style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
        ),
        SizedBox(height: theme.space.s2),
        child,
      ],
    );
  }
}
