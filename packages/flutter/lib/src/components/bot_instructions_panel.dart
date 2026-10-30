import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `bot-instructions-panel.tsx`의 `InstructionVariableTone`입니다.
enum HoronInstructionVariableTone {
  /// `tone="sky"` — 하늘색 `{{변수}}` 칩입니다. 기본값입니다.
  sky,

  /// `tone="brand"` — 남색 브랜드 칩입니다.
  brand,

  /// `tone="neutral"` — 중립 회색 칩입니다.
  neutral,
}

/// `rounded-[24px]` — 패널 반경 24px입니다. 토큰 단계(16, 20)에 없는 값입니다.
const double _panelRadius = 24;

/// `size-3` — 머리말 캐럿 12px입니다.
const double _caretSize = 12;

/// `rounded-[5px]` — 봇 알약 아바타의 반경입니다. 토큰 단계에 없는 값입니다.
const double _botAvatarRadius = 5;

/// `size-3.5` — Run 아이콘 14px입니다.
const double _runIconSize = 14;

/// `min-w-35` — 변수 칸의 최소 폭 140px입니다.
const double _variableMinWidth = 140;

/// `h-px` — 구분선 두께 1px입니다.
const double _hairline = 1;

/// `PanelPillTabs`의 한 항목입니다.
class HoronPanelPillTab {
  /// 항목을 만듭니다.
  const HoronPanelPillTab({required this.value, required this.label});

  /// 선택 값입니다. 부모는 이 값으로 지금 선택된 탭을 압니다.
  final String value;

  /// 탭에 보이는 문구입니다. React는 `ReactNode`를 받지만 두 사용처 모두 글자입니다.
  final String label;
}

/// `PanelPillTabs`입니다. 봇 패널들이 함께 쓰는 알약 모양 탭 줄입니다.
///
/// React는 `bg-overlay-ink-5` 트랙에 3px 여백, 2px 간격, 28px 항목, 12px 좌우 여백을
/// 두고 선택 표시자를 옵션 사이로 280ms 동안 미끄러뜨립니다. Flutter 판은 항목 폭이
/// 글자에 따라 달라지는 구조를 그대로 두고, 미끄러지는 표시자 대신 선택된 항목이
/// `bg-overlay-ink-10` 알약을 스스로 그립니다. 폭이 모자라면 [Wrap]이 줄을 바꿉니다.
class HoronPanelPillTabs extends StatefulWidget {
  /// 탭 줄을 만듭니다.
  const HoronPanelPillTabs({
    super.key,
    required this.items,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.semanticLabel,
  });

  /// 탭 항목입니다.
  final List<HoronPanelPillTab> items;

  /// 부모가 쥔 선택 값입니다. 주면 이 위젯은 스스로 상태를 만들지 않습니다.
  final String? value;

  /// 부모가 값을 주지 않을 때의 처음 선택 값입니다. 없으면 첫 항목입니다.
  final String? defaultValue;

  /// 선택이 바뀔 때 부르는 콜백입니다.
  final ValueChanged<String>? onValueChange;

  /// 탭 줄의 접근성 이름입니다. React의 `aria-label`입니다.
  final String? semanticLabel;

  @override
  State<HoronPanelPillTabs> createState() => _HoronPanelPillTabsState();
}

class _HoronPanelPillTabsState extends State<HoronPanelPillTabs> {
  late String _inner = widget.defaultValue ?? (widget.items.isEmpty ? '' : widget.items.first.value);

  String get _selected => widget.value ?? _inner;

  void _select(String next) {
    setState(() => _inner = next);
    widget.onValueChange?.call(next);
  }

