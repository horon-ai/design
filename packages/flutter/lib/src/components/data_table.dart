import 'package:flutter/material.dart';

import '../contracts/horon_strings.dart';
import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';

/// `table.tsx`의 `text-[13px]`입니다. 이 표는 `table` 컴포넌트와 같은 크기로 그리므로
/// 생성 스케일의 12와 14 사이 값인 13을 그대로 씁니다.
const double _dataTableFontSize = 13.0;

/// `table.tsx`의 `h-10`입니다. 머리 행의 높이입니다.
const double _dataTableHeadHeight = HoronSpace.s10;

/// `table.tsx`의 `px-4`입니다.
const double _dataTableHorizontalPadding = HoronSpace.s4;

/// `table.tsx`의 `py-3`입니다.
const double _dataTableVerticalPadding = HoronSpace.s3;

/// `table.tsx`의 `bg-muted/40`입니다.
const double _dataTableHeadFillAlpha = 0.4;

/// `table.tsx`의 `border-b`가 그리는 선 두께입니다.
const double _dataTableBorderWidth = 1.0;

/// `data-table.tsx`의 `gap-1.5`입니다. 머리 글자와 정렬 아이콘 사이 간격입니다.
const double _dataTableSortGap = HoronSpace.s1_5;

/// `data-table.tsx`의 `size-3.5`입니다. 정렬 아이콘의 한 변입니다.
const double _dataTableSortIconSize = HoronSpace.s3_5;

/// 정렬하지 않은 머리 아이콘의 불투명도입니다(`opacity-60`).
const double _dataTableSortIdleOpacity = 0.6;

/// `data-table.tsx`의 `h-24`입니다. 빈 상태 칸의 높이입니다.
const double _dataTableEmptyHeight = HoronSpace.s24;

/// `data-table.tsx`의 `gap-3`입니다. 표와 페이지 줄 사이 간격입니다.
const double _dataTableGap = HoronSpace.s3;

/// `data-table.tsx`의 `gap-4`입니다. 행 수와 페이지 컨트롤 사이 간격입니다.
const double _dataTablePaginationGap = HoronSpace.s4;

/// `data-table.tsx`의 `gap-2`입니다. 페이지 컨트롤 안의 간격입니다.
const double _dataTableControlGap = HoronSpace.s2;

/// `data-table.tsx`의 `focus-visible:ring-3 ring-ring/50`입니다. 정렬 버튼이 포커스를
/// 받을 때 그리는 링 두께입니다.
const double _dataTableFocusRingWidth = 3.0;

/// 그 링의 불투명도입니다(`ring-ring/50`).
const double _dataTableFocusRingAlpha = 0.5;

/// 정렬 방향입니다.
///
/// React는 TanStack의 `"asc" | "desc"` 문자열을 쓰고 정렬하지 않은 상태는 `false`입니다.
/// 여기서는 두 값만 두고, 정렬하지 않은 상태는 `null`로 적습니다.
enum HoronDataTableSortDirection {
  /// 오름차순입니다.
  asc,

  /// 내림차순입니다.
  desc,
}

/// `data-table.tsx`의 `DataTableColumn`입니다.
///
/// React의 `ColumnDef`가 받는 것 중 이 컴포넌트가 쓰는 것은 넷입니다. `header`는 머리
/// 글자, `accessorKey`/`accessorFn`은 칸의 값, `cell`은 그 값을 대신 그리는 렌더러,
/// `enableSorting`은 정렬 가능 여부입니다. Flutter에는 키로 접근하는 행 타입이 없으므로
/// 접근자는 함수 [value]로 받습니다.
///
/// ```dart
/// HoronDataTableColumn<Person>(
///   id: 'name',
///   header: '이름',
///   value: (Person person) => person.name,
/// );
/// ```
class HoronDataTableColumn<T> {
  /// 열 하나를 정의합니다.
  ///
  /// [value]나 [cell] 중 하나는 있어야 합니다. [value]가 없으면 [cell]만 그리고,
  /// 그 열은 [comparator] 없이는 정렬할 수 없습니다.
  const HoronDataTableColumn({
    required this.id,
    required this.header,
    this.value,
    this.cell,
    this.sortable = true,
    this.comparator,
  }) : assert(value != null || cell != null, 'HoronDataTableColumn needs a value accessor or a cell builder.');

  /// 열의 식별자입니다. React의 `column.id` 자리이고, 정렬 상태를 이 값으로 기억합니다.
  final String id;

  /// 머리에 보이는 글자입니다.
  final String header;

