import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

const List<HoronComboboxItem> _countries = <HoronComboboxItem>[
  HoronComboboxItem(
    value: 'kr',
    label: '+82 South Korea',
    selectedLabel: '+82',
    keywords: <String>['KR', 'Korea'],
  ),
  HoronComboboxItem(
    value: 'us',
    label: '+1 United States',
    selectedLabel: '+1',
    keywords: <String>['US', 'USA'],
  ),
  HoronComboboxItem(
    value: 'jp',
    label: '+81 Japan',
    selectedLabel: '+81',
    keywords: <String>['JP'],
  ),
  HoronComboboxItem(
    value: 'de',
    label: '+49 Germany',
    selectedLabel: '+49',
    keywords: <String>['DE'],
  ),
  HoronComboboxItem(
    value: 'fr',
    label: '+33 France',
    selectedLabel: '+33',
    keywords: <String>['FR'],
    disabled: true,
  ),
];

const List<HoronComboboxItem> _tags = <HoronComboboxItem>[
  HoronComboboxItem(value: 'design', label: 'Design'),
  HoronComboboxItem(value: 'engineering', label: 'Engineering'),
  HoronComboboxItem(value: 'research', label: 'Research'),
  HoronComboboxItem(value: 'ops', label: 'Operations'),
];

const List<HoronSelectItem> _dialCodes = <HoronSelectItem>[
  HoronSelectItem(value: 'kr', label: '+82 South Korea', selectedLabel: '+82'),
  HoronSelectItem(value: 'us', label: '+1 United States', selectedLabel: '+1'),
  HoronSelectItem(value: 'jp', label: '+81 Japan', selectedLabel: '+81'),
];

/// `combobox` 갤러리 섹션입니다.
///
/// 검색이 붙은 단일·복수 선택과 InputGroup 칸으로 쓰는 모습을 보여 줍니다.
class HoronComboboxGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronComboboxGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Combobox',
      variants: <Widget>[
        const _Cell(
          label: '단일 · solid (기본)',
          child: SizedBox(
            width: 260,
            child: HoronCombobox(items: _countries, placeholder: '국가'),
          ),
        ),
        const _Cell(
          label: '단일 · glass',
          child: SizedBox(
            width: 260,
            child: HoronCombobox(
              items: _countries,
              surface: HoronInputSurface.glass,
              placeholder: '국가',
            ),
          ),
        ),
        const _Cell(
          label: '복수 · 칩',
          child: SizedBox(
            width: 300,
            child: HoronCombobox(
              items: _tags,
              multiple: true,
              values: <String>['design', 'research'],
              placeholder: '태그',
            ),
          ),
        ),
      ],
      states: <Widget>[
        const _Cell(
          label: 'InputGroup 앞 칸 · Select(segment)',
          child: SizedBox(
            width: 300,
            child: HoronInputGroup(
              prefix: HoronSelect(
                items: _dialCodes,
                segment: true,
                placeholder: '+82',
              ),
              hintText: '1010 1234',
            ),
          ),
        ),
        const _Cell(
          label: 'InputGroup 앞 칸 · Combobox(segment)',
          child: SizedBox(
            width: 300,
            child: HoronInputGroup(
              prefix: HoronCombobox(
                items: _countries,
                segment: true,
                placeholder: '+82',
              ),
              hintText: '1010 1234',
            ),
          ),
        ),
        const _Cell(
          label: '고정 글자 칸',
          child: SizedBox(
            width: 260,
            child: HoronInputGroup(
              prefix: HoronInputGroupSegment(child: Text('https://')),
              hintText: 'example.com',
            ),
          ),
        ),
      ],
      notes:
          '검색과 선택을 합친 필드입니다. 목록은 Select와 같은 두꺼운 유리 위에 검색 상자를 얹고, '
          '입력한 말로 항목을 거릅니다. 복수 선택은 고른 항목을 칩으로 쌓고 X로 뺍니다. '
          '`segment`를 켜면 InputGroup의 앞·뒤 칸이 되어 그룹의 크기와 비활성 상태를 따릅니다.',
    );
  }
}

class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          label,
          style: horon.text.caption.copyWith(color: horon.colors.textSecondary),
        ),
        const SizedBox(height: HoronSpace.s1_5),
        child,
      ],
    );
  }
}
