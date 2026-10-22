import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `table.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값이라 이름을 붙입니다.
const double _tableFontSize = 13.0;

/// `table.tsx`의 `text-[12px]`입니다. 캡션 크기입니다.
const double _tableCaptionFontSize = HoronText.caption;

/// `table.tsx`의 `h-10`입니다. 머리 행의 높이입니다.
const double _tableHeadHeight = HoronSpace.s10;

/// `table.tsx`의 `px-4`입니다.
const double _tableHorizontalPadding = HoronSpace.s4;

/// `table.tsx`의 `py-3`입니다.
const double _tableVerticalPadding = HoronSpace.s3;

/// `table.tsx`의 `mt-3`입니다. 캡션과 표 사이 간격입니다.
const double _tableCaptionGap = HoronSpace.s3;

/// `table.tsx`의 `bg-muted/40`입니다.
const double _tableHeadFillAlpha = 0.4;

/// `table.tsx`의 `data-[state=selected]:bg-muted`입니다. 선택된 행은 흐림 없이 칠합니다.
const double _tableSelectedFillAlpha = 1.0;

/// `table.tsx`의 `border-b`가 그리는 선 두께입니다.
const double _tableRowBorderWidth = 1.0;

/// 표 안에서 한 행이 속한 구역입니다. React의 `thead`/`tbody`/`tfoot`에 해당하며
/// 공개하지 않습니다.
enum _HoronTableSection { header, body, footer }

/// 조립에 쓰는 행 하나입니다. [HoronTable]만 읽습니다.
class _HoronTableRowData {
  const _HoronTableRowData({required this.row, required this.section});

  final HoronTableRow row;
  final _HoronTableSection section;
}

/// 정렬도 페이징도 없는 표입니다.
///
/// `table.tsx`를 옮긴 것입니다. React는 표를 `relative w-full overflow-x-auto
/// rounded-md border border-border bg-card` 컨테이너에 넣고, 표 자체는 `w-full
/// caption-bottom text-[13px]`로 그립니다. Flutter 쪽도 같은 모양을 위해 좁은 폭에서
/// **가로로 스크롤**합니다. 열 폭은 내용에서 재고([IntrinsicColumnWidth]), 내용이
/// 좁으면 표가 컨테이너 폭을 채웁니다(`w-full`). 그래서 좁은 화면에서도
/// `RenderFlex overflowed`가 나지 않습니다.
///
/// 파트는 React와 같은 이름으로 나눠 두었습니다. 이 위젯은 자식 트리에서
/// [HoronTableHeader]·[HoronTableBody]·[HoronTableFooter]·[HoronTableRow]·
/// [HoronTableCaption]을 찾아 하나의 표로 조립합니다. 그래서 머리·본문·꼬리를
/// 따로 선언해도 열이 서로 맞습니다. 정렬·페이지 처리는 이 컴포넌트의 일이
/// 아닙니다(`data-table`이 그쪽을 맡습니다).
///
/// ```dart
/// HoronTable(
///   children: <Widget>[
///     HoronTableHeader(
///       children: <Widget>[
///         HoronTableRow(
///           children: <Widget>[
///             HoronTableHead(child: Text('이름')),
///             HoronTableHead(child: Text('금액')),
///           ],
///         ),
///       ],
///     ),
///     HoronTableBody(
///       children: <Widget>[
///         HoronTableRow(
///           children: <Widget>[
///             HoronTableCell(child: Text('김민열')),
///             HoronTableCell(child: Text('29,000원')),
///           ],
///         ),
///       ],
///     ),
///     HoronTableCaption(text: '이번 달 결제 내역'),
///   ],
/// );
/// ```
class HoronTable extends StatefulWidget {
  /// 표 하나를 만듭니다.
  const HoronTable({super.key, required this.children, this.semanticLabel});

  /// 머리·본문·꼬리·캡션 파트들입니다.
  final List<Widget> children;

  /// 스크린리더가 읽을 표의 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronTable> createState() => _HoronTableState();
}

class _HoronTableState extends State<HoronTable> {
  final ScrollController _horizontal = ScrollController();

