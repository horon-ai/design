import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

const List<HoronSelectItem> _dialCodes = <HoronSelectItem>[
  HoronSelectItem(value: 'kr', label: '+82 South Korea', selectedLabel: '+82'),
  HoronSelectItem(value: 'us', label: '+1 United States', selectedLabel: '+1'),
  HoronSelectItem(value: 'jp', label: '+81 Japan', selectedLabel: '+81'),
];

const List<HoronComboboxItem> _comboboxCodes = <HoronComboboxItem>[
  HoronComboboxItem(
    value: 'kr',
    label: '+82 South Korea',
    selectedLabel: '+82',
    keywords: <String>['Korea'],
  ),
  HoronComboboxItem(
    value: 'us',
    label: '+1 United States',
    selectedLabel: '+1',
    keywords: <String>['USA'],
  ),
  HoronComboboxItem(value: 'jp', label: '+81 Japan', selectedLabel: '+81'),
];

/// `input_group` 갤러리 섹션입니다.
///
/// 앞 칸·뒤 칸·양쪽 칸과 오류·비활성 상태를 solid와 glass 두 표면에 같은 목록으로
/// 보여 줍니다.
class HoronInputGroupGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronInputGroupGallerySection({super.key});

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
          Text('Input group', style: theme.text.titleLg),
          SurfaceGroup(
            label: 'Solid',
            child: _groups(theme, HoronInputSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _groups(theme, HoronInputSurface.glass),
          ),
          Text(
            'Figma `Input group`(60:429)입니다. 40px 상자를 앞 칸·입력·뒤 칸으로 '
            '나누고 사이에 1px 구분선을 둡니다. 칸은 진짜 Select·Combobox(segment)이거나 '
            '고정 글자를 담은 HoronInputGroupSegment입니다. 칸은 그룹의 크기와 비활성 '
            '상태를 따르고, 구분선은 hover에서 `border-strong`, 오류에서 '
            '`border-danger`가 됩니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 입력 그룹 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _groups(HoronThemeData theme, HoronInputSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Cell(
          label: '앞 칸 · 고정 글자',
          child: HoronInputGroup(
            surface: surface,
            prefix: const HoronInputGroupSegment(child: Text('+82')),
            hintText: '1010 1234',
          ),
        ),
        _Cell(
          label: '앞 칸 · Select(segment)',
          child: HoronInputGroup(
            surface: surface,
            prefix: HoronSelect(
              items: _dialCodes,
              segment: true,
              surface: surface,
              value: 'kr',
            ),
            hintText: '1010 1234',
          ),
        ),
        _Cell(
          label: '앞 칸 · Combobox(segment)',
          child: HoronInputGroup(
            surface: surface,
            prefix: HoronCombobox(
              items: _comboboxCodes,
              segment: true,
              surface: surface,
              value: 'kr',
            ),
            hintText: '1010 1234',
          ),
        ),
        _Cell(
          label: '뒤 칸 (14px 아이콘)',
          child: HoronInputGroup(
            surface: surface,
            suffix: const HoronInputGroupSegment(
              child: Icon(Icons.attach_money),
            ),
            hintText: '0.00',
          ),
        ),
        _Cell(
          label: '양쪽 칸',
          child: HoronInputGroup(
            surface: surface,
            prefix: const HoronInputGroupSegment(child: Text('+82')),
            suffix: const HoronInputGroupSegment(
              child: Icon(Icons.attach_money),
            ),
            hintText: '1010 1234',
          ),
        ),
        _Cell(
          label: '오류 (구분선도 위험 색)',
          child: HoronInputGroup(
            surface: surface,
            prefix: const HoronInputGroupSegment(child: Text('+82')),
            invalid: true,
            hintText: '1010 1234',
          ),
        ),
        _Cell(
          label: 'Disabled (칸에도 내려감)',
          child: HoronInputGroup(
            surface: surface,
            prefix: HoronSelect(
              items: _dialCodes,
              segment: true,
              surface: surface,
              value: 'kr',
            ),
            disabled: true,
            hintText: '1010 1234',
          ),
        ),
      ],
    );
  }
}

/// 그룹 하나를 캡션과 함께 보여 주는 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 260,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            label,
            style: horon.text.caption.copyWith(
              color: horon.colors.textSecondary,
            ),
          ),
          SizedBox(height: horon.space.s1_5),
          child,
        ],
      ),
    );
  }
}
