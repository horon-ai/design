import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `label` 갤러리 섹션입니다.
///
/// React `label.tsx`에는 cva 변형이 없으므로 나열할 변형은 슬롯 구성이고, 상태는
/// default·invalid·disabled 셋입니다. 상태는 `HoronField` 스코프로 보여 줍니다.
class HoronLabelGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronLabelGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Label',
      variants: <Widget>[
        const HoronLabel(label: 'Email'),
        const HoronLabel(
          label: 'Email',
          icon: Icon(Icons.mail_outline, size: 16),
        ),
        const HoronLabel(label: 'Email', child: Text('(required)')),
      ],
      states: <Widget>[
        const HoronField(children: <Widget>[HoronLabel(label: 'Default')]),
        const HoronField(
          invalid: true,
          children: <Widget>[HoronLabel(label: 'Invalid')],
        ),
        const HoronField(
          disabled: true,
          children: <Widget>[HoronLabel(label: 'Disabled')],
        ),
      ],
      notes:
          'React `label.tsx`에는 cva 변형이 없습니다. 비활성·오류 색은 '
          '`HoronFieldScope`에서 물려받고, 명시 인자가 있으면 그것이 이깁니다.',
    );
  }
}