  @override
  void dispose() {
    _horizontal.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final BorderRadius radius = BorderRadius.circular(HoronRadiusRole.card);

    final List<_HoronTableRowData> rows = <_HoronTableRowData>[];
    final List<Widget> captions = <Widget>[];

    void collect(Widget child, _HoronTableSection section) {
      if (child is HoronTableHeader) {
        for (final Widget row in child.children) {
          collect(row, _HoronTableSection.header);
        }
      } else if (child is HoronTableBody) {
        for (final Widget row in child.children) {
          collect(row, _HoronTableSection.body);
        }
      } else if (child is HoronTableFooter) {
        for (final Widget row in child.children) {
          collect(row, _HoronTableSection.footer);
        }
      } else if (child is HoronTableRow) {
        rows.add(_HoronTableRowData(row: child, section: section));
      } else if (child is HoronTableCaption) {
        captions.add(child);
      }
    }

    for (final Widget child in widget.children) {
      collect(child, _HoronTableSection.body);
    }

    final int columns = rows.fold<int>(0, (int widest, _HoronTableRowData row) {
      final int count = row.row.children.length;
      return count > widest ? count : widest;
    });

    final int lastBodyIndex = rows.lastIndexWhere((_HoronTableRowData row) => row.section == _HoronTableSection.body);

    TableRow buildRow(_HoronTableRowData data, int index) {
      final bool isHeader = data.section == _HoronTableSection.header;
      final bool isFooter = data.section == _HoronTableSection.footer;
      final bool isLastBody = index == lastBodyIndex;

      // thead와 tfoot은 `bg-muted/40`이고, 선택된 본문 행은
      // `data-[state=selected]:bg-muted`로 흐림 없이 칠합니다.
      final Color background = data.row.selected
          ? scheme.surfaceContainerHighest.withValues(alpha: _tableSelectedFillAlpha)
          : isHeader || isFooter
          ? scheme.surfaceContainerHighest.withValues(alpha: _tableHeadFillAlpha)
          : Colors.transparent;

      // `border-b border-border`가 행마다 붙고 `[&_tr:last-child]:border-0`이 마지막
      // 본문 행의 아래 테두리를 지웁니다. tfoot은 `border-t`로 위 테두리를 얻습니다.
      final Border border = Border(
        top: isFooter ? BorderSide(color: scheme.outline, width: _tableRowBorderWidth) : BorderSide.none,
        bottom: isLastBody ? BorderSide.none : BorderSide(color: scheme.outline, width: _tableRowBorderWidth),
      );

      return TableRow(
        decoration: BoxDecoration(color: background, border: border),
        children: <Widget>[
          for (int column = 0; column < columns; column++)
            TableCell(
              verticalAlignment: TableCellVerticalAlignment.middle,
              child: column < data.row.children.length ? data.row.children[column] : const SizedBox.shrink(),
            ),
        ],
      );
    }

    final Widget table = Table(
      defaultColumnWidth: const IntrinsicColumnWidth(),
      defaultVerticalAlignment: TableCellVerticalAlignment.middle,
      children: <TableRow>[for (int index = 0; index < rows.length; index++) buildRow(rows[index], index)],
    );

    final Widget body = LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // `w-full`: 내용이 좁으면 컨테이너 폭을 채우고, 넓으면 그대로 두어 가로
        // 스크롤이 생기게 합니다(`overflow-x-auto`).
        final double viewport = constraints.maxWidth.isFinite ? constraints.maxWidth : HoronBreakpoint.sm;
        return Scrollbar(
          controller: _horizontal,
          child: SingleChildScrollView(
            controller: _horizontal,
            scrollDirection: Axis.horizontal,
            child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: viewport),
              child: table,
            ),
          ),
        );
      },
    );

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
            fontSize: _tableFontSize,
            fontWeight: HoronFontWeight.regular,
            height: HoronLineHeight.normal,
            color: scheme.onSurface,
            // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중
            // 밑줄이 새어 들어오지 않게 명시합니다.
            decoration: TextDecoration.none,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              body,
              for (final Widget caption in captions)
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    _tableHorizontalPadding,
                    _tableCaptionGap,
                    _tableHorizontalPadding,
                    _tableCaptionGap,
                  ),
                  child: caption,
                ),
            ],
          ),
        ),
      ),
    );

    if (widget.semanticLabel == null) return content;
    return Semantics(container: true, label: widget.semanticLabel, child: content);
  }
}

/// 표의 머리 구역입니다(`thead`).
///
/// React는 `bg-muted/40 [&_tr]:border-b`입니다. [HoronTable]은 이 파트의 행을 머리
/// 행으로 조립해 배경과 아래 테두리를 칠합니다. 표 밖에서 단독으로 쓰면 행을 세로로
/// 쌓기만 합니다.
class HoronTableHeader extends StatelessWidget {
  /// 머리 구역 하나를 만듭니다.
  const HoronTableHeader({super.key, required this.children});

  /// [HoronTableRow]들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) =>
      Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: children);
}

