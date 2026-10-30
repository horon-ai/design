import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'spinner.dart';

/// `orchestrator-panel.tsx`의 `rounded-[24px]`입니다. 토큰 반경 단계에 24가 없습니다.
const double _panelRadius = 24;

/// `rounded-[5px]` — 리드 타일의 반경입니다.
const double _leadTileRadius = 5;

/// `rounded-[16px]` — 요약 상자의 반경입니다. 토큰의 `xl2`와 같은 16입니다.
const double _summaryRadius = 16;

/// `size-5.5` — 리드 타일 한 변 22입니다.
const double _leadTileSize = 22;

/// `p-[3px]` — 병렬 선택 트랙의 안쪽 여백입니다.
const double _trackInset = 3;

/// `h-7 w-7.5` — 병렬 선택 칸의 높이 28과 폭 30입니다.
const double _pickerHeight = 28;

/// `h-7 w-7.5`의 폭입니다.
const double _pickerWidth = 30;

/// 칸 사이 `gap-0.5`(2)를 더한 이동 거리입니다. React는 `translate: index * 32px`입니다.
const double _pickerStep = _pickerWidth + 2;

/// `h-7.5` — Stop 단추의 높이 30입니다.
const double _stopHeight = 30;

/// `size-3.5` — Stop 아이콘 14입니다.
const double _stopIconSize = 14;

/// `size-1.5` — 계획 항목의 점 6입니다.
const double _planDotSize = 6;

/// `pl-7.5` — 계획과 레인을 들여 쓰는 30입니다.
const double _laneIndent = 30;

/// `h-5.5` — 레인 팔꿈치의 높이 22입니다.
const double _elbowHeight = 22;

/// `rounded-bl-lg` — 팔꿈치 모서리의 반경 14입니다.
const double _elbowRadius = 14;

/// `border-[1.5px]` — 레인 연결선의 두께입니다.
const double _connectorWidth = 1.5;

/// `-bottom-2.5` — 마지막이 아닌 레인의 세로선이 아래로 더 내려가는 10입니다.
const double _connectorTail = 10;

/// `h-px` — 구분선 두께입니다.
const double _hairline = 1;

/// `motion-rise`의 항목마다 늘어나는 지연입니다(`animationDelay: index * 30ms`).
const int _staggerMs = 30;

/// `outline-2` — 포커스 테두리 두께입니다.
const double _focusWidth = 2;

/// `orchestrator-panel.tsx`의 `OrchestratorLead`입니다.
///
/// 오케스트레이터를 이끄는 리드 한 명입니다.
class HoronOrchestratorLead {
  /// 리드를 만듭니다.
  const HoronOrchestratorLead({
    required this.initial,
    required this.name,
    this.role,
    this.status,
    this.running = false,
    this.elapsed,
  });

  /// 22px 잉크 타일에 들어가는 한 글자입니다.
  final String initial;

  /// 이름입니다.
  final String name;

  /// 이름 옆의 역할 설명입니다. 없으면 `Lead`입니다.
  final String? role;

  /// 상태 문구입니다(예: `1 working`).
  final String? status;

  /// 레인을 기다리는 동안 13px 진행 표시를 보여 줍니다.
  final bool running;

  /// 걸린 시간입니다.
  final String? elapsed;
}

/// `orchestrator-panel.tsx`의 `OrchestratorPlanItem`입니다.
///
/// 리드가 세운 계획 한 줄입니다.
class HoronOrchestratorPlanItem {
  /// 계획 한 줄을 만듭니다.
  const HoronOrchestratorPlanItem({required this.label, this.dotColor, this.running = false});

  /// 계획 문구입니다.
  final String label;

  /// 이 단계를 맡은 레인의 점 색입니다. 없으면 [HoronColors.statusLive]입니다.
  ///
  /// React는 Tailwind 클래스 이름(`dotClassName`, 예: `bg-sky-600`)을 받지만,
  /// Flutter 판은 토큰 색을 직접 받습니다.
  final Color? dotColor;

  /// 레인이 일하는 동안 점이 맥동합니다.
  final bool running;
}

/// `orchestrator-panel.tsx`의 `OrchestratorSummary`입니다.
///
/// 레인 아래의 요약 상자입니다.
class HoronOrchestratorSummary {
  /// 요약을 만듭니다.
  const HoronOrchestratorSummary({this.title, this.count, required this.body});

  /// 왼쪽 제목입니다. 없으면 `Summary`입니다.
  final String? title;

  /// 오른쪽 정렬 개수입니다(예: `1 of 3 returned`).
  final String? count;

  /// 본문입니다.
  final String body;
}

