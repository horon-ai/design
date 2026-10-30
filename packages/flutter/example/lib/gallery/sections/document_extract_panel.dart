import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../board_frame.dart';

/// `document_extract_panel`의 갤러리 섹션입니다.
///
/// 필드·표·확인 대기가 섞인 문서 추출 패널과, 시트 위에서 쓰는 강조 상자 네 톤을
/// 함께 보여 줍니다.
class HoronDocumentExtractPanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronDocumentExtractPanelGallerySection({super.key});

  static const List<HoronExtractGroup> _groups = <HoronExtractGroup>[
    HoronExtractGroup(
      id: 'invoice',
      label: 'Invoice',
      fields: <HoronExtractEntry>[
        HoronExtractField(
          id: 'vendor',
          label: 'Vendor',
          value: 'Northwind Supply Co.',
          type: 'Text',
          status: HoronExtractFieldStatus.filled,
        ),
        HoronExtractField(
          id: 'invoice-no',
          label: 'Invoice no.',
          value: 'INV-2043-118',
          type: 'Text',
          status: HoronExtractFieldStatus.check,
        ),
        HoronExtractField(
          id: 'issued',
          label: 'Issued',
          value: '2026-09-14',
          type: 'Date',
          status: HoronExtractFieldStatus.filled,
        ),
        HoronExtractTable(
          id: 'lines',
          label: 'Line items',
          type: 'Table',
          columns: <HoronExtractColumn>[
            HoronExtractColumn('Item'),
            HoronExtractColumn('Qty', alignEnd: true),
            HoronExtractColumn('Amount', alignEnd: true),
          ],
          rows: <List<String>>[
            <String>['Paper stock', '12', '480.00'],
            <String>['Binding', '3', '96.00'],
          ],
        ),
      ],
    ),
    HoronExtractGroup(
      id: 'totals',
      label: 'Totals',
      fields: <HoronExtractEntry>[
        HoronExtractField(
          id: 'total',
          label: 'Total',
          value: '576.00',
          type: 'Money',
          status: HoronExtractFieldStatus.check,
        ),
        HoronExtractField(
          id: 'due',
          label: 'Due',
          value: '2026-10-14',
          type: 'Date',
          status: HoronExtractFieldStatus.filled,
        ),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return BoardFrame(
      designWidth: 900,
      child: Padding(
        padding: EdgeInsets.all(theme.space.s4),
        child: Wrap(
          spacing: theme.space.s4,
          runSpacing: theme.space.s4,
          crossAxisAlignment: WrapCrossAlignment.start,
          children: <Widget>[
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: theme.space.s2,
              children: <Widget>[
                Text(
                  '필드·표·확인 대기',
                  style: theme.text.caption.copyWith(
                    color: theme.colors.textSecondary,
                  ),
                ),
                HoronDocumentExtractPanel(
                  fileName: 'northwind-invoice.pdf',
                  pageLabel: '1 / 2',
                  defaultZoom: 70,
                  groups: _groups,
                  bot: const HoronExtractBot(
                    initial: 'N',
                    name: 'Extractor',
                    elapsed: '8s',
                  ),
                  onExtract: () {},
                  onAcceptAll: () {},
                  sheet: _sheet(theme),
                ),
              ],
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: theme.space.s2,
              children: <Widget>[
                Text(
                  'ExtractHighlight 네 톤',
                  style: theme.text.caption.copyWith(
                    color: theme.colors.textSecondary,
                  ),
                ),
                SizedBox(
                  width: theme.space.step(60),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: theme.space.s2,
                    children: <Widget>[
                      _tone(
                        theme,
                        'sky',
                        HoronExtractHighlightTone.sky,
                        'Northwind Supply Co.',
                      ),
                      _tone(
                        theme,
                        'brand',
                        HoronExtractHighlightTone.brand,
                        'INV-2043-118',
                      ),
                      _tone(
                        theme,
                        'neutral',
                        HoronExtractHighlightTone.neutral,
                        '2026-09-14',
                      ),
                      _tone(
                        theme,
                        'ink',
                        HoronExtractHighlightTone.ink,
                        '576.00',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _tone(
    HoronThemeData theme,
    String name,
    HoronExtractHighlightTone tone,
    String value,
  ) {
    return Row(
      children: <Widget>[
        SizedBox(
          width: theme.space.step(10),
          child: Text(
            name,
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ),
        Flexible(
          child: HoronExtractHighlight(
            tone: tone,
            child: Text(
              value,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.text.bodySm.copyWith(
                color: theme.colors.textPrimary,
              ),
            ),
          ),
        ),
      ],
    );
  }

  /// 뷰어에 들어가는 종이 시트입니다.
  Widget _sheet(HoronThemeData theme) {
    final TextStyle body = theme.text.bodySm.copyWith(
      color: theme.colors.textPrimary,
    );
    final TextStyle label = theme.text.caption.copyWith(
      color: theme.colors.textSecondary,
    );
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s2,
      children: <Widget>[
        Text(
          'NORTHWIND SUPPLY',
          style: theme.text.titleSm.copyWith(color: theme.colors.textPrimary),
        ),
        Text('Invoice INV-2043-118 · 14 Sep 2026', style: label),
        SizedBox(height: theme.space.s1),
        Text('Vendor', style: label),
        HoronExtractHighlight(child: Text('Northwind Supply Co.', style: body)),
        Text('Invoice no.', style: label),
        HoronExtractHighlight(
          tone: HoronExtractHighlightTone.brand,
          child: Text('INV-2043-118', style: body),
        ),
        Text('Issued', style: label),
        HoronExtractHighlight(
          tone: HoronExtractHighlightTone.neutral,
          child: Text('2026-09-14', style: body),
        ),
        SizedBox(height: theme.space.s2),
        Text('Total due', style: label),
        HoronExtractHighlight(
          tone: HoronExtractHighlightTone.ink,
          child: Text('576.00 USD', style: body),
        ),
        SizedBox(height: theme.space.s3),
        Text('Payment within 30 days of the issue date.', style: label),
      ],
    );
  }
}
