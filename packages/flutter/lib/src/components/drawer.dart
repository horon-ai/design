import 'package:flutter/material.dart';

import '../overlay/horon_modal.dart';
import '../tokens/horon_tokens.g.dart';

/// 드로어가 붙는 쪽입니다.
enum HoronDrawerSide {
  /// 왼쪽.
  left,

  /// 오른쪽.
  right,
}

/// 화면 옆에서 밀려 들어오는 패널입니다.
///
/// `drawer.tsx`를 옮긴 것입니다. 시트와 다른 점은 폭이 고정이고(React의 `w-3/4`,
/// 최대 320) 드래그로 닫을 수 있다는 것입니다. [HoronSheet]와 별개 컴포넌트로
/// 둡니다 - React에도 둘 다 있습니다.
class HoronDrawer extends StatelessWidget {
  /// 드로어를 만듭니다.
  const HoronDrawer({
    super.key,
    required this.trigger,
    required this.title,
    this.description,
    this.children = const <Widget>[],
    this.footer,
    this.side = HoronDrawerSide.left,
    this.dismissible = true,
    this.dragToDismiss = true,
  });

  /// 드로어를 여는 위젯입니다.
  final Widget trigger;

  /// 제목입니다.
  final String title;

  /// 설명입니다.
  final String? description;

  /// 본문입니다.
  final List<Widget> children;

  /// 바닥에 붙는 위젯입니다.
  final Widget? footer;

  /// 붙을 쪽입니다.
  final HoronDrawerSide side;

  /// 스크림을 눌렀을 때 닫을지입니다.
  final bool dismissible;

  /// 옆으로 끌어 닫을 수 있는지입니다.
  final bool dragToDismiss;

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (BuildContext context) => GestureDetector(
        onTap: () => showHoronModal<void>(
          context,
          dismissible: dismissible,
          barrierLabel: title,
          builder: (BuildContext modalContext) => _DrawerPanel(
            title: title,
            description: description,
            footer: footer,
            side: side,
            dragToDismiss: dragToDismiss,
            onClose: () => Navigator.of(modalContext).maybePop(),
            children: children,
          ),
        ),
        child: trigger,
      ),
    );
  }
}

class _DrawerPanel extends StatelessWidget {
  const _DrawerPanel({
    required this.title,
    required this.description,
    required this.children,
    required this.footer,
    required this.side,
    required this.dragToDismiss,
    required this.onClose,
  });

  final String title;
  final String? description;
  final List<Widget> children;
  final Widget? footer;
  final HoronDrawerSide side;
  final bool dragToDismiss;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final Size screen = MediaQuery.sizeOf(context);
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;

    // React의 `w-3/4`에 최대 320을 겹친 값입니다.
    final double width = (screen.width * 0.75).clamp(0, 320);

    final Widget panel = SizedBox(
      width: width,
      height: screen.height,
      child: HoronModalSurface(
        borderRadius: BorderRadius.horizontal(
          right: side == HoronDrawerSide.left ? Radius.circular(HoronRadiusRole.panel) : Radius.zero,
          left: side == HoronDrawerSide.right ? Radius.circular(HoronRadiusRole.panel) : Radius.zero,
        ),
        padding: EdgeInsets.zero,
        maxHeight: screen.height,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(HoronSpace.s4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text(
                    title,
                    style: text.titleSmall?.copyWith(color: scheme.onSurface, fontWeight: HoronFontWeight.semibold),
                  ),
                  if (description != null)
                    Padding(
                      padding: const EdgeInsets.only(top: HoronSpace.s1),
                      child: Text(description!, style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant)),
                    ),
                ],
              ),
            ),
            Divider(height: 1, color: scheme.outline),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(HoronSpace.s4),
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

    final Widget aligned = Align(
      alignment: side == HoronDrawerSide.left ? Alignment.centerLeft : Alignment.centerRight,
      child: panel,
    );

    if (!dragToDismiss) return aligned;

    // 옆으로 끌어 닫습니다. React의 드래그 핸들과 같은 역할입니다.
    return GestureDetector(
      onHorizontalDragEnd: (DragEndDetails details) {
        final double velocity = details.primaryVelocity ?? 0;
        final bool towardsEdge = side == HoronDrawerSide.left ? velocity < -300 : velocity > 300;
        if (towardsEdge) onClose();
      },
      child: aligned,
    );
  }
}
