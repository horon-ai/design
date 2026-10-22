import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../overlay/horon_overlay.dart';
import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `popover.tsx`의 `w-72`입니다. 패널의 기본 폭입니다.
const double _popoverWidth = 288.0;

/// `popover.tsx`의 `text-sm`입니다.
const double _popoverFontSize = HoronText.body;

/// `popover.tsx`의 `p-3`입니다.
const double _popoverPadding = HoronSpace.s3;

/// 팝오버를 여는 트리거입니다.
///
/// `popover.tsx`의 `PopoverTrigger`입니다. 누르면 [controller]를 뒤집습니다.
/// React에서는 트리거가 루트 안에 들어가 조상에게서 상태를 받지만, Flutter에서는
/// 컨트롤러를 인자로 받습니다. 그래야 트리거를 루트 밖에 두거나 테스트에서
/// 컨트롤러를 직접 들고 열림 상태를 확인할 수 있습니다.
class HoronPopoverTrigger extends StatelessWidget {
  /// 트리거 하나를 만듭니다.
  const HoronPopoverTrigger({
    super.key,
    required this.child,
    required this.controller,
    this.enabled = true,
    this.semanticLabel,
  });

  /// 트리거가 그리는 내용입니다.
  final Widget child;

  /// 열고 닫는 컨트롤러입니다.
  final HoronOverlayController controller;

  /// 꺼져 있으면 누름에 반응하지 않습니다.
  final bool enabled;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: semanticLabel,
      child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: enabled ? controller.toggle : null, child: child),
    );
  }
}

/// 팝오버가 붙는 기준 자리입니다.
///
/// `popover.tsx`의 `PopoverAnchor`입니다. React는 `inline-flex w-fit`이라 내용
/// 폭만큼만 차지합니다. Flutter에서 그 자리는 폭을 내용에 맞추는 [Row]입니다.
/// 트리거가 아닌 다른 위젯에 패널을 붙이고 싶을 때 씁니다.
class HoronPopoverAnchor extends StatelessWidget {
  /// 기준 자리 하나를 만듭니다.
  const HoronPopoverAnchor({super.key, required this.child});

  /// 기준이 되는 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Row(mainAxisSize: MainAxisSize.min, children: <Widget>[child]);
  }
}

/// 팝오버의 패널 표면입니다.
///
/// `popover.tsx`의 `PopoverContent`입니다. React의 클래스는 `glass-strong
/// relative isolate z-50 w-72 rounded-md p-3 text-sm text-foreground`입니다.
/// 표면은 공유 유틸의 [HoronOverlayPanel]이 그리므로 유리 채움·테두리·그림자·
/// 모서리 자르기가 팝오버마다 달라지지 않습니다.
///
/// 폭은 [width]로 고정합니다. React가 `w-72`로 폭을 고정하는 것과 같고, 화면이
/// 좁아 자리가 모자라면 [maxWidth]가 줄입니다. [width]가 null이면 내용 폭에
/// 맞춥니다.
class HoronPopoverContent extends StatelessWidget {
  /// 패널 하나를 만듭니다.
  const HoronPopoverContent({
    super.key,
    required this.child,
    this.width = _popoverWidth,
    this.maxWidth,
    this.maxHeight,
    this.padding = const EdgeInsets.all(_popoverPadding),
  });

  /// 패널 안의 임의 내용입니다.
  final Widget child;

  /// 패널의 고정 폭입니다. null이면 내용 폭에 맞춥니다.
  final double? width;

  /// 자리가 모자랄 때 넘지 않을 폭입니다. 보통 배치 계산이 넘겨 줍니다.
  final double? maxWidth;

  /// 자리가 모자랄 때 넘지 않을 높이입니다.
  final double? maxHeight;

  /// 안쪽 여백입니다. 기본값은 `p-3`(12)입니다.
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double? fixedWidth = width == null ? null : math.min(width!, maxWidth ?? double.infinity);

