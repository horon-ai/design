import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `data_table`의 갤러리 섹션입니다.
///
/// 같은 표를 데스크톱 폭과 모바일 폭으로 나란히 놓았습니다. 여백이 24px에서 18px로
/// 줄고, 모바일 카드에서는 표 본문이 카드 안에서 가로로 스크롤합니다(카드 밖의 조작
/// 요소는 스크롤하지 않습니다). 정렬 가능한 열, 선택 열, 태그, 검색, 쪽 나눔, 바닥글이
/// 모두 보입니다.
class HoronDataTableGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronDataTableGallerySection({super.key});

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
          SizedBox(
            width: 720,
            child: _DataTableSample(
              caption: 'desktop · tablet — 여백 24, 표가 폭에 맞춰짐',
              device: HoronDataTableDevice.desktop,
            ),
          ),
          SizedBox(
            width: 320,
            child: _DataTableSample(
              caption: 'mobile — 여백 18, 표 본문이 카드 안에서 가로로 스크롤',
              device: HoronDataTableDevice.mobile,
            ),
          ),
        ],
      ),
    );
  }
}

/// 표 한 벌입니다. 머리·검색·표·쪽 나눔·바닥글을 카드 안에 쌓습니다.
class _DataTableSample extends StatefulWidget {
  const _DataTableSample({required this.caption, required this.device});

  final String caption;
  final HoronDataTableDevice device;

  @override
  State<_DataTableSample> createState() => _DataTableSampleState();
}

class _DataTableSampleState extends State<_DataTableSample> {
  final List<_Member> _members = <_Member>[
    const _Member(name: 'Aster Labs', seats: 12, active: true),
    const _Member(name: 'Bramble', seats: 4, active: true),
    const _Member(name: 'Cobalt', seats: 28, active: false),
    const _Member(name: 'Dune Works', seats: 7, active: true),
  ];

  late final HoronDataTableController<_Member> _controller;

  @override
  void initState() {
    super.initState();
    // Paper 모바일 보드 `UOD-1`은 체크박스·Tool·Category 세 열만 그리고 숫자 열은
    // 없앱니다(데스크톱 `UI3-1`·태블릿 `UL8-1`은 다섯 열). 그래서 모바일 카드는 숫자
    // 열을 빌더에서 빼고 같은 세 열을 그립니다.
    _controller = HoronDataTableController<_Member>(
      columns: <HoronDataTableColumn<_Member>>[
        HoronDataTableColumn<_Member>(
          id: 'name',
          label: 'Team',
          sortable: true,
          sortValue: (_Member member) => member.name,
          searchValue: (_Member member) => member.name,
          cell: (_Member member) => HoronDataTableItem(
            logo: Text(member.name[0]),
            label: member.name,
          ),
        ),
        if (widget.device != HoronDataTableDevice.mobile)
          HoronDataTableColumn<_Member>(
            id: 'seats',
            label: 'Seats',
            numeric: true,
            sortable: true,
            sortValue: (_Member member) => member.seats,
            cell: (_Member member) => Text('${member.seats}'),
          ),
        HoronDataTableColumn<_Member>(
          id: 'status',
          label: 'Status',
          searchValue: (_Member member) => member.active ? 'Active' : 'Invited',
          cell: (_Member member) => HoronDataTableTag(
            label: member.active ? 'Active' : 'Invited',
            brand: member.active,
          ),
        ),
      ],
      rows: _members,
      selectable: true,
      paginated: true,
      pageSize: 3,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final double gutter = widget.device == HoronDataTableDevice.mobile
        ? space.step(4.5)
        : space.s6;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: space.s2,
      children: <Widget>[
        Text(
          widget.caption,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
        HoronDataTable(
          device: widget.device,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              HoronDataTableHeader(
                icon: const Icon(Icons.groups_outlined),
                title: 'Workspace teams',
                actions: HoronIconButton(
                  size: HoronIconButtonSize.sm,
                  icon: const Icon(Icons.more_horiz),
                  label: 'More actions',
                  onPressed: () {},
                ),
              ),
              Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: gutter,
                  vertical: space.s3,
                ),
                child: HoronDataTableSearch(controller: _controller),
              ),
              HoronDataTableView<_Member>(
                controller: _controller,
                selectColumn: const HoronDataTableSelectColumn(),
              ),
              HoronDataTablePagination<_Member>(controller: _controller),
              HoronDataTableFooter(
                hint: widget.device == HoronDataTableDevice.mobile
                    ? 'Scroll for more'
                    : '${_members.length} teams',
                onAdd: () {
                  setState(() {
                    _members.add(
                      _Member(
                        name: 'New team ${_members.length + 1}',
                        seats: 1,
                        active: false,
                      ),
                    );
                  });
                  _controller.setRows(_members);
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// 표 한 줄의 값입니다.
class _Member {
  const _Member({
    required this.name,
    required this.seats,
    required this.active,
  });

  final String name;
  final int seats;
  final bool active;
}
