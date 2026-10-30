import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Menu 갤러리 섹션입니다.
///
/// 세 표면(유리·단색·Paper)을 같은 항목으로 나란히 놓고, 마지막에 실제로 열리는
/// 트리거를 둡니다. 항목에는 설명, 선택, 위험, 비활성, 단축키가 모두 들어 있습니다.
class HoronMenuGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMenuGallerySection({super.key});

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
            label: 'glass',
            child: HoronMenuContent(children: _items(theme)),
          ),
          _Sample(
            label: 'solid',
            child: HoronMenuContent(
              surface: HoronMenuSurface.solid,
              children: _items(theme),
            ),
          ),
          _Sample(
            label: 'paper',
            child: HoronMenuContent(
              surface: HoronMenuSurface.paper,
              children: _items(theme),
            ),
          ),
          _Sample(
            label: '열기',
            child: HoronMenu(
              trigger: _Trigger(label: 'Open menu'),
              content: HoronMenuContent(children: _items(theme)),
            ),
          ),
        ],
      ),
    );
  }
}

/// 세 표면이 함께 보여 주는 항목입니다.
List<Widget> _items(HoronThemeData theme) {
  return <Widget>[
    const HoronMenuLabel(label: 'Workspace'),
    HoronMenuItem(
      label: 'Duplicate',
      icon: const Icon(Icons.copy_outlined),
      trailing: const Text('⌘D'),
      onTap: () {},
    ),
    HoronMenuItem(
      label: 'Share',
      icon: const Icon(Icons.ios_share),
      description: 'Anyone with the link',
      onTap: () {},
    ),
    HoronMenuItem(
      label: 'Pin to top',
      icon: const Icon(Icons.push_pin_outlined),
      selected: true,
      onTap: () {},
    ),
    const HoronMenuSeparator(),
    HoronMenuItem(
      label: 'Delete workspace',
      icon: const Icon(Icons.delete_outline),
      danger: true,
      onTap: () {},
    ),
    HoronMenuItem(
      label: 'Archive (locked)',
      icon: const Icon(Icons.lock_outline),
      enabled: false,
    ),
  ];
}

/// 메뉴를 여는 평범한 버튼 모양입니다.
class _Trigger extends StatelessWidget {
  const _Trigger({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: theme.space.s3,
        vertical: theme.space.s2,
      ),
      decoration: BoxDecoration(
        color: theme.colors.bgSurface,
        borderRadius: BorderRadius.circular(theme.radius.full),
        border: Border.all(color: theme.colors.borderDefault),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: theme.space.s1_5,
        children: <Widget>[
          Icon(
            Icons.unfold_more,
            size: theme.space.s4,
            color: theme.colors.textSecondary,
          ),
          Text(
            label,
            style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
          ),
        ],
      ),
    );
  }
}

/// 샘플 하나와 그 캡션입니다.
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
