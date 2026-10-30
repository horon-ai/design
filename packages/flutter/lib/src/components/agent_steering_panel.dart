import 'dart:math' as math;
import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'kbd.dart';
import 'spinner.dart';

/// `agent-steering-panel.tsx`의 `SteeringStepStatus`입니다.
enum HoronSteeringStepStatus {
  /// `status="done"` — 라이브 점 바탕에 체크가 붙고 연결선이 라이브 색입니다.
  done,

  /// `status="active"` — 18px 스피너가 돕니다.
  active,

  /// `status="todo"` — 점선 테두리의 빈 원이고 글자가 보조색입니다.
  todo,
}

/// `rounded-[24px]` — 패널 반경 24입니다. 토큰 단계에 같은 값이 없습니다.
const double _panelRadius = 24;

/// `max-w-130` — 패널이 더 넓어지지 않는 폭 520입니다.
const double _panelMaxWidth = 520;

/// `size-4.5` — 머리의 스파클과 완료 표식 18입니다.
const double _sparkleSize = 18;

/// `size-1.75` — 라이브 점 7입니다.
const double _liveDotSize = 7;

/// `size-8` — 일시정지 버튼과 보내기 버튼 32입니다.
const double _iconButtonSize = 32;

/// `[&>svg]:size-4` — 일시정지·보내기 아이콘 16입니다.
const double _iconButtonIconSize = 16;

/// `rounded-[10px]` — 일시정지·보내기 버튼과 쪽지 줄의 반경 10입니다.
const double _controlRadius = 10;

/// `min-h-6.5` — 단계 한 줄의 최소 높이 26입니다.
const double _stepRowHeight = 26;

/// `w-5` — 표식이 서는 왼쪽 열의 폭 20입니다.
const double _markerColumnWidth = 20;

/// `size-4.25` — 할 일 표식의 지름 17입니다.
const double _todoMarkerSize = 17;

/// `size-3` — 완료 체크와 "Now" 번개 12입니다.
const double _markerIconSize = 12;

/// `top-5.5` — 연결선이 시작하는 위쪽 22입니다.
const double _connectorTop = 22;

/// `h-5` — 연결선의 길이 20입니다.
const double _connectorHeight = 20;

/// `w-px` — 연결선의 두께 1입니다.
const double _connectorWidth = 1;

/// `h-6.5` — 쪽지 알약의 높이 26입니다.
const double _notePillHeight = 26;

/// `size-6` — 쪽지 제거 버튼 24입니다.
const double _noteRemoveSize = 24;

/// `size-3.5` — 쪽지 제거 아이콘 14입니다.
const double _noteRemoveIconSize = 14;

/// `h-11` — 조타 상자의 높이 44입니다.
const double _steerHeight = 44;

/// `rounded-[14px]` — 조타 상자의 반경 14입니다.
const double _steerRadius = 14;

/// `border-dashed` — 할 일 표식의 점선 획 3과 틈 2입니다.
const double _dash = 3;

/// `border-dashed` — 할 일 표식의 점선 틈 2입니다.
const double _dashGap = 2;

/// `agent-steering-panel.tsx`의 `SteeringStep`입니다.
class HoronSteeringStep {
  /// 단계를 만듭니다.
  const HoronSteeringStep({required this.id, required this.label, required this.status, this.time});

  /// 식별자입니다.
  final String id;

  /// 단계의 글자입니다.
  final String label;

  /// 단계의 진행 상태입니다.
  final HoronSteeringStepStatus status;

  /// 끝났거나 도는 중인 단계의 길이입니다. 예: `1.4s`.
  final String? time;
}

/// `agent-steering-panel.tsx`의 `SteeringNote`입니다.
class HoronSteeringNote {
  /// 쪽지를 만듭니다.
  const HoronSteeringNote({required this.id, required this.text, this.applied = false});

  /// 식별자입니다.
  final String id;

