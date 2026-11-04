import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../glass/horon_veil.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `w-105` — 다이얼로그가 더 넓어지지 않는 폭 420입니다.
const double _dialogMaxWidth = 420;

/// `size-8` — 닫기 버튼의 32px 히트 영역입니다.
const double _closeSize = 32;

/// `[&_svg]:size-4` — 닫기 아이콘 16입니다.
const double _closeIconSize = 16;

/// `shadow-[0_24_64]` — 불투명 다이얼로그 그림자의 세로 이동입니다.
const double _solidShadowOffsetY = 24;

/// `shadow-[0_24_64]` — 불투명 다이얼로그 그림자의 흐림 반경입니다.
const double _solidShadowBlur = 64;

/// `motion-popup duration-240` — 나타나는 시간입니다.
const Duration _enterDuration = Duration(milliseconds: 240);

/// `data-starting-style:translate-y-2` — 나타날 때 아래에서 올라오는 거리 8입니다.
const double _enterOffset = 8;

/// Paper `UE8-1`의 스크림 불투명도입니다(0.4).
const double _scrimOpacity = 0.4;

/// `backdrop-blur-[6px]` — 스크림 뒤 배경 흐림 반경입니다.
const double _scrimBlur = 6;

/// Figma `Dialog on scrim`(63:329)의 다이얼로그 표면입니다.
///
/// React `DialogContent`를 옮긴 것입니다. 24px 여백, `title-md` 제목, 32px 닫기
/// 영역, `body-md` 설명으로 이루어지고, [solid]면 Paper 워크스페이스 모달의 불투명
/// 표면과 0/24/64 그림자를, 아니면 `veil-overlay`를 씁니다.
///
/// React는 `surface`(`glass` | `solid`)를 컴포넌트 파일 안의 인라인 유니온으로
/// 선언합니다. 게이트가 읽는 것은 `export type` 선언뿐이라 public enum으로 만들면
/// 어휘 게이트가 실패하므로 [solid] 불리언으로 옮겼습니다
/// (React `surface="solid"` → `solid: true`).
///
/// 다이얼로그를 띄우려면 [showHoronDialog]를 씁니다. 스크림·가운데 배치·전환은 그
/// 함수가 소유합니다.
class HoronDialog extends StatelessWidget {
  /// 다이얼로그의 내용을 받습니다.
  const HoronDialog({
    super.key,
    required this.title,
    this.description,
    this.closeLabel = 'Close',
    this.leading,
    this.solid = true,
    this.child,
    this.onClose,
  });

  /// 제목입니다. React `title`(`ReactNode`)이며 `title-md`로 그립니다.
  final Widget title;

  /// 제목 아래 설명입니다. React `description`(`ReactNode`)이며 `body-md`입니다.
  final Widget? description;

  /// 닫기 버튼의 이름입니다. null이면 닫기 버튼을 그리지 않습니다.
  /// React `closeLabel`(기본 "Close", `null`이면 숨김).
  final String? closeLabel;

  /// 제목 앞의 타일이나 아이콘입니다. React `leading`입니다.
  final Widget? leading;

  /// 불투명한 기본 채움입니다. React `surface="solid"`입니다.
  ///
  /// `bg-bg-surface`, 20px 반경, 24px 여백, 16px 리듬과 0/24/64 그림자를 쓰고
  /// veil을 깔지 않습니다.
  final bool solid;

  /// 다이얼로그 본문입니다. React `children`입니다.
  final Widget? child;

  /// 닫기 버튼을 눌렀을 때 부를 콜백입니다. 없으면 현재 라우트를 닫습니다.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    // 두 표면 모두 16px 리듬(`gap-4`)을 씁니다.
    final double gap = space.s4;
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl); // rounded-xl = 20

    final Widget header = Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      // leading이 있으면 gap-3.5(14), 없으면 gap-2(8)입니다.
      spacing: leading != null ? space.s3_5 : space.s2,
      children: <Widget>[
        ?leading,
        Expanded(
          child: DefaultTextStyle(
            style: theme.text.titleMd.copyWith(color: colors.textPrimary),
            child: title,
          ),
        ),
        if (closeLabel != null)
          _DialogClose(label: closeLabel!, onTap: onClose ?? () => Navigator.of(context).maybePop()),
      ],
    );

    final Widget body = Padding(
      padding: EdgeInsets.all(space.s6), // p-6
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: gap,
        children: <Widget>[
          header,
          if (description != null)
            DefaultTextStyle(
              style: theme.text.bodyMd.copyWith(color: colors.textSecondary),
              child: description!,
            ),
          ?child,
        ],
      ),
    );

    if (!solid) {
      // React `veil-overlay` — 74% 채움, 1px 링, 0 6 24 그림자를 스스로 그립니다.
      return HoronVeil(kind: HoronVeilKind.overlay, borderRadius: radius, child: body);
    }

    // shadow-[0_24_64_#0A142433] — React의 색은 푸른 기가 도는 검정 20%입니다.
    // 토큰에 그 색이 없어 같은 불투명도의 overlay-ink-20으로 옮겼습니다.
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
      child: ClipRRect(borderRadius: radius, child: body),
    );
  }
}

