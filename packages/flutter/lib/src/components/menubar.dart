import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'dropdown_menu.dart';

/// 수평 메뉴 바의 `h-9`입니다.
const double _barHeight = HoronSpace.s9;

/// 수평 메뉴 바의 `gap-1`입니다.
const double _barGap = HoronSpace.s1;

/// 수평 메뉴 바의 `p-1`입니다.
const double _barPadding = HoronSpace.s1;

/// 트리거의 `h-7`입니다.
const double _triggerHeight = HoronSpace.s7;

/// 트리거의 `px-3`입니다.
const double _triggerPaddingHorizontal = HoronSpace.s3;

/// 트리거의 `gap-1.5`입니다.
const double _triggerGap = HoronSpace.s1_5;

/// 트리거의 `text-sm`입니다.
const double _triggerFontSize = HoronText.body;

/// 트리거의 `focus-visible:ring-3`입니다.
const double _focusRingWidth = 3;

/// 트리거의 `ring-ring/50`입니다.
const double _focusRingAlpha = 0.5;

/// 트리거 아이콘의 `size-4`입니다.
const double _iconSize = HoronSpace.s4;

/// 메뉴 바가 보이기 시작하는 최소 폭입니다.
///
/// 계획이 "태블릿·데스크톱 폭에서만 노출"로 정했습니다. [HoronBreakpoint.md](768)를
/// 경계로 삼고, 그 아래에서는 [HoronMenubar]가 아무것도 그리지 않습니다.
const double horonMenubarMinWidth = HoronBreakpoint.md;

/// 수평 메뉴 바입니다.
///
/// `menubar.tsx`를 옮긴 것입니다. `h-9`·`gap-1`·`p-1`·`rounded-md`·
/// `border-border`·`bg-card`를 그대로 씁니다. 각 항목은
/// [HoronMenubarMenu]이고, 그 트리거를 누르면 아래로 드롭다운이 열립니다.
///
/// 계획대로 태블릿·데스크톱 폭에서만 보입니다. [HoronMenubarMinWidth]보다 좁은
/// 화면에서는 아무것도 그리지 않으므로, 좁은 화면의 탐색은 호스트가 다른 방법으로
/// 제공해야 합니다. [alwaysVisible]을 켜면 폭과 무관하게 그립니다(테스트·갤러리용).
///
/// ```dart
/// HoronMenubar(
///   children: <Widget>[
///     HoronMenubarMenu(
///       trigger: const HoronMenubarTrigger(label: '파일'),
///       children: <Widget>[
///         HoronMenubarItem(label: '새로 만들기', onSelected: newFile),
///         HoronMenubarSeparator(),
///         HoronMenubarItem(label: '닫기', onSelected: close),
///       ],
///     ),
///   ],
/// );
/// ```
class HoronMenubar extends StatelessWidget {
  /// 메뉴 바를 만듭니다.
  const HoronMenubar({
    super.key,
    required this.children,
    this.minWidth = horonMenubarMinWidth,
    this.alwaysVisible = false,
    this.semanticLabel,
  });

  /// 바에 나열할 [HoronMenubarMenu]입니다.
  final List<Widget> children;

  /// 이 폭보다 좁으면 바를 그리지 않습니다.
  final double minWidth;

