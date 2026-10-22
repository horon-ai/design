import 'package:flutter/widgets.dart';

/// `direction.tsx`의 `DirectionProvider`입니다.
///
/// React는 Base UI의 `DirectionProvider`를 감싸고 `direction` 하나(기본 `ltr`)를 넘깁니다.
/// Flutter에는 같은 역할을 하는 [Directionality]가 이미 있으므로 이 위젯은 그 값을 세우고,
/// RTL에서 손으로 뒤집어야 하는 자리를 정적 헬퍼로 모읍니다.
///
/// Flutter가 알아서 뒤집는 것과 손으로 뒤집어야 하는 것이 나뉩니다.
///
/// | 쓰는 것 | RTL에서 |
/// | --- | --- |
/// | [EdgeInsetsDirectional], [AlignmentDirectional], [BorderRadiusDirectional] | 자동으로 뒤집힘 |
/// | [Row]의 자식 순서 | 뒤집히지 않음 |
/// | 아이콘 그림 | 뒤집히지 않음(좌우 대칭이 아닌 화살표는 손으로 뒤집어야 함) |
/// | 왼쪽/오른쪽을 못 박은 [EdgeInsets], [Alignment] | 뒤집히지 않음 |
///
/// 그래서 컴포넌트는 방향이 있는 값에 `…Directional`을 쓰고, 좌우가 다른 아이콘에는
/// [mirrorIcon]이나 [HoronDirectionalIcon]을 씁니다.
///
/// ```dart
/// HoronDirection.rtl(child: HoronMessage.end(children: parts));
///
/// final Widget arrow = HoronDirection.mirrorIcon(context, const Icon(Icons.arrow_forward));
/// final EdgeInsetsGeometry padding = HoronDirection.insets(start: HoronSpace.s3);
/// ```
class HoronDirection extends StatelessWidget {
  /// [textDirection]의 방향을 세우는 위젯을 만듭니다. 기본값은 React와 같은 `ltr`입니다.
  const HoronDirection({super.key, this.textDirection = TextDirection.ltr, required this.child});

  /// 왼쪽에서 오른쪽 방향을 세웁니다.
  const HoronDirection.ltr({super.key, required this.child}) : textDirection = TextDirection.ltr;

  /// 오른쪽에서 왼쪽 방향을 세웁니다.
  const HoronDirection.rtl({super.key, required this.child}) : textDirection = TextDirection.rtl;

  /// 세울 방향입니다.
  final TextDirection textDirection;

  /// 방향을 받을 자식입니다.
  final Widget child;

  /// 지금 방향입니다. 주변 [Directionality]가 없으면 왼쪽에서 오른쪽으로 봅니다.
  static TextDirection of(BuildContext context) => Directionality.maybeOf(context) ?? TextDirection.ltr;

  /// 지금 방향이 오른쪽에서 왼쪽인지 여부입니다.
  static bool isRtl(BuildContext context) => of(context) == TextDirection.rtl;

  /// 아이콘을 RTL에서 좌우로 뒤집습니다.
  ///
  /// 화살표·재생·들여쓰기 표시처럼 좌우가 다른 아이콘에 씁니다. 뒤집으면 안 되는
  /// 아이콘(체크, 시계, 아바타)은 [mirror]를 거짓으로 넘깁니다.
  static Widget mirrorIcon(BuildContext context, Widget icon, {bool mirror = true}) {
    if (!mirror || !isRtl(context)) return icon;
    return Transform.flip(flipX: true, child: icon);
  }

  /// 글자 시작·끝 기준 여백을 만듭니다.
  ///
  /// [EdgeInsetsDirectional]은 방향을 따르므로 RTL에서 좌우가 뒤집힙니다.
  /// `EdgeInsets.only(left: …)`처럼 방향을 못 박은 값을 대신 씁니다.
  static EdgeInsetsGeometry insets({double start = 0, double end = 0, double top = 0, double bottom = 0}) =>
      EdgeInsetsDirectional.only(start: start, end: end, top: top, bottom: bottom);

  /// 글자 시작·끝 기준 정렬을 고릅니다.
  static AlignmentGeometry align({required bool atEnd}) =>
      atEnd ? AlignmentDirectional.centerEnd : AlignmentDirectional.centerStart;

  /// 방향에 따라 두 값 중 하나를 고릅니다.
  ///
  /// 여백이 아닌 값(그림자 오프셋, 회전 각도)에 씁니다.
  static double resolve(BuildContext context, {required double ltr, required double rtl}) => isRtl(context) ? rtl : ltr;

  @override
  Widget build(BuildContext context) => Directionality(textDirection: textDirection, child: child);
}

/// 아이콘 자리 하나를 RTL에서 뒤집습니다.
///
/// 아이콘 폰트는 호스트가 공급하므로 이 패키지는 어떤 [IconData]도 고르지 않습니다.
/// 받은 그림을 [HoronDirection.mirrorIcon]으로 감싸기만 합니다.
class HoronDirectionalIcon extends StatelessWidget {
  /// 뒤집히는 아이콘 자리를 만듭니다.
  const HoronDirectionalIcon({super.key, required this.child, this.mirror = true});

  /// 아이콘 그림입니다.
  final Widget child;

  /// 참이면 RTL에서 좌우로 뒤집습니다. 좌우 대칭인 아이콘은 거짓으로 끕니다.
  final bool mirror;

  @override
  Widget build(BuildContext context) => HoronDirection.mirrorIcon(context, child, mirror: mirror);
}
