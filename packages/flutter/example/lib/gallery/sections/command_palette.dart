import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Command Palette 갤러리 섹션입니다.
///
/// 열린 팔레트, 본문만 있는 상태, 결과가 없는 상태를 나란히 보여 줍니다. 열린
/// 팔레트는 자기 상자 안에서 오버레이로 그려지므로 실제로 Esc나 바깥 누르기로
/// 닫아 볼 수 있습니다.
class HoronCommandPaletteGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCommandPaletteGallerySection({super.key});

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
          const _Sample(label: '열림', child: _PaletteDemo()),
          _Sample(
            label: '본문',
            child: _BodyDemo(groups: _groups(theme)),
          ),
          _Sample(
            label: '결과 없음',
            child: _BodyDemo(
              groups: const <HoronCommandGroup>[
                HoronCommandGroup(
                  label: 'Results',
                  items: <HoronCommandItem>[],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// 열린 팔레트를 자기 상자 안에서 보여 주고, 닫으면 다시 열 수 있게 합니다.
class _PaletteDemo extends StatefulWidget {
  const _PaletteDemo();

  @override
  State<_PaletteDemo> createState() => _PaletteDemoState();
}

class _PaletteDemoState extends State<_PaletteDemo> {
  bool _open = true;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      width: 460,
      height: 520,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: theme.colors.bgSubtle,
          borderRadius: BorderRadius.circular(theme.radius.lg),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(theme.radius.lg),
          child: HoronCommandPalette(
            open: _open,
            onOpenChange: (bool open) => setState(() => _open = open),
            groups: _groups(theme),
            hints: <(Widget, String)>[
              (const _KeyCap('↑↓'), 'Move'),
              (const _KeyCap('↵'), 'Open'),
              (const _KeyCap('esc'), 'Close'),
            ],
            trigger: _OpenButton(onPressed: () => setState(() => _open = true)),
          ),
        ),
      ),
    );
  }
}

/// 팔레트 본문만 서리 상자에 담아 보여 줍니다.
class _BodyDemo extends StatelessWidget {
  const _BodyDemo({required this.groups});

  final List<HoronCommandGroup> groups;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);
    return SizedBox(
      width: 420,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: theme.colors.glassFillFrost,
          borderRadius: radius,
          boxShadow: theme.shadows.palette,
        ),
        child: Padding(
          padding: EdgeInsets.all(theme.space.s1_5),
          child: HoronCommandPaletteBody(groups: groups),
        ),
      ),
    );
  }
}

/// 다시 열기 버튼입니다.
class _OpenButton extends StatelessWidget {
  const _OpenButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Center(
      child: FilledButton(
        onPressed: onPressed,
        child: Text('Open palette', style: theme.text.labelMd),
      ),
    );
  }
}

/// 단축키 표시입니다.
class _KeyCap extends StatelessWidget {
  const _KeyCap(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: theme.space.s1_5,
        vertical: theme.space.s0_5,
      ),
      decoration: BoxDecoration(
        color: theme.colors.overlayInk6,
        borderRadius: BorderRadius.circular(theme.radius.xs),
      ),
      child: Text(
        label,
        style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
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

/// 팔레트가 보여 줄 결과입니다.
List<HoronCommandGroup> _groups(HoronThemeData theme) {
  final TextStyle caption = theme.text.caption.copyWith(
    color: theme.colors.textSecondary,
  );
  return <HoronCommandGroup>[
    HoronCommandGroup(
      label: 'Workspaces',
      items: <HoronCommandItem>[
        HoronCommandItem(
          value: 'horon',
          label: 'Horon team',
          keywords: 'design system',
          tile: const Text('H'),
          meta: Text('12 members', style: caption),
          hint: const _KeyCap('↵'),
        ),
        HoronCommandItem(
          value: 'paper',
          label: 'Paper workspace',
          keywords: 'figma',
          tile: const Text('P'),
          meta: Text('4 members', style: caption),
        ),
      ],
    ),
    HoronCommandGroup(
      label: 'Actions',
      items: <HoronCommandItem>[
        HoronCommandItem(
          value: 'settings',
          label: 'Workspace settings',
          keywords: 'preferences',
          tile: const Icon(Icons.settings),
          hint: const _KeyCap('⌘,'),
        ),
        HoronCommandItem(
          value: 'invite',
          label: 'Invite teammate',
          keywords: 'member',
          tile: const Icon(Icons.person_add_alt_1),
        ),
      ],
    ),
  ];
}
