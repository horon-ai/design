import 'package:flutter/material.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/switch.dart';

import '../section_scaffold.dart';

/// `switch` 갤러리 섹션입니다.
///
/// 두 크기(`default`·`sm`)와 켜짐·꺼짐·오류·비활성을 모두 그립니다. 켜진 트랙이
/// `primary`인지, 썸이 오른쪽 끝으로 갔는지 이 화면에서 확인할 수 있습니다.
class HoronSwitchGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronSwitchGallerySection({super.key});

  @override
  State<HoronSwitchGallerySection> createState() =>
      _HoronSwitchGallerySectionState();
}

class _HoronSwitchGallerySectionState extends State<HoronSwitchGallerySection> {
  bool _defaultOn = true;
  bool _defaultOff = false;
  bool _smOn = true;
  bool _smOff = false;

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Switch',
      variants: <Widget>[
        HoronSwitch(
          value: _defaultOn,
          label: 'Default on',
          onChanged: (bool value) => setState(() => _defaultOn = value),
        ),
        HoronSwitch(
          value: _defaultOff,
          label: 'Default off',
          onChanged: (bool value) => setState(() => _defaultOff = value),
        ),
        HoronSwitch(
          value: _smOn,
          size: HoronSwitchSize.sm,
          label: 'sm on',
          onChanged: (bool value) => setState(() => _smOn = value),
        ),
        HoronSwitch(
          value: _smOff,
          size: HoronSwitchSize.sm,
          label: 'sm off',
          onChanged: (bool value) => setState(() => _smOff = value),
        ),
      ],
      states: <Widget>[
        HoronSwitch(
          value: true,
          invalid: true,
          label: 'Invalid on',
          onChanged: (_) {},
        ),
        HoronSwitch(
          value: false,
          invalid: true,
          label: 'Invalid off',
          onChanged: (_) {},
        ),
        HoronSwitch(
          value: true,
          enabled: false,
          label: 'Disabled on',
          onChanged: (_) {},
        ),
        HoronSwitch(
          value: false,
          enabled: false,
          label: 'Disabled off',
          onChanged: (_) {},
        ),
        const HoronSwitch(
          value: false,
          size: HoronSwitchSize.sm,
          label: 'No callback',
        ),
      ],
      notes:
          'React `switch.tsx`의 `data-[size=default]:h-6 data-[size=default]:w-10`(24×40, 썸 20)과 '
          '`data-[size=sm]:h-[18px] data-[size=sm]:w-[30px]`(18×30, 썸 14)를 그대로 씁니다. '
          '켜진 트랙은 primary이고, 썸은 테두리 안쪽에서 오른쪽 끝으로 붙습니다.',
    );
  }
}
