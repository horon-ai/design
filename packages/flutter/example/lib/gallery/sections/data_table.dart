import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/data_table.dart';

import '../section_scaffold.dart';

/// 갤러리 표에 넣는 행입니다.
class _Person {
  const _Person(this.name, this.email, this.amount);

  final String name;
  final String email;
  final int amount;
}

const List<_Person> _people = <_Person>[
  _Person('김민열', 'minyeol@horon.ai', 29000),
  _Person('박서준', 'seojun@horon.ai', 12000),
  _Person('이하늘', 'haneul@horon.ai', 45000),
  _Person('정도윤', 'doyun@horon.ai', 8000),
  _Person('최지우', 'jiwoo@horon.ai', 31000),
  _Person('강예린', 'yerin@horon.ai', 27000),
  _Person('윤태호', 'taeho@horon.ai', 52000),
];

const List<HoronDataTableColumn<_Person>> _columns =
    <HoronDataTableColumn<_Person>>[
      HoronDataTableColumn<_Person>(id: 'name', header: '이름', value: _name),
      HoronDataTableColumn<_Person>(id: 'email', header: '이메일', value: _email),
      HoronDataTableColumn<_Person>(id: 'amount', header: '금액', value: _amount),
    ];

String _name(_Person person) => person.name;
String _email(_Person person) => person.email;
int _amount(_Person person) => person.amount;

/// `data_table` 갤러리 섹션입니다.
///
/// React `data-table.tsx`에는 cva 변형이 없습니다. 그래서 변형 칸에는 열 구성과 페이지
/// 크기를, 상태 칸에는 정렬 방향·빈 상태·좁은 폭을 놓습니다.
class HoronDataTableGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronDataTableGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Data Table',
      variants: <Widget>[
        _DataTableCell(
          label: 'three columns, page size 3',
          child: const HoronDataTable<_Person>(
            columns: _columns,
            data: _people,
            pageSize: 3,
          ),
        ),
        _DataTableCell(
          label: 'two columns, page size 5',
          child: const HoronDataTable<_Person>(
            columns: <HoronDataTableColumn<_Person>>[
              HoronDataTableColumn<_Person>(
                id: 'name',
                header: '이름',
                value: _name,
              ),
              HoronDataTableColumn<_Person>(
                id: 'amount',
                header: '금액',
                value: _amount,
              ),
            ],
            data: _people,
            pageSize: 5,
          ),
        ),
        _DataTableCell(
          label: 'one column, whole list',
          child: const HoronDataTable<_Person>(
            columns: <HoronDataTableColumn<_Person>>[
              HoronDataTableColumn<_Person>(
                id: 'email',
                header: '이메일',
                value: _email,
              ),
            ],
            data: _people,
            pageSize: 10,
          ),
        ),
      ],
      states: <Widget>[
        _DataTableCell(
          label: 'sorted ascending by name',
          child: const HoronDataTable<_Person>(
            columns: _columns,
            data: _people,
            pageSize: 4,
            initialSortColumnId: 'name',
            initialSortDirection: HoronDataTableSortDirection.asc,
          ),
        ),
        _DataTableCell(
          label: 'sorted descending by amount',
          child: const HoronDataTable<_Person>(
            columns: _columns,
            data: _people,
            pageSize: 4,
            initialSortColumnId: 'amount',
            initialSortDirection: HoronDataTableSortDirection.desc,
          ),
        ),
        _DataTableCell(
          label: 'empty state',
          child: const HoronDataTable<_Person>(
            columns: _columns,
            data: <_Person>[],
            pageSize: 5,
            emptyMessage: '조건에 맞는 사람이 없습니다',
          ),
        ),
        _DataTableCell(
          label: 'a column that cannot sort',
          child: const HoronDataTable<_Person>(
            columns: <HoronDataTableColumn<_Person>>[
              HoronDataTableColumn<_Person>(
                id: 'name',
                header: '이름',
                value: _name,
              ),
              HoronDataTableColumn<_Person>(
                id: 'note',
                header: '비고',
                value: _email,
                sortable: false,
              ),
            ],
            data: _people,
            pageSize: 3,
          ),
        ),
        _DataTableCell(
          label: 'narrow width scrolls',
          width: 260,
          child: const HoronDataTable<_Person>(
            columns: _columns,
            data: _people,
            pageSize: 3,
          ),
        ),
      ],
      notes:
          'React `data-table.tsx`는 TanStack의 정렬·페이지 기능을 얹은 표입니다. 머리를 누르면 '
          '오름차순 → 내림차순 → 없음 순서로 바뀌고, 정렬을 바꾸면 첫 페이지로 돌아갑니다. '
          '정렬 표시는 lucide의 `arrow-up`·`arrow-down`·`chevrons-up-down`입니다. 표 모양은 '
          '`table.tsx`와 같고, 페이지 줄은 행 수와 `Page X of Y`, 이전·다음 버튼(`size="sm"`, '
          '`variant="outline"`)으로 이뤄집니다.',
    );
  }
}

/// 표 하나를 이름과 함께 보여 주는 칸입니다.
class _DataTableCell extends StatelessWidget {
  const _DataTableCell({
    required this.label,
    required this.child,
    this.width = 620,
  });

  final String label;
  final Widget child;
  final double width;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
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