  /// `ArrowRight`·`ArrowLeft`로 이웃 탭을 고릅니다(React의 `onKeyDown`).
  void _move(int step) {
    if (widget.items.isEmpty) return;
    final int at = widget.items.indexWhere((HoronPanelPillTab item) => item.value == _selected);
    final int next = (at + step + widget.items.length) % widget.items.length;
    _select(widget.items[next].value);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    if (widget.items.isEmpty) return const SizedBox.shrink();

    return Semantics(
      container: true,
      label: widget.semanticLabel,
      child: CallbackShortcuts(
        bindings: <ShortcutActivator, VoidCallback>{
          const SingleActivator(LogicalKeyboardKey.arrowRight): () => _move(1),
          const SingleActivator(LogicalKeyboardKey.arrowLeft): () => _move(-1),
        },
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: colors.overlayInk5, // bg-overlay-ink-5
            borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
          ),
          child: Padding(
            padding: EdgeInsets.all(space.step(0.75)), // p-[3px]
            child: Wrap(
              spacing: space.s0_5, // gap-0.5
              runSpacing: space.s0_5,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                for (final HoronPanelPillTab item in widget.items)
                  _PanelPillTabButton(
                    label: item.label,
                    selected: item.value == _selected,
                    onTap: () => _select(item.value),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 알약 트랙 안의 탭 하나입니다. `h-7 rounded-full px-3 text-label-md`입니다.
class _PanelPillTabButton extends StatefulWidget {
  const _PanelPillTabButton({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  State<_PanelPillTabButton> createState() => _PanelPillTabButtonState();
}

class _PanelPillTabButtonState extends State<_PanelPillTabButton> {
  final FocusNode _focusNode = FocusNode();
  bool _hovered = false;

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    // 선택된 탭은 text-primary, 나머지는 text-secondary이고 hover에서 primary가 됩니다.
    final Color foreground = widget.selected || _hovered ? colors.textPrimary : colors.textSecondary;

    return Semantics(
      selected: widget.selected,
      button: true,
      child: FocusableActionDetector(
        focusNode: _focusNode,
        mouseCursor: SystemMouseCursors.click,
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onTap();
              return null;
            },
          ),
        },
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () {
            _focusNode.requestFocus();
            widget.onTap();
          },
          child: AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration, // motion-colors
            curve: HoronMotion.colorsCurve,
            height: space.step(7), // h-7 = 28
            padding: EdgeInsets.symmetric(horizontal: space.s3), // px-3 = 12
            decoration: BoxDecoration(
              // 선택 표시자입니다. React는 미끄러지는 span으로 그립니다.
              color: widget.selected ? colors.overlayInk10 : Colors.transparent,
              borderRadius: BorderRadius.circular(theme.radius.full),
            ),
            child: Text(
              widget.label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.text.labelMd.copyWith(color: foreground), // text-label-md
            ),
          ),
        ),
      ),
    );
  }
}

/// 지시문 한 줄의 한 조각입니다. 글자이거나 `{{변수}}` 칩입니다.
///
/// React의 `InstructionPart`는 `string | { variable, tone? }`입니다. Dart에는 두 모양을
/// 담는 값 객체 하나로 옮겼습니다.
class HoronInstructionPart {
  /// 글자 조각을 만듭니다.
  const HoronInstructionPart.text(this.text) : variable = null, tone = HoronInstructionVariableTone.sky;

  /// `{{변수}}` 칩 조각을 만듭니다.
  const HoronInstructionPart.variable(this.variable, {this.tone = HoronInstructionVariableTone.sky}) : text = null;

  /// 글자 조각이면 그 문구이고, 변수 조각이면 null입니다.
  final String? text;

  /// 변수 조각이면 변수 이름이고, 글자 조각이면 null입니다.
  final String? variable;

  /// 변수 칩의 색입니다. 글자 조각에서는 쓰이지 않습니다.
  final HoronInstructionVariableTone tone;
}

/// 지시문 아래 변수 시험 값 한 칸입니다.
class HoronInstructionVariable {
  /// 시험 값을 만듭니다.
  const HoronInstructionVariable({
    required this.name,
    required this.value,
    this.tone = HoronInstructionVariableTone.sky,
  });

  /// 변수 이름입니다. `{{이름}}`과 같은 이름을 씁니다.
  final String name;

  /// 시험 값입니다.
  final String value;

  /// 이름 옆 점의 색입니다.
  final HoronInstructionVariableTone tone;
}

/// 패널 머리말에 보이는 봇입니다.
class HoronBotSummary {
  /// 봇을 만듭니다.
  const HoronBotSummary({required this.initial, required this.name});

  /// 한 글자 머리글자입니다.
  final String initial;

  /// 봇 이름입니다.
  final String name;
}

/// Figma `BotInstructionsPanel`(Paper `YN3-1` / `GOZ-0`)입니다.
///
/// 24px 반경 표면에 봇 머리말, Instructions / Example 탭, `{{변수}}` 칩이 섞인 지시문,
/// 그리고 시험 실행 블록을 담습니다. React의 세 버튼(버전 알약, 봇 알약, Run)은 실제
/// 콜백이 있는 자리이므로 [onVersionTap]·[onBotTap]·[onRun]으로 받습니다. 콜백이 없으면
/// 같은 모양을 그대로 두고 눌림만 없앱니다.
class HoronBotInstructionsPanel extends StatefulWidget {
  /// 패널을 만듭니다.
  const HoronBotInstructionsPanel({
    super.key,
    this.title = 'Instructions',
    this.version,
    this.versionStatus,
    required this.bot,
    required this.instructions,
    this.example,
    this.tokenCount,
    this.variables,
    this.scenarios,
    this.defaultScenario,
    this.onRun,
    this.output,
    this.onVersionTap,
    this.onBotTap,
  });

  /// 머리말 제목입니다.
  final String title;

  /// 버전 알약에 보이는 값입니다. 예를 들어 `v4`입니다. 없으면 알약을 그리지 않습니다.
  final String? version;

  /// 버전 옆 상태 문구입니다. 앞에 하늘색 점이 붙습니다.
  final String? versionStatus;

  /// 머리말 봇입니다.
  final HoronBotSummary bot;

  /// 지시문입니다. 한 줄이 조각 목록 하나입니다.
  final List<List<HoronInstructionPart>> instructions;

  /// Example 탭에 보일 내용입니다.
  final Widget? example;

  /// 지시문 오른쪽의 토큰 수입니다. 없으면 숫자를 그리지 않습니다.
  final int? tokenCount;

  /// 변수 시험 값입니다.
  final List<HoronInstructionVariable>? variables;

  /// 시나리오 탭의 이름들입니다.
  final List<String>? scenarios;

  /// 처음 선택된 시나리오입니다. 없으면 첫 시나리오입니다.
  final String? defaultScenario;

  /// Run을 눌렀을 때 고른 시나리오를 넘깁니다.
  final ValueChanged<String?>? onRun;

  /// 마지막 실행의 출력입니다.
  final Widget? output;

  /// 버전 알약을 눌렀을 때 부릅니다.
  final VoidCallback? onVersionTap;

  /// 봇 알약을 눌렀을 때 부릅니다.
  final VoidCallback? onBotTap;

  @override
  State<HoronBotInstructionsPanel> createState() => _HoronBotInstructionsPanelState();
}

class _HoronBotInstructionsPanelState extends State<HoronBotInstructionsPanel> {
  String _tab = 'instructions';
  late String? _scenario =
      widget.defaultScenario ??
      (widget.scenarios == null || widget.scenarios!.isEmpty ? null : widget.scenarios!.first);

  void _run() => widget.onRun?.call(_scenario);

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(_panelRadius);
    final bool showVariables = widget.variables != null || widget.scenarios != null;

    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: space.step(155)), // max-w-155 = 620
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.bgSurface, // bg-bg-surface
          borderRadius: radius,
          border: Border.all(color: colors.borderDefault), // border-border-default
        ),
        child: ClipRRect(
          borderRadius: radius, // overflow-clip
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              _header(theme, space, colors),
              const _PanelDivider(),
              _body(theme, space, colors),
              if (showVariables) ...<Widget>[const _PanelDivider(), _testBlock(theme, space, colors)],
              if (widget.output != null)
                Container(
                  width: double.infinity,
                  color: colors.overlayInk3, // bg-overlay-ink-3
                  padding: EdgeInsets.fromLTRB(
                    space.step(4.5), // pl-4.5 = 18
                    space.s3_5, // pt-3.5 = 14
                    space.step(4.5), // pr-4.5 = 18
                    space.s4, // pb-4 = 16
                  ),
                  child: DefaultTextStyle.merge(
                    style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                    child: widget.output!,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  /// `header` — `gap-2 pt-3.5 pr-3.5 pb-3 pl-4.5`입니다.
  Widget _header(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    final Widget title = Text(
      widget.title,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: theme.text.labelLg.copyWith(color: colors.textPrimary), // h3 text-label-lg
    );
    final Widget? version = widget.version == null ? null : _versionPill(theme, space, colors);
    final Widget bot = _botPill(theme, space, colors);

    return Padding(
      padding: EdgeInsets.fromLTRB(space.step(4.5), space.s3_5, space.s3_5, space.s3),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          // React는 한 줄 고정입니다. 400px 아래에서는 제목·버전 알약·봇 알약을 줄바꿈해
          // 좁은 화면에서도 넘치지 않게 합니다.
          if (constraints.maxWidth < space.step(100)) {
            return Wrap(
              spacing: space.s2,
              runSpacing: space.s2,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[title, ?version, bot],
            );
          }
          return Row(
            children: <Widget>[
              Expanded(
                child: Row(
                  children: <Widget>[
                    Flexible(child: title),
                    if (version != null) ...<Widget>[SizedBox(width: space.s2), version],
                  ],
                ),
              ),
              SizedBox(width: space.s2),
              bot,
            ],
          );
        },
      ),
    );
  }

  /// 버전 알약 — `h-7 gap-1.5 rounded-full bg-overlay-ink-5 px-2.5 text-label-sm`입니다.
  Widget _versionPill(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    final String version = widget.version!;
    final String? status = widget.versionStatus;
    return _PressSurface(
      onTap: widget.onVersionTap,
      radius: theme.radius.full,
      height: space.step(7), // h-7 = 28
      padding: EdgeInsets.symmetric(horizontal: space.s2_5), // px-2.5 = 10
      color: colors.overlayInk5,
      hoverColor: colors.overlayInk8,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.s1_5, // gap-1.5 = 6
        children: <Widget>[
          Text(version, maxLines: 1, style: theme.text.labelSm.copyWith(color: colors.textPrimary)),
          if (status != null) ...<Widget>[
            Container(
              width: space.s1_5, // size-1.5 = 6
              height: space.s1_5,
              decoration: BoxDecoration(color: HoronPalette.sky500, shape: BoxShape.circle), // bg-sky-500
            ),
            Text(status, maxLines: 1, style: theme.text.labelSm.copyWith(color: colors.textSecondary)),
          ],
          Icon(Icons.expand_more, size: _caretSize, color: colors.textSecondary), // CaretDown size-3
        ],
      ),
    );
  }