/// Figma `Orchestrator`(Agents N1) 패널입니다.
///
/// `orchestrator-panel.tsx`를 옮긴 것입니다. 24px 반경 표면 위에 병렬 선택과 Stop이
/// 있는 머리, 리드 줄, 리드의 계획, 갈라지는 레인([children]), 요약이 차례로 놓입니다.
///
/// 레인마다 왼쪽에서 팔꿈치가 갈라지고, 마지막 레인을 뺀 나머지는 세로선으로 이어집니다.
/// React는 테두리 두 겹으로 그리지만 Flutter 판은 [CustomPainter]로 같은 모양을 긋습니다.
class HoronOrchestratorPanel extends StatefulWidget {
  /// 오케스트레이터 패널을 만듭니다.
  const HoronOrchestratorPanel({
    super.key,
    required this.title,
    this.parallelLabel = 'Bots in parallel',
    this.parallelOptions,
    this.parallelValue,
    this.onParallelChange,
    this.stopLabel = 'Stop',
    this.onStop,
    required this.lead,
    this.plan,
    this.children = const <Widget>[],
    this.summary,
  });

  /// 패널 제목입니다.
  final String title;

  /// 병렬 선택 앞의 문구입니다.
  final String parallelLabel;

  /// 병렬 선택의 후보 값입니다. 없으면 선택기를 그리지 않습니다.
  final List<int>? parallelOptions;

  /// 지금 고른 값입니다.
  final int? parallelValue;

  /// 선택이 바뀔 때 호출됩니다. React `onParallelChange`입니다.
  final ValueChanged<int>? onParallelChange;

  /// Stop 단추의 문구입니다.
  final String stopLabel;

  /// Stop 단추를 눌렀을 때 호출됩니다. 없으면 단추를 그리지 않습니다.
  final VoidCallback? onStop;

  /// 리드 줄입니다.
  final HoronOrchestratorLead lead;

  /// 리드의 계획입니다.
  final List<HoronOrchestratorPlanItem>? plan;

  /// 레인 카드입니다. 보통 [HoronAgentLane]입니다.
  final List<Widget> children;

  /// 레인 아래 요약입니다.
  final HoronOrchestratorSummary? summary;

  @override
  State<HoronOrchestratorPanel> createState() => _HoronOrchestratorPanelState();
}