    return HoronOverlayPanel(
      maxWidth: fixedWidth ?? maxWidth,
      maxHeight: maxHeight,
      padding: padding,
      // `InkWell`과 `TextField`는 `Material` 조상을 요구합니다. 패널은 포털 위에
      // 그려져 Scaffold 밖이므로 여기서 투명한 하나를 세웁니다.
      child: Material(
        type: MaterialType.transparency,
        child: DefaultTextStyle.merge(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _popoverFontSize,
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

/// 트리거에 붙는 팝오버 하나를 만듭니다.
///
/// `popover.tsx`의 루트를 옮긴 것입니다. 배치는 [HoronOverlay]가 맡으므로
/// 화면 밖으로 나갈 때 뒤집히고 밀려 들어오는 동작을 다시 만들지 않습니다.
///
/// 여는 경로는 두 가지입니다. 트리거를 누르면 열리고 다시 누르면 닫힙니다.
/// 그리고 바깥을 누르면 닫힙니다. 바깥 판정은 [TapRegion]이 하고, 트리거와 패널을
/// 같은 식별자로 묶습니다. React의 팝오버가 바깥 클릭에 닫히는 동작을 옮긴
/// 자리입니다.
///
/// ```dart
/// HoronPopover(
///   trigger: const HoronButton(child: Text('필터')),
///   child: const Text('임의의 내용'),
/// );
/// ```
class HoronPopover extends StatefulWidget {
  /// 팝오버 하나를 만듭니다.
  const HoronPopover({
    super.key,
    required this.trigger,
    required this.child,
    this.side = HoronOverlaySide.bottom,
    this.align = HoronOverlayAlign.center,
    this.offset = Offset.zero,
    this.width = _popoverWidth,
    this.padding = const EdgeInsets.all(_popoverPadding),
    this.controller,
    this.enabled = true,
    this.semanticLabel,
    this.onOpenChanged,
  });

  /// 팝오버를 여는 트리거입니다.
  final Widget trigger;

  /// 패널 안의 임의 내용입니다.
  final Widget child;

  /// 선호하는 방향입니다. React의 기본값은 `bottom`입니다.
  final HoronOverlaySide side;

  /// 트리거와 맞출 축입니다. React의 기본값은 `center`입니다.
  final HoronOverlayAlign align;

  /// 기준점을 맞춘 뒤 더 미는 거리입니다. React의 `sideOffset` 기본값 4는
  /// [HoronOverlayPosition.gap]이 이미 담당합니다.
  final Offset offset;

  /// 패널의 고정 폭입니다. null이면 내용 폭에 맞춥니다.
  final double? width;

  /// 패널의 안쪽 여백입니다.
  final EdgeInsets padding;

  /// 열고 닫는 컨트롤러입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final HoronOverlayController? controller;

  /// 꺼져 있으면 트리거의 누름에 반응하지 않습니다.
  final bool enabled;

  /// 보조 기술이 읽을 트리거 이름입니다.
  final String? semanticLabel;

  /// 열림 상태가 바뀔 때 부릅니다. React의 `onOpenChange` 자리입니다.
  final ValueChanged<bool>? onOpenChanged;

  @override
  State<HoronPopover> createState() => _HoronPopoverState();
}

class _HoronPopoverState extends State<HoronPopover> {
  HoronOverlayController? _ownedController;
  late bool _wasOpen;

  /// 트리거와 패널을 한 탭 영역으로 묶는 식별자입니다.
  ///
  /// 인스턴스마다 새 객체를 씁니다. 하나를 공유하면 팝오버 두 개가 같은 영역이
  /// 되어, 한쪽 트리거를 눌러도 다른 쪽이 "바깥"으로 보지 않습니다.
  late final Object _tapRegionGroup = Object();

  HoronOverlayController get _controller => widget.controller ?? (_ownedController ??= HoronOverlayController());

  @override
  void initState() {
    super.initState();
    _wasOpen = _controller.isOpen;
    _controller.addListener(_handleOpenChanged);
  }

  @override
  void didUpdateWidget(HoronPopover oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _ownedController)?.removeListener(_handleOpenChanged);
      _wasOpen = _controller.isOpen;
      _controller.addListener(_handleOpenChanged);
    }
  }

  @override
  void dispose() {
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

  @override
  Widget build(BuildContext context) {
    return HoronOverlay(
      controller: _controller,
      position: HoronOverlayPosition(side: widget.side, align: widget.align, offset: widget.offset),
      trigger: TapRegion(
        groupId: _tapRegionGroup,
        child: HoronPopoverTrigger(
          controller: _controller,
          enabled: widget.enabled,
          semanticLabel: widget.semanticLabel,
          child: widget.trigger,
        ),
      ),
      panelBuilder: (BuildContext context, HoronOverlayPlacement placement) => TapRegion(
        groupId: _tapRegionGroup,
        onTapOutside: (PointerDownEvent event) => _controller.hide(),
        child: HoronPopoverContent(
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
