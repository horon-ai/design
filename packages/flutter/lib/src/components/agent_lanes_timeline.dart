import 'dart:math' as math;
import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'spinner.dart';

/// `agent-lanes-timeline.tsx`의 `LaneTaskTone`입니다.
enum HoronLaneTaskTone {
  /// `tone="done"` — 6% 잉크 막대에 보조 글자입니다.
  done,

  /// `tone="running"` — 20% 하늘색 막대에 기본 글자, 스피너가 돕니다.
  running,

  /// `tone="failed"` — 14% 빨강 막대에 위험 글자입니다.
  failed,

  /// `tone="waiting"` — 표면 막대에 기본 글자와 기본색 테두리입니다.
  waiting,
}

/// `agent-lanes-timeline.tsx`의 `LaneBotTone`입니다.
enum HoronLaneBotTone {
  /// `tone="sky"` — 하늘색 아바타입니다.
  sky,

  /// `tone="steel"` — 진한 하늘색 아바타입니다.
  steel,

  /// `tone="neutral"` — 회색 아바타입니다.
  neutral,

  /// `tone="ink"` — 잉크 아바타에 반대색 글자입니다.
  ink,
}

/// `ROW` — 레인 한 줄의 높이 64입니다.
const double _rowHeight = 64;

/// `TOP` — 눈금 아래 첫 레인이 시작하는 위쪽 40입니다.
const double _rowsTop = 40;

/// `LABEL_WIDTH` — 데스크톱에서 레인 이름이 쓰는 폭 230입니다.
const double _labelWidth = 230;

/// `RIGHT_GUTTER` — 현재선 뒤에 남기는 오른쪽 여백 18입니다.
const double _rightGutter = 18;

/// `h-76` — 타임라인 본문의 최소 높이 304입니다.
const double _timelineHeight = 304;

/// `h-67` — 눈금선과 현재선의 높이 268입니다.
const double _trackHeight = 268;

/// `top-9` — 눈금선과 현재선이 시작하는 위쪽 36입니다.
const double _trackTop = 36;

/// `top-2.5` — 눈금 라벨과 "now" 알약의 위쪽 10입니다.
const double _labelTop = 10;

/// `size-8.5` — 봇 아바타 34입니다.
const double _avatarSize = 34;

/// `rounded-[10px]` — 아바타와 작업 막대의 반경 10입니다.
const double _tileRadius = 10;

/// `rounded-[24px]` — 패널 반경 24입니다. 토큰 단계에 같은 값이 없습니다.
const double _panelRadius = 24;

/// `max-w-252.5` — 패널이 더 넓어지지 않는 폭 1010입니다.
const double _panelMaxWidth = 1010;

/// `h-9` — 작업 막대의 높이 36입니다.
const double _barHeight = 36;

/// 작업 막대가 줄 위에서 내려오는 거리 14입니다(`top` = 줄 위 + 14).
const double _barTop = 14;

/// `size-4.5` — 머리의 스파클 18입니다.
const double _headerIconSize = 18;

/// `[&>svg]:size-3.5` — 작업 막대 앞 아이콘 14입니다.
const double _barIconSize = 14;

/// `size-3.5` — 승인 줄의 경고 아이콘 14입니다.
const double _warningIconSize = 14;

/// `size-3` — 범위 알약의 캐럿 12입니다.
const double _caretIconSize = 12;

/// `h-7` — 범위 알약의 높이 28입니다.
const double _rangePillHeight = 28;

/// `h-7.5` — 승인 줄 버튼의 높이 30입니다.
const double _approvalButtonHeight = 30;

/// `size-1.75` — 상태 점 7입니다.
const double _statusDotSize = 7;

/// `w-[1.5px]` — 현재선의 두께 1.5입니다.
const double _cursorWidth = 1.5;

/// `w-px` — 눈금선의 두께 1입니다.
const double _tickWidth = 1;

/// `py-px` — "now" 알약의 세로 여백 1입니다.
const double _pillPaddingY = 1;

/// `py-0.5` — 작업 막대 배지의 세로 여백 2입니다.
const double _badgePaddingY = 2;

