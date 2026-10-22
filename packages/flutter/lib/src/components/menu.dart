import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';
import 'glass_surface.dart';

/// `menu.tsx`의 `gap-px`입니다. 항목 사이를 1px 띄웁니다.
const double _menuGap = 1.0;

/// `menu.tsx`의 `p-1`입니다.
const double _menuPadding = HoronSpace.s1;

/// `menu.tsx` 항목의 `px-2.5`입니다.
const double _itemPaddingHorizontal = HoronSpace.s2_5;

/// `menu.tsx` 항목의 `py-[7px]`입니다. 4px 눈금에 없는 값이라 이름을 붙여 둡니다.
const double _itemPaddingVertical = 7.0;

/// `menu.tsx` 항목의 `gap-2`입니다.
const double _itemGap = HoronSpace.s2;

/// `menu.tsx` 항목의 `rounded-[5px]`입니다. 4px 눈금에 없는 값입니다.
const double _itemRadius = 5.0;

/// `menu.tsx` 항목의 `text-xs`입니다.
const double _itemFontSize = HoronText.caption;

/// `text-xs`의 줄 높이 1rem(16px)을 12px 글자로 나눈 값입니다.
const double _itemLineHeight = 16 / 12;

/// `menu.tsx` 라벨의 `text-[11px]`입니다. 생성 스케일의 12보다 작은 값입니다.
const double _labelFontSize = 11.0;

/// `menu.tsx` 라벨의 `py-1`입니다.
const double _labelPaddingVertical = HoronSpace.s1;

/// `menu.tsx` 구분선의 `my-1`입니다.
const double _separatorMargin = HoronSpace.s1;

/// 구분선 두께입니다. CSS `h-px`입니다.
const double _separatorThickness = 1.0;

/// 항목의 `hover:bg-foreground/5`·`focus-visible:bg-foreground/5` 투명도입니다.
const double _hoverAlpha = 0.05;

/// `data-disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// 항목 안 아이콘의 `size-4`입니다.
const double _iconSize = HoronSpace.s4;

/// 고정 폭 유리 메뉴 패널입니다.
///
/// `menu.tsx`의 `Menu`를 옮긴 것입니다. `.glass-strong` 표면에 `w-[200px]`,
/// `flex-col`, `gap-px`, `rounded-md`, `p-1`을 그대로 씁니다. 폭은 생성 토큰
/// [HoronMenuMetrics.width]가 들고 있으므로 호스트가 바꾸려면 [width]를 넘깁니다.
///
/// ```dart
/// HoronMenu(
///   children: <Widget>[
///     const HoronMenuLabel(label: '계정'),
///     HoronMenuItem(label: '프로필', onSelected: openProfile),
///     const HoronMenuSeparator(),
///     HoronMenuItem(label: '로그아웃', onSelected: signOut),
///   ],
/// );
/// ```
///
/// 이 위젯은 패널 자체입니다. 트리거에 붙여 열고 닫으려면 `dropdown_menu`의
/// `HoronDropdownMenu`처럼 오버레이를 소유한 위젯을 쓰십시오.
class HoronMenu extends StatelessWidget {
  /// 메뉴 패널을 만듭니다.
  const HoronMenu({super.key, required this.children, this.width = HoronMenuMetrics.width, this.semanticLabel});

  /// 패널의 바깥 상자를 찾는 키입니다. 테스트가 폭을 재는 자리입니다.
  static const Key panelKey = ValueKey<String>('horon-menu');

  /// 패널 안에 세로로 쌓을 항목입니다.
  final List<Widget> children;

  /// 패널 폭입니다. React의 `w-[200px]`가 기본값입니다.
  final double width;

