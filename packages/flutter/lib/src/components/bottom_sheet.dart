import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../glass/horon_veil.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `rounded-t-[32px]` — 유리 시트의 위쪽 모서리 반경입니다.
const double _glassTopRadius = 32;

/// `max-w-93.5` — 패널 시트가 더 넓어지지 않는 폭 374입니다.
const double _panelMaxWidth = 374;

/// `h-[5px]` — 그랩바 높이입니다.
const double _grabberHeight = 5;

/// `w-9` — 그랩바 폭 36입니다.
const double _grabberWidth = 36;

/// `rounded-[3px]` — 그랩바 반경입니다.
const double _grabberRadius = 3;

/// `bg-bg-scrim/32` — 스크림 불투명도입니다.
const double _scrimOpacity = 0.32;

/// `backdrop-blur-[6px]` — 스크림 뒤 배경 흐림 반경입니다.
const double _scrimBlur = 6;

/// `duration-320` — 시트가 올라오는 시간입니다.
const Duration _enterDuration = Duration(milliseconds: 320);

/// `data-ending-style:duration-220` — 시트가 내려가는 시간입니다.
const Duration _exitDuration = Duration(milliseconds: 220);

/// `icon size-5` — 행 아이콘 20입니다.
const double _rowIconSize = 20;

/// `size-4` — 행 끝 캐럿 16입니다.
const double _rowCaretSize = 16;

/// Figma `Bottom sheet`(Panels 88:808)의 시트 표면입니다.
///
/// React `BottomSheetContent`를 옮긴 것입니다. 그랩바, 제목 줄과 내용을 담고,
/// 위쪽 두 모서리만 둥급니다. 닫기 버튼은 없습니다. 시트는 스크림, Escape,
/// 그랩바를 아래로 끌기, 호출자의 동작 줄로 닫습니다.
///
/// React는 `variant`(`panel` | `detail`)와 `surface`(`glass` | `solid`)를 컴포넌트
/// 파일 안의 인라인 유니온으로 선언합니다. 게이트가 읽는 것은 `export type` 선언뿐이라
/// 그 둘을 public enum으로 만들면 어휘 게이트가 실패하므로, 같은 값을 [detail]과
/// [solid] 불리언으로 옮겼습니다(React `variant="detail"` → `detail: true`,
/// `surface="solid"` → `solid: true`).
///
/// 시트를 띄우려면 [showHoronBottomSheet]를 씁니다. 스크림·화면 배치·올라오는
/// 전환은 그 함수가 소유하고, 이 위젯은 표면만 그립니다.

class HoronBottomSheet extends StatelessWidget {
  /// 시트의 내용을 받습니다.
  const HoronBottomSheet({
    super.key,
    required this.title,
    this.detail = false,
    this.solid = true,
    this.floating = false,
    this.child,
    this.onClose,
  });

  /// 제목입니다. React `title`(`ReactNode`)입니다.
  ///
  /// [detail]이 거짓이면 `text-label-lg`, 참이면 호출자가 만든 헤더이므로 색만
  /// `text-text-primary`로 맞춥니다.
  final Widget title;

  /// Paper의 상세 시트 배치입니다. React `variant="detail"`입니다.
  ///
  /// 머리글을 왼쪽 위에 붙이고 18px 리듬(gap-4.5)을 씁니다.
  final bool detail;

  /// 불투명한 기본 채움입니다. React `surface="solid"`입니다.
  ///
  /// `bg-bg-surface`, 위쪽 20px 모서리, 아래 여백 24px을 쓰고 veil을 깔지 않습니다.
  final bool solid;

  /// 화면 가장자리에서 16px 띄운 패널 시트입니다. React `floating`입니다.
  ///
  /// 유리를 깔지 않고 12px 리듬(gap-3)을 씁니다.
  final bool floating;

  /// 시트 본문입니다. React `children`입니다.
  final Widget? child;

  /// 닫기 버튼을 눌렀을 때 부를 콜백입니다. 없으면 현재 라우트를 닫습니다.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    // detail은 gap-4.5(18), floating은 gap-3(12), 패널은 gap-1(4)입니다.
    // React는 Popup과 Content 두 겹에 같은 값을 걸지만 값이 항상 같으므로 한 겹으로 합칩니다.
    final double gap = detail
        ? space.step(4.5)
        : floating
        ? space.s3
        : space.s1;
    final BorderRadius radius = BorderRadius.vertical(top: Radius.circular(solid ? theme.radius.xl : _glassTopRadius));
    // floating은 채움 없이 카드로만 뜨고, solid가 아니면 veil 오버레이를 깝니다.
    final bool veil = !solid && !floating;

