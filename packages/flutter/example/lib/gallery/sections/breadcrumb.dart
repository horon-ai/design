import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports

/// Breadcrumb 갤러리 섹션입니다.
///
/// 맨 조각과 조각이 많은 줄을 solid와 glass 두 표면에 같은 목록으로 놓습니다.
/// 조각이 많으면 폭에 따라 줄을 바꾸고, 구분 캐럿은 폭이 좁아져도 줄어들지 않습니다
/// (React `shrink-0`).
class HoronBreadcrumbGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronBreadcrumbGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s6,
        children: <Widget>[
          SurfaceGroup(
            label: 'Solid',
            child: _crumbs(theme, HoronBreadcrumbSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _crumbs(theme, HoronBreadcrumbSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 이동 경로 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _crumbs(HoronThemeData theme, HoronBreadcrumbSurface surface) {
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s6,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Sample(
          label: '기본 (조각만)',
          child: HoronBreadcrumb(
            surface: surface,
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
          label: '긴 조각 (폭에 따라 줄바꿈)',
          child: HoronBreadcrumb(
            surface: surface,
            children: <Widget>[
              HoronBreadcrumbItem(label: '워크스페이스 설정', onTap: () {}),
              HoronBreadcrumbItem(label: '에이전트 관리', onTap: () {}),
              HoronBreadcrumbItem(label: '도구 권한', onTap: () {}),
              const HoronBreadcrumbItem(label: '위험한 도구 승인', current: true),
            ],
          ),
        ),
        _Sample(
          label: '좁은 폭 (캐럿 고정)',
          child: SizedBox(
            width: 240,
            child: HoronBreadcrumb(
              surface: surface,
              children: <Widget>[
                HoronBreadcrumbItem(label: '워크스페이스 설정과 통합', onTap: () {}),
                HoronBreadcrumbItem(label: '에이전트 관리 목록', onTap: () {}),
                const HoronBreadcrumbItem(label: '설정', current: true),
              ],
            ),
          ),
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
