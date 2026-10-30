import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'spinner.dart';

/// `agent-lane.tsx`의 `AgentLaneStatus`입니다.
enum HoronAgentLaneStatus {
  /// `status="running"` — 스피너와 하늘색 타일입니다.
  running,

  /// `status="done"` — 체크 아이콘과 진한 하늘색 타일입니다.
  done,

  /// `status="failed"` — 위험 테두리와 경고 아이콘입니다.
  failed,
}

/// `agent-lane.tsx`의 `rounded-[16px]`입니다.
const double _laneRadius = 16;

/// `agent-lane.tsx`의 `px-3.5`입니다.
const double _lanePaddingX = 14;

/// `agent-lane.tsx`의 `py-3`입니다.
const double _lanePaddingY = 12;

/// `agent-lane.tsx`의 `rounded-[5px]`입니다. 봇 타일의 반경입니다.
const double _botTileRadius = 5;

/// `agent-lane.tsx`의 `size-4.5`입니다. 봇 타일입니다.
const double _botTile = 18;

/// Figma `Agent lane`(Agent orchestrator 113:953): 팬아웃에서 하위 에이전트 한 장을 나타내는 평평한 카드입니다.
///
/// `agent-lane.tsx`를 옮긴 것입니다. 상태가 실패면 위험 테두리가 붙고, 실행 중이면
/// 타일이 하늘색으로 맥동하며 12px 스피너가 돕니다. 출력은 실패에서 위험색입니다.
class HoronAgentLane extends StatelessWidget {
  /// 레인을 만듭니다.
  const HoronAgentLane({
    super.key,
    required this.status,
    required this.initial,
    required this.name,
    required this.task,
    this.elapsed,
    this.tool,
    this.output,
    this.usage,
  });

  /// 상태입니다.
  final HoronAgentLaneStatus status;

  /// 봇 이니셜입니다.
  final String initial;

  /// 봇 이름입니다.
  final String name;

  /// 맡은 일입니다.
  final String task;

  /// 경과 시간입니다.
  final String? elapsed;

  /// 도구 이름입니다. 예: `Notion · Q3 metrics`.
  final String? tool;

  /// 최근 출력 또는 실패 사유입니다.
  final String? output;

  /// 사용량 캡션입니다. 예: `2.6k tokens`.
  final String? usage;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool failed = status == HoronAgentLaneStatus.failed;
    final Color tile = switch (status) {
      HoronAgentLaneStatus.running => HoronPalette.sky400,
      HoronAgentLaneStatus.done => HoronPalette.sky600,
      HoronAgentLaneStatus.failed => HoronPalette.sky800,
    };

    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      padding: const EdgeInsets.symmetric(horizontal: _lanePaddingX, vertical: _lanePaddingY),
      decoration: BoxDecoration(
        color: theme.colors.bgSubtle,
        borderRadius: BorderRadius.circular(_laneRadius),
        border: failed ? Border.all(color: theme.colors.borderDanger) : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 6,
        children: <Widget>[
          Row(
            children: <Widget>[
              Container(
                width: _botTile,
                height: _botTile,
                alignment: Alignment.center,
                decoration: BoxDecoration(color: tile, borderRadius: BorderRadius.circular(_botTileRadius)),
                child: Text(initial, style: theme.text.labelSm.copyWith(color: theme.colors.textInverse)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                ),
              ),
              if (status == HoronAgentLaneStatus.running) const HoronSpinner(pixelSize: 12),
              if (status == HoronAgentLaneStatus.done)
                Icon(Icons.check_circle, size: 14, color: theme.colors.textSecondary),
              if (failed) Icon(Icons.error, size: 14, color: theme.colors.textDanger),
              if (elapsed != null) ...<Widget>[
                const SizedBox(width: 6),
                Text(elapsed!, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
              ],
            ],
          ),
          Text(task, style: theme.text.labelLg.copyWith(color: theme.colors.textPrimary)),
          if (tool != null)
            Row(
              children: <Widget>[
                Icon(Icons.build_outlined, size: 14, color: theme.colors.textSecondary),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    tool!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                  ),
                ),
              ],
            ),
          if (output != null)
            Text(
              output!,
              style: theme.text.bodySm.copyWith(color: failed ? theme.colors.textDanger : theme.colors.textPrimary),
            ),
          if (usage != null) Text(usage!, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
        ],
      ),
    );
  }
}
