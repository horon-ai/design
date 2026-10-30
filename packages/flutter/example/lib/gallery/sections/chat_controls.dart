import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `chat_controls`의 갤러리 섹션입니다.
///
/// 최신으로 가기, 새 메시지 알약, 음성 입력을 세로로 보여 줍니다.
class HoronChatControlsGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronChatControlsGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s4,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              HoronJumpToLatest(onPressed: () {}),
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
              HoronNewMessagesPill(label: '새 메시지 3개', onPressed: () {}),
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
              HoronVoiceInput(elapsed: '0:07', onStop: () {}),
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
      ),
    );
  }
}
