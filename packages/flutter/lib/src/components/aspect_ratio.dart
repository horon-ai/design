import 'package:flutter/widgets.dart';

/// 자식의 가로세로 비율을 고정하는 상자입니다.
///
/// `aspect-ratio.tsx`를 옮긴 것입니다. React는 `relative w-full overflow-hidden`에
/// `aspect-ratio` 스타일을 얹으므로 폭이 부모를 채우고 높이가 비율에서 나옵니다.
/// [AspectRatio]도 폭이 정해져 있으면 같은 규칙을 따르므로 그대로 쓰고, 넘치는 자식은
/// `overflow-hidden`에 해당하는 [ClipRect]로 자릅니다.
///
/// ```dart
/// HoronAspectRatio(ratio: 16 / 9, child: HoronCard(...));
/// ```
class HoronAspectRatio extends StatelessWidget {
  /// 비율 상자를 만듭니다.
  const HoronAspectRatio({super.key, this.ratio = 16 / 9, this.child})
    : assert(ratio > 0, 'Aspect ratio must be greater than zero.');

  /// 가로를 1로 볼 때의 세로 값입니다. React의 기본값과 같은 16/9입니다.
  final double ratio;

  /// 상자 안에 넣는 내용입니다. 상자 밖으로 넘치는 부분은 잘립니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: AspectRatio(
        aspectRatio: ratio,
        child: SizedBox(width: double.infinity, child: child),
      ),
    );
  }
}