  /// 쪽지의 글자입니다.
  final String text;

  /// 이미 적용된 쪽지입니다. 대기열에서 빠지고 "Now" 알약이 붙습니다.
  final bool applied;
}

/// Figma `Agent steering`(Y51-1): 실행 중인 작업의 머리, 단계 레일, 다음 단계로
/// 넘길 쪽지, 조타 상자로 이루어진 24px 표면 패널입니다.
///
/// `agent-steering-panel.tsx`를 옮긴 것입니다. 라이브 점은 2초에 한 번 맥동하고,
/// 단계 표식은 상태가 바뀔 때 짧은 팝으로 교체되며, 새 단계와 쪽지는 220ms 동안
/// 4px 아래에서 올라옵니다. 보내기와 일시정지는 150ms 누름 피드백을 씁니다.
///
/// React는 Enter로 다음 단계에 쌓고 ⌘Enter(⌃Enter)로 지금 끼어듭니다. 포트는 같은
/// 두 동작을 [CallbackShortcuts]로 받습니다. `isComposing` 중인 한글 입력은 React가
/// 무시하므로, 포트도 조합 중에는 Enter를 보내지 않습니다.
class HoronAgentSteeringPanel extends StatefulWidget {
  /// 패널을 만듭니다.
  const HoronAgentSteeringPanel({
    super.key,
    required this.title,
    required this.steps,
    this.subtitle,
    this.status,
    this.paused = false,
    this.onPausedChange,
    this.notes = const <HoronSteeringNote>[],
    this.onApplyNow,
    this.onRemoveNote,
    this.onSteer,
    this.placeholder = 'Steer the bot…',
  });

  /// 머리의 제목입니다.
  final String title;

  /// 제목 아래의 한 줄 설명입니다.
  final String? subtitle;

  /// 라이브 점 옆의 상태 글자입니다. 예: `Running · 2m 10s`.
  final String? status;

  /// 일시정지 상태입니다.
  final bool paused;

  /// 일시정지를 바꿀 때입니다. 넘기면 머리의 버튼이 이 값을 뒤집어 부릅니다.
  final ValueChanged<bool>? onPausedChange;

  /// 단계 레일입니다.
  final List<HoronSteeringStep> steps;

  /// 다음 단계로 넘길 쪽지입니다.
  final List<HoronSteeringNote> notes;

  /// 쪽지의 "Now"를 눌렀을 때입니다.
  final ValueChanged<String>? onApplyNow;

  /// 쪽지의 제거 버튼을 눌렀을 때입니다.
  final ValueChanged<String>? onRemoveNote;

  /// 조타 상자에서 보냈을 때입니다. [interrupt]가 참이면 지금 끼어듭니다.
  final void Function(String text, bool interrupt)? onSteer;

  /// 조타 상자의 안내 문구입니다.
  final String placeholder;

  @override
  State<HoronAgentSteeringPanel> createState() => _HoronAgentSteeringPanelState();
}

