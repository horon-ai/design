import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 하나를 고르는 카드입니다. `RadioGroup` 안에서 씁니다.
///
/// React `ChoiceCard`: 252px 불투명 카드에 14 여백, 16 반경, 12 간격입니다. 18px 고리는
/// 꺼져 있을 때 1.5px 회색 테두리이고, 켜지면 잉크색 고리(테두리 1.5 + 안쪽 3.5) 안에
/// 8px 점이 들어갑니다. 표면은 solid 하나이며, 선택되면 테두리가 브랜드 색으로 바뀌고
/// 꺼진 카드는 hover에서 `border-strong`이 됩니다.
class HoronChoiceCard extends StatefulWidget {
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

  /// `border-[1.5px]` — 고리의 테두리 두께입니다. 선택해도 그대로입니다.
  static const double _ringWidth = 1.5;

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
  State<HoronChoiceCard> createState() => _HoronChoiceCardState();
}

class _HoronChoiceCardState extends State<HoronChoiceCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool animate = !MediaQuery.disableAnimationsOf(context);
    final bool checked = widget.checked;
    final bool disabled = widget.disabled;

    // `text-label-md font-semibold` — 토큰의 14/20에서 굵기만 올립니다.
    final TextStyle titleStyle = theme.text.labelMd.copyWith(
      fontWeight: HoronFontWeight.semibold,
      color: colors.textPrimary,
    );
    // `text-caption text-text-secondary`.
    final TextStyle descriptionStyle = theme.text.caption.copyWith(color: colors.textSecondary);
    // `text-label-sm` — 알약의 글자.
    final TextStyle badgeStyle = theme.text.labelSm.copyWith(
      color: widget.neutralBadge ? colors.textSecondary : colors.textBrand,
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
              onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
              onExit: (PointerExitEvent event) => setState(() => _hovered = false),
              child: Semantics(
                checked: checked,
                inMutuallyExclusiveGroup: true,
                enabled: !disabled,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: disabled ? null : widget.onTap,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(theme.radius.xl2),
                    child: AnimatedContainer(
                      key: const Key('horon-choice-card-surface'),
                      duration: animate ? HoronMotion.colorsDuration : Duration.zero,
                      curve: HoronMotion.colorsCurve,
                      // React `choice-card.tsx`: `bg-bg-surface`에 1px `border-default`,
                      // 선택되면 `data-checked:border-border-brand`, 꺼진 카드는
                      // `data-unchecked:hover:border-border-strong`. 유리 레이어는 없습니다.
                      decoration: BoxDecoration(
                        color: colors.bgSurface,
                        borderRadius: BorderRadius.circular(theme.radius.xl2),
                        border: Border.all(
                          color: checked
                              ? colors.borderBrand
                              : (_hovered && !disabled ? colors.borderStrong : colors.borderDefault),
                        ),
                      ),
                      child: Padding(
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
                                  // React `group-data-checked:border-interactive-primary`와
                                  // `shadow-[inset_0_0_0_3.5px_...]`를 같은 모양으로 옮겼습니다.
                                  // 바깥 1.5 테두리 안쪽을 잉크로 채우고, 가운데 8px 점이
                                  // on-primary로 뚫려 3.5px 고리가 남습니다.
                                  color: checked ? colors.interactivePrimary : Colors.transparent,
                                  border: Border.all(
                                    width: HoronChoiceCard._ringWidth,
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
                                // `gap-1`.
                                spacing: space.s1,
                                children: <Widget>[
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    // `gap-2.5`.
                                    spacing: space.s2_5,
                                    children: <Widget>[
                                      Expanded(
                                        child: DefaultTextStyle.merge(style: titleStyle, child: widget.title),
                                      ),
                                      if (widget.badge != null)
                                        ConstrainedBox(
                                          constraints: BoxConstraints(maxWidth: badgeMaxWidth),
                                          child: Container(
                                            height: HoronChoiceCard._badgeHeight,
                                            padding: EdgeInsets.symmetric(horizontal: space.s2),
                                            alignment: Alignment.center,
                                            decoration: BoxDecoration(
                                              color: widget.neutralBadge ? colors.overlayInk6 : colors.accentSky500_18,
                                              borderRadius: BorderRadius.circular(theme.radius.full),
                                            ),
                                            child: DefaultTextStyle.merge(
                                              style: badgeStyle,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              child: widget.badge!,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                  if (widget.description != null)
                                    DefaultTextStyle.merge(style: descriptionStyle, child: widget.description!),
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
          ),
        );
      },
    );
  }
}
