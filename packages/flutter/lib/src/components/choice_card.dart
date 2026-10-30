import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 하나를 고르는 카드입니다. `RadioGroup` 안에서 씁니다.
///
/// React `ChoiceCard`: 252px 유리 카드에 14 여백, 16 반경, 12 간격입니다. 18px 고리는
/// 꺼져 있을 때 1.5px 회색 테두리이고, 켜지면 잉크색 5px 고리 안에 8px 점이 들어갑니다.
class HoronChoiceCard extends StatelessWidget {
  /// 제목과 선택 값을 받습니다.
  const HoronChoiceCard({
    super.key,
    required this.title,
    this.description,
    this.badge,
    this.neutralBadge = false,
    this.checked = false,
    this.disabled = false,
    this.onTap,
  });

  /// 카드의 첫 줄 제목입니다. React `title`(`ReactNode`).
  final Widget title;

  /// 제목 아래 설명입니다. React `description`.
  final Widget? description;

  /// 제목 줄 끝의 알약입니다. 예: "Recommended". React `badge`.
  final Widget? badge;

  /// 알약을 중립 색으로 그립니다.
  ///
  /// React의 `badgeTone: "brand" | "neutral"`을 옮긴 자리입니다. React는 이 유니온을
  /// `export type`으로 선언하지 않아(속성 안의 인라인 유니온) 공개 enum이 될 수 없고,
  /// variant 게이트가 React에 없는 공개 enum을 거부합니다. 그래서 불리언으로 옮겼습니다.
  final bool neutralBadge;

  /// 선택된 상태입니다. React `data-checked`.
  final bool checked;

  /// 고를 수 없는 상태입니다. React `data-disabled`.
  final bool disabled;

  /// 카드를 눌렀을 때 호출됩니다. React `Radio.Root`의 선택.
  final VoidCallback? onTap;

  /// `w-[252px]` — 카드가 넓어지지 않는 폭입니다. 부모가 더 좁으면 그 폭을 따릅니다.
  static const double _width = 252;

  /// `size-[18px]` — 고리 상자의 한 변입니다.
  static const double _radioSize = 18;

  /// `border-[1.5px]` — 꺼진 고리의 테두리 두께입니다.
  static const double _ringOff = 1.5;

  /// `group-data-checked:border-[5px]` — 켜진 고리의 테두리 두께입니다.
  static const double _ringOn = 5;

  /// `size-2` — 켜졌을 때 보이는 점의 지름입니다.
  static const double _dotSize = 8;

  /// `mt-px` — 고리를 제목 첫 줄에 1px 맞춥니다.
  static const double _radioTopOffset = 1;

  /// `h-[22px]` — 알약의 높이입니다.
  static const double _badgeHeight = 22;

  /// 알약이 글자 칸에서 차지할 수 있는 최대 비율입니다.
  ///
  /// React는 카드 폭을 252로 고정하고 알약을 `shrink-0`으로 둡니다. 이 포트는 부모가 더
  /// 좁으면 카드도 줄어들므로, 그때 알약이 제목 칸을 밀어내 넘치지 않도록 상한을 둡니다.
  static const double _badgeMaxFraction = 0.55;

