// veil 표면입니다. 웹(`packages/react/src/styles/globals.css`)의 `.veil-field`,
// `.veil-overlay`, `.veil-drop`과 같은 층을 그립니다.
//
// 층은 아래에서 위로 셋입니다.
//
//   1. 그림자 — 종류별 soft shadow(`0 2px 10px` 또는 `0 6px 24px`)와 1px 링을
//      [BoxShadow]로 표면 바깥에 칠합니다. CSS의 바깥 box-shadow는 테두리 상자 안쪽을
//      칠하지 않으므로, Flutter의 [BoxShadow]가 안쪽까지 채우는 차이를 바깥 영역 클립으로
//      없앱니다. 그래야 반투명 채움(필드 6%)이 링 색과 겹쳐 두 배로 짙어지지 않습니다.
//   2. 뒤 배경 — `blur`만큼 흐린 뒤 `saturate`만큼 채도를 올립니다(토큰 값).
//   3. 채움   — 필드·오버레이 상태별 채움 한 겹. 뒤 배경 필터 위에 칠합니다.
//
// `.veil-field`는 `.veil-field:focus-within`에서 `field-focus`로 채움이 바뀌고,
// `.veil-drop`은 링 없이 점선 테두리가 유일한 윤곽입니다. 뒤 배경을 필터할 수 없을
// 때(동작 줄이기로 대신 판정)는 `glass-fill-frost` 한 겹으로 내려갑니다.

import 'package:flutter/widgets.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'glass_geometry.dart';

/// veil 표면의 종류입니다. React의 `.veil-field`·`.veil-overlay`·`.veil-drop`과 같습니다.
enum HoronVeilKind {
  /// 입력 필드입니다. 기본 채움은 `field`, 포커스에는 `fieldFocus`이고 1px 링이 있습니다.
  field,

  /// 떠 있는 오버레이입니다. 74% 채움과 1px 링, `0 6px 24px` 그림자를 씁니다.
  overlay,

  /// 파일 드롭 영역입니다. 링이 없고 점선 테두리가 유일한 윤곽입니다.
  drop,
}

/// veil 표면의 노드를 찾기 위한 키입니다. 테스트가 각 층을 검사합니다.
abstract final class HoronVeilKeys {
  /// 그림자와 링을 담은 장식입니다. 서리 단계에서도 있습니다.
  static const Key decoration = Key('horon-veil-decoration');

  /// 뒤 배경을 필터하는 레이어입니다. 서리 단계에는 없습니다.
  static const Key backdrop = Key('horon-veil-backdrop');

  /// 반투명 채움 레이어입니다.
  static const Key fill = Key('horon-veil-fill');

  /// 서리 단계의 불투명 채움입니다.
  static const Key frost = Key('horon-veil-frost');
}

/// 필드·오버레이·드롭 영역에 까는 가벼운 유리 표면입니다.
///
/// ```dart
/// HoronVeil(
///   kind: HoronVeilKind.field,
///   focused: focusNode.hasFocus,
///   child: TextField(...),
/// )
/// ```
///
/// 표면은 내용의 크기를 따릅니다. 링은 그림자 자리에 그리므로 호출자가 테두리를 비우면
/// 기존 1px 테두리와 겹치지 않습니다. [HoronVeilKind.field]에서 [invalid]이면 링만
/// `colors.borderDanger`가 되고 굵기는 그대로입니다.
class HoronVeil extends StatelessWidget {
  /// veil 표면을 만듭니다.
  const HoronVeil({
    super.key,
    this.kind = HoronVeilKind.field,
    this.borderRadius,
    this.focused = false,
    this.invalid = false,
    this.child,
  });

  /// 표면의 종류입니다.
  final HoronVeilKind kind;

  /// 표면의 모서리 반경입니다. 없으면 필드 12, 오버레이 20, 드롭 10입니다.
  final BorderRadius? borderRadius;

  /// 필드가 포커스를 받았는지 여부입니다. 필드 채움만 바꿉니다.
  final bool focused;

  /// 필드가 오류 상태인지 여부입니다. 필드 링만 `border-danger`로 바꿉니다.
  final bool invalid;

