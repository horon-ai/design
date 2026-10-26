import 'dart:async';

import 'package:flutter/material.dart';

import '../overlay/horon_overlay.dart';
import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';
import 'tooltip.dart' show HoronHoverRegion;

/// `hover-card.tsx`의 `w-64`입니다.
const double _hoverCardWidth = 256.0;

/// `hover-card.tsx`의 `text-sm`입니다.
const double _hoverCardFontSize = HoronText.body;

/// `hover-card.tsx`의 `p-4`입니다.
const double _hoverCardPadding = HoronSpace.s4;

/// 포인터가 올라온 뒤 미리보기가 뜨기까지의 기본 시간입니다.
///
/// React는 Base UI `PreviewCard`의 기본값을 그대로 씁니다. 호버 카드는 링크 위를
/// 지나가기만 해도 열리면 화면이 시끄러워지므로 툴팁보다 긴 시간을 둡니다.
const Duration horonHoverCardOpenDelay = Duration(milliseconds: 600);

/// 포인터가 빠진 뒤 미리보기가 닫히기까지의 기본 시간입니다.
///
/// 트리거에서 카드로 포인터를 옮기는 동안 닫히지 않게 두는 여유입니다.
const Duration horonHoverCardCloseDelay = Duration(milliseconds: 300);

/// 미리보기를 여는 트리거입니다.
///
/// `hover-card.tsx`의 `HoverCardTrigger`입니다. 포인터가 올라오면 [onHover],
/// 터치에서는 길게 누르면 [onLongPressStart], 놓으면 [onLongPressEnd]를 부릅니다.
/// 두 경로가 모두 있어야 합니다. React의 프리뷰 카드는 터치에서도 길게 누르면
/// 열리고, 이 패키지는 그 동작을 [HoronHoverRegion]과 [GestureDetector]로 나눠
/// 맡깁니다. 길게 누르기로 인정하는 시간은 [GestureDetector]의 기본값입니다.
class HoronHoverCardTrigger extends StatelessWidget {
  /// 트리거 하나를 만듭니다.
  const HoronHoverCardTrigger({
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

/// 미리보기의 유리 표면입니다.
///
/// `hover-card.tsx`의 `HoverCardContent`입니다. React의 클래스는 `glass-strong
/// relative isolate z-50 w-64 rounded-md p-4 text-sm text-foreground`입니다.
/// 표면은 공유 유틸의 [HoronOverlayPanel]이 그립니다.
///
/// 폭은 [width]로 고정합니다. React가 `w-64`로 폭을 고정하는 것과 같고, 화면이
/// 좁으면 [maxWidth]가 줄입니다.
class HoronHoverCardContent extends StatelessWidget {
  /// 미리보기 표면 하나를 만듭니다.
  const HoronHoverCardContent({
    super.key,
    required this.child,
    this.width = _hoverCardWidth,
    this.maxWidth,
    this.maxHeight,
    this.padding = const EdgeInsets.all(_hoverCardPadding),
  });

  /// 미리보기 안의 내용입니다.
  final Widget child;

  /// 미리보기의 고정 폭입니다. null이면 내용 폭에 맞춥니다.
  final double? width;

  /// 자리가 모자랄 때 넘지 않을 폭입니다.
  final double? maxWidth;

  /// 자리가 모자랄 때 넘지 않을 높이입니다.
  final double? maxHeight;

  /// 안쪽 여백입니다. 기본값은 `p-4`(16)입니다.
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double? fixedWidth = width == null
        ? null
        : (maxWidth == null ? width : (width! < maxWidth! ? width : maxWidth));

    return HoronOverlayPanel(
      maxWidth: fixedWidth ?? maxWidth,
      maxHeight: maxHeight,
      padding: padding,
      // `InkWell`과 `TextField`는 `Material` 조상을 요구합니다. 미리보기는 포털
      // 위에 그려져 Scaffold 밖이므로 여기서 투명한 하나를 세웁니다.
      child: Material(
        type: MaterialType.transparency,
        child: DefaultTextStyle.merge(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _hoverCardFontSize,
            height: HoronLineHeight.normal,
            color: scheme.onSurface,
            // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중
            // 밑줄이 새어 들어오지 않게 명시합니다.
            decoration: TextDecoration.none,
          ),
          child: SizedBox(width: fixedWidth, child: child),
        ),
      ),
    );
  }
}

/// 트리거에 붙는 미리보기 카드 하나를 만듭니다.
///
/// `hover-card.tsx`의 루트입니다. 포인터가 있으면 호버로, 터치에서는 길게 눌러
/// 엽니다. 터치에서 쓰이지 않는다고 비우지 않은 이유는, 링크를 길게 눌러 내용을
/// 미리 보는 동작이 터치 화면에서도 흔하기 때문입니다. 계획도 그 동작을 승인된
/// 결정으로 적었습니다.
///
/// 카드 위로 포인터를 옮기면 닫히지 않습니다. 트리거를 떠나는 순간
/// [closeDelay]가 흐르고, 그 안에 카드에 들어오면 타이머를 취소합니다.
///
/// ```dart
/// HoronHoverCard(
///   trigger: Text('@horon'),
///   child: Column(children: <Widget>[Text('Horon'), Text('디자인 시스템')]),
/// );
/// ```
class HoronHoverCard extends StatefulWidget {
  /// 미리보기 카드 하나를 만듭니다.
  const HoronHoverCard({
    super.key,
    required this.trigger,
    required this.child,
    this.side = HoronOverlaySide.bottom,
    this.align = HoronOverlayAlign.center,
    this.offset = Offset.zero,
    this.width = _hoverCardWidth,
    this.padding = const EdgeInsets.all(_hoverCardPadding),
    this.openDelay = horonHoverCardOpenDelay,
    this.closeDelay = horonHoverCardCloseDelay,
    this.controller,
    this.semanticLabel,
    this.onOpenChanged,
  });

