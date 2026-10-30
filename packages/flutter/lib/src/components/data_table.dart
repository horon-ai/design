import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'checkbox.dart';
import 'icon_button.dart';
import 'input.dart';

/// `data-table.tsx`의 `device`입니다.
enum HoronDataTableDevice {
  /// `device="desktop"` — 여백 24, 표가 폭에 맞춰집니다.
  desktop,

  /// `device="tablet"` — 여백은 데스크톱과 같습니다(24).
  tablet,

  /// `device="mobile"` — 여백 18, 표 본문이 카드 안에서 가로로 스크롤합니다.
  mobile,
}

/// `h-13` — 머리·본문 셀의 높이입니다(52).
const double _rowHeight = 52;

/// `h-24` — 빈 상태 행의 높이입니다(96).
const double _emptyRowHeight = 96;

/// `w-12` — 선택 열의 너비입니다(48).
const double _selectColumnWidth = 48;

/// `gap-3`/`pr-3` — 셀 사이의 간격입니다(12).
const double _cellGap = 12;

/// `size-6.5` — 머리 아이콘 타일 한 변입니다(26).
const double _headerTileSize = 26;

/// `rounded-[7px]` — 머리 아이콘 타일의 반경입니다. 토큰 단계에 없어 간격 단위로 계산합니다.
const double _headerTileRadiusUnits = 1.75;

/// `[&>svg]:size-4` — 머리 아이콘 크기입니다(16).
const double _headerIconSize = 16;

/// `[&_svg]:size-3.5` — 머리 셀 아이콘과 정렬 화살표 크기입니다(14).
const double _headIconSize = 14;

/// `size-6` — 항목 로고 타일 한 변입니다(24).
const double _itemTileSize = 24;

/// `py-[3px]` — 태그의 세로 여백입니다. 간격 단위 0.75입니다.
const double _tagPaddingYUnits = 0.75;

/// `size-4` — 바닥글 더하기 아이콘 크기입니다(16).
const double _footerIconSize = 16;

/// `h-8` — 검색 필드의 높이입니다(32).
const double _searchHeightUnits = 8;

/// `min-w-max` — 모바일에서 표가 유지하는 최소 폭입니다.
///
/// React는 내용 크기(`min-w-max`)로 두지만, Flutter에는 내용을 재는 표 레이아웃이
/// 없어 같은 목적의 최소 폭을 둡니다. 이 폭보다 좁으면 표가 카드 안에서 가로로
/// 스크롤합니다.
const double _mobileMinTableWidth = 560;

/// `focus-visible:outline-2` — 정렬 머리글의 초점 테두리 두께입니다.
const double _focusRingWidth = 2;

/// `focus-visible:outline-offset-2` — 초점 테두리와 내용 사이의 간격입니다.
const double _focusRingGap = 2;

/// 정렬 상태입니다. React TanStack의 `SortingState` 한 칸입니다.
class HoronDataTableSort {
  /// 정렬 상태를 만듭니다.
  const HoronDataTableSort({this.columnId, this.ascending = true});

  /// 정렬하지 않는 상태입니다.
  static const HoronDataTableSort none = HoronDataTableSort();

  /// 정렬 기준 열의 id입니다. null이면 정렬하지 않습니다(React의 `false`).
  final String? columnId;

  /// 참이면 오름차순, 거짓이면 내림차순입니다.
  final bool ascending;
}

/// 표의 열 하나입니다. React TanStack의 `ColumnDef` 중 화면에 필요한 부분과 같습니다.
class HoronDataTableColumn<T> {
  /// 열을 만듭니다. [sortable]이면 [sortValue]가 있어야 합니다.
  const HoronDataTableColumn({
    required this.id,
    required this.label,
    required this.cell,
    this.sortValue,
    this.searchValue,
    this.sortable = false,
    this.numeric = false,
    this.flex = 1,
    this.icon,
  }) : assert(!sortable || sortValue != null, 'sortable 열은 sortValue가 필요합니다');

  /// 열을 가리키는 키입니다. React `column.id`입니다.
  final String id;

  /// 머리 셀의 글자입니다.
  final String label;

  /// 행 하나를 그리는 빌더입니다. React `cell`입니다.
  final Widget Function(T row) cell;

  /// 정렬에 쓰는 값입니다. React `sortingFn`의 자리이고, [sortable]이면 필수입니다.
  final Comparable<Object?> Function(T row)? sortValue;

  /// 전역 검색에 쓰는 글자입니다. 없으면 [sortValue]의 문자열을 검색합니다.
  ///
  /// React는 셀의 `innerText`를 검색하지만 Flutter 셀은 위젯이라 글자를 읽을 수
  /// 없습니다. 그래서 검색용 값을 열이 직접 줍니다.
  final String Function(T row)? searchValue;

  /// 머리를 눌러 정렬할 수 있는지 여부입니다. React `enableSorting`입니다.
  final bool sortable;

