import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `source-row.tsx`의 `SourceStatus`입니다.
enum HoronSourceStatus {
  /// `status="ready"` — 네 단계가 모두 끝나고 체크가 붙습니다.
  ready,

  /// `status="indexing"` — 색인 중이고 퍼센트가 보입니다.
  indexing,

  /// `status="failed"` — 경고 아이콘과 재시도 버튼이 붙습니다.
  failed,
}

/// `source-row.tsx`의 `SourceStage`입니다.
enum HoronSourceStage {
  /// `done` — 35% 잉크 막대입니다.
  done,

  /// `active` — 진행률만큼 하늘색으로 채워집니다.
  active,

  /// `todo` — 8% 잉크 막대입니다.
  todo,

  /// `failed` — 붉은 막대입니다.
  failed,
}

/// `source-row.tsx`의 `size-8`입니다. 아이콘 타일입니다.
const double _tileSide = 32;

/// `source-row.tsx`의 `rounded-[14px]`입니다. card 변형의 반경입니다.
const double _cardRadius = 14;

/// `source-row.tsx`의 `h-[3px]`입니다. 단계 막대 높이입니다.
const double _barHeight = 3;

/// `source-row.tsx`의 `w-11`입니다. 단계 막대 폭입니다.
const double _barWidth = 44;

/// Figma `Source row`(Knowledge base): 네 단계(parse, chunk, embed, index) 파이프라인을 가진 평평한 행입니다.
///
/// `source-row.tsx`를 옮긴 것입니다. `card`는 14 반경의 불투명 표면에 기본 테두리를
/// 두르고 좌우 12를 들이며, `list`는 아래 1px 구분선만 있는 투명 행입니다. 실패면
/// 재시도 버튼이 나타납니다.
class HoronSourceRow extends StatelessWidget {
  /// 행을 만듭니다.
  const HoronSourceRow({
    super.key,
    required this.status,
    required this.icon,
    required this.name,
    required this.detail,
    this.progress = 0,
    this.onRetry,
    this.card = true,
    this.stages,
    this.last = false,
  });

  /// 상태입니다.
  final HoronSourceStatus status;

  /// 32px 타일에 그릴 16px 아이콘입니다.
  final Widget icon;

  /// 소스 이름입니다.
  final String name;

  /// 페이지·청크 수, 진행 상황 또는 오류입니다.
  final String detail;

  /// 색인 중일 때의 0~100 값입니다.
  final double progress;

  /// 재시도를 눌렀을 때입니다.
  final VoidCallback? onRetry;

  /// `variant="card"` 자리입니다. 거짓이면 `list`(구분선 행)입니다.
  final bool card;

  /// 네 단계 상태입니다. 넘기지 않으면 [status]에서 유도합니다.
  final List<HoronSourceStage>? stages;

  /// `list` 변형에서 마지막 행이면 구분선을 감춥니다.
  final bool last;

  List<HoronSourceStage> get _stages =>
      stages ??
      switch (status) {
        HoronSourceStatus.ready => const <HoronSourceStage>[
          HoronSourceStage.done,
          HoronSourceStage.done,
          HoronSourceStage.done,
          HoronSourceStage.done,
        ],
        HoronSourceStatus.indexing => const <HoronSourceStage>[
          HoronSourceStage.done,
          HoronSourceStage.done,
          HoronSourceStage.active,
          HoronSourceStage.todo,
        ],
        HoronSourceStatus.failed => const <HoronSourceStage>[
          HoronSourceStage.done,
          HoronSourceStage.done,
          HoronSourceStage.failed,
          HoronSourceStage.todo,
        ],
      };

  Color _barColor(HoronThemeData theme, HoronSourceStage stage) => switch (stage) {
    HoronSourceStage.done => theme.colors.overlayInk35,
    HoronSourceStage.todo => theme.colors.overlayInk8,
    HoronSourceStage.failed => theme.colors.accentRed500_90, // bg-accent-red-500-90
    HoronSourceStage.active => theme.colors.overlayInk8,
  };

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool failed = status == HoronSourceStatus.failed;