  /// 표면 안의 내용입니다. 내용이 표면의 크기를 정합니다.
  final Widget? child;

  /// 종류별 기본 반경입니다. React의 `rounded-md`·`rounded-xl`·`rounded-[10px]`입니다.
  double _defaultRadius(HoronThemeData horon) => switch (kind) {
    HoronVeilKind.field => horon.radius.md,
    HoronVeilKind.overlay => horon.radius.xl,
    HoronVeilKind.drop => horon.space.step(2.5),
  };

  /// 종류와 상태에 맞는 채움입니다.
  Color _fill(HoronVeilScheme scheme) => switch (kind) {
    HoronVeilKind.field => focused ? scheme.fieldFocus : scheme.field,
    HoronVeilKind.overlay => scheme.overlay,
    HoronVeilKind.drop => scheme.field,
  };

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronVeilTokens veil = horon.veil;
    final HoronVeilScheme scheme = veil.forBrightness(horon.brightness);
    final BorderRadius radius = borderRadius ?? BorderRadius.circular(_defaultRadius(horon));

    // Flutter에는 `prefers-reduced-transparency` 질의가 없습니다. React가 투명도 축소에서
    // 서리 채움으로 내려가므로, 같은 자리를 동작 줄이기 설정으로 대신합니다.
    final bool frost = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    final Color fill = frost ? horon.colors.glassFillFrost : _fill(scheme);
    final bool ring = kind != HoronVeilKind.drop;
    final Color ringColor = kind == HoronVeilKind.field && invalid ? horon.colors.borderDanger : scheme.ring;
    final List<BoxShadow> shadows = <BoxShadow>[
      if (ring) BoxShadow(color: ringColor, spreadRadius: veil.ringWidth, blurRadius: 0),
      ...switch (kind) {
        HoronVeilKind.overlay => scheme.overlayShadow,
        HoronVeilKind.field || HoronVeilKind.drop => scheme.fieldShadow,
      },
    ];

    final Widget surface = ClipRRect(
      borderRadius: radius,
      child: Stack(
        fit: StackFit.passthrough,
        children: <Widget>[
          Positioned.fill(
            child: frost
                ? ColoredBox(key: HoronVeilKeys.frost, color: fill)
                : BackdropFilter(
                    key: HoronVeilKeys.backdrop,
                    filter: horonVeilBackdropFilter(veil),
                    child: ColoredBox(key: HoronVeilKeys.fill, color: fill),
                  ),
          ),
          child ?? const SizedBox.shrink(),
        ],
      ),
    );

    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned.fill(
          child: IgnorePointer(
            child: ClipPath(
              clipper: HoronVeilOutsideClipper(radius: radius),
              child: DecoratedBox(
                key: HoronVeilKeys.decoration,
                decoration: BoxDecoration(borderRadius: radius, boxShadow: shadows),
              ),
            ),
          ),
        ),
        surface,
      ],
    );
  }
}

/// 표면 바깥 영역만 남기는 클리퍼입니다.
///
/// CSS의 바깥 box-shadow는 테두리 상자 안쪽을 칠하지 않습니다. Flutter의 [BoxShadow]는
/// 안쪽까지 채우므로, 안쪽 둥근 사각형을 뺀 바깥 영역만 남겨 같은 결과를 냅니다.
class HoronVeilOutsideClipper extends CustomClipper<Path> {
  /// 표면의 모서리 반경을 받습니다.
  const HoronVeilOutsideClipper({required this.radius});

  /// 표면의 모서리 반경입니다.
  final BorderRadius radius;

  @override
  Path getClip(Size size) => Path.combine(
    PathOperation.difference,
    Path()..addRect((Offset.zero & size).inflate(_maxShadowExtent)),
    Path()..addRRect(radius.toRRect(Offset.zero & size)),
  );

  @override
  bool shouldReclip(HoronVeilOutsideClipper oldClipper) => radius != oldClipper.radius;
}

/// 그림자가 잘리지 않도록 클립 사각형을 넉넉히 넓히는 값입니다.
const double _maxShadowExtent = 64;
