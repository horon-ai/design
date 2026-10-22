import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `separator.tsx`의 `h-px`/`w-px`입니다. 테두리 두께는 토큰 스케일에 없어 이름을 붙입니다.
const double _separatorThickness = 1.0;

/// 라벨 양옆에 두는 여백입니다. React에는 라벨 변형이 없어 이 패키지가 더한 값입니다.
const double _separatorLabelGap = HoronSpace.s3;

/// 구획을 나누는 1px 선입니다.
///
/// `separator.tsx`를 옮긴 것입니다. 수평은 `h-px w-full`, 수직은 `w-px self-stretch`라
/// 부모가 정한 높이를 그대로 채웁니다. 색은 `bg-border`에 해당하는
/// [HoronLightColors.border]/[HoronDarkColors.border]를 밝기에 따라 고릅니다.
///
/// 라벨을 넘기면 선이 라벨 양옆으로 갈라지고 라벨이 가운데에 놓입니다. React의 Base UI
/// `Separator`에는 없는 이 패키지의 확장입니다.
///
/// 수직 변형은 부모가 높이를 정해야 합니다(`Row`를 `SizedBox(height: …)`로 감싸는 식).
/// 높이가 무한한 자리에서는 `self-stretch`가 설 자리가 없어 예외가 납니다.
///
/// ```dart
/// const HoronSeparator();
/// const HoronSeparator(label: 'or');
/// const SizedBox(height: 48, child: Row(children: <Widget>[HoronSeparator.vertical()]));
/// ```
class HoronSeparator extends StatelessWidget {
  /// 수평 구분선을 만듭니다.
  const HoronSeparator({super.key, this.label})
    : _orientation = _HoronSeparatorOrientation.horizontal,
      assert(label == null || label != '', 'A separator label cannot be empty.');

  /// 수직 구분선을 만듭니다.
  const HoronSeparator.vertical({super.key}) : _orientation = _HoronSeparatorOrientation.vertical, label = null;

  /// 방향입니다. React의 `orientation` prop에 해당하지만 cva 변형 그룹이 아니므로
  /// enum을 공개하지 않고 생성자로만 고릅니다.
  final _HoronSeparatorOrientation _orientation;

  /// 선 가운데에 넣는 글자입니다. 수평 변형에서만 씁니다.
  final String? label;

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final Color color = isDark ? HoronDarkColors.border : HoronLightColors.border;

    if (_orientation == _HoronSeparatorOrientation.vertical) {
      return SizedBox(
        width: _separatorThickness,
        height: double.infinity,
        child: ColoredBox(color: color),
      );
    }

    final Widget line = SizedBox(
      height: _separatorThickness,
      child: ColoredBox(color: color),
    );

    if (label == null) {
      return SizedBox(width: double.infinity, child: line);
    }

    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Row(
      children: <Widget>[
        Expanded(child: line),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: _separatorLabelGap),
          child: Text(
            label!,
            style: TextStyle(
              fontFamily: HoronFont.body,
              fontFamilyFallback: HoronFont.fontFamilyFallback,
              fontSize: HoronText.caption,
              fontWeight: HoronFontWeight.medium,
              height: HoronLineHeight.normal,
              color: scheme.onSurfaceVariant,
              decoration: TextDecoration.none,
            ),
          ),
        ),
        Expanded(child: line),
      ],
    );
  }
}

/// 구분선의 방향입니다. 호출자는 [HoronSeparator]와 [HoronSeparator.vertical]로 고릅니다.
enum _HoronSeparatorOrientation { horizontal, vertical }
