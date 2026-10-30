import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `empty-state.tsx`의 `w-90`입니다.
const double _emptyWidth = 360;

/// `empty-state.tsx`의 `size-35`입니다. 일러스트 상자입니다.
const double _illustrationSize = 140;

/// `empty-state.tsx`의 `gap-3`입니다.
const double _emptyGap = 12;

/// `empty-state.tsx`의 `mt-4`입니다.
const double _actionGap = 16;

/// Figma `Empty state`(64:485): 140px 일러스트, `title-md` 제목, `body-md` 설명, 동작 버튼입니다.
///
/// `empty-state.tsx`를 옮긴 것입니다. 폭은 `w-90`(360)이고 내용은 가운데 정렬이며,
/// 등장할 때 React의 `tab-panel-in 240ms`와 같은 페이드·이동으로 나타납니다.
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

    final Widget content = SizedBox(
      width: _emptyWidth,
      child: Padding(
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
              Text(
                description!,
                textAlign: TextAlign.center,
                style: theme.text.bodyMd.copyWith(color: theme.colors.textSecondary),
              ),
            ],
            if (action != null) ...<Widget>[const SizedBox(height: _actionGap), action!],
          ],
        ),
      ),
    );

    if (!animate) return content;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: const Duration(milliseconds: 240),
      curve: HoronMotion.easeOutQuint,
      builder: (BuildContext context, double t, Widget? child) {
        return Opacity(
          opacity: t,
          child: Transform.translate(offset: Offset(0, 4 * (1 - t)), child: child),
        );
      },
      child: content,
    );
  }
}
