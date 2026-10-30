import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Chip 갤러리 섹션입니다.
///
/// 칩은 선택 상태만 갖습니다. 여러 개를 실제로 눌러 체크와 브랜드 테두리가
/// 나타나는지, 다시 누르면 사라지는지 확인할 수 있게 두었습니다.
class HoronChipGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronChipGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: const _ChipSamples(),
    );
  }
}

/// 선택 상태를 들고 있는 칩 묶음입니다.
class _ChipSamples extends StatefulWidget {
  const _ChipSamples();

  @override
  State<_ChipSamples> createState() => _ChipSamplesState();
}

class _ChipSamplesState extends State<_ChipSamples> {
  static const List<String> _labels = <String>['전체', '읽지 않음', '첨부', '나에게 보낸'];

  final Set<String> _pressed = <String>{'전체'};

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Wrap(
      spacing: theme.space.s2,
      runSpacing: theme.space.s2,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        for (final String label in _labels)
          HoronChip(
            label: label,
            pressed: _pressed.contains(label),
            onPressedChange: (bool pressed) => setState(() {
              if (pressed) {
                _pressed.add(label);
              } else {
                _pressed.remove(label);
              }
            }),
          ),
        HoronChip(label: '비활성', enabled: false),
        const HoronChip(label: '스스로 토글'),
      ],
    );
  }
}
