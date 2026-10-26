import 'package:flutter/material.dart';

import '../overlay/horon_overlay.dart';
import '../tokens/horon_tokens.g.dart';

/// 내비게이션 메뉴 하나를 만듭니다.
///
/// `navigation-menu.tsx`를 옮긴 것입니다. 데스크톱(포인터가 있음)에서는 호버와
/// 클릭으로 플라이아웃이 열리고, 터치에서는 탭으로 여는 시트가 됩니다.
/// 배치는 [HoronOverlay]가 맡으므로 화면마다 다시 구현하지 않습니다.
class HoronNavigationMenu extends StatefulWidget {
  /// 메뉴를 만듭니다.
  const HoronNavigationMenu({
    super.key,
    required this.trigger,
    required this.children,
    this.semanticLabel,
    this.openAsSheet,
  });

  /// 메뉴를 여는 트리거입니다.
  final Widget trigger;

  /// 펼쳐졌을 때 보일 항목들입니다.
  final List<Widget> children;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  /// 시트로 열지 여부입니다.
  ///
  /// `null`이면 플랫폼으로 정합니다. iOS·Android는 터치 기기로 보고 시트를,
  /// macOS·Windows·Linux는 포인터 기기로 보고 플라이아웃을 씁니다. Flutter에는
  /// 웹의 `pointer: fine` 질의가 없어서 플랫폼이 가장 가까운 근거입니다.
  final bool? openAsSheet;

  @override
  State<HoronNavigationMenu> createState() => _HoronNavigationMenuState();
}

class _HoronNavigationMenuState extends State<HoronNavigationMenu> {
  final HoronOverlayController _controller = HoronOverlayController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool sheet = widget.openAsSheet ?? _platformIsTouchFirst();
    final bool pointer = !sheet;

    return MouseRegion(
      onEnter: pointer ? (_) => _controller.show() : null,
      onExit: pointer ? (_) => _controller.hide() : null,
      child: HoronOverlay(
        controller: _controller,
        position: const HoronOverlayPosition(),
        trigger: Semantics(
          button: true,
          label: widget.semanticLabel,
          child: GestureDetector(onTap: () => _controller.toggle(), child: widget.trigger),
        ),
        panelBuilder: (BuildContext context, HoronOverlayPlacement placement) => HoronOverlayPanel(
          maxWidth: placement.maxWidth,
          maxHeight: placement.maxHeight,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: widget.children,
          ),
        ),
      ),
    );
  }

  /// 이 플랫폼이 터치 우선인지입니다.
  bool _platformIsTouchFirst() => switch (Theme.of(context).platform) {
    TargetPlatform.iOS || TargetPlatform.android || TargetPlatform.fuchsia => true,
    TargetPlatform.macOS || TargetPlatform.windows || TargetPlatform.linux => false,
  };
}

/// 내비게이션 메뉴의 항목 목록입니다. 항목을 가로로 나열합니다.
class HoronNavigationMenuList extends StatelessWidget {
  /// 목록을 만듭니다.
  const HoronNavigationMenuList({super.key, required this.children, this.gap = HoronSpace.s1});

  /// 나열할 항목입니다.
  final List<Widget> children;

  /// 항목 사이의 간격입니다.
  final double gap;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        for (int index = 0; index < children.length; index++) ...<Widget>[
          if (index > 0) SizedBox(width: gap),
          children[index],
        ],
      ],
    );
  }
}

/// 내비게이션 메뉴 안의 한 항목입니다.
class HoronNavigationMenuItem extends StatelessWidget {
  /// 항목을 만듭니다.
  const HoronNavigationMenuItem({super.key, required this.child});

  /// 항목 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) => child;
}

/// 펼쳐진 패널 안의 링크 하나입니다.
///
/// `navigation-menu.tsx`의 `NavigationMenuLink`에 해당합니다.
class HoronNavigationMenuLink extends StatelessWidget {
  /// 링크를 만듭니다.
  const HoronNavigationMenuLink({
    super.key,
    required this.label,
    this.description,
    this.onSelected,
    this.enabled = true,
  });

  /// 링크 글자입니다.
  final String label;

  /// 링크 아래에 붙는 설명입니다.
  final String? description;

  /// 눌렀을 때 부를 함수입니다.
  final VoidCallback? onSelected;

  /// 켜져 있는지입니다.
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    final String? hint = description;

    return InkWell(
      onTap: enabled ? onSelected : null,
      borderRadius: BorderRadius.circular(HoronRadius.sm),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s3, vertical: HoronSpace.s2),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text(
              label,
              style: text.bodyMedium?.copyWith(
                color: enabled ? scheme.onSurface : scheme.onSurfaceVariant,
                fontWeight: HoronFontWeight.medium,
              ),
            ),
            if (hint != null)
              Padding(
                padding: const EdgeInsets.only(top: HoronSpace.s0_5),
                child: Text(hint, style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant)),
              ),
          ],
        ),
      ),
    );
  }
}