  /// 폭과 무관하게 그릴지 여부입니다.
  final bool alwaysVisible;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    if (!alwaysVisible) {
      final double width = MediaQuery.sizeOf(context).width;
      if (width < minWidth) return const SizedBox.shrink();
    }

    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Semantics(
      container: true,
      label: semanticLabel,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: scheme.surfaceContainerLow,
          borderRadius: BorderRadius.circular(HoronRadiusRole.card),
          border: Border.all(color: scheme.outline),
        ),
        child: Padding(
          padding: const EdgeInsets.all(_barPadding),
          child: SizedBox(
            height: _barHeight - _barPadding * 2,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                for (int index = 0; index < children.length; index++) ...<Widget>[
                  if (index > 0) const SizedBox(width: _barGap),
                  children[index],
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 메뉴 바 안의 메뉴 하나입니다.
///
/// `menubar.tsx`의 `MenubarMenu`입니다. 트리거를 누르면 아래로 드롭다운이 열립니다.
/// 배치·바깥 탭 닫기·`Escape`는 [HoronDropdownMenu]가 이미 갖고 있으므로 그 위젯을
/// 감싸고, 이 클래스는 메뉴 바 안에서의 모양만 정합니다.
class HoronMenubarMenu extends StatelessWidget {
  /// 메뉴를 만듭니다.
  const HoronMenubarMenu({super.key, required this.trigger, required this.children, this.enabled = true});

  /// 트리거입니다. 보통 [HoronMenubarTrigger]입니다.
  final Widget trigger;

  /// 펼쳐졌을 때 보일 항목입니다.
  final List<Widget> children;

  /// 열 수 있는 상태인지입니다.
  final bool enabled;

  @override
  Widget build(BuildContext context) => HoronDropdownMenu(trigger: trigger, enabled: enabled, children: children);
}

/// `menubar.tsx`의 `MenubarTrigger`입니다.
///
/// `h-7`·`rounded-sm`·`px-3`·`text-sm font-medium`을 그대로 옮깁니다. 열려 있으면
/// `data-popup-open:bg-accent`처럼 강조 채움을 칠하고, 포커스를 받으면 금색 링을
/// 그립니다.
class HoronMenubarTrigger extends StatefulWidget {
  /// 트리거를 만듭니다.
  const HoronMenubarTrigger({super.key, this.label, this.child, this.icon, this.semanticLabel})
    : assert(label != null || child != null, 'HoronMenubarTrigger needs a label or a child.');

  /// 트리거 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘 슬롯입니다.
  final Widget? icon;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronMenubarTrigger> createState() => _HoronMenubarTriggerState();
}

class _HoronMenubarTriggerState extends State<HoronMenubarTrigger> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool open = HoronPopupMenuScope.maybeOf(context)?.open ?? false;
    final bool accent = open || _hovered;

    final Color? ring = _focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null;
    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _triggerFontSize,
      height: HoronLineHeight.none,
      fontWeight: HoronFontWeight.medium,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return Semantics(
      button: true,
      label: widget.semanticLabel ?? widget.label,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: FocusableActionDetector(
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: HoronDuration.fast),
            curve: HoronEasing.easingDefault,
            height: _triggerHeight,
            padding: const EdgeInsets.symmetric(horizontal: _triggerPaddingHorizontal),
            decoration: BoxDecoration(
              color: accent ? scheme.surfaceContainerHighest : Colors.transparent,
              borderRadius: BorderRadius.circular(HoronRadius.sm),
              boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _focusRingWidth)],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                if (widget.icon != null) ...<Widget>[
                  IconTheme.merge(
                    data: IconThemeData(size: _iconSize, color: scheme.onSurfaceVariant),
                    child: widget.icon!,
                  ),
                  const SizedBox(width: _triggerGap),
                ],
                DefaultTextStyle(
                  style: textStyle,
                  child: widget.label != null
                      ? Text(
                          widget.label!,
                          maxLines: 1,
                          softWrap: false,
                          overflow: TextOverflow.ellipsis,
                          style: textStyle,
                        )
                      : widget.child!,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// `menubar.tsx`의 `MenubarContent`입니다.
///
/// 표면·여백·스크롤은 `dropdown_menu`의 `HoronDropdownMenuContent`와 같습니다.
class HoronMenubarContent extends StatelessWidget {
  /// 패널 내용을 만듭니다.
  const HoronMenubarContent({
    super.key,
    required this.children,
    this.minWidth = horonPopupMenuMinWidth,
    this.maxHeight,
  });

  /// 패널 안에 세로로 쌓을 항목입니다.
  final List<Widget> children;

  /// 패널의 최소 폭입니다.
  final double minWidth;

  /// 패널이 넘지 않을 최대 높이입니다.
  final double? maxHeight;

  @override
  Widget build(BuildContext context) =>
      HoronDropdownMenuContent(minWidth: minWidth, maxHeight: maxHeight, children: children);
}

/// `menubar.tsx`의 `MenubarItem`입니다.
class HoronMenubarItem extends StatelessWidget {
  /// 항목을 만듭니다.
  const HoronMenubarItem({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.trailing,
    this.onSelected,
    this.enabled = true,
    this.semanticLabel,
  });

  /// 항목 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘 슬롯입니다.
  final Widget? icon;

  /// 오른쪽 끝에 붙는 내용입니다.
  final Widget? trailing;

  /// 항목을 골랐을 때 부릅니다.
  final VoidCallback? onSelected;

  /// 고를 수 있는 상태인지입니다.
  final bool enabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) => HoronDropdownMenuItem(
    label: label,
    icon: icon,
    trailing: trailing,
    onSelected: onSelected,
    enabled: enabled,
    semanticLabel: semanticLabel,
    child: child,
  );
}

/// `menubar.tsx`의 `MenubarSeparator`입니다.
class HoronMenubarSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronMenubarSeparator({super.key});

  @override
  Widget build(BuildContext context) => const HoronDropdownMenuSeparator();
}

/// `menubar.tsx`의 `MenubarLabel`입니다.
class HoronMenubarLabel extends StatelessWidget {
  /// 라벨을 만듭니다.
  const HoronMenubarLabel({super.key, required this.label});

  /// 라벨 글자입니다.
  final String label;

  @override
  Widget build(BuildContext context) => HoronDropdownMenuLabel(label: label);
}
