import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';
import 'spinner.dart';

/// `tool-call.tsx`의 `ToolCallStatus`입니다.
enum HoronToolCallStatus {
  /// `status="running"` — 머리에 스피너가 돌고 결과 자리에 기다리는 문구가 놓입니다.
  running,

  /// `status="done"` — 머리에 하늘색 체크가 놓입니다.
  done,

  /// `status="failed"` — 테두리가 위험색이 되고 결과 자리에 오류 상자가 놓입니다.
  failed,
}

/// `tool-call.tsx`의 `[&>svg]:size-4`입니다. 도구 칩 아이콘·상태 아이콘·캐럿 16px.
const double _iconSize = 16;

/// `tool-call.tsx`의 `size-3.5`입니다. 복사 아이콘과 재시도 아이콘 14px.
const double _smallIconSize = 14;

/// `tool-call.tsx`의 `py-[3px]`입니다. 도구 칩의 위아래 여백입니다.
const double _chipPaddingY = 3;

/// `tool-call.tsx`의 `rounded-[10px]`입니다. 오류 상자와 섹션 본문의 반경입니다.
const double _boxRadius = 10;

/// `tool-call.tsx`의 `Failed`입니다.
const String _failedLabel = 'Failed';

/// `tool-call.tsx`의 `Waiting for result…`입니다.
const String _waitingLabel = 'Waiting for result…';

/// `tool-call.tsx`의 `Arguments`입니다.
const String _argumentsLabel = 'Arguments';

/// `tool-call.tsx`의 `Result`입니다.
const String _resultLabel = 'Result';

/// `tool-call.tsx`의 `Show all`입니다.
const String _showAllLabel = 'Show all';

/// Figma `Tool call`(Tool call card 186:7811): 불투명 카드가 인자와 결과로 펼쳐집니다.
///
/// `tool-call.tsx`를 옮긴 것입니다. 머리에 도구 칩·요약·상태·경과 시간·캐럿이 한 줄로
/// 놓이고, 누르면 아래 패널이 React의 `motion-collapse`(240ms)로 열립니다. 실패 상태는
/// 테두리가 위험색이 되고 오류 상자와 재시도 버튼이 붙습니다.
class HoronToolCall extends StatefulWidget {
  /// 도구 호출 카드를 만듭니다.
  const HoronToolCall({
    super.key,
    required this.status,
    required this.toolName,
    required this.summary,
    this.toolIcon,
    this.elapsed,
    this.args,
    this.result,
    this.error,
    this.onRetry,
    this.truncated = false,
    this.onShowAll,
    this.initiallyOpen = false,
  });

  /// 호출 상태입니다.
  final HoronToolCallStatus status;

  /// 도구 이름입니다. 예: `Web search`.
  final String toolName;

  /// 한 줄 요약입니다. 폭이 모자라면 말줄임됩니다.
  final String summary;

  /// 도구 이름 앞 아이콘입니다. 크기와 색은 이 위젯이 정합니다.
  final Widget? toolIcon;

  /// 오른쪽 경과 시간입니다. 예: `1.2s`.
  final String? elapsed;

  /// 인자입니다. null이면 인자 섹션을 그리지 않습니다(React의 `args === undefined`).
  ///
  /// 최상위 JSON `null`은 React의 `undefined`와 구분되지 않으므로 인자를 감춥니다.
  /// 중첩된 `null`은 그대로 `null`로 그려집니다.
  final Object? args;

  /// 결과입니다. null이면 결과 자리에 기다리는 문구가 놓입니다.
  final Object? result;

  /// 실패 사유입니다. 실패 상태에서만 보입니다.
  final String? error;

  /// 재시도를 눌렀을 때입니다. 실패 상태에서만 보입니다.
  final VoidCallback? onRetry;

  /// 결과가 잘렸습니다. 결과 아래에 `Show all` 링크를 놓습니다.
  final bool truncated;

  /// `Show all`을 눌렀을 때입니다.
  final VoidCallback? onShowAll;

  /// 처음 열림 상태입니다. React의 `defaultOpen`입니다.
  final bool initiallyOpen;

  @override
  State<HoronToolCall> createState() => _HoronToolCallState();
}

class _HoronToolCallState extends State<HoronToolCall> {
  late bool _open = widget.initiallyOpen;
  bool _hovered = false;

