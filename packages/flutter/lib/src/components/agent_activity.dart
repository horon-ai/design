import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

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

/// `agent-activity.tsx`의 `REVEAL_RATE`입니다. 초당 최소 리빌 글자 수입니다.
const double _revealRate = 90;

/// `agent-activity.tsx`의 `BACKLOG_DRAIN`입니다. 남은 글자가 많을수록 빨라지는 배율입니다.
const double _backlogDrain = 3;

/// `agent-activity.tsx`의 `ml-px`입니다. 캐럿 앞 간격입니다.
const double _caretGap = 1;

/// `agent-activity.tsx`의 `h-[1.15em]`과 `align-[-0.2em]`입니다. `bodySm`(14px) 기준 값입니다.
const double _caretHeight = 16.1;
const double _caretDrop = 2.8;

/// `agent-activity.tsx`의 `codePointEnd`입니다. 서로게이트 쌍을 반으로 자르지 않습니다.
int _codePointEnd(String text, int end) {
  if (end <= 0 || end > text.length) return end;
  final int code = text.codeUnitAt(end - 1);
  return code >= 0xd800 && code <= 0xdbff ? end + 1 : end;
}

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
        decoration: BoxDecoration(
          color: theme.colors.bgSurface,
          borderRadius: BorderRadius.circular(theme.radius.full),
          border: Border.all(color: theme.colors.borderDefault),
        ),
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

/// Figma `Streaming`(108:660): `body-sm` 글자에 2x16 잉크 캐럿이 붙는 봇 말풍선입니다.
///
/// `agent-activity.tsx`의 `StreamingText`를 옮긴 것입니다. 캐럿은 마지막 글자 바로 뒤에
/// 붙어 함께 줄바꿈되고, 글자가 들어오는 동안에는 멈춰 있다가 다음 조각을 기다릴 때
/// 깜박입니다. 화면 낭독기는 완료된 답을 한 번만 읽습니다.
class HoronStreamingText extends StatefulWidget {
  /// 말풍선을 만듭니다.
  const HoronStreamingText({super.key, required this.text, this.streaming = true, this.smooth = true});

  /// 지금까지 흘러온 글자입니다.
  final String text;

  /// 아직 글자가 더 오는 중이면 참입니다. 캐럿이 보이고, 거짓이 되면 남은 글자를 모두 보여 줍니다.
  final bool streaming;

  /// 들어오는 글자를 프레임마다 몇 자씩 드러냅니다. 모션 축소면 꺼집니다.
  final bool smooth;

  @override
  State<HoronStreamingText> createState() => _HoronStreamingTextState();
}

