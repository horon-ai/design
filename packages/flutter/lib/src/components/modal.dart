// `modal`의 Flutter 대응입니다.
//
// React `modal.tsx`는 Base UI의 `Dialog` 프리미티브 위에 `ModalContent`를 얹고,
// `Modal`·`ModalTrigger`·`ModalClose`를 그대로 다시 내보냅니다. Flutter에는 그
// 프리미티브가 없으므로 [showHoronModalContent]가 `RawDialogRoute`로 포털·스크림·
// 뷰포트를 맡고, [HoronModal]이 팝업 표면을 그립니다. 닫기 버튼은 라우트를 닫는
// 것으로 `ModalClose`를 대신합니다.

import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `modal.tsx`의 `ModalSize`입니다.
///
/// 폭은 [HoronModal]이 이 값과 화면 폭 중 좁은 쪽으로 정합니다.
enum HoronModalSize {
  /// `size="sm"` — 폭 400입니다.
  sm,

  /// `size="md"` — 폭 560입니다. 기본값입니다.
  md,

  /// `size="lg"` — 폭 720입니다.
  lg,
}

/// `modal.tsx`의 `ModalSurface`입니다.
///
/// 이름이 `lib/src/overlay/horon_modal.dart`의 `HoronModalSurface` 위젯과 겹치지 않게
/// [HoronModalSurfaceKind]로 지었습니다. 값 집합은 React와 같습니다.
enum HoronModalSurfaceKind {
  /// `surface="solid"` — 불투명 `bg-surface`와 0/24/64 그림자입니다. 기본값입니다.
  solid,

  /// `surface="glass"` — 8px 흐림과 75% 채움, 6% 고리와 0/6/24 그림자를 쓰는 베일입니다.
  glass,
}

/// `size`별 팝업 폭입니다. React `widthClass`의 `w-100`·`w-140`·`w-180`입니다.
double _widthOf(HoronModalSize size) => switch (size) {
  HoronModalSize.sm => 400,
  HoronModalSize.md => 560,
  HoronModalSize.lg => 720,
};

/// `shadow-[0_24_64]` — 불투명 팝업 그림자의 세로 이동입니다.
const double _solidShadowOffsetY = 24;

/// `shadow-[0_24_64]` — 불투명 팝업 그림자의 흐림 반경입니다.
const double _solidShadowBlur = 64;

/// `shadow-[0_6_24]` — 베일 팝업 그림자의 세로 이동입니다.
const double _veilShadowOffsetY = 6;

/// `shadow-[0_6_24]` — 베일 팝업 그림자의 흐림 반경입니다.
const double _veilShadowBlur = 24;

/// `.veil-overlay`의 `--veil-blur` — 베일 뒤 배경 흐림 반경입니다.
const double _veilBlur = 8;

/// `.veil-overlay`의 `--veil-ring-width` — 베일 고리 두께입니다.
const double _veilRingWidth = 1;

/// `size-8` — 닫기 버튼 상자 32입니다.
const double _closeSize = 32;

/// `[&_svg]:size-4` — 닫기 아이콘 16입니다.
const double _closeIconSize = 16;

/// `focus-visible:outline-2` — 닫기 버튼 초점 고리 두께입니다.
const double _focusWidth = 2;

/// `duration-240` — 팝업이 나타나는 시간입니다.
const Duration _enterDuration = Duration(milliseconds: 240);

/// `data-starting-style:translate-y-2` — 나타날 때 아래에서 올라오는 거리 8입니다.
const double _enterOffset = 8;

/// `bg-bg-scrim/32` — 스크림 불투명도입니다.
const double _scrimOpacity = 0.32;

/// `backdrop-blur-[6px]` — 스크림 뒤 배경 흐림 반경입니다.
const double _scrimBlur = 6;