/// 표의 본문 구역입니다(`tbody`).
///
/// React는 `[&_tr:last-child]:border-0`이라 마지막 행의 아래 테두리를 지웁니다.
/// [HoronTable]이 그 규칙을 적용합니다.
class HoronTableBody extends StatelessWidget {
  /// 본문 구역 하나를 만듭니다.
  const HoronTableBody({super.key, required this.children});

  /// [HoronTableRow]들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) =>
      Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: children);
}

/// 표의 꼬리 구역입니다(`tfoot`).
///
/// React는 `border-t border-border bg-muted/40 font-medium`입니다. [HoronTable]이
/// 이 파트의 행에 위 테두리와 머리와 같은 배경을 적용합니다.
class HoronTableFooter extends StatelessWidget {
  /// 꼬리 구역 하나를 만듭니다.
  const HoronTableFooter({super.key, required this.children});

  /// [HoronTableRow]들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) =>
      Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: children);
}

/// 표의 한 행입니다(`tr`).
///
/// React는 `border-b border-border transition-colors hover:bg-muted/50
/// data-[state=selected]:bg-muted`입니다. 터치에는 hover가 없으므로 [selected]로
/// 선택된 행의 배경을 칠합니다.
class HoronTableRow extends StatelessWidget {
  /// 행 하나를 만듭니다.
  const HoronTableRow({super.key, required this.children, this.selected = false});

  /// [HoronTableHead]·[HoronTableCell]들입니다.
  final List<Widget> children;

  /// 선택된 행이면 배경을 칠합니다(`data-[state=selected]`).
  final bool selected;

  @override
  Widget build(BuildContext context) =>
      Row(crossAxisAlignment: CrossAxisAlignment.center, mainAxisSize: MainAxisSize.min, children: children);
}

/// 표의 머리 칸입니다(`th`).
///
/// React는 `h-10 px-4 text-left align-middle font-medium whitespace-nowrap
/// text-muted-foreground`입니다. 그래서 최소 높이 40, 좌우 여백 16, 왼쪽 정렬,
/// 한 줄 고정입니다.
class HoronTableHead extends StatelessWidget {
  /// 머리 칸 하나를 만듭니다.
  const HoronTableHead({super.key, this.text, this.child, this.style, this.textAlign = TextAlign.start})
    : assert(text != null || child != null, 'HoronTableHead needs a text or a child.');

  /// 칸 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  /// 글자 정렬입니다. React의 `text-left`가 기본입니다.
  final TextAlign textAlign;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _tableFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );
    return ConstrainedBox(
      constraints: const BoxConstraints(minHeight: _tableHeadHeight),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _tableHorizontalPadding),
        child: Align(
          alignment: AlignmentDirectional.centerStart,
          child: text != null
              ? Text(text!, textAlign: textAlign, maxLines: 1, softWrap: false, style: base.merge(style))
              : DefaultTextStyle.merge(style: base.merge(style), child: child!),
        ),
      ),
    );
  }
}

/// 표의 본문 칸입니다(`td`).
///
/// React는 `px-4 py-3 align-middle whitespace-nowrap`입니다. 좌우 16, 위아래 12,
/// 세로 가운데 정렬, 한 줄 고정입니다.
class HoronTableCell extends StatelessWidget {
  /// 본문 칸 하나를 만듭니다.
  const HoronTableCell({super.key, this.text, this.child, this.style, this.textAlign = TextAlign.start})
    : assert(text != null || child != null, 'HoronTableCell needs a text or a child.');

  /// 칸 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  /// 글자 정렬입니다.
  final TextAlign textAlign;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _tableFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: _tableHorizontalPadding, vertical: _tableVerticalPadding),
      child: text != null
          ? Text(text!, textAlign: textAlign, maxLines: 1, softWrap: false, style: base.merge(style))
          : DefaultTextStyle.merge(style: base.merge(style), child: child!),
    );
  }
}

/// 표 아래에 붙는 설명입니다(`caption`).
///
/// React는 `mt-3 text-[12px] text-muted-foreground`이고 `caption-bottom`이라 표
/// 아래에 놓입니다.
class HoronTableCaption extends StatelessWidget {
  /// 캡션 하나를 만듭니다.
  const HoronTableCaption({super.key, this.text, this.child, this.style})
    : assert(text != null || child != null, 'HoronTableCaption needs a text or a child.');

  /// 캡션 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 덧씌울 스타일입니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle base = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _tableCaptionFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );
    return text != null
        ? Text(text!, style: base.merge(style))
        : DefaultTextStyle.merge(style: base.merge(style), child: child!);
  }
}
