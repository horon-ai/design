import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/horon_veil.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `modal.tsx`의 `ModalSize`입니다. 폭 400·560·720입니다.
enum HoronModalSize {
  /// `w-100` — 폭 400입니다.
  sm,

  /// `w-140` — 폭 560. 기본값입니다.
  md,

  /// `w-180` — 폭 720입니다.
  lg,
}

/// `modal.tsx`의 `ModalSurface`입니다.
///
/// `HoronModalSurface`라는 이름은 `mobile` 앱이 쓰는 기존 패널 위젯
/// (`overlay/horon_modal.dart`)이 이미 차지하고 있어, 값 집합이 같은 이 enum은
/// `Kind` 접미사를 붙입니다. variants 게이트는 이름이 아니라 값으로 비교합니다.
enum HoronModalSurfaceKind {
  /// `bg-bg-surface`와 0/24/64 그림자를 쓰는 불투명 표면입니다. 기본값입니다.
  solid,

  /// `veil-overlay` — 74% 채움, 1px 링, 0 6 24 그림자를 스스로 그립니다.
  glass,
}

/// `size-8` — 닫기 버튼의 32px 히트 영역입니다.
const double _closeSize = 32;

/// `[&_svg]:size-4` — 닫기 아이콘 16입니다.
const double _closeIcon = 16;

/// `shadow-[0_24_64_#0A142433]`의 세로 이동입니다.
const double _solidShadowOffsetY = 24;

/// `shadow-[0_24_64_#0A142433]`의 번짐입니다.
const double _solidShadowBlur = 64;

/// 폼이나 긴 글을 담는 모달입니다. React `ModalContent`.
///
/// [HoronDialog]가 짧은 확인에 쓰는 반면, 이 모달은 세 부분으로 고정됩니다.
/// 제목·설명·닫기가 있는 머리글, 화면 높이에 닿으면 스스로 스크롤하는 본문,
/// 동작을 오른쪽에 두는 [footer]입니다. 24px 여백, 20px 반경, 32% 스크림을 씁니다.
///
/// 띄우려면 [showHoronModal]을 씁니다. 스크림·가운데 배치·전환은 그 함수가 맡고,
/// 이 위젯은 패널만 그립니다.
class HoronModal extends StatelessWidget {
  /// 모달 패널을 만듭니다.
  const HoronModal({
    super.key,
    required this.title,
    this.description,
    this.leading,
    this.closeLabel = 'Close',
    this.size = HoronModalSize.md,
    this.surface = HoronModalSurfaceKind.solid,
    this.footer,
    this.child,
    this.onClose,
  });

  /// 제목입니다. React `title`(`ReactNode`)이며 `title-md`로 그립니다.
  final Widget title;

  /// 제목 아래 설명입니다. React `description`이며 `body-md`입니다.
  final Widget? description;

  /// 제목 앞의 타일이나 아이콘입니다. React `leading`입니다.
  final Widget? leading;

  /// 닫기 버튼의 이름입니다. null이면 닫기 버튼을 그리지 않습니다.
  final String? closeLabel;

  /// 폭입니다. 기본값은 [HoronModalSize.md]입니다.
  final HoronModalSize size;

  /// 표면입니다. 기본값은 [HoronModalSurfaceKind.solid]입니다.
  final HoronModalSurfaceKind surface;

  /// 본문 아래에 고정되는 동작 줄입니다. React `footer`입니다.
  final Widget? footer;

  /// 스크롤하는 본문입니다. React `children`입니다.
  final Widget? child;

  /// 닫기 버튼을 눌렀을 때 부를 콜백입니다. 없으면 현재 라우트를 닫습니다.
  final VoidCallback? onClose;

