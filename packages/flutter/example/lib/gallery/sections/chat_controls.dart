import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `chat_controls`의 갤러리 섹션입니다.
///
/// 최신으로 가기, 새 메시지 알약, 음성 입력을 solid와 glass 두 표면에 같은 목록으로
/// 보여 줍니다.
class HoronChatControlsGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronChatControlsGallerySection({super.key});

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
          SurfaceGroup(
            label: 'Solid',
            child: _controls(theme, HoronChatControlSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _controls(theme, HoronChatControlSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 대화 컨트롤 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _controls(HoronThemeData theme, HoronChatControlSurface surface) {
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            HoronJumpToLatest(surface: surface, onPressed: () {}),
            SizedBox(height: theme.space.s2),
            Text(
              '최신으로',
              style: theme.text.caption.copyWith(
                color: theme.colors.textSecondary,
              ),
            ),
          ],
        ),
        Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            HoronNewMessagesPill(
              label: '새 메시지 3개',
              surface: surface,
              onPressed: () {},
            ),
            SizedBox(height: theme.space.s2),
            Text(
              '새 메시지',
              style: theme.text.caption.copyWith(
                color: theme.colors.textSecondary,
              ),
            ),
          ],
        ),
        Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            HoronVoiceInput(elapsed: '0:07', surface: surface, onStop: () {}),
            SizedBox(height: theme.space.s2),
            Text(
              '음성 입력',
              style: theme.text.caption.copyWith(
                color: theme.colors.textSecondary,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
