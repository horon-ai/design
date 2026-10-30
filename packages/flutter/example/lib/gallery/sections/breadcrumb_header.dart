import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports

/// Breadcrumb Header 갤러리 섹션입니다.
///
/// 조각 타일이 있는 기본형과, 조각이 많아 폭에 따라 줄을 바꾸는 예를 놓습니다.
class HoronBreadcrumbHeaderGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronBreadcrumbHeaderGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          _Sample(
            label: '기본',
            child: HoronBreadcrumbHeader(
              crumbs: <HoronBreadcrumbHeaderCrumb>[
                HoronBreadcrumbHeaderCrumb(
                  label: '워크스페이스',
                  onTap: () {},
                  tile: const Icon(Icons.workspace_premium),
                ),
                HoronBreadcrumbHeaderCrumb(label: '에이전트', onTap: () {}),
                const HoronBreadcrumbHeaderCrumb(label: '설정'),
              ],
              onSearch: () {},
              onMore: () {},
            ),
          ),
          _Sample(
            label: '긴 조각 (폭에 따라 줄바꿈)',
            child: HoronBreadcrumbHeader(
              crumbs: <HoronBreadcrumbHeaderCrumb>[
                HoronBreadcrumbHeaderCrumb(label: '워크스페이스 설정', onTap: () {}),
                HoronBreadcrumbHeaderCrumb(label: '지식 베이스 관리', onTap: () {}),
                const HoronBreadcrumbHeaderCrumb(label: '문서 추출 실행 기록'),
              ],
              onSearch: () {},
              onMore: () {},
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
      spacing: theme.space.s2,
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
