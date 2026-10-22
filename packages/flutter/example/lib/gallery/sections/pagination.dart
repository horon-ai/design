import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/pagination.dart';

import '../section_scaffold.dart';

/// `pagination` 갤러리 섹션입니다.
///
/// React `pagination.tsx`에는 cva 변형이 없습니다. 그래서 변형 칸에는 페이지 수에 따른
/// 번호 목록(전부 보임·한쪽 말줄임·양쪽 말줄임)을, 상태 칸에는 첫/가운데/마지막 페이지와
/// 좁은 폭을 놓습니다.
class HoronPaginationGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronPaginationGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Pagination',
      variants: <Widget>[
        _PaginationCell(
          label: 'page 3 of 6 - every number',
          child: HoronPagination(
            page: 3,
            pageCount: 6,
            onPageChanged: (int next) {},
          ),
        ),
        _PaginationCell(
          label: 'page 1 of 10 - right ellipsis',
          child: HoronPagination(
            page: 1,
            pageCount: 10,
            onPageChanged: (int next) {},
          ),
        ),
        _PaginationCell(
          label: 'page 5 of 10 - both ellipses',
          child: HoronPagination(
            page: 5,
            pageCount: 10,
            onPageChanged: (int next) {},
          ),
        ),
        _PaginationCell(
          label: 'page 10 of 10 - left ellipsis',
          child: HoronPagination(
            page: 10,
            pageCount: 10,
            onPageChanged: (int next) {},
          ),
        ),
      ],
      states: <Widget>[
        _PaginationCell(
          label: 'First page - previous disabled',
          child: HoronPagination(
            page: 1,
            pageCount: 5,
            onPageChanged: (int next) {},
          ),
        ),
        _PaginationCell(
          label: 'Middle page - both enabled',
          child: HoronPagination(
            page: 3,
            pageCount: 5,
            onPageChanged: (int next) {},
          ),
        ),
        _PaginationCell(
          label: 'Last page - next disabled',
          child: HoronPagination(
            page: 5,
            pageCount: 5,
            onPageChanged: (int next) {},
          ),
        ),
        _PaginationCell(
          label: 'Narrow width - icon only',
          child: SizedBox(
            width: 280,
            child: HoronPagination(
              page: 4,
              pageCount: 20,
              onPageChanged: (int next) {},
            ),
          ),
        ),
        _PaginationCell(
          label: 'Labels hidden',
          child: HoronPagination(
            page: 2,
            pageCount: 8,
            showLabels: false,
            onPageChanged: (int next) {},
          ),
        ),
      ],
      notes:
          'React `pagination.tsx`는 이전/다음을 `button.tsx`의 `size="default"`로, 번호를 '
          '`size="icon"`(32 정사각)으로 그립니다. 활성 번호만 `outline`이라 테두리가 있고 '
          '나머지는 `ghost`입니다. 이전·다음 글자는 `hidden sm:block`이라 640보다 좁으면 '
          '아이콘만 남습니다. 첫 페이지에서는 이전이, 마지막 페이지에서는 다음이 비활성입니다.',
    );
  }
}

/// 페이지네이션 하나를 이름과 함께 보여 주는 칸입니다.
class _PaginationCell extends StatelessWidget {
  const _PaginationCell({required this.label, required this.child});

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
