import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `kbd`의 갤러리 섹션입니다.
///
/// 단축키 칩 세 가지(글자만, 아이콘 + 글자, 여러 키 조합)를 나란히 보여 줍니다.
class HoronKbdGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronKbdGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s3,
        runSpacing: theme.space.s2,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                '글자만',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              SizedBox(height: theme.space.s1),
              const HoronKbd(label: 'K'),
            ],
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                '아이콘 + 글자',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              SizedBox(height: theme.space.s1),
              const HoronKbd(
                label: 'K',
                icon: Icon(Icons.keyboard_command_key),
              ),
            ],
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                '키 조합',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              SizedBox(height: theme.space.s1),
              const Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  HoronKbd(label: '⌘'),
                  SizedBox(width: 4),
                  HoronKbd(label: 'Esc'),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