/// React `ModalContent`의 팝업입니다.
///
/// 머리글(제목·설명·닫기), 자체 스크롤 본문, 바닥 동작 줄의 세 부분으로 나뉩니다.
/// 24px 여백, 20px 반경, 화면 높이에서 32px을 뺀 최대 높이를 쓰고, 폭은
/// [size]가 정한 값과 화면 폭에서 32px을 뺀 값 중 좁은 쪽입니다.
///
/// 다이얼로그처럼 보이게 띄우려면 [showHoronModalContent]를 씁니다. 이 위젯만
/// 놓으면 표면만 그리므로 갤러리 미리보기나 이미 열린 라우트 안에서 씁니다.
class HoronModal extends StatelessWidget {
  /// 모달 팝업을 만듭니다.
  const HoronModal({
    super.key,
    required this.title,
    this.description,
    this.size = HoronModalSize.md,
    this.surface = HoronModalSurfaceKind.solid,
    this.leading,
    this.closeLabel = 'Close',
    this.footer,
    this.child,
    this.onClose,
  });

  /// 제목입니다. React `title`(`ReactNode`)이며 `title-md`로 그립니다.
  final Widget title;

  /// 제목 아래 설명입니다. React `description`이며 `body-md` `text-secondary`입니다.
  final Widget? description;

  /// 폭 단계입니다. 기본값은 [HoronModalSize.md]입니다.
  final HoronModalSize size;

  /// 표면입니다. 기본값은 [HoronModalSurfaceKind.solid]입니다.
  final HoronModalSurfaceKind surface;

  /// 제목 앞의 타일이나 아이콘입니다. React `leading`입니다.
  final Widget? leading;

  /// 닫기 버튼의 접근성 이름입니다. null이면 닫기 버튼을 그리지 않습니다.
  /// React `closeLabel`(기본 "Close", `null`이면 숨김).
  final String? closeLabel;

  /// 본문 아래에 붙는 동작 줄입니다. React `footer`(`ModalFooter`)입니다.
  final Widget? footer;

  /// 스크롤되는 본문입니다. React `children`입니다.
  final Widget? child;

  /// 닫기 버튼을 눌렀을 때 부를 콜백입니다. 없으면 현재 라우트를 닫습니다.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final Size viewport = MediaQuery.sizeOf(context);

    // `max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)]`입니다.
    final double maxWidth = (viewport.width - space.s4 * 2).clamp(0, double.infinity);
    final double maxHeight = (viewport.height - space.s4 * 2).clamp(0, double.infinity);
    final double width = maxWidth < _widthOf(size) ? maxWidth : _widthOf(size);