  /// 숫자 열입니다. 참이면 본문 셀을 오른쪽으로 붙입니다.
  final bool numeric;

  /// 폭을 나누는 비율입니다. React는 내용 폭으로 정하지만 Flutter는 비율로 나눕니다.
  final int flex;

  /// 머리 글자 앞의 아이콘입니다. React `meta.icon`입니다.
  final Widget? icon;
}

/// 선택 열의 자리입니다. React `dataTableSelectColumn()`과 같습니다.
///
/// [HoronDataTableView]에 넘기면 머리에는 보이는 행 전체를 고르는 상자가, 각 행에는
/// 그 행을 고르는 상자가 붙습니다. 너비는 React `meta.headClassName: "w-12"`입니다.
class HoronDataTableSelectColumn {
  /// 선택 열을 만듭니다.
  const HoronDataTableSelectColumn();

  /// 열 id입니다. React `id: "select"`입니다.
  static const String id = 'select';
}

/// 표의 상태입니다. React `useDataTable`이 등록하는 정렬·검색·선택·쪽 나눔을 들고 있습니다.
///
/// 정렬은 열을 누를 때마다 오름차순 → 내림차순 → 없음 순서로 돌고, 검색은 대소문자를
/// 가리지 않는 부분 문자열이며, 선택은 지금 쪽의 행을 대상으로 합니다.
class HoronDataTableController<T> extends ChangeNotifier {
  /// 표 상태를 만듭니다.
  HoronDataTableController({
    required List<HoronDataTableColumn<T>> columns,
    required List<T> rows,
    this.selectable = false,
    this.paginated = false,
    this.pageSize = 10,
  }) : assert(pageSize > 0, 'pageSize는 1 이상이어야 합니다'),
       columns = List<HoronDataTableColumn<T>>.unmodifiable(columns),
       _rows = List<T>.of(rows);

  /// 열 목록입니다. React `columns`입니다.
  final List<HoronDataTableColumn<T>> columns;

  /// 행 선택을 쓸지 여부입니다. React `enableRowSelection`입니다.
  final bool selectable;

  /// 쪽 나눔을 쓸지 여부입니다. React는 `pageSize`를 줬을 때만 켜집니다.
  final bool paginated;

  /// 한 쪽의 행 수입니다. React `pageSize`의 기본값과 같습니다(10).
  final int pageSize;

  final List<T> _rows;
  final Set<T> _selected = <T>{};
  HoronDataTableSort _sort = HoronDataTableSort.none;
  String _query = '';
  int _page = 0;

  /// 지금 정렬 상태입니다. 정렬하지 않으면 [HoronDataTableSort.none]입니다.
  HoronDataTableSort get sort => _sort;

  /// 지금 검색어입니다.
  String get query => _query;

  /// 선택된 행입니다. React `rowSelection`입니다.
  Set<T> get selected => Set<T>.unmodifiable(_selected);

  /// 지금 쪽입니다. 0부터 셉니다. React `pageIndex`와 같습니다.
  int get page => _page;

  /// 전체 쪽 수입니다. 쪽 나눔을 쓰지 않으면 1입니다. React `getPageCount()`입니다.
  int get pageCount => paginated ? math.max(1, (filteredRows.length / pageSize).ceil()) : 1;

  /// 검색을 적용한 뒤 쪽 나눔 전까지의 행입니다. React `getFilteredRowModel()`입니다.
  List<T> get filteredRows {
    final String needle = _query.trim().toLowerCase();
    if (needle.isEmpty) return List<T>.of(_rows);
    return <T>[
      for (final T row in _rows)
        if (_matches(row, needle)) row,
    ];
  }

  /// 화면에 실제로 그릴 행입니다. 검색 → 정렬 → 쪽 나눔 순서입니다.
  List<T> get visibleRows {
    List<T> rows = filteredRows;
    final String? columnId = _sort.columnId;
    if (columnId != null) {
      final int index = columns.indexWhere((HoronDataTableColumn<T> column) => column.id == columnId);
      if (index >= 0) {
        final Comparable<Object?> Function(T row)? value = columns[index].sortValue;
        if (value != null) {
          rows = _order(rows, value);
        }
      }
    }
    if (!paginated) return rows;
    final int start = _page * pageSize;
    if (start >= rows.length) return <T>[];
    return rows.sublist(start, math.min(start + pageSize, rows.length));
  }

  /// 보이는 행이 모두 선택됐는지 여부입니다. React `getIsAllPageRowsSelected()`입니다.
  bool get allVisibleSelected {
    final List<T> rows = visibleRows;
    return rows.isNotEmpty && rows.every(_selected.contains);
  }

  /// 보이는 행 중 일부만 선택됐는지 여부입니다. 머리 상자의 부분 선택 상태입니다.
  bool get someVisibleSelected => visibleRows.any(_selected.contains);

