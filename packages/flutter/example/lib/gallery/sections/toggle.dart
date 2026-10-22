import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/toggle.dart';

import '../section_scaffold.dart';

/// `toggle` 갤러리 섹션입니다.
class HoronToggleGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronToggleGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Toggle',
      variants: <Widget>[
        for (final HoronToggleVariant variant in HoronToggleVariant.values)
          for (final HoronToggleSize size in HoronToggleSize.values)
            HoronToggle(
              label: '${variant.name} · ${size.name}',
              variant: variant,
              size: size,
              initialPressed: true,
              onPressedChange: (bool pressed) {},
            ),
        for (final HoronToggleSize size in HoronToggleSize.values)
          HoronToggle(
            icon: const Icon(Icons.format_bold),
            size: size,
            onPressedChange: (bool _) {},
          ),
      ],
      states: <Widget>[
        HoronToggle(label: 'Off', onPressedChange: (bool _) {}),
        HoronToggle(
          label: 'On',
          initialPressed: true,
          onPressedChange: (bool _) {},
        ),
        HoronToggle(
          label: 'Outline on',
          variant: HoronToggleVariant.outline,
          initialPressed: true,
          onPressedChange: (bool _) {},
        ),
        HoronToggle(
          label: 'Disabled',
          disabled: true,
          onPressedChange: (bool _) {},
        ),
        HoronToggle(
          label: 'Disabled on',
          disabled: true,
          initialPressed: true,
          onPressedChange: (bool _) {},
        ),
        HoronToggle(
          label: 'With icon',
          icon: const Icon(Icons.format_italic),
          initialPressed: true,
          onPressedChange: (bool _) {},
        ),
      ],
      notes:
          'React `toggle.tsx`의 variant 2개(default·outline)와 size 3개(default·sm·lg)입니다. '
          '`data-pressed:bg-accent`가 켜진 상태이고, 높이는 h-[32px]·h-7·h-[37px]입니다.',
    );
  }
}
