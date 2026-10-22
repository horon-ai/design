import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/textarea.dart';

import '../section_scaffold.dart';

/// `textarea` 갤러리 섹션입니다.
///
/// React `textarea.tsx`에는 cva 변형이 없으므로 나열할 변형은 줄 수 설정이고,
/// 상태는 default·invalid·disabled·read-only 넷입니다.
class HoronTextareaGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTextareaGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Textarea',
      variants: <Widget>[
        const _TextareaCell(
          label: 'Auto grow',
          child: HoronTextarea(hintText: 'Write a message'),
        ),
        const _TextareaCell(
          label: 'Capped at 4 lines',
          child: HoronTextarea(hintText: 'Write a message', maxLines: 4),
        ),
      ],
      states: <Widget>[
        const _TextareaCell(
          label: 'Default',
          child: HoronTextarea(hintText: 'Default'),
        ),
        const _TextareaCell(
          label: 'Invalid',
          child: HoronTextarea(hintText: 'Invalid', invalid: true),
        ),
        const _TextareaCell(
          label: 'Disabled',
          child: HoronTextarea(hintText: 'Disabled', disabled: true),
        ),
        const _TextareaCell(
          label: 'Read only',
          child: HoronTextarea(hintText: 'Read only', readOnly: true),
        ),
      ],
      notes:
          '최소 높이는 생성 토큰 `HoronTextareaMetrics.minHeight`(88)입니다. '
          'React의 `field-sizing-content`는 `minLines`·`maxLines`로 옮겼습니다.',
    );
  }
}

/// 한 변형을 이름과 함께 보여 주는 칸입니다.
class _TextareaCell extends StatelessWidget {
  const _TextareaCell({required this.label, required this.child});

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