  /// 봇 알약 — `h-7 gap-1.5 rounded-full bg-overlay-ink-5 pr-2.5 pl-1.5`입니다.
  Widget _botPill(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: space.step(45)), // 이름이 길어도 머리말을 넘지 않습니다.
      child: _PressSurface(
        onTap: widget.onBotTap,
        radius: theme.radius.full,
        height: space.step(7),
        padding: EdgeInsets.only(left: space.s1_5, right: space.s2_5),
        color: colors.overlayInk5,
        hoverColor: colors.overlayInk8,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: space.s1_5,
          children: <Widget>[
            Container(
              width: space.step(4.5), // size-4.5 = 18
              height: space.step(4.5),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: colors.interactivePrimary, // bg-interactive-primary
                borderRadius: BorderRadius.circular(_botAvatarRadius), // rounded-[5px]
              ),
              child: Text(widget.bot.initial, style: theme.text.labelSm.copyWith(color: colors.textInverse)),
            ),
            Flexible(
              child: Text(
                widget.bot.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.text.labelSm.copyWith(color: colors.textPrimary),
              ),
            ),
            Icon(Icons.expand_more, size: _caretSize, color: colors.textSecondary),
          ],
        ),
      ),
    );
  }

  /// `gap-1 pt-3 pr-4.5 pb-3.5 pl-4.5` — 탭 줄, 지시문, 변수 안내입니다.
  Widget _body(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    final bool showExample = _tab == 'example' && widget.example != null;
    return Padding(
      padding: EdgeInsets.fromLTRB(space.step(4.5), space.s3, space.step(4.5), space.step(3.5)),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: EdgeInsets.only(bottom: space.s2), // pb-2 = 8
            child: Row(
              children: <Widget>[
                Flexible(
                  child: HoronPanelPillTabs(
                    semanticLabel: 'Instructions view',
                    items: const <HoronPanelPillTab>[
                      HoronPanelPillTab(value: 'instructions', label: 'Instructions'),
                      HoronPanelPillTab(value: 'example', label: 'Example'),
                    ],
                    value: _tab,
                    onValueChange: (String next) => setState(() => _tab = next),
                  ),
                ),
                if (widget.tokenCount != null) ...<Widget>[
                  SizedBox(width: space.s2),
                  Text(
                    '${widget.tokenCount} tokens',
                    maxLines: 1,
                    style: theme.text.caption.copyWith(color: colors.textSecondary), // text-caption
                  ),
                ],
              ],
            ),
          ),
          if (showExample)
            SizedBox(
              width: double.infinity,
              child: DefaultTextStyle.merge(
                style: theme.text.bodySm.copyWith(color: colors.textPrimary), // text-body-sm
                child: widget.example!,
              ),
            )
          else
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: space.s1, // gap-1 = 4
              children: <Widget>[
                for (final List<HoronInstructionPart> line in widget.instructions)
                  _instructionLine(theme, space, colors, line),
              ],
            ),
          Padding(
            padding: EdgeInsets.only(top: space.s2), // pt-2 = 8
            child: Wrap(
              spacing: space.s1_5,
              runSpacing: space.s1_5,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                Text('Type', style: theme.text.caption.copyWith(color: colors.textSecondary)),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: space.s1_5, vertical: space.step(0.25)), // px-1.5 py-px
                  decoration: BoxDecoration(
                    color: colors.overlayInk6,
                    borderRadius: BorderRadius.circular(theme.radius.md),
                  ),
                  child: Text('{{', style: theme.text.caption.copyWith(color: colors.textSecondary)),
                ),
                Text('to add a variable', style: theme.text.caption.copyWith(color: colors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 지시문 한 줄 — `flex flex-wrap items-center gap-1 text-body-sm`입니다.
  Widget _instructionLine(
    HoronThemeData theme,
    HoronSpaceSpec space,
    HoronColors colors,
    List<HoronInstructionPart> line,
  ) {
    return Wrap(
      spacing: space.s1,
      runSpacing: space.s1,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        for (final HoronInstructionPart part in line)
          if (part.text != null)
            Text(part.text!, style: theme.text.bodySm.copyWith(color: colors.textPrimary))
          else
            _VariableChip(label: part.variable!, tone: part.tone),
      ],
    );
  }

  /// `variables`·`scenarios` 블록입니다.
  Widget _testBlock(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    final List<HoronInstructionVariable>? variables = widget.variables;
    final List<String>? scenarios = widget.scenarios;
    return Padding(
      padding: EdgeInsets.fromLTRB(space.step(4.5), space.s3, space.step(4.5), space.step(3.5)),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          if (variables != null) ...<Widget>[
            _variables(theme, space, colors, variables),
            SizedBox(height: space.s2_5), // gap-2.5 = 10
          ],
          Row(
            mainAxisAlignment: scenarios == null ? MainAxisAlignment.end : MainAxisAlignment.spaceBetween,
            children: <Widget>[
              if (scenarios != null)
                Flexible(
                  child: HoronPanelPillTabs(
                    semanticLabel: 'Scenario',
                    items: <HoronPanelPillTab>[
                      for (final String name in scenarios) HoronPanelPillTab(value: name, label: name),
                    ],
                    value: _scenario,
                    onValueChange: (String next) => setState(() => _scenario = next),
                  ),
                ),
              if (scenarios != null) SizedBox(width: space.s2),
              _runButton(theme, space, colors),
            ],
          ),
        ],
      ),
    );
  }

  /// `variables` — `flex flex-wrap gap-2`이고 칸마다 최소 140px입니다.
  Widget _variables(
    HoronThemeData theme,
    HoronSpaceSpec space,
    HoronColors colors,
    List<HoronInstructionVariable> variables,
  ) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // flex-1 칸이 `min-w-35`를 지키며 한 줄을 채우도록 열 수를 정합니다.
        final int perRow = (constraints.maxWidth / (_variableMinWidth + space.s2)).floor().clamp(1, 4);
        final double width = (constraints.maxWidth - space.s2 * (perRow - 1)) / perRow;
        return Wrap(
          spacing: space.s2, // gap-2 = 8
          runSpacing: space.s2,
          children: <Widget>[
            for (final HoronInstructionVariable variable in variables)
              SizedBox(width: width, child: _variable(theme, space, colors, variable)),
          ],
        );
      },
    );
  }

  /// 변수 한 칸 — 이름 점·이름 줄과 값 상자(`h-9.5 rounded-xl`)입니다.
  Widget _variable(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors, HoronInstructionVariable variable) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          children: <Widget>[
            Container(
              width: space.s1_5, // size-1.5 = 6
              height: space.s1_5,
              decoration: BoxDecoration(color: _dotColor(variable.tone), shape: BoxShape.circle),
            ),
            SizedBox(width: space.s1_5),
            Flexible(
              child: Text(
                variable.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.text.caption.copyWith(color: colors.textSecondary),
              ),
            ),
          ],
        ),
        SizedBox(height: space.s1_5), // gap-1.5 = 6
        Container(
          height: space.step(9.5), // h-9.5 = 38
          padding: EdgeInsets.symmetric(horizontal: space.s3), // px-3 = 12
          alignment: Alignment.centerLeft,
          decoration: BoxDecoration(
            color: colors.overlayInk5, // bg-overlay-ink-5
            borderRadius: BorderRadius.circular(theme.radius.xl), // rounded-xl = 20
          ),
          child: Text(
            variable.value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: theme.text.bodySm.copyWith(color: colors.textPrimary),
          ),
        ),
      ],
    );
  }

  /// Run — `h-8 gap-1.5 rounded-full bg-interactive-primary pr-3.5 pl-3 text-label-sm`입니다.
  Widget _runButton(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    return _PressSurface(
      onTap: _run,
      radius: theme.radius.full,
      height: space.step(8), // h-8 = 32
      padding: EdgeInsets.only(left: space.s3, right: space.step(3.5)), // pl-3 pr-3.5
      color: colors.interactivePrimary,
      hoverColor: colors.interactivePrimaryHover,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.s1_5,
        children: <Widget>[
          Icon(Icons.play_arrow, size: _runIconSize, color: colors.textInverse), // Play size-3.5
          Text('Run', maxLines: 1, style: theme.text.labelSm.copyWith(color: colors.textInverse)),
          Container(
            padding: EdgeInsets.symmetric(horizontal: space.s1_5, vertical: space.step(0.25)),
            decoration: BoxDecoration(color: colors.overlayInk6, borderRadius: BorderRadius.circular(theme.radius.md)),
            child: Text('⌘↵', maxLines: 1, style: theme.text.caption.copyWith(color: colors.textSecondary)),
          ),
        ],
      ),
    );
  }

  /// 변수 이름 옆 점의 색입니다(`variableDotClass`).
  Color _dotColor(HoronInstructionVariableTone tone) => switch (tone) {
    HoronInstructionVariableTone.sky => HoronPalette.sky500, // bg-sky-500
    HoronInstructionVariableTone.brand => HoronPalette.sky700, // bg-sky-700
    HoronInstructionVariableTone.neutral => HoronPalette.neutral500, // bg-neutral-500
  };
}

