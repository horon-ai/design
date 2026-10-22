import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `input-group` 갤러리 섹션입니다.
///
/// React `input-group.tsx`의 cva가 선언한 변형은 addon 정렬 하나이므로
/// `inline-start`·`inline-end` 둘을 모두 보여 주고, 상태는 default·invalid·disabled
/// 셋을 보여 줍니다.
class HoronInputGroupGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronInputGroupGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Input group',
      variants: <Widget>[
        for (final HoronInputGroupAddonAlign align
            in HoronInputGroupAddonAlign.values)
          _GroupCell(
            label: align.name,
            child: HoronInputGroup(
              children: <Widget>[
                HoronInputGroupAddon(
                  align: align,
                  child: Icon(
                    align == HoronInputGroupAddonAlign.inlineStart
                        ? Icons.alternate_email
                        : Icons.check,
                    size: 16,
                  ),
                ),
                const HoronInputGroupInput(hintText: 'name@horon.ai'),
              ],
            ),
          ),
        const _GroupCell(
          label: 'Both addons',
          child: HoronInputGroup(
            children: <Widget>[
              HoronInputGroupAddon(child: Text('https://')),
              HoronInputGroupInput(hintText: 'horon.ai'),
              HoronInputGroupAddon(
                align: HoronInputGroupAddonAlign.inlineEnd,
                child: Text('.ai'),
              ),
            ],
          ),
        ),
        _GroupCell(
          label: 'With button',
          child: HoronInputGroup(
            children: <Widget>[
              const HoronInputGroupAddon(child: Icon(Icons.search, size: 16)),
              const HoronInputGroupInput(hintText: 'Search'),
              HoronInputGroupButton(
                semanticsLabel: 'Clear',
                tooltip: 'Clear',
                onPressed: () {},
                child: const Icon(Icons.clear),
              ),
            ],
          ),
        ),
      ],
      states: <Widget>[
        const _GroupCell(
          label: 'Default',
          child: HoronInputGroup(
            children: <Widget>[
              HoronInputGroupAddon(
                child: Icon(Icons.alternate_email, size: 16),
              ),
              HoronInputGroupInput(hintText: 'Default'),
            ],
          ),
        ),
        const _GroupCell(
          label: 'Invalid',
          child: HoronInputGroup(
            invalid: true,
            children: <Widget>[
              HoronInputGroupAddon(
                child: Icon(Icons.alternate_email, size: 16),
              ),
              HoronInputGroupInput(hintText: 'Invalid'),
            ],
          ),
        ),
        const _GroupCell(
          label: 'Disabled',
          child: HoronInputGroup(
            disabled: true,
            children: <Widget>[
              HoronInputGroupAddon(
                child: Icon(Icons.alternate_email, size: 16),
              ),
              HoronInputGroupInput(hintText: 'Disabled'),
            ],
          ),
        ),
      ],
      notes:
          'addon 정렬은 React의 `inline-start`·`inline-end` 두 값입니다. 묶음이 '
          '자손의 포커스를 추적해 `focus-within` 링을 그립니다.',
    );
  }
}

/// 한 변형을 이름과 함께 보여 주는 칸입니다.
class _GroupCell extends StatelessWidget {
  const _GroupCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
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
