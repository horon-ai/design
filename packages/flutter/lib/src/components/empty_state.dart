import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `empty-state.tsx`의 `max-w-90`입니다. 폭 상한입니다.
const double _emptyWidth = 360;

/// `empty-state.tsx`의 `size-35`입니다. 일러스트 상자입니다.
const double _illustrationSize = 140;

/// `empty-state.tsx`의 `gap-3`입니다.
const double _emptyGap = 12;

/// `empty-state.tsx`의 `mt-4` 자리입니다.
///
/// Paper 보드는 `WG8-1` 4px `Spacer`를 `gap-3` 사이에 두어 본문에서 버튼까지
/// 12 + 4 + 12 = 28을 그립니다. React 코드의 `mt-4`(16)보다 12px 더 멉니다.
const double _actionGap = 28;

/// Figma `Empty state`(64:485): 140px 일러스트, `title-md` 제목, `body-md` 설명, 동작 버튼입니다.
///
/// `empty-state.tsx`를 옮긴 것입니다. 폭은 `w-full max-w-90`이라 부모를 채우되
/// 360을 넘지 않고, 내용은 가운데 정렬이며, 등장할 때 React의 `motion-rise`(220ms)와
/// 같은 페이드·이동으로 나타납니다. `text-balance`·`text-pretty`는 Flutter의 줄바꿈
/// 엔진에 대응이 없어 [TextAlign.center] 정렬만 그대로 씁니다.
class HoronEmptyState extends StatelessWidget {
  /// 빈 상태를 만듭니다.
  const HoronEmptyState({super.key, required this.title, this.illustration, this.description, this.action});

  /// 140px 일러스트입니다. 마스코트 자세를 넣는 자리입니다.
  final Widget? illustration;

  /// 제목입니다.
  final String title;

  /// 설명입니다.
  final String? description;

  /// 글자 아래 동작입니다. 보통 `HoronButton`입니다.
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    // `w-full max-w-90` — 부모가 좁으면 그 폭을 따르고, 넓으면 360에서 멈춥니다.
    // CSS의 max-width는 tight 제약도 이기므로 LayoutBuilder로 폭을 직접 정합니다.
    final Widget content = LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite ? math.min(_emptyWidth, constraints.maxWidth) : _emptyWidth;
        return SizedBox(width: width, child: _body(theme));
      },
    );

    if (!animate) return content;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: HoronMotion.riseDuration,
      curve: HoronMotion.riseCurve,
      builder: (BuildContext context, double t, Widget? child) {
        return Opacity(
          opacity: t,
          child: Transform.translate(offset: Offset(0, HoronMotion.riseOffset * (1 - t)), child: child),
        );
      },
      child: content,
    );
  }

  Widget _body(HoronThemeData theme) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: theme.space.s6, vertical: theme.space.s8),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          if (illustration != null) ...<Widget>[
            SizedBox(
              width: _illustrationSize,
              height: _illustrationSize,
              child: Center(child: illustration),
            ),
            const SizedBox(height: _emptyGap),
          ],
          Text(
            title,
            textAlign: TextAlign.center,
            style: theme.text.titleMd.copyWith(color: theme.colors.textPrimary),
          ),
          if (description != null) ...<Widget>[
            const SizedBox(height: _emptyGap),
            // Paper `WG7-1`은 폭 312(`alignSelf: stretch`, 360 − 24×2) 상자를 씁니다.
            SizedBox(
              width: double.infinity,
              child: Text(
                description!,
                textAlign: TextAlign.center,
                style: theme.text.bodyMd.copyWith(color: theme.colors.textSecondary),
              ),
            ),
          ],
          if (action != null) ...<Widget>[const SizedBox(height: _actionGap), action!],
        ],
      ),
    );
  }
}