  /// 정렬을 한 단계 돌립니다. 오름차순 → 내림차순 → 없음 순서입니다.
  void toggleSort(String columnId) {
    final int index = columns.indexWhere((HoronDataTableColumn<T> column) => column.id == columnId);
    if (index < 0 || !columns[index].sortable) return;
    final HoronDataTableSort current = _sort;
    if (current.columnId != columnId) {
      _sort = HoronDataTableSort(columnId: columnId);
    } else if (current.ascending) {
      _sort = HoronDataTableSort(columnId: columnId, ascending: false);
    } else {
      _sort = HoronDataTableSort.none;
    }
    notifyListeners();
  }

  /// 검색어를 바꿉니다. 쪽은 첫 쪽으로 돌아갑니다. React `setGlobalFilter`입니다.
  void setQuery(String value) {
    if (_query == value) return;
    _query = value;
    _page = 0;
    notifyListeners();
  }

  /// 행 하나의 선택을 바꿉니다. React `row.toggleSelected()`입니다.
  void toggleSelection(T row, bool value) {
    if (!selectable || _selected.contains(row) == value) return;
    if (value) {
      _selected.add(row);
    } else {
      _selected.remove(row);
    }
    notifyListeners();
  }

  /// 보이는 행 전체의 선택을 바꿉니다. React `toggleAllPageRowsSelected()`입니다.
  void toggleAllVisible(bool value) {
    if (!selectable) return;
    for (final T row in visibleRows) {
      if (value) {
        _selected.add(row);
      } else {
        _selected.remove(row);
      }
    }
    notifyListeners();
  }

  /// 쪽을 바꿉니다. 범위를 벗어난 값은 가장 가까운 쪽으로 맞춥니다.
  void setPage(int page) {
    final int last = pageCount - 1;
    final int next = page < 0 ? 0 : (page > last ? last : page);
    if (next == _page) return;
    _page = next;
    notifyListeners();
  }

  /// 행 목록을 갈아 끼웁니다. 사라진 행은 선택에서 빼고 쪽을 범위 안으로 맞춥니다.
  void setRows(List<T> rows) {
    _rows
      ..clear()
      ..addAll(rows);
    _selected.retainWhere(_rows.contains);
    final int last = pageCount - 1;
    if (_page > last) _page = last < 0 ? 0 : last;
    notifyListeners();
  }

  bool _matches(T row, String needle) {
    for (final HoronDataTableColumn<T> column in columns) {
      final String Function(T row)? search = column.searchValue;
      String? text = search?.call(row);
      if (text == null) {
        final Comparable<Object?>? value = column.sortValue?.call(row);
        text = value?.toString();
      }
      if (text != null && text.toLowerCase().contains(needle)) return true;
    }
    return false;
  }

  /// 같은 순서를 지키도록 원래 자리를 함께 들고 정렬합니다. Dart의 `sort`는 안정적이지 않습니다.
  List<T> _order(List<T> rows, Comparable<Object?> Function(T row) value) {
    final List<(int, T)> decorated = <(int, T)>[for (int index = 0; index < rows.length; index++) (index, rows[index])];
    decorated.sort(((int, T) a, (int, T) b) {
      final int compared = _compare(value(a.$2), value(b.$2));
      if (compared == 0) return a.$1.compareTo(b.$1);
      return _sort.ascending ? compared : -compared;
    });
    return <T>[for (final (int, T) entry in decorated) entry.$2];
  }

  /// 값 두 개를 비교합니다. 타입이 다르면 문자열로 비교합니다.
  int _compare(Object? a, Object? b) {
    if (a is Comparable<Object?> && b is Comparable<Object?> && a.runtimeType == b.runtimeType) {
      return a.compareTo(b);
    }
    return (a?.toString() ?? '').compareTo(b?.toString() ?? '');
  }
}

/// Figma `Data table`(Table 192:9046)입니다.
///
/// 20px 반경, 1px 기본 테두리의 불투명 카드입니다. [device]를 비우면 폭으로 정합니다:
/// 1024 이상 데스크톱, 768 이상 태블릿, 그 아래는 모바일입니다. 여백은 데스크톱·태블릿
/// 24px, 모바일 18px입니다.
class HoronDataTable extends StatelessWidget {
  /// 표 카드를 만듭니다.
  const HoronDataTable({super.key, this.device, required this.child});

  /// React `device`입니다. 비우면 폭에서 정합니다.
  final HoronDataTableDevice? device;

  /// 카드 안에 쌓을 내용입니다(머리·검색·표·쪽 나눔·바닥글).
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final HoronDataTableDevice device = this.device ?? _deviceForWidth(constraints.maxWidth, theme.breakpoints);
        return _DataTableDeviceScope(
          device: device,
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: theme.colors.bgSurface, // bg-bg-surface
              borderRadius: radius, // rounded-xl
              border: Border.all(color: theme.colors.borderDefault), // border-border-default
            ),
            // `overflow-clip`은 카드 밖으로 표가 새지 않게 자릅니다.
            child: ClipRRect(borderRadius: radius, child: child),
          ),
        );
      },
    );
  }
}

