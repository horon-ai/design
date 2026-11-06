import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

// 모달 패널(HoronModal)은 컴포넌트 폴더에 있지만, 배럴이 이 파일을 이미 내보내므로
// 통합 스크립트가 components/modal.dart를 배럴에 넣기 전에도 같은 이름으로 보입니다.
export '../components/modal.dart';

/// 모달 하나를 띄웁니다.
///
/// Material의 `showDialog`나 `showModalBottomSheet`을 쓰지 않습니다. 그 둘은
/// Material 고유의 표면과 전환을 들고 오기 때문입니다. 대신 [RawDialogRoute]를
/// 상속한 라우트를 만들어 배경 스크림을 토큰에서 읽고, 패널은 호출자가
/// [HoronModalSurface]이나 `HoronModal`로 그립니다. 라우트 경계(`scopesRoute` 시맨틱)와
/// 접이식 기기의 서브 화면 처리는 [RawDialogRoute]가 맡습니다.
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

/// `bg-bg-scrim/32` — 스크림 불투명도입니다.
const double _scrimOpacity = 0.32;

/// `backdrop-blur-[6px]` — 스크림 뒤 배경 흐림 반경입니다.
const double _scrimBlur = 6;

class _HoronModalRoute<T> extends RawDialogRoute<T> {
  _HoronModalRoute({required WidgetBuilder builder, required bool dismissible, super.barrierLabel})
    : super(
        pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
          final HoronColors colors = HoronTheme.of(context).colors;
          return Stack(
            children: <Widget>[
              // 스크림을 직접 그립니다. `barrierColor`를 쓰면 위젯 트리 밖에서 그려져
              // 테마 토큰을 읽을 수 없습니다.
              Positioned.fill(
                child: BackdropFilter(
                  filter: ui.ImageFilter.blur(sigmaX: _scrimBlur, sigmaY: _scrimBlur),
                  child: ColoredBox(color: colors.bgScrim.withValues(alpha: _scrimOpacity)),
                ),
              ),
              // 스크림을 눌러 닫는 경로입니다.
              if (dismissible)
                Positioned.fill(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () => Navigator.of(context).maybePop(),
                  ),
                ),
              builder(context),
            ],
          );
        },
        barrierDismissible: dismissible,
        // 배경 스크림은 페이지가 직접 그리므로 라우트 배리어는 투명합니다.
        barrierColor: null,
        transitionDuration: HoronMotion.popupEnterDuration,
        // SDK 기본 전환은 `FadeTransition`입니다. 페이지가 이미 스크림 페이드를
        // 들고 있으므로 두 번 겹치지 않게 항등으로 넘깁니다.
        transitionBuilder: (
          BuildContext context,
          Animation<double> animation,
          Animation<double> secondaryAnimation,
          Widget child,
        ) => child,
      );
}

/// 범용 모달 패널입니다.
///
/// 특정 컴포넌트에 속하지 않는 모달 본문을 감싸는 상자로, `bg-surface` 채움과
/// `border-default` 테두리, `shadow-palette` 그림자를 씁니다. 제품 모달은
/// `HoronModal`(components/modal.dart) 또는 `HoronDialog`를 쓰고, 이 위젯은
/// [showHoronModal]로 임의의 내용을 띄우는 자리에 남겨 둡니다.
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
    final HoronColors colors = theme.colors;
    final BorderRadius radius = borderRadius ?? BorderRadius.circular(theme.radius.xl);

    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: maxWidth ?? double.infinity, maxHeight: maxHeight ?? double.infinity),
      // `InkWell` 같은 Material 위젯은 `Material` 조상을 요구합니다. 모달은
      // 라우트 위에 그려져 Scaffold 밖이므로 여기서 하나 세웁니다.
      child: Material(
        type: MaterialType.transparency,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: colors.bgSurface,
            borderRadius: radius,
            border: Border.all(color: colors.borderDefault),
            boxShadow: theme.shadows.palette,
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
