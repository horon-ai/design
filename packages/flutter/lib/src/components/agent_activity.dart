import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import 'spinner.dart';

/// `agent-activity.tsx`의 `ToolStepState`입니다.
enum HoronToolStepState {
  /// `state="running"` — 16px 스피너가 돕니다.
  running,

  /// `state="done"` — 체크 아이콘이 붙습니다.
  done,

  /// `state="failed"` — 경고 아이콘과 위험 글자입니다.
  failed,
}

/// `agent-activity.tsx`의 `size-[7px]`입니다. 생각 중 점의 지름입니다.
const double _thinkingDot = 7;

/// `agent-activity.tsx`의 `h-7.75`입니다. 생각 중 알약의 높이입니다.
const double _thinkingHeight = 31;

/// `agent-activity.tsx`의 `w-17.25`입니다.
const double _thinkingWidth = 69;

/// `agent-activity.tsx`의 `rounded-[1px]`입니다. 스트리밍 캐럿의 반경입니다.
const double _caretRadius = 1;

/// `agent-activity.tsx`의 `p-1.5`입니다. 작업 기록 카드의 안쪽 여백입니다.
const double _workLogPadding = 6;

/// `agent-activity.tsx`의 `rounded-[16px]`입니다. 작업 기록 카드의 반경입니다.
const double _workLogRadius = 16;

/// `agent-activity.tsx`의 `w-85`입니다. 작업 기록 카드 폭입니다.
const double _workLogWidth = 340;

/// Figma `Thinking`(Agent activity 108:660): 7px 점 세 개가 차례로 밝아지는 알약입니다.
class HoronThinkingIndicator extends StatefulWidget {
  /// 알약을 만듭니다.
  const HoronThinkingIndicator({super.key, this.label = 'Thinking'});

  /// 접근성 이름입니다.
  final String label;

  @override
  State<HoronThinkingIndicator> createState() => _HoronThinkingIndicatorState();
}

