import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

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
/// 검색이 붙은 단일·복수 선택과 InputGroup 칸으로 쓰는 모습을 solid와 glass 두
/// 표면에 같은 목록으로 보여 줍니다.
class HoronComboboxGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronComboboxGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: theme.space.s6,
        children: <Widget>[
          Text('Combobox', style: theme.text.titleLg),
          SurfaceGroup(
            label: 'Solid',
            child: _comboboxes(theme, HoronInputSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _comboboxes(theme, HoronInputSurface.glass),
          ),
          Text(
            '검색과 선택을 합친 필드입니다. 목록은 Select와 같은 두꺼운 유리 위에 검색 '
            '상자를 얹고, 입력한 말로 항목을 거릅니다. 복수 선택은 고른 항목을 칩으로 '
            '쌓고 X로 뺍니다. `segment`를 켜면 InputGroup의 앞·뒤 칸이 되어 그룹의 '
            '크기와 비활성 상태를 따릅니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 콤보박스 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _comboboxes(HoronThemeData theme, HoronInputSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Cell(
          label: '단일',
          child: SizedBox(
            width: 260,
            child: HoronCombobox(
              items: _countries,
              surface: surface,
              placeholder: '국가',
            ),
          ),
        ),
        _Cell(
          label: '복수 · 칩',
          child: SizedBox(
            width: 300,
            child: HoronCombobox(
              items: _tags,
              surface: surface,
              multiple: true,
              values: const <String>['design', 'research'],
              placeholder: '태그',
            ),
          ),
        ),
        _Cell(
          label: 'InputGroup 앞 칸 · Select(segment)',
          child: SizedBox(
            width: 300,
            child: HoronInputGroup(
              surface: surface,
              prefix: HoronSelect(
                items: _dialCodes,
                segment: true,
                surface: surface,
                placeholder: '+82',
              ),
              hintText: '1010 1234',
            ),
          ),
        ),
        _Cell(
          label: 'InputGroup 앞 칸 · Combobox(segment)',
          child: SizedBox(
            width: 300,
            child: HoronInputGroup(
              surface: surface,
              prefix: HoronCombobox(
                items: _countries,
                segment: true,
                surface: surface,
                placeholder: '+82',
              ),
              hintText: '1010 1234',
            ),
          ),
        ),
        _Cell(
          label: '고정 글자 칸',
          child: SizedBox(
            width: 260,
            child: HoronInputGroup(
              surface: surface,
              prefix: const HoronInputGroupSegment(child: Text('https://')),
              hintText: 'example.com',
            ),
          ),
        ),
      ],
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