/// `VariableChip` — `rounded-xs px-1.5 py-px`에 톤별 바탕색입니다.
class _VariableChip extends StatelessWidget {
  const _VariableChip({required this.label, required this.tone});

  final String label;
  final HoronInstructionVariableTone tone;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final Color background = switch (tone) {
      HoronInstructionVariableTone.sky => theme.colors.accentSky500_18, // bg-accent-sky-500-18
      HoronInstructionVariableTone.brand => theme.colors.accentSky700_18, // bg-accent-sky-700-18
      HoronInstructionVariableTone.neutral => theme.colors.textPlaceholder18, // bg-text-placeholder-18
    };
    return Container(
      padding: EdgeInsets.symmetric(horizontal: space.s1_5, vertical: space.step(0.25)), // px-1.5 py-px
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(theme.radius.xs), // rounded-xs
      ),
      child: Text(label, style: theme.text.bodySm.copyWith(color: theme.colors.textPrimary)),
    );
  }
}

/// `Divider` — `h-px self-stretch bg-overlay-ink-8`입니다.
class _PanelDivider extends StatelessWidget {
  const _PanelDivider();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: _hairline,
      child: ColoredBox(color: HoronTheme.of(context).colors.overlayInk8),
    );
  }
}

/// `motion-press`·`motion-colors`와 `focus-visible:outline-2`를 쓰는 알약 버튼입니다.
class _PressSurface extends StatefulWidget {
  const _PressSurface({
    required this.child,
    required this.radius,
    this.onTap,
    this.color,
    this.hoverColor,
    this.height,
    this.padding,
  });

