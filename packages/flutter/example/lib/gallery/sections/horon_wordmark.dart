import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// UI 크기 워드마크의 세로 길이입니다. React `HoronWordmark`의 기본 `height = 11.5`입니다.
const double _markDefault = 11.5;

/// 사이드바보다 큰 자리에서 쓰는 길이입니다.
const double _markLarge = 24;

/// 빈 상태나 시작 화면에서 쓰는 길이입니다.
const double _markDisplay = 40;

/// Horon Wordmark 갤러리 섹션입니다.
///
/// 사이드바 크기(11.5)부터 표시용 크기(40)까지 세 단계를 나란히 두고, 마지막에 브랜드
/// 색 한 벌을 둡니다. React는 `height`만 받고 폭은 viewBox 비율(48.7038/11.5)을
/// 따라가므로, 캡션에 세로 길이를 적습니다. [Wrap]이라 폰 폭에서 줄을 바꿉니다.
class HoronWordmarkGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronWordmarkGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;

    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'Horon 워드마크',
            style: theme.text.titleSm.copyWith(color: colors.textPrimary),
          ),
          SizedBox(height: theme.space.s1),
          Text(
            'Figma 사이드바(88:808)의 UI 크기 표식입니다. 높이를 주면 폭이 비율을 따라갑니다.',
            style: theme.text.caption.copyWith(color: colors.textSecondary),
          ),
          SizedBox(height: theme.space.s4),
          Wrap(
            spacing: theme.space.s6,
            runSpacing: theme.space.s4,
            crossAxisAlignment: WrapCrossAlignment.end,
            children: <Widget>[
              for (final (String caption, double height, Color color) sample
                  in <(String, double, Color)>[
                    ('11.5', _markDefault, colors.textPrimary),
                    ('24', _markLarge, colors.textPrimary),
                    ('40', _markDisplay, colors.textPrimary),
                    ('24 · brand', _markLarge, colors.textBrand),
                  ])
                _MarkSample(
                  caption: sample.$1,
                  height: sample.$2,
                  color: sample.$3,
                ),
            ],
          ),
        ],
      ),
    );
  }
}

/// 워드마크 하나와 그 길이 이름표입니다.
class _MarkSample extends StatelessWidget {
  const _MarkSample({
    required this.caption,
    required this.height,
    required this.color,
  });

  final String caption;
  final double height;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        HoronWordmark(height: height, color: color),
        SizedBox(height: theme.space.s1_5),
        Text(
          caption,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
      ],
    );
  }
}