    final Widget header = Padding(
      // 패널은 pt-2.5 pb-2 pl-2, 상세는 여백 없이 왼쪽 위에 붙습니다.
      padding: detail ? EdgeInsets.zero : EdgeInsets.only(top: space.step(2.5), bottom: space.s2, left: space.s2),
      child: Row(
        crossAxisAlignment: detail ? CrossAxisAlignment.start : CrossAxisAlignment.center,
        spacing: space.s2,
        children: <Widget>[
          Expanded(
            child: DefaultTextStyle(
              style: detail
                  ? DefaultTextStyle.of(context).style.copyWith(color: colors.textPrimary)
                  : theme.text.labelLg.copyWith(color: colors.textPrimary),
              child: title,
            ),
          ),
        ],
      ),
    );

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // 높이 상한이 있는 자리(시트 라우트, 갤러리 미리보기)에서는 본문을 스크롤에
        // 넣어 화면보다 긴 내용도 잘리지 않게 합니다. 상한이 없으면 그냥 쌓습니다.
        final bool bounded = constraints.hasBoundedHeight;
        final Widget body = Padding(
          // px-4 pt-2, 아래는 pb-5(veil) 또는 pb-6(불투명)입니다.
          padding: EdgeInsets.only(left: space.s4, right: space.s4, top: space.s2, bottom: solid ? space.s6 : space.s5),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: gap,
            children: <Widget>[
              // h-[5px] w-9 rounded-[3px] bg-overlay-ink-20 그랩바입니다.
              Center(
                child: Container(
                  width: _grabberWidth,
                  height: _grabberHeight,
                  decoration: BoxDecoration(
                    color: colors.overlayInk20,
                    borderRadius: BorderRadius.circular(_grabberRadius),
                  ),
                ),
              ),
              header,
              if (child != null)
                if (bounded) Flexible(child: SingleChildScrollView(child: child)) else child!,
            ],
          ),
        );

        if (veil) {
          // React `veil-overlay` — 링과 0 6 24 그림자를 스스로 그립니다.
          return HoronVeil(kind: HoronVeilKind.overlay, borderRadius: radius, child: body);
        }
        if (solid) {
          // React `rounded-t-xl bg-bg-surface`.
          return ClipRRect(
            borderRadius: radius,
            child: ColoredBox(color: colors.bgSurface, child: body),
          );
        }
        return body;
      },
    );
  }
}

/// `bottom-sheet.tsx`의 `BottomSheetRow`입니다.
///
/// 48px 설정 행입니다. 20px 아이콘, 말줄임 라벨, 오른쪽 값, 16px 캐럿으로
/// 이루어집니다.
class HoronBottomSheetRow extends StatelessWidget {
  /// 행을 만듭니다.
  const HoronBottomSheetRow({super.key, required this.label, this.icon, this.value, this.onTap});

  /// 행의 이름입니다. React `children`(한 줄로 잘립니다).
  final String label;

  /// 행 앞 아이콘입니다. React `icon`(20px).
  final Widget? icon;

  /// 오른쪽에 붙는 현재 값입니다(예: "On", "Weekdays"). React `value`(`ReactNode`).
  final Widget? value;

  /// 행을 눌렀을 때 부를 콜백입니다. React `onClick`입니다.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return _Pressable(
      onTap: onTap,
      // focus-visible:-outline-offset-2 — 테두리를 행 안쪽에 그립니다.
      ringRadius: theme.radius.lg,
      ringInset: true,
      // `hover:bg-overlay-ink-4`.
      hoverColor: colors.overlayInk4,
      child: Container(
        height: space.step(12), // h-12 = 48
        padding: EdgeInsets.symmetric(horizontal: space.s2), // px-2
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(theme.radius.lg), // rounded-lg
        ),
        child: Row(
          spacing: space.s3, // gap-3
          children: <Widget>[
            if (icon != null)
              IconTheme.merge(
                data: IconThemeData(size: _rowIconSize, color: colors.textSecondary),
                child: icon!,
              ),
            Expanded(
              child: Text(
                label,
                maxLines: 1, // truncate
                overflow: TextOverflow.ellipsis,
                style: theme.text.labelMd.copyWith(color: colors.textPrimary),
              ),
            ),
            if (value != null)
              DefaultTextStyle(
                style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                child: value!,
              ),
            Icon(Icons.chevron_right, size: _rowCaretSize, color: colors.textSecondary),
          ],
        ),
      ),
    );
  }
}

/// `bottom-sheet.tsx`의 `BottomSheetActions`입니다.
///
/// `w-full flex-wrap items-center justify-end gap-2 pt-3` — 폭을 채우고 보조 동작을
/// 먼저, 주 동작을 오른쪽 끝에 두는 줄입니다. 폭이 좁아지면 [Wrap]이 줄을 바꿉니다.
class HoronBottomSheetActions extends StatelessWidget {
  /// 동작 줄을 만듭니다.
  const HoronBottomSheetActions({super.key, required this.children});