  final Widget child;
  final double radius;
  final VoidCallback? onTap;
  final Color? color;
  final Color? hoverColor;
  final double? height;
  final EdgeInsetsGeometry? padding;

  @override
  State<_PressSurface> createState() => _PressSurfaceState();
}

class _PressSurfaceState extends State<_PressSurface> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.onTap != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Color rest = widget.color ?? Colors.transparent;
    final Color surfaceColor = _hovered && widget.hoverColor != null ? widget.hoverColor! : rest;

    return AnimatedScale(
      scale: _pressed && interactive ? HoronMotion.pressScale : 1, // motion-press scale .97
      duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
      curve: HoronMotion.pressCurve,
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
          onTap: interactive ? widget.onTap : null,
          onTapDown: (TapDownDetails details) {
            if (interactive) setState(() => _pressed = true);
          },
          onTapUp: (TapUpDetails details) {
            if (_pressed) setState(() => _pressed = false);
          },
          onTapCancel: () {
            if (_pressed) setState(() => _pressed = false);
          },
          child: _FocusRing(
            visible: _focused && interactive,
            radius: widget.radius,
            gap: space.s0_5,
            width: space.s0_5,
            color: theme.colors.textBrand,
            child: AnimatedContainer(
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              height: widget.height,
              padding: widget.padding,
              decoration: BoxDecoration(color: surfaceColor, borderRadius: BorderRadius.circular(widget.radius)),
              child: widget.child,
            ),
          ),
        ),
      ),
    );
  }
}

/// `focus-visible:outline-2 outline-offset-2 outline-text-brand`입니다.
class _FocusRing extends StatelessWidget {
  const _FocusRing({
    required this.visible,
    required this.radius,
    required this.gap,
    required this.width,
    required this.color,
    required this.child,
  });

  final bool visible;
  final double radius;
  final double gap;
  final double width;
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (!visible) return child;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -gap,
          top: -gap,
          right: -gap,
          bottom: -gap,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(radius + gap),
                border: Border.all(color: color, width: width),
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
