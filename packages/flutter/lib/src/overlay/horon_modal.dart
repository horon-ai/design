import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 모달 하나를 띄웁니다.
///
/// Material의 `showDialog`나 `showModalBottomSheet`을 쓰지 않습니다. 그 둘은
/// Material 고유의 표면과 전환을 들고 오기 때문입니다. 대신 [PopupRoute]를 직접
/// 만들어 배경 스크림을 토큰에서 읽고, 패널은 호출자가 [HoronModalSurface]로
/// 그립니다.
///
/// [dismissible]이 참이면 스크림을 눌렀을 때, 또는 뒤로 가기에서 닫힙니다.
Future<T?> showHoronModal<T>(
  BuildContext context, {
  required WidgetBuilder builder,
  bool dismissible = true,
  String? barrierLabel,
}) {
  return Navigator.of(context)
      .push<T>(_HoronModalRoute<T>(builder: builder, dismissible: dismissible, barrierLabel: barrierLabel));
}

class _HoronModalRoute<T> extends PopupRoute<T> {
  _HoronModalRoute({required this.builder, required this.dismissible, required this.barrierLabel});

  final WidgetBuilder builder;
  final bool dismissible;

  @override
  final String? barrierLabel;

  @override
  bool get barrierDismissible => dismissible;

  /// 배경 스크림입니다.
  ///
  /// 계획이 `Colors.black54`를 금지한 자리입니다. 값은 [ColorScheme.scrim]이고
  /// 토큰의 `sand1200Scrim`입니다.
  @override
  Color? get barrierColor => null;

  @override
  Duration get transitionDuration => const Duration(milliseconds: HoronDuration.fast);

  @override
  Widget buildPage(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
    final Color scrim = Theme.of(context).colorScheme.scrim;
    return Stack(
      children: <Widget>[
        // 스크림을 직접 그립니다. `barrierColor`를 쓰면 위젯 트리 밖에서 그려져
        // 테마 토큰을 읽을 수 없습니다.
        Positioned.fill(child: ColoredBox(color: scrim)),
        // 스크림을 눌러 닫는 경로입니다.
        if (dismissible)
          Positioned.fill(
            child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).maybePop()),
          ),
        builder(context),
      ],
    );
  }
}

/// 모달 패널의 표면입니다.
///
/// `glass-strong` 표면 + 테두리 + 그림자를 한 자리에 묶습니다. 배경 흐림이
/// 패널 사각형 밖으로 번지지 않게 자릅니다.
class HoronModalSurface extends StatelessWidget {
  /// 표면을 만듭니다.
  const HoronModalSurface({
    super.key,
    required this.child,
    this.borderRadius,
    this.padding = const EdgeInsets.all(HoronSpace.s4),
    this.maxWidth,
    this.maxHeight,
  });

  /// 표면 안의 내용입니다.
  final Widget child;

  /// 표면의 반경입니다. 없으면 [HoronRadiusRole.panel]입니다.
  final BorderRadius? borderRadius;

  /// 안쪽 여백입니다. React의 `p-4`입니다.
  final EdgeInsetsGeometry padding;

  /// 넘지 않을 최대 폭입니다.
  final double? maxWidth;

  /// 넘지 않을 최대 높이입니다.
  final double? maxHeight;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = borderRadius ?? BorderRadius.circular(HoronRadiusRole.panel);

    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: maxWidth ?? double.infinity, maxHeight: maxHeight ?? double.infinity),
      // `InkWell` 같은 Material 위젯은 `Material` 조상을 요구합니다. 모달은
      // 라우트 위에 그려져 Scaffold 밖이므로 여기서 하나 세웁니다.
      child: Material(
        type: MaterialType.transparency,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: theme.glassFillStrong,
            borderRadius: radius,
            border: Border.all(color: theme.glassBorder),
            boxShadow: HoronShadow.lg,
          ),
          child: ClipRRect(
            borderRadius: radius,
            child: Padding(padding: padding, child: child),
          ),
        ),
      ),
    );
  }
}
