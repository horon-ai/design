import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `settings_list`의 갤러리 섹션입니다.
///
/// 스위치·키캡·아이콘 타일이 붙은 설정 목록을 solid와 glass 두 표면에 같은
/// 목록으로 보여 줍니다. 키캡은 `bg-subtle` 바탕에 글자를 트림해 26px 상자에 맞춥니다.
class HoronSettingsListGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronSettingsListGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s6,
        children: <Widget>[
          SurfaceGroup(label: 'Solid', child: _list(HoronSurface.solid)),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _list(HoronSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 설정 목록입니다. 표면만 바뀌고 행은 같습니다.
  Widget _list(HoronSurface surface) {
    return SizedBox(
      width: 460,
      child: HoronSettingsList(
        surface: surface,
        children: <Widget>[
          HoronSettingsRow(
            title: '알림',
            description: '봇이 작업을 마치면 알려 줍니다',
            leading: const HoronSettingsRowIcon(
              icon: Icon(Icons.notifications_outlined),
            ),
            control: HoronSettingsSwitch(value: true, onChanged: (_) {}),
          ),
          HoronSettingsRow(
            title: '자동 실행',
            description: '승인 없이 도구를 실행합니다',
            leading: const HoronSettingsRowIcon(
              icon: Icon(Icons.bolt_outlined),
            ),
            control: HoronSettingsSwitch(value: false, onChanged: (_) {}),
          ),
          const HoronSettingsRow(
            title: '명령 팔레트',
            description: '어디서나 열 수 있습니다',
            control: HoronSettingsKeys(keys: <String>['⌘', 'K']),
          ),
          const HoronSettingsRow(title: '언어', description: '한국어', last: true),
        ],
      ),
    );
  }
}