class _HoronThinkingIndicatorState extends State<HoronThinkingIndicator> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(vsync: this, duration: HoronMotion.thinkingDuration);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.stop();
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final List<Color> dots = <Color>[theme.colors.overlayInk35, theme.colors.overlayInk55, theme.colors.overlayInk80];

    return Semantics(
      label: widget.label,
      liveRegion: true,
      child: Container(
        width: _thinkingWidth,
        height: _thinkingHeight,
        alignment: Alignment.center,
        decoration: BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(theme.radius.full)),
        child: AnimatedBuilder(
          animation: _controller,
          builder: (BuildContext context, Widget? child) {
            return Row(
              mainAxisAlignment: MainAxisAlignment.center,
              spacing: 8,
              children: <Widget>[
                for (int index = 0; index < dots.length; index++)
                  Opacity(
                    opacity: 0.35 + 0.65 * (0.5 + 0.5 * _wave(index)),
                    child: Container(
                      width: _thinkingDot,
                      height: _thinkingDot,
                      decoration: BoxDecoration(color: dots[index], shape: BoxShape.circle),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }

  double _wave(int index) {
    final double phase = (_controller.value - index * 0.15) % 1.0;
    return phase < 0.5 ? phase * 2 : (1 - phase) * 2;
  }
}

/// Figma `Streaming`(108:660): `body-sm` 글자에 2x16 잉크 캐럿이 깜박이는 봇 말풍선입니다.
class HoronStreamingText extends StatefulWidget {
  /// 말풍선을 만듭니다.
  const HoronStreamingText({super.key, required this.text});

  /// 지금까지 흘러온 글자입니다.
  final String text;

  @override
  State<HoronStreamingText> createState() => _HoronStreamingTextState();
}

class _HoronStreamingTextState extends State<HoronStreamingText> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1000),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.stop();
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(theme.radius.xl)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        spacing: 8,
        children: <Widget>[
          Flexible(
            child: Text(widget.text, style: theme.text.bodySm.copyWith(color: theme.colors.textPrimary)),
          ),
          FadeTransition(
            opacity: _controller.drive(
              Tween<double>(begin: 0.2, end: 1).chain(CurveTween(curve: HoronMotion.thinkingCurve)),
            ),
            child: Container(
              width: 2,
              height: 16,
              decoration: BoxDecoration(
                color: theme.colors.interactivePrimary,
                borderRadius: BorderRadius.circular(_caretRadius),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Figma `Tool step`(108:660): 12 반경의 평평한 행에 상태 아이콘, 제목·설명, 캐럿이 놓입니다.
class HoronToolStep extends StatelessWidget {
  /// 단계를 만듭니다.
  const HoronToolStep({
    super.key,
    required this.title,
    this.state = HoronToolStepState.running,
    this.detail,
    this.onTap,
  });

  /// 제목입니다.
  final String title;

  /// 상태입니다.
  final HoronToolStepState state;

  /// 설명입니다.
  final String? detail;

  /// 누르는 동작입니다.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool failed = state == HoronToolStepState.failed;

    return Semantics(
      button: true,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(theme.radius.md)),
          child: Row(
            children: <Widget>[
              switch (state) {
                HoronToolStepState.running => const HoronSpinner(pixelSize: 16),
                HoronToolStepState.done => Icon(Icons.check_circle, size: 16, color: theme.colors.textSecondary),
                HoronToolStepState.failed => Icon(Icons.error, size: 16, color: theme.colors.textDanger),
              },
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.text.labelMd.copyWith(
                        color: failed ? theme.colors.textDanger : theme.colors.textPrimary,
                      ),
                    ),
                    if (detail != null)
                      Text(
                        detail!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Icon(Icons.chevron_right, size: 14, color: theme.colors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}

/// 작업 기록의 한 단계입니다.
class HoronWorkLogStep {
  /// 단계를 만듭니다.
  const HoronWorkLogStep({required this.title, this.detail, this.running = false});

  /// 제목입니다.
  final String title;

  /// 설명입니다.
  final String? detail;

  /// 실행 중이면 작은 스피너를 씁니다.
  final bool running;
}

/// Figma `Work log`(108:660): 렌치 요약 줄과 접히는 단계 목록을 담은 평평한 카드입니다.
class HoronWorkLog extends StatefulWidget {
  /// 기록을 만듭니다.
  const HoronWorkLog({super.key, required this.summary, required this.steps, this.initiallyOpen = true});

  /// 요약 문구입니다.
  final String summary;

  /// 단계 목록입니다.
  final List<HoronWorkLogStep> steps;

  /// 처음 열림 상태입니다.
  final bool initiallyOpen;

  @override
  State<HoronWorkLog> createState() => _HoronWorkLogState();
}

class _HoronWorkLogState extends State<HoronWorkLog> {
  late bool _open = widget.initiallyOpen;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      width: _workLogWidth,
      padding: const EdgeInsets.all(_workLogPadding),
      decoration: BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(_workLogRadius)),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Semantics(
            button: true,
            expanded: _open,
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => setState(() => _open = !_open),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                child: Row(
                  children: <Widget>[
                    Icon(Icons.build_outlined, size: 14, color: theme.colors.textSecondary),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        widget.summary,
                        style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                      ),
                    ),
                    AnimatedRotation(
                      turns: _open ? 0 : -0.25,
                      duration: HoronMotion.popupEnterDuration,
                      curve: HoronMotion.easeOutQuint,
                      child: Icon(Icons.expand_more, size: 14, color: theme.colors.textSecondary),
                    ),
                  ],
                ),
              ),
            ),
          ),
          if (_open)
            for (final HoronWorkLogStep step in widget.steps)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                child: Row(
                  children: <Widget>[
                    if (step.running)
                      const HoronSpinner(pixelSize: 14)
                    else
                      Icon(Icons.check_circle, size: 14, color: theme.colors.textSecondary),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            step.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: theme.text.labelSm.copyWith(color: theme.colors.textPrimary),
                          ),
                          if (step.detail != null)
                            Text(
                              step.detail!,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
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