/// 작업 막대가 글자를 담을 수 있는 최소 폭 26입니다.
///
/// 이보다 좁은 막대는 React에서도 `overflow-clip`으로 내용이 잘리므로, Flutter는
/// 색과 반경만 그려 넘침 오류를 만들지 않습니다.
const double _barMinContentWidth = 26;

/// 앞 아이콘을 함께 담으려면 필요한 폭 46입니다(`px-2.5` 20 + 아이콘 14 + `gap-1.5` 6 + 글자 6).
const double _barIconMinWidth = 46;

/// 눈금 라벨 사이의 최소 간격 44입니다. 좁으면 라벨을 감추고 선만 남깁니다.
const double _minTickLabelGap = 44;

/// `agent-lanes-timeline.tsx`의 `LaneTask`입니다.
///
/// 시간은 창 끝에서 거꾸로 센 분입니다. 28분 전에 시작해 16분 전에 끝난 작업은
/// [start] `-28`, [end] `-16`입니다.
class HoronLaneTask {
  /// 작업을 만듭니다.
  const HoronLaneTask({
    required this.id,
    required this.label,
    required this.tone,
    required this.start,
    required this.end,
    this.icon,
    this.badge,
  });

  /// 인계 곡선이 가리키는 이름입니다.
  final String id;

  /// 막대 안의 글자입니다.
  final String label;

  /// 막대의 색과 글자색입니다.
  final HoronLaneTaskTone tone;

  /// 창 끝에서 시작까지의 분입니다. 음수입니다.
  final double start;

  /// 창 끝에서 끝까지의 분입니다. 음수입니다.
  final double end;

  /// 막대 앞의 14px 아이콘입니다.
  final Widget? icon;

  /// 막대 안쪽 알약의 글자입니다. 예: `Needs you`.
  final String? badge;
}

/// `agent-lanes-timeline.tsx`의 `LaneBot`입니다.
class HoronLaneBot {
  /// 봇을 만듭니다.
  const HoronLaneBot({
    required this.id,
    required this.name,
    required this.initial,
    required this.tone,
    required this.tasks,
    this.tools,
    this.badge,
    this.badgeInk = false,
  });

  /// 봇의 식별자입니다.
  final String id;

  /// 봇의 이름입니다.
  final String name;

  /// 아바타에 넣는 한 글자입니다.
  final String initial;

  /// 아바타의 색입니다.
  final HoronLaneBotTone tone;

  /// 이름 아래 도구 설명입니다. 예: `Notion · Slack`.
  final String? tools;

  /// 이름 옆의 작은 태그입니다. 예: `Idle`, `Needs you`.
  final String? badge;

  /// `badgeTone="ink"` 자리입니다. React는 이 값을 인라인 유니온으로 선언해
  /// 어휘 게이트가 읽지 않으므로 불리언으로 옮겼습니다.
  final bool badgeInk;

  /// 이 봇이 시간축 위에서 맡은 작업입니다.
  final List<HoronLaneTask> tasks;
}

/// `agent-lanes-timeline.tsx`의 `LaneStatus`입니다.
class HoronLaneStatus {
  /// 상태를 만듭니다.
  const HoronLaneStatus({required this.id, required this.label, this.live = true});

  /// 식별자입니다.
  final String id;

  /// 점 옆의 글자입니다.
  final String label;

  /// `tone="live"`면 라이브 점 색을, `tone="ink"`면 잉크 색을 씁니다.
  ///
  /// React는 `tone: "live" | "ink"`를 인라인 유니온으로 선언해 어휘 게이트가 읽지
  /// 않으므로 불리언으로 옮겼습니다.
  final bool live;
}

/// `agent-lanes-timeline.tsx`의 `LaneHandoff`입니다.
class HoronLaneHandoff {
  /// 인계를 만듭니다. 두 작업 id가 모두 있어야 곡선이 그려집니다.
  const HoronLaneHandoff({required this.from, required this.to});

  /// 넘겨주는 작업의 id입니다.
  final String from;

  /// 넘겨받는 작업의 id입니다.
  final String to;
}

