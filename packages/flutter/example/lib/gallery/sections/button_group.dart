import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `button_group` 갤러리 섹션입니다.
class HoronButtonGroupGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronButtonGroupGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'ButtonGroup',
      variants: <Widget>[
        HoronButtonGroup(
          children: <Widget>[
            HoronButton(label: 'Day', onPressed: () {}),
            HoronButton(label: 'Week', onPressed: () {}),
            HoronButton(label: 'Month', onPressed: () {}),
          ],
        ),
        HoronButtonGroup(
          children: <Widget>[
            HoronButton(
              label: 'Day',
              variant: HoronButtonVariant.outline,
              onPressed: () {},
            ),
            HoronButton(
              label: 'Week',
              variant: HoronButtonVariant.outline,
              onPressed: () {},
            ),
            HoronButton(
              label: 'Month',
              variant: HoronButtonVariant.outline,
              onPressed: () {},
            ),
          ],
        ),
        HoronButtonGroup(
          orientation: HoronButtonGroupOrientation.vertical,
          children: <Widget>[
            HoronButton(
              label: 'Top',
              variant: HoronButtonVariant.secondary,
              onPressed: () {},
            ),
            HoronButton(
              label: 'Middle',
              variant: HoronButtonVariant.secondary,
              onPressed: () {},
            ),
            HoronButton(
              label: 'Bottom',
              variant: HoronButtonVariant.secondary,
              onPressed: () {},
            ),
          ],
        ),
        HoronButtonGroup(
          children: <Widget>[
            HoronButton(
              label: 'xs',
              size: HoronButtonSize.xs,
              onPressed: () {},
            ),
            HoronButton(
              label: 'xs',
              size: HoronButtonSize.xs,
              onPressed: () {},
            ),
          ],
        ),
        HoronButtonGroup(
          children: <Widget>[
            HoronButton(
              leading: const Icon(Icons.format_bold),
              size: HoronButtonSize.iconSm,
              onPressed: () {},
            ),
            HoronButton(
              leading: const Icon(Icons.format_italic),
              size: HoronButtonSize.iconSm,
              onPressed: () {},
            ),
            HoronButton(
              leading: const Icon(Icons.format_underlined),
              size: HoronButtonSize.iconSm,
              onPressed: () {},
            ),
          ],
        ),
      ],
      states: <Widget>[
        HoronButtonGroup(
          children: <Widget>[
            HoronButton(label: 'Enabled', onPressed: () {}),
            HoronButton(label: 'Disabled', disabled: true, onPressed: () {}),
            HoronButton(label: 'Invalid', invalid: true, onPressed: () {}),
          ],
        ),
        HoronButtonGroup(
          children: <Widget>[
            HoronButton(
              label: 'Solo',
              variant: HoronButtonVariant.outline,
              onPressed: () {},
            ),
          ],
        ),
      ],
      notes:
          'React `button-group.tsx`의 `[&>*:not(:first-child)]:rounded-l-none`과 '
          '`border-l-0`을 옮겼습니다. 붙은 자리는 바깥 모서리만 둥글고, 이음매에는 앞 버튼의 '
          '오른쪽 테두리 한 줄만 남습니다. 그룹 안 작은 크기는 `rounded-lg`(14)를 씁니다.',
    );
  }
}
