import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `list` 갤러리 섹션입니다.
///
/// React `list.tsx`에는 cva 변형이 없습니다. 그래서 변형 칸에는 표면 조합(구분선·테두리)을,
/// 상태 칸에는 미디어·설명·뒤쪽 슬롯·누를 수 있는 행·섹션 라벨을 놓습니다.
class HoronListGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronListGallerySection({super.key});

  /// 한 행을 만듭니다.
  Widget _row(
    String title, {
    String? description,
    bool interactive = false,
    Widget? trailing,
  }) {
    return HoronListItem(
      interactive: interactive,
      onTap: interactive ? () {} : null,
      children: <Widget>[
        HoronListItemMedia(child: const Icon(Icons.inbox)),
        HoronListItemContent(
          children: <Widget>[
            HoronListItemTitle(text: title),
            if (description != null)
              HoronListItemDescription(text: description),
          ],
        ),
        if (trailing != null) HoronListItemTrailing(child: trailing),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'List',
      variants: <Widget>[
        _ListCell(
          label: 'divided + bordered',
          child: HoronList(
            children: <Widget>[
              _row('받은 편지함', description: '읽지 않은 메시지 3개'),
              _row('보낸 편지함'),
            ],
          ),
        ),
        _ListCell(
          label: 'divided only',
          child: HoronList(
            bordered: false,
            children: <Widget>[_row('받은 편지함'), _row('보낸 편지함')],
          ),
        ),
        _ListCell(
          label: 'bordered only',
          child: HoronList(
            divided: false,
            children: <Widget>[_row('받은 편지함'), _row('보낸 편지함')],
          ),
        ),
        _ListCell(
          label: 'plain',
          child: HoronList(
            divided: false,
            bordered: false,
            children: <Widget>[_row('받은 편지함'), _row('보낸 편지함')],
          ),
        ),
      ],
      states: <Widget>[
        _ListCell(
          label: 'Interactive row',
          child: HoronList(
            children: <Widget>[
              _row(
                '눌러서 열기',
                description: 'hover·누름 반응이 붙습니다',
                interactive: true,
              ),
              _row('누를 수 없는 행'),
            ],
          ),
        ),
        _ListCell(
          label: 'Trailing slot',
          child: HoronList(
            children: <Widget>[
              _row('알림', trailing: const Icon(Icons.chevron_right)),
              _row('보관', trailing: Text('12')),
            ],
          ),
        ),
        _ListCell(
          label: 'Section label',
          child: HoronList(
            children: <Widget>[
              HoronListSection(
                label: '오늘',
                children: <Widget>[_row('받은 편지함'), _row('보낸 편지함')],
              ),
              HoronListSection(
                label: '지난주',
                children: <Widget>[_row('보관된 메시지')],
              ),
            ],
          ),
        ),
        _ListCell(
          label: 'Truncated titles',
          child: HoronList(
            children: <Widget>[
              _row(
                '한 줄에 다 들어가지 않는 아주 긴 목록 행의 제목입니다 계속 이어집니다',
                description: '설명도 한 줄로 잘립니다 아주 길게 적어 둡니다 그래야 말줄임이 보입니다',
              ),
            ],
          ),
        ),
      ],
      notes:
          'React `list.tsx`는 `divide-y divide-border`(행 사이 1px)에 '
          '`rounded-md border border-border bg-card`(반경 12)를 씁니다. `divided`와 '
          '`bordered`가 그 둘을 각각 끄는 스위치이고 기본값은 둘 다 참입니다. '
          '`interactive`인 행은 hover에서 `muted/60`, 누르는 동안 `muted`가 칠해집니다.',
    );
  }
}

/// 목록 하나를 이름과 함께 보여 주는 칸입니다.
class _ListCell extends StatelessWidget {
  const _ListCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 320,
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