/// Figma `Data table`의 머리입니다.
///
/// 26px 브랜드 타일 위 16px 아이콘, `text-label-lg` 제목, 오른쪽 16px 아이콘 버튼을
/// 놓습니다. 좁은 폭에서는 동작 버튼이 다음 줄로 내려갑니다.
class HoronDataTableHeader extends StatelessWidget {
  /// 머리를 만듭니다.
  const HoronDataTableHeader({super.key, this.icon, required this.title, this.actions});

  /// 브랜드 타일 위에 그릴 아이콘입니다.
  final Widget? icon;

  /// 제목입니다. 한 줄로 자릅니다.
  final String title;

  /// 오른쪽에 놓을 동작입니다(보통 [HoronIconButton] 묶음).
  final Widget? actions;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final double gutter = _gutterFor(_DataTableDeviceScope.of(context), space);
    final Widget? tile = icon == null
        ? null
        : Container(
            width: _headerTileSize, // size-6.5
            height: _headerTileSize,
            decoration: BoxDecoration(
              color: colors.bgBrand, // bg-bg-brand
              borderRadius: BorderRadius.circular(space.step(_headerTileRadiusUnits)), // rounded-[7px]
            ),
            child: Center(
              child: IconTheme.merge(
                data: IconThemeData(size: _headerIconSize, color: colors.textBrand),
                child: icon!,
              ),
            ),
          );

    final Widget heading = Row(
      spacing: space.s3, // gap-3
      children: <Widget>[
        ?tile,
        Expanded(
          child: Text(
            title,
            style: theme.text.labelLg.copyWith(color: colors.textPrimary), // text-label-lg
            maxLines: 1, // truncate
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );

    final Widget? actionsRow = actions == null
        ? null
        : IconTheme.merge(
            // `[&_svg]:size-4`
            data: IconThemeData(size: _headerIconSize, color: colors.textSecondary),
            child: actions!,
          );

    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: gutter, // px-6 / group-data-[device=mobile]:px-4.5
        vertical: space.step(4.5), // py-4.5 = 18
      ),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final bool stacked = actionsRow != null && constraints.maxWidth < theme.breakpoints.sm;
          if (stacked) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: space.s3,
              children: <Widget>[heading, actionsRow],
            );
          }
          return Row(
            children: <Widget>[
              Expanded(child: heading),
              if (actionsRow != null) ...[SizedBox(width: space.s3), actionsRow],
            ],
          );
        },
      ),
    );
  }
}

/// Figma `Data table`의 머리 셀입니다.
///
/// 높이 52px, `text-label-md` 보조 글자입니다. [sortable]이면 정렬 단추가 되고, 지금
/// 방향에 따라 위·아래 화살표나 흐린 양방향 화살표를 그립니다.
class HoronDataTableHead extends StatelessWidget {
  /// 머리 셀을 만듭니다.
  const HoronDataTableHead({
    super.key,
    required this.child,
    this.icon,
    this.sortable = false,
    this.ascending = false,
    this.descending = false,
    this.onPressed,
    this.alignEnd = false,
  });

  /// 셀의 내용입니다.
  final Widget child;

  /// 글자 앞의 14px 아이콘입니다.
  final Widget? icon;

  /// 정렬 단추로 그릴지 여부입니다.
  final bool sortable;

  /// 지금 오름차순으로 정렬된 열입니다.
  final bool ascending;

  /// 지금 내림차순으로 정렬된 열입니다.
  final bool descending;

  /// 정렬 단추를 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onPressed;

  /// 숫자 열이면 오른쪽으로 붙입니다.
  final bool alignEnd;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final TextStyle style = theme.text.labelMd.copyWith(color: colors.textSecondary); // text-label-md

    final Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: space.s2, // gap-2
      children: <Widget>[
        if (icon != null)
          IconTheme.merge(
            data: IconThemeData(size: _headIconSize, color: colors.textSecondary),
            child: icon!,
          ),
        Flexible(
          child: DefaultTextStyle.merge(
            style: style,
            maxLines: 1, // whitespace-nowrap
            overflow: TextOverflow.ellipsis,
            child: child,
          ),
        ),
        if (sortable) _SortCaret(ascending: ascending, descending: descending, colors: colors),
      ],
    );

    final Widget aligned = alignEnd ? Align(alignment: Alignment.centerRight, child: content) : content;
    final Widget single = sortable && onPressed != null ? _SortButton(onPressed: onPressed!, child: aligned) : aligned;

    return SizedBox(height: _rowHeight, child: single); // h-13
  }
}

