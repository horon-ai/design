import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `popover` 갤러리 섹션입니다.
///
/// 팝오버 하나가 네 방향에서 열리는 것과, 트리거 대신 기준 자리를 쓰는 경우를
/// 보여 줍니다. 패널 안에는 임의의 내용을 넣을 수 있으므로 여기서는 폼 조각과
/// 글자를 섞었습니다.
class HoronPopoverGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronPopoverGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Popover',
      variants: <Widget>[
        HoronPopover(
          side: HoronOverlaySide.bottom,
          trigger: const _Trigger(label: '아래'),
          child: const _PanelBody(title: '아래로 열림', body: 'React 기본 방향입니다.'),
        ),
        HoronPopover(
          side: HoronOverlaySide.top,
          trigger: const _Trigger(label: '위'),
          child: const _PanelBody(title: '위로 열림', body: '자리가 없으면 아래로 뒤집힙니다.'),
        ),
        HoronPopover(
          side: HoronOverlaySide.right,
          align: HoronOverlayAlign.start,
          trigger: const _Trigger(label: '오른쪽'),
          child: const _PanelBody(title: '오른쪽', body: 'align: start'),
        ),
        HoronPopover(
          side: HoronOverlaySide.left,
          align: HoronOverlayAlign.end,
          offset: const Offset(0, HoronSpace.s2),
          trigger: const _Trigger(label: '왼쪽'),
          child: const _PanelBody(title: '왼쪽', body: 'align: end, offset 8'),
        ),
      ],
      states: <Widget>[
        HoronPopover(
          trigger: const _Trigger(label: '꺼짐'),
          enabled: false,
          child: const _PanelBody(title: '열리지 않음', body: 'enabled: false'),
        ),
        HoronPopoverAnchor(
          child: HoronPopover(
            trigger: const _Trigger(label: '기준 자리'),
            child: const _PanelBody(
              title: 'Anchor',
              body: 'PopoverAnchor가 기준입니다.',
            ),
          ),
        ),
        const SizedBox(
          width: 288,
          child: HoronPopoverContent(
            child: _PanelBody(title: '패널 표면', body: '유리 채움, 테두리, 반경 12, p-3.'),
          ),
        ),
      ],
      notes:
          'React `popover.tsx`를 옮긴 것입니다. 배치는 공유 오버레이 유틸이 맡으므로 네 방향이 '
          '화면 밖으로 나가면 뒤집히고 안으로 밀려 들어옵니다. 바깥을 누르면 닫힙니다.',
    );
  }
}

/// 팝오버를 여는 트리거 모양입니다.
class _Trigger extends StatelessWidget {
  const _Trigger({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(HoronRadiusRole.control),
        border: Border.all(color: scheme.outline),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: HoronSpace.s3,
          vertical: HoronSpace.s2,
        ),
        child: Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium
              ?.copyWith(color: scheme.onSurface),
        ),
      ),
    );
  }
}

/// 패널 안에 넣는 내용입니다.
class _PanelBody extends StatelessWidget {
  const _PanelBody({required this.title, required this.body});

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(title, style: text.titleSmall?.copyWith(color: scheme.onSurface)),
        const SizedBox(height: HoronSpace.s1),
        Text(
          body,
          style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
        ),
      ],
    );
  }
}
