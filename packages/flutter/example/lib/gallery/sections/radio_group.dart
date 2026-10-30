import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Radio Group 갤러리 섹션입니다.
///
/// 세 라디오를 실제로 고를 수 있게 두어 선택이 옮겨 다니는지 확인하고, 비활성
/// 라디오와 라벨 없는 라디오를 함께 놓았습니다.
class HoronRadioGroupGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronRadioGroupGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: const _RadioSamples(),
    );
  }
}

/// 선택 값을 들고 있는 라디오 묶음입니다.
class _RadioSamples extends StatefulWidget {
  const _RadioSamples();

  @override
  State<_RadioSamples> createState() => _RadioSamplesState();
}

class _RadioSamplesState extends State<_RadioSamples> {
  String _value = 'monthly';

  @override
  Widget build(BuildContext context) {
    return HoronRadioGroup(
      value: _value,
      onValueChange: (String value) => setState(() => _value = value),
      children: <Widget>[
        const HoronRadio(value: 'monthly', label: '월간 결제'),
        const HoronRadio(value: 'yearly', label: '연간 결제 (두 달 무료)'),
        const HoronRadio(value: 'once', label: '한 번만 결제', enabled: false),
        const HoronRadio(value: 'bare'),
      ],
    );
  }
}