  /// 한 행에서 이 열이 보여 줄 값입니다. 정렬은 이 값을 비교합니다.
  final Object? Function(T row)? value;

  /// [value] 대신 그릴 위젯입니다. React의 `cell` 렌더러 자리입니다.
  final Widget Function(T row)? cell;

  /// 정렬할 수 있는 열인지 여부입니다. React의 `enableSorting`에 해당합니다.
  final bool sortable;

  /// 두 행을 비교하는 함수입니다. 없으면 [value]의 타입에 맞춰 비교합니다.
  final int Function(T a, T b)? comparator;
}

/// 정렬과 페이지 처리가 붙은 표입니다.
///
/// `data-table.tsx`를 옮긴 것입니다. React는 TanStack Table에 `rowSortingFeature`와
/// `rowPaginationFeature`를 얹고, 머리를 누르면 오름차순 → 내림차순 → 없음 순서로 정렬을
/// 바꿉니다. 이 위젯은 그 두 기능을 Dart로 직접 구현합니다. JS 표 라이브러리를 흉내 내지
/// 않고, 정렬은 [List.sort]로, 페이지는 정렬한 목록을 잘라 그립니다.
///
/// 표의 모양은 `table.tsx`와 같습니다. 칸 여백 `px-4 py-3`, 머리 높이 `h-10`, 머리 배경
/// `bg-muted/40`, 행마다 아래 테두리, 마지막 행은 테두리 없음, 바깥은 `rounded-md border
/// bg-card`입니다. 다만 React의 빈 상태는 `colSpan`으로 표 폭 전체를 차지하는 행인데
/// Flutter의 [Table]에는 `colSpan`이 없습니다. 그래서 빈 상태는 같은 테두리 상자 안에서
/// 표 아래에 폭 전체 상자로 그립니다. 보이는 결과는 같습니다.
///
/// 문구는 [HoronStrings]에서 읽습니다. 이전·다음은 `strings.previousPage`/`nextPage`,
/// 빈 상태는 `strings.noResults`가 그 자리입니다. React가 직접 짓는 `N row(s)`와
/// `Page X of Y`는 문자열 계약에 슬롯이 없으므로 [rowCountLabel]·[pageStatusLabel]로
/// 열어 두고, 넘기지 않으면 React와 같은 문장을 씁니다.
///
/// ```dart
/// HoronDataTable<Person>(
///   columns: <HoronDataTableColumn<Person>>[
///     HoronDataTableColumn<Person>(id: 'name', header: '이름', value: (Person p) => p.name),
///     HoronDataTableColumn<Person>(id: 'amount', header: '금액', value: (Person p) => p.amount),
///   ],
///   data: people,
///   pageSize: 5,
/// );
/// ```
class HoronDataTable<T> extends StatefulWidget {
  /// 표 하나를 만듭니다.
  const HoronDataTable({
    super.key,
    required this.columns,
    required this.data,
    this.pageSize = 10,
    this.emptyMessage,
    this.rowCountLabel,
    this.pageStatusLabel,
    this.onSortChanged,
    this.initialSortColumnId,
    this.initialSortDirection,
    this.semanticLabel,
  }) : assert(pageSize > 0, 'pageSize must be at least 1.');

  /// 이전 페이지 버튼을 찾는 키입니다.
  static const Key previousKey = ValueKey<String>('horon-data-table-previous');

  /// 다음 페이지 버튼을 찾는 키입니다.
  static const Key nextKey = ValueKey<String>('horon-data-table-next');

  /// 페이지 상태 글자를 찾는 키입니다.
  static const Key pageStatusKey = ValueKey<String>('horon-data-table-page-status');

  /// 행 수 글자를 찾는 키입니다.
  static const Key rowCountKey = ValueKey<String>('horon-data-table-row-count');

  /// 빈 상태 칸을 찾는 키입니다.
  static const Key emptyKey = ValueKey<String>('horon-data-table-empty');

  /// [columnId] 열의 정렬 버튼을 찾는 키입니다. React의 `data-slot="data-table-sort"`
  /// 자리입니다.
  static Key sortKey(String columnId) => ValueKey<String>('horon-data-table-sort-$columnId');

  /// [columnId] 열의 정렬 표시를 찾는 키입니다.
  static Key sortIndicatorKey(String columnId) => ValueKey<String>('horon-data-table-sort-indicator-$columnId');