  /// `opacity-40` — 비활성 상태의 불투명도입니다.
  static const double _disabledOpacity = 0.4;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    // `text-sm/5 font-semibold` — 토큰의 14/20 medium에서 굵기만 올립니다.
    final TextStyle titleStyle = theme.text.labelMd.copyWith(
      fontWeight: HoronFontWeight.semibold,
      color: colors.textPrimary,
    );
    // `text-xs/4 text-text-secondary`.
    final TextStyle descriptionStyle = theme.text.labelSm.copyWith(
      fontWeight: HoronFontWeight.regular,
      color: colors.textSecondary,
    );
    // `text-xs/4 font-medium` — 알약의 글자.
    final TextStyle badgeStyle = theme.text.labelSm.copyWith(
      color: neutralBadge ? colors.textSecondary : colors.textBrand,
    );

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite
            ? math.min(HoronChoiceCard._width, constraints.maxWidth)
            : HoronChoiceCard._width;
        // 제목 칸이 실제로 쓰는 폭: 카드 여백·고리·간격을 뺀 나머지입니다.
        final double textColumnWidth = math.max(0, width - space.s3_5 * 2 - HoronChoiceCard._radioSize - space.s3);
        final double badgeMaxWidth = textColumnWidth * HoronChoiceCard._badgeMaxFraction;
        return SizedBox(
          width: width,
          child: Opacity(
            opacity: disabled ? HoronChoiceCard._disabledOpacity : 1,
            child: MouseRegion(
              cursor: disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
              child: Semantics(
                checked: checked,
                inMutuallyExclusiveGroup: true,
                enabled: !disabled,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: disabled ? null : onTap,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(theme.radius.xl2),
                    child: AnimatedContainer(
                      key: const Key('horon-choice-card-surface'),
                      duration: animate ? HoronMotion.colorsDuration : Duration.zero,
                      curve: HoronMotion.colorsCurve,
                      // `p-3.5 rounded-2xl border` — 켜지면 `border-border-brand`, 꺼지면
                      // Paper `1VXR-0`의 흰 70% 림(`glass-rim-frost`)입니다.
                      // 바탕은 유리 엔진이 그립니다. React는 호스트에 `bg-glass-clear`를
                      // 깔고 그 위에 `<LiquidGlass tier="clear" />`를 얹으며(`choice-card.tsx:34`),
                      // 선택되면 둘 다 thick으로 바뀝니다. Flutter는 채움까지 유리 위젯이
                      // 그리므로 컨테이너에는 테두리만 남깁니다.
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(theme.radius.xl2),
                        border: Border.all(color: checked ? colors.borderBrand : colors.glassRimFrost),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: <Widget>[
                          Positioned.fill(
                            child: HoronLiquidGlass(
                              tier: checked ? HoronGlassTier.thick : HoronGlassTier.clear,
                              borderRadius: BorderRadius.circular(theme.radius.xl2),
                              child: const SizedBox.expand(),
                            ),
                          ),
                          // 패딩은 내용에만 걸어 유리가 카드 전체를 채우게 합니다.
                          Padding(
                            padding: EdgeInsets.all(space.s3_5),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              spacing: space.s3,
                              children: <Widget>[
                                Padding(
                                  padding: const EdgeInsets.only(top: HoronChoiceCard._radioTopOffset),
                                  child: AnimatedContainer(
                                    key: const Key('horon-choice-card-ring'),
                                    duration: animate ? HoronMotion.colorsDuration : Duration.zero,
                                    curve: HoronMotion.colorsCurve,
                                    width: HoronChoiceCard._radioSize,
                                    height: HoronChoiceCard._radioSize,
                                    alignment: Alignment.center,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        width: checked ? HoronChoiceCard._ringOn : HoronChoiceCard._ringOff,
                                        color: checked ? colors.interactivePrimary : colors.borderDashed,
                                      ),
                                    ),
                                    child: AnimatedScale(
                                      scale: checked ? 1 : 0,
                                      duration: animate ? HoronMotion.popInDuration : Duration.zero,
                                      curve: HoronMotion.popInCurve,
                                      child: Container(
                                        key: const Key('horon-choice-card-dot'),
                                        width: HoronChoiceCard._dotSize,
                                        height: HoronChoiceCard._dotSize,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: colors.interactiveOnPrimary,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    // `gap-[3px]`.
                                    spacing: space.step(0.75),
                                    children: <Widget>[
                                      Row(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        // `gap-2.5`.
                                        spacing: space.s2_5,
                                        children: <Widget>[
                                          Expanded(
                                            child: DefaultTextStyle.merge(style: titleStyle, child: title),
                                          ),
                                          if (badge != null)
                                            ConstrainedBox(
                                              constraints: BoxConstraints(maxWidth: badgeMaxWidth),
                                              child: Container(
                                                height: HoronChoiceCard._badgeHeight,
                                                padding: EdgeInsets.symmetric(horizontal: space.s2),
                                                alignment: Alignment.center,
                                                decoration: BoxDecoration(
                                                  color: neutralBadge ? colors.overlayInk6 : colors.accentSky500_18,
                                                  borderRadius: BorderRadius.circular(theme.radius.full),
                                                ),
                                                child: DefaultTextStyle.merge(
                                                  style: badgeStyle,
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  child: badge!,
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                      if (description != null)
                                        DefaultTextStyle.merge(style: descriptionStyle, child: description!),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