/// `agent-lanes-timeline.tsx`의 `AgentLanesTimelineApproval`입니다.
class HoronAgentLanesTimelineApproval {
  /// 승인 줄을 만듭니다.
  const HoronAgentLanesTimelineApproval({
    required this.message,
    this.laterLabel = 'Later',
    this.approveLabel = 'Approve',
    this.onLater,
    this.onApprove,
  });

  /// 승인 줄의 문구입니다.
  final String message;

  /// `Later` 버튼의 글자입니다.
  final String laterLabel;

  /// `Approve` 버튼의 글자입니다.
  final String approveLabel;

  /// `Later`를 눌렀을 때입니다.
  final VoidCallback? onLater;

  /// `Approve`를 눌렀을 때입니다.
  final VoidCallback? onApprove;
}

/// Figma `Agent lanes`(YCO-1): 봇마다 한 줄인 공유 시간축 패널입니다.
///
/// `agent-lanes-timeline.tsx`를 옮긴 것입니다. 봇마다 64px 줄을 두고, 40px 아래에서
/// 시작해 창 끝까지의 분을 가로 위치로 씁니다. 5분마다 눈금과 세로선이 서고, 현재선은
/// 280ms emphasized로 새 값까지 미끄러집니다. 줄은 hover에서 3% 잉크로 물들고, 실행 중
/// 막대에는 12px 스피너가 붙습니다.
///
/// React는 본문을 `overflow-x-auto`로 감싸 최소 폭 1000을 유지합니다. 이 포트는
/// 가로 스크롤을 두지 않고, 폭이 `md`(768)보다 좁으면 이름 열을 폭의 42%까지 줄이고
/// 눈금 라벨을 감춰 같은 시간축을 좁은 화면에 맞춥니다.
class HoronAgentLanesTimeline extends StatelessWidget {
  /// 타임라인을 만듭니다.
  const HoronAgentLanesTimeline({
    super.key,
    this.title = 'Bots',
    this.statuses = const <HoronLaneStatus>[],
    this.range = 'Last 30m',
    required this.bots,
    this.handoffs = const <HoronLaneHandoff>[],
    this.windowMinutes = 30,
    this.cursor = 0,
    this.approval,
    this.onRangeTap,
  });

  /// 머리의 제목입니다.
  final String title;

  /// 제목 옆의 상태 점과 글자입니다.
  final List<HoronLaneStatus> statuses;

  /// 오른쪽 끝 범위 알약의 글자입니다.
  final String range;

  /// 시간축 위의 레인입니다.
  final List<HoronLaneBot> bots;

  /// 봇 사이의 인계 곡선입니다.
  final List<HoronLaneHandoff> handoffs;

  /// 창의 길이(분)입니다. 눈금은 5분마다 섭니다.
  final int windowMinutes;

  /// 창 끝에서 현재선까지의 분입니다. 새 값까지 280ms로 미끄러집니다.
  final double cursor;

  /// 아래에 붙는 승인 줄입니다.
  final HoronAgentLanesTimelineApproval? approval;

