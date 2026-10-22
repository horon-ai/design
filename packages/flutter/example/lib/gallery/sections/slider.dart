import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `slider` 갤러리 섹션입니다.
///
/// 수평·수직, 값 표시, 눈금, 범위와 비활성을 모두 그립니다. 트랙·채움·썸이 한
/// 페인터에서 그려지므로 이 화면에서 채움의 끝과 썸의 중심이 맞는지 확인할 수
/// 있습니다.
class HoronSliderGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronSliderGallerySection({super.key});

  @override
  State<HoronSliderGallerySection> createState() =>
      _HoronSliderGallerySectionState();
}

class _HoronSliderGallerySectionState extends State<HoronSliderGallerySection> {
  double _plain = 40;
  double _withValue = 65;
  double _stepped = 50;
  double _vertical = 30;

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Slider',
      variants: <Widget>[
        SizedBox(
          width: 260,
          child: HoronSlider(
            value: _plain,
            onChanged: (double value) => setState(() => _plain = value),
          ),
        ),
        SizedBox(
          width: 260,
          child: HoronSlider(
            value: _withValue,
            showValue: true,
            onChanged: (double value) => setState(() => _withValue = value),
          ),
        ),
        SizedBox(
          width: 260,
          child: HoronSlider(
            value: _stepped,
            divisions: 4,
            showValue: true,
            onChanged: (double value) => setState(() => _stepped = value),
          ),
        ),
        SizedBox(
          height: 160,
          child: HoronSlider(
            value: _vertical,
            orientation: Axis.vertical,
            onChanged: (double value) => setState(() => _vertical = value),
          ),
        ),
      ],
      states: <Widget>[
        SizedBox(width: 260, child: HoronSlider(value: 0, onChanged: (_) {})),
        SizedBox(
          width: 260,
          child: HoronSlider(value: 100, showValue: true, onChanged: (_) {}),
        ),
        const SizedBox(
          width: 260,
          child: HoronSlider(value: 50, enabled: false, showValue: true),
        ),
        const SizedBox(width: 260, child: HoronSlider(value: 50)),
      ],
      notes:
          'React `slider.tsx`의 `h-1.5` 트랙, `bg-primary` 범위, `size-4 border-2` 썸을 '
          '한 페인터에서 그립니다. 값은 min/max로 잘리고, `divisions`가 있으면 가장 가까운 '
          '눈금으로 반올림됩니다. 세로는 아래가 min입니다.',
    );
  }
}