  void _toggle() => setState(() => _open = !_open);

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool failed = widget.status == HoronToolCallStatus.failed;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Container(
      // rounded-2xl border bg-bg-surface, 실패만 border-border-danger
      decoration: BoxDecoration(
        color: colors.bgSurface,
        borderRadius: BorderRadius.circular(theme.radius.xl2),
        border: Border.all(color: failed ? colors.borderDanger : colors.borderDefault),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          _trigger(theme),
          AnimatedSize(
            duration: reduceMotion ? Duration.zero : HoronMotion.collapseDuration,
            curve: HoronMotion.collapseCurve,
            alignment: Alignment.topCenter,
            child: _open ? _panel(theme) : const SizedBox(width: double.infinity),
          ),
        ],
      ),
    );
  }

  Widget _trigger(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      expanded: _open,
      child: MouseRegion(
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: _toggle,
          child: AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            // `px-4 py-3.5 hover:bg-overlay-ink-3`.
            color: _hovered ? colors.overlayInk3 : Colors.transparent,
            padding: EdgeInsets.symmetric(horizontal: space.s4, vertical: space.s3_5),
            child: Row(
              spacing: space.s2_5, // gap-2.5 = 10
              children: <Widget>[
                Flexible(child: _toolChip(theme)),
                Expanded(
                  child: Text(
                    widget.summary,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis, // truncate
                    style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                  ),
                ),
                // `flex size-4` — 상태 아이콘 자리. 상태가 바뀌면 팝으로 갈아 끼웁니다.
                SizedBox(
                  width: _iconSize,
                  height: _iconSize,
                  child: Center(
                    child: KeyedSubtree(
                      key: ValueKey<HoronToolCallStatus>(widget.status),
                      child: _PopIn(child: _statusIcon(theme)),
                    ),
                  ),
                ),
                if (widget.status == HoronToolCallStatus.failed)
                  Text(_failedLabel, maxLines: 1, style: theme.text.labelSm.copyWith(color: colors.textDanger)),
                if (widget.elapsed != null)
                  Text(widget.elapsed!, maxLines: 1, style: theme.text.caption.copyWith(color: colors.textSecondary)),
                AnimatedRotation(
                  // group-data-panel-open:rotate-180, duration-200 ease-out-quint
                  turns: _open ? 0.5 : 0,
                  duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
                  curve: HoronMotion.easeOutQuint,
                  child: Icon(Icons.expand_more, size: _iconSize, color: colors.textSecondary),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _toolChip(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      // py-[3px] pr-2.5 pl-2 rounded-full bg-overlay-ink-6
      padding: EdgeInsets.fromLTRB(space.s2, _chipPaddingY, space.s2_5, _chipPaddingY),
      decoration: BoxDecoration(color: colors.overlayInk6, borderRadius: BorderRadius.circular(theme.radius.full)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.s1_5, // gap-1.5 = 6
        children: <Widget>[
          if (widget.toolIcon != null)
            IconTheme.merge(
              data: IconThemeData(size: _iconSize, color: colors.textSecondary),
              child: widget.toolIcon!,
            ),
          Flexible(
            child: Text(
              widget.toolName,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.text.labelMd.copyWith(color: colors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statusIcon(HoronThemeData theme) {
    return switch (widget.status) {
      HoronToolCallStatus.running => const HoronSpinner(), // size="sm" = 16
      HoronToolCallStatus.done => Icon(Icons.check_circle, size: _iconSize, color: theme.colors.statusLive),
      HoronToolCallStatus.failed => Icon(Icons.error_outline, size: _iconSize, color: theme.colors.textDanger),
    };
  }

  Widget _panel(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool failed = widget.status == HoronToolCallStatus.failed;
    final bool waiting = widget.status == HoronToolCallStatus.running || widget.result == null;

    return Padding(
      // px-4 pb-4
      padding: EdgeInsets.fromLTRB(space.s4, 0, space.s4, space.s4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: space.s3_5, // gap-3.5 = 14
        children: <Widget>[
          if (failed && widget.error != null) _errorBox(theme),
          if (widget.args != null)
            _Section(
              label: _argumentsLabel,
              copyText: const JsonEncoder.withIndent('  ').convert(widget.args),
              child: HoronJsonCode(value: widget.args),
            ),
          if (!failed)
            _Section(
              label: _resultLabel,
              // 결과가 아직 없으면 React처럼 복사 버튼을 그리지 않습니다.
              copyText: waiting
                  ? null
                  : widget.result is String
                  ? widget.result! as String
                  : const JsonEncoder.withIndent('  ').convert(widget.result),
              // `Show all`은 결과 섹션의 footer 슬롯으로 내려갑니다.
              footer: widget.truncated && !waiting
                  ? Align(
                      alignment: Alignment.centerLeft,
                      child: HoronButton(
                        variant: HoronButtonVariant.link,
                        label: _showAllLabel,
                        onPressed: widget.onShowAll,
                      ),
                    )
                  : null,
              child: waiting
                  ? Text(_waitingLabel, style: theme.text.bodySm.copyWith(color: colors.textSecondary))
                  : HoronJsonCode(value: widget.result),
            ),
        ],
      ),
    );
  }

  Widget _errorBox(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      // rounded-[10px] bg-bg-danger px-3.5 py-3
      padding: EdgeInsets.fromLTRB(space.s3_5, space.s3, space.s3_5, space.s3),
      decoration: BoxDecoration(color: colors.bgDanger, borderRadius: BorderRadius.circular(_boxRadius)),
      child: Row(
        spacing: space.s2_5, // gap-2.5 = 10
        children: <Widget>[
          Icon(Icons.error_outline, size: _iconSize, color: colors.textDanger),
          Expanded(
            child: Text(widget.error!, style: theme.text.bodySm.copyWith(color: colors.textDanger)),
          ),
          if (widget.onRetry != null) _retryButton(theme),
        ],
      ),
    );
  }

  Widget _retryButton(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return TextButton.icon(
      onPressed: widget.onRetry,
      style: TextButton.styleFrom(
        // h-7.5 rounded-full px-2.5 border-border-default bg-bg-surface
        padding: EdgeInsets.symmetric(horizontal: space.s2_5),
        minimumSize: const Size(0, 30),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        foregroundColor: colors.textPrimary,
        backgroundColor: colors.bgSurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(theme.radius.full),
          side: BorderSide(color: colors.borderDefault),
        ),
      ),
      icon: const Icon(Icons.refresh, size: _smallIconSize),
      label: Text(theme.strings.retry, style: theme.text.labelSm),
    );
  }
}

/// `tool-call.tsx`의 `Section`입니다. 라벨 줄, 본문 상자, footer 슬롯입니다.
///
/// `copyText`가 있으면 라벨 오른쪽에 실제 복사 버튼을 그립니다. 누르면 1.5초 동안
/// 체크 아이콘으로 바뀌었다가 되돌아옵니다(React의 `copied` 상태).
class _Section extends StatefulWidget {
  const _Section({required this.label, required this.child, this.copyText, this.footer});

  final String label;
  final Widget child;

  /// 복사할 본문의 평문입니다. 없으면 복사 버튼을 그리지 않습니다.
  final String? copyText;

  /// 본문 아래에 붙는 슬롯입니다. React의 `footer` prop입니다.
  final Widget? footer;

  @override
  State<_Section> createState() => _SectionState();
}

class _SectionState extends State<_Section> {
  bool _copied = false;
  Timer? _revert;

  @override
  void dispose() {
    _revert?.cancel();
    super.dispose();
  }

  Future<void> _copy() async {
    final String? text = widget.copyText;
    if (text == null) return;
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    setState(() => _copied = true);
    _revert?.cancel();
    _revert = Timer(const Duration(milliseconds: 1500), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: space.s1_5, // gap-1.5 = 6
      children: <Widget>[
        Row(
          spacing: space.s2, // gap-2 = 8
          children: <Widget>[
            Expanded(
              child: Text(
                widget.label.toUpperCase(), // uppercase
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.text.labelSm.copyWith(color: colors.textSecondary),
              ),
            ),
            if (widget.copyText != null) _CopyButton(label: widget.label, copied: _copied, onPressed: _copy),
          ],
        ),
        Container(
          // rounded-[10px] bg-bg-subtle px-3.5 py-3
          padding: EdgeInsets.fromLTRB(space.s3_5, space.s3, space.s3_5, space.s3),
          decoration: BoxDecoration(color: colors.bgSubtle, borderRadius: BorderRadius.circular(_boxRadius)),
          child: widget.child,
        ),
        ?widget.footer,
      ],
    );
  }
}

/// `Section` 라벨 줄의 복사 버튼입니다.
///
/// 복사 직후에는 `Copied`로 읽히고 1.5초 뒤 `Copy <label>`로 돌아옵니다.
class _CopyButton extends StatefulWidget {
  const _CopyButton({required this.label, required this.copied, required this.onPressed});

  final String label;
  final bool copied;
  final VoidCallback onPressed;

  @override
  State<_CopyButton> createState() => _CopyButtonState();
}

class _CopyButtonState extends State<_CopyButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final Color foreground = widget.copied
        ? colors.statusLive
        : _hovered
        ? colors.textPrimary
        : colors.textSecondary;

    return Semantics(
      button: true,
      label: widget.copied ? 'Copied' : 'Copy ${widget.label.toLowerCase()}',
      child: FocusableActionDetector(
        mouseCursor: SystemMouseCursors.click,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onPressed,
          child: Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              KeyedSubtree(
                key: ValueKey<bool>(widget.copied),
                child: _PopIn(
                  child: Icon(
                    widget.copied ? Icons.check : Icons.content_copy,
                    size: _smallIconSize,
                    color: foreground,
                  ),
                ),
              ),
              // `focus-visible:outline-2 outline-offset-2` — 레이아웃을 밀지 않는 2px 링.
              if (_focused)
                Positioned(
                  left: -space.s0_5,
                  top: -space.s0_5,
                  right: -space.s0_5,
                  bottom: -space.s0_5,
                  child: IgnorePointer(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        border: Border.all(color: colors.textBrand, width: space.s0_5),
                        borderRadius: BorderRadius.circular(theme.radius.xs),
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

/// `animate-pop-in` — 나타날 때 0.6에서 1로 커지며 들어옵니다.
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

/// `tool-call.tsx`의 `JsonCode`입니다. Geist Mono 코드 스타일과 구문 색으로 JSON을 그립니다.
///
/// React는 `pre`에 `overflow-x-auto`를 두지만, 이 패키지는 컨트롤을 가로로 스크롤하지
/// 않습니다. 그래서 `whitespace-pre-wrap`처럼 긴 줄이 접혀 다음 줄로 이어집니다.
class HoronJsonCode extends StatelessWidget {
  /// 값을 그리는 코드 블록을 만듭니다.
  const HoronJsonCode({super.key, required this.value});

  /// 그릴 값입니다. `Map<String, Object?>`, `List<Object?>`, 문자열, 숫자, 불리언, null.
  final Object? value;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final TextStyle base = theme.text.code.copyWith(color: theme.colors.syntaxString);

    return Text.rich(
      TextSpan(style: base, children: _jsonSpans(value, 0, theme.colors, base)),
      softWrap: true, // whitespace-pre-wrap
    );
  }
}

/// [value]를 `renderJson`과 같은 모양의 span 목록으로 만듭니다.
List<InlineSpan> _jsonSpans(Object? value, int indent, HoronColors colors, TextStyle base) {
  final TextStyle punctuation = base.copyWith(color: colors.syntaxPunctuation);

  if (value == null || value is num || value is bool) {
    final String text = value is double && value == value.truncateToDouble() ? value.toInt().toString() : '$value';
    return <InlineSpan>[
      TextSpan(
        text: text,
        style: base.copyWith(color: colors.syntaxNumber),
      ),
    ];
  }
  if (value is String) {
    return <InlineSpan>[TextSpan(text: jsonEncode(value))];
  }

  final List<(String?, Object?)> entries;
  final String open;
  final String close;
  if (value is Map) {
    entries = <(String?, Object?)>[
      for (final MapEntry<Object?, Object?> entry in value.entries) (entry.key.toString(), entry.value),
    ];
    open = '{';
    close = '}';
  } else if (value is List) {
    entries = <(String?, Object?)>[for (final Object? item in value) (null, item)];
    open = '[';
    close = ']';
  } else {
    return <InlineSpan>[TextSpan(text: jsonEncode(value.toString()))];
  }

  final String pad = '  ' * indent;
  return <InlineSpan>[
    TextSpan(text: open, style: punctuation),
    for (int index = 0; index < entries.length; index++) ...<InlineSpan>[
      TextSpan(text: '\n$pad  '),
      if (entries[index].$1 != null) ...<InlineSpan>[
        TextSpan(
          text: jsonEncode(entries[index].$1),
          style: base.copyWith(color: colors.syntaxKey),
        ),
        TextSpan(text: ':', style: punctuation),
        const TextSpan(text: ' '),
      ],
      ..._jsonSpans(entries[index].$2, indent + 1, colors, base),
      if (index < entries.length - 1) TextSpan(text: ',', style: punctuation),
    ],
    TextSpan(text: '\n$pad$close', style: punctuation),
  ];
}
