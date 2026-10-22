import 'package:flutter/material.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/select.dart';

import '../section_scaffold.dart';

/// `select` 갤러리 섹션입니다.
///
/// 트리거 두 크기, 그룹·라벨·구분선이 있는 목록을 그립니다. 상태는 선택됨·빈 목록·
/// 오류·비활성입니다. 목록은 트리거를 눌러야 열리므로 이 화면은 닫힌 상태를 보여
/// 줍니다(열린 모양은 위젯 테스트와 렌더 캡처가 확인합니다).
class HoronSelectGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronSelectGallerySection({super.key});

  @override
  State<HoronSelectGallerySection> createState() =>
      _HoronSelectGallerySectionState();
}

class _HoronSelectGallerySectionState extends State<HoronSelectGallerySection> {
  static const List<Widget> _cities = <Widget>[
    HoronSelectItem<String>(value: 'seoul', label: '서울'),
    HoronSelectItem<String>(value: 'busan', label: '부산'),
  ];

  static const List<Widget> _grouped = <Widget>[
    HoronSelectGroup(
      children: <Widget>[
        HoronSelectLabel(label: '수도권'),
        HoronSelectItem<String>(value: 'seoul', label: '서울'),
        HoronSelectItem<String>(value: 'incheon', label: '인천'),
      ],
    ),
    HoronSelectSeparator(),
    HoronSelectGroup(
      children: <Widget>[
        HoronSelectLabel(label: '그 밖'),
        HoronSelectItem<String>(value: 'busan', label: '부산'),
        HoronSelectItem<String>(value: 'jeju', label: '제주', enabled: false),
      ],
    ),
  ];

  String? _city;
  String? _groupedValue = 'seoul';
  String? _invalid;

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Select',
      variants: <Widget>[
        SizedBox(
          width: 220,
          child: HoronSelect<String>(
            value: _city,
            onChanged: (String value) => setState(() => _city = value),
            children: <Widget>[
              const HoronSelectTrigger(
                child: HoronSelectValue(placeholder: '도시'),
              ),
              const HoronSelectContent(children: _cities),
            ],
          ),
        ),
        SizedBox(
          width: 220,
          child: HoronSelect<String>(
            value: _groupedValue,
            onChanged: (String value) => setState(() => _groupedValue = value),
            children: <Widget>[
              const HoronSelectTrigger(child: HoronSelectValue()),
              const HoronSelectContent(children: _grouped),
            ],
          ),
        ),
        SizedBox(
          width: 160,
          child: HoronSelect<String>(
            value: _city,
            onChanged: (String value) => setState(() => _city = value),
            children: <Widget>[
              const HoronSelectTrigger(
                size: HoronSelectSize.sm,
                child: HoronSelectValue(placeholder: 'small'),
              ),
              const HoronSelectContent(children: _cities),
            ],
          ),
        ),
      ],
      states: <Widget>[
        SizedBox(
          width: 220,
          child: HoronSelect<String>(
            value: _invalid,
            invalid: true,
            onChanged: (String value) => setState(() => _invalid = value),
            children: <Widget>[
              const HoronSelectTrigger(
                child: HoronSelectValue(placeholder: '오류'),
              ),
              const HoronSelectContent(children: _cities),
            ],
          ),
        ),
        SizedBox(
          width: 220,
          child: HoronSelect<String>(
            enabled: false,
            children: <Widget>[
              const HoronSelectTrigger(
                child: HoronSelectValue(placeholder: '비활성'),
              ),
              const HoronSelectContent(children: _cities),
            ],
          ),
        ),
        SizedBox(
          width: 220,
          child: HoronSelect<String>(
            children: <Widget>[
              const HoronSelectTrigger(
                child: HoronSelectValue(placeholder: '빈 목록'),
              ),
              const HoronSelectContent(
                emptyLabel: '고를 도시가 없습니다',
                children: <Widget>[],
              ),
            ],
          ),
        ),
      ],
      notes:
          'React `select.tsx`의 트리거 두 크기(37·28)와 `.glass-strong` 목록입니다. '
          '목록은 트리거 폭을 따르고 최소 144이며, 아래에 자리가 없으면 위로 뒤집힙니다. '
          '선택된 항목에는 체크 표시가 남고, 고를 항목이 없으면 빈 상태 문구가 그려집니다.',
    );
  }
}
