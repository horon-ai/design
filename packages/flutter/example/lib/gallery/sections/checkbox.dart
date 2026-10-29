import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Checkbox 갤러리 섹션입니다.
///
/// 두 크기와 세 상태(꺼짐·켜짐·부분 선택), 비활성 상태를 놓았습니다. 라벨을 눌러도
/// 상자가 바뀌는지 확인할 수 있습니다.
class HoronCheckboxGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCheckboxGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: const _CheckboxSamples(),
    );
  }
}

/// 체크 상태를 들고 있는 샘플 묶음입니다.
class _CheckboxSamples extends StatefulWidget {
  const _CheckboxSamples();

  @override
  State<_CheckboxSamples> createState() => _CheckboxSamplesState();
}

class _CheckboxSamplesState extends State<_CheckboxSamples> {
  bool? _md = true;
  bool? _sm = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        HoronCheckbox(
          value: _md,
          label: 'md · 20px',
          onChanged: (bool? value) => setState(() => _md = value),
        ),
        HoronCheckbox(
          value: _sm,
          small: true,
          label: 'sm · 18px',
          onChanged: (bool? value) => setState(() => _sm = value),
        ),
        const HoronCheckbox(value: null, label: '부분 선택'),
        const HoronCheckbox(value: true, label: '비활성 · 켜짐', enabled: false),
        const HoronCheckbox(value: false, label: '비활성 · 꺼짐', enabled: false),
      ],
    );
  }
}
