import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 표식을 보여 줄 세 크기입니다. Paper는 16(작은 컨트롤·캡션), 20(버튼·행),
/// 24(바·빈 상태)에서 아이콘을 그립니다.
const double _markSmall = 16;
const double _markMedium = 20;
const double _markLarge = 24;

/// 이름표 글리프에 쓰는 크기입니다. React `HoronGlyph`의 기본값 20입니다.
const double _glyphSize = 20;

/// Horon Icon 갤러리 섹션입니다.
///
/// 위쪽은 팔콘 눈 표식을 Paper의 세 크기로 나란히 두고, 아래쪽은 `iconNames` 79개를
/// 이름표와 함께 격자로 폅니다. 격자는 [Wrap]이라 폰 폭에서도 가로로 넘치지 않고
/// 줄을 바꿉니다.
class HoronIconGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronIconGallerySection({super.key});

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
            'Horon 표식',
            style: theme.text.titleSm.copyWith(color: colors.textPrimary),
          ),
          SizedBox(height: theme.space.s1),
          Text(
            'Paper의 icon/horon — 22×22 viewBox의 팔콘 눈입니다.',
            style: theme.text.caption.copyWith(color: colors.textSecondary),
          ),
          SizedBox(height: theme.space.s3),
          Wrap(
            spacing: theme.space.s5,
            runSpacing: theme.space.s3,
            crossAxisAlignment: WrapCrossAlignment.end,
            children: <Widget>[
              _MarkSample(
                caption: '16',
                size: _markSmall,
                color: colors.textPrimary,
              ),
              _MarkSample(
                caption: '20',
                size: _markMedium,
                color: colors.textPrimary,
              ),
              _MarkSample(
                caption: '24',
                size: _markLarge,
                color: colors.textPrimary,
              ),
              _MarkSample(
                caption: '24 · brand',
                size: _markLarge,
                color: colors.textBrand,
              ),
            ],
          ),
          SizedBox(height: theme.space.s6),
          Text(
            'Paper 아이콘 79개',
            style: theme.text.titleSm.copyWith(color: colors.textPrimary),
          ),
          SizedBox(height: theme.space.s1),
          Text(
            'iconNames 순서 그대로입니다.',
            style: theme.text.caption.copyWith(color: colors.textSecondary),
          ),
          SizedBox(height: theme.space.s3),
          Wrap(
            spacing: theme.space.s2,
            runSpacing: theme.space.s3,
            children: <Widget>[
              for (final HoronIconName name in HoronIconName.values)
                SizedBox(
                  width: theme.space.step(18),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      HoronGlyph(
                        name: name,
                        size: _glyphSize,
                        color: colors.textPrimary,
                      ),
                      SizedBox(height: theme.space.s1),
                      Text(
                        name.name,
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.caption.copyWith(
                          color: colors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

/// 표식 하나와 그 크기 이름표입니다.
class _MarkSample extends StatelessWidget {
  const _MarkSample({
    required this.caption,
    required this.size,
    required this.color,
  });

  final String caption;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        SizedBox(
          height: _markLarge * 1.5,
          child: Center(
            child: HoronIcon(size: size, color: color),
          ),
        ),
        SizedBox(height: theme.space.s1),
        Text(
          caption,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
      ],
    );
  }
}