  /// 범위 알약을 눌렀을 때입니다. React는 처리기 없는 `button`을 그리므로, 포트는
  /// 알약을 쓸 수 있도록 이 콜백을 열어 둡니다.
  final VoidCallback? onRangeTap;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final BorderRadius radius = BorderRadius.circular(_panelRadius);

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: _panelMaxWidth),
      child: ClipRRect(
        borderRadius: radius,
        child: DecoratedBox(
          decoration: BoxDecoration(
            // `bg-bg-surface`.
            color: colors.bgSurface,
            borderRadius: radius,
            // `border border-border-default`.
            border: Border.all(color: colors.borderDefault),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              _buildHeader(context, theme),
              // `h-px bg-overlay-ink-8`.
              ColoredBox(color: colors.overlayInk8, child: const SizedBox(height: 1)),
              _buildTrack(context, theme),
              if (approval case final HoronAgentLanesTimelineApproval strip) ...<Widget>[
                ColoredBox(color: colors.overlayInk8, child: const SizedBox(height: 1)),
                _buildApproval(context, theme, strip),
              ],
            ],
          ),
        ),
      ),
    );
  }

  /// 머리 줄입니다.
  ///
  /// React는 제목·상태·범위를 한 줄에 두고 상태가 많으면 넘칩니다. 포트는 상태를
  /// [Wrap]에 두어 좁은 화면에서 다음 줄로 내립니다.
  Widget _buildHeader(BuildContext context, HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // `pt-4 pr-4.5 pb-3.5 pl-4.5`.
      padding: EdgeInsets.only(top: space.s4, right: space.step(4.5), bottom: space.s3_5, left: space.step(4.5)),
      child: Row(
        children: <Widget>[
          // `Sparkle size-4.5 text-text-primary`.
          Icon(Icons.auto_awesome, size: _headerIconSize, color: colors.textPrimary),
          SizedBox(width: space.s2_5),
          Expanded(
            child: Wrap(
              spacing: space.s2_5,
              runSpacing: space.s1_5,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                // `h3 text-label-lg text-text-primary`.
                Text(
                  title,
                  style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                for (final HoronLaneStatus status in statuses) _StatusLabel(status: status),
              ],
            ),
          ),
          SizedBox(width: space.s2_5),
          _RangePill(label: range, onTap: onRangeTap),
        ],
      ),
    );
  }

  /// 시간축 본문입니다.
  Widget _buildTrack(BuildContext context, HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.hasBoundedWidth ? constraints.maxWidth : _panelMaxWidth;
        // React의 고정 230px 이름 열은 좁은 화면에서 시간축을 삼키므로 폭에 맞춰 줄입니다.
        final double labelWidth = width >= theme.breakpoints.md ? _labelWidth : math.min(_labelWidth, width * 0.42);
        final double track = math.max(0, width - labelWidth - _rightGutter);
        final double span = windowMinutes > 0 ? windowMinutes.toDouble() : 1;
        final double height = math.max(_timelineHeight, _rowsTop + bots.length * _rowHeight);

        double xAt(double fraction) => labelWidth + track * fraction;
        double at(double minutes) => (span + minutes) / span;

        final double tickStep = track * 5 / span;
        final bool showTickLabels = tickStep >= _minTickLabelGap;
        final List<double> tickMinutes = <double>[
          for (int i = 0; i < 400 && 5 * (i + 1) < span; i++) -(span - 5 * (i + 1)),
        ];

        final Map<String, ({HoronLaneTask task, int lane})> taskAt = <String, ({HoronLaneTask task, int lane})>{
          for (int lane = 0; lane < bots.length; lane++)
            for (final HoronLaneTask task in bots[lane].tasks) task.id: (task: task, lane: lane),
        };

        final List<Widget> handoffCurves = <Widget>[];
        for (final HoronLaneHandoff handoff in handoffs) {
          final ({HoronLaneTask task, int lane})? from = taskAt[handoff.from];
          final ({HoronLaneTask task, int lane})? to = taskAt[handoff.to];
          if (from == null || to == null) continue;
          final double x1 = xAt(at(from.task.end));
          final double x2 = xAt(at(to.task.start));
          final double y1 = _rowsTop + from.lane * _rowHeight + _rowHeight / 2;
          final double y2 = _rowsTop + to.lane * _rowHeight + _rowHeight / 2;
          handoffCurves.add(
            Positioned(
              left: math.min(x1, x2),
              top: math.min(y1, y2),
              width: math.max(0, (x2 - x1).abs()),
              height: math.max(0, (y2 - y1).abs()),
              child: CustomPaint(
                painter: _HandoffPainter(color: colors.statusLive, downwards: y1 <= y2),
                child: const SizedBox.expand(),
              ),
            ),
          );
        }

        final List<Widget> bars = <Widget>[];
        for (int lane = 0; lane < bots.length; lane++) {
          for (final HoronLaneTask task in bots[lane].tasks) {
            final double barWidth = math.max(0, track * (task.end - task.start) / span);
            bars.add(
              Positioned(
                left: xAt(at(task.start)),
                top: _rowsTop + lane * _rowHeight + _barTop,
                width: barWidth,
                height: _barHeight,
                child: _TaskBar(task: task, width: barWidth),
              ),
            );
          }
        }

        final double nowX = xAt(at(-cursor));
        final Duration glide = reduceMotion ? Duration.zero : HoronMotion.indicatorDuration;

        return SizedBox(
          height: height,
          child: Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              // `top-9 h-67 w-px bg-overlay-ink-5` 눈금선과 `text-caption` 눈금 라벨.
              for (final double minutes in tickMinutes) ...<Widget>[
                Positioned(
                  left: xAt(at(minutes)),
                  top: _trackTop,
                  width: _tickWidth,
                  height: _trackHeight,
                  child: ColoredBox(color: colors.overlayInk5),
                ),
                if (showTickLabels)
                  Positioned(
                    left: xAt(at(minutes)),
                    top: _labelTop,
                    child: FractionalTranslation(
                      translation: const Offset(-0.5, 0),
                      child: Text(
                        '${minutes.toInt()}m',
                        style: theme.text.caption.copyWith(color: colors.textSecondary),
                        maxLines: 1,
                        softWrap: false,
                      ),
                    ),
                  ),
              ],
              for (int lane = 0; lane < bots.length; lane++)
                Positioned(
                  left: 0,
                  right: 0,
                  top: _rowsTop + lane * _rowHeight,
                  height: _rowHeight,
                  child: _LaneRow(bot: bots[lane], labelWidth: labelWidth, showDivider: lane < bots.length - 1),
                ),
              ...handoffCurves,
              ...bars,
              // `top-2.5 -translate-x-full` — 창 끝을 가리키는 "now" 알약.
              AnimatedPositioned(
                duration: glide,
                curve: HoronMotion.indicatorCurve,
                left: nowX,
                top: _labelTop,
                child: FractionalTranslation(translation: const Offset(-1, 0), child: const _NowPill()),
              ),
              // `top-9 h-67 w-[1.5px] bg-status-live/60` — 280ms로 미끄러지는 현재선.
              AnimatedPositioned(
                duration: glide,
                curve: HoronMotion.indicatorCurve,
                left: nowX,
                top: _trackTop,
                width: _cursorWidth,
                height: _trackHeight,
                child: ColoredBox(color: colors.accentSky500_60),
              ),
            ],
          ),
        );
      },
    );
  }

  /// 승인 줄입니다.
  Widget _buildApproval(BuildContext context, HoronThemeData theme, HoronAgentLanesTimelineApproval strip) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // `px-4.5 py-3`.
      padding: EdgeInsets.symmetric(horizontal: space.step(4.5), vertical: space.s3),
      child: Row(
        children: <Widget>[
          // `Warning size-3.5 text-text-primary`.
          Icon(Icons.warning_amber_rounded, size: _warningIconSize, color: colors.textPrimary),
          SizedBox(width: space.s3),
          Expanded(
            child: Text(
              strip.message,
              // `text-body-sm text-text-primary`.
              style: theme.text.bodySm.copyWith(color: colors.textPrimary),
            ),
          ),
          SizedBox(width: space.s3),
          _PressPill(
            label: strip.laterLabel,
            height: _approvalButtonHeight,
            background: colors.overlayInk6,
            pressedBackground: colors.overlayInk10,
            foreground: colors.textPrimary,
            onPressed: strip.onLater,
          ),
          SizedBox(width: space.s3),
          _PressPill(
            label: strip.approveLabel,
            height: _approvalButtonHeight,
            background: colors.interactivePrimary,
            pressedBackground: colors.interactivePrimaryPressed,
            foreground: colors.textInverse,
            onPressed: strip.onApprove,
          ),
        ],
      ),
    );
  }
}