class _HoronAgentSteeringPanelState extends State<HoronAgentSteeringPanel> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// 조타 상자의 글자를 보냅니다. 비어 있으면 아무것도 하지 않습니다.
  void _submit(bool interrupt) {
    final String text = _controller.text.trim();
    if (text.isEmpty) return;
    widget.onSteer?.call(text, interrupt);
    _controller.clear();
  }

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
              // `h-px bg-overlay-ink-12`.
              ColoredBox(color: colors.overlayInk12, child: const SizedBox(height: 1)),
              _buildSteps(context, theme),
              ColoredBox(color: colors.overlayInk12, child: const SizedBox(height: 1)),
              _buildFooter(context, theme),
            ],
          ),
        ),
      ),
    );
  }

  /// 머리 줄입니다.
  Widget _buildHeader(BuildContext context, HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // `pt-4 pr-4 pb-3.5 pl-4.5`.
      padding: EdgeInsets.only(top: space.s4, right: space.s4, bottom: space.s3_5, left: space.step(4.5)),
      child: Row(
        children: <Widget>[
          // `Sparkle size-4.5 text-text-primary`.
          Icon(Icons.auto_awesome, size: _sparkleSize, color: colors.textPrimary),
          SizedBox(width: space.s2_5),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // `h3 truncate text-label-lg text-text-primary`.
                Text(
                  widget.title,
                  style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (widget.subtitle case final String subtitle)
                  Text(
                    subtitle,
                    // `truncate text-caption text-text-secondary`.
                    style: theme.text.caption.copyWith(color: colors.textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
              ],
            ),
          ),
          SizedBox(width: space.s2_5),
          // `size-1.75 rounded-full bg-status-live animate-live-pulse`.
          _LiveDot(size: _liveDotSize, color: colors.statusLive, animate: !widget.paused),
          if (widget.status case final String status) ...<Widget>[
            SizedBox(width: space.s2_5),
            // React는 `shrink-0`이라 상태가 길면 머리가 넘칩니다. 포트는 줄일 수 있게 둡니다.
            Flexible(
              child: Text(
                status,
                style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
          SizedBox(width: space.s2_5),
          _PauseButton(paused: widget.paused, onPressed: widget.onPausedChange),
        ],
      ),
    );
  }

  /// 단계 레일입니다.
  Widget _buildSteps(BuildContext context, HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // `px-4.5 py-3`.
      padding: EdgeInsets.symmetric(horizontal: space.step(4.5), vertical: space.s3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        // `gap-3`.
        spacing: space.s3,
        children: <Widget>[
          for (int index = 0; index < widget.steps.length; index++)
            _StepRow(step: widget.steps[index], showConnector: index < widget.steps.length - 1, colors: colors),
        ],
      ),
    );
  }

  /// 쪽지 대기열과 조타 상자입니다.
  Widget _buildFooter(BuildContext context, HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final int queued = widget.notes.where((HoronSteeringNote note) => !note.applied).length;

    return Padding(
      // `px-4.5 py-3.5`.
      padding: EdgeInsets.symmetric(horizontal: space.step(4.5), vertical: space.s3_5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        // `gap-2.5`.
        spacing: space.s2_5,
        children: <Widget>[
          if (widget.notes.isNotEmpty) ...<Widget>[
            Row(
              spacing: space.s2,
              children: <Widget>[
                Text(
                  // `uppercase text-caption text-text-secondary`.
                  'Queued for the next step'.toUpperCase(),
                  style: theme.text.caption.copyWith(color: colors.textSecondary),
                  maxLines: 1,
                  softWrap: false,
                ),
                HoronKbd(label: '$queued'),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              // `gap-2`.
              spacing: space.s2,
              children: <Widget>[
                for (final HoronSteeringNote note in widget.notes)
                  _NoteRow(note: note, onApplyNow: widget.onApplyNow, onRemoveNote: widget.onRemoveNote),
              ],
            ),
          ],
          _buildSteerBox(context, theme),
          _buildHints(theme),
        ],
      ),
    );
  }

  /// 조타 상자입니다.
  Widget _buildSteerBox(BuildContext context, HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      height: _steerHeight,
      // `pr-1.5 pl-3.5`.
      padding: EdgeInsets.only(right: space.s1_5, left: space.s3_5),
      decoration: BoxDecoration(
        // `bg-overlay-ink-5`.
        color: colors.overlayInk5,
        borderRadius: BorderRadius.circular(_steerRadius),
      ),
      child: Row(
        spacing: space.s2,
        children: <Widget>[
          Expanded(
            child: CallbackShortcuts(
              bindings: <ShortcutActivator, VoidCallback>{
                // `⌘Enter`·`⌃Enter` — 지금 끼어듭니다.
                const SingleActivator(LogicalKeyboardKey.enter, meta: true): () => _submit(true),
                const SingleActivator(LogicalKeyboardKey.enter, control: true): () => _submit(true),
              },
              child: TextField(
                controller: _controller,
                style: theme.text.bodySm.copyWith(color: colors.textPrimary),
                cursorColor: colors.textPrimary,
                textInputAction: TextInputAction.send,
                // `Enter` — 다음 단계에 쌓습니다. 한글 조합 중이면 입력기가 먼저 가져갑니다.
                onSubmitted: (String _) => _submit(false),
                decoration: InputDecoration.collapsed(
                  hintText: widget.placeholder,
                  hintStyle: theme.text.bodySm.copyWith(color: colors.textSecondary),
                ),
              ),
            ),
          ),
          _SendButton(onPressed: () => _submit(false)),
        ],
      ),
    );
  }

  /// 단축키 안내입니다.
  Widget _buildHints(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final TextStyle style = theme.text.caption.copyWith(color: colors.textSecondary);

    return Wrap(
      // `gap-3.5`.
      spacing: space.s3_5,
      runSpacing: space.s1_5,
      children: <Widget>[
        Row(
          mainAxisSize: MainAxisSize.min,
          // `gap-1.25`.
          spacing: space.step(1.25),
          children: <Widget>[
            HoronKbd(child: Icon(Icons.keyboard_return, size: _markerIconSize)),
            Text('next step', style: style),
          ],
        ),
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: space.step(1.25),
          children: <Widget>[
            const HoronKbd(label: '⌘'),
            HoronKbd(child: Icon(Icons.keyboard_return, size: _markerIconSize)),
            Text('interrupt now', style: style),
          ],
        ),
      ],
    );
  }
}

