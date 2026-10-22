import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/table.dart';

import '../section_scaffold.dart';

/// `table` 갤러리 섹션입니다.
///
/// React `table.tsx`에는 cva 변형이 없습니다. 그래서 변형 칸에는 구역 조합(머리만·
/// 머리와 본문·꼬리 포함)을, 상태 칸에는 선택된 행·캡션·좁은 폭의 가로 스크롤·
/// 여러 열을 놓습니다.
class HoronTableGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTableGallerySection({super.key});

  /// 두 열짜리 표 하나를 만듭니다.
  Widget _table({
    bool withHeader = true,
    bool withFooter = false,
    bool withCaption = false,
    bool secondRowSelected = false,
  }) {
    return HoronTable(
      children: <Widget>[
        if (withHeader)
          HoronTableHeader(
            children: <Widget>[
              HoronTableRow(
                children: <Widget>[
                  HoronTableHead(text: '이름'),
                  HoronTableHead(text: '금액'),
                ],
              ),
            ],
          ),
        HoronTableBody(
          children: <Widget>[
            HoronTableRow(
              children: <Widget>[
                HoronTableCell(text: '김민열'),
                HoronTableCell(text: '29,000원'),
              ],
            ),
            HoronTableRow(
              selected: secondRowSelected,
              children: <Widget>[
                HoronTableCell(text: '박서준'),
                HoronTableCell(text: '12,000원'),
              ],
            ),
          ],
        ),
        if (withFooter)
          HoronTableFooter(
            children: <Widget>[
              HoronTableRow(
                children: <Widget>[
                  HoronTableCell(text: '합계'),
                  HoronTableCell(text: '41,000원'),
                ],
              ),
            ],
          ),
        if (withCaption) HoronTableCaption(text: '이번 달 결제 내역'),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Table',
      variants: <Widget>[
        _TableCell(label: 'header + body', child: _table()),
        _TableCell(label: 'body only', child: _table(withHeader: false)),
        _TableCell(label: 'with footer', child: _table(withFooter: true)),
        _TableCell(label: 'with caption', child: _table(withCaption: true)),
      ],
      states: <Widget>[
        _TableCell(
          label: 'Selected row',
          child: _table(secondRowSelected: true),
        ),
        _TableCell(
          label: 'Many columns',
          child: HoronTable(
            children: <Widget>[
              HoronTableHeader(
                children: <Widget>[
                  HoronTableRow(
                    children: <Widget>[
                      HoronTableHead(text: '이름'),
                      HoronTableHead(text: '이메일'),
                      HoronTableHead(text: '역할'),
                      HoronTableHead(text: '마지막 접속'),
                    ],
                  ),
                ],
              ),
              HoronTableBody(
                children: <Widget>[
                  HoronTableRow(
                    children: <Widget>[
                      HoronTableCell(text: '김민열'),
                      HoronTableCell(text: 'minyeol@horon.ai'),
                      HoronTableCell(text: '소유자'),
                      HoronTableCell(text: '방금 전'),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
        _TableCell(
          label: 'Narrow width scrolls',
          child: SizedBox(width: 200, child: _table(withFooter: true)),
        ),
      ],
      notes:
          'React `table.tsx`는 `overflow-x-auto rounded-md border border-border bg-card` '
          '컨테이너 안에 `w-full text-[13px]` 표를 그립니다. 좁은 폭에서는 표가 가로로 '
          '스크롤되고 넘치지 않으며, 머리·꼬리는 `bg-muted/40`, 마지막 본문 행은 아래 '
          '테두리가 없습니다. 정렬·페이지 처리는 이 컴포넌트에 없습니다.',
    );
  }
}

/// 표 하나를 이름과 함께 보여 주는 칸입니다.
class _TableCell extends StatelessWidget {
  const _TableCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 420,
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