  /// 스크린리더가 읽을 메뉴 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      key: panelKey,
      width: width,
      child: HoronGlassSurface.strong(
        padding: const EdgeInsets.all(_menuPadding),
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
        child: Semantics(
          container: true,
          explicitChildNodes: true,
          label: semanticLabel,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              for (int index = 0; index < children.length; index++) ...<Widget>[
                if (index > 0) const SizedBox(height: _menuGap),
                children[index],
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// 메뉴 안의 항목 하나입니다.
///
/// `menu.tsx`의 `MenuItem`입니다. `text-xs`·`px-2.5`·`py-[7px]`·`gap-2`·
/// `rounded-[5px]`에, 마우스를 올리거나 키보드로 포커스를 받으면
/// `bg-foreground/5`를 칠합니다. 비활성이면 `opacity-50`에 눌러도 반응하지
/// 않습니다.
class HoronMenuItem extends StatefulWidget {
  /// 항목을 만듭니다.
  const HoronMenuItem({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.trailing,
    this.onSelected,
    this.enabled = true,
    this.semanticLabel,
  }) : assert(label != null || child != null, 'HoronMenuItem needs a label or a child.');

  /// 항목 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘 슬롯입니다. React의 `[&_svg]:size-4` 자리입니다.
  final Widget? icon;

  /// 글자 뒤 오른쪽 끝에 붙는 내용입니다. 보통 [HoronMenuShortcut]입니다.
  final Widget? trailing;

  /// 항목을 골랐을 때 부릅니다. `null`이면 눌러도 아무 일도 없습니다.
  final VoidCallback? onSelected;

  /// 고를 수 있는 상태인지입니다. React의 `data-disabled`에 대응합니다.
  final bool enabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronMenuItem> createState() => _HoronMenuItemState();
}

class _HoronMenuItemState extends State<HoronMenuItem> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool enabled = widget.enabled;
    final bool highlighted = enabled && (_hovered || _focused);

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _itemFontSize,
      height: _itemLineHeight,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    final Widget body = Container(
      padding: const EdgeInsets.symmetric(horizontal: _itemPaddingHorizontal, vertical: _itemPaddingVertical),
      decoration: BoxDecoration(
        color: highlighted ? scheme.onSurface.withValues(alpha: _hoverAlpha) : Colors.transparent,
        borderRadius: BorderRadius.circular(_itemRadius),
      ),
      child: Row(
        children: <Widget>[
          if (widget.icon != null) ...<Widget>[
            IconTheme.merge(
              data: IconThemeData(size: _iconSize, color: scheme.onSurfaceVariant),
              child: widget.icon!,
            ),
            const SizedBox(width: _itemGap),
          ],
          Expanded(
            child: DefaultTextStyle(
              style: textStyle,
              child: widget.label != null
                  ? Text(widget.label!, maxLines: 1, overflow: TextOverflow.ellipsis, softWrap: false, style: textStyle)
                  : widget.child!,
            ),
          ),
          if (widget.trailing != null) ...<Widget>[const SizedBox(width: _itemGap), widget.trailing!],
        ],
      ),
    );

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.semanticLabel ?? widget.label,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: FocusableActionDetector(
          enabled: enabled,
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                if (enabled) widget.onSelected?.call();
                return null;
              },
            ),
          },
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: enabled ? widget.onSelected : null,
            child: Opacity(opacity: enabled ? 1 : _disabledOpacity, child: body),
          ),
        ),
      ),
    );
  }
}

/// 메뉴 안의 그룹 라벨입니다.
///
/// `menu.tsx`의 `MenuLabel`입니다. `px-2.5 py-1 text-[11px]`에
/// `text-muted-foreground`를 씁니다.
class HoronMenuLabel extends StatelessWidget {
  /// 라벨을 만듭니다.
  const HoronMenuLabel({super.key, required this.label});

  /// 라벨 글자입니다. 호스트가 넘깁니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: _itemPaddingHorizontal, vertical: _labelPaddingVertical),
      child: Text(
        label,
        style: TextStyle(
          fontFamily: HoronFont.body,
          fontFamilyFallback: HoronFont.fontFamilyFallback,
          fontSize: _labelFontSize,
          height: HoronLineHeight.normal,
          color: scheme.onSurfaceVariant,
          decoration: TextDecoration.none,
        ),
      ),
    );
  }
}

/// 메뉴 안의 구분선입니다.
///
/// `menu.tsx`의 `MenuSeparator`입니다. `my-1 h-px bg-border`를 그대로 옮겨,
/// 위아래 4를 띄우고 1px 선을 긋습니다.
class HoronMenuSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronMenuSeparator({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: _separatorMargin),
      child: SizedBox(
        height: _separatorThickness,
        child: ColoredBox(color: scheme.outline),
      ),
    );
  }
}

/// 항목 오른쪽 끝의 단축키 힌트입니다.
///
/// 계획이 `menu`의 부품으로 이름을 지정한 위젯입니다. React의 `menu.tsx`에는 이
/// 부품이 없고, 같은 자리를 호스트가 `kbd`로 채웁니다. 그래서 여기서는 `kbd`와
/// 같은 고정폭 11px·`text-muted-foreground`로 그려, 웹에서 키캡을 넣은 메뉴와 같은
/// 인상을 냅니다. [HoronMenuItem.trailing]에 넣어 씁니다.
class HoronMenuShortcut extends StatelessWidget {
  /// 단축키 힌트를 만듭니다.
  const HoronMenuShortcut({super.key, required this.label});

  /// 키 조합 글자입니다. 예: `⌘K`.
  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Text(
      label,
      maxLines: 1,
      softWrap: false,
      style: TextStyle(
        fontFamily: HoronFont.mono,
        fontSize: _labelFontSize,
        height: HoronLineHeight.none,
        color: scheme.onSurfaceVariant,
        decoration: TextDecoration.none,
      ),
    );
  }
}

/// 메뉴 항목을 묶는 그룹입니다.
///
/// 계획이 `menu`의 부품으로 이름을 지정한 위젯입니다. React의 `menu.tsx`는 항목을
/// 그룹으로 묶지 않고 호스트가 라벨과 구분선을 직접 늘어놓습니다. 이 위젯은 그
/// 반복을 줄이려고 [label]과 항목들을 한 덩어리로 묶습니다. 그룹 안쪽 간격은
/// 패널의 `gap-px`와 같은 1px입니다.
class HoronMenuGroup extends StatelessWidget {
  /// 그룹을 만듭니다.
  const HoronMenuGroup({super.key, required this.children, this.label});

  /// 그룹에 넣을 항목입니다.
  final List<Widget> children;

  /// 그룹 위에 붙는 라벨입니다. 없으면 항목만 쌓습니다.
  final String? label;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        if (label != null) HoronMenuLabel(label: label!),
        for (int index = 0; index < children.length; index++) ...<Widget>[
          if (index > 0) const SizedBox(height: _menuGap),
          children[index],
        ],
      ],
    );
  }
}
