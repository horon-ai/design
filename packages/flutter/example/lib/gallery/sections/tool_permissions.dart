import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/tool_permissions.dart';

/// `tool_permissions` 갤러리 섹션입니다.
///
/// 기본값(ask), 모두 허용, 일부 끔 세 상태를 나란히 보여 줍니다.
class HoronToolPermissionsGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronToolPermissionsGallerySection({super.key});

  static const List<HoronToolPermissionItem> _tools = <HoronToolPermissionItem>[
    HoronToolPermissionItem(
      name: 'files.read',
      description: Text('Read files in the workspace'),
    ),
    HoronToolPermissionItem(
      name: 'shell.run',
      description: Text('Run shell commands'),
    ),
    HoronToolPermissionItem(
      name: 'browser.open',
      defaultValue: HoronToolPermissionsToolPermission.off,
    ),
  ];

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
            label: '기본 (ask)',
            child: ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: HoronToolPermissionsGallerySection._maxWidth,
              ),
              child: const HoronToolPermissions(
                title: Text('Tool permissions'),
                tools: HoronToolPermissionsGallerySection._tools,
              ),
            ),
          ),
          _Sample(
            label: '모두 허용',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: HoronToolPermissions(
                title: const Text('Tool permissions'),
                tools: _tools,
                values: const <String, HoronToolPermissionsToolPermission>{
                  'files.read': HoronToolPermissionsToolPermission.allow,
                  'shell.run': HoronToolPermissionsToolPermission.allow,
                  'browser.open': HoronToolPermissionsToolPermission.allow,
                },
              ),
            ),
          ),
          _Sample(
            label: '일부 끔',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: HoronToolPermissions(
                title: const Text('Tool permissions'),
                tools: _tools,
                allowAllLabel: const Text('Allow all tools'),
                values: const <String, HoronToolPermissionsToolPermission>{
                  'files.read': HoronToolPermissionsToolPermission.allow,
                  'shell.run': HoronToolPermissionsToolPermission.off,
                  'browser.open': HoronToolPermissionsToolPermission.off,
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// `max-w-130.25` — 컴포넌트가 스스로 정하는 폭 521입니다.
  static const double _maxWidth = 521;
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