  /// 동작 버튼 목록입니다. React `children`입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return Padding(
      padding: EdgeInsets.only(top: space.s3), // pt-3
      child: SizedBox(
        width: double.infinity,
        child: Wrap(
          alignment: WrapAlignment.end,
          spacing: space.s2,
          runSpacing: space.s2,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: children,
        ),
      ),
    );
  }
}

/// `bottom-sheet.tsx`의 `BottomSheetAction`입니다.
///
/// 44px 알약 버튼입니다. React `variant="primary"`는 잉크 바탕, 기본값인
/// `secondary`는 6% 잉크 바탕입니다. [primary] 불리언으로 옮긴 이유는
/// [HoronBottomSheet]의 문서와 같습니다.
class HoronBottomSheetAction extends StatelessWidget {
  /// 동작 버튼을 만듭니다.
  const HoronBottomSheetAction({super.key, required this.label, this.primary = false, this.onPressed});

  /// 버튼 라벨입니다. React `children`입니다.
  final String label;

  /// 잉크 바탕의 주 동작입니다. React `variant="primary"`입니다.
  final bool primary;

  /// 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    final (Color background, Color foreground) = primary
        ? (colors.interactivePrimary, colors.textInverse)
        : (colors.overlayInk6, colors.textPrimary);

    return _Pressable(
      onTap: onPressed,
      ringRadius: theme.radius.full,
      child: Container(
        height: space.step(11), // h-11 = 44
        constraints: BoxConstraints(minWidth: space.step(25)), // min-w-25 = 100
        padding: EdgeInsets.symmetric(horizontal: space.s4), // px-4
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
        ),
        child: Text(
          label,
          maxLines: 1, // whitespace-nowrap
          overflow: TextOverflow.ellipsis,
          style: theme.text.labelMd.copyWith(color: foreground),
        ),
      ),
    );
  }
}

/// 시트를 화면 아래에서 띄웁니다.
///
/// React `BottomSheetContent`의 Portal·Backdrop·Viewport를 맡습니다. [backdrop]이
/// 참이면 32% 스크림과 6px 배경 흐림을 깔고, 스크림을 누르면 닫힙니다.
/// [floating]이면 사방 16px 띄운 카드로, 아니면 화면 아래에 붙입니다.
Future<void> showHoronBottomSheet(
  BuildContext context, {
  required Widget title,
  bool detail = false,
  bool solid = false,
  bool backdrop = true,
  bool floating = false,
  Widget? child,
  VoidCallback? onClose,
}) {
  return Navigator.of(context).push<void>(
    _HoronBottomSheetRoute(
      title: title,
      detail: detail,
      solid: solid,
      backdrop: backdrop,
      floating: floating,
      child: child,
      onClose: onClose,
    ),
  );
}