/// `dialog.tsx`의 `DialogFooter`입니다.
///
/// `w-full flex-wrap items-center justify-end gap-2` — 폭을 채우고 오른쪽에 붙는
/// 동작 줄입니다. React는 위 여백 `mt-4`를 없애고 본문 리듬(gap-4)에 맡깁니다.
/// `justify-end`는 Wrap의 `WrapAlignment.end`로 옮겼습니다. Row의
/// `MainAxisAlignment.end`와 같은 정렬이고, 좁아지면 줄을 바꿀 수 있습니다.
class HoronDialogFooter extends StatelessWidget {
  /// 동작 줄을 만듭니다.
  const HoronDialogFooter({super.key, required this.children});

  /// 동작 버튼 목록입니다. React `children`입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return SizedBox(
      width: double.infinity,
      child: Wrap(
        alignment: WrapAlignment.end,
        crossAxisAlignment: WrapCrossAlignment.center,
        spacing: space.s2,
        runSpacing: space.s2,
        children: children,
      ),
    );
  }
}

/// 다이얼로그를 화면 가운데에 띄웁니다.
///
/// React `DialogContent`의 Portal·Backdrop·Viewport를 맡습니다. 32% 스크림과 6px
/// 배경 흐림을 깔고, 바깥을 누르면 닫습니다.
Future<void> showHoronDialog(
  BuildContext context, {
  required Widget title,
  Widget? description,
  String? closeLabel = 'Close',
  Widget? leading,
  bool solid = false,
  Widget? child,
  VoidCallback? onClose,
  bool dismissible = true,
}) {
  return Navigator.of(context).push<void>(
    _HoronDialogRoute(
      title: title,
      description: description,
      closeLabel: closeLabel,
      leading: leading,
      solid: solid,
      child: child,
      onClose: onClose,
      dismissible: dismissible,
    ),
  );
}

/// 가운데에 나타나는 다이얼로그 라우트입니다.
class _HoronDialogRoute extends RawDialogRoute<void> {
  _HoronDialogRoute({
    required Widget title,
    required Widget? description,
    required String? closeLabel,
    required Widget? leading,
    required bool solid,
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
                 // px-4 — 뷰포트 여백이 max-w-[calc(100vw-2rem)]의 자리입니다.
                 child: Padding(
                   padding: EdgeInsets.symmetric(horizontal: space.s4),
                   child: Center(
                     child: ConstrainedBox(
                       constraints: const BoxConstraints(maxWidth: _dialogMaxWidth),
                       child: SizedBox(
                         width: double.infinity,
                         // 화면보다 큰 내용도 잘리지 않게 세로로만 스크롤합니다.
                         child: SingleChildScrollView(
                           child: AnimatedBuilder(
                             animation: progress,
                             builder: (BuildContext context, Widget? child) => Transform.translate(
                               // data-starting-style:translate-y-2 — 8px 아래에서 올라옵니다.
                               offset: Offset(0, (1 - progress.value) * _enterOffset),
                               child: Opacity(opacity: progress.value, child: child),
                             ),
                             child: HoronDialog(
                               title: title,
                               description: description,
                               closeLabel: closeLabel,
                               leading: leading,
                               solid: solid,
                               onClose: onClose,
                               child: child,
                             ),
                           ),
                         ),
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

/// 다이얼로그 닫기 버튼입니다.
///
/// React `size-8 ... rounded-full hover:bg-overlay-ink-6 hover:text-text-primary` —
/// 32px 원 히트 영역, hover 시 6% 잉크 원과 본문 색 아이콘, 2px 포커스 링을 씁니다.
class _DialogClose extends StatefulWidget {
  const _DialogClose({required this.label, required this.onTap});

  final String label;
  final VoidCallback onTap;

  @override
  State<_DialogClose> createState() => _DialogCloseState();
}

class _DialogCloseState extends State<_DialogClose> {
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
      child: Icon(Icons.close, size: _closeIconSize, color: _hovered ? colors.textPrimary : colors.textSecondary),
    );

    if (_focused) {
      // focus-visible:outline-2 — 레이아웃을 밀지 않도록 바깥에 겹쳐 그립니다.
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
                  border: Border.all(color: colors.textBrand, width: space.s0_5),
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