/// Figma `Data table`의 본문 행입니다.
///
/// 높이 52px, 아래 테두리, 포인터가 있으면 `hover:bg-overlay-ink-3`가 깔립니다.
/// [cells]의 각 항목은 행 안에서 폭을 나눠야 하므로 [HoronDataTableCell]처럼
/// `Expanded`로 감싼 위젯을 넘깁니다.
class HoronDataTableRow extends StatefulWidget {
  /// 행을 만듭니다.
  const HoronDataTableRow({super.key, required this.cells, this.selected = false});

  /// 행의 셀입니다.
  final List<Widget> cells;

  /// 선택된 행인지 여부입니다. 접근성 상태로만 쓰입니다.
  final bool selected;

  @override
  State<HoronDataTableRow> createState() => _HoronDataTableRowState();
}

class _HoronDataTableRowState extends State<HoronDataTableRow> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final double gutter = _gutterFor(_DataTableDeviceScope.of(context), space);
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      selected: widget.selected,
      child: MouseRegion(
        onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
        onExit: (PointerExitEvent event) => setState(() => _hovered = false),
        child: AnimatedContainer(
          duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration, // motion-colors
          curve: HoronMotion.colorsCurve,
          height: _rowHeight, // h-13
          padding: EdgeInsets.symmetric(horizontal: gutter), // first:pl-6 last:pr-6
          decoration: BoxDecoration(
            color: _hovered ? colors.overlayInk3 : Colors.transparent, // hover:bg-overlay-ink-3
            border: Border(bottom: BorderSide(color: colors.borderDefault)), // border-b
          ),
          child: Row(spacing: _cellGap, children: widget.cells),
        ),
      ),
    );
  }
}

/// Figma `Data table`의 본문 셀입니다.
///
/// 높이 52px, `text-body-sm` 보조 글자가 기본입니다. 안쪽 위젯이 자기 글자 색을
/// 정하면 그 색이 이깁니다.
class HoronDataTableCell extends StatelessWidget {
  /// 본문 셀을 만듭니다.
  const HoronDataTableCell({super.key, required this.child, this.alignEnd = false});

  /// 셀의 내용입니다.
  final Widget child;

  /// 숫자 열이면 오른쪽으로 붙입니다.
  final bool alignEnd;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final Widget styled = DefaultTextStyle.merge(
      style: theme.text.bodySm.copyWith(color: theme.colors.textSecondary), // text-body-sm
      maxLines: 1, // whitespace-nowrap
      overflow: TextOverflow.ellipsis,
      child: child,
    );
    return alignEnd ? Align(alignment: Alignment.centerRight, child: styled) : styled;
  }
}

/// Figma `Data table`의 항목 셀입니다.
///
/// 24px 잉크 타일 위 `text-label-sm` 로고, 옆에 `text-label-lg` 이름을 놓습니다.
class HoronDataTableItem extends StatelessWidget {
  /// 항목을 만듭니다.
  const HoronDataTableItem({super.key, required this.logo, required this.label});

  /// 잉크 타일 안에 그릴 로고입니다(보통 짧은 글자).
  final Widget logo;

  /// 항목 이름입니다. 한 줄로 자릅니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: space.s2_5, // gap-2.5
      children: <Widget>[
        Container(
          width: _itemTileSize, // size-6
          height: _itemTileSize,
          decoration: BoxDecoration(
            color: colors.surfaceInk, // bg-surface-ink
            borderRadius: BorderRadius.circular(theme.radius.xs), // rounded-xs
          ),
          child: Center(
            child: DefaultTextStyle.merge(
              style: theme.text.labelSm.copyWith(color: colors.textOnInk), // text-label-sm
              child: IconTheme.merge(
                data: IconThemeData(size: _headIconSize, color: colors.textOnInk),
                child: logo,
              ),
            ),
          ),
        ),
        Flexible(
          child: Text(
            label,
            style: theme.text.labelLg.copyWith(color: colors.textPrimary), // text-label-lg
            maxLines: 1, // truncate
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}

/// Figma `Table tag`입니다.
///
/// [brand]가 참이면 하늘색 바탕의 브랜드 태그, 거짓이면 옅은 회색 바탕의 중립
/// 태그입니다. React는 `tone: "brand" | "neutral"` 인라인 유니온이라 enum을 만들지
/// 않고 플래그로 받습니다.
class HoronDataTableTag extends StatelessWidget {
  /// 태그를 만듭니다.
  const HoronDataTableTag({super.key, required this.label, this.brand = true});

  /// 태그 글자입니다.
  final String label;

  /// 참이면 `tone="brand"`, 거짓이면 `tone="neutral"`입니다.
  final bool brand;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: space.s2_5, // px-2.5
        vertical: space.step(_tagPaddingYUnits), // py-[3px]
      ),
      decoration: BoxDecoration(
        color: brand ? colors.bgBrand : colors.bgSubtle, // bg-bg-brand / bg-bg-subtle
        borderRadius: BorderRadius.circular(theme.radius.sm), // rounded-sm
      ),
      child: Text(
        label,
        style: theme.text.labelMd.copyWith(color: brand ? colors.textBrand : colors.textSecondary),
        maxLines: 1,
      ),
    );
  }
}

