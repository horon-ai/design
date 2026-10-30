import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
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

/// `size-8` — 닫기 버튼 상자 32입니다.
const double _closeSize = 32;

/// `[&_svg]:size-4` — 패널 시트 닫기 아이콘 16입니다.
const double _closeIconSize = 16;

/// `size-[18px]` — 상세 시트 닫기 아이콘 18입니다.
const double _detailCloseIconSize = 18;

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
/// React `BottomSheetContent`를 옮긴 것입니다. 그랩바, 제목 줄, 닫기 버튼과 내용을
/// 담고, 위쪽 두 모서리만 둥급니다.
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
    this.closeLabel = 'Close',
    this.detail = false,
    this.solid = false,
    this.floating = false,
    this.child,
    this.onClose,
  });

  /// 제목입니다. React `title`(`ReactNode`)입니다.
  ///
  /// [detail]이 거짓이면 `text-label-lg`, 참이면 호출자가 만든 헤더이므로 색만
  /// `text-text-primary`로 맞춥니다.
  final Widget title;

  /// 닫기 버튼의 이름입니다. null이면 닫기 버튼을 그리지 않습니다.
  /// React `closeLabel`(기본 "Close", `null`이면 숨김).
  final String? closeLabel;

  /// Paper의 상세 시트 배치입니다. React `variant="detail"`입니다.
  ///
  /// 머리글을 왼쪽 위에 붙이고 18px 리듬(gap-4.5)을 쓰며, 닫기 버튼이 투명하고
  /// 아이콘이 18px입니다.
  final bool detail;

  /// 불투명한 기본 채움입니다. React `surface="solid"`입니다.
  ///
  /// `bg-bg-default`, 위쪽 20px 모서리, 아래 여백 24px을 쓰고 유리를 깔지 않습니다.
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
    // React: solid나 floating이면 `<LiquidGlass>`를 그리지 않습니다.
    final bool glass = !solid && !floating;
    // dark:shadow-none — 다크에서는 테두리 고리와 안쪽 테두리를 모두 끕니다.
    final bool rings = glass && theme.brightness != Brightness.dark;

    final Widget header = Padding(
      // 패널은 pt-2.5 pb-2 pl-1, 상세는 여백 없이 왼쪽 위에 붙습니다.
      padding: detail ? EdgeInsets.zero : EdgeInsets.only(top: space.step(2.5), bottom: space.s2, left: space.s1),
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
          if (closeLabel != null)
            _Pressable(
              onTap: onClose ?? () => Navigator.of(context).maybePop(),
              semanticLabel: closeLabel,
              ringRadius: theme.radius.full,
              child: Container(
                width: _closeSize,
                height: _closeSize,
                decoration: BoxDecoration(
                  // 상세 시트의 닫기는 bg-transparent, 패널은 bg-overlay-ink-6입니다.
                  color: detail ? Colors.transparent : colors.overlayInk6,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.close,
                  size: detail ? _detailCloseIconSize : _closeIconSize,
                  color: colors.textSecondary,
                ),
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
        return ClipRRect(
          borderRadius: radius,
          child: Stack(
            children: <Widget>[
              if (glass)
                Positioned.fill(
                  child: HoronLiquidGlass(
                    tier: HoronGlassTier.thick,
                    borderRadius: radius,
                    child: const SizedBox.expand(),
                  ),
                ),
              if (solid) Positioned.fill(child: ColoredBox(color: colors.bgDefault)),
              if (rings)
                Positioned.fill(
                  child: IgnorePointer(
                    child: DecoratedBox(
                      // shadow-[inset_0_0_0_1px_var(--color-glass-rim-frost)] — 안쪽 1px 테두리입니다.
                      decoration: BoxDecoration(
                        borderRadius: radius,
                        border: Border.all(color: colors.glassRimFrost),
                      ),
                    ),
                  ),
                ),
              Padding(
                // px-4 pt-2, 아래는 pb-5(유리) 또는 pb-6(불투명)입니다.
                padding: EdgeInsets.only(
                  left: space.s4,
                  right: space.s4,
                  top: space.s2,
                  bottom: solid ? space.s6 : space.s5,
                ),
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
              ),
            ],
          ),
        );
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
/// 시트 아래쪽의 동작 줄입니다. React는 `flex gap-2 pt-3` 한 줄이지만, 폭이
/// 좁아지면 버튼이 넘치므로 [Wrap]으로 줄을 바꿉니다(가로 스크롤은 쓰지 않습니다).
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
      child: Wrap(
        spacing: space.s2,
        runSpacing: space.s2,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: children,
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
  String? closeLabel = 'Close',
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
      closeLabel: closeLabel,
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
class _HoronBottomSheetRoute extends PopupRoute<void> {
  _HoronBottomSheetRoute({
    required this.title,
    required this.closeLabel,
    required this.detail,
    required this.solid,
    required this.backdrop,
    required this.floating,
    required this.child,
    required this.onClose,
  });

  final Widget title;
  final String? closeLabel;
  final bool detail;
  final bool solid;
  final bool backdrop;
  final bool floating;
  final Widget? child;
  final VoidCallback? onClose;

  @override
  Color? get barrierColor => null;

  @override
  bool get barrierDismissible => backdrop;

  @override
  String? get barrierLabel => closeLabel;

  @override
  Duration get transitionDuration => _enterDuration;

  @override
  Duration get reverseTransitionDuration => _exitDuration;

  @override
  Widget buildPage(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
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
            child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).maybePop()),
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
                      closeLabel: closeLabel,
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
  }
}

/// `motion-press`(scale .97)와 누름 콜백, 포커스 고리를 한 자리에 묶습니다.
///
/// React의 `motion-press`·`focus-visible:outline-2 outline-text-brand`를 옮긴
/// 것입니다. hover는 데스크톱 포인터에서만 커서를 바꾸고, 누름 상태는 터치에서도
/// 보입니다.
class _Pressable extends StatefulWidget {
  const _Pressable({required this.child, this.onTap, this.semanticLabel, this.ringRadius, this.ringInset = false});

  final Widget child;
  final VoidCallback? onTap;
  final String? semanticLabel;
  final double? ringRadius;

  /// 참이면 고리를 자식 안쪽에 그립니다(`-outline-offset-2`).
  final bool ringInset;

  @override
  State<_Pressable> createState() => _PressableState();
}

class _PressableState extends State<_Pressable> {
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final bool enabled = widget.onTap != null;

    Widget content = widget.child;
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
        label: widget.semanticLabel,
        child: FocusableActionDetector(
          enabled: enabled,
          mouseCursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
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
    );
  }
}
