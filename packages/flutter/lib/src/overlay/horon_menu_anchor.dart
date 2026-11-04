import 'package:flutter/widgets.dart';

/// horon 팝업이 공통으로 쓰는 메뉴 앵커입니다.
///
/// 열림 상태, 바깥 탭 닫기, Escape 닫기, 조상 스크롤·화면 크기 변화 시 닫기를
/// Flutter SDK widgets 계층의 [RawMenuAnchor]에 맡깁니다. 이 위젯이 더하는 것은
/// 두 가지입니다.
///
/// 1. 루트 앵커는 바깥 탭에 스스로 닫히지 않으므로, 패널을 같은 탭 리전으로 묶어
///    바깥 탭에서 [MenuController.close]를 부릅니다.
/// 2. 패널에 포커스를 주고 Escape를 `DismissIntent`로 받아 닫습니다. [RawMenuAnchor]는
///    메뉴의 포커스와 시맨틱을 다루지 않기 때문입니다.
///
/// 팝업의 위치와 폭은 호출자가 [overlayBuilder]에서 정합니다. 이 위젯은 패널을
/// 그리는 자리만 마련하고 배치에는 관여하지 않습니다.
class HoronMenuAnchor extends StatelessWidget {
  /// 메뉴 앵커를 만듭니다.
  const HoronMenuAnchor({
    super.key,
    required this.controller,
    required this.child,
    this.builder,
    required this.overlayBuilder,
    this.absorbOutsideTaps = false,
    this.onOpen,
    this.onClose,
  });

  /// 열고 닫는 컨트롤러입니다.
  final MenuController controller;

  /// 트리거 위젯입니다.
  final Widget child;

  /// 트리거를 감싸는 빌더입니다. 넘기지 않으면 [child]가 그대로 쓰입니다.
  final RawMenuAnchorChildBuilder? builder;

  /// 패널을 만드는 함수입니다. 앵커 사각형과 탭 리전 식별자를 받습니다.
  final Widget Function(BuildContext context, RawMenuOverlayInfo info) overlayBuilder;

  /// 바깥 탭을 삼킬지 정합니다.
  ///
  /// `false`면 바깥 탭이 아래 위젯까지 전달되고, `true`면 패널을 덮는 막이 탭을
  /// 먹고 메뉴만 닫습니다. 메뉴처럼 뒤 화면을 누르지 못하게 하던 자리는 `true`를,
  /// 셀렉트·날짜 필드처럼 통과시키던 자리는 `false`를 씁니다.
  final bool absorbOutsideTaps;

  /// 메뉴가 열렸을 때 부릅니다.
  final VoidCallback? onOpen;

  /// 메뉴가 닫혔을 때 부릅니다.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    return RawMenuAnchor(
      controller: controller,
      useRootOverlay: false,
      consumeOutsideTaps: false,
      onOpen: onOpen,
      onClose: onClose,
      builder: builder,
      child: child,
      overlayBuilder: (BuildContext context, RawMenuOverlayInfo info) {
        final Widget panel = Focus(autofocus: true, child: overlayBuilder(context, info));
        if (absorbOutsideTaps) {
          return Stack(
            children: <Widget>[
              Positioned.fill(
                child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: controller.close),
              ),
              panel,
            ],
          );
        }
        return TapRegion(groupId: info.tapRegionGroupId, onTapOutside: (_) => controller.close(), child: panel);
      },
    );
  }
}