    return Container(
      // `px-2` 목록 행과 `px-3` 카드가 세로 `py-3`을 함께 씁니다.
      padding: EdgeInsets.symmetric(horizontal: card ? 12 : 8, vertical: 12),
      decoration: card
          ? BoxDecoration(
              color: theme.colors.bgSurface, // bg-bg-surface
              borderRadius: BorderRadius.circular(_cardRadius),
              border: Border.all(color: theme.colors.borderDefault), // border border-border-default
            )
          : BoxDecoration(
              border: last ? null : Border(bottom: BorderSide(color: theme.colors.overlayInk8)),
            ),
      child: Row(
        children: <Widget>[
          Container(
            width: _tileSide,
            height: _tileSide,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: theme.colors.overlayInk5,
              borderRadius: BorderRadius.circular(theme.space.step(2.5)), // rounded-[10px]
            ),
            child: IconTheme.merge(
              data: IconThemeData(size: 16, color: theme.colors.textPrimary),
              child: icon,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 2,
              children: <Widget>[
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                ),
                Row(
                  children: <Widget>[
                    if (failed) ...<Widget>[
                      Icon(Icons.error_outline, size: 12, color: theme.colors.textDanger),
                      const SizedBox(width: 4),
                    ],
                    Expanded(
                      child: Text(
                        detail,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.caption.copyWith(
                          color: failed ? theme.colors.textDanger : theme.colors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // 좁은 폭에서는 단계 막대를 감춥니다. 남은 폭이 520 미만이면 이름과
          // 설명이 먼저 자리를 지켜야 하기 때문입니다.
          if (MediaQuery.sizeOf(context).width < 520)
            const SizedBox.shrink()
          else
            Row(
              mainAxisSize: MainAxisSize.min,
              spacing: 4,
              children: <Widget>[
                for (final HoronSourceStage stage in _stages)
                  SizedBox(
                    width: _barWidth,
                    height: _barHeight,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(theme.radius.full),
                      child: stage == HoronSourceStage.active
                          ? Stack(
                              children: <Widget>[
                                Positioned.fill(child: ColoredBox(color: _barColor(theme, stage))),
                                Align(
                                  alignment: AlignmentDirectional.centerStart,
                                  child: TweenAnimationBuilder<double>(
                                    tween: Tween<double>(begin: progress / 100, end: progress / 100),
                                    duration: HoronMotion.colorsDuration,
                                    curve: HoronMotion.easeOutQuint,
                                    builder: (BuildContext context, double t, Widget? child) => FractionallySizedBox(
                                      widthFactor: t.clamp(0.0, 1.0),
                                      heightFactor: 1,
                                      child: child,
                                    ),
                                    // bg-status-live — 진행 채움도 라이브 색입니다.
                                    child: ColoredBox(color: theme.colors.statusLive),
                                  ),
                                ),
                              ],
                            )
                          : ColoredBox(color: _barColor(theme, stage)),
                    ),
                  ),
              ],
            ),
          SizedBox(
            width: 72,
            height: 30,
            child: Align(
              alignment: Alignment.centerRight,
              child: switch (status) {
                HoronSourceStatus.ready => Icon(Icons.check, size: 16, color: theme.colors.textSecondary),
                // `w-9 text-right tabular-nums` — 퍼센트는 36px 상자에서 오른쪽 정렬이고
                // 자릿수가 같아 값이 바뀌어도 폭이 흔들리지 않습니다. 값이 바뀔 때마다
                // `animate-fade-in`으로 새로 나타납니다.
                HoronSourceStatus.indexing => SizedBox(
                  width: theme.space.step(9),
                  child: AnimatedSwitcher(
                    duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.fadeInDuration,
                    switchInCurve: HoronMotion.fadeInCurve,
                    child: Text(
                      '${progress.round()}%',
                      key: ValueKey<int>(progress.round()),
                      textAlign: TextAlign.right,
                      maxLines: 1,
                      style: theme.text.labelMd.copyWith(
                        color: theme.colors.textSecondary,
                        fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
                      ),
                    ),
                  ),
                ),
                HoronSourceStatus.failed => _RetryPill(onPressed: onRetry),
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// 실패 상태의 30px 재시도 알약입니다. hover에서 잉크가 6%에서 10%로 짙어집니다.
class _RetryPill extends StatefulWidget {
  const _RetryPill({this.onPressed});

  final VoidCallback? onPressed;

  @override
  State<_RetryPill> createState() => _RetryPillState();
}

class _RetryPillState extends State<_RetryPill> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Semantics(
      button: true,
      enabled: widget.onPressed != null,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
        onExit: (PointerExitEvent event) => setState(() => _hovered = false),
        child: GestureDetector(
          onTap: widget.onPressed,
          child: Container(
            height: theme.space.step(7.5), // h-7.5 = 30
            padding: EdgeInsets.symmetric(horizontal: theme.space.s3), // px-3
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: _hovered ? theme.colors.overlayInk10 : theme.colors.overlayInk6, // hover:bg-overlay-ink-10
              borderRadius: BorderRadius.circular(theme.radius.full),
            ),
            child: Text('Retry', style: theme.text.labelSm.copyWith(color: theme.colors.textPrimary)),
          ),
        ),
      ),
    );
  }
}
