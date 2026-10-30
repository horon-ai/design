import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'icon_button.dart';
import 'liquid_glass.dart';

/// `page-header.tsx`의 `rounded-[28px]`입니다.
///
/// 토큰 반경 단계에 28이 없어(`radius.xl` = 20, `radius.xl2` = 16) 임의값을 그대로 씁니다.
const double _headerRadius = 28;

/// Figma `Header with filter`(Segmented filters 88:723)입니다.
///
/// 28px 반경의 regular 유리 헤더에 8px 여백을 두고, 위 줄에 뒤로 버튼·제목·동작 버튼을
/// 놓습니다. [child]는 그 아래 줄로 들어갑니다(예: 세그먼트 필터). React의 `title`은
/// 노드이지만 여기서는 한 줄 글자로 그리므로 [String]을 받습니다.
class HoronPageHeader extends StatelessWidget {
  /// 페이지 헤더를 만듭니다.
  const HoronPageHeader({
    super.key,
    required this.title,
    this.onBack,
    this.backLabel = 'Back',
    this.actions,
    this.child,
  });

  /// 제목입니다. `truncate text-label-lg`로 한 줄입니다.
  final String title;

  /// 뒤로 버튼을 눌렀을 때 부를 콜백입니다. 없으면 뒤로 버튼을 그리지 않습니다.
  final VoidCallback? onBack;

  /// 뒤로 버튼의 접근성 이름입니다.
  final String backLabel;

  /// 제목 오른쪽의 동작 버튼입니다(예: 검색).
  final Widget? actions;

  /// 위 줄 아래에 놓을 내용입니다. React의 `children`입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    // `flex flex-col gap-1.5 rounded-[28px] bg-glass-regular p-2`입니다.
    return HoronLiquidGlass(
      tier: HoronGlassTier.regular,
      borderRadius: BorderRadius.circular(_headerRadius),
      child: Padding(
        padding: EdgeInsets.all(space.s2), // p-2
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: space.s1_5, // gap-1.5
          children: <Widget>[
            SizedBox(
              height: space.step(10), // h-10 = 40
              child: Row(
                spacing: space.s2, // gap-2
                children: <Widget>[
                  if (onBack != null)
                    HoronIconButton(icon: const Icon(Icons.chevron_left), label: backLabel, onPressed: onBack),
                  Expanded(
                    child: Padding(
                      // 뒤로 버튼이 없으면 제목이 `pl-2`만큼 들여 쓰입니다.
                      padding: EdgeInsets.only(left: onBack == null ? space.s2 : 0),
                      child: Text(
                        title,
                        style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                        maxLines: 1, // truncate
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  ?actions,
                ],
              ),
            ),
            ?child,
          ],
        ),
      ),
    );
  }
}