class _HoronStreamingTextState extends State<HoronStreamingText> with TickerProviderStateMixin {
  late final AnimationController _blink = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1000),
  );
  late final Ticker _reveal;

  late String _previous = widget.text;
  late int _shown = widget.text.length;
  double _position = 0;
  Duration? _lastElapsed;
  bool _reduceMotion = false;

  @override
  void initState() {
    super.initState();
    _position = _shown.toDouble();
    _reveal = createTicker(_onRevealTick);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    if (reduce != _reduceMotion) {
      _reduceMotion = reduce;
      if (reduce) {
        _reveal.stop();
        _shown = widget.text.length;
      }
    }
    _syncBlink();
  }

  @override
  void didUpdateWidget(HoronStreamingText oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.text != widget.text || oldWidget.streaming != widget.streaming || oldWidget.smooth != widget.smooth) {
      _syncReveal();
    }
    _syncBlink();
  }

  @override
  void dispose() {
    _reveal.dispose();
    _blink.dispose();
    super.dispose();
  }

  /// 새 글자에서 보여 줄 길이를 다시 잡습니다. 이어지는 글이면 공통 접두사부터 다시 흘립니다.
  void _syncReveal() {
    final String text = widget.text;
    final String before = _previous;
    _previous = text;
    int shared = 0;
    final int limit = math.min(_shown, text.length);
    while (shared < limit && text.codeUnitAt(shared) == before.codeUnitAt(shared)) {
      shared++;
    }
    _shown = shared;
    _position = shared.toDouble();
    _lastElapsed = null;

    if (!widget.streaming || !widget.smooth || _reduceMotion) {
      _reveal.stop();
      _shown = text.length;
      return;
    }
    if (shared >= text.length) {
      _reveal.stop();
      return;
    }
    if (!_reveal.isActive) _reveal.start();
  }

  void _onRevealTick(Duration elapsed) {
    final String text = widget.text;
    final Duration? last = _lastElapsed;
    _lastElapsed = elapsed;
    if (last == null) return;
    final double seconds = math.min(0.1, (elapsed - last).inMicroseconds / 1000000);
    final double backlog = text.length - _position;
    _position = math.min(
      text.length.toDouble(),
      _position + math.max(_revealRate * seconds, backlog * _backlogDrain * seconds),
    );
    final int length = math.min(text.length, _codePointEnd(text, _position.floor()));
    if (length != _shown) {
      setState(() => _shown = length);
    }
    if (length >= text.length) _reveal.stop();
  }

  /// 스트리밍 중이 아니거나 모션을 줄이면 캐럿을 고정합니다.
  void _syncBlink() {
    if (!widget.streaming || _reduceMotion) {
      _blink.stop();
      _blink.value = 1;
      return;
    }
    if (!_blink.isAnimating) _blink.repeat();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool typing = _shown < widget.text.length;
    final Widget caret = Container(
      width: 2,
      height: _caretHeight,
      decoration: BoxDecoration(
        color: theme.colors.interactivePrimary,
        borderRadius: BorderRadius.circular(_caretRadius),
      ),
    );

    return Semantics(
      liveRegion: !widget.streaming,
      label: widget.streaming ? null : widget.text,
      child: ExcludeSemantics(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: theme.colors.bgSurface,
            borderRadius: BorderRadius.circular(theme.radius.xl),
            border: Border.all(color: theme.colors.borderDefault),
          ),
          child: Text.rich(
            TextSpan(
              children: <InlineSpan>[
                TextSpan(text: widget.text.substring(0, _shown)),
                if (widget.streaming)
                  WidgetSpan(
                    alignment: PlaceholderAlignment.baseline,
                    baseline: TextBaseline.alphabetic,
                    child: Padding(
                      padding: const EdgeInsetsDirectional.only(start: _caretGap),
                      child: Transform.translate(
                        offset: const Offset(0, _caretDrop),
                        child: typing
                            ? caret
                            : FadeTransition(
                                opacity: _blink.drive(
                                  Tween<double>(begin: 0.2, end: 1).chain(CurveTween(curve: HoronMotion.thinkingCurve)),
                                ),
                                child: caret,
                              ),
                      ),
                    ),
                  ),
              ],
            ),
            style: theme.text.bodySm.copyWith(color: theme.colors.textPrimary),
          ),
        ),
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
          decoration: BoxDecoration(
            color: theme.colors.bgSurface,
            borderRadius: BorderRadius.circular(theme.radius.md),
            border: Border.all(color: theme.colors.borderDefault),
          ),
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
      decoration: BoxDecoration(
        color: theme.colors.bgSurface,
        borderRadius: BorderRadius.circular(_workLogRadius),
        border: Border.all(color: theme.colors.borderDefault),
      ),
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
          // `motion-details` — `details`의 block-size 전환을 옮깁니다. React는 240ms
          // `ease-out-quint`로 펼치고 접으므로, 같은 길이의 [AnimatedSize]를 씁니다.
          AnimatedSize(
            duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.collapseDuration,
            curve: HoronMotion.collapseCurve,
            alignment: Alignment.topCenter,
            child: _open
                ? Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
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
                  )
                : const SizedBox(width: double.infinity),
          ),
        ],
      ),
    );
  }
}
