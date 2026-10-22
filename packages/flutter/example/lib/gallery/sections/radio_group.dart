import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `radio-group` 갤러리 섹션입니다.
///
/// 선택·미선택·오류·비활성을 그룹 네 개로 나눠 그립니다. 링과 가운데 점이 서로
/// 다른 페인터로 그려지므로 이 화면에서 링의 안쪽 여백을 눈으로 확인할 수
/// 있습니다.
class HoronRadioGroupGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronRadioGroupGallerySection({super.key});

  @override
  State<HoronRadioGroupGallerySection> createState() =>
      _HoronRadioGroupGallerySectionState();
}

class _HoronRadioGroupGallerySectionState
    extends State<HoronRadioGroupGallerySection> {
  String? _value = 'standard';

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'RadioGroup',
      variants: <Widget>[
        HoronRadioGroup<String>(
          value: _value,
          onChanged: (String next) => setState(() => _value = next),
          semanticsLabel: 'Shipping',
          children: const <Widget>[
            HoronRadioGroupItem(value: 'standard', label: 'Standard'),
            HoronRadioGroupItem(value: 'express', label: 'Express'),
            HoronRadioGroupItem(value: 'pickup', label: 'Pick up'),
          ],
        ),
        const HoronRadioGroup<String>(
          value: null,
          semanticsLabel: 'Unselected',
          children: <Widget>[
            HoronRadioGroupItem(value: 'a', label: 'Unselected A'),
            HoronRadioGroupItem(value: 'b', label: 'Unselected B'),
          ],
        ),
      ],
      states: <Widget>[
        const HoronRadioGroup<String>(
          value: 'a',
          invalid: true,
          children: <Widget>[
            HoronRadioGroupItem(value: 'a', label: 'Invalid selected'),
            HoronRadioGroupItem(value: 'b', label: 'Invalid unselected'),
          ],
        ),
        const HoronRadioGroup<String>(
          value: 'a',
          enabled: false,
          children: <Widget>[
            HoronRadioGroupItem(value: 'a', label: 'Disabled selected'),
            HoronRadioGroupItem(value: 'b', label: 'Disabled unselected'),
          ],
        ),
      ],
      notes:
          'React `radio-group.tsx`는 `size-[18px] rounded-full border-2` 링 안에 '
          '`size-2.5` 점을 얹습니다. 여기서는 링(지름 18, 두께 2)을 HoronRadioRingPainter가 '
          '테두리로만 그리고 점(지름 10)을 HoronRadioDotPainter가 따로 그립니다. '
          '한 그룹의 값은 하나입니다.',
    );
  }
}
