import 'package:flutter/material.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/combobox.dart';

import '../section_scaffold.dart';

/// `combobox` 갤러리 섹션입니다.
///
/// 단일 선택과 다중 선택(칩), 오류·비활성·빈 상태를 그립니다. 목록은 입력을 눌러야
/// 열리므로 이 화면은 닫힌 상태의 표면을 보여 줍니다.
class HoronComboboxGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronComboboxGallerySection({super.key});

  @override
  State<HoronComboboxGallerySection> createState() =>
      _HoronComboboxGallerySectionState();
}

class _HoronComboboxGallerySectionState
    extends State<HoronComboboxGallerySection> {
  static const List<HoronComboboxOption> _tags = <HoronComboboxOption>[
    HoronComboboxOption(value: 'design', label: 'Design'),
    HoronComboboxOption(value: 'code', label: 'Code'),
    HoronComboboxOption(value: 'research', label: 'Research'),
    HoronComboboxOption(value: 'retired', label: 'Retired', enabled: false),
  ];

  Set<String> _single = <String>{};
  Set<String> _multiple = <String>{'design', 'code'};

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Combobox',
      variants: <Widget>[
        SizedBox(
          width: 260,
          child: HoronCombobox(
            options: _tags,
            selected: _single,
            placeholder: '태그 하나',
            onSelectionChanged: (Set<String> values) =>
                setState(() => _single = values),
          ),
        ),
        SizedBox(
          width: 260,
          child: HoronCombobox(
            multiple: true,
            options: _tags,
            selected: _multiple,
            placeholder: '태그 검색',
            onSelectionChanged: (Set<String> values) =>
                setState(() => _multiple = values),
          ),
        ),
      ],
      states: <Widget>[
        const SizedBox(
          width: 260,
          child: HoronCombobox(
            multiple: true,
            options: _tags,
            selected: <String>{'research'},
            invalid: true,
          ),
        ),
        const SizedBox(
          width: 260,
          child: HoronCombobox(
            options: _tags,
            enabled: false,
            placeholder: '비활성',
          ),
        ),
        const SizedBox(
          width: 260,
          child: HoronCombobox(
            options: <HoronComboboxOption>[],
            emptyLabel: '후보 없음',
          ),
        ),
      ],
      notes:
          'React `combobox.tsx`의 입력 줄(높이 37)과 `.glass-strong` 목록입니다. '
          '입력 글자로 후보를 거르고, 다중 선택에서 고른 값은 Material Chip이 아니라 '
          'todo 8의 HoronChip으로 그립니다. 후보가 0건이면 빈 상태 문구가 나옵니다.',
    );
  }
}