  /// [rowCount]개의 행을 [pageSize]로 나눈 페이지 수입니다. 행이 없어도 1입니다.
  ///
  /// React는 `Math.max(table.getPageCount(), 1)`로 같은 값을 만듭니다.
  static int pageCountFor(int rowCount, int pageSize) {
    assert(pageSize > 0, 'pageSize must be at least 1.');
    if (rowCount <= 0) return 1;
    return (rowCount + pageSize - 1) ~/ pageSize;
  }

  /// 열 정의입니다.
  final List<HoronDataTableColumn<T>> columns;

  /// 표에 넣을 행들입니다. 정렬과 페이지 처리는 이 위젯이 합니다.
  final List<T> data;

  /// 한 페이지에 보여 줄 행 수입니다. React의 기본값과 같은 10입니다.
  final int pageSize;

  /// 보여 줄 행이 없을 때의 문구입니다. 없으면 `strings.noResults`입니다.
  final String? emptyMessage;

  /// 행 수 문구를 만드는 함수입니다. React는 `N row(s)`를 그립니다.
  final String Function(int rowCount)? rowCountLabel;

  /// 페이지 상태 문구를 만드는 함수입니다. React는 `Page X of Y`를 그립니다.
  final String Function(int page, int pageCount)? pageStatusLabel;

  /// 정렬이 바뀌면 부르는 콜백입니다. 열 id와 방향을 넘기고, 정렬이 풀리면 둘 다
  /// null입니다.
  final void Function(String? columnId, HoronDataTableSortDirection? direction)? onSortChanged;

  /// 처음 그릴 때 정렬할 열의 id입니다. React의 `initialState.sorting` 자리입니다.
  final String? initialSortColumnId;

  /// 처음 그릴 때의 정렬 방향입니다. [initialSortColumnId]가 있어야 쓰입니다.
  final HoronDataTableSortDirection? initialSortDirection;

  /// 표의 접근성 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDataTable<T>> createState() => _HoronDataTableState<T>();
}

class _HoronDataTableState<T> extends State<HoronDataTable<T>> {
  String? _sortColumnId;
  HoronDataTableSortDirection? _sortDirection;
  int _page = 0;

  @override
  void initState() {
    super.initState();
    _sortColumnId = widget.initialSortColumnId;
    _sortDirection = widget.initialSortColumnId == null ? null : widget.initialSortDirection;
  }

  HoronDataTableColumn<T>? get _sortColumn {
    final String? id = _sortColumnId;
    if (id == null) return null;
    for (final HoronDataTableColumn<T> column in widget.columns) {
      if (column.id == id) return column;
    }
    return null;
  }

  /// 오름차순 → 내림차순 → 없음 순서로 정렬을 바꿉니다.
  ///
  /// React의 `getToggleSortingHandler`가 같은 순서로 돕니다. 정렬을 바꾸면 TanStack의
  /// 페이지 모델처럼 첫 페이지로 돌아갑니다.
  void _toggleSort(HoronDataTableColumn<T> column) {
    final bool sameColumn = _sortColumnId == column.id;
    final HoronDataTableSortDirection? next = !sameColumn
        ? HoronDataTableSortDirection.asc
        : switch (_sortDirection) {
            HoronDataTableSortDirection.asc => HoronDataTableSortDirection.desc,
            HoronDataTableSortDirection.desc => null,
            null => HoronDataTableSortDirection.asc,
          };

    setState(() {
      _sortColumnId = next == null ? null : column.id;
      _sortDirection = next;
      _page = 0;
    });
    widget.onSortChanged?.call(_sortColumnId, _sortDirection);
  }

  List<T> _sortedRows() {
    final HoronDataTableColumn<T>? column = _sortColumn;
    final HoronDataTableSortDirection? direction = _sortDirection;
    if (column == null || direction == null) return widget.data;

    final List<T> rows = List<T>.of(widget.data);
    final int Function(T a, T b) compare =
        column.comparator ?? (T a, T b) => _compareValues(column.value?.call(a), column.value?.call(b));
    rows.sort(direction == HoronDataTableSortDirection.asc ? compare : (T a, T b) => compare(b, a));
    return rows;
  }

