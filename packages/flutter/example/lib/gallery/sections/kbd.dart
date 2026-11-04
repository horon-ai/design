import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `kbd`의 갤러리 섹션입니다.
///
/// 높이 16·20·24 세 크기를 한 줄로 보여 주고, 단축키 칩 세 가지(글자만,
/// 아이콘 + 글자, 여러 키 조합)와 배경·글자색을 덮어쓴 예를 나란히 보여 줍니다.
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
                '높이 16 / 20 / 24',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              SizedBox(height: theme.space.s1),
              const Row(
                mainAxisSize: MainAxisSize.min,
                spacing: 4,
                children: <Widget>[
                  HoronKbd(label: 'Esc', size: HoronKbdSize.sm),
                  HoronKbd(label: 'Esc', size: HoronKbdSize.md),
                  HoronKbd(label: 'Esc', size: HoronKbdSize.lg),
                ],
              ),
            ],
          ),
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
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                '배경·글자 덮어쓰기',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              SizedBox(height: theme.space.s1),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: theme.colors.interactivePrimary,
                  borderRadius: BorderRadius.circular(theme.radius.full),
                ),
                child: Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: theme.space.s3,
                    vertical: theme.space.s1_5,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    spacing: theme.space.s1_5,
                    children: <Widget>[
                      Text(
                        'Run',
                        style: theme.text.labelMd.copyWith(
                          color: theme.colors.interactiveOnPrimary,
                        ),
                      ),
                      HoronKbd(
                        label: '⌘↵',
                        background: theme.colors.bgSurface6,
                        foreground: theme.colors.textInverse,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