/// `min-h-6.5 flex items-center gap-3` 단계 한 줄입니다.
class _StepRow extends StatelessWidget {
  const _StepRow({required this.step, required this.showConnector, required this.colors});

  final HoronSteeringStep step;
  final bool showConnector;
  final HoronColors colors;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool todo = step.status == HoronSteeringStepStatus.todo;

    return _Rise(
      child: Stack(
        clipBehavior: Clip.none,
        children: <Widget>[
          ConstrainedBox(
            constraints: const BoxConstraints(minHeight: _stepRowHeight),
            child: Row(
              children: <Widget>[
                SizedBox(
                  width: _markerColumnWidth,
                  height: _stepRowHeight,
                  child: Center(
                    // `key={step.status}` — 상태가 바뀌면 표식이 팝으로 교체됩니다.
                    child: KeyedSubtree(
                      key: ValueKey<HoronSteeringStepStatus>(step.status),
                      child: _StepMarker(status: step.status),
                    ),
                  ),
                ),
                SizedBox(width: space.s3),
                Expanded(
                  child: Text(
                    step.label,
                    // `text-body-sm text-text-secondary` (todo) / `text-text-primary`.
                    style: theme.text.bodySm.copyWith(color: todo ? colors.textSecondary : colors.textPrimary),
                  ),
                ),
                if (step.time case final String time) ...<Widget>[
                  SizedBox(width: space.s3),
                  Text(
                    time,
                    // `text-caption text-text-secondary`.
                    style: theme.text.caption.copyWith(color: colors.textSecondary),
                    maxLines: 1,
                    softWrap: false,
                  ),
                ],
              ],
            ),
          ),
          if (showConnector)
            Positioned(
              left: (_markerColumnWidth - _connectorWidth) / 2,
              top: _connectorTop,
              width: _connectorWidth,
              height: _connectorHeight,
              child: ColoredBox(
                // 끝난 단계에서만 라이브 색, 아니면 10% 잉크.
                color: step.status == HoronSteeringStepStatus.done ? colors.statusLive : colors.overlayInk10,
              ),
            ),
        ],
      ),
    );
  }
}

