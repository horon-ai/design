import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `breadcrumb` 갤러리 섹션입니다.
///
/// React `breadcrumb.tsx`에는 cva 변형이 없습니다. 그래서 변형 칸에는 경로 길이와
/// 접힘(`maxItems`)을, 상태 칸에는 현재 위치·사용자 지정 구분자·말줄임·좁은 폭을 놓습니다.
class HoronBreadcrumbGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronBreadcrumbGallerySection({super.key});

  /// 글자 하나를 가진 경로 항목입니다.
  Widget _crumb(String label, {VoidCallback? onTap}) {
    return HoronBreadcrumbItem(
      child: onTap == null
          ? HoronBreadcrumbPage(text: label)
          : HoronBreadcrumbLink(text: label, onTap: onTap),
    );
  }

  /// 여섯 항목짜리 경로입니다.
  List<Widget> _six() => <Widget>[
    _crumb('홈', onTap: () {}),
    _crumb('워크스페이스', onTap: () {}),
    _crumb('프로젝트', onTap: () {}),
    _crumb('설정', onTap: () {}),
    _crumb('멤버', onTap: () {}),
    _crumb('프로필'),
  ];

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Breadcrumb',
      variants: <Widget>[
        _BreadcrumbCell(
          label: 'Two items',
          child: HoronBreadcrumb(
            children: <Widget>[
              _crumb('홈', onTap: () {}),
              _crumb('프로필'),
            ],
          ),
        ),
        _BreadcrumbCell(
          label: 'Four items',
          child: HoronBreadcrumb(
            children: <Widget>[
              _crumb('홈', onTap: () {}),
              _crumb('워크스페이스', onTap: () {}),
              _crumb('설정', onTap: () {}),
              _crumb('프로필'),
            ],
          ),
        ),
        _BreadcrumbCell(
          label: 'Six items - no collapse',
          child: HoronBreadcrumb(children: _six()),
        ),
        _BreadcrumbCell(
          label: 'Six items, maxItems 4',
          child: HoronBreadcrumb(maxItems: 4, children: _six()),
        ),
        _BreadcrumbCell(
          label: 'Six items, maxItems 3',
          child: HoronBreadcrumb(maxItems: 3, children: _six()),
        ),
      ],
      states: <Widget>[
        _BreadcrumbCell(
          label: 'Custom separator',
          child: HoronBreadcrumb(
            separator: const HoronBreadcrumbSeparator(child: Text('/')),
            children: <Widget>[
              _crumb('홈', onTap: () {}),
              _crumb('설정', onTap: () {}),
              _crumb('프로필'),
            ],
          ),
        ),
        _BreadcrumbCell(
          label: 'Ellipsis part',
          child: HoronBreadcrumb(
            children: <Widget>[
              _crumb('홈', onTap: () {}),
              const HoronBreadcrumbItem(child: HoronBreadcrumbEllipsis()),
              _crumb('프로필'),
            ],
          ),
        ),
        _BreadcrumbCell(
          label: 'Narrow width wraps',
          child: SizedBox(width: 200, child: HoronBreadcrumb(children: _six())),
        ),
      ],
      notes:
          'React `breadcrumb.tsx`는 `flex flex-wrap items-center gap-1.5 text-sm`이고 '
          '640보다 넓으면 `sm:gap-2`가 붙습니다. 현재 위치는 `aria-current="page"`라 '
          '누를 수 없고 글자만 진합니다. `maxItems`는 가운데 항목만 말줄임으로 접고 첫 '
          '항목과 마지막 항목은 남깁니다(최소 3).',
    );
  }
}

/// 경로 하나를 이름과 함께 보여 주는 칸입니다.
class _BreadcrumbCell extends StatelessWidget {
  const _BreadcrumbCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 460,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          child,
        ],
      ),
    );
  }
}
