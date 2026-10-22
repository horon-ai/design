import 'package:flutter/material.dart';

import '../overlay/horon_modal.dart';
import '../tokens/horon_tokens.g.dart';

/// 시트가 붙는 가장자리입니다.
enum HoronSheetSide {
  /// 위.
  top,

  /// 오른쪽.
  right,

  /// 아래.
  bottom,

  /// 왼쪽.
  left,
}

/// 화면 가장자리에 붙는 시트입니다.
///
/// `sheet.tsx`를 옮긴 것입니다. 네 방향 각각에서 패널이 그 가장자리에 붙습니다.
/// 아래·위는 가로를 꽉 채우고, 왼쪽·오른쪽은 세로를 꽉 채웁니다. React의
/// `w-3/4`(왼쪽·오른쪽)를 그대로 씁니다.
class HoronSheet extends StatelessWidget {
  /// 시트를 만듭니다.
  const HoronSheet({
    super.key,
    required this.trigger,
    required this.title,
    this.description,
    this.children = const <Widget>[],
    this.footer,
    this.side = HoronSheetSide.right,
    this.showCloseButton = true,
    this.dismissible = true,
  });

  /// 시트를 여는 위젯입니다.
  final Widget trigger;

  /// 제목입니다.
  final String title;

  /// 설명입니다.
  final String? description;

  /// 본문입니다.
  final List<Widget> children;

  /// 바닥에 붙는 위젯입니다.
  final Widget? footer;

  /// 붙을 가장자리입니다.
  final HoronSheetSide side;

  /// 닫기 버튼을 그릴지입니다.
  final bool showCloseButton;

  /// 스크림을 눌렀을 때 닫을지입니다.
  final bool dismissible;

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (BuildContext context) => GestureDetector(
        onTap: () => showHoronModal<void>(
          context,
          dismissible: dismissible,
          barrierLabel: title,
          builder: (BuildContext modalContext) => _SheetPanel(
            title: title,
            description: description,
            footer: footer,
            side: side,
            showCloseButton: showCloseButton,
            onClose: () => Navigator.of(modalContext).maybePop(),
            children: children,
          ),
        ),
        child: trigger,
      ),
    );
  }
}

class _SheetPanel extends StatelessWidget {
  const _SheetPanel({
    required this.title,
    required this.description,
    required this.children,
    required this.footer,
    required this.side,
    required this.showCloseButton,
    required this.onClose,
  });

  final String title;
  final String? description;
  final List<Widget> children;
  final Widget? footer;
  final HoronSheetSide side;
  final bool showCloseButton;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final Size screen = MediaQuery.sizeOf(context);
    final bool vertical = side == HoronSheetSide.left || side == HoronSheetSide.right;

    final BorderRadius radius = switch (side) {
      HoronSheetSide.bottom => BorderRadius.vertical(top: Radius.circular(HoronRadiusRole.panel)),
      HoronSheetSide.top => BorderRadius.vertical(bottom: Radius.circular(HoronRadiusRole.panel)),
      HoronSheetSide.left => BorderRadius.horizontal(right: Radius.circular(HoronRadiusRole.panel)),
      HoronSheetSide.right => BorderRadius.horizontal(left: Radius.circular(HoronRadiusRole.panel)),
    };

    final Widget panel = HoronModalSurface(
      borderRadius: radius,
      padding: EdgeInsets.zero,
      // 세로 방향(왼쪽·오른쪽)은 화면의 3/4 폭이고, 가로 방향(위·아래)은 화면
      // 폭을 꽉 채웁니다. 높이는 반대로 합니다. React의 `w-3/4`/`inset-x-0`입니다.
      maxWidth: vertical ? screen.width * 0.75 : screen.width,
      maxHeight: vertical ? screen.height : screen.height * 0.75,
      child: SizedBox(
        // `maxWidth`만으로는 Align이 자식을 화면 폭으로 늘리지 않습니다. 실제
        // 폭을 정해 주어야 가장자리에 붙습니다(2026-10-22 캐프처에서 넘쳤습니다).
        width: vertical ? screen.width * 0.75 : screen.width,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.fromLTRB(HoronSpace.s4, HoronSpace.s4, HoronSpace.s4, HoronSpace.s2),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(
                    child: HoronSheetHeader(title: title, description: description),
                  ),
                  if (showCloseButton)
                    IconButton(
                      onPressed: onClose,
                      iconSize: 16,
                      visualDensity: VisualDensity.compact,
                      icon: const Icon(Icons.close),
                    ),
                ],
              ),
            ),
            if (children.isNotEmpty)
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s4, vertical: HoronSpace.s2),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisSize: MainAxisSize.min,
                    children: children,
                  ),
                ),
              ),
            if (footer != null) Padding(padding: const EdgeInsets.all(HoronSpace.s4), child: footer!),
          ],
        ),
      ),
    );

    // `PopupRoute`의 Stack은 자식을 화면 전체 크기로 줍니다. `Align`만으로는
    // 패널이 늘어나 화면을 넘습니다(2026-10-22 캐프처). 그래서 Stack에
    // `Positioned`로 가장자리를 고정합니다.
    final Widget positioned = switch (side) {
      HoronSheetSide.bottom => Positioned(left: 0, right: 0, bottom: 0, child: panel),
      HoronSheetSide.top => Positioned(left: 0, right: 0, top: 0, child: panel),
      HoronSheetSide.left => Positioned(left: 0, top: 0, bottom: 0, child: panel),
      HoronSheetSide.right => Positioned(right: 0, top: 0, bottom: 0, child: panel),
    };

    return Stack(children: <Widget>[positioned]);
  }
}

/// 시트의 머리말입니다.
class HoronSheetHeader extends StatelessWidget {
  /// 머리말을 만듭니다.
  const HoronSheetHeader({super.key, required this.title, this.description});

  /// 제목입니다.
  final String title;

  /// 설명입니다.
  final String? description;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    final String? hint = description;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          title,
          style: text.titleSmall?.copyWith(color: scheme.onSurface, fontWeight: HoronFontWeight.semibold),
        ),
        if (hint != null)
          Padding(
            padding: const EdgeInsets.only(top: HoronSpace.s1),
            child: Text(hint, style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant)),
          ),
      ],
    );
  }
}

/// 시트 바닥의 버튼 줄입니다.
class HoronSheetFooter extends StatelessWidget {
  /// 버튼 줄을 만듭니다.
  const HoronSheetFooter({super.key, required this.children});

  /// 버튼들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: <Widget>[
        for (int index = 0; index < children.length; index++) ...<Widget>[
          if (index > 0) const SizedBox(width: HoronSpace.s2),
          children[index],
        ],
      ],
    );
  }
}
