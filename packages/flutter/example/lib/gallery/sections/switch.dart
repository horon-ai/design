import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Switch 갤러리 섹션입니다.
///
/// 세 크기를 실제로 토글할 수 있게 두고, 라벨이 붙은 형태와 비활성 상태를 함께
/// 보여 줍니다.
class HoronSwitchGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSwitchGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: const _SwitchSamples(),
    );
  }
}

/// 토글 상태를 들고 있는 샘플 묶음입니다.
class _SwitchSamples extends StatefulWidget {
  const _SwitchSamples();

  @override
  State<_SwitchSamples> createState() => _SwitchSamplesState();
}

class _SwitchSamplesState extends State<_SwitchSamples> {
  final Map<HoronSwitchSize, bool> _values = <HoronSwitchSize, bool>{
    for (final HoronSwitchSize size in HoronSwitchSize.values) size: false,
  };

  void _set(HoronSwitchSize size, bool value) =>
      setState(() => _values[size] = value);

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        for (final HoronSwitchSize size in HoronSwitchSize.values)
          _Sample(
            label: size.name,
            child: HoronSwitch(
              value: _values[size]!,
              size: size,
              onChanged: (bool value) => _set(size, value),
            ),
          ),
        _Sample(
          label: 'label',
          child: SizedBox(
            width: 240,
            child: HoronSwitch(
              value: _values[HoronSwitchSize.md]!,
              label: '알림 받기',
              onChanged: (bool value) => _set(HoronSwitchSize.md, value),
            ),
          ),
        ),
        _Sample(
          label: 'disabled',
          child: HoronSwitch(value: true, enabled: false, onChanged: (_) {}),
        ),
      ],
    );
  }
}

/// 변형 하나와 그 이름입니다.
class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s1,
      children: <Widget>[
        Text(
          label,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
        child,
      ],
    );
  }
}
