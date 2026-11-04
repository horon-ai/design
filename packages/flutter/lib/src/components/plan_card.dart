import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'spinner.dart';

/// `plan-card.tsx`의 `PlanCardStatus`입니다.
enum HoronPlanCardStatus {
  /// `status="running"` — 아래에 스피너와 진행 문구가 붙습니다.
  running,

  /// `status="failed"` — 아래에 경고 아이콘과 중단 문구가 붙습니다.
  failed,
}

/// `plan-card.tsx`의 `px-6`입니다.
const double _planPaddingX = 24;

/// `plan-card.tsx`의 `pt-5`입니다.
const double _planPaddingTop = 20;

/// `plan-card.tsx`의 `gap-2`입니다.
const double _planGap = 8;

/// Figma `Plan card`(Agents N3): 20 반경의 불투명 카드에 라벨·제목·단계·상태 줄이 놓입니다.
///
/// `plan-card.tsx`를 옮긴 것입니다. [status]가 없으면 아래 상태 줄이 접히고, 있으면
/// 구분선과 함께 펼쳐집니다(React의 `Collapsible.Panel` + `motion-collapse`).
class HoronPlanCard extends StatelessWidget {
  /// 계획 카드를 만듭니다.
  const HoronPlanCard({
    super.key,
    required this.title,
    this.label,
    this.steps = const <Widget>[],
    this.status,
    this.statusLabel,
    this.elapsed,
  });

  /// 단계 목록입니다.
  final List<Widget> steps;

  /// 제목입니다.
  final String title;

  /// 제목 위 라벨입니다. 예: `Plan · 5 steps`.
  final String? label;

  /// 아래 상태입니다. 없으면 상태 줄을 그리지 않습니다.
  final HoronPlanCardStatus? status;

  /// 상태 문구입니다. 예: `Stopped · step 4 failed`.
  final String? statusLabel;

  /// 오른쪽 경과 시간입니다.
  final String? elapsed;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);
    final Color statusColor = status == HoronPlanCardStatus.failed ? theme.colors.textDanger : theme.colors.textPrimary;

    return Container(
      decoration: BoxDecoration(
        color: theme.colors.bgSurface,
        borderRadius: radius,
        border: Border.all(color: theme.colors.borderDefault),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(left: _planPaddingX, right: _planPaddingX, top: _planPaddingTop, bottom: 14),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                if (label != null) ...<Widget>[
                  Row(
                    children: <Widget>[
                      Icon(Icons.checklist, size: 16, color: theme.colors.textSecondary),
                      const SizedBox(width: _planGap),
                      Expanded(
                        child: Text(
                          label!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.bodySm.copyWith(color: theme.colors.textSecondary),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: _planGap),
                ],
                Text(
                  title,
                  // `text-label-lg font-semibold`.
                  style: theme.text.labelLg.copyWith(
                    color: theme.colors.textPrimary,
                    fontWeight: HoronFontWeight.semibold,
                  ),
                ),
              ],
            ),
          ),
          if (steps.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(left: _planPaddingX, right: _planPaddingX, top: 6, bottom: 4),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: steps,
              ),
            ),
          AnimatedSize(
            duration: HoronMotion.collapseDuration,
            curve: HoronMotion.collapseCurve,
            alignment: Alignment.topCenter,
            child: status == null
                ? const SizedBox(width: double.infinity)
                : Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      // `h-px bg-overlay-ink-8`.
                      SizedBox(height: 1, child: ColoredBox(color: theme.colors.overlayInk8)),
                      Padding(
                        padding: const EdgeInsets.only(left: _planPaddingX, right: _planPaddingX, top: 14, bottom: 16),
                        child: Row(
                          children: <Widget>[
                            if (status == HoronPlanCardStatus.running)
                              const HoronSpinner(pixelSize: 14)
                            else
                              Icon(Icons.error_outline, size: 16, color: theme.colors.textDanger),
                            const SizedBox(width: _planGap),
                            Expanded(
                              // `key={status}` + `animate-fade-in` — 상태가 바뀌면
                              // 문구가 제자리에서 160ms로 다시 나타납니다.
                              child: _FadeIn(
                                key: ValueKey<HoronPlanCardStatus>(status!),
                                child: Text(
                                  statusLabel ?? '',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: theme.text.labelMd.copyWith(color: statusColor),
                                ),
                              ),
                            ),
                            if (elapsed != null)
                              // `key`가 붙은 `animate-fade-in` — 경과 시간이 새 값으로
                              // 바뀔 때 같은 자리에서 다시 나타납니다.
                              _FadeIn(
                                key: ValueKey<String>(elapsed!),
                                child: Text(
                                  elapsed!,
                                  style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}

/// `animate-fade-in` — 제자리에서 160ms로 불투명도만 올리는 등장입니다.
///
/// React는 상태나 경과 시간마다 `key`를 바꿔 애니메이션을 다시 재생합니다. Flutter는
/// 키가 바뀌어 위젯이 새로 만들어질 때 [TweenAnimationBuilder]가 0에서 1로 올립니다.
class _FadeIn extends StatelessWidget {
  const _FadeIn({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: HoronMotion.fadeInDuration,
      curve: HoronMotion.fadeInCurve,
      builder: (BuildContext context, double value, Widget? child) => Opacity(opacity: value, child: child),
      child: child,
    );
  }
}
