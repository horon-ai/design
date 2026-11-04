import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// Button 갤러리 섹션입니다.
///
/// 네 변형과 세 크기를 나란히 놓고, 아이콘·비활성 상태와 크기와 무관한 `link`
/// 변형을 따로 보여 줍니다. `link` 표본은 `href` 링크 의미와 `current`(현재 페이지)
/// 색을 함께 보여 줍니다. `glass`도 다른 변형과 같이 44px 터치 영역을 갖고(React가
/// `overflow-clip`을 걷어 냈습니다), `danger`는 누르는 동안 hover 색이 아니라 원래
/// 위험 색으로 돌아갑니다.
class HoronButtonGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronButtonGallerySection({super.key});

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
          for (final HoronButtonVariant variant in HoronButtonVariant.values)
            for (final HoronButtonSize size in HoronButtonSize.values)
              _Sample(
                label: '${variant.name} · ${size.name}',
                child: HoronButton(
                  label: '저장',
                  variant: variant,
                  size: size,
                  onPressed: () {},
                ),
              ),
          _Sample(
            label: 'icon',
            child: HoronButton(
              label: '추가',
              icon: const Icon(Icons.add),
              onPressed: () {},
            ),
          ),
          _Sample(
            label: 'disabled',
            child: HoronButton(label: '저장', enabled: false, onPressed: () {}),
          ),
          _Sample(
            label: 'link · href',
            child: HoronButton(
              label: '문서 열기',
              variant: HoronButtonVariant.link,
              href: Uri.parse('https://horon.example/docs'),
              onPressed: () {},
            ),
          ),
          _Sample(
            label: 'link · current',
            child: HoronButton(
              label: '현재 페이지',
              variant: HoronButtonVariant.link,
              href: Uri.parse('https://horon.example/docs/button'),
              current: true,
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