/// Figma `Data table`의 바닥글입니다.
///
/// 왼쪽에 16px 더하기와 "Add row", 오른쪽에 `text-caption` 힌트를 놓습니다. 좁은
/// 폭에서는 힌트가 다음 줄로 내려갑니다.
class HoronDataTableFooter extends StatelessWidget {
  /// 바닥글을 만듭니다.
  const HoronDataTableFooter({super.key, this.onAdd, this.addLabel = 'Add row', this.hint});

  /// 더하기를 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onAdd;

  /// 더하기 옆 글자입니다.
  final String addLabel;

  /// 오른쪽 힌트입니다.
  final String? hint;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final double gutter = _gutterFor(_DataTableDeviceScope.of(context), space);

    final Widget addButton = Semantics(
      button: true,
      enabled: onAdd != null,
      child: MouseRegion(
        cursor: onAdd == null ? SystemMouseCursors.basic : SystemMouseCursors.click,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onAdd,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: space.s2, // gap-2
            children: <Widget>[
              Icon(Icons.add, size: _footerIconSize, color: colors.textSecondary), // size-4
              Flexible(
                child: Text(
                  addLabel,
                  style: theme.text.labelMd.copyWith(color: colors.textSecondary), // text-label-md
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );

    final Widget? hintText = hint == null
        ? null
        : Text(
            hint!,
            style: theme.text.caption.copyWith(color: colors.textSecondary), // text-caption
          );

    return Padding(
      padding: EdgeInsets.only(
        left: gutter, // px-6
        right: gutter,
        top: space.s3_5, // pt-3.5 = 14
        bottom: space.s4, // pb-4 = 16
      ),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          if (hintText != null && constraints.maxWidth < theme.breakpoints.sm) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: space.s2,
              children: <Widget>[addButton, hintText],
            );
          }
          return Row(
            spacing: space.s2, // gap-2
            children: <Widget>[
              Expanded(child: addButton), // flex-1 min-w-0
              ?hintText, // shrink-0
            ],
          );
        },
      ),
    );
  }
}

/// `useDataTable`의 표를 그립니다. React `DataTableView`입니다.
///
/// 머리 셀은 정렬할 수 있고, 본문 행은 포인터가 있으면 옅은 잉크로 반응합니다.
/// 모바일 폭에서는 표 본문이 카드 안에서 가로로 스크롤합니다(React `overflow-x-auto`
/// + `min-w-max`). 이 스크롤은 표 본문에만 있고 조작 요소에는 없습니다.
class HoronDataTableView<T> extends StatelessWidget {
  /// 표를 그립니다.
  const HoronDataTableView({super.key, required this.controller, this.selectColumn, this.emptyMessage = 'No results.'});

  /// 그릴 상태입니다.
  final HoronDataTableController<T> controller;

  /// 앞에 붙일 선택 열입니다. 비우면 선택 열이 없습니다.
  final HoronDataTableSelectColumn? selectColumn;

  /// 행이 하나도 없을 때 보이는 글자입니다.
  final String emptyMessage;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final HoronDataTableDevice device = _DataTableDeviceScope.of(context);
    final double gutter = _gutterFor(device, space);

