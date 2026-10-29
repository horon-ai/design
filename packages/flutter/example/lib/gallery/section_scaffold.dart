import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 갤러리 섹션 하나를 그리는 공통 레이아웃입니다.
///
/// 변형과 상태를 나란히 늘어놓기만 합니다. 컴포넌트별 창작 시나리오는 넣지 않습니다.
class GallerySectionScaffold extends StatelessWidget {
  /// 기본 생성자입니다.
  const GallerySectionScaffold({
    super.key,
    required this.title,
    required this.variants,
    required this.states,
    this.notes,
  });

  /// 섹션 제목입니다.
  final String title;

  /// 변형 목록입니다.
  final List<Widget> variants;

  /// 상태 목록입니다.
  final List<Widget> states;

  /// 선택 사항인 설명입니다.
  final String? notes;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.all(HoronSpace.s6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            title,
            style: text.headlineSmall?.copyWith(color: scheme.onSurface),
          ),
          const SizedBox(height: HoronSpace.s6),
          _GalleryBlock(label: 'Variants', children: variants),
          const SizedBox(height: HoronSpace.s6),
          _GalleryBlock(label: 'States', children: states),
          if (notes != null) ...<Widget>[
            const SizedBox(height: HoronSpace.s6),
            _GalleryBlockLabel(label: 'Notes'),
            const SizedBox(height: HoronSpace.s3),
            Text(
              notes!,
              style: text.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
            ),
          ],
        ],
      ),
    );
  }
}

class _GalleryBlockLabel extends StatelessWidget {
  const _GalleryBlockLabel({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Text(
      label.toUpperCase(),
      style: Theme.of(context).textTheme.labelSmall
          ?.copyWith(color: scheme.onSurfaceVariant, letterSpacing: 0.6),
    );
  }
}

class _GalleryBlock extends StatelessWidget {
  const _GalleryBlock({required this.label, required this.children});

  final String label;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        _GalleryBlockLabel(label: label),
        const SizedBox(height: HoronSpace.s3),
        DecoratedBox(
          decoration: BoxDecoration(
            color: scheme.surfaceContainerLow,
            borderRadius: BorderRadius.circular(HoronRadius.xl),
            border: Border.all(color: scheme.outline),
          ),
          child: SizedBox(
            width: double.infinity,
            child: Padding(
              padding: const EdgeInsets.all(HoronSpace.s4),
              child: children.isEmpty
                  ? const SizedBox(height: 48)
                  : Wrap(
                      spacing: HoronSpace.s4,
                      runSpacing: HoronSpace.s4,
                      children: children,
                    ),
            ),
          ),
        ),
      ],
    );
  }
}
