import 'package:flutter/material.dart';

/// `button-group.tsx`의 `orientation` 옵션입니다.
///
/// React의 cva 키(`horizontal`, `vertical`)를 그대로 씁니다.
enum HoronButtonGroupOrientation { horizontal, vertical }

/// 그룹이 자기 자식에게 자기 위치를 알리는 스코프입니다.
///
/// 소비자는 직접 쓰지 않습니다. [HoronButtonGroup]이 자식마다 하나씩 설치하고,
/// `HoronButton`이 이것을 읽어 바깥 모서리만 둥글게 그립니다. 이음매의 테두리도
/// 같은 정보로 한 줄만 남깁니다.
class HoronButtonGroupScope extends InheritedWidget {
  /// 스코프 하나를 만듭니다.
  const HoronButtonGroupScope({
    super.key,
    required this.index,
    required this.count,
    required this.orientation,
    required super.child,
  });

  /// 그룹 안에서 이 자식의 순서입니다.
  final int index;

  /// 그룹의 자식 수입니다.
  final int count;

  /// 그룹이 늘어선 방향입니다.
  final HoronButtonGroupOrientation orientation;

  /// 첫 번째 자식인가.
  bool get isFirst => index == 0;

  /// 마지막 자식인가.
  bool get isLast => index == count - 1;

  @override
  bool updateShouldNotify(HoronButtonGroupScope oldWidget) =>
      index != oldWidget.index || count != oldWidget.count || orientation != oldWidget.orientation;
}

/// 인접한 버튼을 하나의 표면으로 묶습니다.
///
/// React `button-group.tsx`의 `flex w-fit items-stretch`와 `[&>*:not(:first-child)]:rounded-l-none`,
/// `[&>*:not(:first-child)]:border-l-0`을 옮긴 것입니다. 자식 버튼은 바깥 모서리만
/// 둥글게 그리고, 이음매에는 앞 버튼의 오른쪽 테두리 한 줄만 남습니다. 그래서 두 버튼
/// 사이에 선이 겹쳐 2px이 되지 않습니다.
///
/// 자식은 [HoronButton]을 기대합니다. 다른 위젯도 받지만 그 위젯은 스코프를 읽지 않으므로
/// 자기 반경을 스스로 정합니다.
class HoronButtonGroup extends StatelessWidget {
  /// 그룹 하나를 만듭니다.
  const HoronButtonGroup({
    super.key,
    required this.children,
    this.orientation = HoronButtonGroupOrientation.horizontal,
  });

  /// 그룹에 넣을 버튼입니다.
  final List<Widget> children;

  /// 늘어선 방향입니다.
  final HoronButtonGroupOrientation orientation;

  @override
  Widget build(BuildContext context) {
    final bool horizontal = orientation == HoronButtonGroupOrientation.horizontal;
    // React의 `flex w-fit items-stretch`입니다. 가로에서는 버튼이 자기 높이(`h-[37px]`)를
    // 이미 갖고 있어 stretch가 할 일이 없으므로 가운데 정렬로 같은 결과가 납니다.
    // 세로에서는 `flex-col` + stretch가 모든 버튼을 가장 넓은 버튼의 폭으로 늘리므로,
    // IntrinsicWidth로 같은 폭을 만들고 자식을 그 폭에 채웁니다. 그렇게 하지 않으면
    // 글자가 짧은 버튼만 좁아져 계단 모양이 됩니다.
    final Widget group = Flex(
      direction: horizontal ? Axis.horizontal : Axis.vertical,
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: horizontal ? CrossAxisAlignment.center : CrossAxisAlignment.stretch,
      children: <Widget>[
        for (int index = 0; index < children.length; index++)
          HoronButtonGroupScope(index: index, count: children.length, orientation: orientation, child: children[index]),
      ],
    );

    // React의 `flex w-fit`은 한 줄짜리 합성입니다. 버튼은 `whitespace-nowrap`이라
    // 글자를 줄이지 않고, 묶인 자식끼리 이음매를 맞춰야 해서 줄을 바꾸면 표면이
    // 끊깁니다. 그래서 폭이 모자라면 버튼을 짜그러뜨리지 않고 가로로 흔려 보냅니다.
    // 스크롤 뷰는 자식이 들어가면 자식 폭을 그대로 보고하므로 넓은 자리에서는 지금과
    // 같은 크기로 서고, 모자랄 때만 흔려 보냅니다. 이 저장소의 data-table·pagination이
    // 한 줄짜리 합성을 다루는 방식과 같습니다.
    final Widget sized = horizontal
        ? SingleChildScrollView(scrollDirection: Axis.horizontal, child: group)
        : IntrinsicWidth(child: group);

    return Semantics(container: true, child: sized);
  }
}
