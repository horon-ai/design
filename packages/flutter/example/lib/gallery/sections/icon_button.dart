import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Icon Button 갤러리 섹션입니다.
///
/// 세 변형과 세 크기를 모두 놓고, 32px 상자에 44px 터치 영역이 깔리는지 눈으로
/// 확인할 수 있게 간격을 넉넉히 둡니다.
class HoronIconButtonGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronIconButtonGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s4,
        runSpacing: theme.space.s4,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          for (final HoronIconButtonVariant variant
              in HoronIconButtonVariant.values)
            for (final HoronIconButtonSize size in HoronIconButtonSize.values)
              _Sample(
                label: '${variant.name} · ${size.name}',
                child: HoronIconButton(
                  icon: const Icon(Icons.add),
                  label: '추가',
                  variant: variant,
                  size: size,
                  onPressed: () {},
                ),
              ),
          _Sample(
            label: 'search',
            child: HoronIconButton(
              icon: const Icon(Icons.search),
              label: '검색',
              onPressed: () {},
            ),
          ),
          _Sample(
            label: 'disabled',
            child: HoronIconButton(
              icon: const Icon(Icons.add),
              label: '추가',
              enabled: false,
              onPressed: () {},
            ),
          ),
        ],
      ),
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
