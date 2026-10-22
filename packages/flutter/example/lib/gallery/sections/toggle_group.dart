import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/toggle_group.dart';

import '../section_scaffold.dart';

/// `toggle_group` 갤러리 섹션입니다.
class HoronToggleGroupGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronToggleGroupGallerySection({super.key});

  static const List<Widget> _items = <Widget>[
    HoronToggleGroupItem(value: 'bold', label: 'Bold'),
    HoronToggleGroupItem(value: 'italic', label: 'Italic'),
    HoronToggleGroupItem(value: 'underline', label: 'Underline'),
  ];

  static const List<Widget> _iconItems = <Widget>[
    HoronToggleGroupItem(value: 'left', icon: Icon(Icons.format_align_left)),
    HoronToggleGroupItem(
      value: 'center',
      icon: Icon(Icons.format_align_center),
    ),
    HoronToggleGroupItem(value: 'right', icon: Icon(Icons.format_align_right)),
  ];

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'ToggleGroup',
      variants: <Widget>[
        HoronToggleGroup(onChanged: (Set<String> _) {}, children: _items),
        HoronToggleGroup(
          variant: HoronToggleGroupVariant.outline,
          onChanged: (Set<String> _) {},
          children: _items,
        ),
        HoronToggleGroup(
          multiple: true,
          initialSelection: const <String>{'bold', 'italic'},
          onChanged: (Set<String> _) {},
          children: _items,
        ),
        HoronToggleGroup(onChanged: (Set<String> _) {}, children: _iconItems),
        HoronToggleGroup(
          variant: HoronToggleGroupVariant.outline,
          onChanged: (Set<String> _) {},
          children: <Widget>[
            for (final HoronToggleGroupItemSize size
                in HoronToggleGroupItemSize.values)
              HoronToggleGroupItem(
                value: size.name,
                label: size.name,
                size: size,
              ),
          ],
        ),
        HoronToggleGroup(
          vertical: true,
          onChanged: (Set<String> _) {},
          children: const <Widget>[
            HoronToggleGroupItem(value: 'top', label: 'Top'),
            HoronToggleGroupItem(value: 'middle', label: 'Middle'),
            HoronToggleGroupItem(value: 'bottom', label: 'Bottom'),
          ],
        ),
      ],
      states: <Widget>[
        HoronToggleGroup(
          selected: const <String>{'italic'},
          onChanged: (Set<String> _) {},
          children: _items,
        ),
        HoronToggleGroup(
          selected: const <String>{},
          onChanged: (Set<String> _) {},
          children: _items,
        ),
      ],
      notes:
          'React `toggle-group.tsx`의 컨테이너 변형 2개(default·outline)와 항목 크기 3개입니다. '
          '단일 선택은 하나만 남고, 다중 선택(multiple)은 여러 항목이 함께 남습니다.',
    );
  }
}
