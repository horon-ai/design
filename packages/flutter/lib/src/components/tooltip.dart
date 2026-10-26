import 'dart:async';

import 'package:flutter/gestures.dart' show PointerEnterEvent, PointerExitEvent;
import 'package:flutter/material.dart';

import '../overlay/horon_overlay.dart';
import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `tooltip.tsx`의 `max-w-xs`입니다.
const double _tooltipMaxWidth = 320.0;

/// `tooltip.tsx`의 `text-[11px]`입니다. 생성 스케일의 12보다 작은 값이라 이름을 붙입니다.
const double _tooltipFontSize = 11.0;

/// `tooltip.tsx`의 `px-2.5`입니다.
const double _tooltipPaddingHorizontal = HoronSpace.s2_5;

/// `tooltip.tsx`의 `py-1.5`입니다.
const double _tooltipPaddingVertical = HoronSpace.s1_5;

/// `tooltip.tsx`의 `gap-1.5`입니다. 글자와 `kbd` 사이 간격입니다.
const double _tooltipGap = HoronSpace.s1_5;

/// `tooltip.tsx` 화살표의 밑변입니다. `size-2.5`(10)입니다.
const double _arrowWidth = 10.0;

/// 화살표가 패널 밖으로 내미는 길이입니다.
///
/// React는 10짜리 정사각형을 45도 돌려 붙이므로 대각선 절반이 7.07입니다. 그대로
/// 쓰면 트리거와 패널 사이 간격 4를 넘어 트리거를 덮습니다. 6으로 두면 트리거
/// 앞 2에서 멈춥니다.
const double _arrowExtent = 6.0;

/// 화살표의 선 두께입니다. CSS의 `border` 1px입니다.
const double _arrowBorderWidth = 1.0;

/// 포인터가 빠진 뒤 툴팁이 닫히기까지의 기본 시간입니다.
///
/// 0으로 두면 패널이 뜨는 순간의 마우스 추적기 재평가(아래 `_handleHover` 주석)가
/// 곧바로 닫아 버립니다. 짧은 여유를 두면 그 재평가가 만드는 `onExit`이 `onEnter`에
/// 곧바로 취소됩니다.
const Duration horonTooltipCloseDelay = Duration(milliseconds: 100);

/// 툴팁이 뜨기 전 기다리는 시간을 자식에게 전달합니다.
///
/// `tooltip.tsx`의 `TooltipProvider`입니다. React의 `delay` 기본값은 0이고,
/// [HoronTooltip]은 자기 [HoronTooltip.delay]가 없을 때 이 값을 씁니다.
///
/// ```dart
/// HoronTooltipProvider(
///   delay: const Duration(milliseconds: 400),
///   child: screen,
/// );
/// ```
class HoronTooltipProvider extends InheritedWidget {
  /// 제공자를 만듭니다.
  const HoronTooltipProvider({super.key, this.delay = Duration.zero, required super.child});

  /// 포인터가 올라온 뒤 툴팁이 뜨기까지의 시간입니다.
  final Duration delay;

  /// 가장 가까운 제공자를 찾습니다. 없으면 null입니다.
  static HoronTooltipProvider? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<HoronTooltipProvider>();

  @override
  bool updateShouldNotify(HoronTooltipProvider oldWidget) => delay != oldWidget.delay;
}