    return ListenableBuilder(
      listenable: controller,
      builder: (BuildContext context, Widget? child) {
        final List<T> rows = controller.visibleRows;

        final Widget headRow = Container(
          height: _rowHeight, // h-13
          padding: EdgeInsets.symmetric(horizontal: gutter),
          decoration: BoxDecoration(
            // border-y border-border-default
            border: Border(
              top: BorderSide(color: colors.borderDefault),
              bottom: BorderSide(color: colors.borderDefault),
            ),
          ),
          child: Row(
            spacing: _cellGap,
            children: <Widget>[
              if (selectColumn != null)
                SizedBox(
                  width: _selectColumnWidth, // w-12
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Semantics(
                      label: 'Select all rows',
                      child: HoronCheckbox(
                        small: true,
                        value: controller.allVisibleSelected ? true : (controller.someVisibleSelected ? null : false),
                        onChanged: (bool? value) => controller.toggleAllVisible(value ?? false),
                      ),
                    ),
                  ),
                ),
              for (final HoronDataTableColumn<T> column in controller.columns)
                Expanded(
                  flex: column.flex,
                  child: HoronDataTableHead(
                    icon: column.icon,
                    alignEnd: column.numeric,
                    sortable: column.sortable,
                    ascending: controller.sort.columnId == column.id && controller.sort.ascending,
                    descending: controller.sort.columnId == column.id && !controller.sort.ascending,
                    onPressed: column.sortable ? () => controller.toggleSort(column.id) : null,
                    child: Text(column.label),
                  ),
                ),
            ],
          ),
        );

        final Widget body = rows.isEmpty
            ? _EmptyRow(message: emptyMessage, gutter: gutter, height: _emptyRowHeight)
            : Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  for (int index = 0; index < rows.length; index++)
                    HoronDataTableRow(
                      selected: controller.selected.contains(rows[index]),
                      cells: <Widget>[
                        if (selectColumn != null)
                          SizedBox(
                            width: _selectColumnWidth,
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: Semantics(
                                label: 'Select row ${index + 1}',
                                child: HoronCheckbox(
                                  small: true,
                                  value: controller.selected.contains(rows[index]),
                                  onChanged: (bool? value) => controller.toggleSelection(rows[index], value ?? false),
                                ),
                              ),
                            ),
                          ),
                        for (final HoronDataTableColumn<T> column in controller.columns)
                          Expanded(
                            flex: column.flex,
                            child: HoronDataTableCell(alignEnd: column.numeric, child: column.cell(rows[index])),
                          ),
                      ],
                    ),
                ],
              );

        final Widget table = Column(mainAxisSize: MainAxisSize.min, children: <Widget>[headRow, body]);

        return LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            if (device != HoronDataTableDevice.mobile) return table;
            // group-data-[device=mobile]:min-w-max — 내용 폭을 유지한 채 카드 안에서
            // 가로로 스크롤합니다. 표 본문 밖(조작 요소)에는 가로 스크롤이 없습니다.
            return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: SizedBox(width: math.max(constraints.maxWidth, _mobileMinTableWidth), child: table),
            );
          },
        );
      },
    );
  }
}

/// `DataTableSearch`입니다. 전역 검색어에 묶인 불투명 검색 필드입니다.
class HoronDataTableSearch extends StatefulWidget {
  /// 검색 필드를 만듭니다.
  const HoronDataTableSearch({super.key, required this.controller, this.placeholder = 'Search'});

  /// 검색어를 들고 있는 표 상태입니다.
  final HoronDataTableController<dynamic> controller;

  /// 값이 없을 때 보이는 안내 문구입니다.
  final String placeholder;

  @override
  State<HoronDataTableSearch> createState() => _HoronDataTableSearchState();
}

class _HoronDataTableSearchState extends State<HoronDataTableSearch> {
  late final TextEditingController _text = TextEditingController(text: widget.controller.query);

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_sync);
  }

  @override
  void didUpdateWidget(HoronDataTableSearch oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller.removeListener(_sync);
      widget.controller.addListener(_sync);
      _sync();
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_sync);
    _text.dispose();
    super.dispose();
  }

  /// 바깥에서 검색어를 비우면 입력칸도 따라갑니다.
  void _sync() {
    final String query = widget.controller.query;
    if (_text.text == query) return;
    _text.value = TextEditingValue(
      text: query,
      selection: TextSelection.collapsed(offset: query.length),
    );
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      height: theme.space.step(_searchHeightUnits), // h-8 = 32
      child: HoronInput(
        size: HoronInputSize.md,
        surface: HoronInputSurface.solid, // surface="solid"
        icon: const Icon(Icons.search),
        hintText: widget.placeholder,
        semanticLabel: widget.placeholder,
        controller: _text,
        onChanged: widget.controller.setQuery,
      ),
    );
  }
}

/// `DataTablePagination`입니다.
///
/// 왼쪽에 행 수(선택이 있으면 선택 수), 오른쪽에 이전·다음 쪽 버튼과 현재 쪽을
/// 놓습니다. 좁은 폭에서는 두 묶음이 다음 줄로 나뉩니다.
class HoronDataTablePagination<T> extends StatelessWidget {
  /// 쪽 나눔 줄을 만듭니다.
  const HoronDataTablePagination({super.key, required this.controller});

  /// 쪽 상태를 들고 있는 표 상태입니다.
  final HoronDataTableController<T> controller;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final double gutter = _gutterFor(_DataTableDeviceScope.of(context), space);
    final TextStyle caption = theme.text.caption.copyWith(
      color: colors.textSecondary, // text-caption text-text-secondary
      fontFeatures: const <FontFeature>[FontFeature.tabularFigures()], // tabular-nums
    );

