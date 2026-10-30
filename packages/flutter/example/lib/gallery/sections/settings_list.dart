import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `settings_list`의 갤러리 섹션입니다.
///
/// 스위치·키캡·아이콘 타일이 붙은 설정 목록 하나를 보여 줍니다.
class HoronSettingsListGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronSettingsListGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: SizedBox(
        width: 460,
        child: HoronSettingsList(
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
      ),
    );
  }
}
