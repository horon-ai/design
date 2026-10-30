import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Workspace Menu 갤러리 섹션입니다.
///
/// 트리거를 눌러 실제 메뉴를 열어 볼 수 있고, 열렸을 때의 모양을 바로 보도록 같은
/// 내용을 단색 메뉴 상자로도 나란히 둡니다. 다른 워크스페이스를 고르면 체크가
/// 옮겨 갑니다.
class HoronWorkspaceMenuGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronWorkspaceMenuGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: const _WorkspaceMenuSamples(),
    );
  }
}

/// 현재 값을 들고 있는 샘플 묶음입니다.
class _WorkspaceMenuSamples extends StatefulWidget {
  const _WorkspaceMenuSamples();

  @override
  State<_WorkspaceMenuSamples> createState() => _WorkspaceMenuSamplesState();
}

class _WorkspaceMenuSamplesState extends State<_WorkspaceMenuSamples> {
  static const List<HoronWorkspaceMenuItem> _workspaces =
      <HoronWorkspaceMenuItem>[
        HoronWorkspaceMenuItem(
          id: 'horon',
          name: 'Horon team',
          meta: '12 members',
          initial: 'H',
        ),
        HoronWorkspaceMenuItem(
          id: 'paper',
          name: 'Paper workspace',
          meta: '4 members',
        ),
        HoronWorkspaceMenuItem(
          id: 'personal',
          name: 'Personal',
          meta: 'Only you',
        ),
      ];

  String _value = 'horon';

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s6,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Sample(
          label: '열기',
          child: HoronWorkspaceMenu(
            workspaces: _workspaces,
            value: _value,
            trigger: _Trigger(
              workspace: _workspaces.firstWhere(
                (HoronWorkspaceMenuItem item) => item.id == _value,
              ),
            ),
            onValueChange: (String id) => setState(() => _value = id),
            onCreate: () {},
            onSettings: () {},
          ),
        ),
        _Sample(
          label: '목록',
          child: _StaticList(workspaces: _workspaces, value: _value),
        ),
      ],
    );
  }
}

/// 열린 메뉴의 모습을 그대로 옮긴 단색 상자입니다.
class _StaticList extends StatelessWidget {
  const _StaticList({required this.workspaces, required this.value});

  final List<HoronWorkspaceMenuItem> workspaces;
  final String value;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return HoronMenuContent(
      surface: HoronMenuSurface.solid,
      children: <Widget>[
        const HoronMenuLabel(label: 'Workspaces'),
        for (final HoronWorkspaceMenuItem workspace in workspaces)
          HoronMenuItem(
            label: workspace.name,
            description: workspace.meta,
            icon: HoronMenuTile(label: workspace.tileInitial),
            background: workspace.id == value ? theme.colors.overlayInk6 : null,
            trailing: workspace.id == value
                ? Icon(Icons.check, color: theme.colors.textPrimary)
                : null,
          ),
        const HoronMenuSeparator(),
        const HoronMenuItem(
          label: 'New workspace',
          icon: Icon(Icons.add_circle_outline),
        ),
        const HoronMenuItem(
          label: 'Workspace settings',
          icon: Icon(Icons.settings),
        ),
      ],
    );
  }
}

/// 사이드바의 워크스페이스 버튼처럼 생긴 트리거입니다.
class _Trigger extends StatelessWidget {
  const _Trigger({required this.workspace});

  final HoronWorkspaceMenuItem workspace;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      padding: EdgeInsets.all(theme.space.s2),
      decoration: BoxDecoration(
        color: theme.colors.bgSurface,
        borderRadius: BorderRadius.circular(theme.radius.md),
        border: Border.all(color: theme.colors.borderDefault),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: theme.space.s2,
        children: <Widget>[
          HoronMenuTile(label: workspace.tileInitial),
          Flexible(
            child: Text(
              workspace.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.text.labelMd.copyWith(
                color: theme.colors.textPrimary,
              ),
            ),
          ),
          Icon(
            Icons.unfold_more,
            size: theme.space.s4,
            color: theme.colors.textSecondary,
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
