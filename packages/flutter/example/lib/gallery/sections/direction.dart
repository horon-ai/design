import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `direction` 갤러리 섹션입니다.
///
/// React `direction.tsx`는 `DirectionProvider` 래퍼 하나이고 cva 변형이 없습니다. 변형 칸에는
/// 두 방향을, 상태 칸에는 뒤집히는 아이콘과 뒤집히지 않는 아이콘, 시작·끝 기준 여백을
/// 놓습니다.
class HoronDirectionGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronDirectionGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Direction',
      variants: <Widget>[
        _DirectionCell(
          label: 'ltr',
          child: HoronDirection.ltr(child: _row(context)),
        ),
        _DirectionCell(
          label: 'rtl',
          child: HoronDirection.rtl(child: _row(context)),
        ),
      ],
      states: <Widget>[
        _DirectionCell(
          label: 'mirrored icon (rtl)',
          child: HoronDirection.rtl(
            child: Row(
              spacing: HoronSpace.s3,
              children: <Widget>[
                HoronDirectionalIcon(child: _arrow(context)),
                const Text('화살표는 뒤집힙니다'),
              ],
            ),
          ),
        ),
        _DirectionCell(
          label: 'unmirrored icon (rtl)',
          child: HoronDirection.rtl(
            child: Row(
              spacing: HoronSpace.s3,
              children: <Widget>[
                HoronDirectionalIcon(mirror: false, child: _arrow(context)),
                const Text('대칭 아이콘은 그대로입니다'),
              ],
            ),
          ),
        ),
        _DirectionCell(
          label: 'start inset 12 / end inset 4 (rtl)',
          child: HoronDirection.rtl(
            child: SizedBox(
              width: double.infinity,
              child: Padding(
                padding: HoronDirection.insets(
                  start: HoronSpace.s3,
                  end: HoronSpace.s1,
                ),
                child: const _InsetSample(),
              ),
            ),
          ),
        ),
        _DirectionCell(
          label: 'resolved value (rtl)',
          child: HoronDirection.rtl(
            child: Builder(
              builder: (BuildContext inner) {
                final double value = HoronDirection.resolve(
                  inner,
                  ltr: 0,
                  rtl: 1,
                );
                return Text('resolve → $value');
              },
            ),
          ),
        ),
      ],
      notes:
          'React `direction.tsx`는 `DirectionProvider` 래퍼 하나입니다. Flutter는 '
          '`Directionality`가 이미 방향을 세우므로 이 컴포넌트는 그 값을 세우고, RTL에서 손으로 '
          '뒤집어야 하는 자리(좌우가 다른 아이콘, 못 박힌 여백)를 헬퍼로 모읍니다. '
          '`EdgeInsetsDirectional`·`AlignmentDirectional`은 Flutter가 알아서 뒤집습니다.',
    );
  }

  /// 방향이 보이는 두 칸짜리 줄입니다.
  Widget _row(BuildContext context) {
    return Row(
      spacing: HoronSpace.s3,
      children: <Widget>[
        HoronDirectionalIcon(child: _arrow(context)),
        const Text('시작'),
        const Text('·'),
        const Text('가운데'),
        const Text('·'),
        const Text('끝'),
      ],
    );
  }

  /// 좌우가 다른 화살표입니다. 아이콘 폰트를 번들하지 않으므로 직접 그립니다.
  Widget _arrow(BuildContext context) => SizedBox.square(
    dimension: HoronSpace.s4,
    child: CustomPaint(
      painter: _ArrowPainter(color: Theme.of(context).colorScheme.onSurface),
    ),
  );
}

/// 오른쪽을 가리키는 화살표입니다. RTL에서 뒤집히면 왼쪽을 가리킵니다.
class _ArrowPainter extends CustomPainter {
  const _ArrowPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * _arrowStrokeRatio
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final double width = size.width;
    final double height = size.height;
    canvas.drawLine(
      Offset(0.15 * width, height / 2),
      Offset(0.85 * width, height / 2),
      paint,
    );
    canvas.drawPath(
      Path()
        ..moveTo(0.55 * width, 0.2 * height)
        ..lineTo(0.85 * width, height / 2)
        ..lineTo(0.55 * width, 0.8 * height),
      paint,
    );
  }

  @override
  bool shouldRepaint(_ArrowPainter oldDelegate) => color != oldDelegate.color;
}

/// lucide 기본 선 두께(2)를 24 단위 상자에 대한 비율로 옮긴 값입니다.
const double _arrowStrokeRatio = 2 / 24;

/// 여백이 어느 쪽에 붙는지 보이도록 만든 막대입니다.
/// 여백이 어느 쪽에 붙는지 보이도록 만든 막대입니다.
///
/// 바깥 여백은 방향을 따르는 `start`·`end`이므로, RTL에서는 12가 오른쪽, 4가 왼쪽에
/// 붙습니다. 막대가 폭을 채워야 그 차이가 보입니다.
class _InsetSample extends StatelessWidget {
  const _InsetSample();

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: double.infinity,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: scheme.secondary,
          borderRadius: BorderRadius.circular(HoronRadiusRole.control),
          border: Border.all(color: scheme.outline),
        ),
        child: Padding(
          padding: const EdgeInsets.all(HoronSpace.s1),
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: scheme.primary,
              borderRadius: BorderRadius.circular(HoronRadiusRole.control),
            ),
            child: const SizedBox(
              height: HoronSpace.s3,
              width: double.infinity,
            ),
          ),
        ),
      ),
    );
  }
}

/// 방향 하나를 이름과 함께 보여 주는 칸입니다.
class _DirectionCell extends StatelessWidget {
  const _DirectionCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          DecoratedBox(
            decoration: BoxDecoration(
              color: scheme.surface,
              borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              border: Border.all(color: scheme.outline),
            ),
            child: Padding(
              padding: const EdgeInsets.all(HoronSpace.s3),
              child: child,
            ),
          ),
        ],
      ),
    );
  }
}