class _HoronOrchestratorPanelState extends State<HoronOrchestratorPanel> {
  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: colors.bgSurface, // bg-bg-surface
        borderRadius: BorderRadius.circular(_panelRadius), // rounded-[24px]
        border: Border.all(color: colors.borderDefault), // border-border-default
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Padding(
            // px-5 pt-4.5 pb-4
            padding: EdgeInsets.fromLTRB(space.s5, space.step(4.5), space.s5, space.s4),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: space.s3, // gap-3
              children: <Widget>[
                Text(widget.title, style: theme.text.labelLg.copyWith(color: colors.textPrimary)),
                LayoutBuilder(
                  builder: (BuildContext context, BoxConstraints constraints) {
                    // 좁은 폭에서는 중지 버튼을 다음 줄로 내립니다. 280px 아래에서
                    // 라벨·선택기·버튼을 한 줄에 두면 8px씩 넘칩니다.
                    final bool narrow = constraints.maxWidth < 320;
                    final Widget label = Flexible(
                      child: Text(
                        widget.parallelLabel,
                        style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                        maxLines: 1,
                        softWrap: false,
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                    final Widget? picker = widget.parallelOptions != null && widget.parallelOptions!.isNotEmpty
                        ? _ParallelPicker(
                            options: widget.parallelOptions!,
                            value: widget.parallelValue,
                            label: widget.parallelLabel,
                            onChanged: widget.onParallelChange,
                          )
                        : null;
                    final Widget? stop = widget.onStop != null
                        ? _StopButton(label: widget.stopLabel, onPressed: widget.onStop)
                        : null;

                    if (narrow) {
                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: space.s2,
                        children: <Widget>[
                          Row(spacing: space.s2_5, children: <Widget>[label, ?picker]),
                          ?stop,
                        ],
                      );
                    }
                    return Row(spacing: space.s2_5, children: <Widget>[label, ?picker, const Spacer(), ?stop]);
                  },
                ),
              ],
            ),
          ),
          SizedBox(
            height: _hairline,
            child: ColoredBox(color: colors.overlayInk8),
          ), // h-px bg-overlay-ink-8
          Padding(
            // px-5 pt-4 pb-5
            padding: EdgeInsets.fromLTRB(space.s5, space.s4, space.s5, space.s5),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: space.s2_5, // gap-2.5
              children: <Widget>[
                _LeadRow(lead: widget.lead),
                if (widget.plan != null && widget.plan!.isNotEmpty) _plan(theme, widget.plan!),
                if (widget.children.isNotEmpty) _lanes(widget.children),
                if (widget.summary != null) _summary(theme, widget.summary!, widget.children.length),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// `pl-7.5` 들여 쓴 계획 목록입니다.
  Widget _plan(HoronThemeData theme, List<HoronOrchestratorPlanItem> plan) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return Padding(
      // pl-7.5 pt-0.5 pb-1
      padding: EdgeInsets.fromLTRB(_laneIndent, space.s0_5, 0, space.s1),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: space.s1_5, // gap-1.5
        children: <Widget>[
          for (int index = 0; index < plan.length; index++)
            _Rise(
              index: index,
              child: Row(
                spacing: space.s2_5, // gap-2.5
                children: <Widget>[
                  _PlanDot(color: plan[index].dotColor ?? colors.statusLive, pulsing: plan[index].running),
                  Flexible(
                    child: Text(plan[index].label, style: theme.text.bodySm.copyWith(color: colors.textPrimary)),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  /// 팔꿈치로 갈라지는 레인 목록입니다.
  Widget _lanes(List<Widget> lanes) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return Padding(
      padding: const EdgeInsets.only(left: _laneIndent), // pl-7.5
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: space.s2_5, // gap-2.5
        children: <Widget>[
          for (int index = 0; index < lanes.length; index++)
            _Rise(
              index: index,
              child: _LaneBranch(last: index == lanes.length - 1, child: lanes[index]),
            ),
        ],
      ),
    );
  }

  /// `rounded-[16px] bg-overlay-ink-4` 요약 상자입니다.
  Widget _summary(HoronThemeData theme, HoronOrchestratorSummary summary, int laneCount) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return _Rise(
      index: laneCount,
      child: Container(
        // px-3.5 py-3
        padding: EdgeInsets.symmetric(horizontal: space.s3_5, vertical: space.s3),
        decoration: BoxDecoration(
          color: colors.overlayInk4, // bg-overlay-ink-4
          borderRadius: BorderRadius.circular(_summaryRadius),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: space.s1, // gap-1
          children: <Widget>[
            Row(
              spacing: space.s2, // gap-2
              children: <Widget>[
                Expanded(
                  child: Text(
                    summary.title ?? 'Summary',
                    style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (summary.count != null)
                  Text(summary.count!, style: theme.text.caption.copyWith(color: colors.textSecondary)),
              ],
            ),
            Text(summary.body, style: theme.text.bodySm.copyWith(color: colors.textSecondary)),
          ],
        ),
      ),
    );
  }
}

/// `role="radiogroup"` 병렬 선택기입니다. 표시자가 280ms에 밀려 옮겨 갑니다.
class _ParallelPicker extends StatelessWidget {
  const _ParallelPicker({required this.options, required this.value, required this.label, this.onChanged});

  final List<int> options;
  final int? value;
  final String label;
  final ValueChanged<int>? onChanged;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final int selected = value == null ? -1 : options.indexOf(value!);

    return Semantics(
      container: true,
      label: label,
      child: Container(
        padding: const EdgeInsets.all(_trackInset), // p-[3px]
        decoration: BoxDecoration(
          color: theme.colors.overlayInk5, // bg-overlay-ink-5
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
        child: Stack(
          children: <Widget>[
            if (selected >= 0)
              AnimatedPositioned(
                // motion-indicator — translate: index * 32px
                duration: reduceMotion ? Duration.zero : HoronMotion.indicatorDuration,
                curve: HoronMotion.indicatorCurve,
                left: selected * _pickerStep,
                top: 0,
                width: _pickerWidth,
                height: _pickerHeight,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: theme.colors.overlayInk10, // bg-overlay-ink-10
                    borderRadius: BorderRadius.circular(theme.radius.full),
                  ),
                ),
              ),
            Row(
              mainAxisSize: MainAxisSize.min,
              spacing: theme.space.s0_5, // gap-0.5
              children: <Widget>[
                for (final int option in options)
                  _PickerOption(
                    option: option,
                    selected: option == value,
                    onTap: onChanged == null ? null : () => onChanged!(option),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// `h-7 w-7.5 text-label-md` 병렬 선택 칸입니다.
class _PickerOption extends StatefulWidget {
  const _PickerOption({required this.option, required this.selected, this.onTap});

  final int option;
  final bool selected;
  final VoidCallback? onTap;

  @override
  State<_PickerOption> createState() => _PickerOptionState();
}

class _PickerOptionState extends State<_PickerOption> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool interactive = widget.onTap != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Color foreground = widget.selected || _hovered ? colors.textPrimary : colors.textSecondary;

    return Semantics(
      button: true,
      selected: widget.selected,
      inMutuallyExclusiveGroup: true,
      label: '${widget.option}',
      child: FocusableActionDetector(
        enabled: interactive,
        mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onTap?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.onTap,
          child: _FocusRing(
            visible: _focused && interactive,
            radius: theme.radius.full,
            color: colors.textBrand,
            child: AnimatedDefaultTextStyle(
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              style: theme.text.labelMd.copyWith(color: foreground),
              child: Container(
                width: _pickerWidth, // w-7.5
                height: _pickerHeight, // h-7
                alignment: Alignment.center,
                child: Text('${widget.option}'),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `h-7.5 rounded-full bg-overlay-ink-6 px-3` Stop 단추입니다.
class _StopButton extends StatefulWidget {
  const _StopButton({required this.label, this.onPressed});

  final String label;
  final VoidCallback? onPressed;

  @override
  State<_StopButton> createState() => _StopButtonState();
}

class _StopButtonState extends State<_StopButton> {
  bool _hovered = false;
  bool _focused = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      enabled: interactive,
      label: widget.label,
      child: FocusableActionDetector(
        enabled: interactive,
        mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTapDown: interactive ? (_) => setState(() => _pressed = true) : null,
          onTapCancel: interactive ? () => setState(() => _pressed = false) : null,
          onTapUp: interactive ? (_) => setState(() => _pressed = false) : null,
          onTap: widget.onPressed,
          child: AnimatedScale(
            scale: _pressed ? HoronMotion.pressScale : 1, // motion-press
            duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
            curve: HoronMotion.pressCurve,
            child: _FocusRing(
              visible: _focused && interactive,
              radius: theme.radius.full,
              color: colors.textBrand,
              child: AnimatedContainer(
                duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
                curve: HoronMotion.colorsCurve,
                height: _stopHeight, // h-7.5
                padding: EdgeInsets.symmetric(horizontal: space.s3), // px-3
                // bg-overlay-ink-6, hover:bg-overlay-ink-10
                decoration: BoxDecoration(
                  color: _hovered && interactive ? colors.overlayInk10 : colors.overlayInk6,
                  borderRadius: BorderRadius.circular(theme.radius.full),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: space.s1_5, // gap-1.5
                  children: <Widget>[
                    Icon(Icons.stop, size: _stopIconSize, color: colors.textPrimary), // Stop size-3.5
                    Text(widget.label, style: theme.text.labelSm.copyWith(color: colors.textPrimary)),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 리드 한 줄입니다.
class _LeadRow extends StatelessWidget {
  const _LeadRow({required this.lead});

  final HoronOrchestratorLead lead;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Row(
      spacing: space.s2, // gap-2
      children: <Widget>[
        Container(
          width: _leadTileSize, // size-5.5
          height: _leadTileSize,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: colors.interactivePrimary, // bg-interactive-primary
            borderRadius: BorderRadius.circular(_leadTileRadius), // rounded-[5px]
          ),
          child: Text(lead.initial, style: theme.text.labelSm.copyWith(color: colors.textInverse)),
        ),
        Flexible(
          child: Text(
            lead.name,
            style: theme.text.labelLg.copyWith(color: colors.textPrimary),
            maxLines: 1,
            softWrap: false,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        // min-w-0 flex-1 truncate
        Expanded(
          child: Text(
            lead.role ?? 'Lead',
            style: theme.text.bodySm.copyWith(color: colors.textSecondary),
            maxLines: 1,
            softWrap: false,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        if (lead.running) const HoronSpinner(pixelSize: 13),
        if (lead.status != null)
          Flexible(
            child: Text(
              lead.status!,
              style: theme.text.caption.copyWith(color: colors.textSecondary),
              maxLines: 1,
              softWrap: false,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        if (lead.elapsed != null)
          Flexible(
            child: Text(
              lead.elapsed!,
              style: theme.text.caption.copyWith(color: colors.textSecondary),
              maxLines: 1,
              softWrap: false,
              overflow: TextOverflow.ellipsis,
            ),
          ),
      ],
    );
  }
}

/// 계획 항목의 점입니다. [pulsing]이면 `animate-live-pulse`로 번집니다.
class _PlanDot extends StatefulWidget {
  const _PlanDot({required this.color, this.pulsing = false});

  final Color color;
  final bool pulsing;

  @override
  State<_PlanDot> createState() => _PlanDotState();
}

class _PlanDotState extends State<_PlanDot> with SingleTickerProviderStateMixin {
  late final AnimationController _pulse = AnimationController(vsync: this, duration: HoronMotion.livePulseDuration);

  @override
  void initState() {
    super.initState();
    if (widget.pulsing) _pulse.repeat();
  }

  @override
  void didUpdateWidget(_PlanDot oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.pulsing && !_pulse.isAnimating) {
      _pulse.repeat();
    } else if (!widget.pulsing && _pulse.isAnimating) {
      _pulse.stop();
      _pulse.value = 0;
    }
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Widget dot = Container(
      width: _planDotSize, // size-1.5
      height: _planDotSize,
      decoration: BoxDecoration(color: widget.color, shape: BoxShape.circle),
    );
    if (!widget.pulsing) return dot;

    return AnimatedBuilder(
      animation: _pulse,
      builder: (BuildContext context, Widget? child) {
        // live-pulse: 0 → 45% 고리 6px, 70%에서 사라집니다.
        final double t = HoronMotion.livePulseCurve.transform((_pulse.value / 0.7).clamp(0, 1));
        return Container(
          width: _planDotSize,
          height: _planDotSize,
          decoration: BoxDecoration(
            color: widget.color,
            shape: BoxShape.circle,
            boxShadow: <BoxShadow>[
              BoxShadow(
                color: widget.color.withValues(alpha: 0.45 * (1 - t)),
                spreadRadius: 6 * t,
              ),
            ],
          ),
        );
      },
    );
  }
}

/// 레인 하나와 그 왼쪽 팔꿈치입니다.
///
/// `absolute top-0 -left-7.5 h-5.5 w-7.5 rounded-bl-lg border-b-[1.5px]
/// border-l-[1.5px]`에, 마지막이 아니면 `top-5.5 -bottom-2.5` 세로선이 붙습니다.
class _LaneBranch extends StatelessWidget {
  const _LaneBranch({required this.last, required this.child});

  final bool last;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronColors colors = HoronTheme.of(context).colors;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -_laneIndent,
          top: 0,
          width: _laneIndent,
          height: _elbowHeight,
          child: CustomPaint(painter: _ElbowPainter(color: colors.overlayInk14)),
        ),
        if (!last)
          Positioned(
            left: -_laneIndent,
            top: _elbowHeight,
            bottom: -_connectorTail,
            width: _connectorWidth,
            child: ColoredBox(color: colors.overlayInk14),
          ),
        child,
      ],
    );
  }
}

/// 왼쪽·아래 테두리만 남긴 팔꿈치를 긋습니다.
class _ElbowPainter extends CustomPainter {
  const _ElbowPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = _connectorWidth
      ..color = color;
    final Path path = Path()
      ..moveTo(_connectorWidth / 2, 0)
      ..lineTo(_connectorWidth / 2, size.height - _elbowRadius)
      ..quadraticBezierTo(_connectorWidth / 2, size.height, _elbowRadius, size.height)
      ..lineTo(size.width, size.height);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_ElbowPainter oldDelegate) => oldDelegate.color != color;
}

/// `motion-rise` — opacity 0→1, translate 0 4px→0을 220ms에 재생합니다.
class _Rise extends StatefulWidget {
  const _Rise({required this.child, this.index = 0});

  final Widget child;
  final int index;

  @override
  State<_Rise> createState() => _RiseState();
}

class _RiseState extends State<_Rise> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _curve;

  @override
  void initState() {
    super.initState();
    final int delayMs = widget.index * _staggerMs;
    final int totalMs = delayMs + HoronMotion.riseDuration.inMilliseconds;
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: totalMs),
    );
    _curve = CurvedAnimation(
      parent: _controller,
      curve: Interval(delayMs / totalMs, 1, curve: HoronMotion.riseCurve),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return widget.child;
    return AnimatedBuilder(
      animation: _curve,
      builder: (BuildContext context, Widget? child) => Opacity(
        opacity: _curve.value,
        child: Transform.translate(offset: Offset(0, HoronMotion.riseOffset * (1 - _curve.value)), child: child),
      ),
      child: widget.child,
    );
  }
}

/// `focus-visible:outline-2 outline-text-brand`을 그립니다.
class _FocusRing extends StatelessWidget {
  const _FocusRing({required this.visible, required this.radius, required this.color, required this.child});

  final bool visible;
  final double radius;
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (!visible) return child;
    final double offset = HoronTheme.of(context).space.s0_5;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -offset,
          top: -offset,
          right: -offset,
          bottom: -offset,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(radius + offset),
                border: Border.all(color: color, width: _focusWidth),
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