/// 툴팁의 유리 표면과 화살표입니다.
///
/// `tooltip.tsx`의 `TooltipContent`입니다. React의 클래스는 `glass-strong z-50
/// inline-flex w-fit max-w-xs items-center gap-1.5 rounded-md px-2.5 py-1.5
/// text-[11px] font-medium`이고, 뒤에 45도 돌린 화살표가 붙습니다.
///
/// 화살표는 장식이 아니라 계약입니다. 그래서 이 컴포넌트를 텍스트 전용
/// [Tooltip] 위젯으로 대신하지 않습니다. 표면은 공유 유틸의
/// [HoronOverlayPanel]이 그리고, 화살표는 그 사각형 밖으로 내밀어 붙입니다.
/// React의 화살표도 팝업 밖으로 나가 트리거를 조금 덮습니다.
///
/// ```dart
/// HoronTooltipContent(
///   side: HoronOverlaySide.top,
///   kbd: const HoronKbd(label: 'K'),
///   child: const Text('검색'),
/// );
/// ```
class HoronTooltipContent extends StatelessWidget {
  /// 툴팁 표면 하나를 만듭니다.
  const HoronTooltipContent({
    super.key,
    required this.child,
    this.kbd,
    this.side = HoronOverlaySide.top,
    this.maxWidth,
    this.maxHeight,
  });

  /// 화살표 자리를 찾는 키입니다.
  ///
  /// 화살표는 표면과 한 덩어리로 그려지므로 별도 위젯이 아닙니다. 이 키를 단
  /// 빈 상자가 화살표가 차지하는 자리를 표시하고, 테스트가 그 사각형을 잽니다.
  static const Key arrowKey = Key('horon-tooltip-arrow');

  /// 화살표가 패널 밖으로 내미는 길이입니다.
  static const double arrowExtent = _arrowExtent;

  /// 화살표 밑변의 길이입니다.
  static const double arrowWidth = _arrowWidth;

  /// 툴팁의 본문입니다.
  final Widget child;

  /// 오른쪽에 붙는 단축키 슬롯입니다. React의 `data-slot="kbd"` 자리입니다.
  final Widget? kbd;

  /// 화살표가 붙는 변입니다. 배치가 뒤집히면 실제 방향을 넘깁니다.
  final HoronOverlaySide side;

  /// 넘지 않을 최대 폭입니다. 기본값은 `max-w-xs`(320)입니다.
  final double? maxWidth;

  /// 넘지 않을 최대 높이입니다.
  final double? maxHeight;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final Widget? trailing = kbd;

    // `has-data-[slot=kbd]:pr-1.5` — kbd가 있으면 오른쪽 여백을 줄입니다.
    final EdgeInsets bodyPadding = EdgeInsets.only(
      left: _tooltipPaddingHorizontal,
      right: trailing == null ? _tooltipPaddingHorizontal : _tooltipPaddingVertical,
      top: _tooltipPaddingVertical,
      bottom: _tooltipPaddingVertical,
    );

    // 화살표가 붙는 변에 그 길이만큼 띠를 예약합니다. 띠는 표면 사각형 안에
    // 있으므로 배치 계산이 화살표까지 포함해 뒤집힘과 크기 제한을 판단합니다.
    final EdgeInsets arrowStrip = switch (side) {
      HoronOverlaySide.top => const EdgeInsets.only(bottom: _arrowExtent),
      HoronOverlaySide.bottom => const EdgeInsets.only(top: _arrowExtent),
      HoronOverlaySide.left => const EdgeInsets.only(right: _arrowExtent),
      HoronOverlaySide.right => const EdgeInsets.only(left: _arrowExtent),
    };

    final bool vertical = side == HoronOverlaySide.top || side == HoronOverlaySide.bottom;