  /// 미리보기를 여는 트리거입니다.
  final Widget trigger;

  /// 미리보기 안의 내용입니다.
  final Widget child;

  /// 선호하는 방향입니다. React의 기본값은 `bottom`입니다.
  final HoronOverlaySide side;

  /// 트리거와 맞출 축입니다.
  final HoronOverlayAlign align;

  /// 기준점을 맞춘 뒤 더 미는 거리입니다.
  final Offset offset;

  /// 미리보기의 고정 폭입니다. null이면 내용 폭에 맞춥니다.
  final double? width;

  /// 미리보기의 안쪽 여백입니다.
  final EdgeInsets padding;

  /// 포인터가 올라온 뒤 뜨기까지의 시간입니다.
  final Duration openDelay;

  /// 포인터가 빠진 뒤 닫히기까지의 시간입니다.
  final Duration closeDelay;

  /// 열고 닫는 컨트롤러입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final HoronOverlayController? controller;

  /// 보조 기술이 읽을 트리거 이름입니다.
  final String? semanticLabel;

  /// 열림 상태가 바뀔 때 부릅니다.
  final ValueChanged<bool>? onOpenChanged;

  @override
  State<HoronHoverCard> createState() => _HoronHoverCardState();
}

class _HoronHoverCardState extends State<HoronHoverCard> {
  HoronOverlayController? _ownedController;
  Timer? _openTimer;
  Timer? _closeTimer;
  late bool _wasOpen;

  HoronOverlayController get _controller => widget.controller ?? (_ownedController ??= HoronOverlayController());

  @override
  void initState() {
    super.initState();
    _wasOpen = _controller.isOpen;
    _controller.addListener(_handleOpenChanged);
  }

  @override
  void didUpdateWidget(HoronHoverCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _ownedController)?.removeListener(_handleOpenChanged);
      _wasOpen = _controller.isOpen;
      _controller.addListener(_handleOpenChanged);
    }
  }

  @override
  void dispose() {
    _openTimer?.cancel();
    _closeTimer?.cancel();
    _controller.removeListener(_handleOpenChanged);
    _ownedController?.dispose();
    super.dispose();
  }

  void _handleOpenChanged() {
    final bool open = _controller.isOpen;
    if (open == _wasOpen) return;
    _wasOpen = open;
    widget.onOpenChanged?.call(open);
  }

  void _handleHover(bool hovering) {
    _openTimer?.cancel();
    _closeTimer?.cancel();
    if (hovering) {
      if (widget.openDelay <= Duration.zero) {
        _controller.show();
        return;
      }
      _openTimer = Timer(widget.openDelay, () {
        if (mounted) _controller.show();
      });
      return;
    }
    _scheduleClose();
  }

  void _scheduleClose() {
    _openTimer?.cancel();
    _closeTimer?.cancel();
    if (widget.closeDelay <= Duration.zero) {
      _controller.hide();
      return;
    }
    _closeTimer = Timer(widget.closeDelay, () {
      if (mounted) _controller.hide();
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
      trigger: HoronHoverCardTrigger(
        semanticLabel: widget.semanticLabel,
        onHover: _handleHover,
        onLongPressStart: _handleLongPressStart,
        onLongPressEnd: _handleLongPressEnd,
        child: widget.trigger,
      ),
      panelBuilder: (BuildContext context, HoronOverlayPlacement placement) => HoronHoverRegion(
        // 트리거에서 카드로 포인터를 옮기는 동안 닫히지 않게 합니다.
        onHover: (bool hovering) {
          _openTimer?.cancel();
          _closeTimer?.cancel();
          if (!hovering) _scheduleClose();
        },
        child: HoronHoverCardContent(
          width: widget.width,
          maxWidth: placement.maxWidth,
          maxHeight: placement.maxHeight,
          padding: widget.padding,
          child: widget.child,
        ),
      ),
    );
  }
}
