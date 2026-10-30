import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports

/// Breadcrumb 갤러리 섹션입니다.
///
/// 맨 조각과 유리 쟁반(`surface="glass"`)을 나란히 놓고, 조각이 많은 줄이 폭에 따라
/// 어떻게 줄을 바꾸는지 볼 수 있게 긴 이름의 예를 하나 더 둡니다.
class HoronBreadcrumbGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronBreadcrumbGallerySection({super.key});

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
            label: '기본 (조각만)',
            child: HoronBreadcrumb(
              children: <Widget>[
                HoronBreadcrumbItem(
                  label: '워크스페이스',
                  onTap: () {},
                  tile: const Icon(Icons.workspace_premium),
                ),
                HoronBreadcrumbItem(label: '에이전트', onTap: () {}),
                const HoronBreadcrumbItem(label: '설정', current: true),
              ],
            ),
          ),
          _Sample(
            label: 'surface="glass"',
            child: HoronBreadcrumb(
              glass: true,
              children: <Widget>[
                HoronBreadcrumbItem(label: '워크스페이스', onTap: () {}),
                HoronBreadcrumbItem(label: '지식 베이스', onTap: () {}),
                const HoronBreadcrumbItem(label: '문서 추출', current: true),
              ],
            ),
          ),
          _Sample(
            label: '긴 조각 (폭에 따라 줄바꿈)',
            child: HoronBreadcrumb(
              glass: true,
              children: <Widget>[
                HoronBreadcrumbItem(label: '워크스페이스 설정', onTap: () {}),
                HoronBreadcrumbItem(label: '에이전트 관리', onTap: () {}),
                HoronBreadcrumbItem(label: '도구 권한', onTap: () {}),
                const HoronBreadcrumbItem(label: '위험한 도구 승인', current: true),
              ],
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
