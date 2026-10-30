import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `w-105` — 다이얼로그가 더 넓어지지 않는 폭 420입니다.
const double _dialogMaxWidth = 420;

/// `0_0_0_1px_var(--color-overlay-ink-3)` — 유리 다이얼로그 바깥 1px 고리입니다.
const double _ringWidth = 1;

/// `[&_svg]:size-5` — 닫기 아이콘 20입니다.
const double _closeIconSize = 20;

/// `shadow-[0_24_64]` — 불투명 다이얼로그 그림자의 세로 이동입니다.
const double _solidShadowOffsetY = 24;

/// `shadow-[0_24_64]` — 불투명 다이얼로그 그림자의 흐림 반경입니다.
const double _solidShadowBlur = 64;

/// `motion-popup duration-240` — 나타나는 시간입니다.
const Duration _enterDuration = Duration(milliseconds: 240);

/// `data-starting-style:translate-y-2` — 나타날 때 아래에서 올라오는 거리 8입니다.
const double _enterOffset = 8;

/// `bg-bg-scrim/32` — 스크림 불투명도입니다.
const double _scrimOpacity = 0.32;

/// `backdrop-blur-[6px]` — 스크림 뒤 배경 흐림 반경입니다.
const double _scrimBlur = 6;

/// Figma `Dialog on scrim`(63:329)의 다이얼로그 표면입니다.
///
/// React `DialogContent`를 옮긴 것입니다. 24px 여백, `title-md` 제목, 20px 닫기,
/// `body-md` 설명으로 이루어지고, [solid]면 Paper 워크스페이스 모달의 불투명
/// 표면과 0/24/64 그림자를 씁니다.
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
    this.solid = false,
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
  /// `bg-bg-default`, 20px 반경, 24px 여백, 20px 리듬과 0/24/64 그림자를 쓰고
  /// 유리를 깔지 않습니다.
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

    // solid는 gap-5(20), glass는 gap-2(8)입니다.
    final double gap = solid ? space.s5 : space.s2;
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl); // rounded-xl / rounded-[20px]
    // dark:shadow-none — 다크에서는 테두리 고리와 그림자를 모두 끕니다.
    final bool rings = !solid && theme.brightness != Brightness.dark;

    // shadow-[0_24_64_#0A142433] — React의 색은 푸른 기가 도는 검정 20%입니다.
    // 토큰에 그 색이 없어 같은 불투명도의 overlay-ink-20으로 옮겼습니다.
    final List<BoxShadow> shadows = solid
        ? <BoxShadow>[
            BoxShadow(
              color: colors.overlayInk20,
              offset: const Offset(0, _solidShadowOffsetY),
              blurRadius: _solidShadowBlur,
            ),
          ]
        : rings
        ? <BoxShadow>[BoxShadow(color: colors.overlayInk3, spreadRadius: _ringWidth)]
        : const <BoxShadow>[];

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
          _Pressable(
            onTap: onClose ?? () => Navigator.of(context).maybePop(),
            semanticLabel: closeLabel,
            ringRadius: space.s1,
            child: Icon(Icons.close, size: _closeIconSize, color: colors.textSecondary),
          ),
      ],
    );

    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: solid ? colors.bgDefault : null,
        borderRadius: radius,
        // shadow-[inset_0_0_0_1px_var(--color-glass-rim-frost)] — 안쪽 1px 테두리입니다.
        border: rings ? Border.all(color: colors.glassRimFrost) : null,
        boxShadow: shadows,
      ),
      child: Stack(
        children: <Widget>[
          if (!solid)
            Positioned.fill(
              child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: const SizedBox.expand()),
            ),
          Padding(
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
          ),
        ],
      ),
    );
  }
}

/// `dialog.tsx`의 `DialogFooter`입니다.
///
/// 오른쪽으로 붙는 동작 줄입니다. React는 `mt-4 flex justify-end gap-2` 한 줄이지만,
/// 폭이 좁아지면 버튼이 넘치므로 [Wrap]으로 줄을 바꿉니다.
class HoronDialogFooter extends StatelessWidget {
  /// 동작 줄을 만듭니다.
  const HoronDialogFooter({super.key, required this.children});

  /// 동작 버튼 목록입니다. React `children`입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return Padding(
      padding: EdgeInsets.only(top: space.s4), // mt-4
      child: Wrap(alignment: WrapAlignment.end, spacing: space.s2, runSpacing: space.s2, children: children),
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
class _HoronDialogRoute extends PopupRoute<void> {
  _HoronDialogRoute({
    required this.title,
    required this.description,
    required this.closeLabel,
    required this.leading,
    required this.solid,
    required this.child,
    required this.onClose,
    required this.dismissible,
  });

  final Widget title;
  final Widget? description;
  final String? closeLabel;
  final Widget? leading;
  final bool solid;
  final Widget? child;
  final VoidCallback? onClose;
  final bool dismissible;

  @override
  Color? get barrierColor => null;

  @override
  bool get barrierDismissible => dismissible;

  @override
  String? get barrierLabel => closeLabel;

  @override
  Duration get transitionDuration => _enterDuration;

  @override
  Widget buildPage(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
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
            child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).maybePop()),
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
  }
}

/// `motion-press`(scale .97)와 누름 콜백을 한 자리에 묶습니다.
class _Pressable extends StatefulWidget {
  const _Pressable({required this.child, this.onTap, this.semanticLabel, this.ringRadius});

  final Widget child;
  final VoidCallback? onTap;
  final String? semanticLabel;
  final double? ringRadius;

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