/// `Marker` — 상태에 따라 체크·스피너·점선 원을 그리는 표식입니다.
class _StepMarker extends StatelessWidget {
  const _StepMarker({required this.status});

  final HoronSteeringStepStatus status;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;

    return switch (status) {
      HoronSteeringStepStatus.done => _PopIn(
        child: Container(
          // `size-4.5 rounded-full bg-status-live text-text-on-ink`.
          width: _sparkleSize,
          height: _sparkleSize,
          alignment: Alignment.center,
          decoration: BoxDecoration(color: colors.statusLive, shape: BoxShape.circle),
          child: Icon(Icons.check, size: _markerIconSize, color: colors.textOnInk),
        ),
      ),
      // `<Spinner size={18} />`.
      HoronSteeringStepStatus.active => const HoronSpinner(pixelSize: _sparkleSize, label: 'Running'),
      // `size-4.25 rounded-full border border-dashed border-border-dashed`.
      HoronSteeringStepStatus.todo => _DashedCircle(size: _todoMarkerSize, color: colors.borderDashed),
    };
  }
}

/// `rounded-[10px] bg-overlay-ink-4 py-2 pr-2.5 pl-3.5` 쪽지 한 장입니다.
class _NoteRow extends StatelessWidget {
  const _NoteRow({required this.note, required this.onApplyNow, required this.onRemoveNote});

  final HoronSteeringNote note;
  final ValueChanged<String>? onApplyNow;
  final ValueChanged<String>? onRemoveNote;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return _Rise(
      child: Container(
        padding: EdgeInsets.only(top: space.s2, right: space.s2_5, bottom: space.s2, left: space.s3_5),
        decoration: BoxDecoration(
          // `bg-overlay-ink-4`.
          color: colors.overlayInk4,
          borderRadius: BorderRadius.circular(_controlRadius),
        ),
        child: Row(
          spacing: space.s2_5,
          children: <Widget>[
            Expanded(
              child: Text(
                note.text,
                // `text-body-sm text-text-primary`.
                style: theme.text.bodySm.copyWith(color: colors.textPrimary),
              ),
            ),
            if (note.applied)
              // `h-6.5 rounded-full bg-interactive-primary px-2 text-label-sm` 적용 알약.
              _PillChip(
                icon: Icons.bolt,
                label: 'Now',
                background: colors.interactivePrimary,
                foreground: colors.textInverse,
                popIn: true,
              )
            else ...<Widget>[
              _PillChip(
                icon: Icons.bolt,
                label: 'Now',
                background: colors.overlayInk6,
                pressedBackground: colors.overlayInk10,
                foreground: colors.textPrimary,
                onPressed: onApplyNow == null ? null : () => onApplyNow!(note.id),
              ),
              _RemoveButton(onPressed: onRemoveNote == null ? null : () => onRemoveNote!(note.id)),
            ],
          ],
        ),
      ),
    );
  }
}

/// `h-6.5 rounded-full px-2 text-label-sm` 쪽지의 "Now" 알약입니다.
class _PillChip extends StatefulWidget {
  const _PillChip({
    required this.icon,
    required this.label,
    required this.background,
    required this.foreground,
    this.pressedBackground,
    this.onPressed,
    this.popIn = false,
  });

  final IconData icon;
  final String label;
  final Color background;
  final Color foreground;
  final Color? pressedBackground;
  final VoidCallback? onPressed;

  /// `animate-pop-in` — 나타날 때 0.6에서 1로 커집니다.
  final bool popIn;

  @override
  State<_PillChip> createState() => _PillChipState();
}

class _PillChipState extends State<_PillChip> {
  bool _pressed = false;
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Color? pressedBackground = widget.pressedBackground;