  /// `w-100`·`w-140`·`w-180` — 크기별 폭입니다.
  double get _width => switch (size) {
    HoronModalSize.sm => 400,
    HoronModalSize.md => 560,
    HoronModalSize.lg => 720,
  };

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);
    // `max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)]`.
    final Size viewport = MediaQuery.sizeOf(context);
    final double maxHeight = viewport.height - space.s4 * 2;

    final Widget header = Padding(
      // `px-6 pt-6 pb-4`.
      padding: EdgeInsets.only(left: space.s6, right: space.s6, top: space.s6, bottom: space.s4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        // `leading ? gap-3.5 : gap-2`.
        spacing: leading != null ? space.s3_5 : space.s2,
        children: <Widget>[
          ?leading,
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              // `gap-1`.
              spacing: space.s1,
              children: <Widget>[
                DefaultTextStyle(
                  style: theme.text.titleMd.copyWith(color: colors.textPrimary),
                  child: title,
                ),
                if (description != null)
                  DefaultTextStyle(
                    style: theme.text.bodyMd.copyWith(color: colors.textSecondary),
                    child: description!,
                  ),
              ],
            ),
          ),
          if (closeLabel != null)
            _ModalClose(label: closeLabel!, onTap: onClose ?? () => Navigator.of(context).maybePop()),
        ],
      ),
    );

    final Widget body = Padding(
      // `px-6`, 아래는 footer가 있으면 `pb-2`, 없으면 `pb-6`입니다.
      padding: EdgeInsets.only(left: space.s6, right: space.s6, bottom: footer == null ? space.s6 : space.s2),
      child: DefaultTextStyle(
        style: theme.text.bodyMd.copyWith(color: colors.textPrimary),
        child: child ?? const SizedBox.shrink(),
      ),
    );

    // `max-w-[calc(100vw-2rem)]` — 뷰포트가 좁으면 그 폭을 따릅니다.
    final double width = math.min(_width, viewport.width - space.s4 * 2);
    final Widget content = ConstrainedBox(
      constraints: BoxConstraints(maxWidth: width, maxHeight: maxHeight),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          header,
          // `min-h-0 flex-1 overflow-y-auto overscroll-contain` — 본문만 스크롤합니다.
          Flexible(child: SingleChildScrollView(primary: false, child: body)),
          ?footer,
        ],
      ),
    );

    if (surface == HoronModalSurfaceKind.glass) {
      // React `veil-overlay`.
      return HoronVeil(kind: HoronVeilKind.overlay, borderRadius: radius, child: content);
    }

    // `bg-bg-surface shadow-[0_24_64_#0A142433]` — 토큰에 그 색이 없어 같은
    // 불투명도의 overlay-ink-20으로 옮겼습니다.
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.bgSurface,
        borderRadius: radius,
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: colors.overlayInk20,
            offset: const Offset(0, _solidShadowOffsetY),
            blurRadius: _solidShadowBlur,
          ),
        ],
      ),
      child: ClipRRect(borderRadius: radius, child: content),
    );
  }
}

/// `modal.tsx`의 `ModalFooter`입니다.
///
/// `flex shrink-0 items-center justify-end gap-2 px-6 pt-4 pb-6` — 보조 동작을 먼저,
/// 주 동작을 오른쪽 끝에 두는 줄입니다. 폭이 좁아지면 [Wrap]이 줄을 바꿉니다.
class HoronModalFooter extends StatelessWidget {
  /// 동작 줄을 만듭니다.
  const HoronModalFooter({super.key, required this.children});

  /// 동작 버튼 목록입니다. React `children`입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return Padding(
      padding: EdgeInsets.only(left: space.s6, right: space.s6, top: space.s4, bottom: space.s6),
      child: SizedBox(
        width: double.infinity,
        child: Wrap(
          alignment: WrapAlignment.end,
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: space.s2,
          runSpacing: space.s2,
          children: children,
        ),
      ),
    );
  }
}

/// 모달 닫기 버튼입니다. React와 같은 32px 원, hover 6% 잉크, 2px 포커스 링입니다.
class _ModalClose extends StatefulWidget {
  const _ModalClose({required this.label, required this.onTap});

  final String label;
  final VoidCallback onTap;

  @override
  State<_ModalClose> createState() => _ModalCloseState();
}

class _ModalCloseState extends State<_ModalClose> {
  bool _hovered = false;
  bool _focused = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    Widget content = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      width: _closeSize,
      height: _closeSize,
      decoration: BoxDecoration(color: _hovered ? colors.overlayInk6 : Colors.transparent, shape: BoxShape.circle),
      child: Icon(Icons.close, size: _closeIcon, color: _hovered ? colors.textPrimary : colors.textSecondary),
    );

    if (_focused) {
      final double gap = space.s0_5;
      content = Stack(
        clipBehavior: Clip.none,
        children: <Widget>[
          Positioned(
            left: -gap,
            top: -gap,
            right: -gap,
            bottom: -gap,
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(theme.radius.full),
                  border: Border.all(color: colors.textBrand, width: 2),
                ),
              ),
            ),
          ),
          content,
        ],
      );
    }

    return AnimatedScale(
      scale: _pressed ? HoronMotion.pressScale : 1,
      duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
      curve: HoronMotion.pressCurve,
      child: Semantics(
        button: true,
        label: widget.label,
        child: FocusableActionDetector(
          mouseCursor: SystemMouseCursors.click,
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          child: MouseRegion(
            onEnter: (_) => setState(() => _hovered = true),
            onExit: (_) => setState(() => _hovered = false),
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: widget.onTap,
              onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
              onTapUp: (TapUpDetails details) {
                if (_pressed) setState(() => _pressed = false);
              },
              onTapCancel: () {
                if (_pressed) setState(() => _pressed = false);
              },
              child: content,
            ),
          ),
        ),
      ),
    );
  }
}
