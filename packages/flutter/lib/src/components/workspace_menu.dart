import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import 'menu.dart';

/// 워크스페이스 메뉴의 한 줄입니다. React `WorkspaceMenuItem`입니다.
class HoronWorkspaceMenuItem {
  /// 한 줄을 만듭니다.
  const HoronWorkspaceMenuItem({required this.id, required this.name, this.meta, this.initial});

  /// 워크스페이스를 구별하는 값입니다(React `id`).
  final String id;

  /// 워크스페이스 이름입니다(React `name`).
  final String name;

  /// 이름 아래 설명입니다(React `meta`). 보통 "12 members"처럼 인원을 적습니다.
  final String? meta;

  /// 타일에 그릴 이니셜입니다(React `initial`). 없으면 이름의 첫 글자를 씁니다.
  final String? initial;

  /// 타일에 실제로 그릴 글자입니다.
  String get tileInitial {
    final String? explicit = initial;
    if (explicit != null && explicit.isNotEmpty) return explicit;
    if (name.isEmpty) return '';
    return name.substring(0, 1).toUpperCase();
  }
}

/// Paper `Workspace menu`입니다.
///
/// 단색 256px 메뉴에 워크스페이스를 나열하고 현재 것에 체크를 붙입니다. 아래에는
/// 새 워크스페이스 만들기와 설정이 구분선 너머로 붙습니다. React의 `triggerClassName`과
/// `triggerChildren`은 Flutter에서 [trigger] 위젯 하나로 합쳐집니다.
class HoronWorkspaceMenu extends StatelessWidget {
  /// 워크스페이스 메뉴를 만듭니다.
  const HoronWorkspaceMenu({
    super.key,
    required this.workspaces,
    required this.value,
    required this.trigger,
    this.onValueChange,
    this.onCreate,
    this.onSettings,
    this.label = 'Workspaces',
  });

  /// 나열할 워크스페이스입니다(React `workspaces`).
  final List<HoronWorkspaceMenuItem> workspaces;

  /// 지금 선택된 워크스페이스의 id입니다(React `value`).
  final String value;

  /// 메뉴를 여는 요소입니다(React `trigger` + `triggerChildren`).
  final Widget trigger;

  /// 다른 워크스페이스를 고를 때 부를 콜백입니다(React `onValueChange`).
  final ValueChanged<String>? onValueChange;

  /// 새 워크스페이스를 만들 때 부를 콜백입니다(React `onCreate`).
  final VoidCallback? onCreate;

  /// 워크스페이스 설정을 열 때 부를 콜백입니다(React `onSettings`).
  final VoidCallback? onSettings;

  /// 묶음 제목입니다(React `label`, 기본 "Workspaces").
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return HoronMenu(
      trigger: trigger,
      content: HoronMenuContent(
        surface: HoronMenuSurface.solid,
        side: AxisDirection.down,
        align: Alignment.centerLeft,
        // `sideOffset={7}`.
        sideOffset: 7,
        children: <Widget>[
          HoronMenuLabel(label: label),
          for (final HoronWorkspaceMenuItem workspace in workspaces)
            HoronMenuItem(
              label: workspace.name,
              description: workspace.meta,
              icon: HoronMenuTile(label: workspace.tileInitial),
              // 현재 행은 `className="bg-overlay-ink-6"`으로 강조색 바탕을 칠합니다.
              background: workspace.id == value ? theme.colors.overlayInk6 : null,
              trailing: workspace.id == value ? const _SelectedCheck() : null,
              onTap: () => onValueChange?.call(workspace.id),
            ),
          const HoronMenuSeparator(),
          HoronMenuItem(label: 'New workspace', icon: const Icon(Icons.add_circle_outline), onTap: onCreate),
          HoronMenuItem(label: 'Workspace settings', icon: const Icon(Icons.settings), onTap: onSettings),
        ],
      ),
    );
  }
}

/// 현재 워크스페이스 체크입니다. React `Check weight="bold" className="animate-pop-in"`.
class _SelectedCheck extends StatelessWidget {
  const _SelectedCheck();

  @override
  Widget build(BuildContext context) {
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: const Icon(Icons.check),
    );
  }
}