    return ConstrainedBox(
      constraints: BoxConstraints(
        maxWidth: (maxWidth ?? _tooltipMaxWidth) + (vertical ? 0 : _arrowExtent),
        maxHeight: maxHeight == null ? double.infinity : maxHeight! + (vertical ? _arrowExtent : 0),
      ),
      child: CustomPaint(
        painter: _HoronTooltipSurfacePainter(side: side, fill: horon.glassFillStrong, border: horon.glassBorder),
        child: Stack(
          children: <Widget>[
            Padding(
              padding: arrowStrip,
              child: Padding(
                padding: bodyPadding,
                child: DefaultTextStyle.merge(
                  style: TextStyle(
                    fontFamily: HoronFont.body,
                    fontFamilyFallback: HoronFont.fontFamilyFallback,
                    fontSize: _tooltipFontSize,
                    fontWeight: HoronFontWeight.medium,
                    height: HoronLineHeight.snug,
                    color: scheme.onSurface,
                    // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란
                    // 이중 밑줄이 새어 들어오지 않게 명시합니다.
                    decoration: TextDecoration.none,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Flexible(child: child),
                      if (trailing != null) ...<Widget>[const SizedBox(width: _tooltipGap), trailing],
                    ],
                  ),
                ),
              ),
            ),
            // 화살표가 그려지는 자리를 표시하는 빈 상자입니다. 그리지는 않습니다.
            Positioned.fill(
              child: Align(
                alignment: switch (side) {
                  HoronOverlaySide.top => Alignment.bottomCenter,
                  HoronOverlaySide.bottom => Alignment.topCenter,
                  HoronOverlaySide.left => Alignment.centerRight,
                  HoronOverlaySide.right => Alignment.centerLeft,
                },
                child: SizedBox(
                  key: arrowKey,
                  width: vertical ? _arrowWidth : _arrowExtent,
                  height: vertical ? _arrowExtent : _arrowWidth,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 툴팁 표면을 하나의 실루엣으로 그립니다.
///
/// 둥근 사각형과 화살표 삼각형을 합친 경로 하나에 그림자·채움·테두리를 칠합니다.
/// 표면과 화살표를 따로 그리면 두 가지가 어긋납니다. 하나는 패널 그림자가 화살표
/// 띠에 깔려 회색 선반이 생기는 것이고, 다른 하나는 화살표의 반투명 채움이 패널
/// 위와 페이지 위에서 다르게 읽혀 화살표만 희게 뜨는 것입니다. 2026-10-22 캡처에서
/// 둘 다 확인했습니다. React도 화살표가 팝업에 붙어 한 덩어리로 보입니다.
class _HoronTooltipSurfacePainter extends CustomPainter {
  const _HoronTooltipSurfacePainter({required this.side, required this.fill, required this.border});

  final HoronOverlaySide side;
  final Color fill;
  final Color border;

  @override
  void paint(Canvas canvas, Size size) {
    final Path silhouette = _silhouette(side, size);

    // `HoronShadow.lg`의 두 겹을 같은 경로에 칠합니다. CSS의 box-shadow와 같은
    // 인상이 나오도록 blur 반지름의 절반을 MaskFilter로 옮깁니다.
    for (final BoxShadow shadow in HoronShadow.lg) {
      canvas.drawPath(
        silhouette.shift(shadow.offset),
        Paint()
          ..color = shadow.color
          ..maskFilter = MaskFilter.blur(BlurStyle.normal, shadow.blurRadius / 2),
      );
    }
    canvas.drawPath(silhouette, Paint()..color = fill);
    canvas.drawPath(
      silhouette,
      Paint()
        ..color = border
        ..style = PaintingStyle.stroke
        ..strokeWidth = _arrowBorderWidth
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(_HoronTooltipSurfacePainter oldDelegate) =>
      side != oldDelegate.side || fill != oldDelegate.fill || border != oldDelegate.border;
}

/// 패널 사각형과 화살표 삼각형을 합친 경로입니다.
///
/// 화살표는 [side]가 가리키는 변의 반대쪽, 즉 트리거를 향한 변에 붙습니다. 띠의
/// 폭은 [_arrowExtent]이고, 삼각형의 밑변이 패널 변과 맞닿아 하나의 윤곽이 됩니다.
Path _silhouette(HoronOverlaySide side, Size size) {
  final Radius radius = Radius.circular(HoronRadiusRole.panel);
  final double half = _arrowWidth / 2;

  // 패널은 네 모서리가 모두 둥근 사각형입니다. React도 `rounded-md`를 유지한 채
  // 화살표를 밖에 붙입니다. 화살표 밑변이 사각형의 곧은 변 가운데에 닿으므로,
  // 둘을 합치면 모서리는 둥글고 한쪽 변에만 뾰족한 윤곽이 됩니다.
  final RRect panel = switch (side) {
    HoronOverlaySide.top => RRect.fromLTRBAndCorners(
      0,
      0,
      size.width,
      size.height - _arrowExtent,
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
    ),
    HoronOverlaySide.bottom => RRect.fromLTRBAndCorners(
      0,
      _arrowExtent,
      size.width,
      size.height,
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
    ),
    HoronOverlaySide.left => RRect.fromLTRBAndCorners(
      0,
      0,
      size.width - _arrowExtent,
      size.height,
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
    ),
    HoronOverlaySide.right => RRect.fromLTRBAndCorners(
      _arrowExtent,
      0,
      size.width,
      size.height,
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
    ),
  };

  final Path arrow = switch (side) {
    HoronOverlaySide.top =>
      Path()
        ..moveTo(size.width / 2 - half, size.height - _arrowExtent)
        ..lineTo(size.width / 2 + half, size.height - _arrowExtent)
        ..lineTo(size.width / 2, size.height)
        ..close(),
    HoronOverlaySide.bottom =>
      Path()
        ..moveTo(size.width / 2 - half, _arrowExtent)
        ..lineTo(size.width / 2 + half, _arrowExtent)
        ..lineTo(size.width / 2, 0)
        ..close(),
    HoronOverlaySide.left =>
      Path()
        ..moveTo(size.width - _arrowExtent, size.height / 2 - half)
        ..lineTo(size.width - _arrowExtent, size.height / 2 + half)
        ..lineTo(size.width, size.height / 2)
        ..close(),
    HoronOverlaySide.right =>
      Path()
        ..moveTo(_arrowExtent, size.height / 2 - half)
        ..lineTo(_arrowExtent, size.height / 2 + half)
        ..lineTo(0, size.height / 2)
        ..close(),
  };

  // 두 도형을 단순히 이어 붙이면 테두리를 그릴 때 사각형의 변과 삼각형의 밑변이
  // 모두 윤곽으로 잡혀, 화살표 밑변에 흰 선이 그어집니다. `Path.combine`으로
  // 진짜 합집합을 만들면 이음매가 사라지고 바깥 윤곽만 남습니다.
  return Path.combine(PathOperation.union, Path()..addRRect(panel), arrow);
}

/// 포인터의 들어옴·나감을 안정된 콜백으로 전달합니다.
///
/// [MouseRegion]은 `onEnter`/`onExit`의 **객체 동작(identity)** 이 바뀌면 자기를
/// 새 영역으로 보고 `onExit` → `onEnter`를 한 번씩 보냅니다. 트리거는 패널이
/// 열릴 때 다시 빌드되므로, 콜백을 `build` 안에서 만들면 그때마다 이 짝이
/// 발생합니다. 2026-10-22에 계측했습니다: 툴팁이 열리자마자 `HOVER false`가 와서
/// 닫혔습니다. 이 위젯은 콜백을 한 번만 만들어 그 짝을 없앱니다.
class HoronHoverRegion extends StatefulWidget {
  /// 영역 하나를 만듭니다.
  const HoronHoverRegion({super.key, required this.onHover, required this.child});

  /// 포인터가 들어오면 참, 나가면 거짓으로 부릅니다.
  final ValueChanged<bool> onHover;

  /// 영역의 내용입니다.
  final Widget child;

  @override
  State<HoronHoverRegion> createState() => _HoronHoverRegionState();
}

class _HoronHoverRegionState extends State<HoronHoverRegion> {
  /// 포인터가 들어왔을 때입니다.
  ///
  /// 메서드 tear-off로 넘깁니다. Dart는 같은 객체의 같은 메서드 tear-off를 서로
  /// 같다고 보므로, 부모가 다시 빌드되어도 `MouseRegion`이 자기를 새 영역으로
  /// 보지 않습니다. `build` 안에서 클로저를 만들면 그때마다 `onExit` → `onEnter`
  /// 짝이 발생합니다(2026-10-22 계측).
  void _enter(PointerEnterEvent event) => widget.onHover(true);

  /// 포인터가 나갔을 때입니다.
  ///
  /// 이벤트의 `localPosition`이 아직 영역 안이면 무시합니다. 마우스 추적기는
  /// 주석이 다시 계산될 때 지금 위치에서 `onExit`을 다시 보낼 수 있고, 그 이벤트는
  /// 여전히 영역 안을 가리킵니다. 진짜 이탈은 밖을 가리킵니다.
  void _exit(PointerExitEvent event) {
    final Size? size = context.size;
    if (size != null && (Offset.zero & size).contains(event.localPosition)) return;
    widget.onHover(false);
  }

  @override
  Widget build(BuildContext context) => MouseRegion(onEnter: _enter, onExit: _exit, child: widget.child);
}

/// 툴팁을 여는 트리거입니다.
///
/// `tooltip.tsx`의 `TooltipTrigger`입니다. 포인터가 올라오면 [onHover], 터치에서는
/// 길게 누르면 [onLongPressStart], 놓으면 [onLongPressEnd]를 부릅니다. 계획의 QA
/// 시나리오가 툴팁이 롱프레스로 뜨는지 확인합니다.
class HoronTooltipTrigger extends StatelessWidget {
  /// 트리거 하나를 만듭니다.
  const HoronTooltipTrigger({
    super.key,
    required this.child,
    required this.onHover,
    required this.onLongPressStart,
    required this.onLongPressEnd,
    this.semanticLabel,
  });

  /// 트리거가 그리는 내용입니다.
  final Widget child;

  /// 포인터가 들어오고 나갈 때 부릅니다.
  final ValueChanged<bool> onHover;

  /// 길게 누르기 시작할 때 부릅니다.
  final VoidCallback onLongPressStart;

  /// 길게 누르기를 놓거나 취소할 때 부릅니다.
  final VoidCallback onLongPressEnd;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticLabel,
      child: HoronHoverRegion(
        onHover: onHover,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onLongPressStart: (LongPressStartDetails details) => onLongPressStart(),
          onLongPressEnd: (LongPressEndDetails details) => onLongPressEnd(),
          onLongPressCancel: onLongPressEnd,
          child: child,
        ),
      ),
    );
  }
}

/// 트리거에 붙는 툴팁 하나를 만듭니다.
///
/// `tooltip.tsx`의 루트입니다. 배치는 [HoronOverlay]가 맡고, 표면과 화살표는
/// [HoronTooltipContent]가 그립니다.
///
/// 여는 경로는 두 가지입니다. 포인터가 올라오면 [delay] 뒤에 열리고 포인터가
/// 빠지면 닫힙니다. 터치에서는 길게 누르는 동안 열려 있고, 놓으면 닫힙니다.
///
/// ```dart
/// HoronTooltip(
///   message: '검색',
///   kbd: const HoronKbd(label: 'K'),
///   trigger: const HoronButton(child: Text('찾기')),
/// );
/// ```
class HoronTooltip extends StatefulWidget {
  /// 툴팁 하나를 만듭니다.
  const HoronTooltip({
    super.key,
    required this.trigger,
    required this.child,
    this.kbd,
    this.side = HoronOverlaySide.top,
    this.align = HoronOverlayAlign.center,
    this.offset = Offset.zero,
    this.delay,
    this.closeDelay = horonTooltipCloseDelay,
    this.semanticLabel,
    this.controller,
  });

  /// 툴팁을 여는 트리거입니다.
  final Widget trigger;

  /// 툴팁의 본문입니다.
  final Widget child;

  /// 오른쪽에 붙는 단축키 슬롯입니다.
  final Widget? kbd;

  /// 선호하는 방향입니다. React의 기본값은 `top`입니다.
  final HoronOverlaySide side;

  /// 트리거와 맞출 축입니다.
  final HoronOverlayAlign align;

  /// 기준점을 맞춘 뒤 더 미는 거리입니다.
  final Offset offset;

  /// 포인터가 올라온 뒤 뜨기까지의 시간입니다. 없으면 [HoronTooltipProvider]의
  /// 값을 따르고, 그것도 없으면 즉시 뜹니다.
  final Duration? delay;

  /// 포인터가 빠진 뒤 닫히기까지의 시간입니다.
  final Duration closeDelay;

  /// 보조 기술이 읽을 트리거 이름입니다.
  final String? semanticLabel;

  /// 열고 닫는 컨트롤러입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final HoronOverlayController? controller;

  @override
  State<HoronTooltip> createState() => _HoronTooltipState();
}

class _HoronTooltipState extends State<HoronTooltip> {
  HoronOverlayController? _ownedController;
  Timer? _openTimer;
  Timer? _closeTimer;

  HoronOverlayController get _controller => widget.controller ?? (_ownedController ??= HoronOverlayController());

  @override
  void dispose() {
    _openTimer?.cancel();
    _closeTimer?.cancel();
    _ownedController?.dispose();
    super.dispose();
  }

  /// 지금 열어야 하는 시간입니다.
  ///
  /// 위젯이 준 값 → 제공자의 값 → 즉시 순서로 정합니다.
  Duration get _openDelay => widget.delay ?? HoronTooltipProvider.maybeOf(context)?.delay ?? Duration.zero;

  /// 포인터의 들어옴·나감을 처리합니다.
  ///
  /// 패널이 화면에 들어오는 프레임에 마우스 추적기가 `onExit` → `onEnter`를 짝으로
  /// 보냅니다. 2026-10-22에 계측했습니다: 툴팁이 뜬 그 프레임에 `HOVER false`가,
  /// 다음 프레임에 `HOVER true`가 왔습니다. 그래서 닫기는 [HoronTooltip.closeDelay]
  /// 만큼 미루고, 그 사이 `onEnter`가 오면 취소합니다. 진짜 이탈에서는 `onEnter`가
  /// 오지 않으므로 그대로 닫힙니다.
  void _handleHover(bool hovering) {
    _openTimer?.cancel();
    _closeTimer?.cancel();
    if (!hovering) {
      if (widget.closeDelay <= Duration.zero) {
        _controller.hide();
        return;
      }
      _closeTimer = Timer(widget.closeDelay, () {
        if (mounted) _controller.hide();
      });
      return;
    }
    final Duration wait = _openDelay;
    if (wait <= Duration.zero) {
      _controller.show();
      return;
    }
    _openTimer = Timer(wait, () {
      if (mounted) _controller.show();
    });
  }

  void _handleLongPressStart() {
    _openTimer?.cancel();
    _closeTimer?.cancel();
    _controller.show();
  }

  void _handleLongPressEnd() {
    _openTimer?.cancel();
    _closeTimer?.cancel();
    _controller.hide();
  }

  @override
  Widget build(BuildContext context) {
    return HoronOverlay(
      controller: _controller,
      position: HoronOverlayPosition(side: widget.side, align: widget.align, offset: widget.offset),
      trigger: HoronTooltipTrigger(
        semanticLabel: widget.semanticLabel,
        onHover: _handleHover,
        onLongPressStart: _handleLongPressStart,
        onLongPressEnd: _handleLongPressEnd,
        child: widget.trigger,
      ),
      panelBuilder: (BuildContext context, HoronOverlayPlacement placement) => HoronTooltipContent(
        side: placement.side,
        maxWidth: placement.maxWidth,
        maxHeight: placement.maxHeight,
        kbd: widget.kbd,
        child: widget.child,
      ),
    );
  }
}