    final Widget chip = AnimatedScale(
      // `motion-press` — 누르는 동안 0.97.
      scale: _pressed ? HoronMotion.pressScale : 1,
      duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
      curve: HoronMotion.pressCurve,
      child: AnimatedContainer(
        height: _notePillHeight,
        duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
        curve: HoronMotion.colorsCurve,
        // `px-2`.
        padding: EdgeInsets.symmetric(horizontal: space.s2),
        decoration: BoxDecoration(
          color: (_pressed || _hovered) && pressedBackground != null ? pressedBackground : widget.background,
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          // `gap-1`.
          spacing: space.s1,
          children: <Widget>[
            Icon(widget.icon, size: _markerIconSize, color: widget.foreground),
            Text(
              widget.label,
              style: theme.text.labelSm.copyWith(color: widget.foreground),
              maxLines: 1,
              softWrap: false,
            ),
          ],
        ),
      ),
    );

    final Widget target = GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapCancel: () => setState(() => _pressed = false),
      onTapUp: (_) => setState(() => _pressed = false),
      onTap: widget.onPressed,
      child: MouseRegion(
        cursor: widget.onPressed == null ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: chip,
      ),
    );

    if (!widget.popIn) return target;
    return _PopIn(child: target);
  }
}

/// `size-6 rounded-full` 쪽지 제거 버튼입니다.
class _RemoveButton extends StatefulWidget {
  const _RemoveButton({this.onPressed});

  final VoidCallback? onPressed;

  @override
  State<_RemoveButton> createState() => _RemoveButtonState();
}