    return ListenableBuilder(
      listenable: controller,
      builder: (BuildContext context, Widget? child) {
        final Set<T> selected = controller.selected;
        final int total = controller.filteredRows.length;
        final int selectedCount = controller.filteredRows.where(selected.contains).length;
        final String count = selectedCount > 0
            ? '$selectedCount of $total selected'
            : '$total ${total == 1 ? 'row' : 'rows'}';
        final int pages = controller.pageCount;

        return Padding(
          padding: EdgeInsets.symmetric(
            horizontal: gutter, // px-6 / group-data-[device=mobile]:px-4.5
            vertical: space.s3, // py-3 = 12
          ),
          child: Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: space.s4, // gap-4
            runSpacing: space.s2,
            children: <Widget>[
              Text(count, style: caption),
              Row(
                mainAxisSize: MainAxisSize.min,
                spacing: space.s2, // gap-2
                children: <Widget>[
                  HoronIconButton(
                    size: HoronIconButtonSize.sm,
                    icon: const Icon(Icons.chevron_left),
                    label: 'Previous page',
                    enabled: controller.page > 0,
                    onPressed: () => controller.setPage(controller.page - 1),
                  ),
                  Text('Page ${controller.page + 1} of $pages', style: caption),
                  HoronIconButton(
                    size: HoronIconButtonSize.sm,
                    icon: const Icon(Icons.chevron_right),
                    label: 'Next page',
                    enabled: controller.page < pages - 1,
                    onPressed: () => controller.setPage(controller.page + 1),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

/// 표 카드의 기기 값을 자손에게 내려 줍니다. React `group-data-[device=…]`의 자리입니다.
class _DataTableDeviceScope extends InheritedWidget {
  const _DataTableDeviceScope({required this.device, required super.child});

  final HoronDataTableDevice device;

  @override
  bool updateShouldNotify(_DataTableDeviceScope oldWidget) => oldWidget.device != device;

  static HoronDataTableDevice of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_DataTableDeviceScope>()?.device ?? HoronDataTableDevice.desktop;
}

/// 사용할 수 있는 폭으로 기기를 정합니다. [HoronBreakpoint.lg] 이상이 데스크톱입니다.
HoronDataTableDevice _deviceForWidth(double width, HoronBreakpoints breakpoints) {
  if (width >= breakpoints.lg) return HoronDataTableDevice.desktop;
  if (width >= breakpoints.md) return HoronDataTableDevice.tablet;
  return HoronDataTableDevice.mobile;
}

/// 카드 가장자리 여백입니다. 모바일은 `px-4.5`(18), 나머지는 `px-6`(24)입니다.
double _gutterFor(HoronDataTableDevice device, HoronSpaceSpec space) =>
    device == HoronDataTableDevice.mobile ? space.step(4.5) : space.s6;

/// 정렬 단추입니다. `-mx-1 rounded-xs px-1`에 초점 테두리를 그립니다.
class _SortButton extends StatefulWidget {
  const _SortButton({required this.onPressed, required this.child});

  final VoidCallback onPressed;
  final Widget child;

  @override
  State<_SortButton> createState() => _SortButtonState();
}

class _SortButtonState extends State<_SortButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    final Widget button = MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
      onExit: (PointerExitEvent event) => setState(() => _hovered = false),
      child: FocusableActionDetector(
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.onPressed,
          child: DefaultTextStyle.merge(
            // hover:text-text-primary
            style: theme.text.labelMd.copyWith(color: _hovered ? colors.textPrimary : colors.textSecondary),
            child: widget.child,
          ),
        ),
      ),
    );

    if (!_focused) return button;
    // focus-visible:outline-2 outline-offset-2 outline-text-brand
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -_focusRingGap,
          top: -_focusRingGap,
          right: -_focusRingGap,
          bottom: -_focusRingGap,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(theme.radius.xs + space.s0_5),
                border: Border.all(color: colors.textBrand, width: _focusRingWidth),
              ),
            ),
          ),
        ),
        button,
      ],
    );
  }
}

/// 정렬 방향 화살표입니다. React `CaretUp`·`CaretDown`·`CaretUpDown`의 자리입니다.
class _SortCaret extends StatelessWidget {
  const _SortCaret({required this.ascending, required this.descending, required this.colors});

  final bool ascending;
  final bool descending;
  final HoronColors colors;

  @override
  Widget build(BuildContext context) {
    if (ascending) {
      return Icon(Icons.arrow_drop_up, size: _headIconSize, color: colors.textSecondary);
    }
    if (descending) {
      return Icon(Icons.arrow_drop_down, size: _headIconSize, color: colors.textSecondary);
    }
    return Opacity(
      opacity: 0.6, // opacity-60
      child: Icon(Icons.unfold_more, size: _headIconSize, color: colors.textSecondary),
    );
  }
}

/// 빈 상태 행입니다. `h-24 text-center`로 안내 문구를 가운데 둡니다.
class _EmptyRow extends StatelessWidget {
  const _EmptyRow({required this.message, required this.gutter, required this.height});

  final String message;
  final double gutter;
  final double height;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      height: height,
      padding: EdgeInsets.symmetric(horizontal: gutter),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: theme.colors.borderDefault)),
      ),
      child: Center(
        child: DefaultTextStyle.merge(
          style: theme.text.bodySm.copyWith(color: theme.colors.textSecondary),
          child: Text(message, textAlign: TextAlign.center),
        ),
      ),
    );
  }
}
