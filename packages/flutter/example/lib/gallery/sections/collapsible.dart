import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `collapsible` 갤러리 섹션입니다.
///
/// React `collapsible.tsx`에는 cva 변형이 없습니다. 변형 칸에 닫힘·열림·제목
/// 없이 내용만 있는 경우를, 상태 칸에 비활성과 직접 그린 아이콘을 놓습니다.
/// 패널은 높이를 [HoronDuration.slow] 동안 애니메이션합니다.
class HoronCollapsibleGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCollapsibleGallerySection({super.key});

  /// 접히는 묶음 하나입니다.
  Widget _cell(
    BuildContext context, {
    required String label,
    bool initialOpen = false,
    bool disabled = false,
    bool customIcon = false,
  }) {
    return SizedBox(
      width: 320,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s2),
          HoronCollapsible(
            initialOpen: initialOpen,
            disabled: disabled,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                HoronCollapsibleTrigger(
                  label: '고급 설정',
                  icon: customIcon ? const Icon(Icons.tune) : null,
                ),
                const HoronCollapsiblePanel(
                  child: Text('알림 주기, 보관 기간, 내보내기 형식을 여기에서 정합니다.'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Collapsible',
      variants: <Widget>[
        _cell(context, label: 'closed'),
        _cell(context, label: 'open', initialOpen: true),
      ],
      states: <Widget>[
        _cell(
          context,
          label: 'open with custom icon',
          initialOpen: true,
          customIcon: true,
        ),
        _cell(context, label: 'disabled', disabled: true),
        _cell(
          context,
          label: 'disabled and open',
          initialOpen: true,
          disabled: true,
        ),
      ],
      notes:
          'React `collapsible.tsx`의 패널은 `h-(--collapsible-panel-height)`에서 0으로 '
          '`transition-[height] duration-200 ease-out`으로 줄어듭니다. 트리거는 '
          '`hover:bg-muted`, 포커스에서 링, 비활성에서 불투명도 50%입니다.',
    );
  }
}