class _RemoveButtonState extends State<_RemoveButton> {
  bool _pressed = false;
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      label: 'Remove note',
      button: true,
      child: MouseRegion(
        cursor: widget.onPressed == null ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          onTapDown: (_) => setState(() => _pressed = true),
          onTapCancel: () => setState(() => _pressed = false),
          onTapUp: (_) => setState(() => _pressed = false),
          onTap: widget.onPressed,
          child: AnimatedScale(
            scale: _pressed ? HoronMotion.pressScale : 1,
            duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
            curve: HoronMotion.pressCurve,
            child: SizedBox(
              width: _noteRemoveSize,
              height: _noteRemoveSize,
              child: Center(
                // `text-text-secondary hover:text-text-primary`.
                child: Icon(
                  Icons.close,
                  size: _noteRemoveIconSize,
                  color: _pressed || _hovered ? colors.textPrimary : colors.textSecondary,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `size-8 rounded-[10px]` 일시정지·재개 버튼입니다.
class _PauseButton extends StatefulWidget {
  const _PauseButton({required this.paused, this.onPressed});

  final bool paused;
  final ValueChanged<bool>? onPressed;

  @override
  State<_PauseButton> createState() => _PauseButtonState();
}

class _PauseButtonState extends State<_PauseButton> {
  bool _pressed = false;
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      // `aria-label={paused ? "Resume" : "Pause"}`.
      label: widget.paused ? 'Resume' : 'Pause',
      button: true,
      toggled: widget.paused,
      child: MouseRegion(
        cursor: widget.onPressed == null ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          onTapDown: (_) => setState(() => _pressed = true),
          onTapCancel: () => setState(() => _pressed = false),
          onTapUp: (_) => setState(() => _pressed = false),
          onTap: widget.onPressed == null ? null : () => widget.onPressed!(!widget.paused),
          child: AnimatedScale(
            scale: _pressed ? HoronMotion.pressScale : 1,
            duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
            curve: HoronMotion.pressCurve,
            child: AnimatedContainer(
              width: _iconButtonSize,
              height: _iconButtonSize,
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              decoration: BoxDecoration(
                // `bg-overlay-ink-6`, `hover:bg-overlay-ink-10`.
                color: _pressed || _hovered ? colors.overlayInk10 : colors.overlayInk6,
                borderRadius: BorderRadius.circular(_controlRadius),
              ),
              child: Icon(
                widget.paused ? Icons.play_arrow : Icons.pause,
                size: _iconButtonIconSize,
                color: colors.textPrimary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `size-8 rounded-[10px] bg-interactive-primary` 보내기 버튼입니다.
class _SendButton extends StatefulWidget {
  const _SendButton({this.onPressed});

  final VoidCallback? onPressed;

  @override
  State<_SendButton> createState() => _SendButtonState();
}

class _SendButtonState extends State<_SendButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      label: 'Send',
      button: true,
      child: GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapCancel: () => setState(() => _pressed = false),
        onTapUp: (_) => setState(() => _pressed = false),
        onTap: widget.onPressed,
        child: AnimatedScale(
          scale: _pressed ? HoronMotion.pressScale : 1,
          duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
          curve: HoronMotion.pressCurve,
          child: AnimatedContainer(
            width: _iconButtonSize,
            height: _iconButtonSize,
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            decoration: BoxDecoration(
              // `bg-interactive-primary text-text-inverse`.
              color: _pressed ? colors.interactivePrimaryPressed : colors.interactivePrimary,
              borderRadius: BorderRadius.circular(_controlRadius),
            ),
            child: Icon(Icons.arrow_upward, size: _iconButtonIconSize, color: colors.textInverse),
          ),
        ),
      ),
    );
  }
}

/// `size-1.75 animate-live-pulse bg-status-live` 라이브 점입니다.
///
/// 웹의 `live-pulse`는 무한 반복이지만, 끝없이 프레임을 예약하는 애니메이션은
/// 갤러리 스윕의 `pumpAndSettle`을 끝나지 않게 만듭니다. 그래서 Flutter 판은 진입할 때
/// 2초짜리 한 주기를 재생하고 같은 자리에서 멈춥니다.
class _LiveDot extends StatefulWidget {
  const _LiveDot({required this.size, required this.color, required this.animate});

  final double size;
  final Color color;
  final bool animate;

  @override
  State<_LiveDot> createState() => _LiveDotState();
}

class _LiveDotState extends State<_LiveDot> with SingleTickerProviderStateMixin {
  late final AnimationController _pulse = AnimationController(vsync: this, duration: HoronMotion.livePulseDuration);
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    if (widget.animate && !MediaQuery.disableAnimationsOf(context)) _pulse.forward();
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return AnimatedBuilder(
      animation: _pulse,
      builder: (BuildContext context, Widget? child) {
        // `box-shadow: 0 0 0 0 → 0 0 0 6px`, `currentColor 45% → transparent`.
        final double t = HoronMotion.livePulseCurve.transform(_pulse.value);
        return Container(
          width: widget.size,
          height: widget.size,
          decoration: BoxDecoration(
            color: widget.color,
            shape: BoxShape.circle,
            boxShadow: reduceMotion || t >= 1
                ? null
                : <BoxShadow>[
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

/// `animate-pop-in` — 220ms 동안 0.6에서 1로 커지며 나타납니다.
class _PopIn extends StatelessWidget {
  const _PopIn({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: child,
    );
  }
}

/// `border border-dashed` — 점선 원입니다.
///
/// Flutter에는 점선 테두리가 없어 3px 획과 2px 틈을 원 둘레에 직접 그립니다.
class _DashedCircle extends StatelessWidget {
  const _DashedCircle({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(painter: _DashedCirclePainter(color: color)),
    );
  }
}

/// [_DashedCircle]의 페인터입니다.
class _DashedCirclePainter extends CustomPainter {
  const _DashedCirclePainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = color;
    // `border` 1px가 상자 안쪽에 그려지므로 지름을 1px 줄입니다.
    final Path path = Path()..addOval(Rect.fromLTWH(0.5, 0.5, size.width - 1, size.height - 1));
    for (final PathMetric metric in path.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double next = math.min(distance + _dash, metric.length);
        canvas.drawPath(metric.extractPath(distance, next), paint);
        distance = next + _dashGap;
      }
    }
  }

  @override
  bool shouldRepaint(_DashedCirclePainter oldDelegate) => oldDelegate.color != color;
}