/// 아래에서 올라오는 시트 라우트입니다.
class _HoronBottomSheetRoute extends RawDialogRoute<void> {
  _HoronBottomSheetRoute({
    required Widget title,
    required bool detail,
    required bool solid,
    required bool backdrop,
    required bool floating,
    required Widget? child,
    required VoidCallback? onClose,
  }) : super(
         pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
           final HoronThemeData theme = HoronTheme.of(context);
           final HoronSpaceSpec space = theme.space;
           final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
           final Animation<double> progress = reduceMotion ? const AlwaysStoppedAnimation<double>(1) : animation;

           // detail은 전폭, floating은 가장자리 16px, 패널은 최대 374px입니다.
           final double maxWidth = detail || floating ? double.infinity : _panelMaxWidth;

           return Stack(
             children: <Widget>[
               if (backdrop)
                 Positioned.fill(
                   child: FadeTransition(
                     opacity: CurvedAnimation(parent: progress, curve: HoronMotion.easeOutQuint),
                     child: BackdropFilter(
                       filter: ui.ImageFilter.blur(sigmaX: _scrimBlur, sigmaY: _scrimBlur),
                       child: ColoredBox(color: theme.colors.bgScrim.withValues(alpha: _scrimOpacity)),
                     ),
                   ),
                 ),
               if (backdrop)
                 Positioned.fill(
                   child: GestureDetector(
                     behavior: HitTestBehavior.opaque,
                     onTap: () => Navigator.of(context).maybePop(),
                   ),
                 ),
               Positioned.fill(
                 child: Align(
                   alignment: Alignment.bottomCenter,
                   child: Padding(
                     padding: floating ? EdgeInsets.fromLTRB(space.s4, 0, space.s4, space.s4) : EdgeInsets.zero,
                     child: ConstrainedBox(
                       constraints: BoxConstraints(maxWidth: maxWidth),
                       child: SizedBox(
                         width: double.infinity,
                         child: SlideTransition(
                           // data-starting-style:translate-y-full — 시트 높이만큼 아래에서 올라옵니다.
                           position: Tween<Offset>(
                             begin: const Offset(0, 1),
                             end: Offset.zero,
                           ).animate(CurvedAnimation(parent: progress, curve: HoronMotion.easeOutQuint)),
                           child: HoronBottomSheet(
                             title: title,
                             detail: detail,
                             solid: solid,
                             floating: floating,
                             onClose: onClose,
                             child: child,
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
         barrierDismissible: backdrop,
         // 닫기 버튼이 없으므로 스크림·뒤로 가기 안내에 기본 이름을 씁니다.
         barrierLabel: 'Close',
         // 배경 스크림·블러는 페이지가 직접 그립니다.
         barrierColor: null,
         transitionDuration: _enterDuration,
         // SDK 기본 전환은 `FadeTransition`입니다. 페이지가 이미 슬라이드와
         // 스크림 페이드를 들고 있으므로 두 번 겹치지 않게 항등으로 넘깁니다.
         transitionBuilder: (
           BuildContext context,
           Animation<double> animation,
           Animation<double> secondaryAnimation,
           Widget child,
         ) => child,
       );

  /// 나가는 시간만 들어오는 시간(320ms)과 다릅니다.
  ///
  /// `RawDialogRoute`에는 이 값을 받는 생성자 인자가 없어 게터로 덮어씁니다.
  @override
  Duration get reverseTransitionDuration => _exitDuration;
}

/// `motion-press`(scale .97)와 누름 콜백, 포커스 고리를 한 자리에 묶습니다.
///
/// React의 `motion-press`·`focus-visible:outline-2 outline-text-brand`를 옮긴
/// 것입니다. hover는 데스크톱 포인터에서만 커서를 바꾸고, 누름 상태는 터치에서도
/// 보입니다.
class _Pressable extends StatefulWidget {
  const _Pressable({required this.child, this.onTap, this.ringRadius, this.ringInset = false, this.hoverColor});

  final Widget child;
  final VoidCallback? onTap;
  final double? ringRadius;

  /// 참이면 고리를 자식 안쪽에 그립니다(`-outline-offset-2`).
  final bool ringInset;

  /// 포인터가 올라왔을 때 까는 바탕입니다. 없으면 hover 채움을 그리지 않습니다.
  final Color? hoverColor;

  @override
  State<_Pressable> createState() => _PressableState();
}

class _PressableState extends State<_Pressable> {
  bool _pressed = false;
  bool _focused = false;
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final bool enabled = widget.onTap != null;

    Widget content = widget.child;
    final Color? hoverColor = widget.hoverColor;
    if (hoverColor != null) {
      // `hover:bg-overlay-ink-4` — 행 바탕을 부드럽게 바꿉니다.
      content = AnimatedContainer(
        duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
        curve: HoronMotion.colorsCurve,
        decoration: BoxDecoration(
          color: _hovered ? hoverColor : Colors.transparent,
          borderRadius: BorderRadius.circular(widget.ringRadius ?? 0),
        ),
        child: content,
      );
    }
    final double? ringRadius = widget.ringRadius;
    if (_focused && enabled && ringRadius != null) {
      // outline-2 — 레이아웃을 밀지 않도록 자식 바깥(또는 안쪽)에 겹쳐 그립니다.
      final double gap = space.s0_5;
      content = Stack(
        clipBehavior: Clip.none,
        children: <Widget>[
          Positioned(
            left: widget.ringInset ? gap : -gap,
            top: widget.ringInset ? gap : -gap,
            right: widget.ringInset ? gap : -gap,
            bottom: widget.ringInset ? gap : -gap,
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(ringRadius),
                  border: Border.all(color: theme.colors.textBrand, width: space.s0_5),
                ),
              ),
            ),
          ),
          content,
        ],
      );
    }

    return AnimatedScale(
      scale: _pressed && enabled ? HoronMotion.pressScale : 1,
      duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
      curve: HoronMotion.pressCurve,
      child: Semantics(
        button: true,
        child: FocusableActionDetector(
          enabled: enabled,
          mouseCursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          child: MouseRegion(
            onEnter: (_) => setState(() => _hovered = true),
            onExit: (_) => setState(() => _hovered = false),
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: widget.onTap,
              onTapDown: (TapDownDetails details) {
                if (enabled) setState(() => _pressed = true);
              },
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