  /// TanStack의 기본 정렬과 같은 순서를 냅니다. 숫자·날짜·참거짓은 그 타입으로 비교하고,
  /// 나머지는 소문자 문자열로 비교하며, 빈 값은 방향과 무관하게 뒤로 보냅니다.
  static int _compareValues(Object? a, Object? b) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (a is num && b is num) return a.compareTo(b);
    if (a is DateTime && b is DateTime) return a.compareTo(b);
    if (a is bool && b is bool) return a == b ? 0 : (a ? 1 : -1);
    return a.toString().toLowerCase().compareTo(b.toString().toLowerCase());
  }

  void _goToPage(int page, int pageCount) {
    final int next = page.clamp(0, pageCount - 1);
    if (next == _page) return;
    setState(() => _page = next);
  }

  /// React의 `{count} row(s)`입니다. 문자열 계약에 자리가 없어 기본값을 여기서 짓습니다.
  static String _defaultRowCountLabel(int rowCount) => '$rowCount row(s)';

  /// React의 `Page {page} of {pageCount}`입니다.
  static String _defaultPageStatusLabel(int page, int pageCount) => 'Page $page of $pageCount';

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronStrings strings = HoronTheme.of(context).strings;
    final List<T> rows = _sortedRows();
    final int pageCount = HoronDataTable.pageCountFor(rows.length, widget.pageSize);
    // 데이터가 줄면 지금 페이지가 범위를 벗어날 수 있습니다. React는 페이지 모델이 스스로
    // 범위를 좁히므로, 여기서도 그릴 때 값을 범위 안으로 당깁니다.
    final int page = _page.clamp(0, pageCount - 1);
    final int start = page * widget.pageSize;
    final int end = (start + widget.pageSize).clamp(0, rows.length);
    final List<T> pageRows = rows.sublist(start, end);

    final BorderRadius radius = BorderRadius.circular(HoronRadiusRole.card);
    final Widget content = DecoratedBox(
      decoration: BoxDecoration(
        color: scheme.surfaceContainerLow,
        borderRadius: radius,
        border: Border.all(color: scheme.outline),
      ),
      child: ClipRRect(
        borderRadius: radius,
        child: DefaultTextStyle.merge(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _dataTableFontSize,
            fontWeight: HoronFontWeight.regular,
            height: HoronLineHeight.normal,
            color: scheme.onSurface,
            // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중 밑줄이
            // 새어 들어오지 않게 명시합니다.
            decoration: TextDecoration.none,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              if (pageRows.isEmpty)
                _buildTable(context, scheme, const <Never>[])
              else
                _scrollable(context, _buildTable(context, scheme, pageRows)),
              if (pageRows.isEmpty) _buildEmpty(context, scheme, widget.emptyMessage ?? strings.noResults),
            ],
          ),
        ),
      ),
    );

    final String rowCount = (widget.rowCountLabel ?? _defaultRowCountLabel)(rows.length);
    final String pageStatus = (widget.pageStatusLabel ?? _defaultPageStatusLabel)(page + 1, pageCount);

    final Widget root = Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        content,
        SizedBox(height: _dataTableGap),
        _paginationRow(
          scheme: scheme,
          strings: strings,
          rowCount: rowCount,
          pageStatus: pageStatus,
          page: page,
          pageCount: pageCount,
        ),
      ],
    );

    if (widget.semanticLabel == null) return root;
    return Semantics(container: true, label: widget.semanticLabel, child: root);
  }

  /// 표를 컨테이너 폭에 맞추고, 내용이 넓으면 가로로 흐르게 합니다(`overflow-x-auto`).
  Widget _scrollable(BuildContext context, Widget table) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double viewport = constraints.maxWidth.isFinite ? constraints.maxWidth : HoronBreakpoint.sm;
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: viewport),
            child: table,
          ),
        );
      },
    );
  }

  Widget _buildEmpty(BuildContext context, ColorScheme scheme, String message) {
    return SizedBox(
      key: HoronDataTable.emptyKey,
      height: _dataTableEmptyHeight,
      child: Center(
        child: Text(
          message,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _dataTableFontSize,
            fontWeight: HoronFontWeight.regular,
            height: HoronLineHeight.normal,
            color: scheme.onSurfaceVariant,
            decoration: TextDecoration.none,
          ),
        ),
      ),
    );
  }

  Widget _buildTable(BuildContext context, ColorScheme scheme, List<T> pageRows) {
    final List<TableRow> tableRows = <TableRow>[
      TableRow(
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHighest.withValues(alpha: _dataTableHeadFillAlpha),
          border: Border(
            bottom: BorderSide(color: scheme.outline, width: _dataTableBorderWidth),
          ),
        ),
        children: <Widget>[
          for (final HoronDataTableColumn<T> column in widget.columns) _headCell(context, scheme, column),
        ],
      ),
      for (int index = 0; index < pageRows.length; index++)
        TableRow(
          decoration: BoxDecoration(
            // `[&_tr:last-child]:border-0` - 마지막 행은 아래 테두리가 없습니다.
            border: index == pageRows.length - 1
                ? null
                : Border(
                    bottom: BorderSide(color: scheme.outline, width: _dataTableBorderWidth),
                  ),
          ),
          children: <Widget>[
            for (final HoronDataTableColumn<T> column in widget.columns)
              _bodyCell(context, scheme, column, pageRows[index]),
          ],
        ),
    ];

    return Table(
      defaultColumnWidth: const IntrinsicColumnWidth(),
      defaultVerticalAlignment: TableCellVerticalAlignment.middle,
      children: tableRows,
    );
  }

  Widget _headCell(BuildContext context, ColorScheme scheme, HoronDataTableColumn<T> column) {
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _dataTableFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );
    final HoronDataTableSortDirection? direction = _sortColumnId == column.id ? _sortDirection : null;

    final Widget child = column.sortable
        ? _HoronDataTableSortButton(
            key: HoronDataTable.sortKey(column.id),
            label: column.header,
            style: style,
            direction: direction,
            indicatorKey: HoronDataTable.sortIndicatorKey(column.id),
            onTap: () => _toggleSort(column),
          )
        : Text(column.header, maxLines: 1, softWrap: false, style: style);

    return ConstrainedBox(
      constraints: const BoxConstraints(minHeight: _dataTableHeadHeight),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _dataTableHorizontalPadding),
        child: Align(alignment: AlignmentDirectional.centerStart, child: child),
      ),
    );
  }

  Widget _bodyCell(BuildContext context, ColorScheme scheme, HoronDataTableColumn<T> column, T row) {
    final Widget? custom = column.cell?.call(row);
    final Widget child =
        custom ??
        Text(
          '${column.value?.call(row) ?? ''}',
          maxLines: 1,
          softWrap: false,
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _dataTableFontSize,
            fontWeight: HoronFontWeight.regular,
            height: HoronLineHeight.normal,
            color: scheme.onSurface,
            decoration: TextDecoration.none,
          ),
        );
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: _dataTableHorizontalPadding, vertical: _dataTableVerticalPadding),
      child: child,
    );
  }

  Widget _paginationRow({
    required ColorScheme scheme,
    required HoronStrings strings,
    required String rowCount,
    required String pageStatus,
    required int page,
    required int pageCount,
  }) {
    final TextStyle metaStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _dataTableFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );

    // `flex items-center justify-between gap-4`
    final Widget controls = Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        HoronButton(
          key: HoronDataTable.previousKey,
          label: strings.previousPage,
          variant: HoronButtonVariant.outline,
          size: HoronButtonSize.sm,
          onPressed: page > 0 ? () => _goToPage(page - 1, pageCount) : null,
        ),
        SizedBox(width: _dataTableControlGap),
        Text(
          pageStatus,
          key: HoronDataTable.pageStatusKey,
          maxLines: 1,
          softWrap: false,
          // `tabular-nums` - 숫자 폭을 고정해 페이지를 넘겨도 글자가 흔들리지 않습니다.
          style: metaStyle.copyWith(fontFeatures: const <FontFeature>[FontFeature.tabularFigures()]),
        ),
        SizedBox(width: _dataTableControlGap),
        HoronButton(
          key: HoronDataTable.nextKey,
          label: strings.nextPage,
          variant: HoronButtonVariant.outline,
          size: HoronButtonSize.sm,
          onPressed: page < pageCount - 1 ? () => _goToPage(page + 1, pageCount) : null,
        ),
      ],
    );

    final Widget rowCountText = Text(rowCount, key: HoronDataTable.rowCountKey, style: metaStyle);

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // React는 한 줄을 유지하고 넘치면 부모가 가로로 흐릅니다. Flutter에서 한 줄을
        // 고집하면 좁은 폭에서 `RenderFlex overflowed`가 나므로, 그 폭부터는 행 수를
        // 컨트롤 위에 쌓고 컨트롤을 가로 스크롤로 흔려보냅니다. 보이는 정보는 같습니다.
        final bool narrow = constraints.maxWidth.isFinite && constraints.maxWidth < HoronBreakpoint.sm;
        if (narrow) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              rowCountText,
              SizedBox(height: _dataTableGap),
              SingleChildScrollView(scrollDirection: Axis.horizontal, child: controls),
            ],
          );
        }
        return Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Flexible(child: rowCountText),
            SizedBox(width: _dataTablePaginationGap),
            controls,
          ],
        );
      },
    );
  }
}

