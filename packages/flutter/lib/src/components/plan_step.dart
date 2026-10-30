import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import 'spinner.dart';

/// `plan-step.tsx`의 `PlanStepStatus`입니다.
enum HoronPlanStepStatus {
  /// `status="done"` — 하늘색 표식에 체크가 있습니다.
  done,

  /// `status="running"` — 스피너가 돕니다.
  running,

  /// `status="failed"` — 위험 표식에 느낌표가 있습니다.
  failed,

  /// `status="pending"` — 헤어라인 표식에 단계 번호가 있습니다.
  pending,
}

/// `plan-step.tsx`의 `size-6`입니다. 표식 상자입니다.
const double _markerSide = 24;

/// `plan-step.tsx`의 `gap-3.5`입니다.
const double _railGap = 14;

/// `plan-step.tsx`의 `w-0.5`입니다. 레일 두께입니다.
const double _railWidth = 2;

/// `plan-step.tsx`의 `pb-4.5`입니다. 본문 아래 여백입니다.
const double _bodyPaddingBottom = 18;

/// `plan-step.tsx`의 `rounded-[1px]`입니다. 레일 끝의 반경입니다.
const double _railRadius = 1;

/// 재시도 버튼의 `rounded-[10px]`입니다.
const double _retryRadius = 10;

/// Figma `Plan step`(Agent plan 191:8296): 2px 레일 위 24px 표식으로 단계를 잇습니다.
///
/// `plan-step.tsx`를 옮긴 것입니다. 완료는 하늘색(`status-live`) 표식과 레일,
/// 실행 중은 스피너, 실패는 위험 표식과 재시도 버튼, 대기는 번호 표식입니다.
/// [last]이면 아래 레일을 그리지 않습니다.
class HoronPlanStep extends StatelessWidget {
  /// 단계를 만듭니다.
  const HoronPlanStep({
    super.key,
    required this.status,
    required this.index,
    required this.title,
    this.description,
    this.tool,
    this.elapsed,
    this.error,
    this.onRetry,
    this.last = false,
  });

  /// 단계 상태입니다.
  final HoronPlanStepStatus status;

  /// 단계 번호입니다. 대기 상태의 표식에 그려집니다.
  final int index;

  /// 단계 제목입니다.
  final String title;

  /// 설명입니다.
  final String? description;

  /// 도구 식별자입니다. 모노 글꼴로 알약에 놓입니다.
  final String? tool;

  /// 경과 시간입니다.
  final String? elapsed;

  /// 실패 사유입니다.
  final String? error;

  /// 재시도를 눌렀을 때입니다. 실패 상태에서만 보입니다.
  final VoidCallback? onRetry;

  /// 마지막 단계입니다. 아래 레일을 감춥니다.
  final bool last;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool done = status == HoronPlanStepStatus.done;
    final bool failed = status == HoronPlanStepStatus.failed;
    final bool pending = status == HoronPlanStepStatus.pending;

    final Widget marker = Container(
      width: _markerSide,
      height: _markerSide,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: done
            ? theme.colors.statusLive
            : failed
            ? theme.colors.bgDanger
            : Colors.transparent,
        borderRadius: BorderRadius.circular(theme.radius.md),
        border: pending ? Border.all(color: theme.colors.borderDefault) : null,
      ),
      child: switch (status) {
        HoronPlanStepStatus.done => Icon(Icons.check, size: 14, color: theme.colors.interactiveOnPrimary),
        HoronPlanStepStatus.running => const HoronSpinner(pixelSize: 20),
        HoronPlanStepStatus.failed => Text('!', style: theme.text.labelSm.copyWith(color: theme.colors.textDanger)),
        HoronPlanStepStatus.pending => Text(
          '$index',
          style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
        ),
      },
    );

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Column(
          children: <Widget>[
            marker,
            if (!last) ...<Widget>[
              const SizedBox(height: 4),
              Container(
                width: _railWidth,
                height: _bodyPaddingBottom + 4,
                decoration: BoxDecoration(
                  color: done ? theme.colors.statusLive : theme.colors.borderDefault,
                  borderRadius: BorderRadius.circular(_railRadius),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(width: _railGap),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 2, bottom: _bodyPaddingBottom),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 6,
              children: <Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        title,
                        style: theme.text.labelLg.copyWith(
                          color: pending ? theme.colors.textSecondary : theme.colors.textPrimary,
                        ),
                      ),
                    ),
                    if (elapsed != null && (done || status == HoronPlanStepStatus.running))
                      Text(elapsed!, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
                  ],
                ),
                if (description != null || tool != null)
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: <Widget>[
                      if (description != null)
                        Text(description!, style: theme.text.bodySm.copyWith(color: theme.colors.textSecondary)),
                      if (tool != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: theme.colors.bgSubtle,
                            borderRadius: BorderRadius.circular(theme.radius.xs),
                          ),
                          child: Text(
                            tool!,
                            style: theme.text.labelMd.copyWith(
                              fontFamily: theme.text.code.fontFamily,
                              color: theme.colors.textSecondary,
                            ),
                          ),
                        ),
                    ],
                  ),
                if (failed && error != null)
                  Text(error!, style: theme.text.bodySm.copyWith(color: theme.colors.textDanger)),
                if (failed && onRetry != null)
                  Align(
                    alignment: Alignment.centerLeft,
                    child: TextButton.icon(
                      onPressed: onRetry,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        foregroundColor: theme.colors.textPrimary,
                        backgroundColor: theme.colors.bgSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(_retryRadius),
                          side: BorderSide(color: theme.colors.borderDefault),
                        ),
                      ),
                      icon: const Icon(Icons.refresh, size: 14),
                      label: Text('Retry from here', style: theme.text.labelMd),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
