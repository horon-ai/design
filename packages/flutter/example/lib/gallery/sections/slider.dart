import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Slider 갤러리 섹션입니다.
///
/// Paper 설정 화면의 두 슬라이더(Voice·Speed)를 실제로 움직일 수 있게 두고,
/// 비활성 상태를 함께 놓았습니다.
class HoronSliderGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSliderGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: const _SliderSamples(),
    );
  }
}

/// 두 값을 들고 있는 슬라이더 묶음입니다.
class _SliderSamples extends StatefulWidget {
  const _SliderSamples();

  @override
  State<_SliderSamples> createState() => _SliderSamplesState();
}

class _SliderSamplesState extends State<_SliderSamples> {
  double _voice = 60;
  double _speed = 35;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Wrap(
      spacing: theme.space.s8,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        _Sample(
          label: 'voice',
          child: HoronSlider(
            value: _voice,
            semanticLabel: '음성 크기',
            onChanged: (double value) => setState(() => _voice = value),
          ),
        ),
        _Sample(
          label: 'speed',
          child: HoronSlider(
            value: _speed,
            semanticLabel: '속도',
            onChanged: (double value) => setState(() => _speed = value),
          ),
        ),
        _Sample(
          label: 'disabled',
          child: HoronSlider(
            value: 20,
            semanticLabel: '비활성',
            enabled: false,
            onChanged: (_) {},
          ),
        ),
      ],
    );
  }
}

/// 변형 하나와 그 이름입니다.
class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s1,
      children: <Widget>[
        Text(
          label,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
        child,
      ],
    );
  }
}