/// 정렬을 바꾸는 머리 버튼입니다.
///
/// `data-table.tsx`의 `inline-flex items-center gap-1.5 rounded-xs transition-colors
/// outline-none hover:text-foreground focus-visible:text-foreground`입니다. hover와
/// 포커스에서 글자색이 전경색으로 바뀝니다.
class _HoronDataTableSortButton extends StatefulWidget {
  const _HoronDataTableSortButton({
    super.key,
    required this.label,
    required this.style,
    required this.direction,
    required this.indicatorKey,
    required this.onTap,
  });

  final String label;
  final TextStyle style;
  final HoronDataTableSortDirection? direction;
  final Key indicatorKey;
  final VoidCallback onTap;

  @override
  State<_HoronDataTableSortButton> createState() => _HoronDataTableSortButtonState();
}

class _HoronDataTableSortButtonState extends State<_HoronDataTableSortButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final Color foreground = _hovered || _focused ? scheme.onSurface : scheme.onSurfaceVariant;

    return Semantics(
      button: true,
      child: FocusableActionDetector(
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onTap();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.onTap,
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(HoronRadius.xs),
                boxShadow: _focused
                    ? <BoxShadow>[
                        BoxShadow(
                          color: horon.ring.withValues(alpha: _dataTableFocusRingAlpha),
                          spreadRadius: _dataTableFocusRingWidth,
                        ),
                      ]
                    : null,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Text(widget.label, maxLines: 1, softWrap: false, style: widget.style.copyWith(color: foreground)),
                  SizedBox(width: _dataTableSortGap),
                  HoronDataTableSortIndicator(key: widget.indicatorKey, direction: widget.direction, color: foreground),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 머리에 붙는 정렬 표시입니다.
///
/// lucide의 `arrow-up`·`arrow-down`·`chevrons-up-down`을 직접 그립니다. 이 패키지는
/// 아이콘 폰트를 번들하지 않고 호스트가 공급하므로, 글리프에 맡기면 폰트가 없는 호스트에서
/// 빈 네모가 됩니다.
class HoronDataTableSortIndicator extends StatelessWidget {
  /// 정렬 표시 하나를 만듭니다.
  const HoronDataTableSortIndicator({super.key, required this.direction, this.color});

  /// 아이콘의 한 변입니다(`size-3.5`).
  static const double size = _dataTableSortIconSize;

  /// 지금 방향입니다. null이면 정렬하지 않은 상태의 양방향 화살표입니다.
  final HoronDataTableSortDirection? direction;

  /// 아이콘 색입니다. 없으면 지금 글자색을 씁니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final Color resolved = color ?? Theme.of(context).colorScheme.onSurfaceVariant;
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: size,
        child: CustomPaint(
          painter: _HoronDataTableSortPainter(
            color: direction == null ? resolved.withValues(alpha: _dataTableSortIdleOpacity) : resolved,
            direction: direction,
          ),
        ),
      ),
    );
  }
}