    final bool glass = surface == HoronModalSurfaceKind.glass;
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl); // rounded-xl

    final Widget header = Padding(
      // `px-6 pt-6 pb-4`, 닫기 버튼의 `-mr-2`만큼 오른쪽을 줄입니다.
      padding: EdgeInsets.fromLTRB(space.s6, space.s6, space.s4, space.s4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        // leading이 있으면 gap-3.5(14), 없으면 gap-2(8)입니다.
        spacing: leading != null ? space.s3_5 : space.s2,
        children: <Widget>[
          ?leading,
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: space.s1, // gap-1
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
            // `-mt-1` — 닫기 버튼을 머리글 위쪽으로 4px 당깁니다.
            Transform.translate(
              offset: Offset(0, -space.s1),
              child: _CloseButton(label: closeLabel!, onPressed: onClose ?? () => Navigator.of(context).maybePop()),
            ),
        ],
      ),
    );

    final Widget body = Flexible(
      // 본문은 짧으면 내용 높이만, 길면 남는 높이에서 스스로 스크롤합니다.
      fit: FlexFit.loose,
      child: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(space.s6, 0, space.s6, footer == null ? space.s6 : space.s2),
        child: DefaultTextStyle(
          style: theme.text.bodyMd.copyWith(color: colors.textPrimary),
          child: child ?? const SizedBox.shrink(),
        ),
      ),
    );

    final List<BoxShadow> shadows = glass
        ? <BoxShadow>[
            BoxShadow(color: colors.overlayInk6, spreadRadius: _veilRingWidth), // --veil-ring
            BoxShadow(
              // 라이트 `--veil-overlay-shadow`는 검정 10%, 다크는 30%입니다.
              color: theme.brightness == Brightness.dark ? colors.bgScrim.withValues(alpha: 0.3) : colors.overlayInk10,
              offset: const Offset(0, _veilShadowOffsetY),
              blurRadius: _veilShadowBlur,
            ),
          ]
        : <BoxShadow>[
            BoxShadow(
              color: colors.overlayInk20, // shadow-[0_24_64_#0A142433]
              offset: const Offset(0, _solidShadowOffsetY),
              blurRadius: _solidShadowBlur,
            ),
          ];

    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: maxHeight),
      child: SizedBox(
        width: width,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: glass ? null : colors.bgSurface, // bg-bg-surface
            borderRadius: radius,
            boxShadow: shadows,
          ),
          child: ClipRRect(
            borderRadius: radius,
            child: Stack(
              children: <Widget>[
                if (glass)
                  Positioned.fill(
                    // `.veil-overlay`: 8px 흐림과 75% 표면 채움입니다.
                    child: BackdropFilter(
                      filter: ui.ImageFilter.blur(sigmaX: _veilBlur, sigmaY: _veilBlur),
                      child: ColoredBox(color: colors.bgSurface75),
                    ),
                  ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[header, body, ?footer],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// `modal.tsx`의 `ModalFooter`입니다.
///
/// 동작 줄을 오른쪽에 붙이고 8px 간격, 24px 여백을 씁니다. React는 `flex` 한 줄이지만
/// 좁은 폭에서 버튼이 넘치지 않게 [Wrap]으로 줄을 바꿉니다.
class HoronModalFooter extends StatelessWidget {
  /// 동작 줄을 만듭니다.
  const HoronModalFooter({super.key, required this.children});

  /// 동작 버튼 목록입니다. React `children`입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return Padding(
      // `px-6 pt-4 pb-6`
      padding: EdgeInsets.fromLTRB(space.s6, space.s4, space.s6, space.s6),
      child: Wrap(
        alignment: WrapAlignment.end,
        spacing: space.s2, // gap-2
        runSpacing: space.s2,
        children: children,
      ),
    );
  }
}

/// 모달을 스크림 위에 띄웁니다.
///
/// React `ModalContent`의 Portal·Backdrop·Viewport를 맡습니다. 32% 스크림과 6px
/// 배경 흐림, 화면 가장자리 16px 여백을 깔고, 팝업을 가운데에 놓습니다. 스크림을
/// 누르거나 뒤로 가면 닫힙니다.
Future<T?> showHoronModalContent<T>(
  BuildContext context, {
  required Widget title,
  Widget? description,
  HoronModalSize size = HoronModalSize.md,
  HoronModalSurfaceKind surface = HoronModalSurfaceKind.solid,
  Widget? leading,
  String? closeLabel = 'Close',
  Widget? footer,
  Widget? child,
  VoidCallback? onClose,
  bool dismissible = true,
}) {
  return Navigator.of(context).push<T>(
    _HoronModalContentRoute<T>(
      title: title,
      description: description,
      size: size,
      surface: surface,
      leading: leading,
      closeLabel: closeLabel,
      footer: footer,
      child: child,
      onClose: onClose,
      dismissible: dismissible,
    ),
  );
}

/// 가운데에 나타나는 모달 라우트입니다.
class _HoronModalContentRoute<T> extends RawDialogRoute<T> {
  _HoronModalContentRoute({
    required Widget title,
    required Widget? description,
    required HoronModalSize size,
    required HoronModalSurfaceKind surface,
    required Widget? leading,
    required String? closeLabel,
    required Widget? footer,
    required Widget? child,
    required VoidCallback? onClose,
    required bool dismissible,
  }) : super(
         pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
           final HoronThemeData theme = HoronTheme.of(context);
           final HoronSpaceSpec space = theme.space;
           final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
           final Animation<double> progress = reduceMotion
               ? const AlwaysStoppedAnimation<double>(1)
               : CurvedAnimation(parent: animation, curve: HoronMotion.easeOutQuint);

           return Stack(
             children: <Widget>[
               Positioned.fill(
                 child: FadeTransition(
                   opacity: progress,
                   child: BackdropFilter(
                     filter: ui.ImageFilter.blur(sigmaX: _scrimBlur, sigmaY: _scrimBlur),
                     child: ColoredBox(color: theme.colors.bgScrim.withValues(alpha: _scrimOpacity)),
                   ),
                 ),
               ),
               if (dismissible)
                 Positioned.fill(
                   child: GestureDetector(
                     behavior: HitTestBehavior.opaque,
                     onTap: () => Navigator.of(context).maybePop(),
                   ),
                 ),
               Positioned.fill(
                 // p-4 — 뷰포트 가장자리 여백입니다.
                 child: Padding(
                   padding: EdgeInsets.all(space.s4),
                   child: Center(
                     child: AnimatedBuilder(
                       animation: progress,
                       builder: (BuildContext context, Widget? child) => Transform.translate(
                         // data-starting-style:translate-y-2 — 8px 아래에서 올라옵니다.
                         offset: Offset(0, (1 - progress.value) * _enterOffset),
                         child: Opacity(opacity: progress.value, child: child),
                       ),
                       child: HoronModal(
                         title: title,
                         description: description,
                         size: size,
                         surface: surface,
                         leading: leading,
                         closeLabel: closeLabel,
                         footer: footer,
                         onClose: onClose,
                         child: child,
                       ),
                     ),
                   ),
                 ),
               ),
             ],
           );
         },
         barrierDismissible: dismissible,
         barrierLabel: closeLabel,
         // 배경 스크림·블러는 페이지가 직접 그립니다.
         barrierColor: null,
         transitionDuration: _enterDuration,
         // 스크림 페이드와 팝업 전환을 페이지가 들고 있어 SDK 전환은 겹치지 않게 넘깁니다.
         transitionBuilder: (
           BuildContext context,
           Animation<double> animation,
           Animation<double> secondaryAnimation,
           Widget child,
         ) => child,
       );
}

/// `size-8 rounded-full` 닫기 버튼입니다.
///
/// hover에서 `overlay-ink-6` 바탕과 `text-primary` 아이콘으로 바뀌고, 누르면
/// `motion-press`로 줄어듭니다. 초점은 2px `text-brand` 고리로 보여 줍니다.
class _CloseButton extends StatefulWidget {
  const _CloseButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  State<_CloseButton> createState() => _CloseButtonState();
}

class _CloseButtonState extends State<_CloseButton> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  void _tap() => widget.onPressed();

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    Widget content = AnimatedScale(
      scale: _pressed ? HoronMotion.pressScale : 1, // motion-press
      duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
      curve: HoronMotion.pressCurve,
      child: AnimatedContainer(
        duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
        curve: HoronMotion.colorsCurve,
        width: _closeSize,
        height: _closeSize,
        decoration: BoxDecoration(
          color: _hovered ? colors.overlayInk6 : Colors.transparent, // hover:bg-overlay-ink-6
          shape: BoxShape.circle,
        ),
        child: Icon(Icons.close, size: _closeIconSize, color: _hovered ? colors.textPrimary : colors.textSecondary),
      ),
    );

    if (_focused) {
      // focus-visible:outline-2 outline-text-brand
      content = Stack(
        clipBehavior: Clip.none,
        children: <Widget>[
          Positioned(
            left: -_focusWidth,
            top: -_focusWidth,
            right: -_focusWidth,
            bottom: -_focusWidth,
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: colors.textBrand, width: _focusWidth),
                ),
              ),
            ),
          ),
          content,
        ],
      );
    }

    return Semantics(
      button: true,
      label: widget.label,
      child: FocusableActionDetector(
        mouseCursor: SystemMouseCursors.click,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              _tap();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: _tap,
          onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
          onTapUp: (TapUpDetails details) => setState(() => _pressed = false),
          onTapCancel: () => setState(() => _pressed = false),
          child: content,
        ),
      ),
    );
  }
}