/// `flex items-center gap-1.5 text-body-sm text-text-secondary` 상태 라벨입니다.
class _StatusLabel extends StatelessWidget {
  const _StatusLabel({required this.status});

  final HoronLaneStatus status;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Container(
          // `size-1.75 rounded-full` — live면 라이브 점, ink면 잉크 점.
          width: _statusDotSize,
          height: _statusDotSize,
          decoration: BoxDecoration(
            color: status.live ? colors.statusLive : colors.interactivePrimary,
            shape: BoxShape.circle,
          ),
        ),
        SizedBox(width: theme.space.s1_5),
        Text(
          status.label,
          style: theme.text.bodySm.copyWith(color: colors.textSecondary),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}

/// `h-7 rounded-full bg-overlay-ink-6 px-2.5 text-label-sm` 범위 알약입니다.
class _RangePill extends StatefulWidget {
  const _RangePill({required this.label, this.onTap});

  final String label;
  final VoidCallback? onTap;

  @override
  State<_RangePill> createState() => _RangePillState();
}

class _RangePillState extends State<_RangePill> {
  bool _pressed = false;
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: widget.onTap != null,
      child: MouseRegion(
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          onTapDown: (_) => setState(() => _pressed = true),
          onTapCancel: () => setState(() => _pressed = false),
          onTapUp: (_) => setState(() => _pressed = false),
          onTap: widget.onTap,
          child: AnimatedScale(
            // `motion-press` — 누르는 동안 0.97.
            scale: _pressed ? HoronMotion.pressScale : 1,
            duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
            curve: HoronMotion.pressCurve,
            child: AnimatedContainer(
              height: _rangePillHeight,
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              padding: EdgeInsets.symmetric(horizontal: space.s2_5),
              decoration: BoxDecoration(
                // `bg-overlay-ink-6`, `hover:bg-overlay-ink-10`.
                color: _pressed || _hovered ? colors.overlayInk10 : colors.overlayInk6,
                borderRadius: BorderRadius.circular(theme.radius.full),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text(
                    widget.label,
                    style: theme.text.labelSm.copyWith(color: colors.textPrimary),
                    maxLines: 1,
                    softWrap: false,
                  ),
                  SizedBox(width: space.s1),
                  Icon(Icons.keyboard_arrow_down, size: _caretIconSize, color: colors.textSecondary),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `absolute inset-x-0 flex h-16 items-center gap-3 pl-4.5` 레인 한 줄입니다.
class _LaneRow extends StatefulWidget {
  const _LaneRow({required this.bot, required this.labelWidth, required this.showDivider});

  final HoronLaneBot bot;
  final double labelWidth;
  final bool showDivider;

  @override
  State<_LaneRow> createState() => _LaneRowState();
}

class _LaneRowState extends State<_LaneRow> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    final (Color avatar, Color avatarText) = switch (widget.bot.tone) {
      HoronLaneBotTone.sky => (HoronPalette.sky500, colors.textOnInk),
      HoronLaneBotTone.steel => (HoronPalette.sky700, colors.textOnInk),
      HoronLaneBotTone.neutral => (HoronPalette.neutral500, colors.textOnInk),
      HoronLaneBotTone.ink => (colors.interactivePrimary, colors.textInverse),
    };

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        // `motion-colors hover:bg-overlay-ink-3`.
        duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
        curve: HoronMotion.colorsCurve,
        padding: EdgeInsets.only(left: space.step(4.5)),
        decoration: BoxDecoration(
          color: _hovered ? colors.overlayInk3 : Colors.transparent,
          // `border-b border-overlay-ink-6` — 마지막 줄에는 없습니다.
          border: widget.showDivider ? Border(bottom: BorderSide(color: colors.overlayInk6)) : null,
        ),
        child: Align(
          alignment: Alignment.centerLeft,
          child: SizedBox(
            width: math.max(0, widget.labelWidth - space.step(4.5)),
            child: _Rise(
              child: Row(
                children: <Widget>[
                  Container(
                    // `size-8.5 rounded-[10px] text-label-md text-text-on-ink`.
                    width: _avatarSize,
                    height: _avatarSize,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(color: avatar, borderRadius: BorderRadius.circular(_tileRadius)),
                    child: Text(widget.bot.initial, style: theme.text.labelMd.copyWith(color: avatarText)),
                  ),
                  SizedBox(width: space.s3),
                  Expanded(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            Flexible(
                              child: Text(
                                widget.bot.name,
                                style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (widget.bot.badge case final String badge) ...<Widget>[
                              SizedBox(width: space.s1_5),
                              _BotBadge(label: badge, ink: widget.bot.badgeInk),
                            ],
                          ],
                        ),
                        if (widget.bot.tools case final String tools)
                          Text(
                            tools,
                            style: theme.text.caption.copyWith(color: colors.textSecondary),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
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
    );
  }
}

/// `rounded-md px-1.5 py-px text-label-sm` 봇 태그입니다.
class _BotBadge extends StatelessWidget {
  const _BotBadge({required this.label, required this.ink});

  final String label;
  final bool ink;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      padding: EdgeInsets.symmetric(horizontal: space.s1_5, vertical: _pillPaddingY),
      decoration: BoxDecoration(
        // `badgeTone="ink"`이면 잉크 채움에 반대색 글자, 아니면 6% 잉크에 보조 글자.
        color: ink ? colors.interactivePrimary : colors.overlayInk6,
        borderRadius: BorderRadius.circular(theme.radius.md),
      ),
      child: Text(
        label,
        style: theme.text.labelSm.copyWith(color: ink ? colors.textInverse : colors.textSecondary),
        maxLines: 1,
        softWrap: false,
      ),
    );
  }
}

/// `absolute h-9 gap-1.5 rounded-[10px] px-2.5 text-label-sm` 작업 막대입니다.
class _TaskBar extends StatelessWidget {
  const _TaskBar({required this.task, required this.width});

  final HoronLaneTask task;
  final double width;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(_tileRadius);

    final (Color background, Color foreground, Color? border) = switch (task.tone) {
      // `bg-overlay-ink-6 text-text-secondary`.
      HoronLaneTaskTone.done => (colors.overlayInk6, colors.textSecondary, null),
      // `bg-status-live/20 text-text-primary`.
      HoronLaneTaskTone.running => (colors.accentSky500_20, colors.textPrimary, null),
      // `bg-red-500/14 text-text-danger`.
      HoronLaneTaskTone.failed => (colors.accentRed500_14, colors.textDanger, null),
      // `border border-interactive-primary bg-bg-surface-90 text-text-primary`.
      HoronLaneTaskTone.waiting => (colors.bgSurface90, colors.textPrimary, colors.interactivePrimary),
    };

    final BoxDecoration decoration = BoxDecoration(
      color: background,
      borderRadius: radius,
      border: border == null ? null : Border.all(color: border),
    );

    if (width < _barMinContentWidth) {
      // 내용이 들어가지 않는 폭에서는 React처럼 글자를 자르고 색만 남깁니다.
      return DecoratedBox(decoration: decoration);
    }

    final bool showIcon = task.icon != null && width >= _barIconMinWidth;

    return ClipRRect(
      borderRadius: radius,
      child: DecoratedBox(
        decoration: decoration,
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: space.s2_5),
          child: Row(
            spacing: space.s1_5,
            children: <Widget>[
              if (showIcon)
                IconTheme.merge(
                  data: IconThemeData(size: _barIconSize, color: foreground),
                  child: task.icon!,
                ),
              Expanded(
                child: Text(
                  task.label,
                  style: theme.text.labelSm.copyWith(color: foreground),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (task.badge != null || task.tone == HoronLaneTaskTone.running)
                // React는 `overflow-clip`으로 배지와 스피너를 자릅니다. Flutter는
                // 남은 폭만큼만 보이게 잘라 같은 그림을 만들고 넘침 오류를 없갑니다.
                Flexible(
                  child: ClipRect(
                    child: OverflowBox(
                      alignment: Alignment.centerLeft,
                      minWidth: 0,
                      maxWidth: double.infinity,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        spacing: space.s1_5,
                        children: <Widget>[
                          if (task.badge case final String badge) _BarBadge(label: badge),
                          if (task.tone == HoronLaneTaskTone.running)
                            const HoronSpinner(pixelSize: 12, label: 'Running'),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// `rounded-full bg-interactive-primary py-0.5 pr-2 pl-1.5 text-label-sm` 막대 배지입니다.
class _BarBadge extends StatelessWidget {
  const _BarBadge({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      padding: EdgeInsets.only(top: _badgePaddingY, right: space.s2, bottom: _badgePaddingY, left: space.s1_5),
      decoration: BoxDecoration(
        color: colors.interactivePrimary,
        borderRadius: BorderRadius.circular(theme.radius.full),
      ),
      child: Text(label, style: theme.text.labelSm.copyWith(color: colors.textInverse), maxLines: 1, softWrap: false),
    );
  }
}

/// `rounded-md bg-status-live/20 px-1.5 py-px text-caption` "now" 알약입니다.
class _NowPill extends StatelessWidget {
  const _NowPill();

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return DecoratedBox(
      decoration: BoxDecoration(color: colors.accentSky500_20, borderRadius: BorderRadius.circular(theme.radius.md)),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: space.s1_5, vertical: _pillPaddingY),
        child: Text(
          'now',
          style: theme.text.caption.copyWith(color: colors.textSecondary),
          maxLines: 1,
          softWrap: false,
        ),
      ),
    );
  }
}

/// `motion-press`가 붙은 알약 버튼입니다.
class _PressPill extends StatefulWidget {
  const _PressPill({
    required this.label,
    required this.height,
    required this.background,
    required this.pressedBackground,
    required this.foreground,
    this.onPressed,
  });

  final String label;
  final double height;
  final Color background;
  final Color pressedBackground;
  final Color foreground;
  final VoidCallback? onPressed;

  @override
  State<_PressPill> createState() => _PressPillState();
}

class _PressPillState extends State<_PressPill> {
  bool _pressed = false;
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      enabled: widget.onPressed != null,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          onTapDown: (_) => setState(() => _pressed = true),
          onTapCancel: () => setState(() => _pressed = false),
          onTapUp: (_) => setState(() => _pressed = false),
          onTap: widget.onPressed,
          child: AnimatedScale(
            // `motion-press` — 누르는 동안 0.97.
            scale: _pressed ? HoronMotion.pressScale : 1,
            duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
            curve: HoronMotion.pressCurve,
            child: AnimatedContainer(
              height: widget.height,
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              // `px-3`.
              padding: EdgeInsets.symmetric(horizontal: space.s3),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                // `hover:`·눌림 상태 — 터치에서도 도달할 수 있게 눌림에 같은 색을 씁니다.
                color: _pressed || _hovered ? widget.pressedBackground : widget.background,
                borderRadius: BorderRadius.circular(theme.radius.full),
              ),
              child: Text(
                widget.label,
                style: theme.text.labelSm.copyWith(color: widget.foreground),
                maxLines: 1,
                softWrap: false,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `motion-rise` — 220ms 동안 4px 아래에서 올라오며 나타납니다.
class _Rise extends StatelessWidget {
  const _Rise({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: HoronMotion.riseDuration,
      curve: HoronMotion.riseCurve,
      builder: (BuildContext context, double t, Widget? child) => Opacity(
        opacity: t,
        child: Transform.translate(offset: Offset(0, (1 - t) * HoronMotion.riseOffset), child: child),
      ),
      child: child,
    );
  }
}

/// `strokeDasharray="3 3" stroke-status-live strokeWidth="1.5"` 인계 곡선입니다.
///
/// React는 viewBox `0 0 100 100`의 `M0 0 C60 0 40 100 100 100`을 상자에 늘려
/// 그립니다. 포트는 상자 크기에 맞춘 같은 3차 베지에를 점선으로 긋습니다.
class _HandoffPainter extends CustomPainter {
  const _HandoffPainter({required this.color, required this.downwards});

  final Color color;

  /// 아래 줄로 내려가는 곡선이면 참입니다. 위로 올라가면 상하를 뒤집습니다.
  final bool downwards;

  @override
  void paint(Canvas canvas, Size size) {
    final double y0 = downwards ? 0 : size.height;
    final double y1 = downwards ? size.height : 0;
    final Path path = Path()
      ..moveTo(0, y0)
      ..cubicTo(size.width * 0.6, y0, size.width * 0.4, y1, size.width, y1);

    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..color = color;

    const double dash = 3;
    const double gap = 3;
    for (final PathMetric metric in path.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double next = math.min(distance + dash, metric.length);
        canvas.drawPath(metric.extractPath(distance, next), paint);
        distance = next + gap;
      }
    }
  }

  @override
  bool shouldRepaint(_HandoffPainter oldDelegate) => oldDelegate.color != color || oldDelegate.downwards != downwards;
}
