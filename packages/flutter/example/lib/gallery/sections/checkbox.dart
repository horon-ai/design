import 'package:flutter/material.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/checkbox.dart';

import '../section_scaffold.dart';

/// `checkbox` 갤러리 섹션입니다.
///
/// 세 값(미선택·선택·불확정)과 오류·비활성을 모두 그립니다. 체크 표시가
/// `CustomPainter`로 그려지므로 이 화면에서 표시의 모양을 눈으로 확인할 수
/// 있습니다.
class HoronCheckboxGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronCheckboxGallerySection({super.key});

  @override
  State<HoronCheckboxGallerySection> createState() =>
      _HoronCheckboxGallerySectionState();
}

class _HoronCheckboxGallerySectionState
    extends State<HoronCheckboxGallerySection> {
  bool _unchecked = false;
  bool _checked = true;
  bool? _indeterminate;

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Checkbox',
      variants: <Widget>[
        HoronCheckbox(
          value: _unchecked,
          label: 'Unchecked',
          onChanged: (bool value) => setState(() => _unchecked = value),
        ),
        HoronCheckbox(
          value: _checked,
          label: 'Checked',
          onChanged: (bool value) => setState(() => _checked = value),
        ),
        HoronCheckbox(
          value: _indeterminate,
          label: 'Indeterminate',
          onChanged: (bool value) => setState(() => _indeterminate = value),
        ),
      ],
      states: <Widget>[
        HoronCheckbox(
          value: true,
          invalid: true,
          label: 'Checked invalid',
          onChanged: (_) {},
        ),
        HoronCheckbox(
          value: false,
          invalid: true,
          label: 'Unchecked invalid',
          onChanged: (_) {},
        ),
        HoronCheckbox(
          value: true,
          enabled: false,
          label: 'Disabled checked',
          onChanged: (_) {},
        ),
        HoronCheckbox(
          value: false,
          enabled: false,
          label: 'Disabled unchecked',
          onChanged: (_) {},
        ),
        const HoronCheckbox(value: null, label: 'Disabled indeterminate'),
        const HoronCheckbox(value: false),
      ],
      notes:
          'React `checkbox.tsx`의 `size-[18px]`·`rounded-[5px]`·`border-input`과 '
          '`data-checked:bg-primary`를 그대로 옮겼습니다. 체크 표시와 불확정 대시는 '
          'Material 아이콘이 아니라 CustomPainter가 그립니다. 비활성은 콜백이 없는 상태입니다.',
    );
  }
}
