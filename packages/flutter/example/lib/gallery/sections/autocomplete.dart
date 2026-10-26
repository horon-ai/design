import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `autocomplete` 갤러리 섹션입니다.
///
/// 입력 중 후보를 제안하는 필드와 오류·비활성·빈 상태를 그립니다. 목록은 입력을
/// 누르거나 오른쪽 펼침 버튼을 눌러야 열리므로 이 화면은 닫힌 상태의 표면을
/// 보여 줍니다.
class HoronAutocompleteGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronAutocompleteGallerySection({super.key});

  @override
  State<HoronAutocompleteGallerySection> createState() =>
      _HoronAutocompleteGallerySectionState();
}

class _HoronAutocompleteGallerySectionState
    extends State<HoronAutocompleteGallerySection> {
  static const List<HoronAutocompleteSuggestion> _cities =
      <HoronAutocompleteSuggestion>[
        HoronAutocompleteSuggestion(value: 'Seoul', description: 'Korea'),
        HoronAutocompleteSuggestion(value: 'Seattle', description: 'USA'),
        HoronAutocompleteSuggestion(value: 'Busan', description: 'Korea'),
      ];

  String _selected = '';

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Autocomplete',
      variants: <Widget>[
        SizedBox(
          width: 260,
          child: HoronAutocomplete(
            suggestions: _cities,
            placeholder: '도시 검색',
            onSelected: (String value) => setState(() => _selected = value),
          ),
        ),
        SizedBox(
          width: 260,
          child: HoronAutocomplete(
            suggestions: _cities,
            placeholder: '설명 없이',
            onSelected: (String value) => setState(() => _selected = value),
          ),
        ),
      ],
      states: <Widget>[
        SizedBox(
          width: 260,
          child: HoronAutocomplete(
            suggestions: _cities,
            invalid: true,
            placeholder: _selected.isEmpty ? '오류' : _selected,
          ),
        ),
        const SizedBox(
          width: 260,
          child: HoronAutocomplete(
            suggestions: _cities,
            enabled: false,
            placeholder: '비활성',
          ),
        ),
        const SizedBox(
          width: 260,
          child: HoronAutocomplete(
            suggestions: <HoronAutocompleteSuggestion>[],
            emptyLabel: '후보 없음',
          ),
        ),
      ],
      notes:
          'React `autocomplete.tsx`의 입력(높이 37)과 `.glass-strong` 목록입니다. '
          '입력 글자로 후보를 거르고, 고르면 그 값이 입력에 들어갑니다. 오른쪽 펼침 '
          '버튼은 키보드 없이 목록을 열고 닫는 길입니다.',
    );
  }
}