/// lucide `arrow-up`(`M12 19V5` + `m5 12 7-7 7 7`), `arrow-down`(`M12 5v14` +
/// `m19 12-7 7-7-7`), `chevrons-up-down`(`m7 15 5 5 5-5` + `m7 9 5-5 5 5`)을 24 그리드로
/// 그립니다.
class _HoronDataTableSortPainter extends CustomPainter {
  const _HoronDataTableSortPainter({required this.color, required this.direction});

  final Color color;
  final HoronDataTableSortDirection? direction;

  @override
  void paint(Canvas canvas, Size size) {
    final double unit = size.width / 24;
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = unit * 2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final Path path = Path();
    void line(double x1, double y1, double x2, double y2) {
      path
        ..moveTo(x1 * unit, y1 * unit)
        ..lineTo(x2 * unit, y2 * unit);
    }

    switch (direction) {
      case HoronDataTableSortDirection.asc:
        line(12, 19, 12, 5);
        line(5, 12, 12, 5);
        line(19, 12, 12, 5);
      case HoronDataTableSortDirection.desc:
        line(12, 5, 12, 19);
        line(19, 12, 12, 19);
        line(5, 12, 12, 19);
      case null:
        line(7, 15, 12, 20);
        line(17, 15, 12, 20);
        line(7, 9, 12, 4);
        line(17, 9, 12, 4);
    }
    canvas.drawPath(path, stroke);
  }

  @override
  bool shouldRepaint(_HoronDataTableSortPainter oldDelegate) =>
      color != oldDelegate.color || direction != oldDelegate.direction;
}
